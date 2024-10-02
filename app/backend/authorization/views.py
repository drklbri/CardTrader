import logging

from django.contrib.auth import get_user_model
from django.shortcuts import render, get_object_or_404
from django.utils.encoding import force_str
from django.utils.http import urlsafe_base64_decode
from drf_yasg.utils import swagger_auto_schema
from rest_framework import permissions, generics
from rest_framework import status
from rest_framework.exceptions import NotFound
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt import authentication
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenRefreshView

from announcements.models import Announcement, Comments
from minio_backend import minio_config
from minio_backend.minio_config import get_image_url
from minio_backend.models import UserProfile
from .email_auth.account_activation import account_activation_token
from .email_auth.service import send_email_user
from .models import User
from .permissions import IsNotBlocked
from .serializers import (
    JWTRefreshSerializer,
    ResponseUserSerializer, RequestUserRegistrationSerializer, RequestUserAuthSerializer, AuthResponseSerializer,
    EmailSendSerializer, UserBlockSerializer
)
from .services import (
    UserService, AuthService
)

logger_bot = logging.getLogger(__name__)


class JWTRefreshView(TokenRefreshView):
    permission_classes = ()
    authentication_classes = ()
    serializer_class = JWTRefreshSerializer


class UserGetLoginView(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = (authentication.JWTAuthentication,)

    @swagger_auto_schema(
        operation_description="Get user profile by login",
        responses={200: "Profile data with avatar, announcements, and comment count"}
    )
    def get(self, request, login):
        user = get_object_or_404(User, username=login)
        try:
            user_profile = UserProfile.objects.get(user=user)
            avatar_url = get_image_url(user_profile.avatar.name) if user_profile.avatar else ""
        except UserProfile.DoesNotExist:
            avatar_url = ""

        announcements = Announcement.objects.filter(user=user)
        announcement_ids = announcements.values_list('id', flat=True)

        comment_count = Comments.objects.filter(announcement__in=announcement_ids).count()

        response_data = {
            "avatar_url": avatar_url,
            "announcement_ids": list(announcement_ids),
            "comment_count": comment_count
        }

        return Response(response_data, status=status.HTTP_200_OK)


class UserView(APIView):
    permission_classes = (permissions.IsAuthenticated, IsNotBlocked)
    authentication_classes = (authentication.JWTAuthentication,)

    @swagger_auto_schema(
        responses={200: ResponseUserSerializer(), 401: {}}
    )
    def get(self, request):
        request.auth.verify()
        user_id = request.auth.get("user_id")
        service = UserService(user_id=user_id)
        user = service.get_user(user_id)
        return Response(ResponseUserSerializer(user).data, status.HTTP_200_OK)

    @swagger_auto_schema(
        request_body=RequestUserRegistrationSerializer,
        responses={200: ResponseUserSerializer(), 401: {}}
    )
    def put(self, request):
        serializer = RequestUserRegistrationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user_id = request.auth.get("user_id")
        service = UserService(user_id)
        user = service.update_user(data=serializer.validated_data)
        data = ResponseUserSerializer(user).data
        return Response(data, status.HTTP_200_OK)

    @swagger_auto_schema(
        responses={204: 'User successfully deleted', }
    )
    def delete(self, request):
        user_id = request.auth.get("user_id")
        user = User.objects.get(id=user_id)
        user_profile = UserProfile.objects.get(user=user)
        if user_profile is not None:
            if user_profile.avatar is not None:
                minio_config.delete_image(user_profile.avatar.name, user_profile.upload_path)
        user.delete()
        return Response('User successfully deleted', status=status.HTTP_204_NO_CONTENT)


class UserBlockAPIView(generics.UpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserBlockSerializer
    permission_classes = [IsAdminUser]

    def get_object(self):
        username = self.kwargs['username']
        try:
            return User.objects.get(username=username)
        except User.DoesNotExist:
            raise NotFound("Пользователь не найден.")

    def perform_update(self, serializer):
        serializer.save()


class AuthUserView(APIView):
    permission_classes = [AllowAny]

    @swagger_auto_schema(
        request_body=RequestUserRegistrationSerializer,
        responses={
            200: 'Authenticated'},
    )
    def post(self, request, *args, **kwargs):
        serializer = RequestUserRegistrationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        service = AuthService(username=serializer.data['username'], email=serializer.data['email'],
                              password=serializer.data['password'])
        service.register()
        return Response('Successfully registered', status.HTTP_200_OK)


class EmailSendView(APIView):
    permission_classes = [AllowAny]

    @swagger_auto_schema(
        request_body=EmailSendSerializer,
        responses={200: 'Link successfully sent to email', 404: 'User not found'}
    )
    def post(self, request):
        serializer = EmailSendSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        to_email = serializer.data['email']
        User = get_user_model()
        user = User.objects.get(email=to_email)
        send_email_user(user)
        return Response({}, status.HTTP_200_OK)


class EmailApproveView(APIView):
    permission_classes = [AllowAny]

    def activate_user(self, uidb64, token):
        User = get_user_model()
        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            return None

        if user is not None and account_activation_token.check_token(user, token):
            user.is_active = True
            user.save()
            return user
        return None

    @swagger_auto_schema(
        responses={200: 'Account activated successfully', 400: 'Invalid activation link'}
    )
    def post(self, request, uidb64, token):
        user = self.activate_user(uidb64, token)
        if user:
            return Response({"detail": "Account activated successfully"}, status=status.HTTP_200_OK)
        else:
            return Response({"detail": "Invalid activation link"}, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request, uidb64, token):
        user = self.activate_user(uidb64, token)
        if user:
            return render(request, 'email_approved.html', status=status.HTTP_200_OK)
        else:
            return render(request, 'email_approve_exception.html', status=status.HTTP_400_BAD_REQUEST)


class LoginUserView(APIView):
    permission_classes = [AllowAny]

    @swagger_auto_schema(
        request_body=RequestUserAuthSerializer,
        responses={
            status.HTTP_200_OK: {},
            status.HTTP_401_UNAUTHORIZED: 'Invalid credentials'
        },
    )
    def post(self, request, *args, **kwargs):
        serializer = RequestUserAuthSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        service = AuthService(email=serializer.data['email'], password=serializer.data['password'])
        user = service.auth()
        data = AuthResponseSerializer(user).data
        return Response(data, status.HTTP_200_OK)


class LogoutUserView(APIView):
    permission_classes = [IsAuthenticated, IsNotBlocked]

    @swagger_auto_schema(
        responses={
            status.HTTP_200_OK: {},
            status.HTTP_401_UNAUTHORIZED: 'Invalid credentials'
        },
    )
    def post(self, request, *args, **kwargs):
        token = RefreshToken(request.user.access_token)
        token.blacklist()
        token = RefreshToken(request.user.refresh_token)
        token.blacklist()
        request.user.access_token = None
        request.user.refresh_token = None
        request.user.save()
        return Response({"detail": "Logout successful"}, status=status.HTTP_200_OK)

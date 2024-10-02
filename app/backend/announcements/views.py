from django.shortcuts import render, get_object_or_404
from django_filters.rest_framework import DjangoFilterBackend
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework import generics, mixins, permissions, status
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAdminUser, IsAuthenticated, AllowAny
from rest_framework.response import Response

from authorization.permissions import IsNotBlocked
from .filters import AnnouncementFilter
from .models import Announcement, Comments
from .serializers import AnnouncementSerializer, CommentsSerializer


# Create your views here.
class AnnouncementPagination(PageNumberPagination):
    page_size = 18
    page_size_query_param = 'page_size'
    max_page_size = 18


class AnnouncementListAPIView(generics.ListAPIView):
    serializer_class = AnnouncementSerializer
    pagination_class = AnnouncementPagination
    filter_backends = [DjangoFilterBackend]
    filterset_class = AnnouncementFilter
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = Announcement.objects.all().order_by('-id')
        return queryset


class AnnouncementAPIView(generics.GenericAPIView,
                          mixins.ListModelMixin,
                          mixins.CreateModelMixin):
    queryset = Announcement.objects.all()
    serializer_class = AnnouncementSerializer

    def get_permissions(self):
        method = self.request.method
        if method == 'GET':
            return [AllowAny()]
        else:
            return [IsAuthenticated(), IsNotBlocked()]

    @swagger_auto_schema(
        operation_description="Get all announcements",
        responses={200: AnnouncementSerializer(many=True)}
    )
    def get(self, request):
        return self.list(request)

    @swagger_auto_schema(
        operation_description="Create a new announcement",
        request_body=AnnouncementSerializer,
        responses={201: "Announcement created successfully"}
    )
    def post(self, request):
        serializer = self.get_serializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(status=status.HTTP_201_CREATED)


class LatestAnnouncementsAPIView(generics.GenericAPIView, mixins.ListModelMixin):
    serializer_class = AnnouncementSerializer

    def get_permissions(self):
        return [AllowAny()]

    @swagger_auto_schema(
        operation_description="Get the latest N announcements",
        responses={200: AnnouncementSerializer(many=True)},
        manual_parameters=[
            openapi.Parameter('limit', openapi.IN_QUERY, description="Number of announcements",
                              type=openapi.TYPE_INTEGER)
        ]
    )
    def get(self, request):
        limit = request.query_params.get('limit', 10)
        queryset = Announcement.objects.all().order_by('-id')[:int(limit)]
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class AnnouncementDetailAPIView(generics.GenericAPIView,
                                mixins.RetrieveModelMixin,
                                mixins.UpdateModelMixin,
                                mixins.DestroyModelMixin):
    queryset = Announcement.objects.all()
    serializer_class = AnnouncementSerializer

    def get_permissions(self):
        method = self.request.method
        if method == 'GET':
            return [AllowAny()]
        else:
            return [IsAuthenticated(), IsNotBlocked()]

    def check_user_permission(self, request, announcement):
        if request.user.role == 'admin':
            return None

        if request.user != announcement.user:
            return Response({'error': 'You do not have permission to modify or delete this announcement.'},
                            status=status.HTTP_403_FORBIDDEN)
        return None

    @swagger_auto_schema(
        operation_description="Get an announcement by ID",
        responses={200: AnnouncementSerializer()}
    )
    def get(self, request, pk):
        return self.retrieve(request, pk=pk)

    @swagger_auto_schema(
        operation_description="Update an announcement",
        request_body=AnnouncementSerializer,
        responses={200: AnnouncementSerializer()}
    )
    def put(self, request, pk):
        announcement = get_object_or_404(Announcement, id=pk)
        permission_check = self.check_user_permission(request, announcement)
        if permission_check:
            return permission_check
        return self.update(request, pk=pk)

    @swagger_auto_schema(
        operation_description="Delete an announcement"
    )
    def delete(self, request, pk):
        announcement = get_object_or_404(Announcement, id=pk)
        permission_check = self.check_user_permission(request, announcement)
        if permission_check:
            return permission_check
        return self.destroy(request, pk=pk)


class AnnouncementUserAPIView(generics.GenericAPIView,
                              mixins.ListModelMixin,
                              ):
    serializer_class = AnnouncementSerializer

    def get_permissions(self):
        method = self.request.method
        if method == 'GET':
            return [AllowAny()]

    def get_queryset(self):
        user_id = self.kwargs.get('user_id')
        return Announcement.objects.filter(user_id=user_id)

    @swagger_auto_schema(
        operation_description="Get all announcements for a user",
        responses={200: AnnouncementSerializer(many=True)}
    )
    def get(self, request, user_id):
        return self.list(request, user_id=user_id)


class AnnouncementUserLoginAPIView(generics.GenericAPIView,
                                   mixins.ListModelMixin):
    serializer_class = AnnouncementSerializer

    def get_permissions(self):
        method = self.request.method
        if method == 'GET':
            return [AllowAny()]

    def get_queryset(self):
        username = self.kwargs.get('username')
        return Announcement.objects.filter(user__username=username)

    @swagger_auto_schema(
        operation_description="Get all announcements for a user",
        responses={200: AnnouncementSerializer(many=True)}
    )
    def get(self, request, username):
        return self.list(request, username=username)


class CommentsAPIView(generics.GenericAPIView,
                      mixins.ListModelMixin,
                      mixins.CreateModelMixin):
    queryset = Comments.objects.all()
    serializer_class = CommentsSerializer
    permission_classes = (permissions.IsAuthenticated, IsNotBlocked)

    def get_permissions(self):
        method = self.request.method
        if method == 'GET':
            return [AllowAny()]
        else:
            return [IsAuthenticated(), IsNotBlocked()]

    @swagger_auto_schema(
        operation_description="Get all comments",
        responses={200: CommentsSerializer(many=True)}
    )
    def get(self, request):
        return self.list(request)

    @swagger_auto_schema(
        operation_description="Create a new comment",
        request_body=CommentsSerializer,
        responses={201: openapi.Response('Created')}
    )
    def post(self, request):
        data = request.data.copy()
        data['user'] = request.user.id

        serializer = self.get_serializer(data=data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(status=status.HTTP_201_CREATED)


class CommentsDetailAPIView(generics.GenericAPIView,
                            mixins.ListModelMixin,
                            mixins.RetrieveModelMixin,
                            mixins.UpdateModelMixin,
                            mixins.DestroyModelMixin):
    queryset = Comments.objects.all()
    serializer_class = CommentsSerializer

    def get_permissions(self):
        method = self.request.method
        if method == 'GET':
            return [AllowAny()]
        else:
            return [IsAuthenticated(), IsNotBlocked()]

    def check_user_permission(self, request, comment):
        if request.user != comment.user and not request.user.is_staff:
            return Response({'error': 'You do not have permission to modify or delete this comment.'},
                            status=status.HTTP_403_FORBIDDEN)
        return None

    @swagger_auto_schema(
        operation_description="Get a comment by ID",
        responses={200: CommentsSerializer()}
    )
    def get(self, request, pk):
        return self.retrieve(request, pk=pk)

    @swagger_auto_schema(
        operation_description="Update a comment",
        request_body=CommentsSerializer,
        responses={200: CommentsSerializer()}
    )
    def put(self, request, pk):
        comment = get_object_or_404(Comments, id=pk)
        permission_check = self.check_user_permission(request, comment)
        if permission_check:
            return permission_check
        return self.update(request, pk=pk)

    @swagger_auto_schema(
        operation_description="Delete a comment"
    )
    def delete(self, request, pk):
        comment = get_object_or_404(Comments, id=pk)
        permission_check = self.check_user_permission(request, comment)
        if permission_check:
            return permission_check
        return self.destroy(request, pk=pk)


class CommentsUserAPIView(generics.GenericAPIView,
                          mixins.ListModelMixin):
    serializer_class = CommentsSerializer

    def get_permissions(self):
        return [AllowAny()]

    def get_queryset(self):
        user_id = self.kwargs.get('user_id')
        return Comments.objects.filter(user_id=user_id)

    @swagger_auto_schema(
        operation_description="Get all comments for a user",
        responses={200: CommentsSerializer(many=True)}
    )
    def get(self, request, user_id=None):
        return self.list(request)


class CommentsByUserLoginAPIView(generics.GenericAPIView,
                                 mixins.ListModelMixin):
    serializer_class = CommentsSerializer

    def get_permissions(self):
        return [AllowAny()]

    def get_queryset(self):
        username = self.kwargs.get('username')
        return Comments.objects.filter(user__username=username)

    @swagger_auto_schema(
        operation_description="Get all comments for a specific user by username",
        responses={200: CommentsSerializer(many=True)}
    )
    def get(self, request, username=None):
        return self.list(request)


class CommentsByUserLoginForAnnouncementsAPIView(generics.GenericAPIView,
                                                 mixins.ListModelMixin):
    serializer_class = CommentsSerializer

    def get_permissions(self):
        return [AllowAny()]

    def get_queryset(self):
        username = self.kwargs.get('username')
        limit = self.request.query_params.get('limit', 3)
        limit = int(limit)
        return Comments.objects.filter(announcement__user__username=username)[:limit]

    @swagger_auto_schema(
        operation_description="Get the last N comments for announcements created by a specific user by username",
        responses={200: CommentsSerializer(many=True)}
    )
    def get(self, request, username=None):
        return self.list(request)


class CommentsAnnouncementAPIView(generics.GenericAPIView,
                                  mixins.ListModelMixin, ):
    serializer_class = CommentsSerializer

    def get_permissions(self):
        method = self.request.method
        if method == 'GET':
            return [AllowAny()]

    def get_queryset(self):
        announcement_id = self.kwargs.get('announcement_id')
        return Comments.objects.filter(announcement_id=announcement_id)

    @swagger_auto_schema(
        operation_description="Get all comments for a announcement",
        responses={200: CommentsSerializer(many=True)}
    )
    def get(self, request, announcement_id):
        return self.list(request, announcement_id=announcement_id)

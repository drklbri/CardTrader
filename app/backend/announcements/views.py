from django.shortcuts import render
from drf_yasg.utils import swagger_auto_schema
from rest_framework import generics, mixins, permissions
from rest_framework.permissions import IsAdminUser, IsAuthenticated

from .models import Announcement, Comments
from .serializers import AnnouncementSerializer, CommentsSerializer


# Create your views here.
class AnnouncementAPIView(generics.GenericAPIView,
                          mixins.ListModelMixin,
                          mixins.CreateModelMixin):
    queryset = Announcement.objects.all()
    serializer_class = AnnouncementSerializer
    permission_classes = (permissions.IsAuthenticated,)

    @swagger_auto_schema(
        operation_description="Get all announcements",
        responses={200: AnnouncementSerializer(many=True)}
    )
    def get(self, request):
        return self.list(request)

    @swagger_auto_schema(
        operation_description="Create a new announcement",
        request_body=AnnouncementSerializer,
        responses={201: AnnouncementSerializer()}
    )
    def post(self, request):
        serializer = self.get_serializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        return self.create(request)


class AnnouncementDetailAPIView(generics.GenericAPIView,
                                mixins.RetrieveModelMixin,
                                mixins.UpdateModelMixin,
                                mixins.DestroyModelMixin
                                ):
    queryset = Announcement.objects.all()
    serializer_class = AnnouncementSerializer

    def get_permissions(self):
        method = self.request.method
        if method == 'DELETE':
            return [IsAdminUser()]
        else:
            return [IsAuthenticated()]

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
        return self.update(request, pk=pk)

    @swagger_auto_schema(
        operation_description="Delete an announcement"
    )
    def delete(self, request, pk):
        return self.destroy(request, pk=pk)


# todo "error_message": "AnnouncementUserAPIView.get() got an unexpected keyword argument 'user_id'"
class AnnouncementUserAPIView(generics.GenericAPIView,
                              mixins.ListModelMixin,
                              ):
    serializer_class = AnnouncementSerializer

    def get_permissions(self):
        method = self.request.method
        if method == 'GET':
            return [IsAuthenticated()]

    def get_queryset(self):
        user_id = self.kwargs.get('user_id')
        return Announcement.objects.filter(user_id=user_id)

    @swagger_auto_schema(
        operation_description="Get all announcements for a user",
        responses={200: AnnouncementSerializer(many=True)}
    )
    def get(self, request, user_id):
        return self.list(request, user_id=user_id)


class CommentsAPIView(generics.GenericAPIView,
                      mixins.ListModelMixin,
                      mixins.CreateModelMixin):
    queryset = Comments.objects.all()
    serializer_class = CommentsSerializer
    permission_classes = (permissions.IsAuthenticated,)

    @swagger_auto_schema(
        operation_description="Get all comments",
        responses={200: CommentsSerializer(many=True)}
    )
    def get(self, request):
        return self.list(request)

    @swagger_auto_schema(
        operation_description="Create a new comment",
        request_body=CommentsSerializer,
        responses={201: CommentsSerializer()}
    )
    def post(self, request):
        """
        Create a new comment. The user is automatically set to the currently authenticated user.
        """
        # Prepare data and set the user to the current authenticated user
        data = request.data.copy()
        data['user'] = request.user.id  # Set the user ID to the current user's ID

        serializer = self.get_serializer(data=data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        return self.create(request)


class CommentsDetailAPIView(generics.GenericAPIView,
                            mixins.ListModelMixin,
                            mixins.RetrieveModelMixin,
                            mixins.UpdateModelMixin,
                            mixins.DestroyModelMixin
                            ):
    queryset = Comments.objects.all()
    serializer_class = CommentsSerializer

    def get_permissions(self):
        method = self.request.method
        if method == 'DELETE':
            return [IsAdminUser()]
        else:
            return [IsAuthenticated()]

    @swagger_auto_schema(
        operation_description="Get an comment by ID",
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
        return self.update(request, pk=pk)

    @swagger_auto_schema(
        operation_description="Delete a comment"
    )
    def delete(self, request, pk):
        return self.destroy(request, pk=pk)


class CommentsUserAPIView(generics.GenericAPIView,
                          mixins.ListModelMixin):
    serializer_class = CommentsSerializer

    def get_permissions(self):
        return [IsAuthenticated()]

    """"def get_queryset(self):
        user_id = self.kwargs.get('user_id')
        if user_id:
            return Comments.objects.filter(user_id=user_id)
        return Comments.objects.filter(user=self.request.user)"""

    @swagger_auto_schema(
        operation_description="Get all comments for a user by user_id in URL or current user if user_id is not provided",
        responses={200: CommentsSerializer(many=True)}
    )
    def get(self, request, user_id=None):
        return self.list(request)


class CommentsAnnouncementAPIView(generics.GenericAPIView,
                                  mixins.ListModelMixin, ):
    serializer_class = CommentsSerializer

    def get_permissions(self):
        method = self.request.method
        if method == 'GET':
            return [IsAuthenticated()]

    def get_queryset(self):
        announcement_id = self.kwargs.get('announcement_id')
        return Comments.objects.filter(announcement_id=announcement_id)

    @swagger_auto_schema(
        operation_description="Get all comments for a announcement",
        responses={200: CommentsSerializer(many=True)}
    )
    def get(self, request, announcement_id):
        return self.list(request, announcement_id=announcement_id)

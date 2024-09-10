from django.shortcuts import get_object_or_404
from drf_yasg.utils import swagger_auto_schema
from rest_framework import status
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework.views import APIView

from minio_backend.minio_config import upload_image, get_image_url, delete_image
from minio_backend.models import UserProfile#, GamePicture
from minio_backend.selializers import UserProfileSerializer#, GamePictureSerializer


class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = (FormParser, MultiPartParser)

    @swagger_auto_schema(
        operation_description="Get user profile",
        responses={200: UserProfileSerializer()}
    )
    def get(self, request):
        profile = get_object_or_404(UserProfile, user=request.user)
        if profile.avatar:
            avatar_url = get_image_url(profile.avatar.name, profile.upload_path)
            profile_picture_link = {
                'link': avatar_url
            }
        else:
            profile_picture_link = {
                'link': None
            }
        return Response(profile_picture_link, status=status.HTTP_200_OK)

    @swagger_auto_schema(
        operation_description="Upload or update user profile avatar",
        request_body=UserProfileSerializer,
        responses={
            201: UserProfileSerializer(),
            400: "Invalid data provided"
        }
    )
    def post(self, request):
        profile, created = UserProfile.objects.get_or_create(user=request.user)
        avatar = request.FILES.get('avatar')

        if avatar:
            file_name = upload_image(avatar, profile.upload_path)
            if file_name:
                profile.avatar.name = file_name
                profile.save()

        serializer = UserProfileSerializer(profile).data
        return Response(serializer, status=status.HTTP_201_CREATED)

    @swagger_auto_schema(
        operation_description="Delete user profile avatar",
        responses={204: "Avatar deleted successfully"}
    )
    def delete(self, request):
        profile = get_object_or_404(UserProfile, user=request.user)
        if profile.avatar:
            delete_image(profile.avatar.name, profile.upload_path)
            profile.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


# class GamePictureView(APIView):
#     permission_classes = [IsAdminUser]
#     parser_classes = (FormParser, MultiPartParser)
#
#     def get_permissions(self):
#         method = self.request.method
#         if method == 'POST' or method == 'DELETE':
#             return [IsAdminUser()]
#         else:
#             return [IsAuthenticated()]
#
#     @swagger_auto_schema(
#         operation_description="Get game pictures",
#         responses={200: GamePictureSerializer(many=True)}
#     )
#     def get(self, request, pk):
#         game_pictures = GamePicture.objects.filter(game__id=pk)
#         links = []
#         if game_pictures is not None and len(game_pictures) != 0:
#             for picture in game_pictures:
#                 link = get_image_url(picture.picture.name, picture.upload_path)
#                 links.append(link)
#         return Response(links, status=status.HTTP_200_OK)
#
#     @swagger_auto_schema(
#         operation_description="Upload or update game picture",
#         request_body=GamePictureSerializer,
#         responses={
#             201: GamePictureSerializer(),
#             400: "Invalid data provided"
#         }
#     )
#     def post(self, request, pk):
#         game_picture = GamePicture.objects.create(game_id=pk)
#         new_picture = request.FILES.get('picture')
#
#         if new_picture:
#             file_name = upload_image(new_picture, game_picture.upload_path)
#             if file_name:
#                 game_picture.picture.name = file_name
#                 game_picture.save()
#
#         serializer = GamePictureSerializer(game_picture).data
#         return Response(serializer, status=status.HTTP_201_CREATED)
#
#     @swagger_auto_schema(
#         operation_description="Delete game picture by its id",
#         responses={204: "Avatar deleted successfully"}
#     )
#     def delete(self, request, pk):
#         game_picture = GamePicture.objects.get(id=pk)
#         if game_picture.picture:
#             delete_image(game_picture.picture.name, game_picture.upload_path)
#             game_picture.delete()
#         return Response(status=status.HTTP_204_NO_CONTENT)

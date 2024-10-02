from django.shortcuts import get_object_or_404
from drf_yasg.utils import swagger_auto_schema
from rest_framework import status
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework.views import APIView

from authorization.permissions import IsNotBlocked
from minio_backend.minio_config import upload_image, get_image_url, delete_image, delete_cardimage_image, \
    upload_cardimage_image, get_cardimage_url
from minio_backend.models import UserProfile, CardImage
from minio_backend.serializers import UserProfileSerializer, CardImageSerializer


class UserProfileView(APIView):
    permission_classes = [IsAuthenticated, IsNotBlocked]
    parser_classes = (FormParser, MultiPartParser)

    @swagger_auto_schema(
        operation_description="Get user profile",
        responses={200: UserProfileSerializer()}
    )
    def get(self, request):
        profile = get_object_or_404(UserProfile, user=request.user)
        if profile.avatar:
            avatar_url = get_image_url(profile.avatar.name)
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
            user_id = profile.user.id
            base_file_name = f'profiles/user_{user_id}'

            extensions = ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'tiff', 'webp', 'svg', 'ico']
            for ext in extensions:
                file_to_delete = f'{base_file_name}.{ext}'
                delete_image(file_to_delete)

            file_extension = avatar.name.split('.')[-1]
            new_file_name = f'{base_file_name}.{file_extension}'

            new_file_name = upload_image(avatar, new_file_name)
            if new_file_name:
                profile.avatar.name = new_file_name
                profile.save()

        avatar_url = get_image_url(profile.avatar.name)

        response_data = {
            'avatar': avatar_url
        }

        return Response(response_data, status=status.HTTP_201_CREATED)

    @swagger_auto_schema(
        operation_description="Delete user profile avatar",
        responses={204: "Avatar deleted successfully"}
    )
    def delete(self, request):
        profile = get_object_or_404(UserProfile, user=request.user)

        if profile.avatar:
            delete_image(
                profile.avatar.name)

            profile.avatar = None
            profile.save()

        return Response(status=status.HTTP_204_NO_CONTENT)


class CardImageListCreateView(APIView):
    permission_classes = [IsAuthenticated, IsNotBlocked]
    parser_classes = (FormParser, MultiPartParser)

    extensions = ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'tiff', 'webp', 'svg', 'ico']

    @swagger_auto_schema(
        operation_description="Get cards pictures",
        responses={200: CardImageSerializer(many=True)}
    )
    def get(self, request, card_id):
        game_pictures = CardImage.objects.filter(card__id=card_id)
        links = []

        if game_pictures.exists():
            for picture in game_pictures:
                file_path = picture.picture.name
                link = get_cardimage_url(file_path)

                if link:
                    links.append(link)

        return Response(links, status=status.HTTP_200_OK)

    @swagger_auto_schema(
        operation_description="Upload or update card picture",
        request_body=CardImageSerializer,
        responses={
            201: CardImageSerializer(),
            400: "Invalid data provided"
        }
    )
    def post(self, request, card_id):
        new_picture = request.FILES.get('picture')

        if new_picture:
            file_extension = new_picture.name.split('.')[-1].lower()
            if file_extension not in self.extensions:
                return Response({"error": "Unsupported file extension."}, status=status.HTTP_400_BAD_REQUEST)

            game_picture = CardImage.objects.create(card_id=card_id)

            image_id = game_picture.id
            folder_path = f'pictures/card_{card_id}/'
            file_name = f'{folder_path}cardImage_{image_id}.{file_extension}'

            upload_cardimage_image(new_picture, file_name)
            if file_name:
                game_picture.picture.name = file_name
                game_picture.save()

            serializer = CardImageSerializer(game_picture).data
            return Response(serializer, status=status.HTTP_201_CREATED)

        return Response({"error": "No picture uploaded."}, status=status.HTTP_400_BAD_REQUEST)


class CardImageDeleteView(APIView):
    permission_classes = [IsAuthenticated, IsNotBlocked]

    extensions = ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'tiff', 'webp', 'svg', 'ico']

    @swagger_auto_schema(
        operation_description="Delete cards picture by its id",
        responses={204: "Picture deleted successfully"}
    )
    def delete(self, request, card_id, image_id):
        game_picture = get_object_or_404(CardImage, id=image_id, card__id=card_id)
        if game_picture.picture:
            base_file_name = game_picture.picture.name.rsplit('.', 1)[0]

            for ext in self.extensions:
                file_to_delete = f'{base_file_name}.{ext}'
                delete_cardimage_image(file_to_delete)

            game_picture.delete()

        return Response(status=status.HTTP_204_NO_CONTENT)

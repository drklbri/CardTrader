from rest_framework import serializers

from minio_backend.models import UserProfile#, GamePicture


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['avatar']


# class GamePictureSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = GamePicture
#         fields = ['picture']

from rest_framework import serializers
from rest_framework_simplejwt.settings import api_settings
from rest_framework_simplejwt.tokens import RefreshToken

from authorization.models import User

class UserBlockSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['is_blocked']

class RequestUserRegistrationSerializer(serializers.Serializer):
    username = serializers.CharField(required=False)
    email = serializers.EmailField(required=True)
    password = serializers.CharField(required=True)


class RequestUserAuthSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(required=True)


class EmailSendSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)


class JWTRefreshSerializer(serializers.Serializer):
    refresh_token = serializers.CharField()
    access_token = serializers.CharField(read_only=True)
    token_class = RefreshToken

    def validate(self, attrs):
        refresh = self.token_class(attrs["refresh_token"])

        data = {"access_token": str(refresh.access_token)}

        if api_settings.ROTATE_REFRESH_TOKENS:
            if api_settings.BLACKLIST_AFTER_ROTATION:
                try:
                    refresh.blacklist()
                except AttributeError:
                    pass

            refresh.set_jti()
            refresh.set_exp()
            refresh.set_iat()

            data["refresh_token"] = str(refresh)
            data["access_token"] = str(refresh.access_token)
            user_id = refresh.access_token.get("user_id")
            User.objects.filter(id=user_id).update(refresh_token=str(refresh))
            User.objects.filter(id=user_id).update(access_token=str(refresh.access_token))
        return data


class ResponseUserSerializer(serializers.ModelSerializer):
    username = serializers.CharField(required=True)
    email = serializers.EmailField(required=True)

    def get_role(self, obj):
        return obj.get_role_display()

    class Meta:
        model = User
        exclude = (
            "id",
            "password",
            "is_superuser",
            "is_staff",
            "is_active",
            "date_joined",
            "is_verified",
            "last_login",
            "groups",
            "last_name",
            "first_name",
            "user_permissions",
            "refresh_token",
            "access_token",
        )


class AuthResponseSerializer(serializers.Serializer):
    access_token = serializers.CharField(read_only=True)
    refresh_token = serializers.CharField(read_only=True)

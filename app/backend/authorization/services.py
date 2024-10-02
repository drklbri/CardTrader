from abc import ABC

from django.contrib.auth import authenticate
from django.db import transaction
from django.utils import timezone
from rest_framework.exceptions import APIException, AuthenticationFailed
from rest_framework_simplejwt.tokens import RefreshToken

from .models import User


class RefreshTokenExt(RefreshToken):
    @classmethod
    def for_user(cls, user):
        token = super(RefreshTokenExt, cls).for_user(user)
        token["user_id"] = user.pk
        token["is_verified"] = user.is_verified
        return token


def generate_user_token(user: User):
    token = RefreshTokenExt.for_user(user)
    return token


class AuthService(ABC):
    def __init__(self, **kwargs):
        self.email = kwargs.get("email")
        self.username = kwargs.get("username")
        self.password = kwargs.get("password")
        self.user = None

    @transaction.atomic
    def register(self):
        self.user = self.create_user()
        return self.user

    @transaction.atomic
    def auth(self):
        self.user = self.authenticate_user()
        if self.user and self.user.is_active:
            self.user = self.create_token_pair()
            return self.user
        else:
            raise AuthenticationFailed('Authentication failed')

    def create_user(self) -> User:
        self.user = User(
            email=self.email,
            username=self.username,
            is_verified=True,
            is_active=False
        )
        self.user.set_password(self.password)
        self.user.save()
        return self.user

    def create_token_pair(self) -> User:
        self.user.is_verified = True
        refresh = generate_user_token(self.user)
        self.user.refresh_token = refresh
        self.user.access_token = refresh.access_token
        self.user.last_login = timezone.now()
        self.user.save()
        return self.user

    def authenticate_user(self) -> User:
        user = authenticate(username=self.email, password=self.password)
        return user


class UserService:

    def __init__(self, user_id: User, **kwargs):
        self.user = self.get_user(user_id)
        self.kwargs = kwargs

    def get_user(self, user_id) -> User:
        try:
            return User.objects.get(id=user_id)
        except User.DoesNotExist:
            raise APIException(f"UserView {user_id} does not exists")

    def update_user(self, data: dict) -> User:
        users = User.objects.get(id=self.user.id)
        username = data.get("username")
        password = data.get("password")
        if username and password:
            users.username = username
            users.set_password(password)
        self.user = users
        self.user.save()
        return self.user

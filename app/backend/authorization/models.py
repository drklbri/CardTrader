from django.db import models
from django.contrib.auth.models import Group, AbstractUser, Permission


class User(AbstractUser):
    username = models.CharField(max_length=255, default="", unique=True)
    email = models.EmailField(null=True, default=None, blank=True)
    password = models.CharField(max_length=255)
    groups = models.ManyToManyField(Group)
    user_permissions = models.ManyToManyField(Permission)
    access_token = models.TextField(default=None, null=True)
    refresh_token = models.TextField(default=None, null=True)
    is_verified = models.BooleanField(default=False)
    ROLES = [
        ("user", "user"),
        ("admin", "admin")
    ]
    role = models.CharField(choices=ROLES, max_length=64, default="user")

    class Meta:
        unique_together = ('email',)

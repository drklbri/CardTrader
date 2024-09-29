from django.db import models

from authorization.models import User
#from game_catalog.models import Game


class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    avatar = models.ImageField()
    upload_path = models.CharField(default='/profiles/')


# class GamePicture(models.Model):
#     game = models.ForeignKey(Game, on_delete=models.CASCADE)
#     picture = models.ImageField()
#     upload_path = models.CharField(default='/pictures/')

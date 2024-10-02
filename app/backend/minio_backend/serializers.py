from django.db import models

from authorization.models import User
from cards.models import Card
from minio_backend.minio_config import minio_client


class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    avatar = models.ImageField()
    upload_path = models.CharField(default='profiles/')


class CardImage(models.Model):
    card = models.ForeignKey(Card, on_delete=models.CASCADE, related_name='card_images')
    picture = models.ImageField()
    upload_path = models.CharField(default='pictures/')

    def delete(self, *args, **kwargs):
        if self.picture:
            minio_client.remove_object("card-trader", self.picture.name)
        super(CardImage, self).delete(*args, **kwargs)

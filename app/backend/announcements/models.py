from django.db import models
from authorization.models import User
# Create your models here.

class Announcement(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(default='', max_length=255)
    contact_info = models.TextField(default='')
    user = models.ForeignKey(User, on_delete=models.CASCADE)


class Comments(models.Model):
    name = models.CharField(max_length=255)
    comment = models.TextField(default='', max_length=255)
    creation_date = models.DateField()
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    announcement = models.ForeignKey(Announcement, on_delete=models.CASCADE)
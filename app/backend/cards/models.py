from django.db import models
from announcements.models import Announcement


# Create your models here.

class Tag(models.Model):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name


class Collection(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name


class Card(models.Model):
    announcement = models.ForeignKey(Announcement, on_delete=models.CASCADE)
    CONDITION = [
        ("perfect", "Идеальная"),
        ("pack_fresh", "Только открытая"),
        ("minor_wear", "Немного поигранная"),
        ("visible_wear", "Умеренно поигранная"),
        ("severe_wear", "Поигранная"),
        ("damaged", "Сильно поигранная"),
        ("destroyed", "Уничтоженная")
    ]
    condition = models.CharField(choices=CONDITION, max_length=64, default="minor_wear")
    RARITY = [
        ("common", "Обычная"),
        ("uncommon", "Необычная"),
        ("rare", "Редкая"),
        ("mythic", "Мифическая"),
        ("epic", "Эпическая"),
        ("legendary", "Легендарная")
    ]
    rarity = models.CharField(choices=RARITY, max_length=64, default="common")
    creation_date = models.DateField()
    description = models.TextField(default='', max_length=1620)
    tags = models.ManyToManyField(Tag, related_name='cards')
    collection = models.ForeignKey(Collection, related_name='cards', on_delete=models.SET_NULL, null=True)


class CardImage(models.Model):
    card = models.ForeignKey(Card, related_name='images', on_delete=models.CASCADE)
    image_url = models.CharField(max_length=255)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Image for {self.card} at {self.image_url}"

from rest_framework import serializers

from announcements.models import Announcement
from .models import Card, Tag, Collection, CardImage

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['id', 'name']

class CollectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Collection
        fields = ['id', 'name']

class CardImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = CardImage
        fields = ['id', 'image_url', 'uploaded_at']

class CardSerializer(serializers.ModelSerializer):
    tags = serializers.PrimaryKeyRelatedField(many=True, queryset=Tag.objects.all(), required=False)  # Ожидаем список ID тегов

    class Meta:
        model = Card
        fields = ['id', 'announcement', 'condition', 'rarity', 'creation_date', 'description', 'tags', 'collection']

    def create(self, validated_data):
        tags_data = validated_data.pop('tags', [])  # Получаем теги как список ID

        # Создаем карту
        card = Card.objects.create(**validated_data)

        # Устанавливаем теги (ManyToManyField)
        if tags_data:
            card.tags.set(tags_data)  # Используем set() для установки тегов

        return card

    def update(self, instance, validated_data):
        tags_data = validated_data.pop('tags', None)  # Получаем теги

        # Обновляем поля карты
        instance.condition = validated_data.get('condition', instance.condition)
        instance.rarity = validated_data.get('rarity', instance.rarity)
        instance.creation_date = validated_data.get('creation_date', instance.creation_date)
        instance.description = validated_data.get('description', instance.description)
        instance.collection = validated_data.get('collection', instance.collection)
        instance.save()

        # Если переданы теги, обновляем их
        if tags_data is not None:
            instance.tags.set(tags_data)  # Используем set() для замены тегов

        return instance






from rest_framework import serializers

from announcements.models import Announcement
from minio_backend.minio_config import get_cardimage_url
from minio_backend.models import CardImage
from .models import Card, Tag, Collection


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['id', 'name']


class CollectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Collection
        fields = ['id', 'name']


class CardSerializer(serializers.ModelSerializer):
    tags = TagSerializer(many=True, read_only=True)
    tag_names = serializers.ListField(
        child=serializers.CharField(),
        write_only=True,
        required=False
    )
    collection = serializers.CharField(required=False, allow_null=True)
    images = serializers.SerializerMethodField()

    class Meta:
        model = Card
        fields = ['id', 'announcement', 'condition', 'rarity', 'tags', 'tag_names', 'collection', 'images']

    def get_images(self, card):
        card_images = CardImage.objects.filter(card__id=card.id)
        links = []

        if card_images.exists():
            for image in card_images:
                file_path = image.picture.name
                link = get_cardimage_url(file_path)
                if link:
                    links.append(link)

        return links

    def to_representation(self, instance):
        representation = super().to_representation(instance)

        representation['condition'] = instance.get_condition_display()
        representation['rarity'] = instance.get_rarity_display()

        return representation

    def create(self, validated_data):
        tags_data = validated_data.pop('tag_names', [])

        collection_name = validated_data.pop('collection', None)
        if collection_name:
            collection, created = Collection.objects.get_or_create(name=collection_name)
            validated_data['collection'] = collection
        else:
            validated_data['collection'] = None

        card = Card.objects.create(**validated_data)

        tags = []
        for tag_name in tags_data:
            tag, created = Tag.objects.get_or_create(name=tag_name)
            tags.append(tag)
        card.tags.set(tags)

        return card

    def update(self, instance, validated_data):
        tags_data = validated_data.pop('tag_names', None)
        if tags_data is not None:
            tags = []
            for tag_name in tags_data:
                tag, created = Tag.objects.get_or_create(name=tag_name)
                tags.append(tag)
            instance.tags.set(tags)

        collection_name = validated_data.pop('collection', None)
        if collection_name:
            collection, created = Collection.objects.get_or_create(name=collection_name)
            instance.collection = collection
        else:
            instance.collection = None

        instance.condition = validated_data.get('condition', instance.condition)
        instance.rarity = validated_data.get('rarity', instance.rarity)
        instance.save()

        return instance

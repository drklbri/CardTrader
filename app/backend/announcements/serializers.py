from rest_framework import serializers
from cards.models import Card
from minio_backend.minio_config import get_cardimage_url
from minio_backend.models import CardImage
from .models import Announcement, Comments


class AnnouncementSerializer(serializers.ModelSerializer):
    user_login = serializers.SerializerMethodField()
    cards = serializers.SerializerMethodField()
    tags = serializers.SerializerMethodField()
    card_images = serializers.SerializerMethodField()

    class Meta:
        model = Announcement
        fields = ['id', 'name', 'description', 'contact_info', 'user', 'user_login', 'cards', 'tags', 'card_images',
                  'creation_date']
        read_only_fields = ['user', 'creation_date']

    def create(self, validated_data):
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            user = request.user
        else:
            raise ValueError("User not found in context")
        return Announcement.objects.create(user=user, **validated_data)

    def get_user_login(self, obj):
        return obj.user.username

    def get_cards(self, obj):
        cards = Card.objects.filter(announcement=obj).values_list('id', flat=True)
        return list(cards)

    def get_tags(self, obj):
        cards = Card.objects.filter(announcement=obj)
        tags = set()
        for card in cards:
            card_tags = card.tags.all()
            for tag in card_tags:
                tags.add(tag.name)
        return list(tags)

    def get_card_images(self, obj):
        cards = Card.objects.filter(announcement=obj)
        images = []
        for card in cards:
            card_images = CardImage.objects.filter(card=card)
            for image in card_images:
                file_path = image.picture.name
                link = get_cardimage_url(file_path)
                if link:
                    images.append(link)
        return images


class CommentsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comments
        fields = '__all__'
        read_only_fields = ['user']

    def create(self, validated_data):
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            user = request.user
        else:
            raise ValueError("User not found in context")
        return Comments.objects.create(user=user, **validated_data)

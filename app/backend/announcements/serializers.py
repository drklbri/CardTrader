from rest_framework import serializers
from .models import Announcement, Comments


class AnnouncementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Announcement
        fields = ['id', 'name', 'description', 'contact_info', 'user']
        read_only_fields = ['user']

    def create(self, validated_data):
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            user = request.user
        else:
            raise ValueError("User not found in context")
        return Announcement.objects.create(user=user, **validated_data)


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
        
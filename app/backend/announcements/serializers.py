from rest_framework import serializers
from .models import Announcement, Comments


class AnnouncementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Announcement
        fields = '__all__'


class CommentsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comments
        #exclude = ("user",)
        fields = '__all__'
        
from django.urls import path

from .views import AnnouncementAPIView, AnnouncementDetailAPIView, AnnouncementUserAPIView, CommentsAPIView, \
    CommentsDetailAPIView, CommentsUserAPIView, CommentsAnnouncementAPIView

urlpatterns = [
    path('announcements', AnnouncementAPIView.as_view(), name='announcement'),

    path('announcements/<int:pk>/', AnnouncementDetailAPIView.as_view(), name='announcement-detail'),

    path('announcements/user/<int:user_id>/', AnnouncementUserAPIView.as_view(), name='announcement-comments'),

    path('comments', CommentsAPIView.as_view(), name='comments'),

    path('comments/<int:pk>/', CommentsDetailAPIView.as_view(), name='comments-detail'),

    path('comments/user/<int:user_id>/', CommentsUserAPIView.as_view(), name='comments-user'),

    path('comments/announcement/<int:announcement_id>/', CommentsAnnouncementAPIView.as_view(), name='comments-announcement'),

]
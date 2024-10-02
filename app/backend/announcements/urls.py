from django.urls import path

from .views import AnnouncementAPIView, AnnouncementDetailAPIView, AnnouncementUserAPIView, CommentsAPIView, \
    CommentsDetailAPIView, CommentsUserAPIView, CommentsAnnouncementAPIView, \
    LatestAnnouncementsAPIView, AnnouncementUserLoginAPIView, CommentsByUserLoginAPIView, \
    CommentsByUserLoginForAnnouncementsAPIView, AnnouncementFilterAPIView, \
    AnnouncementListAPIView

urlpatterns = [
    path('announcements', AnnouncementAPIView.as_view(), name='announcement'),

    path('announcements/paginated', AnnouncementListAPIView.as_view(), name='announcement-list'),

    path('announcements/latest/', LatestAnnouncementsAPIView.as_view(), name='latest-announcements'),

    path('announcements/<int:pk>/', AnnouncementDetailAPIView.as_view(), name='announcement-detail'),

    path('announcements/filter/', AnnouncementFilterAPIView.as_view(), name='announcement-filter'),

    path('announcements/user/<str:username>/', AnnouncementUserLoginAPIView.as_view(), name='announcements-by-login'),

    path('announcements/user/<int:user_id>/', AnnouncementUserAPIView.as_view(), name='announcement-comments'),

    path('comments', CommentsAPIView.as_view(), name='comments'),

    path('comments/<int:pk>/', CommentsDetailAPIView.as_view(), name='comments-detail'),

    path('comments/user/<int:user_id>/', CommentsUserAPIView.as_view(), name='comments-user'),

    path('comments/user/<str:username>/', CommentsByUserLoginAPIView.as_view(), name='comments-by-user-login'),

    path('comments/user/<str:username>/announcements/', CommentsByUserLoginForAnnouncementsAPIView.as_view(),
         name='comments-by-user-login-announcements'),

    path('comments/announcement/<int:announcement_id>/', CommentsAnnouncementAPIView.as_view(),
         name='comments-announcement'),

]

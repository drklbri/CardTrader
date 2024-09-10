from django.urls import path
from .views import UserProfileView#, GamePictureView

urlpatterns = [
    path('profile/', UserProfileView.as_view(), name='user-profile'),

   # path('game_picture/<int:pk>/', GamePictureView.as_view(), name='game_picture'),
]

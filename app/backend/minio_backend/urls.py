from django.urls import path
from .views import UserProfileView, CardImageDeleteView, CardImageListCreateView

urlpatterns = [
    path('profile/', UserProfileView.as_view(), name='user-profile'),

    path('cards/<int:card_id>/pictures/', CardImageListCreateView.as_view(), name='cards_pictures'),

    path('cards/<int:card_id>/pictures/<int:image_id>/', CardImageDeleteView.as_view(), name='card_picture_delete'),
]

urlpatterns = [
    path('cards', CardAPIView.as_view(), name='cards'),
    path('cards/<int:pk>/', CardDetailAPIView.as_view(), name='card-detail'),

    path('tags', TagAPIView.as_view(), name='tags'),
    path('tags/<int:pk>/', TagDetailAPIView.as_view(), name='tag-detail'),

    path('collections', CollectionAPIView.as_view(), name='collections'),
    path('collections/<int:pk>/', CollectionDetailAPIView.as_view(), name='collection-detail'),
]

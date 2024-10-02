from django.contrib import admin
from django.urls import path, include
from drf_yasg import openapi
from drf_yasg.views import get_schema_view
from rest_framework import permissions

from ctd.views import index

schema_view = get_schema_view(
    openapi.Info(
        title="CardTrader API",
        default_version='v1',
        description="API documentation powered by Swagger",
    ),
    public=True,
    permission_classes=[permissions.AllowAny]
)

urlpatterns = [
    path('api/admin/', admin.site.urls),
    path('api/api-docs/', schema_view.with_ui('swagger', cache_timeout=0), name='api-docs'),
    path("api/auth/", include("authorization.urls")),
    path("api/", include("announcements.urls")),
    path("api/", include("cards.urls")),
    path('', index, name='index'),
    path('api/', include("minio_backend.urls")),
]

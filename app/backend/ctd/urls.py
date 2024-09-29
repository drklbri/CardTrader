from django.contrib import admin
from django.urls import path, include
from drf_yasg import openapi
from drf_yasg.views import get_schema_view
from rest_framework import permissions

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
    path('admin/', admin.site.urls),

    path('api-docs/', schema_view.with_ui('swagger', cache_timeout=0), name='api-docs'),

    path('', include("minio_backend.urls")),

    path("auth/", include("authorization.urls")),
]

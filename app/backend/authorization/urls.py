from django.urls import path

from .views import (
    JWTRefreshView,
    UserView, AuthUserView, LoginUserView, EmailApproveView, EmailSendView, LogoutUserView
)

urlpatterns = [
    path("token/refresh", JWTRefreshView.as_view(), name="token_refresh"),

    path("user", UserView.as_view(), name="user"),

    path("register", AuthUserView.as_view(), name="register"),

    path("login", LoginUserView.as_view(), name="login"),

    path("logout", LogoutUserView.as_view(), name="logout"),

    path("email/send", EmailSendView.as_view(), name="send"),

    path('activate/<uidb64>/<token>/', EmailApproveView.as_view(), name='activate'),
]

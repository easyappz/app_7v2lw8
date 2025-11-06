from django.urls import include, path
from django.views.decorators.csrf import csrf_exempt
from rest_framework.routers import SimpleRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .views import (
    AdminListingViewSet,
    AdminUserViewSet,
    CategoryViewSet,
    MeView,
    MyListingViewSet,
    PublicListingViewSet,
    RegisterView,
)

public_router = SimpleRouter()
public_router.register(r"categories", CategoryViewSet, basename="category")
public_router.register(r"listings", PublicListingViewSet, basename="public-listing")

my_router = SimpleRouter()
my_router.register(r"listings", MyListingViewSet, basename="my-listing")

admin_router = SimpleRouter()
admin_router.register(r"listings", AdminListingViewSet, basename="admin-listing")
admin_router.register(r"users", AdminUserViewSet, basename="admin-user")

urlpatterns = [
    # Auth
    path("auth/register", csrf_exempt(RegisterView.as_view()), name="auth-register"),
    path("auth/login", csrf_exempt(TokenObtainPairView.as_view()), name="auth-login"),
    path("auth/refresh", csrf_exempt(TokenRefreshView.as_view()), name="auth-refresh"),
    path("auth/me", MeView.as_view(), name="auth-me"),

    # Public
    path("", include(public_router.urls)),

    # My
    path("my/", include(my_router.urls)),

    # Admin
    path("admin/", include(admin_router.urls)),
]

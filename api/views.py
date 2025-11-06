from typing import Any

from django.contrib.auth import get_user_model
from django.db.models import F, Q
from django.shortcuts import get_object_or_404
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from rest_framework import mixins, permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.parsers import FormParser, JSONParser, MultiPartParser
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.generics import RetrieveAPIView
from rest_framework.permissions import AllowAny, IsAdminUser, IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.filters import OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend

from .filters import AdminListingFilter, PublicListingFilter
from .models import Category, Listing, ListingImage, ListingStatus
from .pagination import DefaultPagination
from .serializers import (
    CategorySerializer,
    ListingCreateUpdateSerializer,
    ListingSerializer,
    UserSerializer,
    RegisterSerializer,
)

User = get_user_model()


@method_decorator(csrf_exempt, name="dispatch")
class RegisterView(APIView):
    """Register a new user with username, password and optional email.

    Returns: { user: <User>, access: <jwt>, refresh: <jwt> }
    """

    permission_classes = [AllowAny]
    parser_classes = [JSONParser]

    def post(self, request, *args, **kwargs):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        payload = {
            "user": UserSerializer(user).data,
            "access": str(refresh.access_token),
            "refresh": str(refresh),
        }
        return Response(payload, status=status.HTTP_201_CREATED)


class MeView(RetrieveAPIView):
    """Return current user's profile."""

    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user


class CategoryViewSet(viewsets.ModelViewSet):
    """Public list/retrieve (active only for non-admins). Admins have full CRUD."""

    serializer_class = CategorySerializer
    authentication_classes = [JWTAuthentication]
    parser_classes = [JSONParser, FormParser]
    pagination_class = None

    def get_permissions(self):
        if self.request.method in ("GET",):
            return [permissions.AllowAny()]
        return [IsAdminUser()]

    def get_queryset(self):
        qs = Category.objects.all().order_by("name")
        if not (self.request and self.request.user and self.request.user.is_staff):
            qs = qs.filter(is_active=True)
        return qs


class PublicListingViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Public endpoints for listing and retrieving approved & active listings.
    Unapproved/inactive details are accessible only to the author or admins.
    """

    serializer_class = ListingSerializer
    queryset = Listing.objects.select_related("category", "author").prefetch_related("images")
    authentication_classes = [JWTAuthentication]
    permission_classes = [permissions.AllowAny]
    pagination_class = DefaultPagination
    parser_classes = [JSONParser]
    filterset_class = PublicListingFilter
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    ordering_fields = ["price", "created_at", "views_count"]
    ordering = ["-created_at"]

    def get_queryset(self):
        qs = super().get_queryset()
        # Only approved & active for public list
        return qs.filter(status=ListingStatus.APPROVED, is_active=True)

    def retrieve(self, request, *args, **kwargs):
        obj = get_object_or_404(Listing.objects.select_related("category", "author").prefetch_related("images"), pk=kwargs.get("pk"))
        user = request.user if request.user and request.user.is_authenticated else None
        can_view_non_public = bool(user and (user.is_staff or obj.author_id == user.id))
        if not obj.is_public and not can_view_non_public:
            # Mask existence to public
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)
        # Increase views for public views only (not owner/admin and only if public)
        if obj.is_public and not can_view_non_public:
            Listing.objects.filter(pk=obj.pk).update(views_count=F("views_count") + 1)
            obj.refresh_from_db(fields=["views_count"])
        serializer = self.get_serializer(obj)
        return Response(serializer.data)


class MyListingViewSet(viewsets.ModelViewSet):
    """
    Authenticated user's own listings. Full CRUD only for the owner.
    On owner update of an approved listing, status is set back to PENDING and rejected_reason cleared.
    """

    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    pagination_class = DefaultPagination
    filterset_fields = []

    def get_queryset(self):
        return (
            Listing.objects.select_related("category", "author")
            .prefetch_related("images")
            .filter(author=self.request.user)
            .order_by("-created_at")
        )

    def get_serializer_class(self):
        if self.action in ("list", "retrieve"):
            return ListingSerializer
        return ListingCreateUpdateSerializer

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

    def perform_update(self, serializer):
        instance_before = self.get_object()
        was_approved = instance_before.status == ListingStatus.APPROVED
        listing = serializer.save()
        if was_approved and not self.request.user.is_staff:
            listing.status = ListingStatus.PENDING
            listing.rejected_reason = ""
            listing.save(update_fields=["status", "rejected_reason"])


class AdminListingViewSet(viewsets.ModelViewSet):
    """Admin CRUD and moderation endpoints for listings."""

    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAdminUser]
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    pagination_class = DefaultPagination
    queryset = Listing.objects.select_related("category", "author").prefetch_related("images")
    filterset_class = AdminListingFilter
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    ordering_fields = ["price", "created_at", "views_count"]
    ordering = ["-created_at"]

    def get_serializer_class(self):
        if self.action in ("create", "update", "partial_update"):
            return ListingCreateUpdateSerializer
        return ListingSerializer

    @action(detail=True, methods=["post"], url_path="approve")
    def approve(self, request, pk=None):
        listing = self.get_object()
        listing.status = ListingStatus.APPROVED
        listing.rejected_reason = ""
        listing.save(update_fields=["status", "rejected_reason"])
        return Response({"status": listing.status})

    @action(detail=True, methods=["post"], url_path="reject")
    def reject(self, request, pk=None):
        listing = self.get_object()
        reason = (request.data.get("reason") or "").strip()
        if not reason:
            return Response({"detail": "Reason is required"}, status=status.HTTP_400_BAD_REQUEST)
        listing.status = ListingStatus.REJECTED
        listing.rejected_reason = reason[:255]
        listing.save(update_fields=["status", "rejected_reason"])
        return Response({"status": listing.status, "rejected_reason": listing.rejected_reason})

    @action(detail=True, methods=["patch"], url_path="toggle-active")
    def toggle_active(self, request, pk=None):
        listing = self.get_object()
        listing.is_active = not listing.is_active
        listing.save(update_fields=["is_active"])
        return Response({"is_active": listing.is_active})


class AdminUserViewSet(mixins.ListModelMixin, viewsets.GenericViewSet):
    """Admin endpoints to list users and toggle active flag."""

    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAdminUser]
    serializer_class = UserSerializer
    pagination_class = DefaultPagination

    def get_queryset(self):
        qs = User.objects.all().order_by("-date_joined")
        is_active = self.request.query_params.get("is_active")
        if is_active in {"true", "1", "false", "0"}:
            flag = is_active in {"true", "1"}
            qs = qs.filter(is_active=flag)
        return qs

    @action(detail=True, methods=["patch"], url_path="toggle-active")
    def toggle_active(self, request, pk=None):
        user = get_object_or_404(User, pk=pk)
        user.is_active = not user.is_active
        user.save(update_fields=["is_active"])
        return Response({"id": user.id, "is_active": user.is_active})

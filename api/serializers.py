from typing import List, Optional
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.db import transaction
from rest_framework import serializers
from rest_framework.validators import UniqueValidator

from .models import Category, Listing, ListingImage, ListingStatus


User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    """Public-safe representation of a user for profile/admin lists."""

    class Meta:
        model = User
        fields = ["id", "username", "email", "is_active", "is_staff", "date_joined"]
        read_only_fields = fields


class RegisterSerializer(serializers.Serializer):
    username = serializers.CharField(
        max_length=150,
        validators=[UniqueValidator(queryset=User.objects.all(), message="This username is already taken.")],
    )
    email = serializers.EmailField(required=False, allow_blank=True, allow_null=True)
    password = serializers.CharField(write_only=True)

    def validate_email(self, value: Optional[str]) -> str:
        if not value:
            return ""
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("This email is already registered.")
        return value

    def validate_password(self, value: str) -> str:
        validate_password(value)
        return value

    def create(self, validated_data):
        email = validated_data.get("email") or ""
        return User.objects.create_user(
            username=validated_data["username"],
            email=email,
            password=validated_data["password"],
        )

    def to_representation(self, instance):
        return UserSerializer(instance).data


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = [
            "id",
            "name",
            "slug",
            "parent",
            "is_active",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["created_at", "updated_at"]


class ListingImageSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = ListingImage
        fields = ["id", "image", "is_main", "created_at"]
        read_only_fields = ["id", "image", "created_at"]

    def get_image(self, obj) -> Optional[str]:
        request = self.context.get("request")
        if obj.image and hasattr(obj.image, "url"):
            if request is not None:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None


class CategoryNestedSerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name", "slug"]


class ListingSerializer(serializers.ModelSerializer):
    category = CategoryNestedSerializer(read_only=True)
    images = ListingImageSerializer(many=True, read_only=True)
    author = serializers.SerializerMethodField()

    class Meta:
        model = Listing
        fields = [
            "id",
            "title",
            "description",
            "price",
            "category",
            "author",
            "location",
            "status",
            "rejected_reason",
            "is_active",
            "views_count",
            "created_at",
            "updated_at",
            "images",
        ]
        read_only_fields = [
            "status",
            "rejected_reason",
            "views_count",
            "created_at",
            "updated_at",
        ]

    def get_author(self, obj):
        u = obj.author
        return {"id": u.id, "username": u.username}


class ListingCreateUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer to create/update listings with multipart images support.

    Expected multipart fields on create/update:
    - images: multiple files (images)
    - images_is_main: optional list aligned to images ("true"/"false")
    - main_image_index: optional int, index in uploaded images which is main
    - remove_image_ids: optional JSON array (or comma-separated string) of image IDs to delete (update only)
    - set_main_image_id: optional int of existing image to mark as main (update only)

    Non-admin users may set status only to DRAFT or PENDING; other values are ignored.
    """

    class Meta:
        model = Listing
        fields = [
            "title",
            "description",
            "price",
            "category",
            "location",
            "status",
        ]

    def validate_price(self, value):
        if value < 0:
            raise serializers.ValidationError("Price must be greater than or equal to 0.")
        return value

    def _parse_bool_list(self, values: List[str]) -> List[bool]:
        out: List[bool] = []
        for v in values:
            if isinstance(v, bool):
                out.append(v)
            else:
                out.append(str(v).strip().lower() in {"1", "true", "yes", "on"})
        return out

    def _get_request(self):
        request = self.context.get("request")
        if not request:
            raise RuntimeError("Request is required in serializer context.")
        return request

    def _normalize_status_for_user(self, status: Optional[str]) -> str:
        user = self._get_request().user
        if user.is_staff:
            return status or ListingStatus.PENDING
        # Non-admins can set only DRAFT or PENDING
        if status in {ListingStatus.DRAFT, ListingStatus.PENDING}:
            return status
        return ListingStatus.PENDING

    def _handle_images_create_or_add(self, listing: Listing):
        request = self._get_request()
        files = request.FILES.getlist("images")
        if not files:
            return
        is_main_flags: List[bool] = []
        if hasattr(request.data, "getlist"):
            raw_flags = request.data.getlist("images_is_main")
            if raw_flags:
                is_main_flags = self._parse_bool_list(raw_flags)
        main_index = request.data.get("main_image_index")
        idx_main = None
        try:
            if main_index is not None and str(main_index) != "":
                idx_main = int(main_index)
        except ValueError:
            idx_main = None
        # Validate main flags consistency
        if is_main_flags and len(is_main_flags) != len(files):
            raise serializers.ValidationError({"images_is_main": "Length must match number of uploaded images."})
        if is_main_flags and sum(1 for x in is_main_flags if x) > 1:
            raise serializers.ValidationError({"images_is_main": "Only one image can be marked as main."})
        if idx_main is not None and (idx_main < 0 or idx_main >= len(files)):
            raise serializers.ValidationError({"main_image_index": "Index out of range."})
        # If any main is indicated, reset previous mains
        any_main = (is_main_flags and any(is_main_flags)) or (idx_main is not None)
        if any_main:
            ListingImage.objects.filter(listing=listing, is_main=True).update(is_main=False)
        for i, f in enumerate(files):
            mark_main = False
            if is_main_flags:
                mark_main = bool(is_main_flags[i])
            elif idx_main is not None and i == idx_main:
                mark_main = True
            ListingImage.objects.create(listing=listing, image=f, is_main=mark_main)

    def _parse_remove_ids(self, value) -> List[int]:
        ids: List[int] = []
        if not value:
            return ids
        if isinstance(value, list):
            for v in value:
                try:
                    ids.append(int(v))
                except (TypeError, ValueError):
                    pass
            return ids
        # try JSON
        import json
        try:
            loaded = json.loads(value)
            if isinstance(loaded, list):
                for v in loaded:
                    try:
                        ids.append(int(v))
                    except (TypeError, ValueError):
                        pass
                return ids
        except Exception:
            pass
        # comma-separated
        for part in str(value).split(","):
            part = part.strip()
            if not part:
                continue
            try:
                ids.append(int(part))
            except ValueError:
                continue
        return ids

    @transaction.atomic
    def create(self, validated_data):
        request = self._get_request()
        status_in = validated_data.pop("status", None)
        validated_data["status"] = self._normalize_status_for_user(status_in)
        listing = Listing.objects.create(author=request.user, **validated_data)
        self._handle_images_create_or_add(listing)
        return listing

    @transaction.atomic
    def update(self, instance: Listing, validated_data):
        request = self._get_request()
        status_in = validated_data.pop("status", None)
        # Admins can set any; users limited by _normalize_status_for_user
        normalized = self._normalize_status_for_user(status_in) if not request.user.is_staff else (status_in or instance.status)
        for attr, val in validated_data.items():
            setattr(instance, attr, val)
        instance.status = normalized
        instance.save()

        # Delete images if requested
        remove_ids_raw = request.data.get("remove_image_ids")
        remove_ids = self._parse_remove_ids(remove_ids_raw)
        if remove_ids:
            ListingImage.objects.filter(listing=instance, id__in=remove_ids).delete()

        # Optionally set existing main image
        set_main_id = request.data.get("set_main_image_id")
        if set_main_id not in (None, ""):
            try:
                set_main_id = int(set_main_id)
                if ListingImage.objects.filter(listing=instance, id=set_main_id).exists():
                    ListingImage.objects.filter(listing=instance, is_main=True).update(is_main=False)
                    ListingImage.objects.filter(listing=instance, id=set_main_id).update(is_main=True)
            except (TypeError, ValueError):
                pass

        # Add new images
        self._handle_images_create_or_add(instance)
        return instance

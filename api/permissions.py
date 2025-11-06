from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsOwner(BasePermission):
    """Allows access only to the object's owner (assumes model has author field)."""

    def has_object_permission(self, request, view, obj):
        return getattr(obj, "author_id", None) == getattr(request.user, "id", None)


class ReadOnly(BasePermission):
    def has_permission(self, request, view):
        return request.method in SAFE_METHODS

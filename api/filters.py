from django.db.models import Q
from django_filters import rest_framework as filters

from .models import Listing


class PublicListingFilter(filters.FilterSet):
    category = filters.NumberFilter(field_name="category_id", lookup_expr="exact")
    price_min = filters.NumberFilter(field_name="price", lookup_expr="gte")
    price_max = filters.NumberFilter(field_name="price", lookup_expr="lte")
    query = filters.CharFilter(method="filter_query")
    ordering = filters.OrderingFilter(
        fields=(
            ("created_at", "created_at"),
            ("price", "price"),
        )
    )

    class Meta:
        model = Listing
        fields = ["category", "price_min", "price_max", "query"]

    def filter_query(self, queryset, name, value):
        if not value:
            return queryset
        return queryset.filter(Q(title__icontains=value) | Q(description__icontains=value))


class AdminListingFilter(PublicListingFilter):
    status = filters.CharFilter(field_name="status", lookup_expr="exact")
    author = filters.NumberFilter(field_name="author_id", lookup_expr="exact")
    is_active = filters.BooleanFilter(field_name="is_active")

    class Meta(PublicListingFilter.Meta):
        fields = ["category", "price_min", "price_max", "query", "status", "author", "is_active"]

from typing import Optional

import django_filters
from django.db.models import Q

from .models import Listing, ListingStatus


class PublicListingFilter(django_filters.FilterSet):
    price_min = django_filters.NumberFilter(field_name="price", lookup_expr="gte")
    price_max = django_filters.NumberFilter(field_name="price", lookup_expr="lte")
    category = django_filters.CharFilter(method="filter_category")
    query = django_filters.CharFilter(method="filter_query")

    class Meta:
        model = Listing
        fields = ["price_min", "price_max", "category", "query"]

    def filter_category(self, queryset, name, value):
        if not value:
            return queryset
        # Accept ID or slug
        if str(value).isdigit():
            return queryset.filter(category_id=int(value))
        return queryset.filter(category__slug=value)

    def filter_query(self, queryset, name, value):
        if not value:
            return queryset
        return queryset.filter(Q(title__icontains=value) | Q(description__icontains=value))


class AdminListingFilter(django_filters.FilterSet):
    price_min = django_filters.NumberFilter(field_name="price", lookup_expr="gte")
    price_max = django_filters.NumberFilter(field_name="price", lookup_expr="lte")
    status = django_filters.ChoiceFilter(field_name="status", choices=ListingStatus.choices)
    is_active = django_filters.BooleanFilter(field_name="is_active")
    author = django_filters.NumberFilter(field_name="author_id")
    category = django_filters.CharFilter(method="filter_category")
    query = django_filters.CharFilter(method="filter_query")

    class Meta:
        model = Listing
        fields = ["price_min", "price_max", "status", "is_active", "author", "category", "query"]

    def filter_category(self, queryset, name, value: Optional[str]):
        if not value:
            return queryset
        if str(value).isdigit():
            return queryset.filter(category_id=int(value))
        return queryset.filter(category__slug=value)

    def filter_query(self, queryset, name, value):
        if not value:
            return queryset
        return queryset.filter(Q(title__icontains=value) | Q(description__icontains=value))

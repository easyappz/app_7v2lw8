from django.contrib import admin

from .models import Category, Listing, ListingImage, ListingStatus


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "slug", "parent", "is_active", "created_at")
    list_filter = ("is_active", "created_at")
    search_fields = ("name", "slug")
    prepopulated_fields = {"slug": ("name",)}
    ordering = ("name",)


class ListingImageInline(admin.TabularInline):
    model = ListingImage
    extra = 1


@admin.register(Listing)
class ListingAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "title",
        "category",
        "author",
        "price",
        "status",
        "is_active",
        "views_count",
        "created_at",
    )
    list_filter = ("status", "is_active", "category", "created_at")
    search_fields = ("title", "description", "author__username")
    readonly_fields = ("created_at", "updated_at", "views_count")
    inlines = [ListingImageInline]
    actions = [
        "approve_listings",
        "reject_listings",
        "activate_listings",
        "deactivate_listings",
    ]

    def approve_listings(self, request, queryset):
        updated = queryset.update(status=ListingStatus.APPROVED, rejected_reason="")
        self.message_user(request, f"Approved {updated} listing(s).")

    approve_listings.short_description = "Approve selected listings"

    def reject_listings(self, request, queryset):
        updated = queryset.update(status=ListingStatus.REJECTED)
        self.message_user(request, f"Rejected {updated} listing(s).")

    reject_listings.short_description = "Reject selected listings"

    def activate_listings(self, request, queryset):
        updated = queryset.update(is_active=True)
        self.message_user(request, f"Activated {updated} listing(s).")

    activate_listings.short_description = "Activate selected listings"

    def deactivate_listings(self, request, queryset):
        updated = queryset.update(is_active=False)
        self.message_user(request, f"Deactivated {updated} listing(s).")

    deactivate_listings.short_description = "Deactivate selected listings"


@admin.register(ListingImage)
class ListingImageAdmin(admin.ModelAdmin):
    list_display = ("id", "listing", "is_main", "created_at")
    list_filter = ("is_main", "created_at")
    search_fields = ("listing__title",)

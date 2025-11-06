from django.conf import settings
from django.db import models


class Category(models.Model):
    name = models.CharField(
        max_length=120,
        unique=True,
        verbose_name="Name",
        help_text="Display name of the category",
    )
    slug = models.SlugField(
        max_length=150,
        unique=True,
        verbose_name="Slug",
        help_text="URL-friendly identifier",
    )
    parent = models.ForeignKey(
        "self",
        related_name="children",
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        verbose_name="Parent category",
    )
    is_active = models.BooleanField(default=True, verbose_name="Active")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Created at")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Updated at")

    class Meta:
        verbose_name = "Category"
        verbose_name_plural = "Categories"
        ordering = ["name"]

    def __str__(self) -> str:  # pragma: no cover
        return self.name


class ListingStatus(models.TextChoices):
    DRAFT = "DRAFT", "Draft"
    PENDING = "PENDING", "Pending"
    APPROVED = "APPROVED", "Approved"
    REJECTED = "REJECTED", "Rejected"


class Listing(models.Model):
    title = models.CharField(max_length=200, verbose_name="Title")
    description = models.TextField(verbose_name="Description")
    price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        verbose_name="Price",
        help_text="Price should be greater than or equal to 0",
    )
    category = models.ForeignKey(
        Category,
        related_name="listings",
        on_delete=models.PROTECT,
        verbose_name="Category",
    )
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name="listings",
        on_delete=models.CASCADE,
        verbose_name="Author",
    )
    location = models.CharField(
        max_length=200,
        blank=True,
        verbose_name="Location",
    )
    status = models.CharField(
        max_length=20,
        choices=ListingStatus.choices,
        default=ListingStatus.PENDING,
        verbose_name="Status",
    )
    rejected_reason = models.CharField(
        max_length=255,
        blank=True,
        verbose_name="Rejected reason",
    )
    is_active = models.BooleanField(default=True, verbose_name="Active")
    views_count = models.PositiveIntegerField(default=0, verbose_name="Views count")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Created at")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Updated at")

    class Meta:
        verbose_name = "Listing"
        verbose_name_plural = "Listings"
        ordering = ["-created_at"]

    def __str__(self) -> str:  # pragma: no cover
        return self.title

    @property
    def is_public(self) -> bool:
        return self.is_active and self.status == ListingStatus.APPROVED


class ListingImage(models.Model):
    listing = models.ForeignKey(
        Listing,
        related_name="images",
        on_delete=models.CASCADE,
        verbose_name="Listing",
    )
    image = models.ImageField(
        upload_to="listings/%Y/%m/",
        verbose_name="Image",
    )
    is_main = models.BooleanField(default=False, verbose_name="Main image")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Created at")

    class Meta:
        verbose_name = "Listing Image"
        verbose_name_plural = "Listing Images"
        ordering = ["-created_at"]

    def __str__(self) -> str:  # pragma: no cover
        return f"Image for {self.listing_id}"

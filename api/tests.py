import io
import json
import os
import shutil
import tempfile
from decimal import Decimal

from django.contrib.auth import get_user_model
from django.test import TestCase
from django.urls import reverse
from django.conf import settings
from django.test.utils import override_settings
from PIL import Image
from rest_framework.test import APIClient

from .models import Category, Listing, ListingImage, ListingStatus


User = get_user_model()


def make_image_file(filename="test.png", size=(32, 32), color=(255, 0, 0)):
    file_obj = io.BytesIO()
    image = Image.new("RGB", size=size, color=color)
    image.save(file_obj, "PNG")
    file_obj.seek(0)
    file_obj.name = filename
    return file_obj


class MediaTempMixin:
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls._media_dir = tempfile.mkdtemp(prefix="test_media_")
        cls._override = override_settings(MEDIA_ROOT=cls._media_dir)
        cls._override.enable()

    @classmethod
    def tearDownClass(cls):
        try:
            cls._override.disable()
        finally:
            shutil.rmtree(cls._media_dir, ignore_errors=True)
        super().tearDownClass()


class APICoreTests(MediaTempMixin, TestCase):
    def setUp(self):
        self.client = APIClient()
        self.admin = User.objects.create_superuser(username="admin", email="admin@example.com", password="pass1234")
        self.user = User.objects.create_user(username="john", email="john@example.com", password="pass1234")
        self.user2 = User.objects.create_user(username="kate", email="kate@example.com", password="pass1234")
        self.cat1 = Category.objects.create(name="Electronics", slug="electronics")
        self.cat2 = Category.objects.create(name="Transport", slug="transport")

    def auth_headers(self, username, password="pass1234"):
        res = self.client.post("/api/auth/login", {"username": username, "password": password}, format="json")
        self.assertIn(res.status_code, (200, 401))
        if res.status_code != 200:
            return None
        token = res.data["access"]
        return {"HTTP_AUTHORIZATION": f"Bearer {token}"}

    def test_registration_login_and_me(self):
        # Registration -> must return tokens and user
        res = self.client.post(
            "/api/auth/register",
            {"username": "mike", "password": "secretPass1", "email": "mike@example.com"},
            format="json",
        )
        self.assertEqual(res.status_code, 201)
        self.assertIn("access", res.data)
        self.assertIn("refresh", res.data)
        self.assertIn("user", res.data)
        self.assertEqual(res.data["user"]["username"], "mike")
        # Login
        headers = self.auth_headers("mike", "secretPass1")
        self.assertIsNotNone(headers)
        # Me
        res = self.client.get("/api/auth/me", **headers)
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.data["username"], "mike")

    def test_me_requires_auth(self):
        res = self.client.get("/api/auth/me")
        self.assertEqual(res.status_code, 401)

    def test_public_list_shows_only_approved_and_active_and_detail_rules(self):
        l1 = Listing.objects.create(
            title="Phone", description="Good phone", price=Decimal("100"), category=self.cat1, author=self.user, status=ListingStatus.APPROVED, is_active=True
        )
        l2 = Listing.objects.create(
            title="Car", description="Nice car", price=Decimal("5000"), category=self.cat2, author=self.user, status=ListingStatus.PENDING, is_active=True
        )
        l3 = Listing.objects.create(
            title="Bike", description="Fast", price=Decimal("300"), category=self.cat2, author=self.user, status=ListingStatus.APPROVED, is_active=False
        )
        res = self.client.get("/api/listings/")
        self.assertEqual(res.status_code, 200)
        ids = [item["id"] for item in res.data["results"]]
        self.assertIn(l1.id, ids)
        self.assertNotIn(l2.id, ids)
        self.assertNotIn(l3.id, ids)

        # Detail: anonymous cannot see non-public
        res = self.client.get(f"/api/listings/{l2.id}/")
        self.assertEqual(res.status_code, 404)
        # Author can see
        headers = self.auth_headers("john")
        res = self.client.get(f"/api/listings/{l2.id}/", **headers)
        self.assertEqual(res.status_code, 200)
        # Admin can see
        admin_headers = self.auth_headers("admin")
        res = self.client.get(f"/api/listings/{l2.id}/", **admin_headers)
        self.assertEqual(res.status_code, 200)

    def test_my_listings_crud_with_images_and_status_reset_on_update(self):
        headers = self.auth_headers("john")
        # Create listing with two images, second is main
        img1 = make_image_file("a.png")
        img2 = make_image_file("b.png")
        data = {
            "title": "Table",
            "description": "Wooden table",
            "price": "250.00",
            "category": str(self.cat1.id),
            "location": "City",
            "main_image_index": "1",
            "images": [img1, img2],
        }
        res = self.client.post("/api/my/listings/", data, format="multipart", **headers)
        self.assertIn(res.status_code, (201, 200))
        listing = Listing.objects.get(title="Table")
        images = list(ListingImage.objects.filter(listing=listing).order_by("id"))
        self.assertEqual(len(images), 2)
        self.assertTrue(any(i.is_main for i in images))
        self.assertTrue(images[1].is_main)
        # Approve as admin
        admin_headers = self.auth_headers("admin")
        res = self.client.post(f"/api/admin/listings/{listing.id}/approve/", {}, format="json", **admin_headers)
        self.assertEqual(res.status_code, 200)
        listing.refresh_from_db()
        self.assertEqual(listing.status, ListingStatus.APPROVED)
        # User updates title -> should reset to PENDING
        res = self.client.patch(f"/api/my/listings/{listing.id}/", {"title": "Table 2"}, format="multipart", **headers)
        self.assertIn(res.status_code, (200, 202))
        listing.refresh_from_db()
        self.assertEqual(listing.title, "Table 2")
        self.assertEqual(listing.status, ListingStatus.PENDING)
        # Delete
        res = self.client.delete(f"/api/my/listings/{listing.id}/", **headers)
        self.assertEqual(res.status_code, 204)
        self.assertFalse(Listing.objects.filter(id=listing.id).exists())

    def test_filters_and_sorting_public(self):
        l1 = Listing.objects.create(title="Cheap phone", description="ok", price=Decimal("50"), category=self.cat1, author=self.user, status=ListingStatus.APPROVED, is_active=True)
        l2 = Listing.objects.create(title="Expensive car", description="lux", price=Decimal("10000"), category=self.cat2, author=self.user, status=ListingStatus.APPROVED, is_active=True)
        l3 = Listing.objects.create(title="Mid bike", description="sport", price=Decimal("300"), category=self.cat2, author=self.user, status=ListingStatus.APPROVED, is_active=True)

        # price_min
        res = self.client.get("/api/listings/?price_min=1000")
        ids = [i["id"] for i in res.data["results"]]
        self.assertIn(l2.id, ids)
        self.assertNotIn(l1.id, ids)
        # price_max
        res = self.client.get("/api/listings/?price_max=100")
        ids = [i["id"] for i in res.data["results"]]
        self.assertIn(l1.id, ids)
        self.assertNotIn(l2.id, ids)
        # category by id
        res = self.client.get(f"/api/listings/?category={self.cat2.id}")
        ids = [i["id"] for i in res.data["results"]]
        self.assertIn(l2.id, ids)
        self.assertIn(l3.id, ids)
        self.assertNotIn(l1.id, ids)
        # query search
        res = self.client.get("/api/listings/?query=phone")
        ids = [i["id"] for i in res.data["results"]]
        self.assertIn(l1.id, ids)
        self.assertNotIn(l2.id, ids)
        # ordering by price desc
        res = self.client.get("/api/listings/?ordering=-price")
        prices = [Decimal(item["price"]) for item in res.data["results"]]
        self.assertEqual(prices, sorted(prices, reverse=True))

    def test_moderation_admin_only(self):
        # Create pending
        listing = Listing.objects.create(title="Chair", description="comfy", price=Decimal("80"), category=self.cat1, author=self.user, status=ListingStatus.PENDING, is_active=True)
        # Non-admin can't approve
        headers = self.auth_headers("john")
        res = self.client.post(f"/api/admin/listings/{listing.id}/approve/", {}, format="json", **headers)
        self.assertEqual(res.status_code, 403)
        # Admin approve
        admin_headers = self.auth_headers("admin")
        res = self.client.post(f"/api/admin/listings/{listing.id}/approve/", {}, format="json", **admin_headers)
        self.assertEqual(res.status_code, 200)
        listing.refresh_from_db()
        self.assertEqual(listing.status, ListingStatus.APPROVED)
        # Reject with reason
        res = self.client.post(f"/api/admin/listings/{listing.id}/reject/", {"reason": "spam"}, format="json", **admin_headers)
        self.assertEqual(res.status_code, 200)
        listing.refresh_from_db()
        self.assertEqual(listing.status, ListingStatus.REJECTED)
        self.assertEqual(listing.rejected_reason, "spam")
        # Toggle active
        res = self.client.patch(f"/api/admin/listings/{listing.id}/toggle-active/", {}, format="json", **admin_headers)
        self.assertEqual(res.status_code, 200)
        listing.refresh_from_db()
        self.assertFalse(listing.is_active)

    def test_admin_user_toggle_active_blocks_login(self):
        # Ensure user can login first
        headers = self.auth_headers("kate")
        self.assertIsNotNone(headers)
        # Toggle to inactive by admin
        admin_headers = self.auth_headers("admin")
        res = self.client.patch(f"/api/admin/users/{self.user2.id}/toggle-active/", {}, format="json", **admin_headers)
        self.assertEqual(res.status_code, 200)
        self.user2.refresh_from_db()
        self.assertFalse(self.user2.is_active)
        # Now login should fail
        res = self.client.post("/api/auth/login", {"username": "kate", "password": "pass1234"}, format="json")
        self.assertEqual(res.status_code, 401)
        self.assertIn("No active account", str(res.data))

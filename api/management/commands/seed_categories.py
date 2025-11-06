from django.core.management.base import BaseCommand
from django.utils.text import slugify

from api.models import Category


BASE_CATEGORIES = [
    'Электроника',
    'Транспорт',
    'Недвижимость',
    'Услуги',
    'Работа',
    'Животные',
    'Для дома и дачи',
    'Хобби и отдых',
]


class Command(BaseCommand):
    help = 'Seed base categories for classifieds.'

    def handle(self, *args, **options):
        created_count = 0
        for name in BASE_CATEGORIES:
            # Allow Unicode in slug to preserve Cyrillic if transliteration not available
            slug = slugify(name, allow_unicode=True)
            # Ensure unique slug
            base_slug = slug or 'category'
            final_slug = base_slug
            i = 1
            while Category.objects.filter(slug=final_slug).exists():
                i += 1
                final_slug = f"{base_slug}-{i}"

            obj, created = Category.objects.get_or_create(name=name, defaults={
                'slug': final_slug,
                'is_active': True,
            })
            if created:
                created_count += 1
        self.stdout.write(self.style.SUCCESS(f"Seed completed. Created {created_count} new categories."))

from django.db import migrations, models
from django.conf import settings


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Category',
            fields=[
                ('id', models.BigAutoField(primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(help_text='Display name of the category', max_length=120, unique=True, verbose_name='Name')),
                ('slug', models.SlugField(help_text='URL-friendly identifier', max_length=150, unique=True, verbose_name='Slug')),
                ('is_active', models.BooleanField(default=True, verbose_name='Active')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='Created at')),
                ('updated_at', models.DateTimeField(auto_now=True, verbose_name='Updated at')),
                ('parent', models.ForeignKey(blank=True, null=True, on_delete=models.SET_NULL, related_name='children', to='api.category', verbose_name='Parent category')),
            ],
            options={
                'verbose_name': 'Category',
                'verbose_name_plural': 'Categories',
                'ordering': ['name'],
            },
        ),
        migrations.CreateModel(
            name='Listing',
            fields=[
                ('id', models.BigAutoField(primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=200, verbose_name='Title')),
                ('description', models.TextField(verbose_name='Description')),
                ('price', models.DecimalField(decimal_places=2, help_text='Price should be greater than or equal to 0', max_digits=10, verbose_name='Price')),
                ('location', models.CharField(blank=True, max_length=200, verbose_name='Location')),
                ('status', models.CharField(choices=[('DRAFT', 'Draft'), ('PENDING', 'Pending'), ('APPROVED', 'Approved'), ('REJECTED', 'Rejected')], default='PENDING', max_length=20, verbose_name='Status')),
                ('rejected_reason', models.CharField(blank=True, max_length=255, verbose_name='Rejected reason')),
                ('is_active', models.BooleanField(default=True, verbose_name='Active')),
                ('views_count', models.PositiveIntegerField(default=0, verbose_name='Views count')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='Created at')),
                ('updated_at', models.DateTimeField(auto_now=True, verbose_name='Updated at')),
                ('author', models.ForeignKey(on_delete=models.CASCADE, related_name='listings', to=settings.AUTH_USER_MODEL, verbose_name='Author')),
                ('category', models.ForeignKey(on_delete=models.PROTECT, related_name='listings', to='api.category', verbose_name='Category')),
            ],
            options={
                'verbose_name': 'Listing',
                'verbose_name_plural': 'Listings',
                'ordering': ['-created_at'],
            },
        ),
        migrations.CreateModel(
            name='ListingImage',
            fields=[
                ('id', models.BigAutoField(primary_key=True, serialize=False, verbose_name='ID')),
                ('image', models.ImageField(upload_to='listings/%Y/%m/', verbose_name='Image')),
                ('is_main', models.BooleanField(default=False, verbose_name='Main image')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='Created at')),
                ('listing', models.ForeignKey(on_delete=models.CASCADE, related_name='images', to='api.listing', verbose_name='Listing')),
            ],
            options={
                'verbose_name': 'Listing Image',
                'verbose_name_plural': 'Listing Images',
                'ordering': ['-created_at'],
            },
        ),
    ]

# Generated by Django 5.0.9 on 2024-09-26 16:38

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cards', '0002_remove_card_creation_date_remove_card_description_and_more'),
        ('minio_backend', '0003_cardimage'),
    ]

    operations = [
        migrations.AlterField(
            model_name='cardimage',
            name='card',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='card_images', to='cards.card'),
        ),
    ]

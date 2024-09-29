# Generated by Django 5.0.9 on 2024-09-11 23:38

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('announcements', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Collection',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100, unique=True)),
            ],
        ),
        migrations.CreateModel(
            name='Tag',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=50, unique=True)),
            ],
        ),
        migrations.CreateModel(
            name='Card',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('condition', models.CharField(choices=[('perfect', 'Идеальная'), ('pack_fresh', 'Только открытая'), ('minor_wear', 'Немного поигранная'), ('visible_wear', 'Умеренно поигранная'), ('severe_wear', 'Поигранная'), ('damaged', 'Сильно поигранная'), ('destroyed', 'Уничтоженная')], default='minor_wear', max_length=64)),
                ('rarity', models.CharField(choices=[('common', 'Обычная'), ('uncommon', 'Необычная'), ('rare', 'Редкая'), ('mythic', 'Мифическая'), ('epic', 'Эпическая'), ('legendary', 'Легендарная')], default='common', max_length=64)),
                ('creation_date', models.DateField()),
                ('description', models.TextField(default='', max_length=1620)),
                ('announcement', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='announcements.announcement')),
                ('collection', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='cards', to='cards.collection')),
                ('tags', models.ManyToManyField(related_name='cards', to='cards.tag')),
            ],
        ),
        migrations.CreateModel(
            name='CardImage',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('image_url', models.CharField(max_length=255)),
                ('uploaded_at', models.DateTimeField(auto_now_add=True)),
                ('card', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='images', to='cards.card')),
            ],
        ),
    ]

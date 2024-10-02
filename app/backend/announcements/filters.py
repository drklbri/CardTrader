import django_filters
from announcements.models import Announcement
from cards.models import Tag, Collection

class AnnouncementFilter(django_filters.FilterSet):
    condition = django_filters.CharFilter(field_name="card__condition", lookup_expr='exact')
    rarity = django_filters.CharFilter(field_name="card__rarity", lookup_expr='exact')
    tags = django_filters.ModelMultipleChoiceFilter(
        field_name="card__tags__name",  # Проверяем путь к тегам
        queryset=Tag.objects.all(),
        to_field_name='name'
    )
    collection = django_filters.ModelChoiceFilter(field_name="card__collection", queryset=Collection.objects.all())
    name = django_filters.CharFilter(field_name='name', lookup_expr='icontains')

    class Meta:
        model = Announcement
        fields = ['condition', 'rarity', 'tags', 'collection', 'name']

    def filter_queryset(self, queryset):
        queryset = super().filter_queryset(queryset)
        return queryset.distinct()

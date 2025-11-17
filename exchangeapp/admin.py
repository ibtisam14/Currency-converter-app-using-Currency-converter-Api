from django.contrib import admin
from .models import ExchangeRate

@admin.register(ExchangeRate)
class ExchangeRateAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'base_currency',
        'target_currency',
        'exchange_rate',
        'amount',
        'converted_amount',
        'created_at'
    )
    list_filter = ('base_currency', 'target_currency', 'created_at')
    search_fields = ('base_currency', 'target_currency')

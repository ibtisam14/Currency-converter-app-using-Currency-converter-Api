from django.db import models

class ExchangeRate(models.Model):
    base_currency = models.CharField(max_length=10)
    target_currency = models.CharField(max_length=10)
    exchange_rate = models.FloatField()
    amount = models.FloatField(default=1)
    converted_amount = models.FloatField(default=0)
    full_response = models.JSONField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.base_currency} → {self.target_currency}"

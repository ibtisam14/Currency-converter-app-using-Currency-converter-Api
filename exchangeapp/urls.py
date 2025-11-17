from django.urls import path
from .views import ExchangeRateView, home

urlpatterns = [
    path('', home, name='home'),  
    path('exchange/', ExchangeRateView.as_view(), name='exchange_rate'), 
]

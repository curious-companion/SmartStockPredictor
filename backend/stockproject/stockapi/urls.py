from django.urls import path
from .views import get_ohlcv

urlpatterns = [
    path('ohlcv/<str:symbol>/', get_ohlcv, name='get_ohlcv'),
]
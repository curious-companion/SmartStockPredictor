from django.urls import path
from .views import predict_price

urlpatterns = [
    path('<str:symbol>/', predict_price, name='predict_price'),
]

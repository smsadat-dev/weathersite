from django.urls import path

from . import views

app_name = 'app1'

urlpatterns = [
    path('api/', views.get_weather_data),
]

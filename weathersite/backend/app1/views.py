import requests

from django.conf import settings
from django.shortcuts import render
from django.http import JsonResponse , HttpResponseBadRequest
from django.views.decorators.http import require_GET


def get_weather_data(request):
    """
    Django backend endpoint to fetch weather data from OpenWeatherMap.
    """
    location = request.GET.get('location')

    if not location:
        return HttpResponseBadRequest("Location parameter is required.")

    api_url_current = f"http://api.weatherapi.com/v1/current.json?key=76a546cb8e5e413c962181752250207&q={location}"
    api_url_forecast = f"http://api.weatherapi.com/v1/forecast.json?key=76a546cb8e5e413c962181752250207&q={location}&days=7"
     
    combined_data = {}

    try:
        response_current = requests.get(api_url_current)
        response_current.raise_for_status()
        current_weather_data = response_current.json()
        combined_data['current'] = current_weather_data

        response_forecast = requests.get(api_url_forecast)
        response_forecast.raise_for_status()
        forecast_weather_data = response_forecast.json()
        combined_data['forecast'] = forecast_weather_data

        return JsonResponse(combined_data)

    except requests.exceptions.RequestException as e:
        print(f"Error calling http://api.weatherapi.com API: {e}")
        return JsonResponse({"error": "Failed to fetch weather data from external API."}, status=500)
    except ValueError as e:
        print(f"Error parsing http://api.weatherapi.com API: {e}")
        return JsonResponse({"error": "Failed to fetch weather data from external API."}, status=500)
 
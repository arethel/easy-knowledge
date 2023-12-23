from django.contrib.auth import login, authenticate
from django.shortcuts import render, redirect
from pydantic import Json
from .forms import UserCreationForm
from .models import UserSettings
from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import ensure_csrf_cookie
import json

@ensure_csrf_cookie
@require_http_methods(["GET"])
def csrftoken(request):
    return JsonResponse({'csrf': True})

def register(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        form = UserCreationForm(data)
        if form.is_valid():
            user = form.save()
            user_settings = UserSettings(user=user)
            user_settings.save()
            login(request, user)
            return redirect('/')  # Replace 'home' with the name of your homepage URL pattern
    else:
        form = UserCreationForm()
    return JsonResponse({'error': 1, 'details': form.errors})

def login_(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('username')
        password = data.get('password')
        user = authenticate(username=username, password=password)
        if user is not None:
            login(request, user)
            return JsonResponse({'error': 0})
        else:
            return JsonResponse({'error': 1})

@require_http_methods(["POST"])
def change_settings(request):
    if request.user.is_anonymous:
        return JsonResponse({'error': 1, 'anonymous': True})
    
    user = request.user
    settings_instance = get_object_or_404(UserSettings, user=user)

    settings_instance.receive_notifications = request.POST.get('receive_notifications', settings_instance.receive_notifications)

    theme_choice = request.POST.get('theme')
    if theme_choice in dict(UserSettings.THEME_CHOICES):
        settings_instance.theme = theme_choice

    language_choice = request.POST.get('language')
    if language_choice in dict(UserSettings.LANGUAGE_CHOICES):
        settings_instance.language = language_choice

    text_size_choice = request.POST.get('text_size')
    if text_size_choice in dict(UserSettings.TEXT_SIZE_CHOICES):
        settings_instance.text_size = text_size_choice

    text_font_choice = request.POST.get('text_font')
    if text_font_choice in dict(UserSettings.TEXT_FONT_CHOICES):
        settings_instance.text_font = text_font_choice

    settings_instance.save()

    return JsonResponse({'error': 0})

@require_http_methods(["GET"])
@ensure_csrf_cookie
def get_user(request):
    if request.user.is_anonymous:
        return JsonResponse({'error': 1, 'anonymous': True})
    
    user = request.user
    settings_instance = get_object_or_404(UserSettings, user=user)

    return JsonResponse({
        'receive_notifications': settings_instance.receive_notifications,
        'theme': settings_instance.theme,
        'language': settings_instance.language,
        'text_size': settings_instance.text_size,
        'text_font': settings_instance.text_font,
        'username': user.username,
        'email': user.email,
        'error': 0,
    })

@require_http_methods(["POST"])
def change_user_info(request):
    if request.user.is_anonymous:
        return JsonResponse({'error': 1, 'anonymous': True})
    
    user = request.user
    data = json.loads(request.body)
    username = data.get('username')
    password = data.get('password')
    if username is not None:
        user.username = username
    if password is not None:
        user.set_password(password)
    user.save()

    return JsonResponse({'error': 0})
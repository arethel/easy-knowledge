from django.contrib.auth import login, logout, authenticate
from .forms import UserCreationForm
from .models import UserSettings, UserLimitations
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_protect
from django.utils.decorators import method_decorator
import json
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import authentication, permissions
from django.shortcuts import get_object_or_404

class User(viewsets.ViewSet):
    authentication_classes = [authentication.SessionAuthentication]
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        user = request.user
        return Response({
            'username': user.username,
            'email': user.email,
            'error': 0,
        })
    
    def change_username(self, request):
        user = request.user
        username = request.body.get('username')
        if username is None:
            return Response({'error': 1, 'details': 'No username provided'})
        user.username = username
        user.save()
        return Response({'error': 0})

class Authentication(viewsets.ViewSet):
    authentication_classes = [authentication.SessionAuthentication]
    
    @method_decorator(ensure_csrf_cookie)
    def get_user(self, request):
        if not request.user.is_authenticated:
            return Response({'error': 1})
        user = request.user
        settings_instance, created = UserSettings.objects.get_or_create(user=user)
        limitations_instance, created = UserLimitations.objects.get_or_create(user=user)

        return Response({
            'receive_notifications': settings_instance.receive_notifications,
            'theme': settings_instance.theme,
            'language': settings_instance.language,
            'text_size': settings_instance.text_size,
            'text_font': settings_instance.text_font,
            'max_books': limitations_instance.max_books,
            'max_sections': limitations_instance.max_sections,
            'max_questions': limitations_instance.max_questions,
            'used_questions': limitations_instance.used_questions,
            'last_update_questions': limitations_instance.last_update_questions,
            'username': user.username,
            'email': user.email,
            'error': 0,
        })
    
    def register(self, request):
        data = json.loads(request.body)
        form = UserCreationForm(data)
        if form.is_valid():
            user = form.save()
            user_settings = UserSettings(user=user)
            user_settings.save()
            user_limitations = UserLimitations(user=user)
            user_limitations.save()
            login(request, user)
            return Response({'error': 0})
        else:
            return Response({'error': 1, 'details': form.errors})
    
    def login(self, request):
        data = json.loads(request.body)
        username = data.get('username')
        password = data.get('password')
        user = authenticate(username=username, password=password)
        if user is not None:
            login(request, user)
            return Response({'error': 0})
        else:
            return Response({'error': 1})
    
    def logout(self, request):
        logout(request)
        return Response({'error': 0})

class UserSettingsView(viewsets.ViewSet):
    authentication_classes = [authentication.SessionAuthentication]
    permission_classes = [permissions.IsAuthenticated]
    
    def change_settings(self, request):
        user = request.user
        settings_instance = get_object_or_404(UserSettings, user=user)

        settings_instance.receive_notifications = request.body.get('receive_notifications', settings_instance.receive_notifications)

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

        return Response({'error': 0})
    
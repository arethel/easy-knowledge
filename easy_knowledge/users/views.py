from django.contrib.auth import login, logout, authenticate
from .forms import UserCreationForm
from .models import User, UserSettings, UserLimitations
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_protect
from django.utils.decorators import method_decorator
import json
from rest_framework import viewsets, serializers, authentication, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404, redirect
from django.conf import settings
from urllib.parse import urlencode
import logging
log = logging.getLogger(__name__)

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .mixins import PublicApiMixin, ApiErrorsMixin
from .utils import google_get_access_token, google_get_user_info, generate_tokens_for_user
from .serializers import UserSerializer

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
        username = request.data.get('username')
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
        data = request.data
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
        data = request.data
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

    def get_settings(self, request):
        user = request.user
        settings_instance = get_object_or_404(UserSettings, user=user)
        settings_data = {
            'receive_notifications': settings_instance.receive_notifications,
            'theme': settings_instance.theme,
            'language': settings_instance.language,
            'text_size': settings_instance.text_size,
            'text_font': settings_instance.text_font
        }
        return Response(settings_data)
    
    def change_settings(self, request):
        user = request.user
        settings_instance = get_object_or_404(UserSettings, user=user)

        settings_instance.receive_notifications = request.data.get('receive_notifications', settings_instance.receive_notifications)

        theme_choice = request.data.get('theme')
        if theme_choice in dict(UserSettings.THEME_CHOICES):
            settings_instance.theme = theme_choice

        language_choice = request.data.get('language')
        if language_choice in dict(UserSettings.LANGUAGE_CHOICES):
            settings_instance.language = language_choice

        text_size_choice = request.data.get('text_size')
        if text_size_choice in dict(UserSettings.TEXT_SIZE_CHOICES):
            settings_instance.text_size = text_size_choice

        text_font_choice = request.data.get('text_font')
        if text_font_choice in dict(UserSettings.TEXT_FONT_CHOICES):
            settings_instance.text_font = text_font_choice

        settings_instance.save()

        return Response({'error': 0})
    
class GoogleLoginApi(PublicApiMixin, ApiErrorsMixin, APIView):
    class InputSerializer(serializers.Serializer):
        code = serializers.CharField(required=False)
        error = serializers.CharField(required=False)

    def get(self, request, *args, **kwargs):
        input_serializer = self.InputSerializer(data=request.GET)
        input_serializer.is_valid(raise_exception=True)

        validated_data = input_serializer.validated_data

        code = validated_data.get('code')
        error = validated_data.get('error')

        login_url = f'{settings.BASE_FRONTEND_URL}/login'
    
        if error or not code:
            params = urlencode({'error': error})
            return redirect(f'{login_url}?{params}')

        redirect_uri = f'{settings.BASE_FRONTEND_URL}/google/'
        access_token = google_get_access_token(code=code, 
                                               redirect_uri=redirect_uri)

        user_data = google_get_user_info(access_token=access_token)

        try:
            user = User.objects.get(email=user_data['email'])
            access_token, refresh_token = generate_tokens_for_user(user)
            response_data = {
                'user': UserSerializer(user).data,
                'access_token': str(access_token),
                'refresh_token': str(refresh_token)
            }
            return Response(response_data)
        except User.DoesNotExist:
            username = user_data['email'].split('@')[0]
            first_name = user_data.get('given_name', '')
            last_name = user_data.get('family_name', '')

            user = User.objects.create(
                username=username,
                email=user_data['email'],
                first_name=first_name,
                last_name=last_name,
                registration_method='google',
                phone_no=None,
                referral=None
            )
         
            access_token, refresh_token = generate_tokens_for_user(user)
            response_data = {
                'user': UserSerializer(user).data,
                'access_token': str(access_token),
                'refresh_token': str(refresh_token)
            }
            return Response(response_data)
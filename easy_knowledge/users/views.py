from django.contrib.auth import login
from django.shortcuts import render, redirect
from .forms import UserCreationForm
from .models import UserSettings
from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from django.views.decorators.http import require_http_methods

def register(request):
    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            user_settings = UserSettings(user=user)
            user_settings.save()
            login(request, user)
            return redirect('/book')  # Replace 'home' with the name of your homepage URL pattern
    else:
        form = UserCreationForm()
    return render(request, 'registration/register.html', {'form': form})

@login_required
@require_http_methods(["POST"])
def change_settings(request):
    if request.method == 'POST':
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
    else:
        return JsonResponse({'error': 1}, status=405)

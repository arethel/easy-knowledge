from django.db import models
from django.contrib.auth.models import AbstractUser
from datetime import datetime

class User(AbstractUser):
    profile_picture = models.ImageField(upload_to='profile_pics/', null=True, blank=True)
    
    def __str__(self):
        return self.username

class UserLimitations(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='limitations')
    
    max_books = models.IntegerField(default=10)
    max_sections = models.IntegerField(default=3)
    max_questions = models.IntegerField(default=20)
    used_questions = models.IntegerField(default=0)
    last_update_questions = models.DateField(auto_now_add=True)
    
    def get_available_questions(self):
        if self.last_update_questions != datetime.now().date():
            self.used_questions = 0
            self.last_update_questions = datetime.now().date()
            self.save()
        return self.max_questions - self.used_questions
    
    def __str__(self):
        return f"{self.user.username}'s limitations"

class UserSettings(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='settings')
    
    receive_notifications = models.BooleanField(default=True)
    
    THEME_CHOICES = [
        ('Dark', 'Dark'),
        ('Light', 'Light'),
    ]
    theme = models.CharField(max_length=20, choices=THEME_CHOICES, default='Dark')
    
    LANGUAGE_CHOICES = [
        ('English', 'English'),
        ('Spanish', 'Spanish'),
    ]
    language = models.CharField(max_length=20, choices=LANGUAGE_CHOICES, default='English')
    
    TEXT_SIZE_CHOICES = [
        ('Small', 'Small'),
        ('Medium', 'Medium'),
        ('Large', 'Large'),
    ]
    text_size = models.CharField(max_length=20, choices=TEXT_SIZE_CHOICES, default='Medium')
    
    TEXT_FONT_CHOICES = [
        ('Arial', 'Arial'),
        ('Times New Roman', 'Times New Roman'),
    ]
    text_font = models.CharField(max_length=20, choices=TEXT_FONT_CHOICES, default='Arial')


    def __str__(self):
        return f"{self.user.username}'s settings"
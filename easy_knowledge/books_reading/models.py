from django.db import models
from django.conf import settings
import os

def book_directory_path(instance, filename):
    return 'user_{0}/original/{1}'.format(instance.user.id, filename)

def processed_book_directory_path(instance, filename):
    return 'user_{0}/processed/{1}'.format(instance.user.id, filename)

class Book(models.Model):
    title = models.CharField(max_length=200)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    upload_date = models.DateField(auto_now_add=True)
    book_file = models.FileField(upload_to=book_directory_path)

class ProcessedBook(models.Model):
    book = models.ForeignKey(Book, on_delete=models.CASCADE)
    processed_file = models.FileField(upload_to=processed_book_directory_path)
    processed_date = models.DateField(auto_now_add=True)
    processing_version = models.CharField(max_length=100)

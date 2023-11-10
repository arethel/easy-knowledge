from django.db import models
import os

def book_directory_path(instance, filename):
    return os.path.join('books', str(instance.title), filename)

class Book(models.Model):
    title = models.CharField(max_length=200)
    user = models.CharField(max_length=100)
    upload_date = models.DateField(auto_now_add=True)
    book_file = models.FileField(upload_to=book_directory_path)

class ProcessedBook(models.Model):
    book = models.ForeignKey(Book, on_delete=models.CASCADE)
    processed_file = models.FileField(upload_to=book_directory_path)
    processed_date = models.DateField()
    processing_version = models.CharField(max_length=100)

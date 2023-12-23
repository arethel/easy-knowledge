from django.db import models
from django.conf import settings
import os

class Section(models.Model):
    section_name = models.CharField(max_length=200, blank=False, null=False, default='Section')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    creation_date = models.DateField(auto_now_add=True)
    books = models.ManyToManyField(settings.BOOK_MODEL, related_name='sections')
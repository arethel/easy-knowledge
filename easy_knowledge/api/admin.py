from django.contrib import admin

from .models import Book, ProcessedBook, Section, QA, Test, OpenedBook

admin.site.register(Book)
admin.site.register(ProcessedBook)
admin.site.register(Section)
admin.site.register(QA)
admin.site.register(Test)
admin.site.register(OpenedBook)

# Register your models here.

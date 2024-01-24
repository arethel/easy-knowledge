from django.contrib import admin

from .models import User, UserSettings, UserLimitations

admin.site.register(User)
admin.site.register(UserSettings)
admin.site.register(UserLimitations)

# Register your models here.

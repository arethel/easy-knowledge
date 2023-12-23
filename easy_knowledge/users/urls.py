from django.urls import path
from django.contrib.auth import views as auth_views
from . import views

urlpatterns = [
    path('csrftoken/', views.csrftoken, name='csrftoken'),
    path('register/', views.register, name='register'),
    path('login/', auth_views.LoginView.as_view(template_name='registration/login.html'), name='login'),
    path('logout/', auth_views.LogoutView.as_view(), name='logout'),
    path('settings/', views.change_settings, name='settings'),
    path('get-user-data/', views.get_user, name='get-user-data'),
    path('change-user-info/', views.change_user_info, name='change-user-info'),
]
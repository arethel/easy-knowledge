from django.urls import path
from . import views

urlpatterns = [
    path('user/', views.User.as_view({'get':'get'}), name='user'),
    path('user/change-username/', views.User.as_view({'post': 'change_username'}), name='change-username'),
    
    path('auth/get-user/', views.Authentication.as_view({'get': 'get_user'}), name='get-user'),
    path('auth/register/', views.Authentication.as_view({'post': 'register'}), name='register'),
    path('auth/login/', views.Authentication.as_view({'post': 'login'}), name='login'),
    path('auth/logout/', views.Authentication.as_view({'post': 'logout'}), name='logout'),
    
    path('settings/change-settings', views.UserSettingsView.as_view({'poast': 'change_settings'}), name='settings'),
]
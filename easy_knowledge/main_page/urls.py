from django.urls import path
from . import views

urlpatterns = [
    path('create-section/', views.create_section, name='create-section'),
    path('change-section/', views.change_section, name='change-section'),
    path('get-all-sections/', views.get_all_sections, name='get-all-sections'),
]
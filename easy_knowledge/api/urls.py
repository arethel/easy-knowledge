from django.urls import path
from . import views

urlpatterns = [
    path('book/', views.Book.as_view({'get': 'get', 'post': 'upload_book'}), name='book'),
    path('book/change-title/', views.Book.as_view({'post': 'change_title'}), name='change-title'),
    path('book/delete/', views.Book.as_view({'post': 'delete_book'}), name='delete-book'),
    path('book/change-section/', views.Book.as_view({'post': 'change_section'}), name='change-section'),
    
    path('section/', views.Section.as_view({'get': 'get', 'post': 'create_section'}), name='section'),
    path('section/delete/', views.Section.as_view({'post': 'delete_section'}), name='delete-section'),
    path('section/change-section/', views.Section.as_view({'post': 'change_section'}), name='change-section'),
    path('section/get-sections/', views.Section.as_view({'get': 'get_all_sections'}), name='get-sections'),
]
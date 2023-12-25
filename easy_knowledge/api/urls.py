from django.urls import path
from . import views

urlpatterns = [
    path('book/', views.BookView.as_view({'get': 'get', 'post': 'upload_book'}), name='book'),
    path('book/change-title/', views.BookView.as_view({'post': 'change_title'}), name='change-title'),
    path('book/delete/', views.BookView.as_view({'post': 'delete_book'}), name='delete-book'),
    path('book/change-section/', views.BookView.as_view({'post': 'change_section'}), name='change-section'),
    
    path('section/', views.SectionView.as_view({'get': 'get', 'post': 'create_section'}), name='section'),
    path('section/delete/', views.SectionView.as_view({'post': 'delete_section'}), name='delete-section'),
    path('section/change-section/', views.SectionView.as_view({'post': 'change_section'}), name='change-section'),
    path('section/get-sections/', views.SectionView.as_view({'get': 'get_all_sections'}), name='get-sections'),
]
from django.urls import path
from . import views

urlpatterns = [
    path('book/', views.BookView.as_view({'get': 'get', 'post': 'upload_book'}), name='book'),
    path('book/change-title/', views.BookView.as_view({'post': 'change_title'}), name='change-title'),
    path('book/delete/', views.BookView.as_view({'post': 'delete_book'}), name='delete-book'),
    path('book/change-section/', views.BookView.as_view({'post': 'change_section'}), name='change-section'),
    path('book/change-index/', views.BookView.as_view({'post': 'change_index'}), name='change-index'),
    path('book/get-images/', views.BookView.as_view({'get': 'get_images'}), name='get-images'),
    path('book/info/', views.BookUserInfo.as_view({'get': 'get_book_info', 'post': 'set_book_info'}), name='info'),
    
    path('section/', views.SectionView.as_view({'get': 'get', 'post': 'create_section'}), name='section'),
    path('section/delete/', views.SectionView.as_view({'post': 'delete_section'}), name='delete-section'),
    path('section/change-section/', views.SectionView.as_view({'post': 'change_section'}), name='change-section'),
    path('section/all/', views.SectionView.as_view({'get': 'get_all_sections'}), name='get-all-sections'),
    
    path('qa/', views.BookProcessing.as_view({'get': 'get_marked_for_qa', 'post': 'mark_for_qa'}), name='qa'),
    path('qa/test/', views.BookProcessing.as_view({'get': 'get_test', 'post': 'create_test'}), name='test'),
    
    path('processed-books/', views.BookProcessing.as_view({'post': 'get_progress'}), name='get-progress'),

    path('limit/', views.BookProcessing.as_view({'get': 'get_limitations_info'}), name='limit'),
    
    path('opened-books/', views.BookUserInfo.as_view({'get': 'get_opened_books_info', 'post': 'open_book'}), name='opened-books'),
    path('opened-books/close/', views.BookUserInfo.as_view({'post': 'close_book'}), name='close-book'),
    path('opened-books/change/', views.BookUserInfo.as_view({'post': 'change_book'}), name='change-book'),
    path('opened-books/leave-section/', views.BookUserInfo.as_view({'post': 'leave_section'}), name='leave-section'),
    path('opened-books/open-section/', views.BookUserInfo.as_view({'post': 'open_section'}), name='open-section'),
    
]
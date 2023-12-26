from celery import shared_task
from easyknowledge.pdf_processing.pdf import get_epub_from_pdf
from .models import Book, ProcessedBook
from datetime import datetime

@shared_task(ignore_result=True)
def process_book(book_id):
    book = Book.objects.get(id=book_id)
    processed_book = ProcessedBook.objects.get(book=book)
    epub_path = get_epub_from_pdf(book.book_file.path)
    
    processed_book.processed_file.name = epub_path
    processed_book.processing = 100
    processed_book.processed_date = datetime.now()
    processed_book.save()
    
    book.processed = True
    book.save()
    
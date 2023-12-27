from celery import shared_task
from easyknowledge.pdf_processing.pdf import PDFReader
from .models import Book, ProcessedBook, processed_book_directory_path
from datetime import datetime
import time

progress_update_interval = 4

@shared_task(ignore_result=True)
def process_book(book_id):
    book = Book.objects.get(id=book_id)
    processed_book = ProcessedBook.objects.get(book=book)
    pdf_book = PDFReader(book.book_file.path)
    epub_path = processed_book_directory_path(processed_book, book.title + '.epub')
    
    last_progress_update = time.time()
    for progress in pdf_book.to_epub(epub_path):
        if time.time() - last_progress_update > progress_update_interval:
            last_progress_update = time.time()
            processed_book.processing = int(progress * 100)
            processed_book.save()
    
    processed_book.processed_file.name = epub_path
    processed_book.processing = 100
    processed_book.processed_date = datetime.now()
    processed_book.save()
    
    book.processed = True
    book.save()
    
from celery import shared_task
from easyknowledge.pdf_processing.pdf import PDFReader, EpubReader
from easyknowledge.gpt.gpt import create_question
from easyknowledge.user_utils.utils import create_test
from .models import *
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

@shared_task(queue = 'qa', ignore_result=True)
def mark_for_qa(book, qa_info):
    page = qa_info['page']
    block = qa_info['block']
    qa, created = QA.objects.get_or_create(page=page, block=block, book=book)
    if created:
        qa.use = True
        qa.save()
    else:
        qa.use = not qa.use
        qa.save()

gpt_rate_limit = 500
@shared_task(queue = 'generate_qa', ignore_result=True, rate_limit=f'{gpt_rate_limit}/m')
def generate_qa(qa: QA, book_path, page, block, content):
    qa = create_question(content)
    epub_book = EpubReader(book_path)
    epub_book.add_questions_answers(page, block, qa)
    qa.generated = True
    qa.save()
    
@shared_task(queue = 'create_test')
def create_test_c(book, qa_count):
    book_path = book.processed_file.path
    marked_blocks = QA.objects.filter(book=book, use=True)
    test = create_test(qa_count, marked_blocks)
    test_len = len(test)
    test = Test.objects.create(book=book, qa_count=test_len)
    for i in range(test_len):
        qa = QA.objects.get(page=test[i]['page'], block=test[i]['block'], book=book)
        test.qa.add(qa)
        if not qa.generated:
            generate_qa.delay(qa, book_path, test[i]['page'], test[i]['block'], test[i]['content'])
    return test
    
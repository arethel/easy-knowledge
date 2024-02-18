from celery import shared_task
from easyknowledge.pdf_processing.pdf import PDFReader, EpubReader
from easyknowledge.gpt.gpt import create_question
from easyknowledge.user_utils.utils import create_test
from .models import *
from users.models import *
from datetime import datetime
import time
import tempfile
import os
from celery.result import AsyncResult

progress_update_interval = 4

@shared_task(ignore_result=True)
def process_book(book_id):
    book = Book.objects.get(id=book_id)
    processed_book = ProcessedBook.objects.get(book=book)
    pdf_book = PDFReader(book.book_file.path)
    epub_path = processed_book_directory_path(processed_book, book.title + '.epub')
    
    with tempfile.TemporaryDirectory() as temp_dir:
        epub_path = os.path.join(temp_dir, f"{book.title}.epub")

        last_progress_update = time.time()
        for progress, estimated_time in pdf_book.to_epub(epub_path):
            if time.time() - last_progress_update > progress_update_interval:
                last_progress_update = time.time()
                processed_book.processing = int(progress * 100)
                processed_book.time = int(estimated_time)
                processed_book.save()

        print(epub_path)
        
        processed_book.processed_file.save(f"{book.title}.epub", open(epub_path, 'rb'))
        processed_book.processing = 100
        processed_book.time = 0
        processed_book.processed_date = datetime.now()
        processed_book.save()

    book.processed = True
    book.save()

gpt_rate_limit = 500
@shared_task(queue = 'generate_qa', ignore_result=True, rate_limit=f'{gpt_rate_limit}/m')
def generate_qa(qa_id, content):
    qa_ = create_question(content)
    qa_ = qa_.split('<!>')
    qa = QA.objects.get(id=qa_id)
    qa.question = qa_[0].replace('<?>', '')
    qa.answer = qa_[1]
    print(qa.question, qa.answer)
    qa.generated = True
    qa.save()
    
@shared_task(queue = 'create_test')
def create_test_c(user_id, processed_book_id, test_id):
    user = User.objects.get(id=user_id)
    user_limitations = UserLimitations.objects.get(user=user)
    test_db = Test.objects.get(id=test_id)
    qa_count = test_db.qa_count
    processed_book = ProcessedBook.objects.get(id=processed_book_id)
    highlights = processed_book.highlights
    test = create_test(qa_count, highlights)
    test_len = len(test)
    test_db.qa_count = test_len
    test_db.save()
    user_limitations.used_questions += test_len
    user_limitations.save()
    print(test_len)
    for i in range(test_len):
        qa = QA.objects.create(highlight=test[i], test=test_db)
        qa_gen = generate_qa.delay(qa.id, test[i]['text'])
        qa.generation_task_id = qa_gen.id
        qa.save()
    
    return test
    
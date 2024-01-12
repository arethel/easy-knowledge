import os
from django.http import FileResponse
from django.db import IntegrityError, transaction
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import authentication, permissions, status
from django.http.response import JsonResponse
from django.shortcuts import get_object_or_404
from .models import *
from users.models import *
from .tasks import *
import fitz
from PIL import Image
import tempfile
#from easyknowledge.pdf_processing.pdf_utils import extract_pdf_metadata, save_cover_image

def extract_pdf_metadata(pdf_file):
    cover_image = None
    author = None
    title, extension = os.path.splitext(pdf_file.name)

    try:
        pdf_document = fitz.open(stream=pdf_file.read(), filetype="pdf")
        if pdf_document.page_count > 0:
            first_page = pdf_document.load_page(0)
            cover_image = first_page.get_pixmap()
        metadata = pdf_document.metadata
        author = metadata.get("author")

    except Exception as e:
        print(f"Error extracting PDF metadata: {e}")

    return cover_image, author, title

def save_cover_image(pixmap):
    _, temp_pil_image_path = tempfile.mkstemp(suffix='.png')
    pixmap_pil = Image.frombytes("RGB", [pixmap.width, pixmap.height], pixmap.samples)
    pixmap_pil.save(temp_pil_image_path)
    return temp_pil_image_path

class BookUserInfo(viewsets.ViewSet):
    authentication_classes = [authentication.SessionAuthentication]
    permission_classes = [permissions.IsAuthenticated]
    
    def open_section(self, request):
        section_id = request.data.get('section_id')
        user = request.user
        if section_id is None:
            return Response({'error': 1, 'details': 'No section id provided'})
        section = get_object_or_404(Section, id=section_id, user=user)
        opened_books, created = OpenedBook.objects.get_or_create(user=user)
        opened_books.last_section = section
        opened_books.save()
        return Response({'error': 0})
    
    def leave_section(self, request):
        section_id = request.data.get('section_id')
        user = request.user
        if section_id is None:
            return Response({'error': 1, 'details': 'No section id provided'})
        opened_books, created = OpenedBook.objects.get_or_create(user=user)
        if not opened_books.last_section is None and section_id == opened_books.last_section.id:
            opened_books.last_section = None
            opened_books.save()
        return Response({'error': 0})
    
    def change_book(self, request):
        book_id = request.data.get('book_id')
        user = request.user
        if book_id is None:
            return Response({'error': 1, 'details': 'No book id provided'})
        book = get_object_or_404(Book, id=book_id, user=user)
        opened_books, created = OpenedBook.objects.get_or_create(user=user)
        if book not in opened_books.books.all():
            opened_books.books.add(book)
        opened_books.last_book = book
        opened_books.save()
        return Response({'error': 0})
    
    def close_book(self, request):
        book_id = request.data.get('book_id')
        user = request.user
        if book_id is None:
            return Response({'error': 1, 'details': 'No book id provided'})
        book = get_object_or_404(Book, id=book_id, user=user)
        opened_books, created = OpenedBook.objects.get_or_create(user=user)
        if book in opened_books.books.all():
            opened_books.books.remove(book)
            if opened_books.last_book == book:
                if len(opened_books.books.all()) > 0:
                    opened_books.last_book = opened_books.books.last()
                else:
                    opened_books.last_book = None
            opened_books.save()
        return Response({'error': 0})
    
    def open_book(self, request):
        book_id = request.data.get('book_id')
        user = request.user
        if book_id is None:
            return Response({'error': 1, 'details': 'No book id provided'})
        book = get_object_or_404(Book, id=book_id, user=user)
        if not book.processed:
            return Response({'error': 1})
        opened_books, created = OpenedBook.objects.get_or_create(user=user)
        if book not in opened_books.books.all():
            opened_books.books.add(book)
        opened_books.last_section = book.book_section
        opened_books.last_book = book
        opened_books.save()
        return Response({'error': 0})
    
    def get_opened_books_info(self, request):
        user = request.user
        opened_books, created = OpenedBook.objects.get_or_create(user=user)
        books = opened_books.books.all()
        opened_books_data = {}
        for book in books:
            opened_books_data[book.id] = {'title':book.title}
            
        last_section = 0
        last_section_data = {}
        if opened_books.last_section is not None:
            last_section = opened_books.last_section
            section_books = Book.objects.filter(book_section=last_section, user=user)
            last_section_data = {'section_id': last_section.id, 'section_name': last_section.section_name, 'books': {}}
            for book in section_books:
                last_section_data['books'][book.id] = {'title':book.title, 'processed': book.processed}
        else:
            last_section_data = {'section_id': -1, 'section_name': 'Main', 'sections': {}}
            user_sections = Section.objects.filter(user=user)
            sections = {}
            for section in user_sections:
                sections[section.id] = {'section_name': section.section_name}
            last_section_data['sections'] = sections
            
        if opened_books.last_book is not None:
            opened_books_data['selected'] = {'id': opened_books.last_book.id}
        else:
            opened_books_data['selected'] = {'id': -1}
        return Response({'error': 0, 'opened_books_data': opened_books_data, 'last_section_data': last_section_data})
    
    def get_book_info(self, request):
        book_id = request.query_params.get('book_id')
        user = request.user
        if book_id is None:
            return Response({'error': 1, 'details': 'No book id provided'})
        book = get_object_or_404(Book, id=book_id, user=user)
        if not book.processed:
            return Response({'error': 1, 'details': 'Book not processed'})
        processed_book = get_object_or_404(ProcessedBook, book=book, user=user)
        book_info = {'title': book.title, 'page': processed_book.page}
        return Response({'error': 0, 'book_info': book_info})
    
    def set_book_info(self, request):
        book_id = request.data.get('book_id')
        user = request.user
        if book_id is None:
            return Response({'error': 1, 'details': 'No book id provided'})
        book = get_object_or_404(Book, id=book_id, user=user)
        if not book.processed:
            return Response({'error': 1, 'details': 'Book not processed'})
        processed_book = get_object_or_404(ProcessedBook, book=book, user=user)
        page = request.data.get('page')
        if page is None:
            return Response({'error': 1, 'details': 'No page provided'})
        processed_book.page = page
        processed_book.save()
        return Response({'error': 0})

class BookView(viewsets.ViewSet):
    authentication_classes = [authentication.SessionAuthentication]
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        book_id = request.query_params.get('book_id')
        user = request.user
        book = get_object_or_404(Book, id=book_id, user=user)
        if book is None:
            return Response({"error": "Book not found"}, status=404)
        if not book.processed:
            return Response({"error": "Book not processed"}, status=404)
        processed_book = ProcessedBook.objects.get(book=book)
        book_path = processed_book.processed_file.path
        return FileResponse(open(book_path, 'rb'))
    
    def upload_book(self, request):
        section_id = request.data.get('section_id')
        if section_id is None:
            return Response({'error': 1, 'details': 'No section id provided'})
        
        user = request.user

        user_limitations = UserLimitations.objects.get(user=user)
        if user_limitations.max_books == Book.objects.filter(user=user).count():
            return Response({'error': 2, 'details': 'Maximum number of books reached.'})
        
        book_file = request.FILES.get('file')
        if book_file is None:
            return Response({'error': 1, 'details': 'No book file provided'})
        section = get_object_or_404(Section, id=section_id, user=user)
        cover_image, author, title = extract_pdf_metadata(book_file)
        len_books_in_section = len(Book.objects.filter(book_section=section))
        book = Book(book_file=book_file, user=user, title=title, book_section=section, author=author, index=len_books_in_section)
        if cover_image:
            cover_image_path = save_cover_image(cover_image)
            book.cover_image.save(title + '.png', open(cover_image_path, 'rb'))
        cover_image_path = book.cover_image.path
        book.save()
        cover_image_relative_path = book.cover_image.name
        cover_image_path = request.build_absolute_uri(settings.MEDIA_URL + cover_image_relative_path)
        processed_book = ProcessedBook(book=book, user=user)
        processed_book.save()
        process_book.delay(book.id)
        return Response({'error': 0, 'book_id': book.id, 'processing': 0, 'cover_image': cover_image_path})
    
    def change_title(self, request):
        book_id = request.data.get('book_id')
        title = request.data.get('title')
        user = request.user
        if book_id is None:
            return Response({'error': 1, 'details': 'No book id provided'})
        if title is None:
            return Response({'error': 1, 'details': 'No title provided'})
        book = get_object_or_404(Book, id=book_id, user=user)
        book.title = title
        book.save()
        return Response({'error': 0})
    
    def delete_book(self, request):
        book_id = request.data.get('book_id')
        user = request.user
        if book_id is None:
            return Response({'error': 1, 'details': 'No book id provided'})
        book = get_object_or_404(Book, id=book_id, user=user)
        book.delete()
        return Response({'error': 0})
    
    def change_section(self, request):
        book_id = request.data.get('book_id')
        section_id = request.data.get('section_id')
        user = request.user
        if book_id is None:
            return Response({'error': 1, 'details': 'No book id provided'})
        if section_id is None:
            return Response({'error': 1, 'details': 'No section id provided'})
        book = get_object_or_404(Book, id=book_id, user=user)
        last_section = book.book_section
        last_section.books.remove(book)
        
        section = get_object_or_404(Section, id=section_id, user=user)
        book.book_section = section
        book.save()
        return Response({'error': 0})
    
    def change_index(self, request):
        section_id = request.data.get('section_id')
        source_index = request.data.get('source_index')
        destination_index = request.data.get('destination_index')
        user = request.user
        if source_index is None or destination_index is None:
            return Response({'error': 1, 'details': 'No index provided'})
        book1 = get_object_or_404(Book, index=source_index, book_section_id=section_id, user=user)
        book2 = get_object_or_404(Book, index=destination_index, book_section_id=section_id, user=user)
        book1.index, book2.index = destination_index, source_index
        book1.save()
        book2.save()
        return Response({'error': 0})
    
    def get_images(self, request):
        book_id = request.data.get('book_id')
        user = request.user
        if book_id is None:
            return Response({'error': 1, 'details': 'No book id provided'})
        book = get_object_or_404(Book, id=book_id, user=user)
        if not book.processed:
            return Response({'error': 1, 'details': 'Book not processed'})
        processed_book = ProcessedBook.objects.get(book=book)
        
        #some code to get images
        images = processed_book.processed_file.name
        return Response({'error': 0, 'images': images})
    
    def generate_qa(self, request):
        book_id = request.data.get('book_id')
        user = request.user
        if book_id is None:
            return Response({'error': 1, 'details': 'No book id provided'})
        book = get_object_or_404(Book, id=book_id, user=user)
        if not book.processed:
            return Response({'error': 1, 'details': 'Book not processed'})
        processed_book = ProcessedBook.objects.get(book=book)
        
        #some code to generate qa
        qa = processed_book.processed_file.name
        return Response({'error': 0, 'qa': qa})

class SectionView(viewsets.ViewSet):
    authentication_classes = [authentication.SessionAuthentication]
    permission_classes = [permissions.IsAuthenticated]
    
    def change_section(self, request):
        section_id = request.data.get('section_id')
        section_name = request.data.get('section_name')
        user = request.user
        if section_id is None:
            return Response({'error': 1, 'details': 'No section id provided'})
        section = get_object_or_404(Section, id=section_id, user=user)
        if section_name is not None:
            section.section_name = section_name
            section.save()
        return Response({'error': 0, 'data': {'section_name': section.section_name, 'section_id': section.id}})
    
    def create_section(self, request):
        section_name = request.data.get('section_name')
        user = request.user
        user_limitations = UserLimitations.objects.get(user=user)
        if user_limitations.max_sections == Section.objects.filter(user=user).count():
            return Response({'error': 2, 'details': 'Maximum number of sections reached.'})
        if section_name is None:
            return Response({'error': 1, 'details': 'No section name provided'})
        section = Section(section_name=section_name, user=user)
        section.save()
        return Response({'error': 0, 'section_name': section_name, 'section_id': section.id})
    
    def delete_section(self, request):
        section_id = request.data.get('section_id')
        user = request.user
        if section_id is None:
            return Response({'error': 1, 'details': 'No section id provided'})
        section = get_object_or_404(Section, id=section_id, user=user)
        section.delete()
        return Response({'error': 0})
    
    def get(self, request):
        section_id = request.data.get('section_id')
        user = request.user
        section = Section.objects.get(user=user, id=section_id)
        if section is None:
            return Response({"error": "Section not found"}, status=404)
        books = Book.objects.filter(book_section=section)
        return Response({"section_name": section.section_name, "books": books})
    
    def get_all_sections(self, request):
        user = request.user
        sections = Section.objects.filter(user=user)
        section_data = []

        for section in sections:
            books = Book.objects.filter(book_section=section)
            books_data = []

            for book in books:
                book_data = {
                    'id': book.id,
                    'title': book.title,
                    'is_processed': book.processed,
                    'author': book.author,
                    'cover_image': request.build_absolute_uri(book.cover_image.url) if book.cover_image else None,
                    'index': book.index,
                }
                books_data.append(book_data)

            section_info = {
                'id': section.id,
                'section_name': section.section_name,
                'books': books_data,
            }

            section_data.append(section_info)
        #sections = [{'section_name': section.section_name, 'section_id': section.id, 'books': Book.objects.filter(book_section=section)} for section in sections]
        return Response({'error': 0, 'sections': section_data})

class BookProcessing(viewsets.ViewSet):
    authentication_classes = [authentication.SessionAuthentication]
    permission_classes = [permissions.IsAuthenticated]
    
    def process_book(self, request):
        book_id = request.data.get('book_id')
        user = request.user
        if book_id is None:
            return Response({'error': 1, 'details': 'No book id provided'})
        book = get_object_or_404(Book, id=book_id, user=user)
        if book.processed:
            return Response({'error': 1, 'details': 'Book already processed'})
        book.processed = True
        book.save()
        return Response({'error': 0})
    
    def get_progress(self, request):
        book_id = request.data.get('book_id')
        user = request.user
        if book_id is None:
            return Response({'error': 1, 'details': 'No book id provided'})
        book = get_object_or_404(ProcessedBook, book_id=book_id, user=user)
        return Response({'error': 0, 'progress': book.processing})
    
    def mark_for_qa(self, request):
        book_id = request.data.get('book_id')
        qa_info = request.data.get('qa_info')
        user = request.user
        if book_id is None:
            return Response({'error': 1, 'details': 'No book id provided'})
        if qa_info is None:
            return Response({'error': 1, 'details': 'No qa info provided'})
        book = get_object_or_404(Book, id=book_id, user=user)
        if not book.processed:
            return Response({'error': 1, 'details': 'Book not processed'})
        processed_book = ProcessedBook.objects.get(book=book)
        mark_for_qa.delay(processed_book, qa_info)
        return Response({'error': 0})
    
    def get_marked_for_qa(self, request):
        book_id = request.data.get('book_id')
        user = request.user
        if book_id is None:
            return Response({'error': 1, 'details': 'No book id provided'})
        book = get_object_or_404(Book, id=book_id, user=user)
        if not book.processed:
            return Response({'error': 1, 'details': 'Book not processed'})
        processed_book = ProcessedBook.objects.get(book=book)
        qa = QA.objects.filter(book=processed_book, use=True)
        qa = [{'page': qa_.page, 'block': qa_.block} for qa_ in qa]
        return Response({'error': 0, 'qa': qa})
    
    def create_test(self, request):
        book_id = request.data.get('book_id')
        user = request.user
        if book_id is None:
            return Response({'error': 1, 'details': 'No book id provided'})
        book = get_object_or_404(Book, id=book_id, user=user)
        if not book.processed:
            return Response({'error': 1, 'details': 'Book not processed'})
        qa_count = request.data.get('qa_count')
        if qa_count is None:
            return Response({'error': 1, 'details': 'No qa count provided'})
        processed_book = ProcessedBook.objects.get(book=book)
        book_path = processed_book.processed_file.path
        user_limitations = UserLimitations.objects.get(user=user)
        available_qa = user_limitations.get_available_questions()
        if available_qa < qa_count:
            return Response({'error': 2, 'details': 'Not enough questions available', 
                             'available_qa': available_qa, 
                             'users_daily_limit': user_limitations.max_questions})
        result = create_test_c.delay(book, qa_count)
        test = result.get()
        return Response({'error': 0, 'test_id': test.id})
    
    def get_test(self, request):
        test_id = request.data.get('test_id')
        user = request.user
        if test_id is None:
            return Response({'error': 1, 'details': 'No test id provided'})
        test = get_object_or_404(Test, id=test_id, book__user=user)
        book = test.book
        epub_book = EpubReader(book.processed_file.path)
        qa = test.qa.all()
        test_data = []
        for qa_ in qa:
            qa_data = {'page': qa_.page, 'block': qa_.block}
            if qa_.generated:
                qa_data['qa'] = epub_book.get_qa(qa_.page, qa_.block)
            test_data.append(qa_data)
        return Response({'error': 0, 'qa': test_data})
    
    def get_limitations_info(self, request):
        user = request.user
        user_limitations = UserLimitations.objects.get(user=user)
        return Response({'error': 0, 'available_qa': user_limitations.get_available_questions(), 
                         'users_daily_limit': user_limitations.max_questions})
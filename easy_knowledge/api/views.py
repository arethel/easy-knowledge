from django.http import FileResponse
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import authentication, permissions, status
from django.http.response import JsonResponse
from django.shortcuts import get_object_or_404
from .models import *
from users.models import *
from .tasks import *

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

class BookView(viewsets.ViewSet):
    authentication_classes = [authentication.SessionAuthentication]
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        book_id = request.data.get('book_id')
        user = request.user
        book = Book.objects.get(user=user, id=book_id)
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
        
        book_file = request.FILES.get('file')
        user = request.user
        if book_file is None:
            return Response({'error': 1, 'details': 'No book file provided'})
        section = get_object_or_404(Section, id=section_id, user=user)
        title = book_file.name
        book = Book(book_file=book_file, user=user, title=title, book_section=section)
        book.save()
        # processed_book = ProcessedBook(book=book, user=user)
        # processed_book.save()
        # process_book.delay(book.id)
        return Response({'error': 0, 'book_id': book.id, 'processing': 0})
    
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
        return Response({'error': 0})
    
    def create_section(self, request):
        section_name = request.data.get('section_name')
        user = request.user
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
            books_data = [{'id': book.id, 'title': book.title } for book in books]

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
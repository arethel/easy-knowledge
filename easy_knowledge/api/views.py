from django.http import FileResponse
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import authentication, permissions
from django.shortcuts import get_object_or_404
from .models import Book, ProcessedBook, Section
from users.models import UserSettings, UserLimitations
from .tasks import process_book


class BookView(viewsets.ViewSet):
    authentication_classes = [authentication.SessionAuthentication]
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        book_id = request.body.get('book_id')
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
        section_id = request.body.get('section_id')
        if section_id is None:
            return Response({'error': 1, 'details': 'No section id provided'})
        
        book_file = request.FILES.get('file')
        user = request.user
        if section_id is None:
            return Response({'error': 1, 'details': 'No section id provided'})
        if book_file is None:
            return Response({'error': 1, 'details': 'No book file provided'})
        section = get_object_or_404(Section, id=section_id, user=user)
        title = book_file.name
        book = Book(book_file=book_file, user=user, title=title, book_section=section)
        book.save()
        processed_book = ProcessedBook(book=book)
        processed_book.save()
        process_book.delay(book.id)
        return Response({'error': 0, 'book_id': book.id, 'processing': 0})
    
    def change_title(self, request):
        book_id = request.body.get('book_id')
        title = request.body.get('title')
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
        book_id = request.body.get('book_id')
        user = request.user
        if book_id is None:
            return Response({'error': 1, 'details': 'No book id provided'})
        book = get_object_or_404(Book, id=book_id, user=user)
        book.delete()
        return Response({'error': 0})
    
    def change_section(self, request):
        book_id = request.body.get('book_id')
        section_id = request.body.get('section_id')
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

class SectionView(viewsets.ViewSet):
    authentication_classes = [authentication.SessionAuthentication]
    permission_classes = [permissions.IsAuthenticated]
    
    def change_section(self, request):
        section_id = request.body.get('section_id')
        section_name = request.body.get('section_name')
        user = request.user
        if section_id is None:
            return Response({'error': 1, 'details': 'No section id provided'})
        section = get_object_or_404(Section, id=section_id, user=user)
        if section_name is not None:
            section.section_name = section_name
            section.save()
        return Response({'error': 0})
    
    def create_section(self, request):
        section_name = request.body.get('section_name')
        user = request.user
        if section_name is None:
            return Response({'error': 1, 'details': 'No section name provided'})
        section = Section(section_name=section_name, user=user)
        section.save()
        return Response({'error': 0, 'section_name': section_name, 'section_id': section.id})
    
    def delete_section(self, request):
        section_id = request.body.get('section_id')
        user = request.user
        if section_id is None:
            return Response({'error': 1, 'details': 'No section id provided'})
        section = get_object_or_404(Section, id=section_id, user=user)
        section.delete()
        return Response({'error': 0})
    
    def get(self, request):
        section_id = request.body.get('section_id')
        user = request.user
        section = Section.objects.get(user=user, id=section_id)
        if section is None:
            return Response({"error": "Section not found"}, status=404)
        books = Book.objects.filter(book_section=section)
        return Response({"section_name": section.section_name, "books": books})
    
    def get_all_sections(self, request):
        user = request.user
        sections = Section.objects.filter(user=user)
        sections = [{'section_name': section.section_name, 'section_id': section.id, 'books': Book.objects.filter(book_section=section)} for section in sections]
        return Response({'error': 0, 'sections': sections})

class BookProcessing(viewsets.ViewSet):
    authentication_classes = [authentication.SessionAuthentication]
    permission_classes = [permissions.IsAuthenticated]
    
    def process_book(self, request):
        book_id = request.body.get('book_id')
        user = request.user
        if book_id is None:
            return Response({'error': 1, 'details': 'No book id provided'})
        book = get_object_or_404(Book, id=book_id, user=user)
        if book.processed:
            return Response({'error': 1, 'details': 'Book already processed'})
        book.processed = True
        book.save()
        return Response({'error': 0})
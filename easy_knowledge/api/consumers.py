import json
import asyncio
from channels.generic.websocket import AsyncWebsocketConsumer
from .models import Book, ProcessedBook
from easyknowledge.pdf_processing.pdf import PDFReader, EpubReader

class BookProcessingInfo(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()
        user = self.scope["user"]
        while True:
            await asyncio.sleep(2)
            book_processing_info = {}
            books = Book.objects.filter(user=user)
            close_connection = True
            for book in books:
                processed_book = ProcessedBook.objects.get(book=book)
                book_processing_info[book.id] = {'processed': book.processed, 'percentage': processed_book.processing}
                if not book.processed:
                    close_connection = False
            await self.send(text_data=json.dumps(book_processing_info))
            
            if close_connection:
                await self.close()
                break

class CreateTest(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()
        user = self.scope["user"]
        while True:
            await asyncio.sleep(2)
            book_processing_info = {}
            books = Book.objects.filter(user=user)
            close_connection = True
            for book in books:
                processed_book = ProcessedBook.objects.get(book=book)
                book_processing_info[book.id] = {'processed': book.processed, 'percentage': processed_book.processing}
                if not book.processed:
                    close_connection = False
            await self.send(text_data=json.dumps(book_processing_info))
            
            if close_connection:
                await self.close()
                break
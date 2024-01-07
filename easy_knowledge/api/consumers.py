import json
import asyncio
from channels.generic.websocket import AsyncWebsocketConsumer
from .models import *
from easyknowledge.pdf_processing.pdf import PDFReader, EpubReader

class BookProcessingInfo(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()
        user = self.scope["user"]
        while True:
            await asyncio.sleep(2)
            book_processing_info = []
            close_connection = True
            async for book in Book.objects.filter(user=user):
                processed_book = await ProcessedBook.objects.aget(book=book)
                if not book.processed:
                    book_processing_info.append({'book_id': book.id, 'processed': book.processed, 'percentage': processed_book.processing})
                    close_connection = False
            await self.send(text_data=json.dumps(book_processing_info))
            
            if close_connection:
                await self.close()
                break

class GetTestInfo(AsyncWebsocketConsumer):
    def connect(self):
        self.accept()
    
    async def receive(self, message):
        user = self.scope["user"]
        message = json.loads(message)
        test_id = message['test_id']
        test = Test.objects.get(id=test_id, book__user=user)
        while True and not test.is_ready:
            await asyncio.sleep(2)
            test.refresh_from_db()
            await self.send(text_data=json.dumps({'progress': test.get_progress()}))
            if test.is_ready:
                await self.close()
                break
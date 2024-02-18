import json
import asyncio
from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
from .models import *
from users.models import *
from easyknowledge.pdf_processing.pdf import PDFReader, EpubReader
from asgiref.sync import sync_to_async
from celery.result import AsyncResult

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
                book_section = await database_sync_to_async(lambda: book.book_section.to_dict())()
                book_processing_info.append({'book_section': book_section, 'book_id': book.id, 'processed': book.processed, 'percentage': processed_book.processing,'time': processed_book.time, 'title': book.title, 'author': book.author})
                if not book.processed:
                    close_connection = False
            await self.send(text_data=json.dumps(book_processing_info))
            
            if close_connection:
                await self.close()
                break

class GetTestInfo(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()
        user = self.scope["user"]
        try:
            book_id = self.scope['url_route']['kwargs']['book_id']
        except:
            await self.close()
            return
        while True:
            await asyncio.sleep(2)
            test_info = []
            close_connection = True
            user_limitations = await UserLimitations.objects.aget(user=user)
            async for test in Test.objects.filter(book__user=user, book__id=book_id):
                progress = await test.get_progress()
                # print(test.generation_task_id)
                task_id = test.generation_task_id
                failed = await sync_to_async(AsyncResult(task_id).failed)()
                ready = await sync_to_async(AsyncResult(task_id).ready)()
                result = ''
                if ready and not failed:
                    result = await sync_to_async(AsyncResult(task_id).get)()
                if (((failed or result == 'FAILURE') and task_id != '') or task_id == '') and not test.is_ready:
                    test.is_ready = True
                    await sync_to_async(test.save)()
                test_info.append({'id': test.id, 
                                  'name': test.name,
                                  'qa_count': test.qa_count, 
                                  'is_ready': test.is_ready, 
                                  'progress': progress, 
                                  'creation_date': test.creation_date.strftime('%d.%m.%Y')})
                test_info.sort(key=lambda x: x['id'], reverse=False)
                if not test.is_ready:
                    close_connection = False
            limitations = await database_sync_to_async(lambda: user_limitations.get_available_questions())()
            tests_data = {'tests': test_info, 'limitations': limitations}
            await self.send(text_data=json.dumps(tests_data))
            
            if close_connection:
                await self.close()
                break
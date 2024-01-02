from . import consumers
from django.urls import path

websocket_urlpatterns = [
    path('ws/book-processing-info/', consumers.BookProcessingInfo.as_asgi()),
    path('ws/test-processing-info/', consumers.GetTestInfo.as_asgi()),
]
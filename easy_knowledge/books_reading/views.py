from django.shortcuts import render
from django.views.decorators.http import require_http_methods
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse, FileResponse
from .models import Book


def index(request):
    return render(request, 'build/index.html')

@login_required
@require_http_methods(["GET", "POST"])
def book(request):
    if not request.user.is_authenticated:
        return JsonResponse({"error": "User not authenticated"}, status=401)
    
    if request.method == 'GET':
        title = request.GET.get('title')
        username = request.user.username
        file_obj = Book.objects.get(user=username, title=title)
        file_path = file_obj.book_file.path
        return FileResponse(open(file_path, 'rb'))
        data = {
            'username': username,
            "key1": "value1",
            "key2": "value2",
            "key3": "value3"
        }
        return JsonResponse(data)
    
    elif request.method == 'POST':
    
        if request.method == 'POST' and request.FILES['file']:
            uploaded_file = request.FILES['file']
            
            username = request.user.username
            title = request.POST.get('title')
            new_file = Book(user = username, title = title, book_file = uploaded_file)
            new_file.save()
            
            return render(request, 'upload_success.html')
        return render(request, 'upload_form.html')

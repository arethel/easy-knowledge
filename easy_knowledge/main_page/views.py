from django.shortcuts import render
from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from .models import Section
import json

@require_http_methods(["POST"])
def create_section(request):
    if request.user.is_anonymous:
        return JsonResponse({'error': 1, 'anonymous': True})
    
    user = request.user
    data = json.loads(request.body)
    section_name = data.get('section_name')
    if section_name is None:
        return JsonResponse({'error': 1, 'details': 'No section name provided'})
    
    section = Section(section_name=section_name, user=user)
    section.save()

    return JsonResponse({'error': 0, 'section_name': section_name, 'section_id': section.id})

@require_http_methods(["POST"])
def change_section(request):
    if request.user.is_anonymous:
        return JsonResponse({'error': 1, 'anonymous': True})
    
    user = request.user
    data = json.loads(request.body)
    section_id = data.get('section_id')
    if section_id is None:
        return JsonResponse({'error': 1, 'details': 'No section id provided'})
    
    section = get_object_or_404(Section, id=section_id, user=user)
    section_name = data.get('section_name')
    if section_name is not None:
        section.section_name = section_name
        section.save()

    return JsonResponse({'error': 0})

@require_http_methods(["GET"])
def get_all_sections(request):
    if request.user.is_anonymous:
        return JsonResponse({'error': 1, 'anonymous': True})
    
    user = request.user
    sections = Section.objects.filter(user=user)
    sections = [{'section_name': section.section_name, 'section_id': section.id, 'books': section.books} for section in sections]
    return JsonResponse({'error': 0, 'sections': sections})
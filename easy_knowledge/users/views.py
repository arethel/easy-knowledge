from django.contrib.auth import login
from django.shortcuts import render, redirect
from .forms import UserCreationForm

def register(request):
    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            return redirect('home')  # Replace 'home' with the name of your homepage URL pattern
    else:
        form = UserCreationForm()
    return render(request, 'registration/register.html', {'form': form})

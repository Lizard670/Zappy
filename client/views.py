from django.shortcuts import render

def home(request):
    return render(request, 'chat/index.html')

def login(request):
    return render(request, 'login/index.html')
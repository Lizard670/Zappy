from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login as auth_login, logout as auth_logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.contrib import messages
from core.models import Usuario


@login_required(login_url='/login/')
def home(request):
    return render(request, 'chat/index.html')


def logout_view(request):
    auth_logout(request)
    messages.success(request, 'Desconectado com sucesso.')
    return redirect('client:login')


def login(request):
    if request.method == 'POST':
        form_type = request.POST.get('form_type')

        if form_type == 'signin':
            username = request.POST.get('username')
            password = request.POST.get('password')
            user = authenticate(request, username=username, password=password)
            if user is not None:
                auth_login(request, user)
                messages.success(request, 'Login efetuado com sucesso.')
                return redirect('client:home')
            else:
                messages.error(request, 'Usuário ou senha inválidos.')

        elif form_type == 'signup':
            username = request.POST.get('username')
            email = request.POST.get('email')
            password = request.POST.get('password')

            if not username or not password:
                messages.error(request, 'Username e senha são obrigatórios.')
            elif User.objects.filter(username=username).exists():
                messages.error(request, 'Username já existe.')
            else:
                user = User.objects.create_user(username=username, email=email, password=password)
                Usuario.objects.create(user=user)
                user = authenticate(request, username=username, password=password)
                if user is not None:
                    auth_login(request, user)
                    messages.success(request, 'Conta criada e logado.')
                    return redirect('client:home')
                else:
                    messages.error(request, 'Erro ao autenticar após registro.')

    return render(request, 'login/index.html')
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


@login_required(login_url='/login/')
def user_profile(request):
    usuario, _ = Usuario.objects.get_or_create(user=request.user)

    if request.method == 'POST':
        username = request.POST.get('username')
        email = request.POST.get('email')
        full_name = request.POST.get('full_name', '')
        bio = request.POST.get('bio', '')
        foto = request.FILES.get('foto')

        # Checa se o username é diferente do atual e se já existe outro usuário com esse username
        if username and username != request.user.username:
            if User.objects.filter(username=username).exclude(pk=request.user.pk).exists():
                messages.error(request, 'Username já existe.')
                return redirect('client:user_profile')
            request.user.username = username

        request.user.email = email or request.user.email
        # Guarda o nome completo no campo de primeiro nome
        request.user.first_name = full_name
        request.user.save()

        usuario.bio = bio
        if foto:
            usuario.foto = foto
        usuario.save()

        messages.success(request, 'Perfil atualizado com sucesso.')
        return redirect('client:user_profile')

    context = {'usuario': usuario, 'user': request.user}
    return render(request, 'user_profile/index.html', context)
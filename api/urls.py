from django.urls import path
from rest_framework.authtoken.views import obtain_auth_token
from . import views

urlpatterns = [
    path(
        "usuarios/", 
        views.UsuariosListCreate.as_view(), 
        name="usuario-view-create"),
    path(
        "usuario/<int:pk>/", 
        views.UsuarioRetrieveUpdateDestroy.as_view(), 
        name="usuario-view-update"),

    path(
        "imagem/<str:caminho>/", 
        views.ImagemRetrieveUpdateDestroy.as_view(), 
        name="imagem-view-update"),

    path(
        "mensagens/", 
        views.MensagensListCreate.as_view(), 
        name="mensagem-view-create"),
    path(
        "mensagens/<int:chat>/", 
        views.MensagensChatListCreate.as_view(), 
        name="mensagem-chat-view-update"),
    path(
        "mensagem/<int:pk>/", 
        views.MensagemRetrieveUpdateDestroy.as_view(), 
        name="mensagem-view-update"),

    path(
        "membros/", 
        views.MembrosListCreate.as_view(), 
        name="membro-view-create"),

    path(
        "membro/<int:pk>/", 
        views.MembroRetrieveUpdateDestroy.as_view(), 
        name="membro-view-update"),

    path(
        "chats/", 
        views.ChatsListCreate.as_view(), 
        name="chat-view-create"),
    path(
        "chat/<int:pk>/", 
        views.ChatRetrieveUpdateDestroy.as_view(), 
        name="chat-view-update"),

    path(
        "api-token-auth/", 
        obtain_auth_token, 
        name="api_token_auth"),
]

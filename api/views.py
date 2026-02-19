from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import status, generics, response
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication, SessionAuthentication
from core.models import Usuario, Imagem, Mensagem, Chat, Membro
from .serializers import UsuarioSerializer, ImagemSerializer, MensagemSerializer, MembroSerializer, ChatSerializer

def confirmar_presenca(user_or_username, chat):
    """Verifica se o usuário (ou username) é membro do chat.
    Se não for, levanta User.DoesNotExist para compatibilidade com chamadas existentes.
    """
    if isinstance(user_or_username, User):
        user = user_or_username
    else:
        user = User.objects.get(username=user_or_username)
    chat_obj = Chat.objects.get(pk=chat)
    if not chat_obj.membros.filter(pk=user.id).exists():
        raise User.DoesNotExist()

class UsuariosListCreate(generics.ListCreateAPIView):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer
    

class UsuarioRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer
    lookup_field = "pk"
    

class ImagemRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = Imagem.objects.all()
    serializer_class = ImagemSerializer
    lookup_field = "pk"
    

class MensagensListCreate(generics.ListCreateAPIView):
    authentication_classes = [SessionAuthentication, TokenAuthentication]
    permission_classes = [IsAuthenticated]
    queryset = Mensagem.objects.all()
    serializer_class = MensagemSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class MensagensChatListCreate(generics.ListCreateAPIView):
    authentication_classes = [SessionAuthentication, TokenAuthentication]
    permission_classes = [IsAuthenticated]

    serializer_class = MensagemSerializer

    def get_queryset(self):
        chat = self.kwargs.get('chat')
        return Mensagem.objects.filter(chat=chat).order_by('data_envio')

    def get(self, request, *args, **kwargs):
        try:
            confirmar_presenca(request.user, kwargs["chat"])
        except User.DoesNotExist:
            raise PermissionDenied(detail="User not authorized.")
        return super().get(request, *args, **kwargs)

    def perform_create(self, serializer):
        # Ensure user is assigned from request, not client data
        serializer.save(user=self.request.user)

class MensagemRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    authentication_classes = [SessionAuthentication, TokenAuthentication]
    permission_classes = [IsAuthenticated]

    queryset = Mensagem.objects.all()
    serializer_class = MensagemSerializer
    lookup_field = "pk"

    def get(self, request, *args, **kwargs):
        resposta = super().get(self, request, *args, **kwargs)
        try:
            confirmar_presenca(request.user, resposta.data["chat"])
        except User.DoesNotExist:
            raise PermissionDenied(detail="User not authorized.")
        return resposta

    def perform_update(self, serializer):
        # Prevent changing the message owner
        serializer.save()
    

class MembrosListCreate(generics.ListCreateAPIView):
    queryset = Membro.objects.all()
    serializer_class = MembroSerializer

class MembroRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = Membro.objects.all()
    serializer_class = MembroSerializer
    lookup_field = "pk"
        

class ChatsListCreate(generics.ListCreateAPIView):
    queryset = Chat.objects.all()
    serializer_class = ChatSerializer

class ChatRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = Chat.objects.all()
    serializer_class = ChatSerializer
    lookup_field = "pk"


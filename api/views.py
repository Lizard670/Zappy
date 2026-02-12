from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import status, generics, response
from rest_framework.authentication import TokenAuthentication, SessionAuthentication
from .models import Usuario, Imagem, Mensagem, Chat, Membro
from .serializers import UsuarioSerializer, ImagemSerializer, MensagemSerializer, MembroSerializer, ChatSerializer

def confirmar_presenca(username, chat):
    """Se o usuario não estiver no chat, vai levantar uma exceção de User.DoesNotExist"""
    user = User.objects.get(username=username)
    Chat.objects.get(pk=chat).membros.all().get(pk=user.id)

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
    queryset = Mensagem.objects.all()
    serializer_class = MensagemSerializer

class MensagensChatListCreate(generics.ListCreateAPIView):
    authentication_classes = [SessionAuthentication, TokenAuthentication]

    queryset = Mensagem.objects.all().filter()
    serializer_class = MensagemSerializer

    def get(self, request, *args, **kwargs):
        resposta = super().get(self, request, *args, **kwargs)
        resposta.data = [mensagem 
                         for mensagem in resposta.data 
                         if mensagem["chat"] == kwargs["chat"]]

        try:
            confirmar_presenca(request.user, kwargs["chat"])
        except User.DoesNotExist:
            content = {"detail": "User not authorized."}
            return response.Response(content, status=status.HTTP_403_FORBIDDEN)
        
        return resposta

class MensagemRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    authentication_classes = [SessionAuthentication, TokenAuthentication]

    queryset = Mensagem.objects.all()
    serializer_class = MensagemSerializer
    lookup_field = "pk"

    def get(self, request, *args, **kwargs):
        resposta = super().get(self, request, *args, **kwargs)
        
        try:
            confirmar_presenca(request.user, resposta.data["chat"])
        except User.DoesNotExist:
            content = {"detail": "User not authorized."}
            return response.Response(content, status=status.HTTP_403_FORBIDDEN)
        
        return resposta
    

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


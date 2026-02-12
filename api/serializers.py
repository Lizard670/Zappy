from rest_framework import serializers
from .models import Usuario, Mensagem, Imagem, Membro, Chat
from django.contrib.auth.models import User


class ImagemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Imagem
        fields = ["arquivo"]


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "first_name"]


class UsuarioSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    
    class Meta:
        model = Usuario
        fields = ["id", "user", "bio", "foto"]

    def create(self, validated_data):
        user = User.objects.create(**validated_data["user"])

        try:
            usuario = Usuario.objects.create(user=user, bio=validated_data["bio"], foto=validated_data["foto"])
        except Exception as e:
            user.delete()
            raise e
        else:
            return usuario
        
class MembroSerializer(serializers.ModelSerializer):
    class Meta:
        model = Membro
        fields = ["id", "user", "chat", "nivelMembro", "data_entrada"]
        

class ChatSerializer(serializers.ModelSerializer):
    membros = UserSerializer(many=True, required=False)
    
    class Meta:
        model = Chat
        fields = ["id", "tipo", "foto", "nome", "descricao", "membros"]

    def create(self, validated_data):
        return Chat.objects.create(tipo=validated_data["tipo"], 
                                   foto=validated_data["foto"], 
                                   nome=validated_data["nome"], 
                                   descricao=validated_data["descricao"])
        

class MensagemSerializer(serializers.ModelSerializer):
    imagens = ImagemSerializer(many=True, required=False)

    class Meta:
        model = Mensagem
        fields = ["id", "user", "chat", "texto", "data_envio", "imagens"]
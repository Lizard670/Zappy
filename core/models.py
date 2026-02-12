from django.db import models
from django.contrib.auth.models import User
from ulid import ULID

def renomear_arquivo_ulid(instance, filename):
    return f"{ULID()}.jpg"


class Usuario(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    bio = models.TextField(max_length=512, blank=True, null=True)
    foto = models.ImageField(null=True, upload_to=renomear_arquivo_ulid)
        
    class Meta:
        db_table = 'usuario'
        verbose_name = 'Usuário'
        verbose_name_plural = 'Usuários'
    
    def __str__(self):
        return f"username: {self.user.username}"
    


class TipoChat(models.Model):
    nome = models.CharField(max_length=512)
    descricao = models.TextField(max_length=512, blank=True, null=True)
    
    class Meta:
        db_table = 'tipo_chat'
        verbose_name = 'Tipo de Chat'
        verbose_name_plural = 'Tipos de Chat'
    
    def __str__(self):
        return self.nome


class Chat(models.Model):
    tipo = models.ForeignKey(TipoChat, on_delete=models.SET_NULL, null=True)
    foto = models.ImageField(null=True, upload_to=renomear_arquivo_ulid)
    nome = models.CharField(max_length=512)
    descricao = models.TextField(max_length=512, blank=True, null=True)
    membros = models.ManyToManyField(User, through="Membro", blank=True)

    class Meta:
        db_table = 'chat'
        verbose_name = 'Chat'
        verbose_name_plural = 'Chats'
    
    def __str__(self):
        return f"{self.nome}"

class Imagem(models.Model):
    arquivo = models.ImageField(null=True, upload_to=renomear_arquivo_ulid)
    
    class Meta:
        db_table = 'imagem'
        verbose_name = 'Imagem'
        verbose_name_plural = 'Imagens'
    
    def __str__(self):
        return f"Imagem {self.arquivo}"


class Mensagem(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    chat = models.ForeignKey(Chat, on_delete=models.CASCADE)
    imagens = models.ManyToManyField(Imagem, blank=True)
    texto = models.TextField(max_length=8192, blank=True, null=True)
    data_envio = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'mensagem'
        verbose_name = 'Mensagem'
        verbose_name_plural = 'Mensagens'
    
    def __str__(self):
        return f"Mensagem {self.id} de {self.user.username}"


class Membro(models.Model):
    chat = models.ForeignKey(Chat, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    nivelMembro = models.SmallIntegerField(default=0)
    data_entrada = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'membro'
        verbose_name = 'Membro'
        verbose_name_plural = 'Membros'
    
    def __str__(self):
        admin_status = " (Admin)" if self.nivelMembro > 0 else ""
        return f"{self.user.username} em {self.chat.nome}{admin_status}"
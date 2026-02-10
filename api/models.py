from django.db import models
from django.contrib.auth.models import User

class Usuario(models.Model):
    
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    bio = models.TextField(max_length=512, blank=True, null=True)
    caminho_foto = models.CharField(max_length=512, blank=True, null=True)
        
    class Meta:
        db_table = 'usuario'
        verbose_name = 'Usuário'
        verbose_name_plural = 'Usuários'
    
    def __str__(self):
        return f"{self.username} - {self.nome}"
    


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
    id_tipo = models.ForeignKey(TipoChat, on_delete=models.SET_NULL, null=True, db_column='id_tipo')
    caminho_foto = models.CharField(max_length=512, blank=True, null=True)
    nome = models.CharField(max_length=512)
    descricao = models.TextField(max_length=512, blank=True, null=True)
    id_usuario_dono = models.ForeignKey(Usuario, on_delete=models.CASCADE, db_column='id_usuario_dono')
    
    class Meta:
        db_table = 'chat'
        verbose_name = 'Chat'
        verbose_name_plural = 'Chats'
    
    def __str__(self):
        return f"{self.nome} (Dono: {self.id_usuario_dono.username})"


class Mensagem(models.Model):
    id_usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE, db_column='id_usuario')
    id_chat = models.ForeignKey(Chat, on_delete=models.CASCADE, db_column='id_chat')
    id_mensagem_respondida = models.ForeignKey(
        'self', 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        db_column='id_mensagem_respondida'
    )
    texto = models.TextField(max_length=8192, blank=True, null=True)
    id_chat_encaminhada = models.ForeignKey(
        Chat, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name='mensagens_encaminhadas',
        db_column='id_chat_encaminhada'
    )
    data_envio = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'mensagem'
        verbose_name = 'Mensagem'
        verbose_name_plural = 'Mensagens'
        indexes = [
            models.Index(fields=['id_chat', 'data_envio']),
            models.Index(fields=['id_usuario', 'data_envio']),
        ]
    
    def __str__(self):
        return f"Mensagem {self.id_mensagem} de {self.id_usuario.username}"


class Imagem(models.Model):
    caminho_imagem = models.CharField(max_length=512)
    
    class Meta:
        db_table = 'imagem'
        verbose_name = 'Imagem'
        verbose_name_plural = 'Imagens'
    
    def __str__(self):
        return f"Imagem {self.id_imagem} - {self.caminho_imagem}"


class ImagemMensagem(models.Model):
    id_imagem = models.ForeignKey(Imagem, on_delete=models.CASCADE, db_column='id_imagem')
    id_mensagem = models.ForeignKey(Mensagem, on_delete=models.CASCADE, db_column='id_mensagem')
    
    class Meta:
        db_table = 'imagem_mensagem'
        verbose_name = 'Imagem da Mensagem'
        verbose_name_plural = 'Imagens das Mensagens'
        unique_together = ['id_imagem', 'id_mensagem']
    
    def __str__(self):
        return f"Imagem {self.id_imagem.id_imagem} na Mensagem {self.id_mensagem.id_mensagem}"


class Membro(models.Model):
    id_chat = models.ForeignKey(Chat, on_delete=models.CASCADE, db_column='id_chat')
    id_usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE, db_column='id_usuario')
    administrador = models.BooleanField(default=False)
    data_entrada = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'membro'
        verbose_name = 'Membro'
        verbose_name_plural = 'Membros'
        unique_together = ['id_chat', 'id_usuario']
        indexes = [
            models.Index(fields=['id_usuario']),
            models.Index(fields=['id_chat']),
        ]
    
    def __str__(self):
        admin_status = " (Admin)" if self.administrador else ""
        return f"{self.id_usuario.username} em {self.id_chat.nome}{admin_status}"
from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from core.models import TipoChat, Chat, Membro


class MensagemAPITest(TestCase):
	def setUp(self):
		self.client = APIClient()
		self.user = User.objects.create_user(username='u1', password='pass')
		self.other = User.objects.create_user(username='u2', password='pass')
		tipo = TipoChat.objects.create(nome='group')
		self.chat = Chat.objects.create(tipo=tipo, nome='Test Chat')
		# add self.user as member
		Membro.objects.create(chat=self.chat, user=self.user)

	def test_create_message_assigns_user(self):
		self.client.login(username='u1', password='pass')
		payload = {'chat': self.chat.id, 'texto': 'hello'}
		res = self.client.post('/api/mensagens/', payload, format='json')
		self.assertEqual(res.status_code, 201)
		self.assertEqual(res.data['user']['id'], self.user.id)

	def test_list_messages_forbidden_for_non_member(self):
		self.client.login(username='u2', password='pass')
		res = self.client.get(f'/api/mensagens/{self.chat.id}/')
		self.assertEqual(res.status_code, 403)

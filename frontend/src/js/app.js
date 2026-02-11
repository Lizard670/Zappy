/**
 * Zappy - Script Unificado
 * Gerencia a interface, Mocks (Simulações) e ApiService.
 */

const mockUser = {
    id: 'user-1',
    name: 'Eu',
    status: 'online',
    avatar: 'https://images.unsplash.com/photo-1535711811017-e3111ad03665?auto=format&fit=crop&w=500&q=60'
};

const mockChats = [
    {
        id: 'conversation-1',
        name: 'Nick',
        lastMessage: 'Oi, tudo bem?',
        time: '12:30',
        unreadCount: 5,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=60',
        messages: [
            { id: 'm1', sender: 'other', text: 'Olá! Como vão os estudos?', time: '12:20' },
            { id: 'm2', sender: 'me', text: 'Tudo ótimo, avançando bem no projeto Zappy!', time: '12:30' }
        ]
    },
    {
        id: 'conversation-2',
        name: 'Inba',
        lastMessage: 'Como vai o projeto?',
        time: '10:15',
        unreadCount: 0,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=60',
        messages: [
            { id: 'm3', sender: 'other', text: 'Oi! Você viu a nova atualização do backend?', time: '10:10' },
            { id: 'm4', sender: 'me', text: 'Ainda não, vou conferir agora.', time: '10:15' }
        ]
    },
    { id: 'c3', name: 'Someone', lastMessage: 'Lorem ipsum dolor s...', time: '12:36', unreadCount: 5, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=60', messages: [] },
    { id: 'c4', name: 'Someone', lastMessage: 'Lorem ipsum dolor s...', time: '12:35', unreadCount: 0, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=60', messages: [] },
    { id: 'c5', name: 'Someone', lastMessage: 'Lorem ipsum dolor s...', time: '12:34', unreadCount: 5, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=60', messages: [] },
    { id: 'c6', name: 'Someone', lastMessage: 'Lorem ipsum dolor s...', time: '12:33', unreadCount: 0, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=60', messages: [] }
];

const ApiService = {
    getChats: async () => mockChats,
    getUser: async () => mockUser,
    sendMessage: async (id, text) => ({ success: true })
};

class ZappyApp {
    constructor() {
        this.currentChatId = null;
        this.init();
    }

    async init() {
        console.log('Zappy Iniciado.');
        const user = await ApiService.getUser();
        const profileImg = document.querySelector('.chat-sidebar-profile-toggle img');
        if (profileImg) profileImg.src = user.avatar;

        this.loadChats();
        this.setupGlobals();
    }

    async loadChats() {
        const chats = await ApiService.getChats();
        const chatList = document.querySelector('.content-messages-list');
        if (!chatList) return;

        chatList.innerHTML = '<div class="content-message-title">Recently</div>';
        chats.forEach(chat => {
            const li = document.createElement('li');
            li.innerHTML = `
                <a href="#" data-id="${chat.id}">
                    <img class="content-message-image" src="${chat.avatar}" alt="">
                    <div class="content-message-info">
                        <div class="content-message-name">${chat.name}</div>
                        <div class="content-message-text">${chat.lastMessage}</div>
                    </div>
                    <div class="content-message-more">
                        ${chat.unreadCount > 0 ? `<div class="content-message-unread">${chat.unreadCount}</div>` : ''}
                        <div class="content-message-time">${chat.time}</div>
                    </div>
                </a>
            `;
            li.onclick = (e) => {
                e.preventDefault();
                this.selectChat(chat.id);
            };
            chatList.appendChild(li);
        });
    }

    setupGlobals() {
        const profileToggle = document.querySelector('.chat-sidebar-profile-toggle');
        if (profileToggle) {
            profileToggle.onclick = (e) => {
                e.preventDefault();
                profileToggle.closest('.chat-sidebar-profile').classList.toggle('active');
            };
        }
    }

    async selectChat(chatId) {
        this.currentChatId = chatId;
        const chats = await ApiService.getChats();
        const chat = chats.find(c => c.id === chatId);
        if (!chat) return;

        document.querySelector('.conversation-default').classList.remove('active');
        const wrapper = document.getElementById('conversations-wrapper');

        wrapper.innerHTML = `
            <div class="conversation active" id="${chat.id}">
                <div class="conversation-top">
                    <div class="conversation-user">
                        <img class="conversation-user-image" src="${chat.avatar}" alt="">
                        <div>
                            <div class="conversation-user-name">${chat.name}</div>
                            <div class="conversation-user-status online">online</div>
                        </div>
                    </div>
                    <div class="conversation-buttons">
                        <button type="button"><i class="ri-phone-line"></i></button>
                        <button type="button"><i class="ri-vidicon-line"></i></button>
                        <button type="button"><i class="ri-information-line"></i></button>
                    </div>
                </div>
                <div class="conversation-main">
                    <ul class="conversation-wrapper">
                        ${chat.messages.map(msg => `
                            <li class="conversation-item ${msg.sender === 'me' ? 'me' : ''}">
                                ${msg.sender === 'other' ? `<div class="conversation-item-side"><img class="conversation-item-image" src="${chat.avatar}"></div>` : ''}
                                <div class="conversation-item-box">
                                    <div class="conversation-item-text">
                                        <p>${msg.text}</p>
                                        <span class="conversation-item-time">${msg.time}</span>
                                    </div>
                                </div>
                            </li>
                        `).join('')}
                    </ul>
                </div>
                <div class="conversation-form">
                    <button type="button" class="conversation-form-button"><i class="ri-emotion-line"></i></button>
                    <div class="conversation-form-group">
                        <textarea class="conversation-form-input" rows="1" placeholder="Type here..."></textarea>
                        <button type="button" class="conversation-form-record"><i class="ri-mic-line"></i></button>
                    </div>
                    <button type="button" class="conversation-form-button conversation-form-submit"><i class="ri-send-plane-2-line"></i></button>
                </div>
            </div>
        `;
        this.setupForm();
    }

    setupForm() {
        const input = document.querySelector('.conversation-form-input');
        const submit = document.querySelector('.conversation-form-submit');
        if (!input || !submit) return;

        const send = async () => {
            const val = input.value.trim();
            if (val) {
                console.log("Enviando:", val);
                input.value = '';
            }
        };

        submit.onclick = send;
        input.onkeydown = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } };
    }
}

document.addEventListener('DOMContentLoaded', () => new ZappyApp());

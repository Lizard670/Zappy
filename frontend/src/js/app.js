/**
 * Zappy - Chat
 * Gerencia a interface, Mocks (Simulações) e ApiService.
 */

const mockUser = {
    id: 'user-1',
    username: 'zappy_user',
    name: 'Eu',
    status: 'online',
    bio: 'Apaixonado por tecnologia e chat apps!',
    avatar: 'https://images.unsplash.com/photo-1535711811017-e3111ad03665?auto=format&fit=crop&w=500&q=60'
};

const mockChats = [
    {
        id: 'conversation-1',
        username: 'nick_dev',
        name: 'Nick',
        bio: 'Frontend enthusiast & coffee lover ☕',
        lastMessage: 'Oi, tudo bem?',
        time: '12:30',
        unreadCount: 5,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=60',
        messages: [
            { id: 'm1', sender: 'other', text: 'Olá! Como vão os estudos?', time: '12:20' },
            { id: 'm2', sender: 'me', text: 'Tudo ótimo, avançando bem no projeto Zappy!', time: '12:30' },
            { id: 'm-audio', sender: 'other', type: 'audio', duration: '00:15', audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', time: '12:35' },
            { id: 'm-file', sender: 'me', type: 'file', fileName: 'projeto_v1.pdf', fileSize: '1.2 MB', dataUrl: '#', time: '12:40' }
        ]
    },
    {
        id: 'conversation-2',
        username: 'inba_offic',
        name: 'Inba',
        bio: 'Product Designer at Zappy Corp.',
        lastMessage: 'Como vai o projeto?',
        time: '10:15',
        unreadCount: 0,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=60',
        messages: [
            { id: 'm3', sender: 'other', text: 'Oi! Você viu a nova atualização do backend?', time: '10:10' },
            { id: 'm4', sender: 'me', text: 'Ainda não, vou conferir agora.', time: '10:15' }
        ]
    },
    { id: 'c3', username: 'someone_1', name: 'Someone', bio: 'Living the dream.', lastMessage: 'Lorem ipsum dolor s...', time: '12:36', unreadCount: 5, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=60', messages: [] },
    { id: 'c4', username: 'someone_2', name: 'Someone', bio: '...', lastMessage: 'Lorem ipsum dolor s...', time: '12:35', unreadCount: 0, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=60', messages: [] },
    { id: 'c5', username: 'someone_3', name: 'Someone', bio: 'Available', lastMessage: 'Lorem ipsum dolor s...', time: '12:34', unreadCount: 5, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=60', messages: [] },
    { id: 'c6', username: 'someone_4', name: 'Someone', bio: 'Stay tuned!', lastMessage: 'Lorem ipsum dolor s...', time: '12:33', unreadCount: 0, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=60', messages: [] }
];

const ApiService = {
    getChats: async () => mockChats,
    getUser: async () => mockUser,
    sendMessage: async (id, text) => ({ success: true }),
    updateProfile: async (data) => {
        Object.assign(mockUser, data);
        return { success: true };
    }
};

class ZappyApp {
    constructor() {
        if (window.location.hash === '#auth') {
            localStorage.setItem('zappy_auth', 'true');
            history.replaceState(null, null, ' ');
        }

        const isAuth = localStorage.getItem('zappy_auth');
        if (!isAuth) {
            window.location.href = "auth/index.html";
            return;
        }

        this.currentChatId = null;
        this.playingAudio = null;
        this.init();
    }

    async init() {
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

        // Abrir Perfil Próprio
        const profileLink = document.querySelector('.chat-sidebar-profile-dropdown li:first-child a');
        if (profileLink) {
            profileLink.onclick = (e) => {
                e.preventDefault();
                profileToggle.closest('.chat-sidebar-profile').classList.remove('active');
                this.openMyProfile();
            };
        }

        // Close Drawers
        document.querySelectorAll('.drawer-close').forEach(btn => {
            btn.onclick = () => btn.closest('.drawer').classList.remove('active');
        });

        // Save Profile
        const saveBtn = document.getElementById('save-profile-btn');
        if (saveBtn) {
            saveBtn.onclick = () => this.saveMyProfile();
        }
    }

    async openMyProfile() {
        const user = await ApiService.getUser();
        document.getElementById('my-profile-img').src = user.avatar;
        document.getElementById('my-profile-name').value = user.name;
        document.getElementById('my-profile-username').value = user.username || '';
        document.getElementById('my-profile-bio').value = user.bio || '';
        document.getElementById('my-profile-drawer').classList.add('active');
    }

    async saveMyProfile() {
        const data = {
            name: document.getElementById('my-profile-name').value,
            username: document.getElementById('my-profile-username').value,
            bio: document.getElementById('my-profile-bio').value
        };

        const res = await ApiService.updateProfile(data);
        if (res.success) {
            document.getElementById('my-profile-drawer').classList.remove('active');
            const profileImg = document.querySelector('.chat-sidebar-profile-toggle img');
            if (profileImg) profileImg.src = mockUser.avatar;
            alert('Perfil atualizado com sucesso!');
        }
    }

    async openContactProfile(chatId) {
        const chats = await ApiService.getChats();
        const chat = chats.find(c => c.id === chatId);
        if (!chat) return;

        document.getElementById('contact-profile-img').src = chat.avatar;
        document.getElementById('contact-profile-name').innerText = chat.name;
        document.getElementById('contact-profile-username').innerText = `@${chat.username || 'user'}`;
        document.getElementById('contact-profile-bio').innerText = chat.bio || 'Sem bio disponível.';
        document.getElementById('contact-profile-status').innerText = 'online';
        document.getElementById('contact-profile-drawer').classList.add('active');
    }

    async selectChat(chatId) {
        this.currentChatId = chatId;
        const chats = await ApiService.getChats();
        const chat = chats.find(c => c.id === chatId);
        if (!chat) return;

        document.querySelector('.conversation-default').classList.remove('active');
        const wrapper = document.getElementById('conversations-wrapper');

        const renderMessageContent = (msg) => {
            if (msg.type === 'image') {
                return `
                    <img src="${msg.image}" class="message-image" onclick="window.open('${msg.image}', '_blank')">
                    ${msg.text ? `<p>${msg.text}</p>` : ''}
                `;
            } else if (msg.type === 'audio') {
                return `
                    <div class="message-audio" id="audio-container-${msg.id}">
                        <button class="audio-play-btn" onclick="zappy.toggleAudio('${msg.id}', '${msg.audio || '#'}')">
                            <i class="ri-play-fill" id="play-icon-${msg.id}"></i>
                        </button>
                        <div class="audio-waveform-mini">
                            <div class="audio-progress" id="progress-${msg.id}"></div>
                        </div>
                        <span class="audio-duration" id="duration-${msg.id}">${msg.duration || '00:00'}</span>
                    </div>
                `;
            } else if (msg.type === 'file') {
                return `
                    <a href="${msg.dataUrl || '#'}" download="${msg.fileName}" class="message-file">
                        <i class="ri-file-text-line file-icon"></i>
                        <div class="file-info">
                            <span class="file-name">${msg.fileName}</span>
                            <span class="file-size">${msg.fileSize}</span>
                        </div>
                    </a>
                `;
            }
            return `<p>${msg.text}</p>`;
        };

        wrapper.innerHTML = `
            <div class="conversation active" id="${chat.id}">
                <div class="conversation-top">
                    <div class="conversation-user" onclick="zappy.openContactProfile('${chat.id}')" style="cursor: pointer;">
                        <img class="conversation-user-image" src="${chat.avatar}" alt="">
                        <div>
                            <div class="conversation-user-name">${chat.name}</div>
                            <div class="conversation-user-status online">online</div>
                        </div>
                    </div>
                    <div class="conversation-buttons">
                        <button type="button"><i class="ri-phone-line"></i></button>
                        <button type="button"><i class="ri-vidicon-line"></i></button>
                        <button type="button" onclick="zappy.openContactProfile('${chat.id}')"><i class="ri-information-line"></i></button>
                    </div>
                </div>
                <div class="conversation-main">
                    <ul class="conversation-wrapper">
                        ${chat.messages.map(msg => `
                            <li class="conversation-item ${msg.sender === 'me' ? 'me' : ''}">
                                ${msg.sender === 'other' ? `<div class="conversation-item-side" onclick="zappy.openContactProfile('${chat.id}')" style="cursor: pointer;"><img class="conversation-item-image" src="${chat.avatar}"></div>` : ''}
                                <div class="conversation-item-box">
                                    <div class="conversation-item-text">
                                        ${renderMessageContent(msg)}
                                        <span class="conversation-item-time">${msg.time}</span>
                                    </div>
                                </div>
                            </li>
                        `).join('')}
                    </ul>
                </div>
                <div class="conversation-form">
                    <button type="button" class="conversation-form-button" id="attach-button"><i class="ri-attachment-line"></i></button>
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

    formatTime(seconds) {
        if (isNaN(seconds)) return '00:00';
        const m = Math.floor(seconds / 60);
        const s = Math.floor(seconds % 60);
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }

    toggleAudio(msgId, audioSrc) {
        if (this.playingAudio && this.playingAudio.msgId === msgId) {
            if (this.playingAudio.audio.paused) {
                this.playingAudio.audio.play();
                const icon = document.getElementById(`play-icon-${msgId}`);
                if (icon) icon.className = 'ri-pause-fill';
            } else {
                this.playingAudio.audio.pause();
                const icon = document.getElementById(`play-icon-${msgId}`);
                if (icon) icon.className = 'ri-play-fill';
            }
            return;
        }

        if (this.playingAudio) {
            this.playingAudio.audio.pause();
            const oldIcon = document.getElementById(`play-icon-${this.playingAudio.msgId}`);
            if (oldIcon) oldIcon.className = 'ri-play-fill';
            const oldDuration = document.getElementById(`duration-${this.playingAudio.msgId}`);
            if (oldDuration && this.playingAudio.totalTime) {
                oldDuration.innerText = this.playingAudio.totalTime;
            }
        }

        const audio = new Audio(audioSrc);
        this.playingAudio = { msgId, audio, totalTime: null };

        audio.onloadedmetadata = () => {
            const timeStr = this.formatTime(audio.duration);
            this.playingAudio.totalTime = timeStr;
            const durEl = document.getElementById(`duration-${msgId}`);
            if (durEl) durEl.innerText = timeStr;
        };

        audio.ontimeupdate = () => {
            const progress = (audio.currentTime / audio.duration) * 100;
            const progEl = document.getElementById(`progress-${msgId}`);
            if (progEl) progEl.style.width = `${progress}%`;

            const durEl = document.getElementById(`duration-${msgId}`);
            if (durEl) durEl.innerText = this.formatTime(audio.currentTime);
        };

        audio.onended = () => {
            const playIcon = document.getElementById(`play-icon-${msgId}`);
            const progEl = document.getElementById(`progress-${msgId}`);
            const durEl = document.getElementById(`duration-${msgId}`);
            if (playIcon) playIcon.className = 'ri-play-fill';
            if (progEl) progEl.style.width = '0%';
            if (durEl && this.playingAudio.totalTime) {
                durEl.innerText = this.playingAudio.totalTime;
            }
            this.playingAudio = null;
        };

        audio.play();
        const playIcon = document.getElementById(`play-icon-${msgId}`);
        if (playIcon) playIcon.className = 'ri-pause-fill';
    }

    setupForm() {
        const input = document.querySelector('.conversation-form-input');
        const submit = document.querySelector('.conversation-form-submit');
        const attachBtn = document.querySelector('#attach-button');
        const fileInput = document.querySelector('#image-input');

        if (!input || !submit) return;

        if (attachBtn && fileInput) {
            attachBtn.onclick = () => fileInput.click();
            fileInput.onchange = (e) => {
                const file = e.target.files[0];
                if (file) {
                    const isImage = file.type.startsWith('image/');
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        if (isImage) {
                            this.showPreview(event.target.result);
                        } else {
                            this.sendFile(event.target.result, file.name, (file.size / 1024).toFixed(1) + ' KB');
                        }
                    };
                    reader.readAsDataURL(file);
                }
            };
        }

        const recordBtn = document.querySelector('.conversation-form-record');
        if (recordBtn) {
            recordBtn.onclick = () => this.startVoiceRecording();
        }

        const cancelVoiceBtn = document.getElementById('cancel-recording');
        const sendVoiceBtn = document.getElementById('stop-send-recording');

        if (cancelVoiceBtn) {
            cancelVoiceBtn.onclick = () => this.stopVoiceRecording(true);
        }
        if (sendVoiceBtn) {
            sendVoiceBtn.onclick = () => this.stopVoiceRecording(false);
        }

        const send = async () => {
            const val = input.value.trim();
            if (val) {
                this.addMessage('me', val);
                input.value = '';
            }
        };

        submit.onclick = send;
        input.onkeydown = (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                send();
            }
        };

        const modal = document.getElementById('image-preview-modal');
        const closeBtn = document.getElementById('close-preview');
        const sendImgBtn = document.getElementById('send-image-btn');
        const captionInput = document.getElementById('caption-input');

        if (modal && closeBtn && sendImgBtn) {
            closeBtn.onclick = () => modal.classList.remove('active');
            sendImgBtn.onclick = () => {
                const caption = captionInput.value.trim();
                this.sendImage(this.pendingImage, caption);
                modal.classList.remove('active');
                captionInput.value = '';
            };
        }
    }

    showPreview(dataUrl) {
        this.pendingImage = dataUrl;
        const modal = document.getElementById('image-preview-modal');
        const imgTag = document.getElementById('preview-img-tag');
        if (modal && imgTag) {
            imgTag.src = dataUrl;
            modal.classList.add('active');
        }
    }

    async startVoiceRecording() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            this.mediaRecorder = new MediaRecorder(stream);
            this.audioChunks = [];

            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const source = this.audioContext.createMediaStreamSource(stream);
            this.analyser = this.audioContext.createAnalyser();
            source.connect(this.analyser);

            const overlay = document.getElementById('voice-recording-overlay');
            if (overlay) overlay.classList.add('active');

            this.mediaRecorder.ondataavailable = (e) => this.audioChunks.push(e.data);
            this.mediaRecorder.onstop = () => {
                const blob = new Blob(this.audioChunks, { type: 'audio/ogg; codecs=opus' });
                const reader = new FileReader();
                reader.onload = (e) => {
                    this.addMessage('me', '', null, 'audio', e.target.result, this.lastDuration);
                };
                reader.readAsDataURL(blob);
                stream.getTracks().forEach(t => t.stop());
            };

            this.mediaRecorder.start();
            this.recordingStartTime = Date.now();
            this.timerInterval = setInterval(() => this.updateVoiceTimer(), 100);

            requestAnimationFrame(() => this.drawWaveform());
        } catch (err) {
            alert("Erro ao acessar microfone: " + err.message);
        }
    }

    updateVoiceTimer() {
        const diff = Date.now() - this.recordingStartTime;
        const sec = Math.floor(diff / 1000);
        const timeStr = `${Math.floor(sec / 60).toString().padStart(2, '0')}:${(sec % 60).toString().padStart(2, '0')}`;
        const timerEl = document.querySelector('.voice-timer');
        if (timerEl) timerEl.innerText = timeStr;
        this.lastDuration = timeStr;
    }

    drawWaveform() {
        const canvas = document.getElementById('voice-waveform');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;

        const bufferLength = this.analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const renderFrame = () => {
            if (!this.mediaRecorder || this.mediaRecorder.state !== 'recording') return;
            requestAnimationFrame(renderFrame);
            this.analyser.getByteTimeDomainData(dataArray);

            ctx.fillStyle = '#f8fafc';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.lineWidth = 2;
            ctx.strokeStyle = '#10b981';
            ctx.beginPath();

            const sliceWidth = canvas.width / bufferLength;
            let x = 0;

            for (let i = 0; i < bufferLength; i++) {
                const v = dataArray[i] / 128.0;
                const y = (v * canvas.height / 2);
                if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
                x += sliceWidth;
            }
            ctx.stroke();
        };
        renderFrame();
    }

    stopVoiceRecording(cancel) {
        if (!this.mediaRecorder) return;
        clearInterval(this.timerInterval);
        const overlay = document.getElementById('voice-recording-overlay');
        if (overlay) overlay.classList.remove('active');

        if (cancel) {
            this.mediaRecorder.onstop = null;
            this.mediaRecorder.stop();
        } else {
            this.mediaRecorder.stop();
        }
        this.mediaRecorder = null;
    }

    sendFile(dataUrl, fileName, fileSize) {
        this.addMessage('me', '', null, 'file', dataUrl, null, fileName, fileSize);
    }

    sendImage(dataUrl, caption = '') {
        this.addMessage('me', caption, dataUrl, 'image');
    }

    addMessage(sender, text, image = null, type = 'text', audio = null, duration = null, fileName = null, fileSize = null) {
        const chat = mockChats.find(c => c.id === this.currentChatId);
        if (!chat) return;

        const newMsg = {
            id: Date.now().toString(),
            sender,
            text,
            image,
            type,
            audio,
            duration,
            fileName,
            fileSize,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        chat.messages.push(newMsg);
        this.selectChat(this.currentChatId);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.zappy = new ZappyApp();
});

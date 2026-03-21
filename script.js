// ========== openSIA - ПОЛНАЯ ЛОГИКА ==========
(function() {
    'use strict';

    // ========== КОНФИГУРАЦИЯ ==========
    const API_URL = 'http://localhost:3000/api/chat';
    
    // ========== ПЕРЕМЕННЫЕ ==========
    let currentTheme = 'dark';
    let creativity = 1.2;
    let maxTokens = 2048;
    let autoScroll = true;
    let showTime = true;
    let isTyping = false;
    
    // ========== DOM ЭЛЕМЕНТЫ ==========
    let messagesContainer, chatInput, sendBtn, typingIndicator;
    let creativitySlider, creativityValue, maxTokensSelect;
    let autoScrollCheck, showTimeCheck;
    let themeBtns, themeOptions;
    let openChatBtn, learnBtn, saveSettingsBtn, resetSettingsBtn;
    let showQRBtn, closeQrModal, qrModal, downloadQrBigBtn;
    let sidebar, sidebarToggle;
    
    // ========== ИНИЦИАЛИЗАЦИЯ ==========
    document.addEventListener('DOMContentLoaded', function() {
        console.log('%c🚀 openSIA PREMIUM ЗАПУЩЕНА!', 'color: #8774E1; font-size: 18px; font-weight: bold;');
        
        initElements();
        initPreloader();
        initCanvas();
        initTheme();
        initChat();
        initSettings();
        initQRCode();
        initEvents();
        loadSettings();
        initCursor();
        initAnimations();
        
        console.log('%c✅ openSIA готова к работе!', 'color: #4ECDC4; font-size: 16px;');
    });
    
    // ========== ИНИЦИАЛИЗАЦИЯ ЭЛЕМЕНТОВ ==========
    function initElements() {
        messagesContainer = document.getElementById('chatMessages');
        chatInput = document.getElementById('chatInput');
        sendBtn = document.getElementById('chatSendBtn');
        typingIndicator = document.getElementById('chatTyping');
        
        creativitySlider = document.getElementById('creativitySlider');
        creativityValue = document.getElementById('creativityValue');
        maxTokensSelect = document.getElementById('maxTokens');
        
        autoScrollCheck = document.getElementById('autoScroll');
        showTimeCheck = document.getElementById('showTime');
        
        themeBtns = document.querySelectorAll('.theme-btn');
        themeOptions = document.querySelectorAll('.theme-option');
        
        openChatBtn = document.getElementById('openChatBtn');
        learnBtn = document.getElementById('learnBtn');
        saveSettingsBtn = document.getElementById('saveSettingsBtn');
        resetSettingsBtn = document.getElementById('resetSettingsBtn');
        
        showQRBtn = document.getElementById('showQRBtn');
        closeQrModal = document.getElementById('closeQrModal');
        qrModal = document.getElementById('qrModal');
        downloadQrBigBtn = document.getElementById('downloadQrBigBtn');
        
        sidebar = document.getElementById('sidebar');
    }
    
    // ========== ПРЕЛОАДЕР ==========
    function initPreloader() {
        const preloader = document.getElementById('preloader');
        if (!preloader) return;
        window.addEventListener('load', () => {
            setTimeout(() => {
                preloader.style.opacity = '0';
                setTimeout(() => preloader.style.display = 'none', 500);
            }, 1500);
        });
    }
    
    // ========== 3D КАНВАС ==========
    function initCanvas() {
        const canvas = document.getElementById('bgCanvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let width, height;
        let particles = [];
        let mouseX = 0, mouseY = 0;
        
        function resize() {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        }
        
        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.3;
                this.vy = (Math.random() - 0.5) * 0.3;
                this.size = Math.random() * 3 + 1;
                this.color = `rgba(135, 116, 225, ${Math.random() * 0.4 + 0.1})`;
            }
            update() {
                this.x += this.vx;
                this.y += this.vy;
                const dx = mouseX - this.x;
                const dy = mouseY - this.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 120) {
                    const force = (120 - dist) / 800;
                    this.vx += dx * force;
                    this.vy += dy * force;
                }
                if (this.x < 0 || this.x > width) this.vx *= -0.9;
                if (this.y < 0 || this.y > height) this.vy *= -0.9;
                const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
                if (speed > 1.5) {
                    this.vx = (this.vx / speed) * 1.5;
                    this.vy = (this.vy / speed) * 1.5;
                }
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.fill();
            }
        }
        
        function initParticles() {
            particles = [];
            for (let i = 0; i < 150; i++) particles.push(new Particle());
        }
        
        function drawConnections() {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 100) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(135, 116, 225, ${0.15 * (1 - dist / 100)})`;
                        ctx.stroke();
                    }
                }
            }
        }
        
        function animate() {
            ctx.clearRect(0, 0, width, height);
            drawConnections();
            particles.forEach(p => { p.update(); p.draw(); });
            requestAnimationFrame(animate);
        }
        
        window.addEventListener('resize', () => { resize(); initParticles(); });
        window.addEventListener('mousemove', (e) => { mouseX = e.clientX; mouseY = e.clientY; });
        resize();
        initParticles();
        animate();
    }
    
    // ========== ТЕМЫ ==========
    function initTheme() {
        const savedTheme = localStorage.getItem('theme') || 'dark';
        applyTheme(savedTheme);
        
        const allThemeBtns = [...themeBtns, ...themeOptions];
        allThemeBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const theme = btn.dataset.theme;
                if (theme) applyTheme(theme);
            });
        });
    }
    
    function applyTheme(theme) {
        currentTheme = theme;
        document.body.className = `theme-${theme}`;
        localStorage.setItem('theme', theme);
        
        const allThemeBtns = [...themeBtns, ...themeOptions];
        allThemeBtns.forEach(btn => {
            if (btn.dataset.theme === theme) btn.classList.add('active');
            else btn.classList.remove('active');
        });
        
        showToast(`🎨 Тема "${getThemeName(theme)}" применена`);
    }
    
    function getThemeName(theme) {
        const names = { dark: 'Тёмная', light: 'Светлая', purple: 'Фиолетовая', ocean: 'Океан', cosmic: 'Космос', forest: 'Лесная' };
        return names[theme] || theme;
    }
    
    // ========== ЧАТ ==========
    function initChat() {
        if (!sendBtn || !chatInput) return;
        
        sendBtn.addEventListener('click', sendMessage);
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });
        
        updateChatTime();
        setInterval(updateChatTime, 1000);
    }
    
    async function sendMessage() {
        const text = chatInput.value.trim();
        if (!text) return;
        
        addMessage(text, 'user');
        chatInput.value = '';
        autoResize();
        
        showTyping(true);
        
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: "deepseek/deepseek-chat",
                    messages: [
                        { role: "system", content: "Ты openSIA, дружелюбный помощник. Отвечай кратко и с эмодзи 😊" },
                        { role: "user", content: text }
                    ],
                    temperature: creativity,
                    max_tokens: maxTokens
                })
            });
            
            const data = await response.json();
            const botReply = data.choices?.[0]?.message?.content || "Извини, я не понял. Попробуй ещё раз 😊";
            
            showTyping(false);
            addMessage(botReply, 'bot');
            
        } catch (error) {
            console.error('Ошибка:', error);
            showTyping(false);
            addMessage('❌ Ошибка подключения к серверу. Проверь, запущен ли прокси-сервер.', 'bot');
        }
    }
    
    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${sender}`;
        
        const avatar = sender === 'user' ? '👤' : '🤖';
        const name = sender === 'user' ? 'Вы' : 'openSIA';
        const time = showTime ? `<div class="chat-time">${getCurrentTime()}</div>` : '';
        
        messageDiv.innerHTML = `
            <div class="chat-avatar">${avatar}</div>
            <div class="chat-bubble">
                <div class="chat-name">${name}</div>
                <div class="chat-text">${escapeHtml(text)}</div>
                ${time}
            </div>
        `;
        
        messagesContainer.appendChild(messageDiv);
        if (autoScroll) scrollToBottom();
    }
    
    function showTyping(show) {
        if (!typingIndicator) return;
        if (show) {
            typingIndicator.classList.add('active');
            if (autoScroll) scrollToBottom();
        } else {
            typingIndicator.classList.remove('active');
        }
    }
    
    function scrollToBottom() {
        if (messagesContainer) messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
    
    function autoResize() {
        chatInput.style.height = 'auto';
        chatInput.style.height = Math.min(chatInput.scrollHeight, 120) + 'px';
    }
    
    function updateChatTime() {
        const timeElements = document.querySelectorAll('.chat-time');
        timeElements.forEach(el => {
            el.style.display = showTime ? 'block' : 'none';
        });
    }
    
    function getCurrentTime() {
        return new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    }
    
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    // ========== НАСТРОЙКИ ==========
    function initSettings() {
        if (creativitySlider && creativityValue) {
            creativitySlider.addEventListener('input', () => {
                creativity = parseFloat(creativitySlider.value);
                creativityValue.textContent = creativity.toFixed(1);
                localStorage.setItem('creativity', creativity);
            });
        }
        
        if (maxTokensSelect) {
            maxTokensSelect.addEventListener('change', () => {
                maxTokens = parseInt(maxTokensSelect.value);
                localStorage.setItem('maxTokens', maxTokens);
            });
        }
        
        if (autoScrollCheck) {
            autoScrollCheck.addEventListener('change', () => {
                autoScroll = autoScrollCheck.checked;
                localStorage.setItem('autoScroll', autoScroll);
            });
        }
        
        if (showTimeCheck) {
            showTimeCheck.addEventListener('change', () => {
                showTime = showTimeCheck.checked;
                localStorage.setItem('showTime', showTime);
                updateChatTime();
            });
        }
        
        if (openChatBtn) {
            openChatBtn.addEventListener('click', () => {
                document.getElementById('chat')?.scrollIntoView({ behavior: 'smooth' });
            });
        }
        
        if (learnBtn) {
            learnBtn.addEventListener('click', () => {
                document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
            });
        }
        
        if (saveSettingsBtn) {
            saveSettingsBtn.addEventListener('click', () => {
                localStorage.setItem('creativity', creativity);
                localStorage.setItem('maxTokens', maxTokens);
                localStorage.setItem('autoScroll', autoScroll);
                localStorage.setItem('showTime', showTime);
                showToast('💾 Настройки сохранены!');
            });
        }
        
        if (resetSettingsBtn) {
            resetSettingsBtn.addEventListener('click', () => {
                creativity = 1.2;
                maxTokens = 2048;
                autoScroll = true;
                showTime = true;
                if (creativitySlider) creativitySlider.value = creativity;
                if (creativityValue) creativityValue.textContent = creativity.toFixed(1);
                if (maxTokensSelect) maxTokensSelect.value = maxTokens;
                if (autoScrollCheck) autoScrollCheck.checked = autoScroll;
                if (showTimeCheck) showTimeCheck.checked = showTime;
                localStorage.removeItem('creativity');
                localStorage.removeItem('maxTokens');
                localStorage.removeItem('autoScroll');
                localStorage.removeItem('showTime');
                showToast('🔄 Настройки сброшены!');
                updateChatTime();
            });
        }
    }
    
    // ========== QR-КОД ==========
    function initQRCode() {
        const currentUrl = window.location.href;
        
        if (showQRBtn) {
            showQRBtn.addEventListener('click', (e) => {
                e.preventDefault();
                if (qrModal) qrModal.classList.add('active');
                setTimeout(() => {
                    if (typeof QRCode !== 'undefined' && document.getElementById('qrCanvasBig')) {
                        new QRCode(document.getElementById('qrCanvasBig'), {
                            text: currentUrl, width: 250, height: 250,
                            colorDark: '#8774E1', colorLight: '#ffffff', correctLevel: QRCode.CorrectLevel.H
                        });
                    }
                }, 100);
            });
        }
        
        if (closeQrModal) {
            closeQrModal.addEventListener('click', () => {
                if (qrModal) qrModal.classList.remove('active');
            });
        }
        
        if (downloadQrBigBtn) {
            downloadQrBigBtn.addEventListener('click', () => {
                const canvas = document.getElementById('qrCanvasBig');
                if (canvas) {
                    const link = document.createElement('a');
                    link.download = 'opensia-qr.png';
                    link.href = canvas.toDataURL();
                    link.click();
                    showToast('📱 QR-код скачан!');
                }
            });
        }
        
        window.addEventListener('click', (e) => {
            if (e.target === qrModal) qrModal.classList.remove('active');
        });
    }
    
    // ========== ЗАГРУЗКА НАСТРОЕК ==========
    function loadSettings() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) applyTheme(savedTheme);
        
        const savedCreativity = localStorage.getItem('creativity');
        if (savedCreativity && creativitySlider) {
            creativity = parseFloat(savedCreativity);
            creativitySlider.value = creativity;
            if (creativityValue) creativityValue.textContent = creativity.toFixed(1);
        }
        
        const savedMaxTokens = localStorage.getItem('maxTokens');
        if (savedMaxTokens && maxTokensSelect) {
            maxTokens = parseInt(savedMaxTokens);
            maxTokensSelect.value = maxTokens;
        }
        
        const savedAutoScroll = localStorage.getItem('autoScroll');
        if (savedAutoScroll !== null && autoScrollCheck) {
            autoScroll = savedAutoScroll === 'true';
            autoScrollCheck.checked = autoScroll;
        }
        
        const savedShowTime = localStorage.getItem('showTime');
        if (savedShowTime !== null && showTimeCheck) {
            showTime = savedShowTime === 'true';
            showTimeCheck.checked = showTime;
            updateChatTime();
        }
    }
    
    // ========== СОБЫТИЯ ==========
    function initEvents() {
        if (sidebar) {
            const menuToggle = document.querySelector('.chat-title');
            if (menuToggle) {
                menuToggle.addEventListener('click', () => {
                    sidebar.classList.toggle('active');
                });
            }
        }
        
        chatInput.addEventListener('input', autoResize);
    }
    
    // ========== КАСТОМНЫЙ КУРСОР ==========
    function initCursor() {
        const cursor = document.querySelector('.cursor');
        const follower = document.querySelector('.cursor-follower');
        if (!cursor || !follower) return;
        
        document.addEventListener('mousemove', (e) => {
            cursor.style.transform = `translate(${e.clientX - 4}px, ${e.clientY - 4}px)`;
            follower.style.transform = `translate(${e.clientX - 20}px, ${e.clientY - 20}px)`;
        });
        
        document.querySelectorAll('a, button, .nav-item, .theme-btn, .theme-option').forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.style.transform = 'scale(2)';
                follower.style.transform = 'scale(1.5)';
            });
            el.addEventListener('mouseleave', () => {
                cursor.style.transform = 'scale(1)';
                follower.style.transform = 'scale(1)';
            });
        });
    }
    
    // ========== АНИМАЦИИ ==========
    function initAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1 });
        
        document.querySelectorAll('.feature-item, .about-card, .settings-card, .contact-form-container').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'all 0.6s ease';
            observer.observe(el);
        });
    }
    
    // ========== УВЕДОМЛЕНИЯ ==========
    function showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            bottom: 30px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(135deg, var(--primary), var(--primary-dark));
            color: white;
            padding: 12px 24px;
            border-radius: 50px;
            z-index: 10001;
            animation: fadeInUp 0.3s ease;
            font-size: 14px;
            font-weight: 500;
            box-shadow: var(--shadow-neon);
        `;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }
    
    // ========== КОПИРОВАНИЕ ==========
    window.copyToClipboard = function(text) {
        navigator.clipboard.writeText(text).then(() => {
            showToast('✅ Скопировано!');
        }).catch(() => {
            const textarea = document.createElement('textarea');
            textarea.value = text;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            textarea.remove();
            showToast('✅ Скопировано!');
        });
    };
})();

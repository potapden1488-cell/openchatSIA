// ========== openSIA - ПРЕМИУМ ЛОГИКА ==========
// Версия 3.0 ULTRA
// Создано с ❤️ для открытого будущего

(function() {
    'use strict';

    // ========== ПЕРЕМЕННЫЕ ==========
    let currentTheme = 'dark';
    let creativity = 1.2;
    let userName = 'Denis';
    let userEmail = '';
    let userStatus = 'online';
    let autoScroll = true;
    let showTime = true;
    let soundEnabled = false;
    let screenshotProtection = true;
    let consoleProtection = true;
    let messageCount = 0;
    let sessionStart = Date.now();
    let currentChat = [];
    
    // API URL (замени на свой после деплоя)
    const API_URL = 'http://localhost:3000/api/chat';
    
    // DOM элементы
    let messagesContainer, chatInput, chatSendBtn, chatTyping;
    let userNameDisplay, profileNameInput, profileEmailInput, profileStatusSelect;
    let creativitySlider, creativityValue;
    let autoScrollCheck, showTimeCheck, soundCheck, screenshotCheck, consoleCheck;
    let themeBtns, themeOptions;
    let notifyBtn, learnBtn, newChatBtn, clearChatBtn, settingsBtn, saveProfileBtn;
    let qrCanvas, qrCanvasBig;
    let toast;
    
    // ========== ИНИЦИАЛИЗАЦИЯ ==========
    document.addEventListener('DOMContentLoaded', function() {
        console.log('%c🚀 openSIA PREMIUM ULTRA ЗАПУСКАЕТСЯ...', 'color: #8774E1; font-size: 16px; font-weight: bold;');
        console.log('%c💜 Создатель: Denchic | Команда: open Intelligent', 'color: #FF6B6B; font-size: 14px;');
        
        initElements();
        initPreloader();
        initCanvas();
        initTimer();
        initTheme();
        initChat();
        initProfile();
        initSettings();
        initQRCode();
        initNotifications();
        loadSavedData();
        initAnimations();
        initScrollEvents();
        
        console.log('%c🎉 openSIA PREMIUM ULTRA ГОТОВА!', 'color: #4ECDC4; font-size: 18px; font-weight: bold;');
    });
    
    // ========== ИНИЦИАЛИЗАЦИЯ ЭЛЕМЕНТОВ ==========
    function initElements() {
        messagesContainer = document.getElementById('chatMessages');
        chatInput = document.getElementById('chatInput');
        chatSendBtn = document.getElementById('chatSendBtn');
        chatTyping = document.getElementById('chatTyping');
        
        userNameDisplay = document.getElementById('userNameDisplay');
        profileNameInput = document.getElementById('profileName');
        profileEmailInput = document.getElementById('profileEmail');
        profileStatusSelect = document.getElementById('profileStatus');
        
        creativitySlider = document.getElementById('globalCreativity');
        creativityValue = document.getElementById('creativityValue');
        
        autoScrollCheck = document.getElementById('autoScrollChat');
        showTimeCheck = document.getElementById('showTimeChat');
        soundCheck = document.getElementById('notifications');
        screenshotCheck = document.getElementById('screenshotProtection');
        consoleCheck = document.getElementById('consoleProtection');
        
        themeBtns = document.querySelectorAll('.theme-btn');
        themeOptions = document.querySelectorAll('.theme-option');
        
        notifyBtn = document.getElementById('notifyBtn');
        learnBtn = document.getElementById('learnBtn');
        newChatBtn = document.getElementById('newChatBtn');
        clearChatBtn = document.getElementById('clearChat');
        settingsBtn = document.getElementById('settingsBtn');
        saveProfileBtn = document.getElementById('saveProfileBtn');
        
        qrCanvas = document.getElementById('qrCanvas');
        qrCanvasBig = document.getElementById('qrCanvasBig');
        
        toast = document.getElementById('toast');
    }
    
    // ========== ПРЕЛОАДЕР ==========
    function initPreloader() {
        const preloader = document.getElementById('preloader');
        if (!preloader) return;
        
        window.addEventListener('load', () => {
            setTimeout(() => {
                preloader.style.opacity = '0';
                setTimeout(() => {
                    preloader.style.display = 'none';
                }, 500);
            }, 1500);
        });
    }
    
    // ========== 3D КАНВАС С ЧАСТИЦАМИ ==========
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
            for (let i = 0; i < 150; i++) {
                particles.push(new Particle());
            }
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
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            requestAnimationFrame(animate);
        }
        
        window.addEventListener('resize', () => {
            resize();
            initParticles();
        });
        
        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });
        
        resize();
        initParticles();
        animate();
    }
    
    // ========== ТАЙМЕР 7 ДНЕЙ ==========
    function initTimer() {
        const launchDate = new Date();
        launchDate.setDate(launchDate.getDate() + 7);
        launchDate.setHours(0, 0, 0, 0);
        
        function updateTimer() {
            const now = new Date();
            const diff = launchDate - now;
            
            if (diff <= 0) {
                document.querySelectorAll('.timer-number, .timer-unit-number').forEach(el => {
                    if (el) el.textContent = '00';
                });
                return;
            }
            
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);
            
            const daysEl = document.getElementById('days');
            const hoursEl = document.getElementById('hours');
            const minutesEl = document.getElementById('minutes');
            const secondsEl = document.getElementById('seconds');
            const bigDays = document.getElementById('bigDays');
            const bigHours = document.getElementById('bigHours');
            const bigMinutes = document.getElementById('bigMinutes');
            const bigSeconds = document.getElementById('bigSeconds');
            
            if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
            if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
            if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
            if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
            if (bigDays) bigDays.textContent = String(days).padStart(2, '0');
            if (bigHours) bigHours.textContent = String(hours).padStart(2, '0');
            if (bigMinutes) bigMinutes.textContent = String(minutes).padStart(2, '0');
            if (bigSeconds) bigSeconds.textContent = String(seconds).padStart(2, '0');
        }
        
        updateTimer();
        setInterval(updateTimer, 1000);
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
            if (btn.dataset.theme === theme) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        
        showToast(`🎨 Тема "${getThemeName(theme)}" применена`);
    }
    
    function getThemeName(theme) {
        const names = {
            dark: 'Тёмная',
            light: 'Светлая',
            purple: 'Фиолетовая',
            ocean: 'Океан',
            cosmic: 'Космос',
            forest: 'Лесная'
        };
        return names[theme] || theme;
    }
    
    // ========== ЧАТ ==========
    function initChat() {
        if (!chatSendBtn || !chatInput) return;
        
        chatSendBtn.addEventListener('click', sendMessage);
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });
        
        updateChatTime();
        setInterval(updateChatTime, 1000);
    }
    
    function sendMessage() {
        const text = chatInput.value.trim();
        if (!text) return;
        
        addMessage(text, 'user');
        chatInput.value = '';
        
        showTyping(true);
        
        setTimeout(() => {
            simulateBotResponse(text);
        }, 1000 + Math.random() * 1000);
    }
    
    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${sender}`;
        
        const avatar = sender === 'user' ? '👤' : '🤖';
        const name = sender === 'user' ? userName : 'openSIA';
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
        
        if (sender === 'user') {
            messageCount++;
            updateStats();
        }
        
        if (soundEnabled && sender === 'bot') {
            playSound();
        }
    }
    
    function simulateBotResponse(userMessage) {
        showTyping(false);
        
        const responses = [
            "Интересно! Расскажи подробнее 😊",
            "Я понял. А что ты думаешь об этом?",
            "Отличный вопрос! Давай подумаем вместе 🤔",
            "Вот это да! Я впечатлён! 😮",
            "Спасибо, что поделился! 👍",
            "Хм, над этим нужно подумать...",
            "Конечно! Сейчас всё объясню: ...",
            "Прикольно! А ещё что-нибудь расскажешь? 😄",
            "Это звучит здорово! ✨",
            "Я запомню это! 💜"
        ];
        
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        addMessage(randomResponse, 'bot');
    }
    
    function showTyping(show) {
        if (!chatTyping) return;
        if (show) {
            chatTyping.classList.add('active');
            if (autoScroll) scrollToBottom();
        } else {
            chatTyping.classList.remove('active');
        }
    }
    
    function scrollToBottom() {
        if (messagesContainer) {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    }
    
    function updateChatTime() {
        const timeElements = document.querySelectorAll('.chat-time');
        if (showTime) {
            timeElements.forEach(el => {
                el.style.display = 'block';
            });
        } else {
            timeElements.forEach(el => {
                el.style.display = 'none';
            });
        }
    }
    
    function getCurrentTime() {
        const now = new Date();
        return now.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    }
    
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    function playSound() {
        try {
            const audio = new Audio('https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3');
            audio.volume = 0.3;
            audio.play().catch(e => console.log('Sound error:', e));
        } catch(e) {}
    }
    
    // ========== ПРОФИЛЬ ==========
    function initProfile() {
        if (saveProfileBtn) {
            saveProfileBtn.addEventListener('click', saveProfile);
        }
        
        if (profileStatusSelect) {
            profileStatusSelect.addEventListener('change', updateStatusDisplay);
        }
    }
    
    function saveProfile() {
        if (profileNameInput) userName = profileNameInput.value;
        if (profileEmailInput) userEmail = profileEmailInput.value;
        if (profileStatusSelect) userStatus = profileStatusSelect.value;
        
        if (userNameDisplay) userNameDisplay.textContent = userName;
        
        localStorage.setItem('userName', userName);
        localStorage.setItem('userEmail', userEmail);
        localStorage.setItem('userStatus', userStatus);
        
        updateStatusDisplay();
        showToast('✅ Профиль сохранён!');
    }
    
    function updateStatusDisplay() {
        const statusText = document.querySelector('.user-status');
        if (!statusText) return;
        
        const statusMap = {
            online: '🌟 В сети',
            away: '🌙 Отошёл',
            busy: '🔴 Не беспокоить'
        };
        statusText.textContent = statusMap[userStatus] || '🌟 В сети';
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
        
        if (soundCheck) {
            soundCheck.addEventListener('change', () => {
                soundEnabled = soundCheck.checked;
                localStorage.setItem('soundEnabled', soundEnabled);
            });
        }
        
        if (screenshotCheck) {
            screenshotCheck.addEventListener('change', () => {
                screenshotProtection = screenshotCheck.checked;
                localStorage.setItem('screenshotProtection', screenshotProtection);
            });
        }
        
        if (consoleCheck) {
            consoleCheck.addEventListener('change', () => {
                consoleProtection = consoleCheck.checked;
                localStorage.setItem('consoleProtection', consoleProtection);
                if (consoleProtection) enableConsoleProtection();
            });
        }
        
        if (notifyBtn) {
            notifyBtn.addEventListener('click', () => {
                const email = prompt('Введи email — мы напомним о запуске:');
                if (email && email.includes('@')) {
                    showToast(`✅ Уведомление отправлено на ${email}`);
                    saveSubscriber(email);
                } else if (email) {
                    showToast('❌ Неверный email', 'error');
                }
            });
        }
        
        if (learnBtn) {
            learnBtn.addEventListener('click', () => {
                document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
            });
        }
        
        if (newChatBtn) {
            newChatBtn.addEventListener('click', () => {
                messagesContainer.innerHTML = '';
                addMessage('Привет! Я openSIA — твоя нейросеть. Чем могу помочь? 😊', 'bot');
                showToast('✨ Новый чат создан!');
            });
        }
        
        if (clearChatBtn) {
            clearChatBtn.addEventListener('click', () => {
                if (confirm('Очистить всю историю чата?')) {
                    messagesContainer.innerHTML = '';
                    addMessage('Привет! Я openSIA — твоя нейросеть. Чем могу помочь? 😊', 'bot');
                    showToast('🧹 История очищена!');
                }
            });
        }
        
        if (settingsBtn) {
            settingsBtn.addEventListener('click', () => {
                const settingsModal = document.getElementById('settingsModal');
                if (settingsModal) settingsModal.classList.add('active');
            });
        }
        
        const closeSettings = document.getElementById('closeSettings');
        if (closeSettings) {
            closeSettings.addEventListener('click', () => {
                const settingsModal = document.getElementById('settingsModal');
                if (settingsModal) settingsModal.classList.remove('active');
            });
        }
        
        const saveSettingsBtn = document.getElementById('saveSettingsBtn');
        if (saveSettingsBtn) {
            saveSettingsBtn.addEventListener('click', () => {
                saveProfile();
                showToast('💾 Все настройки сохранены!');
                const settingsModal = document.getElementById('settingsModal');
                if (settingsModal) settingsModal.classList.remove('active');
            });
        }
    }
    
    // ========== QR-КОД ==========
    function initQRCode() {
        const currentUrl = window.location.href;
        
        if (qrCanvas && typeof QRCode !== 'undefined') {
            new QRCode(qrCanvas, {
                text: currentUrl,
                width: 150,
                height: 150,
                colorDark: '#8774E1',
                colorLight: '#ffffff',
                correctLevel: QRCode.CorrectLevel.H
            });
        }
        
        if (qrCanvasBig) {
            new QRCode(qrCanvasBig, {
                text: currentUrl,
                width: 250,
                height: 250,
                colorDark: '#8774E1',
                colorLight: '#ffffff',
                correctLevel: QRCode.CorrectLevel.H
            });
        }
        
        const showQRBtns = document.querySelectorAll('#showQRBtn, #showQRBtnFooter');
        const qrModal = document.getElementById('qrModal');
        const closeQrModal = document.getElementById('closeQrModal');
        
        showQRBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                if (qrModal) qrModal.classList.add('active');
            });
        });
        
        if (closeQrModal) {
            closeQrModal.addEventListener('click', () => {
                if (qrModal) qrModal.classList.remove('active');
            });
        }
        
        const downloadBtns = document.querySelectorAll('#downloadQrBtn, #downloadQrBigBtn');
        downloadBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const canvas = btn.id === 'downloadQrBigBtn' ? qrCanvasBig : qrCanvas;
                if (canvas) {
                    const link = document.createElement('a');
                    link.download = 'opensia-qr.png';
                    link.href = canvas.toDataURL();
                    link.click();
                    showToast('📱 QR-код скачан!');
                }
            });
        });
    }
    
    // ========== СТАТИСТИКА ==========
    function updateStats() {
        const messageCountEl = document.getElementById('messageCount');
        const tokenCountEl = document.getElementById('tokenCount');
        const sessionTimeEl = document.getElementById('sessionTime');
        const emotionCountEl = document.getElementById('emotionCount');
        
        if (messageCountEl) messageCountEl.textContent = messageCount;
        if (tokenCountEl) tokenCountEl.textContent = Math.floor(messageCount * 45);
        if (sessionTimeEl) {
            const seconds = Math.floor((Date.now() - sessionStart) / 1000);
            const minutes = Math.floor(seconds / 60);
            const hours = Math.floor(minutes / 60);
            sessionTimeEl.textContent = `${hours.toString().padStart(2, '0')}:${(minutes % 60).toString().padStart(2, '0')}`;
        }
        if (emotionCountEl) emotionCountEl.textContent = Math.floor(messageCount * 0.7);
    }
    
    // ========== ЗАГРУЗКА/СОХРАНЕНИЕ ==========
    function loadSavedData() {
        const savedName = localStorage.getItem('userName');
        if (savedName) {
            userName = savedName;
            if (profileNameInput) profileNameInput.value = userName;
            if (userNameDisplay) userNameDisplay.textContent = userName;
        }
        
        const savedEmail = localStorage.getItem('userEmail');
        if (savedEmail) {
            userEmail = savedEmail;
            if (profileEmailInput) profileEmailInput.value = userEmail;
        }
        
        const savedStatus = localStorage.getItem('userStatus');
        if (savedStatus) {
            userStatus = savedStatus;
            if (profileStatusSelect) profileStatusSelect.value = userStatus;
            updateStatusDisplay();
        }
        
        const savedCreativity = localStorage.getItem('creativity');
        if (savedCreativity && creativitySlider) {
            creativity = parseFloat(savedCreativity);
            creativitySlider.value = creativity;
            if (creativityValue) creativityValue.textContent = creativity.toFixed(1);
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
        
        const savedSound = localStorage.getItem('soundEnabled');
        if (savedSound !== null && soundCheck) {
            soundEnabled = savedSound === 'true';
            soundCheck.checked = soundEnabled;
        }
        
        const savedScreenshot = localStorage.getItem('screenshotProtection');
        if (savedScreenshot !== null && screenshotCheck) {
            screenshotProtection = savedScreenshot === 'true';
            screenshotCheck.checked = screenshotProtection;
        }
        
        const savedConsole = localStorage.getItem('consoleProtection');
        if (savedConsole !== null && consoleCheck) {
            consoleProtection = savedConsole === 'true';
            consoleCheck.checked = consoleProtection;
        }
        
        updateStats();
        setInterval(updateStats, 1000);
    }
    
    function saveSubscriber(email) {
        let subscribers = JSON.parse(localStorage.getItem('subscribers') || '[]');
        if (!subscribers.includes(email)) {
            subscribers.push(email);
            localStorage.setItem('subscribers', JSON.stringify(subscribers));
            
            const countEl = document.getElementById('subscriberCount');
            if (countEl) countEl.textContent = subscribers.length;
        }
    }
    
    // ========== ЗАЩИТА ==========
    function enableConsoleProtection() {
        setInterval(() => {
            const start = performance.now();
            debugger;
            const end = performance.now();
            if (end - start > 100) {
                document.body.innerHTML = '<div style="position:fixed;top:0;left:0;width:100%;height:100%;background:#000;color:#fff;display:flex;align-items:center;justify-content:center;font-family:monospace;z-index:99999;"><h1>⛔ ДОСТУП ЗАПРЕЩЕН</h1></div>';
            }
        }, 1000);
    }
    
    // ========== АНИМАЦИИ ==========
    function initAnimations() {
        const tiltElements = document.querySelectorAll('[data-tilt]');
        tiltElements.forEach(el => {
            if (typeof VanillaTilt !== 'undefined') {
                VanillaTilt.init(el, {
                    max: 15,
                    speed: 400,
                    glare: true,
                    'max-glare': 0.5,
                });
            }
        });
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        
        document.querySelectorAll('.feature-item, .about-card, .settings-card, .contact-card').forEach(el => {
            el.classList.add('fade-in-up');
            observer.observe(el);
        });
    }
    
    function initScrollEvents() {
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const hero = document.querySelector('.hero');
            if (hero) {
                hero.style.transform = `translateY(${scrollTop * 0.3}px)`;
            }
        });
    }
    
    // ========== УВЕДОМЛЕНИЯ ==========
    function showToast(message, type = 'success') {
        if (!toast) return;
        
        toast.textContent = message;
        toast.className = 'toast';
        if (type === 'error') toast.style.background = 'linear-gradient(135deg, #FF453A, #e74c3c)';
        else toast.style.background = 'linear-gradient(135deg, var(--primary), var(--primary-dark))';
        
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
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
    
    // ========== ЗАЩИТА ОТ СКРИНШОТОВ ==========
    if (screenshotProtection) {
        document.addEventListener('keyup', (e) => {
            if (e.key === 'PrintScreen') {
                showToast('🔒 Скриншот заблокирован!', 'error');
                return false;
            }
        });
    }
    
    // ========== ИНИЦИАЛИЗАЦИЯ СООБЩЕНИЯ ==========
    setTimeout(() => {
        if (messagesContainer && messagesContainer.children.length === 0) {
            addMessage('Привет! Я openSIA — твоя нейросеть. Чем могу помочь? 😊', 'bot');
        }
    }, 100);
    
    // ========== ОБНОВЛЕНИЕ ВРЕМЕНИ ==========
    function updateCurrentTime() {
        const timeEl = document.getElementById('currentTime');
        if (timeEl) {
            timeEl.textContent = getCurrentTime();
        }
    }
    setInterval(updateCurrentTime, 1000);
    updateCurrentTime();
})();

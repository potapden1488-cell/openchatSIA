// ========== ИНИЦИАЛИЗАЦИЯ ==========
document.addEventListener('DOMContentLoaded', () => {
    initPreloader();
    initCanvas();
    initTimer();
    initTheme();
    initWaitlist();
    initCursor();
    initSmoothScroll();
    initAnimations();
    loadStats();
});

// ========== ПРЕЛОАДЕР ==========
function initPreloader() {
    const preloader = document.querySelector('.preloader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 800);
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
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.size = Math.random() * 2 + 1;
            this.color = `rgba(135, 116, 225, ${Math.random() * 0.5})`;
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            const dx = mouseX - this.x;
            const dy = mouseY - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 100) {
                const force = (100 - dist) / 1000;
                this.vx += dx * force;
                this.vy += dy * force;
            }
            if (this.x < 0 || this.x > width) this.vx *= -0.9;
            if (this.y < 0 || this.y > height) this.vy *= -0.9;
            const maxSpeed = 2;
            const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
            if (speed > maxSpeed) {
                this.vx = (this.vx / speed) * maxSpeed;
                this.vy = (this.vy / speed) * maxSpeed;
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
    
    function animate() {
        ctx.clearRect(0, 0, width, height);
        ctx.strokeStyle = 'rgba(135, 116, 225, 0.1)';
        ctx.lineWidth = 1;
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 100) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(135, 116, 225, ${0.2 * (1 - dist / 100)})`;
                    ctx.stroke();
                }
            }
        }
        particles.forEach(p => { p.update(); p.draw(); });
        requestAnimationFrame(animate);
    }
    
    window.addEventListener('resize', () => { resize(); initParticles(); });
    window.addEventListener('mousemove', (e) => { mouseX = e.clientX; mouseY = e.clientY; });
    resize();
    initParticles();
    animate();
}

// ========== ТАЙМЕР (7 ДНЕЙ ОТ СЕЙЧАС) ==========
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

// ========== ПЕРЕКЛЮЧЕНИЕ ТЕМ ==========
function initTheme() {
    const themeBtns = document.querySelectorAll('.theme-btn');
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.body.classList.add(`${savedTheme}-theme`);
    
    themeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const theme = btn.dataset.theme;
            document.body.className = '';
            document.body.classList.add(`${theme}-theme`);
            localStorage.setItem('theme', theme);
        });
    });
}

// ========== ЛИСТ ОЖИДАНИЯ ==========
function initWaitlist() {
    const form = document.getElementById('waitlistForm');
    const notifyBtn = document.getElementById('notifyBtn');
    const learnBtn = document.getElementById('learnBtn');
    const modal = document.getElementById('successModal');
    const closeModal = document.getElementById('closeModal');
    const modalEmailSpan = document.getElementById('modalEmail');
    
    let subscribers = JSON.parse(localStorage.getItem('subscribers') || '[]');
    updateSubscriberCount();
    
    function addSubscriber(email) {
        if (!email || !email.includes('@')) {
            alert('Пожалуйста, введи корректный email');
            return false;
        }
        if (subscribers.includes(email)) {
            alert('Ты уже в листе ожидания!');
            return false;
        }
        subscribers.push(email);
        localStorage.setItem('subscribers', JSON.stringify(subscribers));
        updateSubscriberCount();
        showModal(email);
        return true;
    }
    
    function showModal(email) {
        if (modalEmailSpan) modalEmailSpan.textContent = email;
        modal.classList.add('active');
        setTimeout(() => {
            modal.classList.remove('active');
        }, 3000);
    }
    
    function updateSubscriberCount() {
        const countEl = document.getElementById('subscriberCount');
        if (countEl) countEl.textContent = subscribers.length;
    }
    
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const input = document.getElementById('waitlistEmail');
            if (input && input.value) addSubscriber(input.value);
            if (input) input.value = '';
        });
    }
    
    if (notifyBtn) {
        notifyBtn.addEventListener('click', () => {
            const email = prompt('Введи email — мы напомним о запуске:');
            if (email) addSubscriber(email);
        });
    }
    
    if (learnBtn) {
        learnBtn.addEventListener('click', () => {
            document.getElementById('about').scrollIntoView({ behavior: 'smooth' });
        });
    }
    
    if (closeModal) {
        closeModal.addEventListener('click', () => {
            modal.classList.remove('active');
        });
    }
    
    window.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('active');
    });
}

// ========== КАСТОМНЫЙ КУРСОР ==========
function initCursor() {
    const cursor = document.querySelector('.cursor');
    const cursorFollower = document.querySelector('.cursor-follower');
    if (!cursor || !cursorFollower) return;
    
    document.addEventListener('mousemove', (e) => {
        cursor.style.transform = `translate(${e.clientX - 6}px, ${e.clientY - 6}px)`;
        cursorFollower.style.transform = `translate(${e.clientX - 20}px, ${e.clientY - 20}px)`;
    });
    
    document.querySelectorAll('a, button, .nav-item, .feature-item, .theme-btn').forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform = 'scale(2)';
            cursorFollower.style.transform = 'scale(1.5)';
        });
        el.addEventListener('mouseleave', () => {
            cursor.style.transform = 'scale(1)';
            cursorFollower.style.transform = 'scale(1)';
        });
    });
}

// ========== ПЛАВНЫЙ СКРОЛЛ ==========
function initSmoothScroll() {
    document.querySelectorAll('.nav-item, .btn-outline, [href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
    
    // Активная ссылка при скролле
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-item');
    
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === `#${current}`) {
                item.classList.add('active');
            }
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
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    
    document.querySelectorAll('.feature-item, .about-card, .timer-card, .timer-unit').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });
    
    // Анимация 3D карточек
    document.querySelectorAll('.feature-item, .about-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });
}

// ========== СТАТИСТИКА ==========
function loadStats() {
    const subscribers = JSON.parse(localStorage.getItem('subscribers') || '[]');
    const countEl = document.getElementById('subscriberCount');
    if (countEl) countEl.textContent = subscribers.length;
}

console.log('🚀 openSIA — премиум сайт с обратным отсчётом загружен!');
// ========== ОТПРАВКА ВОПРОСОВ ==========
function initQuestionForm() {
    const form = document.getElementById('questionForm');
    if (!form) return;
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('questionEmail').value;
        const message = document.getElementById('questionText').value;
        
        if (!email || !message) {
            alert('Пожалуйста, заполни все поля');
            return;
        }
        
        // Показываем индикатор загрузки
        const submitBtn = form.querySelector('button');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span>⏳ Отправка...</span>';
        submitBtn.disabled = true;
        
        try {
            const response = await fetch('send.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    message: message,
                    type: 'question'
                })
            });
            
            const result = await response.json();
            
            if (result.success) {
                showQuestionModal('✅ Отправлено!', 'Спасибо за вопрос! Я отвечу на твою почту в ближайшее время 💜');
                form.reset();
            } else {
                showQuestionModal('❌ Ошибка', result.error || 'Не удалось отправить. Попробуй позже.');
            }
        } catch (error) {
            console.error('Ошибка:', error);
            showQuestionModal('❌ Ошибка', 'Не удалось отправить. Проверь интернет и попробуй снова.');
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
}

// Модалка для вопросов
function showQuestionModal(title, message) {
    // Создаём модалку
    let modal = document.querySelector('.modal-question');
    
    if (!modal) {
        modal = document.createElement('div');
        modal.className = 'modal-question';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-icon"></div>
                <h3></h3>
                <p></p>
                <button class="btn btn-primary modal-close-btn">Хорошо</button>
            </div>
        `;
        document.body.appendChild(modal);
    }
    
    const icon = modal.querySelector('.modal-icon');
    const titleEl = modal.querySelector('h3');
    const messageEl = modal.querySelector('p');
    const closeBtn = modal.querySelector('.modal-close-btn');
    
    icon.textContent = title === '✅ Отправлено!' ? '📨' : '💜';
    titleEl.textContent = title;
    messageEl.textContent = message;
    
    modal.classList.add('active');
    
    const closeModal = () => {
        modal.classList.remove('active');
        closeBtn.removeEventListener('click', closeModal);
    };
    
    closeBtn.addEventListener('click', closeModal);
    
    // Закрытие по клику вне
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
    
    // Авто-закрытие через 5 секунд
    setTimeout(() => {
        if (modal.classList.contains('active')) closeModal();
    }, 5000);
}

// Запускаем форму вопросов
document.addEventListener('DOMContentLoaded', () => {
    initQuestionForm();
});
// ========== ОТПРАВКА НА ПОЧТУ ==========
function initEmailForms() {
    const waitlistForm = document.getElementById('waitlistForm');
    
    if (waitlistForm) {
        waitlistForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('waitlistEmail').value;
            
            if (!email) {
                alert('Введи email');
                return;
            }
            
            const btn = waitlistForm.querySelector('button');
            const originalText = btn.innerHTML;
            btn.innerHTML = '⏳ Отправка...';
            btn.disabled = true;
            
            try {
                const response = await fetch('send.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: email, type: 'waitlist' })
                });
                const result = await response.json();
                
                if (result.success) {
                    showModal(email);
                    updateSubscriberCount();
                } else {
                    alert('❌ ' + (result.error || 'Ошибка'));
                }
            } catch (error) {
                alert('❌ Ошибка соединения');
            } finally {
                btn.innerHTML = originalText;
                btn.disabled = false;
                document.getElementById('waitlistEmail').value = '';
            }
        });
    }
    
    // Кнопка "Напомнить" в хедере
    const notifyBtn = document.getElementById('notifyBtn');
    if (notifyBtn) {
        notifyBtn.addEventListener('click', () => {
            const email = prompt('Введи email — мы напомним о запуске:');
            if (email) {
                fetch('send.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: email, type: 'waitlist' })
                }).then(() => {
                    alert('✅ Готово! Мы напишем тебе на ' + email);
                    updateSubscriberCount();
                }).catch(() => alert('❌ Ошибка'));
            }
        });
    }
}

// Счётчик подписчиков
function updateSubscriberCount() {
    fetch('subscribers.txt')
        .then(res => res.text())
        .then(text => {
            const lines = text.split('\n').filter(l => l.trim() && l.includes('|'));
            const count = lines.length;
            const countEl = document.getElementById('subscriberCount');
            if (countEl) countEl.textContent = count;
        })
        .catch(() => {});
}

// QR-код
function initQRCode() {
    const currentUrl = window.location.href;
    const qrCanvas = document.getElementById('qrCanvas');
    const qrCanvasBig = document.getElementById('qrCanvasBig');
    
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
    
    // Кнопка показа QR-модалки
    const showQRBtns = document.querySelectorAll('#showQRBtn, #showQRBtnFooter');
    const qrModal = document.getElementById('qrModal');
    const closeQrModal = document.getElementById('closeQrModal');
    
    showQRBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            qrModal.classList.add('active');
        });
    });
    
    if (closeQrModal) {
        closeQrModal.addEventListener('click', () => {
            qrModal.classList.remove('active');
        });
    }
    
    // Скачать QR
    const downloadBtns = document.querySelectorAll('#downloadQrBtn, #downloadQrBigBtn');
    downloadBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const canvas = btn.id === 'downloadQrBigBtn' ? qrCanvasBig : qrCanvas;
            if (canvas) {
                const link = document.createElement('a');
                link.download = 'opensia-qr.png';
                link.href = canvas.toDataURL();
                link.click();
            }
        });
    });
}

// Копирование в буфер
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert('✅ Скопировано: ' + text);
    }).catch(() => {
        alert('❌ Не удалось скопировать');
    });
}

// Обновление счётчика подписчиков при загрузке
document.addEventListener('DOMContentLoaded', () => {
    initEmailForms();
    initQRCode();
    setTimeout(updateSubscriberCount, 1000);
});

// Добавляем глобальную функцию для копирования
window.copyToClipboard = copyToClipboard;
// ========== openSIA - ТИЗЕР-СТРАНИЦА С ТАЙМЕРОМ ==========
(function() {
    'use strict';

    // ========== ДАТА ЗАПУСКА (7 ДНЕЙ ОТ СЕЙЧАС) ==========
    const launchDate = new Date();
    launchDate.setDate(launchDate.getDate() + 7);
    launchDate.setHours(0, 0, 0, 0);

    // ========== ПЕРЕМЕННЫЕ ==========
    let currentTheme = 'dark';
    let waitlistCount = 0;

    // ========== DOM ЭЛЕМЕНТЫ ==========
    let daysEl, hoursEl, minutesEl, secondsEl;
    let waitlistCountEl, daysLeftEl;
    let themeBtns, sidebar;

    // ========== ИНИЦИАЛИЗАЦИЯ ==========
    document.addEventListener('DOMContentLoaded', function() {
        console.log('%c🚀 openSIA ТИЗЕР ЗАПУЩЕН!', 'color: #8774E1; font-size: 18px; font-weight: bold;');
        
        initElements();
        initPreloader();
        initCanvas();
        initTheme();
        initTimer();
        initForm();
        initScrollButtons();
        loadWaitlistCount();
        initCursor();
        initAnimations();
        
        console.log('%c✅ openSIA готова!', 'color: #4ECDC4; font-size: 16px;');
    });

    // ========== ИНИЦИАЛИЗАЦИЯ ЭЛЕМЕНТОВ ==========
    function initElements() {
        daysEl = document.getElementById('days');
        hoursEl = document.getElementById('hours');
        minutesEl = document.getElementById('minutes');
        secondsEl = document.getElementById('seconds');
        waitlistCountEl = document.getElementById('waitlistCount');
        daysLeftEl = document.getElementById('daysLeft');
        themeBtns = document.querySelectorAll('.theme-btn');
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
        
        themeBtns.forEach(btn => {
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
    }

    // ========== ТАЙМЕР ==========
    function initTimer() {
        function updateTimer() {
            const now = new Date();
            const diff = launchDate - now;
            
            if (diff <= 0) {
                daysEl.textContent = '00';
                hoursEl.textContent = '00';
                minutesEl.textContent = '00';
                secondsEl.textContent = '00';
                if (daysLeftEl) daysLeftEl.textContent = '0';
                return;
            }
            
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);
            
            daysEl.textContent = days.toString().padStart(2, '0');
            hoursEl.textContent = hours.toString().padStart(2, '0');
            minutesEl.textContent = minutes.toString().padStart(2, '0');
            secondsEl.textContent = seconds.toString().padStart(2, '0');
            
            if (daysLeftEl) daysLeftEl.textContent = days;
        }
        
        updateTimer();
        setInterval(updateTimer, 1000);
    }

    // ========== ФОРМА ПОДПИСКИ ==========
    function initForm() {
        const form = document.getElementById('waitlistForm');
        if (!form) return;
        
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = form.querySelector('input[name="name"]').value;
            const email = form.querySelector('input[name="email"]').value;
            
            if (!name || !email) {
                showToast('❌ Заполни все поля!', 'error');
                return;
            }
            
            // Сохраняем в localStorage
            const subscribers = JSON.parse(localStorage.getItem('waitlist') || '[]');
            if (!subscribers.includes(email)) {
                subscribers.push(email);
                localStorage.setItem('waitlist', JSON.stringify(subscribers));
                waitlistCount = subscribers.length;
                if (waitlistCountEl) waitlistCountEl.textContent = waitlistCount;
                showToast('✅ Ты в списке ожидания! Спасибо!', 'success');
                form.reset();
                
                // Отправляем на Formspree
                fetch(form.action, {
                    method: 'POST',
                    body: new FormData(form),
                    headers: { 'Accept': 'application/json' }
                }).catch(e => console.log('Formspree error:', e));
            } else {
                showToast('⚠️ Ты уже в списке!', 'warning');
            }
        });
    }
    
    function loadWaitlistCount() {
        const subscribers = JSON.parse(localStorage.getItem('waitlist') || '[]');
        waitlistCount = subscribers.length;
        if (waitlistCountEl) waitlistCountEl.textContent = waitlistCount;
    }

    // ========== ПЛАВНАЯ ПРОКРУТКА ==========
    function initScrollButtons() {
        const scrollToWaitlist = document.getElementById('scrollToWaitlist');
        const scrollToFeatures = document.getElementById('scrollToFeatures');
        
        if (scrollToWaitlist) {
            scrollToWaitlist.addEventListener('click', () => {
                document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth' });
            });
        }
        
        if (scrollToFeatures) {
            scrollToFeatures.addEventListener('click', () => {
                document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
            });
        }
        
        // Навигация по сайдбару
        document.querySelectorAll('.nav-item').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                if (targetId && targetId !== '#') {
                    const target = document.querySelector(targetId);
                    if (target) target.scrollIntoView({ behavior: 'smooth' });
                }
                
                // Закрываем сайдбар на мобильных
                if (window.innerWidth <= 768 && sidebar) {
                    sidebar.classList.remove('active');
                }
            });
        });
        
        // Мобильное меню
        if (sidebar) {
            const menuToggle = document.querySelector('.chat-title') || document.querySelector('.logo-text');
            if (menuToggle) {
                menuToggle.addEventListener('click', () => {
                    sidebar.classList.toggle('active');
                });
            }
        }
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
        
        document.querySelectorAll('a, button, .nav-item, .theme-btn').forEach(el => {
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

    // ========== АНИМАЦИИ ПРИ СКРОЛЛЕ ==========
    function initAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1 });
        
        document.querySelectorAll('.feature-item, .about-card, .waitlist-container, .stat-card').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'all 0.6s ease';
            observer.observe(el);
        });
    }

    // ========== УВЕДОМЛЕНИЯ ==========
    function showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        
        const colors = {
            success: '#4CAF50',
            error: '#FF453A',
            warning: '#FFA500',
            info: '#8774E1'
        };
        
        toast.style.cssText = `
            position: fixed;
            bottom: 30px;
            left: 50%;
            transform: translateX(-50%);
            background: ${colors[type] || colors.info};
            color: white;
            padding: 12px 24px;
            border-radius: 50px;
            z-index: 10001;
            animation: fadeInUp 0.3s ease;
            font-size: 14px;
            font-weight: 500;
            box-shadow: 0 0 20px rgba(0,0,0,0.3);
        `;
        
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }
})();

/**
 * Sirius.js — логика страницы Сириус
 */

(function() {
    "use strict";

    // ========== ТЕМА (ДЕНЬ/НОЧЬ) ==========
    function applyTheme(t) {
        const themeIcon = document.getElementById('themeIcon');
        const themeText = document.getElementById('themeText');
        const heroImg = document.getElementById('heroImg');
        if(t === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
            if(themeIcon) themeIcon.textContent = '🌙';
            if(themeText) themeText.textContent = 'Ночь';
            if(heroImg) heroImg.src = 'Img.Sirius/adlernoch.jpeg';
        } else {
            document.documentElement.removeAttribute('data-theme');
            if(themeIcon) themeIcon.textContent = '☀️';
            if(themeText) themeText.textContent = 'День';
            if(heroImg) heroImg.src = 'Img.Sirius/adlerr.jpg';
        }
        localStorage.setItem('siteTheme', t);
    }
    
    const savedTheme = localStorage.getItem('siteTheme');
    applyTheme(savedTheme === 'dark' ? 'dark' : 'light');

    const themeToggle = document.getElementById('theme-toggle');
    if(themeToggle) {
        themeToggle.addEventListener('click', () => {
            const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            applyTheme(next);
        });
    }

    // ========== ПОГОДА И ВОДА ==========
    async function fetchWeatherAndSea() {
        try {
            const res = await fetch('https://api.open-meteo.com/v1/forecast?latitude=43.4283&longitude=39.9238&current_weather=true');
            const data = await res.json();
            if(data.current_weather) {
                const air = Math.round(data.current_weather.temperature);
                const weatherElem = document.getElementById('st-weather-txt');
                const waterElem = document.getElementById('st-water-txt');
                if(weatherElem) weatherElem.innerHTML = air + '°C';
                let water = Math.min(28, Math.max(10, air - 2));
                if(waterElem) waterElem.innerHTML = water;
            }
        } catch(e) {
            const weatherElem = document.getElementById('st-weather-txt');
            const waterElem = document.getElementById('st-water-txt');
            if(weatherElem) weatherElem.innerHTML = '23°C';
            if(waterElem) waterElem.innerHTML = '21°C';
        }
    }
    fetchWeatherAndSea();

    // ========== ВРЕМЯ ==========
    function updateTime() {
        const timeElem = document.getElementById('st-time-txt');
        if(timeElem) {
            timeElem.textContent = new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'});
        }
    }
    updateTime();
    setInterval(updateTime, 60000);

    // ========== ГОРИЗОНТАЛЬНАЯ ПРОКРУТКА ФОТОПЛЁНКИ ==========
    const filmstrip = document.querySelector('.filmstrip-section');
    let isDown = false;
    let startX;
    let scrollLeft;

    if(filmstrip) {
        filmstrip.addEventListener('mousedown', (e) => {
            isDown = true;
            filmstrip.style.cursor = 'grabbing';
            startX = e.pageX - filmstrip.offsetLeft;
            scrollLeft = filmstrip.scrollLeft;
        });
        filmstrip.addEventListener('mouseleave', () => {
            isDown = false;
            filmstrip.style.cursor = 'grab';
        });
        filmstrip.addEventListener('mouseup', () => {
            isDown = false;
            filmstrip.style.cursor = 'grab';
        });
        filmstrip.addEventListener('mousemove', (e) => {
            if(!isDown) return;
            e.preventDefault();
            const x = e.pageX - filmstrip.offsetLeft;
            const walk = (x - startX) * 1.5;
            filmstrip.scrollLeft = scrollLeft - walk;
        });
        filmstrip.addEventListener('touchstart', (e) => {
            isDown = true;
            startX = e.touches[0].pageX - filmstrip.offsetLeft;
            scrollLeft = filmstrip.scrollLeft;
        });
        filmstrip.addEventListener('touchend', () => {
            isDown = false;
        });
        filmstrip.addEventListener('touchmove', (e) => {
            if(!isDown) return;
            const x = e.touches[0].pageX - filmstrip.offsetLeft;
            const walk = (x - startX) * 1.5;
            filmstrip.scrollLeft = scrollLeft - walk;
        });
        filmstrip.style.cursor = 'grab';
    }

    // ========== САМОЛЁТ ==========
    const plane = document.getElementById('planeCorner');
    let isMobile = /iPhone|iPad|iPod|Android|Mobile|webOS|BlackBerry|Windows Phone/i.test(navigator.userAgent);

    function flyToMountains() {
        if(!plane) return;
        if(isMobile) {
            plane.classList.add('plane-fly-mobile');
            setTimeout(() => { window.location.href = '../Roza/Roza.html'; }, 5000);
        } else {
            plane.classList.add('plane-fly');
            setTimeout(() => { window.location.href = '../Roza/Roza.html'; }, 3000);
        }
    }

    if(isMobile && plane) {
        const planeInner = plane.querySelector('.plane-inner');
        if(planeInner) {
            planeInner.innerHTML = `
                <div class="plane-icon">✈️</div>
                <div class="plane-text">А может в Горы?</div>
            `;
            planeInner.style.gap = '10px';
            planeInner.style.padding = '10px 18px';
        }
        plane.style.animation = 'planeBlinkMobile 0.8s ease-in-out infinite';
        plane.style.boxShadow = '0 0 15px rgba(255,200,0,0.6)';
        plane.style.borderRadius = '60px';
        plane.style.width = 'auto';
        plane.addEventListener('click', (e) => {
            e.stopPropagation();
            flyToMountains();
        });
        plane.addEventListener('touchstart', (e) => {
            e.stopPropagation();
            flyToMountains();
        });
    }

    if(!isMobile && plane) {
        plane.addEventListener('click', (e) => {
            e.stopPropagation();
            flyToMountains();
        });
    }

    // ========== КНОПКА НАВЕРХ ==========
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    if(scrollTopBtn) {
        window.addEventListener('scroll', () => {
            if(window.scrollY > 300) {
                scrollTopBtn.classList.add('show');
            } else {
                scrollTopBtn.classList.remove('show');
            }
        });
        
        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ========== МОБИЛЬНОЕ МЕНЮ ==========
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
    const mobileMenuClose = document.getElementById('mobileMenuClose');
    const mobileRoutesBtn = document.getElementById('mobileRoutesBtn');
    const mobileRoutesSub = document.getElementById('mobileRoutesSub');

    if(mobileMenuBtn && mobileMenuOverlay) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenuOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
        
        if(mobileMenuClose) {
            mobileMenuClose.addEventListener('click', () => {
                mobileMenuOverlay.classList.remove('active');
                document.body.style.overflow = '';
            });
        }
        
        mobileMenuOverlay.addEventListener('click', (e) => {
            if(e.target === mobileMenuOverlay) {
                mobileMenuOverlay.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
        
        if(mobileRoutesBtn && mobileRoutesSub) {
            mobileRoutesBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if(mobileRoutesSub.style.display === 'none' || mobileRoutesSub.style.display === '') {
                    mobileRoutesSub.style.display = 'flex';
                } else {
                    mobileRoutesSub.style.display = 'none';
                }
            });
        }
        
        const menuItems = document.querySelectorAll('.mobile-menu-item[data-target]');
        menuItems.forEach(item => {
            item.addEventListener('click', () => {
                const target = item.getAttribute('data-target');
                if(target === 'index') {
                    window.location.href = '../index.html';
                } else if(target === 'places') {
                    const filmSection = document.getElementById('section-film');
                    if(filmSection) filmSection.scrollIntoView({ behavior: 'smooth' });
                } else if(target === 'review') {
                    alert('📧 Поделитесь впечатлением: angelina.chernovalova@yandex.ru');
                }
                mobileMenuOverlay.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // ========== ПК ЛИАНА (УЗЛЫ) ==========
    const knotHome = document.getElementById('knotHome');
    const knotPlaces = document.getElementById('knotPlaces');
    const knotReview = document.getElementById('knotReview');

    if(knotHome) {
        knotHome.addEventListener('click', () => {
            window.location.href = '../index.html';
        });
    }

    if(knotPlaces) {
        knotPlaces.addEventListener('click', () => {
            const filmSection = document.getElementById('section-film');
            if(filmSection) filmSection.scrollIntoView({ behavior: 'smooth' });
        });
    }

    if(knotReview) {
        knotReview.addEventListener('click', () => {
            alert('📧 Поделитесь впечатлением: angelina.chernovalova@yandex.ru');
        });
    }

})();
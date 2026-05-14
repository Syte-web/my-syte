/**
 * Sochi.js — логика страницы Сочи
 */

(function() {
    "use strict";

    // ======================== ЗАЩИТА ОТ ДВОЙНЫХ НАЖАТИЙ ========================
    let lastClickTime = 0;
    const CLICK_DELAY = 300; // миллисекунд

    function safeHandler(handler) {
        return function(e) {
            const now = Date.now();
            if (now - lastClickTime < CLICK_DELAY) return;
            lastClickTime = now;
            e.preventDefault();
            e.stopPropagation();
            handler(e);
        };
    }

    // ======================== МУЗЫКА ========================
    const photoMusicBtn = document.getElementById('photoMusicBtn');
    const photoMusicState = document.getElementById('photoMusicState');
    const sochiMusic = document.getElementById('sochiMusic');
    let isMusicPlaying = false;

    if (photoMusicBtn && sochiMusic) {
        const toggleMusic = (e) => {
            if (isMusicPlaying) {
                sochiMusic.pause();
                if (photoMusicState) photoMusicState.textContent = '▶';
                isMusicPlaying = false;
            } else {
                sochiMusic.play().catch(err => console.log('Автовоспроизведение заблокировано:', err));
                if (photoMusicState) photoMusicState.textContent = '⏸';
                isMusicPlaying = true;
            }
        };
        photoMusicBtn.addEventListener('click', safeHandler(toggleMusic));
    }

    // ======================== АНИМАЦИЯ ПЕЧАТИ ========================
    const typedSpan = document.getElementById("typedText");
    if (typedSpan) {
        const cityName = "Сочи";
        let idx = 0;
        let isDeleting = false;
        
        function typeAnimation() {
            if (!isDeleting && idx <= cityName.length) {
                typedSpan.textContent = cityName.substring(0, idx);
                idx++;
                setTimeout(typeAnimation, 150);
            } else if (isDeleting && idx >= 0) {
                typedSpan.textContent = cityName.substring(0, idx);
                idx--;
                setTimeout(typeAnimation, 100);
            } else if (idx === cityName.length + 1) {
                isDeleting = true;
                setTimeout(typeAnimation, 2000);
            } else if (idx === -1) {
                isDeleting = false;
                idx = 0;
                setTimeout(typeAnimation, 500);
            }
        }
        typeAnimation();
    }

    // ======================== ТЕМА ========================
    function applyTheme(t) {
        const themeIcon = document.getElementById('themeIcon');
        const themeText = document.getElementById('themeText');
        if (t === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
            if (themeIcon) themeIcon.textContent = '🌙';
            if (themeText) themeText.textContent = 'Ночь';
        } else {
            document.documentElement.removeAttribute('data-theme');
            if (themeIcon) themeIcon.textContent = '☀️';
            if (themeText) themeText.textContent = 'День';
        }
        localStorage.setItem('siteTheme', t);
    }

    const savedTheme = localStorage.getItem('siteTheme');
    applyTheme(savedTheme === 'dark' ? 'dark' : 'light');

    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        const toggleTheme = () => {
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            applyTheme(isDark ? 'light' : 'dark');
        };
        themeToggle.addEventListener('click', safeHandler(toggleTheme));
    }

    // ======================== ПОГОДА ========================
    async function fetchWeatherAndSea() {
        try {
            const res = await fetch('https://api.open-meteo.com/v1/forecast?latitude=43.5855&longitude=39.7231&current_weather=true');
            const data = await res.json();
            if (data.current_weather) {
                const air = Math.round(data.current_weather.temperature);
                const weatherSpan = document.getElementById('st-weather-txt');
                if (weatherSpan) weatherSpan.innerText = air + '°C';
                let water = Math.min(28, Math.max(10, air - 2));
                const waterSpan = document.getElementById('st-water-txt');
                if (waterSpan) waterSpan.innerText = water;
            }
        } catch (e) {
            const weatherSpan = document.getElementById('st-weather-txt');
            const waterSpan = document.getElementById('st-water-txt');
            if (weatherSpan) weatherSpan.innerText = '22°C';
            if (waterSpan) waterSpan.innerText = '20°C';
        }
    }
    fetchWeatherAndSea();

    // ======================== ВРЕМЯ ========================
    function updateTime() {
        const timeSpan = document.getElementById('st-time-txt');
        if (timeSpan) {
            timeSpan.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }
    }
    updateTime();
    setInterval(updateTime, 60000);

    // ======================== КАРУСЕЛЬ РИВЬЕРА (с защитой от двойных нажатий) ========================
    const rivImages = ["20.jpg", "21.jpg", "22.jpg"];
    let rIdx = 0;
    let rIsAnimating = false;
    const rImg = document.getElementById('rivieraImg');
    
    function updateRiviera() {
        if (rImg && !rIsAnimating) {
            rImg.src = "Img.Sochi/" + rivImages[rIdx];
        }
    }
    
    const prevRiv = document.getElementById('prevRivieraBtn');
    const nextRiv = document.getElementById('nextRivieraBtn');
    
    function changeRiviera(delta) {
        if (rIsAnimating) return;
        rIsAnimating = true;
        rIdx = (rIdx + delta + rivImages.length) % rivImages.length;
        updateRiviera();
        setTimeout(() => { rIsAnimating = false; }, 300);
    }
    
    if (prevRiv) {
        prevRiv.addEventListener('click', safeHandler(() => changeRiviera(-1)));
    }
    if (nextRiv) {
        nextRiv.addEventListener('click', safeHandler(() => changeRiviera(1)));
    }
    updateRiviera();

    // ======================== КАРУСЕЛЬ МУЗЕЙ (с защитой от двойных нажатий) ========================
    const musImages = ["24.jpg", "25.jpg", "26.jpg", "27.jpg"];
    let mIdx = 0;
    let mIsAnimating = false;
    const mImg = document.getElementById('museum90Img');
    
    function updateMuseum() {
        if (mImg && !mIsAnimating) {
            mImg.src = "Img.Sochi/" + musImages[mIdx];
        }
    }
    
    const prevMus = document.getElementById('prevMuseumBtn');
    const nextMus = document.getElementById('nextMuseumBtn');
    
    function changeMuseum(delta) {
        if (mIsAnimating) return;
        mIsAnimating = true;
        mIdx = (mIdx + delta + musImages.length) % musImages.length;
        updateMuseum();
        setTimeout(() => { mIsAnimating = false; }, 300);
    }
    
    if (prevMus) {
        prevMus.addEventListener('click', safeHandler(() => changeMuseum(-1)));
    }
    if (nextMus) {
        nextMus.addEventListener('click', safeHandler(() => changeMuseum(1)));
    }
    updateMuseum();

    // ======================== МОДАЛКА ВЫБОРА ========================
    const modal = document.getElementById('choiceModal');
    const openChoiceBtn = document.getElementById('openChoiceBtn');
    let savedScrollY = 0;

    function openModal() {
        if (!modal) return;
        savedScrollY = window.scrollY;
        document.body.style.position = 'fixed';
        document.body.style.top = `-${savedScrollY}px`;
        document.body.style.width = '100%';
        document.body.style.overflow = 'hidden';
        modal.classList.add('active');
    }

    function closeModal() {
        if (!modal) return;
        modal.classList.remove('active');
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        window.scrollTo(0, savedScrollY);
    }

    if (openChoiceBtn && modal) {
        openChoiceBtn.addEventListener('click', safeHandler(openModal));
    }

    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
    }

    // КНОПКА "НА ГЛАВНУЮ" В МОДАЛЬНОМ ОКНЕ
    const backToMainBtn = document.getElementById('backToMainModalBtn');
    if (backToMainBtn) {
        backToMainBtn.addEventListener('click', safeHandler(() => {
            window.location.href = '../index.html';
        }));
    }
    
    // КАРТОЧКИ В МОДАЛЬНОМ ОКНЕ
    const rozaCard = document.getElementById('rozaCard');
    const siriusCard = document.getElementById('siriusCard');
    
    if (rozaCard) {
        rozaCard.addEventListener('click', safeHandler(() => {
            window.location.href = '../Roza/Roza.html';
        }));
    }
    if (siriusCard) {
        siriusCard.addEventListener('click', safeHandler(() => {
            window.location.href = '../Sirius/Sirius.html';
        }));
    }

    // ======================== КНОПКА НАВЕРХ ========================
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    if (scrollTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                scrollTopBtn.classList.add('show');
            } else {
                scrollTopBtn.classList.remove('show');
            }
        });
        scrollTopBtn.addEventListener('click', safeHandler(() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }));
    }

    console.log('Sochi.js загружен - все обработчики оптимизированы');
})();
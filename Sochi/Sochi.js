/**
 * Sochi.js — логика страницы Сочи
 */

(function() {
    "use strict";

    // ======================== МУЗЫКА ========================
    const photoMusicBtn = document.getElementById('photoMusicBtn');
    const photoMusicState = document.getElementById('photoMusicState');
    const sochiMusic = document.getElementById('sochiMusic');
    let isMusicPlaying = false;

    if (photoMusicBtn && sochiMusic) {
        const toggleMusic = (e) => {
            e.stopPropagation();
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
        photoMusicBtn.addEventListener('click', toggleMusic);
        photoMusicBtn.addEventListener('touchstart', toggleMusic);
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
        themeToggle.addEventListener('click', toggleTheme);
        themeToggle.addEventListener('touchstart', toggleTheme);
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

    // ======================== КАРУСЕЛЬ РИВЬЕРА ========================
    const rivImages = ["20.jpg", "21.jpg", "22.jpg"];
    let rIdx = 0;
    const rImg = document.getElementById('rivieraImg');
    function updateRiviera() {
        if (rImg) rImg.src = "Img.Sochi/" + rivImages[rIdx];
    }
    const prevRiv = document.getElementById('prevRivieraBtn');
    const nextRiv = document.getElementById('nextRivieraBtn');
    
    if (prevRiv) {
        const prevHandler = () => { rIdx = (rIdx - 1 + rivImages.length) % rivImages.length; updateRiviera(); };
        prevRiv.addEventListener('click', prevHandler);
        prevRiv.addEventListener('touchstart', prevHandler);
    }
    if (nextRiv) {
        const nextHandler = () => { rIdx = (rIdx + 1) % rivImages.length; updateRiviera(); };
        nextRiv.addEventListener('click', nextHandler);
        nextRiv.addEventListener('touchstart', nextHandler);
    }
    updateRiviera();

    // ======================== КАРУСЕЛЬ МУЗЕЙ ========================
    const musImages = ["24.jpg", "25.jpg", "26.jpg", "27.jpg"];
    let mIdx = 0;
    const mImg = document.getElementById('museum90Img');
    function updateMuseum() {
        if (mImg) mImg.src = "Img.Sochi/" + musImages[mIdx];
    }
    const prevMus = document.getElementById('prevMuseumBtn');
    const nextMus = document.getElementById('nextMuseumBtn');
    
    if (prevMus) {
        const prevHandler = () => { mIdx = (mIdx - 1 + musImages.length) % musImages.length; updateMuseum(); };
        prevMus.addEventListener('click', prevHandler);
        prevMus.addEventListener('touchstart', prevHandler);
    }
    if (nextMus) {
        const nextHandler = () => { mIdx = (mIdx + 1) % musImages.length; updateMuseum(); };
        nextMus.addEventListener('click', nextHandler);
        nextMus.addEventListener('touchstart', nextHandler);
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
        const openHandler = (e) => {
            e.stopPropagation();
            openModal();
        };
        openChoiceBtn.addEventListener('click', openHandler);
        openChoiceBtn.addEventListener('touchstart', openHandler);
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
        const goToMain = () => { window.location.href = '../index.html'; };
        backToMainBtn.addEventListener('click', goToMain);
        backToMainBtn.addEventListener('touchstart', goToMain);
    }
    
    // КАРТОЧКИ В МОДАЛЬНОМ ОКНЕ
    const rozaCard = document.getElementById('rozaCard');
    const siriusCard = document.getElementById('siriusCard');
    
    if (rozaCard) {
        const goToRoza = () => { window.location.href = '../Roza/Roza.html'; };
        rozaCard.addEventListener('click', goToRoza);
        rozaCard.addEventListener('touchstart', goToRoza);
    }
    if (siriusCard) {
        const goToSirius = () => { window.location.href = '../Sirius/Sirius.html'; };
        siriusCard.addEventListener('click', goToSirius);
        siriusCard.addEventListener('touchstart', goToSirius);
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
        const scrollToTop = () => { window.scrollTo({ top: 0, behavior: 'smooth' }); };
        scrollTopBtn.addEventListener('click', scrollToTop);
        scrollTopBtn.addEventListener('touchstart', scrollToTop);
    }

    console.log('Sochi.js загружен - модальное окно адаптировано для мобильных');
})();
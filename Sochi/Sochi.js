/**
 * Sochi.js — логика страницы Сочи (без дублирования menu.js)
 */

(function() {
    "use strict";

    // ======================== МУЗЫКА ========================
    const photoMusicBtn = document.getElementById('photoMusicBtn');
    const photoMusicState = document.getElementById('photoMusicState');
    const sochiMusic = document.getElementById('sochiMusic');
    let isMusicPlaying = false;

    if (photoMusicBtn && sochiMusic) {
        photoMusicBtn.addEventListener('click', (e) => {
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
        });
    }

    // ======================== АНИМАЦИЯ ПЕЧАТИ ========================
    const typedSpan = document.getElementById("typedText");
    const cityName = "Сочи";
    let idx = 0, del = false;

    function typeAnim() {
        if (!typedSpan) return;
        if (!del) {
            typedSpan.textContent = cityName.substring(0, idx + 1);
            idx++;
            if (idx === cityName.length) {
                del = true;
                setTimeout(typeAnim, 1800);
                return;
            }
        } else {
            typedSpan.textContent = cityName.substring(0, idx - 1);
            idx--;
            if (idx === 0) {
                del = false;
                setTimeout(typeAnim, 400);
                return;
            }
        }
        setTimeout(typeAnim, del ? 120 : 200);
    }
    typeAnim();

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
        themeToggle.addEventListener('click', () => {
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            applyTheme(isDark ? 'light' : 'dark');
        });
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
    if (prevRiv) prevRiv.addEventListener('click', () => { rIdx = (rIdx - 1 + rivImages.length) % rivImages.length; updateRiviera(); });
    if (nextRiv) nextRiv.addEventListener('click', () => { rIdx = (rIdx + 1) % rivImages.length; updateRiviera(); });
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
    if (prevMus) prevMus.addEventListener('click', () => { mIdx = (mIdx - 1 + musImages.length) % musImages.length; updateMuseum(); });
    if (nextMus) nextMus.addEventListener('click', () => { mIdx = (mIdx + 1) % musImages.length; updateMuseum(); });
    updateMuseum();

    // ======================== МОДАЛКА ВЫБОРА ========================
    const modal = document.getElementById('choiceModal');
    const openChoiceBtn = document.getElementById('openChoiceBtn');
    if (openChoiceBtn && modal) {
        openChoiceBtn.addEventListener('click', () => {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
    
    // КНОПКА "НА ГЛАВНУЮ" В МОДАЛЬНОМ ОКНЕ
    // (путь ../index.html так как мы в папке Sochi/)
    const backToMainBtn = document.getElementById('backToMainModalBtn');
    if (backToMainBtn) {
        backToMainBtn.addEventListener('click', () => {
            window.location.href = '../index.html';
        });
    }
    
    // КАРТОЧКИ В МОДАЛЬНОМ ОКНЕ
    const rozaCard = document.getElementById('rozaCard');
    const siriusCard = document.getElementById('siriusCard');
    if (rozaCard) rozaCard.addEventListener('click', () => { window.location.href = '../Roza/Roza.html'; });
    if (siriusCard) siriusCard.addEventListener('click', () => { window.location.href = '../Sirius/Sirius.html'; });

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
        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

})();
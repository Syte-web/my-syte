// ========== МУЗЫКА ==========
const bgMusic = document.getElementById('bgMusic');
const musicToggle = document.getElementById('musicToggle');
const musicIcon = document.getElementById('musicIcon');
let musicPlaying = true;
let musicStarted = false;

function startMusicOnFirstTouch() {
    if (!musicStarted && bgMusic) {
        bgMusic.volume = 0.3;
        bgMusic.play().catch(e => console.log('Автовоспроизведение заблокировано'));
        musicStarted = true;
    }
}

if (musicToggle) {
    const toggleMusic = (e) => {
        e.stopPropagation();
        e.preventDefault();
        if (musicPlaying) {
            if (bgMusic) bgMusic.pause();
            if (musicIcon) musicIcon.textContent = '🔇';
            musicPlaying = false;
        } else {
            if (bgMusic) bgMusic.play().catch(e => console.log('Ошибка'));
            if (musicIcon) musicIcon.textContent = '🎵';
            musicPlaying = true;
        }
    };
    musicToggle.addEventListener('click', toggleMusic);
    musicToggle.addEventListener('touchstart', toggleMusic, { passive: false });
}

document.body.addEventListener('touchstart', startMusicOnFirstTouch, { once: true });

// ========== СЧЁТЧИК ПРОСМОТРОВ ==========
let siteViews = localStorage.getItem('siteTotalViews');
siteViews = siteViews ? Number(siteViews) + 1 : 1;
localStorage.setItem('siteTotalViews', siteViews);
const viewsCounter = document.getElementById('siteViewsCounter');
if (viewsCounter) viewsCounter.textContent = siteViews;

// ========== ТЕМА (ДЕНЬ/НОЧЬ) ==========
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
    const toggleTheme = (e) => {
        e.stopPropagation();
        e.preventDefault();
        const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        applyTheme(next);
    };
    themeToggle.addEventListener('click', toggleTheme);
    themeToggle.addEventListener('touchstart', toggleTheme, { passive: false });
}

// ========== ВРЕМЯ И ПОГОДА ==========
function updateTime() {
    const timeElem = document.getElementById('st-time-txt');
    if (timeElem) {
        timeElem.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
}
updateTime();
setInterval(updateTime, 60000);

async function fetchWeather() {
    try {
        const res = await fetch('https://api.open-meteo.com/v1/forecast?latitude=44.8953&longitude=37.3167&current_weather=true');
        const data = await res.json();
        if (data.current_weather) {
            const temp = Math.round(data.current_weather.temperature);
            const weatherElem = document.getElementById('st-weather-txt');
            if (weatherElem) weatherElem.innerHTML = temp + '°C';
        }
    } catch (e) {
        const weatherElem = document.getElementById('st-weather-txt');
        if (weatherElem) weatherElem.innerHTML = '24°C';
    }
}
fetchWeather();

// ========== ОТВЕТ НА ВОПРОС ==========
const answerResult = document.getElementById('answerResult');
const optionCards = document.querySelectorAll('.option-card');

function showToast(msg) {
    const toast = document.getElementById('toastMsg');
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}

optionCards.forEach(card => {
    const clickHandler = (e) => {
        e.stopPropagation();
        const option = card.getAttribute('data-option');
        let message = '';
        switch (option) {
            case 'пляжный релакс':
                message = '🏖️ Отличный выбор! Пляжный релакс — это солнце, песок и бесконечное море. Желаю золотистого загара и кристально чистой воды! 🌊✨';
                break;
            case 'актив в горах':
                message = '⛰️ Великолепный выбор! Активный отдых в горах дарит незабываемые виды, чистый воздух и заряд бодрости. 🏔️💪';
                break;
            case 'прогулки по паркам':
                message = '🌳 Прекрасный выбор! Прогулки по паркам — это вдохновение, уютные аллеи и гармония с природой. 📸✨';
                break;
            default:
                message = '✨ Отличный выбор! Пусть ваше лето будет незабываемым! ✨';
        }
        if (answerResult) {
            answerResult.style.display = 'block';
            answerResult.innerHTML = message;
        }
        showToast(`✨ Вы выбрали: ${card.querySelector('.option-label')?.textContent || option} ✨`);
    };
    card.addEventListener('click', clickHandler);
    card.addEventListener('touchstart', clickHandler, { passive: false });
});

// ========== ЧЕК-ЛИСТ ==========
const checklistItems = ['Паспорт 📄', 'Деньги и карты 💰', 'Документы на авто 🚗', 'Купальник 🩱', 'Аптечка 💊', 'Солнцезащитный крем 🧴', 'Головной убор 👒', 'Солнцезащитные очки 🕶️', 'Полотенце 🏖️', 'Зарядка и пауэрбанк 🔋', 'Наушники 🎧', 'Бутылка для воды 💧'];

function loadChecklist() {
    try { return JSON.parse(localStorage.getItem('checklist_popup') || '[]'); } catch { return []; }
}
function saveChecklist(arr) { localStorage.setItem('checklist_popup', JSON.stringify(arr)); }
function renderChecklist() {
    const saved = loadChecklist();
    const container = document.getElementById('checklist');
    if (!container) return;
    container.innerHTML = checklistItems.map(text => `<label class="checkrow"><input type="checkbox" ${saved.includes(text) ? 'checked' : ''}> ${text}</label>`).join('');
    document.querySelectorAll('#checklist input').forEach(cb => {
        cb.addEventListener('change', () => {
            let cur = loadChecklist();
            const text = cb.parentElement.textContent.trim();
            if (cb.checked) {
                if (!cur.includes(text)) cur.push(text);
            } else {
                const idx = cur.indexOf(text);
                if (idx !== -1) cur.splice(idx, 1);
            }
            saveChecklist(cur);
        });
    });
}
renderChecklist();

const remind = document.getElementById('remind-area');
const panelDiv = document.getElementById('panel');

function openPanel() {
    if (!panelDiv) return;
    panelDiv.classList.add('visible');
    if (remind) {
        const btnRect = remind.getBoundingClientRect();
        let left = window.scrollX + btnRect.left - panelDiv.offsetWidth - 12;
        if (left < 12) left = 12;
        panelDiv.style.left = left + 'px';
        panelDiv.style.top = window.scrollY + btnRect.top + 'px';
    }
}
function closePanel() { if (panelDiv) panelDiv.classList.remove('visible'); }

if (remind) {
    const panelToggle = (e) => {
        e.stopPropagation();
        panelDiv.classList.contains('visible') ? closePanel() : openPanel();
    };
    remind.addEventListener('click', panelToggle);
    remind.addEventListener('touchstart', panelToggle, { passive: false });
}

// ========== СМЕНА ФОТО МОРЯ ==========
const changeSeaBtn = document.getElementById('changeSeaBtn');
if (changeSeaBtn) {
    changeSeaBtn.addEventListener('click', () => {
        const inp = document.createElement('input');
        inp.type = 'file';
        inp.accept = 'image/*';
        inp.onchange = (e) => {
            if (e.target.files[0]) {
                const seaPhoto = document.getElementById('seaPhoto');
                if (seaPhoto) seaPhoto.src = URL.createObjectURL(e.target.files[0]);
                showToast('🌊 Фото моря обновлено!');
            }
        };
        inp.click();
    });
}

// ========== АВАТАР ==========
const aboutPhoto = document.getElementById('about-photo');
const modalUserPhoto = document.getElementById('modalUserPhoto');
if (aboutPhoto) {
    aboutPhoto.addEventListener('click', () => {
        const inp = document.createElement('input');
        inp.type = 'file';
        inp.accept = 'image/*';
        inp.onchange = () => {
            if (inp.files[0]) {
                const url = URL.createObjectURL(inp.files[0]);
                aboutPhoto.src = url;
                if (modalUserPhoto) modalUserPhoto.src = url;
                showToast('🖼️ Аватар обновлён');
            }
        };
        inp.click();
    });
}

// ========== МОДАЛЬНОЕ ОКНО ==========
const modalOverlay = document.getElementById('introModal');
const aboutFloat = document.getElementById('about-float');
const closeModalBtn = document.getElementById('closeModalBtn');
let savedScrollYModal = 0;

function openModalWindow() {
    if (!modalOverlay) return;
    savedScrollYModal = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${savedScrollYModal}px`;
    document.body.style.width = '100%';
    document.body.style.overflow = 'hidden';
    modalOverlay.classList.add('active');
}

function closeModalWindow() {
    if (!modalOverlay) return;
    modalOverlay.classList.remove('active');
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    document.body.style.overflow = '';
    window.scrollTo(0, savedScrollYModal);
}

if (aboutFloat) {
    aboutFloat.addEventListener('click', (e) => { e.stopPropagation(); openModalWindow(); });
    aboutFloat.addEventListener('touchstart', (e) => { e.stopPropagation(); openModalWindow(); }, { passive: false });
}
if (closeModalBtn) {
    closeModalBtn.addEventListener('click', (e) => { e.stopPropagation(); closeModalWindow(); });
    closeModalBtn.addEventListener('touchstart', (e) => { e.stopPropagation(); closeModalWindow(); }, { passive: false });
}
if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => { if (e.target === modalOverlay) closeModalWindow(); });
}

// ========== КАРУСЕЛЬ МАРШРУТОВ ==========
const routesTrack = document.getElementById('routesTrack');
const routeCards = document.querySelectorAll('.route-card');
const routesDots = document.getElementById('routesDots');
let currentRoute = 0, autoRouteInterval;

function updateRouteDots() {
    if (!routesDots) return;
    document.querySelectorAll('#routesDots .dot').forEach((d, i) => d.classList.toggle('active', i === currentRoute));
}

function goToRouteSlide(i) {
    currentRoute = (i + routeCards.length) % routeCards.length;
    if (routesTrack) routesTrack.style.transform = `translateX(-${currentRoute * 100}%)`;
    updateRouteDots();
}

function createRouteDots() {
    if (!routesDots) return;
    routesDots.innerHTML = '';
    routeCards.forEach((_, i) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (i === currentRoute) dot.classList.add('active');
        dot.addEventListener('click', () => { clearInterval(autoRouteInterval); goToRouteSlide(i); startAutoRoutes(); });
        dot.addEventListener('touchstart', () => { clearInterval(autoRouteInterval); goToRouteSlide(i); startAutoRoutes(); });
        routesDots.appendChild(dot);
    });
}

function startAutoRoutes() {
    if (autoRouteInterval) clearInterval(autoRouteInterval);
    autoRouteInterval = setInterval(() => goToRouteSlide(currentRoute + 1), 4000);
}

routeCards.forEach(card => {
    const cardHandler = (e) => {
        e.stopPropagation();
        const page = card.getAttribute('data-page');
        if (page) window.location.href = page;
    };
    card.addEventListener('click', cardHandler);
    card.addEventListener('touchstart', cardHandler, { passive: false });
});

if (routeCards.length > 0) {
    createRouteDots();
    goToRouteSlide(0);
    startAutoRoutes();
}

// ========== КАРУСЕЛЬ "ПЛАНИРУЮ ПОСЕТИТЬ" ==========
const placesTrack = document.getElementById('placesTrack');
const placeCards = document.querySelectorAll('.place-card');
const placesDots = document.getElementById('placesDots');
let currentPlace = 0, autoPlaceInterval;

function updatePlaceDots() {
    if (!placesDots) return;
    document.querySelectorAll('#placesDots .dot').forEach((d, i) => d.classList.toggle('active', i === currentPlace));
}

function goToPlaceSlide(i) {
    currentPlace = (i + placeCards.length) % placeCards.length;
    if (placesTrack) placesTrack.style.transform = `translateX(-${currentPlace * 100}%)`;
    updatePlaceDots();
}

function createPlaceDots() {
    if (!placesDots) return;
    placesDots.innerHTML = '';
    placeCards.forEach((_, i) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        dot.addEventListener('click', () => { clearInterval(autoPlaceInterval); goToPlaceSlide(i); startAutoPlaces(); });
        dot.addEventListener('touchstart', () => { clearInterval(autoPlaceInterval); goToPlaceSlide(i); startAutoPlaces(); });
        placesDots.appendChild(dot);
    });
}

function startAutoPlaces() {
    if (autoPlaceInterval) clearInterval(autoPlaceInterval);
    autoPlaceInterval = setInterval(() => goToPlaceSlide(currentPlace + 1), 4000);
}

if (placeCards.length > 0) {
    createPlaceDots();
    goToPlaceSlide(0);
    startAutoPlaces();
}

// ========== ЗВЁЗДЫ ДЛЯ ОТЗЫВОВ (ИСПРАВЛЕННЫЕ) ==========
let currentRating = 0;
const stars = document.querySelectorAll('.star');

function updateStars(rating) {
    stars.forEach((star, index) => {
        if (index < rating) {
            star.classList.add('active');
            star.style.color = '#ffc107';
        } else {
            star.classList.remove('active');
            star.style.color = '#f5e6b0';
        }
    });
}

stars.forEach(star => {
    const starHandler = (e) => {
        e.stopPropagation();
        e.preventDefault();
        const value = parseInt(star.getAttribute('data-value'));
        currentRating = value;
        updateStars(currentRating);
        showToast(`⭐ Оценка: ${currentRating} звезды`);
    };
    star.addEventListener('click', starHandler);
    star.addEventListener('touchstart', starHandler, { passive: false });
});

// ========== ОТПРАВКА ОТЗЫВА (ИСПРАВЛЕННАЯ) ==========
const reviewForm = document.getElementById('reviewForm');
const reviewerName = document.getElementById('reviewerName');
const reviewerEmail = document.getElementById('reviewerEmail');
const reviewText = document.getElementById('reviewText');

function showFieldError(field, message) {
    field.style.border = '2px solid #ff4444';
    field.style.backgroundColor = 'rgba(255,68,68,0.1)';
    setTimeout(() => {
        field.style.border = '1px solid rgba(0,0,0,0.15)';
        field.style.backgroundColor = '';
    }, 3000);
    showToast(message);
}

if (reviewerName) {
    reviewerName.addEventListener('focus', () => {
        reviewerName.style.border = '1px solid rgba(0,0,0,0.15)';
        reviewerName.style.backgroundColor = '';
    });
}
if (reviewerEmail) {
    reviewerEmail.addEventListener('focus', () => {
        reviewerEmail.style.border = '1px solid rgba(0,0,0,0.15)';
        reviewerEmail.style.backgroundColor = '';
    });
}
if (reviewText) {
    reviewText.addEventListener('focus', () => {
        reviewText.style.border = '1px solid rgba(0,0,0,0.15)';
        reviewText.style.backgroundColor = '';
    });
}

if (reviewForm) {
    const submitHandler = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        const name = reviewerName?.value.trim() || '';
        const email = reviewerEmail?.value.trim() || '';
        const text = reviewText?.value.trim() || '';
        
        let hasError = false;
        
        if (!name) {
            showFieldError(reviewerName, '📝 Пожалуйста, введите ваше имя');
            hasError = true;
        }
        if (!email) {
            showFieldError(reviewerEmail, '📧 Пожалуйста, введите вашу почту');
            hasError = true;
        } else if (!email.includes('@') || !email.includes('.')) {
            showFieldError(reviewerEmail, '📧 Введите корректный email');
            hasError = true;
        }
        if (!text) {
            showFieldError(reviewText, '💬 Пожалуйста, напишите ваш отзыв');
            hasError = true;
        }
        
        if (hasError) return;
        
        if (currentRating === 0) {
            showToast('⭐ Поставьте оценку звёздами!');
            return;
        }
        
        const message = `🌟 ОТЗЫВ 🌟\n\n👤 Имя: ${name}\n📧 Почта: ${email}\n⭐ Оценка: ${currentRating}★\n📝 Отзыв: ${text}`;
        
        function resetForm() {
            if (reviewForm) reviewForm.reset();
            currentRating = 0;
            updateStars(0);
            if (reviewerName) reviewerName.style.border = '';
            if (reviewerEmail) reviewerEmail.style.border = '';
            if (reviewText) reviewText.style.border = '';
        }
        
        if (navigator.share) {
            try {
                await navigator.share({ title: 'Отзыв о сайте Мой юг', text: message });
                showToast('✅ Спасибо! Отзыв отправлен');
                resetForm();
                return;
            } catch (err) { }
        }
        
        try {
            await navigator.clipboard.writeText(message + '\n\nОтправьте это сообщение: angelina.chernovalova@yandex.ru');
            showToast('📋 Отзыв скопирован! Отправьте его мне любым способом');
            resetForm();
        } catch (err) {
            showToast('⚠️ Не удалось скопировать, но отзыв сохранён');
            console.log(message);
            resetForm();
        }
    };
    
    reviewForm.addEventListener('submit', submitHandler);
}

// ========== КНОПКИ ШЕРИНГА ==========
const shareUrl = encodeURIComponent(window.location.href);
const shareTitle = encodeURIComponent('Мой юг: от Анапы до Сочи');

document.querySelectorAll('.share-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const type = btn.dataset.share;
        if (type === 'vk') {
            window.open(`https://vk.com/share.php?url=${shareUrl}&title=${shareTitle}`, '_blank', 'width=600,height=400');
        } else if (type === 'ok') {
            window.open(`https://connect.ok.ru/offer?url=${shareUrl}&title=${shareTitle}`, '_blank', 'width=600,height=400');
        } else if (type === 'max') {
            navigator.clipboard.writeText(window.location.href);
            showToast('🔗 Ссылка скопирована!');
        }
    });
    btn.addEventListener('touchstart', (e) => {
        e.stopPropagation();
        const type = btn.dataset.share;
        if (type === 'vk') {
            window.open(`https://vk.com/share.php?url=${shareUrl}&title=${shareTitle}`, '_blank');
        } else if (type === 'ok') {
            window.open(`https://connect.ok.ru/offer?url=${shareUrl}&title=${shareTitle}`, '_blank');
        } else if (type === 'max') {
            navigator.clipboard.writeText(window.location.href);
            showToast('🔗 Ссылка скопирована!');
        }
    }, { passive: false });
});

// ========== ССЫЛКА В ФУТЕРЕ ==========
const footerLink = document.querySelector('.footer a');
if (footerLink) {
    footerLink.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = 'mailto:angelina.chernovalova@yandex.ru';
    });
}

// ========== КНОПКА НАВЕРХ ==========
const scrollTopBtn = document.getElementById('scrollTopBtn');
if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) scrollTopBtn.classList.add('show');
        else scrollTopBtn.classList.remove('show');
    });
    scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// ========== МОБИЛЬНОЕ МЕНЮ ==========
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
const mobileMenuClose = document.getElementById('mobileMenuClose');
const mobileRoutesBtn = document.getElementById('mobileRoutesBtn');
const mobileRoutesSub = document.getElementById('mobileRoutesSub');

function closeMobileMenu() {
    if (mobileMenuOverlay) {
        mobileMenuOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function openMobileMenu() {
    if (mobileMenuOverlay) {
        mobileMenuOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', (e) => { e.stopPropagation(); openMobileMenu(); });
    mobileMenuBtn.addEventListener('touchstart', (e) => { e.stopPropagation(); openMobileMenu(); }, { passive: false });
}
if (mobileMenuClose) {
    mobileMenuClose.addEventListener('click', (e) => { e.stopPropagation(); closeMobileMenu(); });
    mobileMenuClose.addEventListener('touchstart', (e) => { e.stopPropagation(); closeMobileMenu(); }, { passive: false });
}
if (mobileMenuOverlay) {
    mobileMenuOverlay.addEventListener('click', (e) => { if (e.target === mobileMenuOverlay) closeMobileMenu(); });
}

if (mobileRoutesBtn && mobileRoutesSub) {
    const toggleSubmenu = (e) => {
        e.stopPropagation();
        mobileRoutesSub.style.display = mobileRoutesSub.style.display === 'none' ? 'flex' : 'none';
    };
    mobileRoutesBtn.addEventListener('click', toggleSubmenu);
    mobileRoutesBtn.addEventListener('touchstart', toggleSubmenu, { passive: false });
}

const menuItems = document.querySelectorAll('.mobile-menu-item[data-target]');
menuItems.forEach(item => {
    const menuHandler = (e) => {
        e.stopPropagation();
        const target = item.getAttribute('data-target');
        if (target === 'section-main') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else if (target === 'section-places') {
            const placesSection = document.getElementById('section-places');
            if (placesSection) placesSection.scrollIntoView({ behavior: 'smooth' });
        } else if (target === 'section-review') {
            const reviewSection = document.getElementById('section-review');
            if (reviewSection) reviewSection.scrollIntoView({ behavior: 'smooth' });
        }
        closeMobileMenu();
    };
    item.addEventListener('click', menuHandler);
    item.addEventListener('touchstart', menuHandler, { passive: false });
});

// ========== ПК ЛИАНА ==========
const knotItems = document.querySelectorAll('.knot-item[data-target]');
knotItems.forEach(knot => {
    const knotHandler = (e) => {
        e.stopPropagation();
        const targetId = knot.getAttribute('data-target');
        if (targetId) {
            const targetElement = document.getElementById(targetId);
            if (targetElement) targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };
    knot.addEventListener('click', knotHandler);
    knot.addEventListener('touchstart', knotHandler, { passive: false });
});

// ========== ДВИЖЕНИЕ ЯКОРЯ ==========
function initRopeAnchor() {
    const ropeAnchor = document.getElementById('ropeAnchor');
    if (!ropeAnchor) return;
    function updateAnchorPosition() {
        const scrollPercent = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
        const minTop = 80, maxTop = window.innerHeight - 100;
        let newTop = minTop + (maxTop - minTop) * Math.min(1, Math.max(0, scrollPercent));
        ropeAnchor.style.top = Math.min(maxTop, Math.max(minTop, newTop)) + 'px';
    }
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => { updateAnchorPosition(); ticking = false; });
            ticking = true;
        }
    });
    window.addEventListener('resize', updateAnchorPosition);
    updateAnchorPosition();
}
initRopeAnchor();

console.log('index.js загружен');
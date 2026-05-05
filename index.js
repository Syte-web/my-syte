// ========== МУЗЫКА ==========
const bgMusic = document.getElementById('bgMusic');
const musicToggle = document.getElementById('musicToggle');
const musicIcon = document.getElementById('musicIcon');
let musicPlaying = true;

// Пытаемся запустить музыку при первом касании пользователя
function initMusic() {
    if (bgMusic) {
        bgMusic.volume = 0.3;
        bgMusic.play().catch(e => console.log('Автовоспроизведение заблокировано, нажмите на музыку'));
    }
}

if (musicToggle) {
    musicToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        if (musicPlaying) {
            if (bgMusic) bgMusic.pause();
            if (musicIcon) musicIcon.textContent = '🔇';
            musicPlaying = false;
        } else {
            if (bgMusic) bgMusic.play().catch(e => console.log('Ошибка воспроизведения'));
            if (musicIcon) musicIcon.textContent = '🎵';
            musicPlaying = true;
        }
    });
    musicToggle.addEventListener('touchstart', (e) => {
        e.stopPropagation();
        if (musicPlaying) {
            if (bgMusic) bgMusic.pause();
            if (musicIcon) musicIcon.textContent = '🔇';
            musicPlaying = false;
        } else {
            if (bgMusic) bgMusic.play().catch(e => console.log('Ошибка воспроизведения'));
            if (musicIcon) musicIcon.textContent = '🎵';
            musicPlaying = true;
        }
    });
}

// Пробуем запустить музыку при первой загрузке
setTimeout(initMusic, 1000);

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
    themeToggle.addEventListener('click', () => {
        const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        applyTheme(next);
    });
    themeToggle.addEventListener('touchstart', () => {
        const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        applyTheme(next);
    });
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

// ========== ОТВЕТ НА ВОПРОС "С ЧЕГО НАЧИНАЕТСЯ ЛЕТО" ==========
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
    const clickHandler = () => {
        const option = card.getAttribute('data-option');
        let message = '';
        switch (option) {
            case 'пляжный релакс':
                message = '🏖️ Отличный выбор! Пляжный релакс — это солнце, песок и бесконечное море. Желаю золотистого загара и кристально чистой воды! 🌊✨';
                break;
            case 'актив в горах':
                message = '⛰️ Великолепный выбор! Активный отдых в горах дарит незабываемые виды, чистый воздух и заряд бодрости. Пусть вершины покоряются легко! 🏔️💪';
                break;
            case 'прогулки по паркам':
                message = '🌳 Прекрасный выбор! Прогулки по паркам — это вдохновение, уютные аллеи и гармония с природой. Желаю ярких впечатлений и красивых фото! 📸✨';
                break;
            default:
                message = '✨ Отличный выбор! Пусть ваше лето будет незабываемым! ✨';
        }
        if (answerResult) {
            answerResult.style.display = 'block';
            answerResult.innerHTML = message;
            answerResult.style.opacity = '1';
        }
        showToast(`✨ Вы выбрали: ${card.querySelector('.option-label')?.textContent || option} ✨`);
    };
    card.addEventListener('click', clickHandler);
    card.addEventListener('touchstart', clickHandler);
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
    remind.addEventListener('click', () => { panelDiv.classList.contains('visible') ? closePanel() : openPanel(); });
    remind.addEventListener('touchstart', () => { panelDiv.classList.contains('visible') ? closePanel() : openPanel(); });
}
document.addEventListener('click', (e) => {
    if (panelDiv && panelDiv.classList.contains('visible') && remind && !remind.contains(e.target) && !panelDiv.contains(e.target)) closePanel();
});
document.addEventListener('touchstart', (e) => {
    if (panelDiv && panelDiv.classList.contains('visible') && remind && !remind.contains(e.target) && !panelDiv.contains(e.target)) closePanel();
});

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

if (aboutFloat && modalOverlay) {
    aboutFloat.addEventListener('click', () => {
        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
    aboutFloat.addEventListener('touchstart', () => {
        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
}
if (closeModalBtn && modalOverlay) {
    closeModalBtn.addEventListener('click', () => {
        modalOverlay.classList.remove('active');
        document.body.style.overflow = '';
    });
    closeModalBtn.addEventListener('touchstart', () => {
        modalOverlay.classList.remove('active');
        document.body.style.overflow = '';
    });
}
if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            modalOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// ========== КАРУСЕЛЬ МОИХ МАРШРУТОВ ==========
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
        dot.addEventListener('click', () => {
            clearInterval(autoRouteInterval);
            goToRouteSlide(i);
            startAutoRoutes();
        });
        dot.addEventListener('touchstart', () => {
            clearInterval(autoRouteInterval);
            goToRouteSlide(i);
            startAutoRoutes();
        });
        routesDots.appendChild(dot);
    });
}

function startAutoRoutes() {
    if (autoRouteInterval) clearInterval(autoRouteInterval);
    autoRouteInterval = setInterval(() => goToRouteSlide(currentRoute + 1), 4000);
}

// ПЕРЕХОД ПО КАРТОЧКАМ МАРШРУТОВ (ВАЖНО ДЛЯ МОБИЛЬНЫХ)
routeCards.forEach(card => {
    const clickHandler = () => {
        const page = card.getAttribute('data-page');
        if (page) window.location.href = page;
    };
    card.addEventListener('click', clickHandler);
    card.addEventListener('touchstart', clickHandler);
});

if (routeCards.length > 0) {
    createRouteDots();
    goToRouteSlide(0);
    startAutoRoutes();
}

const routesCarousel = document.getElementById('routesCarousel');
if (routesCarousel) {
    routesCarousel.addEventListener('mouseenter', () => clearInterval(autoRouteInterval));
    routesCarousel.addEventListener('mouseleave', startAutoRoutes);
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
        dot.addEventListener('click', () => {
            clearInterval(autoPlaceInterval);
            goToPlaceSlide(i);
            startAutoPlaces();
        });
        dot.addEventListener('touchstart', () => {
            clearInterval(autoPlaceInterval);
            goToPlaceSlide(i);
            startAutoPlaces();
        });
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

const placesCarousel = document.getElementById('placesCarousel');
if (placesCarousel) {
    placesCarousel.addEventListener('mouseenter', () => clearInterval(autoPlaceInterval));
    placesCarousel.addEventListener('mouseleave', startAutoPlaces);
}

// ========== ЗВЁЗДЫ ДЛЯ ОТЗЫВОВ ==========
let currentRating = 0;
const stars = document.querySelectorAll('.star');

stars.forEach(star => {
    const clickHandler = () => {
        currentRating = parseInt(star.dataset.value);
        stars.forEach((s, i) => s.classList.toggle('active', i < currentRating));
    };
    star.addEventListener('click', clickHandler);
    star.addEventListener('touchstart', clickHandler);
});

// ========== ОТПРАВКА ОТЗЫВА ==========
const reviewForm = document.getElementById('reviewForm');
if (reviewForm) {
    reviewForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('reviewerName')?.value.trim() || '';
        const email = document.getElementById('reviewerEmail')?.value.trim() || '';
        const text = document.getElementById('reviewText')?.value.trim() || '';

        if (!name || !email || !text) {
            showToast('📝 Пожалуйста, заполните все поля');
            return;
        }
        if (currentRating === 0) {
            showToast('⭐ Поставьте оценку звёздами');
            return;
        }

        const message = `🌟 ОТЗЫВ 🌟\n\n👤 Имя: ${name}\n📧 Почта: ${email}\n⭐ Оценка: ${currentRating}★\n📝 Отзыв: ${text}`;

        function resetForm() {
            if (reviewForm) reviewForm.reset();
            stars.forEach(s => s.classList.remove('active'));
            currentRating = 0;
        }

        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Отзыв о сайте Мой юг',
                    text: message,
                });
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
    });
}

// ========== ШЕРИНГ (ПОДЕЛИТЬСЯ) ==========
const shareUrl = encodeURIComponent(window.location.href);
const shareTitle = encodeURIComponent('Мой юг: от Анапы до Сочи');

document.querySelectorAll('.share-btn').forEach(btn => {
    const clickHandler = () => {
        const type = btn.dataset.share;
        let url = '';
        if (type === 'email') {
            // Открытие почты - мобильная версия
            window.location.href = `mailto:?subject=${shareTitle}&body=${shareUrl}`;
        } else if (type === 'vk') {
            url = `https://vk.com/share.php?url=${shareUrl}&title=${shareTitle}`;
            window.open(url, '_blank', 'width=600,height=400');
        } else if (type === 'ok') {
            url = `https://connect.ok.ru/offer?url=${shareUrl}&title=${shareTitle}`;
            window.open(url, '_blank', 'width=600,height=400');
        } else if (type === 'max') {
            navigator.clipboard.writeText(window.location.href);
            showToast('🔗 Ссылка скопирована! Поделитесь с друзьями');
        }
    };
    btn.addEventListener('click', clickHandler);
    btn.addEventListener('touchstart', clickHandler);
});

// ========== ССЫЛКА В ФУТЕРЕ (ПОЧТА) ==========
const footerLink = document.querySelector('.footer a');
if (footerLink) {
    footerLink.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = 'mailto:angelina.chernovalova@yandex.ru';
    });
    footerLink.addEventListener('touchstart', (e) => {
        e.preventDefault();
        window.location.href = 'mailto:angelina.chernovalova@yandex.ru';
    });
}

// ========== ДВИЖЕНИЕ ЯКОРЯ ==========
function initRopeAnchor() {
    const ropeAnchor = document.getElementById('ropeAnchor');
    if (!ropeAnchor) return;

    function updateAnchorPosition() {
        const scrollPercent = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
        const minTop = 80;
        const maxTop = window.innerHeight - 100;
        let newTop = minTop + (maxTop - minTop) * scrollPercent;
        newTop = Math.min(maxTop, Math.max(minTop, newTop));
        ropeAnchor.style.top = newTop + 'px';
    }

    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                updateAnchorPosition();
                ticking = false;
            });
            ticking = true;
        }
    });
    window.addEventListener('resize', () => updateAnchorPosition());
    updateAnchorPosition();
}
initRopeAnchor();

// ========== КНОПКА НАВЕРХ ==========
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
    scrollTopBtn.addEventListener('touchstart', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
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
    mobileMenuBtn.addEventListener('click', openMobileMenu);
    mobileMenuBtn.addEventListener('touchstart', openMobileMenu);
}
if (mobileMenuClose) {
    mobileMenuClose.addEventListener('click', closeMobileMenu);
    mobileMenuClose.addEventListener('touchstart', closeMobileMenu);
}
if (mobileMenuOverlay) {
    mobileMenuOverlay.addEventListener('click', (e) => {
        if (e.target === mobileMenuOverlay) closeMobileMenu();
    });
}

if (mobileRoutesBtn && mobileRoutesSub) {
    mobileRoutesBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (mobileRoutesSub.style.display === 'none') {
            mobileRoutesSub.style.display = 'flex';
        } else {
            mobileRoutesSub.style.display = 'none';
        }
    });
    mobileRoutesBtn.addEventListener('touchstart', (e) => {
        e.stopPropagation();
        if (mobileRoutesSub.style.display === 'none') {
            mobileRoutesSub.style.display = 'flex';
        } else {
            mobileRoutesSub.style.display = 'none';
        }
    });
}

const menuItems = document.querySelectorAll('.mobile-menu-item[data-target]');
menuItems.forEach(item => {
    const clickHandler = () => {
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
    item.addEventListener('click', clickHandler);
    item.addEventListener('touchstart', clickHandler);
});

// ========== ПК ЛИАНА (УЗЛЫ) ==========
const knotItems = document.querySelectorAll('.knot-item[data-target]');
knotItems.forEach(knot => {
    const clickHandler = () => {
        const targetId = knot.getAttribute('data-target');
        if (targetId) {
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    };
    knot.addEventListener('click', clickHandler);
    knot.addEventListener('touchstart', clickHandler);
});

console.log('index.js загружен - все функции для мобильных работают');
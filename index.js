(function() {
    "use strict";

    // ========== МУЗЫКА ==========
    const bgMusic = document.getElementById('bgMusic');
    const musicToggle = document.getElementById('musicToggle');
    const musicIcon = document.getElementById('musicIcon');
    let musicPlaying = true;

    function startMusic() {
        if (bgMusic) {
            bgMusic.volume = 0.3;
            bgMusic.play().catch(e => console.log('Автовоспроизведение заблокировано'));
        }
    }

    if (musicToggle) {
        musicToggle.onclick = (e) => {
            e.stopPropagation();
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
    }

    document.body.addEventListener('touchstart', startMusic, { once: true });
    setTimeout(startMusic, 1000);

    // ========== СЧЁТЧИК ==========
    let siteViews = localStorage.getItem('siteTotalViews');
    siteViews = siteViews ? Number(siteViews) + 1 : 1;
    localStorage.setItem('siteTotalViews', siteViews);
    const viewsCounter = document.getElementById('siteViewsCounter');
    if (viewsCounter) viewsCounter.textContent = siteViews;

    // ========== ТЕМА - ИСПРАВЛЕНО ==========
    function applyTheme(t) {
        const themeIcon = document.getElementById('themeIcon');
        const themeText = document.getElementById('themeText');
        if (t === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
            if (themeIcon) themeIcon.textContent = '☀️';
            if (themeText) themeText.textContent = 'День';
        } else {
            document.documentElement.removeAttribute('data-theme');
            if (themeIcon) themeIcon.textContent = '🌙';
            if (themeText) themeText.textContent = 'Ночь';
        }
        localStorage.setItem('siteTheme', t);
    }

    const savedTheme = localStorage.getItem('siteTheme') || 'light';
    applyTheme(savedTheme === 'dark' ? 'dark' : 'light');

    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.onclick = (e) => {
            e.stopPropagation();
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            applyTheme(isDark ? 'light' : 'dark');
        };
    }

    // ========== ВРЕМЯ ==========
    function updateTime() {
        const timeElem = document.getElementById('st-time-txt');
        if (timeElem) {
            timeElem.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }
    }
    updateTime();
    setInterval(updateTime, 60000);

    // ========== ПОГОДА ==========
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

    // ========== TOAST ==========
    function showToast(msg) {
        const toast = document.getElementById('toastMsg');
        if (!toast) return;
        toast.textContent = msg;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 2500);
    }

    // ========== ОПРОС - ИСПРАВЛЕНО ==========
    const answerResult = document.getElementById('answerResult');
    const optionCards = document.querySelectorAll('.option-card');
    
    optionCards.forEach(card => {
        card.onclick = (e) => {
            e.stopPropagation();
            const option = card.getAttribute('data-option');
            let message = '';
            switch (option) {
                case 'пляжный релакс':
                    message = '🏖️ Отличный выбор! Пляжный релакс — это солнце, песок и бесконечное море! 🌊✨';
                    break;
                case 'актив в горах':
                    message = '⛰️ Великолепный выбор! Активный отдых в горах дарит незабываемые виды! 🏔️💪';
                    break;
                case 'прогулки по паркам':
                    message = '🌳 Прекрасный выбор! Прогулки по паркам — это вдохновение и гармония! 📸✨';
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
    });

    // ========== КАРУСЕЛЬ МАРШРУТОВ ==========
    const routesTrack = document.getElementById('routesTrack');
    const routeCards = document.querySelectorAll('.route-card');
    const routesDots = document.getElementById('routesDots');
    let currentRoute = 0, autoRouteInterval;

    function updateRouteDots() {
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
            dot.onclick = () => { clearInterval(autoRouteInterval); goToRouteSlide(i); startAutoRoutes(); };
            routesDots.appendChild(dot);
        });
    }

    function startAutoRoutes() {
        if (autoRouteInterval) clearInterval(autoRouteInterval);
        autoRouteInterval = setInterval(() => goToRouteSlide(currentRoute + 1), 4000);
    }

    routeCards.forEach(card => {
        card.onclick = () => {
            const page = card.getAttribute('data-page');
            if (page) window.location.href = page;
        };
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
            dot.onclick = () => { clearInterval(autoPlaceInterval); goToPlaceSlide(i); startAutoPlaces(); };
            placesDots.appendChild(dot);
        });
    }

    function startAutoPlaces() {
        if (autoPlaceInterval) clearInterval(autoPlaceInterval);
        autoPlaceInterval = setInterval(() => goToPlaceSlide(currentPlace + 1), 4000);
    }

    // КЛИКАБЕЛЬНЫЕ КАРТОЧКИ "ПЛАНИРУЮ ПОСЕТИТЬ"
    placeCards.forEach(card => {
        card.onclick = (e) => {
            e.stopPropagation();
            const title = card.querySelector('.place-title-overlay')?.textContent || 'это место';
            showToast(`📍 ${title} - скоро здесь появится подробный маршрут!`);
            card.style.transform = 'scale(0.98)';
            setTimeout(() => { card.style.transform = ''; }, 200);
        };
    });

    if (placeCards.length > 0) {
        createPlaceDots();
        goToPlaceSlide(0);
        startAutoPlaces();
    }

    // ========== ЗВЁЗДЫ ==========
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
        star.onclick = (e) => {
            e.stopPropagation();
            currentRating = parseInt(star.getAttribute('data-value'));
            updateStars(currentRating);
            showToast(`⭐ Оценка: ${currentRating} звезды`);
        };
    });

    // ========== ОТПРАВКА ОТЗЫВА ==========
    const reviewForm = document.getElementById('reviewForm');
    const reviewerName = document.getElementById('reviewerName');
    const reviewerEmail = document.getElementById('reviewerEmail');
    const reviewText = document.getElementById('reviewText');

    if (reviewForm) {
        reviewForm.onsubmit = (e) => {
            e.preventDefault();
            
            const name = reviewerName?.value.trim() || '';
            const email = reviewerEmail?.value.trim() || '';
            const text = reviewText?.value.trim() || '';
            
            if (!name || !email || !text) {
                showToast('📝 Пожалуйста, заполните все поля');
                return;
            }
            if (currentRating === 0) {
                showToast('⭐ Поставьте оценку звёздами!');
                return;
            }
            
            const subject = encodeURIComponent(`Отзыв от ${name} - Мой юг`);
            const body = encodeURIComponent(`Имя: ${name}\nПочта: ${email}\nОценка: ${currentRating}★\n\nОтзыв:\n${text}`);
            
            window.location.href = `mailto:angelina.chernovalova@yandex.ru?subject=${subject}&body=${body}`;
            showToast('📧 Открывается почта! Отправьте письмо');
            
            reviewForm.reset();
            currentRating = 0;
            updateStars(0);
        };
    }

    // ========== КНОПКИ ШЕРИНГА ==========
    const shareUrl = encodeURIComponent(window.location.href);
    const shareTitle = encodeURIComponent('Мой юг: от Анапы до Сочи');

    const vkBtn = document.getElementById('vkShareBtn');
    if (vkBtn) {
        vkBtn.onclick = () => window.open(`https://vk.com/share.php?url=${shareUrl}&title=${shareTitle}`, '_blank');
    }

    const okBtn = document.getElementById('okShareBtn');
    if (okBtn) {
        okBtn.onclick = () => window.open(`https://connect.ok.ru/offer?url=${shareUrl}&title=${shareTitle}`, '_blank');
    }

    const maxBtn = document.getElementById('maxShareBtn');
    if (maxBtn) {
        maxBtn.onclick = () => {
            navigator.clipboard.writeText(window.location.href);
            showToast('🔗 Ссылка скопирована!');
        };
    }

    // ========== ССЫЛКА "СВЯЗАТЬСЯ СО МНОЙ" ==========
    const footerMailLink = document.getElementById('footerMailLink');
    if (footerMailLink) {
        footerMailLink.onclick = (e) => {
            e.preventDefault();
            window.location.href = 'mailto:angelina.chernovalova@yandex.ru';
        };
    }

    // ========== КНОПКА НАВЕРХ ==========
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    if (scrollTopBtn) {
        window.onscroll = () => {
            if (window.scrollY > 300) scrollTopBtn.classList.add('show');
            else scrollTopBtn.classList.remove('show');
        };
        scrollTopBtn.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });
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

    if (mobileMenuBtn) mobileMenuBtn.onclick = openMobileMenu;
    if (mobileMenuClose) mobileMenuClose.onclick = closeMobileMenu;
    if (mobileMenuOverlay) mobileMenuOverlay.onclick = (e) => { if (e.target === mobileMenuOverlay) closeMobileMenu(); };

    if (mobileRoutesBtn && mobileRoutesSub) {
        mobileRoutesBtn.onclick = (e) => {
            e.stopPropagation();
            mobileRoutesSub.style.display = mobileRoutesSub.style.display === 'flex' ? 'none' : 'flex';
        };
    }

    document.querySelectorAll('.mobile-menu-item[data-target]').forEach(item => {
        item.onclick = () => {
            const target = item.getAttribute('data-target');
            if (target === 'section-main') window.scrollTo({ top: 0, behavior: 'smooth' });
            else if (target === 'section-places') document.getElementById('section-places')?.scrollIntoView({ behavior: 'smooth' });
            else if (target === 'section-review') document.getElementById('section-review')?.scrollIntoView({ behavior: 'smooth' });
            closeMobileMenu();
        };
    });

    // ========== ПК ЛИАНА ==========
    document.querySelectorAll('.knot-item[data-target]').forEach(knot => {
        knot.onclick = () => {
            const targetId = knot.getAttribute('data-target');
            if (targetId) document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        };
    });

    // ========== АВАТАР И МОДАЛКА ==========
    const aboutPhoto = document.getElementById('about-photo');
    const modalUserPhoto = document.getElementById('modalUserPhoto');
    if (aboutPhoto) {
        aboutPhoto.onclick = () => {
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
        };
    }

    const modalOverlay = document.getElementById('introModal');
    const aboutFloat = document.getElementById('about-float');
    const closeModalBtn = document.getElementById('closeModalBtn');

    function openModal() {
        if (modalOverlay) modalOverlay.classList.add('active');
    }
    function closeModal() {
        if (modalOverlay) modalOverlay.classList.remove('active');
    }

    if (aboutFloat) aboutFloat.onclick = openModal;
    if (closeModalBtn) closeModalBtn.onclick = closeModal;
    if (modalOverlay) modalOverlay.onclick = (e) => { if (e.target === modalOverlay) closeModal(); };

    // ========== ЧЕК-ЛИСТ ==========
    const checklistItems = ['Паспорт 📄', 'Деньги и карты 💰', 'Купальник 🩱', 'Солнцезащитный крем 🧴', 'Головной убор 👒'];
    function loadChecklist() { try { return JSON.parse(localStorage.getItem('checklist_popup') || '[]'); } catch { return []; } }
    function saveChecklist(arr) { localStorage.setItem('checklist_popup', JSON.stringify(arr)); }
    function renderChecklist() {
        const saved = loadChecklist();
        const container = document.getElementById('checklist');
        if (!container) return;
        container.innerHTML = checklistItems.map(text => `<label class="checkrow"><input type="checkbox" ${saved.includes(text) ? 'checked' : ''}> ${text}</label>`).join('');
        document.querySelectorAll('#checklist input').forEach(cb => {
            cb.onchange = () => {
                let cur = loadChecklist();
                const text = cb.parentElement.textContent.trim();
                if (cb.checked) { if (!cur.includes(text)) cur.push(text); }
                else { const idx = cur.indexOf(text); if (idx !== -1) cur.splice(idx, 1); }
                saveChecklist(cur);
            };
        });
    }
    renderChecklist();

    // ========== СМЕНА ФОТО ==========
    const changeSeaBtn = document.getElementById('changeSeaBtn');
    if (changeSeaBtn) {
        changeSeaBtn.onclick = () => {
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
        };
    }

    console.log('✅ Все кнопки работают');
})();
// ========== menu.js ==========
// Универсальное меню для главной страницы и всех городов (Анапа, Геленджик, Сочи, Сириус, Роза)

(function() {
    "use strict";

    // ========== ОПРЕДЕЛЯЕМ ГЛУБИНУ ВЛОЖЕННОСТИ ==========
    // Узнаём, на какой странице мы находимся
    const path = window.location.pathname;
    // Если в пути есть папка (например, /Anapa/ или /Sochi/), то поднимаемся на уровень выше
    const isInCityFolder = path.includes('/') && 
                           !path.endsWith('index.html') && 
                           path !== '/' &&
                           !path.endsWith('/');
    
    // Базовый путь к главной странице:
    // - Если мы в папке города (например, /Anapa/Anapa.html) → возвращаемся в корень через ../index.html
    // - Если мы уже в корне → просто index.html
    const basePath = isInCityFolder ? '../' : '';
    // Абсолютный путь от корня сайта (самый надёжный вариант)
    const rootPath = '/';

    // ========== МОБИЛЬНОЕ МЕНЮ ==========
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
    const mobileMenuClose = document.getElementById('mobileMenuClose');
    const mobileRoutesBtn = document.getElementById('mobileRoutesBtn');
    const mobileRoutesSub = document.getElementById('mobileRoutesSub');
    let mobileRoutesOpen = false;

    function openMobileMenu() {
        if (mobileMenuOverlay) {
            mobileMenuOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    function closeMobileMenu() {
        if (mobileMenuOverlay) {
            mobileMenuOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
        if (mobileRoutesOpen && mobileRoutesSub) {
            mobileRoutesSub.style.display = 'none';
            mobileRoutesOpen = false;
        }
    }

    if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', openMobileMenu);
    if (mobileMenuClose) mobileMenuClose.addEventListener('click', closeMobileMenu);

    if (mobileMenuOverlay) {
        mobileMenuOverlay.addEventListener('click', (e) => {
            if (e.target === mobileMenuOverlay) closeMobileMenu();
        });
    }

    if (mobileRoutesBtn && mobileRoutesSub) {
        mobileRoutesBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (mobileRoutesOpen) {
                mobileRoutesSub.style.display = 'none';
                mobileRoutesOpen = false;
            } else {
                mobileRoutesSub.style.display = 'flex';
                mobileRoutesOpen = true;
            }
        });
    }

    // ========== ПЕРЕХОДЫ ПО ПУНКТАМ МОБИЛЬНОГО МЕНЮ ==========
    document.querySelectorAll('.mobile-menu-item[data-target]').forEach(item => {
        item.addEventListener('click', () => {
            const targetId = item.dataset.target;
            
            if (targetId === 'index') {
                window.location.href = rootPath + 'index.html';
                return;
            }
            if (targetId === 'places') {
                window.location.href = rootPath + 'index.html#section-places';
                return;
            }
            if (targetId === 'review') {
                window.location.href = rootPath + 'index.html#section-review';
                return;
            }
            
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                closeMobileMenu();
                setTimeout(() => {
                    targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 300);
            }
        });
    });

    // ========== ПК ЛИАНА (боковое меню) ==========
    const knotHome = document.getElementById('knotHome');
    const knotPlaces = document.getElementById('knotPlaces');
    const knotReview = document.getElementById('knotReview');

    function navigateToHome() {
        window.location.href = rootPath + 'index.html';
    }
    function navigateToPlaces() {
        window.location.href = rootPath + 'index.html#section-places';
    }
    function navigateToReview() {
        window.location.href = rootPath + 'index.html#section-review';
    }

    if (knotHome) {
        knotHome.addEventListener('click', navigateToHome);
        knotHome.addEventListener('touchstart', navigateToHome);
    }
    if (knotPlaces) {
        knotPlaces.addEventListener('click', navigateToPlaces);
        knotPlaces.addEventListener('touchstart', navigateToPlaces);
    }
    if (knotReview) {
        knotReview.addEventListener('click', navigateToReview);
        knotReview.addEventListener('touchstart', navigateToReview);
    }

    // Обработка всех узлов лианы (на случай, если они есть)
    document.querySelectorAll('.knot-item').forEach(knot => {
        knot.addEventListener('click', (e) => {
            e.stopPropagation();
            const targetId = knot.getAttribute('id');
            if (targetId === 'knotHome') navigateToHome();
            else if (targetId === 'knotPlaces') navigateToPlaces();
            else if (targetId === 'knotReview') navigateToReview();
        });
        knot.addEventListener('touchstart', (e) => {
            e.stopPropagation();
            const targetId = knot.getAttribute('id');
            if (targetId === 'knotHome') navigateToHome();
            else if (targetId === 'knotPlaces') navigateToPlaces();
            else if (targetId === 'knotReview') navigateToReview();
        });
    });

    // ========== АВТОМАТИЧЕСКОЕ ОБНОВЛЕНИЕ ССЫЛОК В ВЫПАДАЮЩИХ СПИСКАХ ==========
    // Исправляем ссылки на города, чтобы они вели в правильные папки
    document.querySelectorAll('.subknot-link, .mobile-sub-link').forEach(link => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('../')) {
            // Если ссылка уже с ../ — оставляем как есть (работает из папок)
            return;
        }
        if (href && href.endsWith('.html') && !href.startsWith('/') && !href.startsWith('../')) {
            // Если ссылка просто "Anapa.html" — исправляем на "../Anapa/Anapa.html" для страниц в папках
            if (isInCityFolder) {
                const cityName = href.replace('.html', '');
                link.setAttribute('href', '../' + cityName + '/' + cityName + '.html');
            }
        }
    });

})();
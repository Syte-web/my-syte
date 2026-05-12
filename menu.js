/**
 * menu.js — универсальное меню для всех страниц
 */

(function() {
    "use strict";

    const path = window.location.pathname;
    const isInCityFolder = path.includes('/') && 
                           !path.endsWith('index.html') && 
                           path !== '/' &&
                           !path.endsWith('/');
    
    const basePath = isInCityFolder ? '../' : '';

    // ========== МОБИЛЬНОЕ МЕНЮ ==========
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
    const mobileMenuClose = document.getElementById('mobileMenuClose');
    const mobileRoutesBtn = document.getElementById('mobileRoutesBtn');
    const mobileRoutesSub = document.getElementById('mobileRoutesSub');
    let mobileRoutesOpen = false;
    let isAnimating = false;

    function openMobileMenu() {
        if (mobileMenuOverlay && !isAnimating) {
            isAnimating = true;
            mobileMenuOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
            setTimeout(() => { isAnimating = false; }, 250);
        }
    }

    function closeMobileMenu() {
        if (mobileMenuOverlay && !isAnimating) {
            isAnimating = true;
            mobileMenuOverlay.classList.remove('active');
            document.body.style.overflow = '';
            if (mobileRoutesOpen && mobileRoutesSub) {
                mobileRoutesSub.style.display = 'none';
                mobileRoutesOpen = false;
            }
            setTimeout(() => { isAnimating = false; }, 250);
        }
    }

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            openMobileMenu();
        });
        mobileMenuBtn.addEventListener('touchstart', (e) => {
            e.stopPropagation();
            openMobileMenu();
        });
    }
    
    if (mobileMenuClose) {
        mobileMenuClose.addEventListener('click', (e) => {
            e.stopPropagation();
            closeMobileMenu();
        });
        mobileMenuClose.addEventListener('touchstart', (e) => {
            e.stopPropagation();
            closeMobileMenu();
        });
    }

    if (mobileMenuOverlay) {
        mobileMenuOverlay.addEventListener('click', (e) => {
            if (e.target === mobileMenuOverlay) closeMobileMenu();
        });
    }

    if (mobileRoutesBtn && mobileRoutesSub) {
        const toggleSubmenu = (e) => {
            e.stopPropagation();
            if (mobileRoutesOpen) {
                mobileRoutesSub.style.display = 'none';
                mobileRoutesOpen = false;
            } else {
                mobileRoutesSub.style.display = 'flex';
                mobileRoutesOpen = true;
            }
        };
        mobileRoutesBtn.addEventListener('click', toggleSubmenu);
        mobileRoutesBtn.addEventListener('touchstart', toggleSubmenu);
    }

    // ========== ПЕРЕХОДЫ ==========
    document.querySelectorAll('.mobile-menu-item[data-target]').forEach(item => {
        const clickHandler = (e) => {
            e.stopPropagation();
            const targetId = item.dataset.target;
            
            if (targetId === 'index') {
                window.location.href = basePath + 'index.html';
                return;
            }
            if (targetId === 'places') {
                window.location.href = basePath + 'index.html#section-places';
                return;
            }
            if (targetId === 'review') {
                window.location.href = basePath + 'index.html#section-review';
                return;
            }
            
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                closeMobileMenu();
                setTimeout(() => {
                    targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 300);
            }
        };
        item.addEventListener('click', clickHandler);
        item.addEventListener('touchstart', clickHandler);
    });

    // ========== ПК ЛИАНА ==========
    const knotHome = document.getElementById('knotHome');
    const knotPlaces = document.getElementById('knotPlaces');
    const knotReview = document.getElementById('knotReview');

    function navigateToHome() { window.location.href = basePath + 'index.html'; }
    function navigateToPlaces() { window.location.href = basePath + 'index.html#section-places'; }
    function navigateToReview() { window.location.href = basePath + 'index.html#section-review'; }

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

    // ========== ЯКОРЬ ==========
    const ropeAnchor = document.getElementById('ropeAnchor');
    if (ropeAnchor && !isInCityFolder) {
        let ticking = false;
        function updateAnchor() {
            const scrollPercent = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
            const minTop = 80;
            const maxTop = window.innerHeight - 100;
            let newTop = minTop + (maxTop - minTop) * scrollPercent;
            newTop = Math.min(maxTop, Math.max(minTop, newTop));
            ropeAnchor.style.top = newTop + 'px';
        }
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    updateAnchor();
                    ticking = false;
                });
                ticking = true;
            }
        });
        updateAnchor();
    }

})();
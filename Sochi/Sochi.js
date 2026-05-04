(function() {
    "use strict";

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

    // ========== ПК ЛИАНА ==========
    const knotHome = document.getElementById('knotHome');
    const knotPlaces = document.getElementById('knotPlaces');
    const knotReview = document.getElementById('knotReview');

    function navigateToHome() { window.location.href = rootPath + 'index.html'; }
    function navigateToPlaces() { window.location.href = rootPath + 'index.html#section-places'; }
    function navigateToReview() { window.location.href = rootPath + 'index.html#section-review'; }

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
})();
// ========== menu.js ==========
// Этот файл общий для всех городов

// ========== МОБИЛЬНОЕ МЕНЮ ==========
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
const mobileMenuClose = document.getElementById('mobileMenuClose');
const mobileRoutesBtn = document.getElementById('mobileRoutesBtn');
const mobileRoutesSub = document.getElementById('mobileRoutesSub');
let mobileRoutesOpen = false;

function openMobileMenu() {
  if(mobileMenuOverlay) {
    mobileMenuOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeMobileMenu() {
  if(mobileMenuOverlay) {
    mobileMenuOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }
  if (mobileRoutesOpen && mobileRoutesSub) {
    mobileRoutesSub.style.display = 'none';
    mobileRoutesOpen = false;
  }
}

if(mobileMenuBtn) mobileMenuBtn.addEventListener('click', openMobileMenu);
if(mobileMenuClose) mobileMenuClose.addEventListener('click', closeMobileMenu);

if(mobileMenuOverlay) {
  mobileMenuOverlay.addEventListener('click', (e) => {
    if (e.target === mobileMenuOverlay) closeMobileMenu();
  });
}

if(mobileRoutesBtn) {
  mobileRoutesBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (mobileRoutesOpen) {
      if(mobileRoutesSub) mobileRoutesSub.style.display = 'none';
      mobileRoutesOpen = false;
    } else {
      if(mobileRoutesSub) mobileRoutesSub.style.display = 'flex';
      mobileRoutesOpen = true;
    }
  });
}

// Обработчики пунктов мобильного меню — переходы на главную
document.querySelectorAll('.mobile-menu-item[data-target]').forEach(item => {
  item.addEventListener('click', () => {
    const targetId = item.dataset.target;
    if (targetId === 'index') {
      window.location.href = '../index.html';
      return;
    }
    if (targetId === 'places') {
      window.location.href = '../index.html#section-places';
      return;
    }
    if (targetId === 'review') {
      window.location.href = '../index.html#section-review';
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
document.querySelectorAll('.knot-item').forEach(knot => {
  knot.addEventListener('click', (e) => {
    e.stopPropagation();
    const targetId = knot.getAttribute('id');
    if(targetId === 'knotHome') window.location.href = '../index.html';
    else if(targetId === 'knotPlaces') window.location.href = '../index.html#section-places';
    else if(targetId === 'knotReview') window.location.href = '../index.html#section-review';
  });
  knot.addEventListener('touchstart', (e) => {
    e.stopPropagation();
    const targetId = knot.getAttribute('id');
    if(targetId === 'knotHome') window.location.href = '../index.html';
    else if(targetId === 'knotPlaces') window.location.href = '../index.html#section-places';
    else if(targetId === 'knotReview') window.location.href = '../index.html#section-review';
  });
});
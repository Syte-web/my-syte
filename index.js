// МУЗЫКА
const musicToggle = document.getElementById('musicToggle');
const musicIcon = document.getElementById('musicIcon');
let musicPlaying = true;
let bgMusicObj = null;

function createAudio() {
  const audio = new Audio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3');
  audio.loop = true;
  audio.volume = 0.3;
  return audio;
}

if (musicToggle) {
  musicToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    if (!bgMusicObj) {
      bgMusicObj = createAudio();
    }
    if (musicPlaying) {
      bgMusicObj.pause();
      musicIcon.textContent = '🔇';
    } else {
      bgMusicObj.play().catch(e => console.log('play error'));
      musicIcon.textContent = '🎵';
    }
    musicPlaying = !musicPlaying;
  });
}

// СЧЁТЧИК ПРОСМОТРОВ
let views = localStorage.getItem('siteViews') || 0;
views = Number(views) + 1;
localStorage.setItem('siteViews', views);
const viewsCounter = document.getElementById('siteViewsCounter');
if (viewsCounter) viewsCounter.textContent = views;

// ТЕМА ДЕНЬ/НОЧЬ
function applyTheme(theme) {
  if (theme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    const themeIcon = document.getElementById('themeIcon');
    if (themeIcon) themeIcon.textContent = '🌙';
  } else {
    document.documentElement.removeAttribute('data-theme');
    const themeIcon = document.getElementById('themeIcon');
    if (themeIcon) themeIcon.textContent = '☀️';
  }
  localStorage.setItem('theme', theme);
}

const savedTheme = localStorage.getItem('theme') || 'light';
applyTheme(savedTheme);

const themeToggleBtn = document.getElementById('theme-toggle');
if (themeToggleBtn) {
  themeToggleBtn.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    applyTheme(current === 'dark' ? 'light' : 'dark');
  });
}

// ВРЕМЯ
function updateTime() {
  const timeEl = document.getElementById('st-time-txt');
  if (timeEl) {
    timeEl.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
}
updateTime();
setInterval(updateTime, 60000);

// ПОГОДА
fetch('https://api.open-meteo.com/v1/forecast?latitude=44.8953&longitude=37.3167&current_weather=true')
  .then(res => res.json())
  .then(data => {
    const temp = Math.round(data.current_weather.temperature);
    const weatherEl = document.getElementById('st-weather-txt');
    if (weatherEl) weatherEl.textContent = temp + '°C';
  })
  .catch(() => {
    const weatherEl = document.getElementById('st-weather-txt');
    if (weatherEl) weatherEl.textContent = '24°C';
  });

// ТОСТ
function showToast(msg) {
  const toast = document.getElementById('toastMsg');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}

// ОПРОС
const answerResult = document.getElementById('answerResult');
const optionCards = document.querySelectorAll('.option-card');

optionCards.forEach(card => {
  card.addEventListener('click', () => {
    const option = card.getAttribute('data-option');
    let message = '';
    if (option === 'пляжный релакс') {
      message = '🏖️ Отличный выбор! Пляжный релакс — это солнце, песок и море. Желаю классного отдыха! 🌊✨';
    } else if (option === 'актив в горах') {
      message = '⛰️ Великолепный выбор! Активный отдых в горах дарит незабываемые виды и заряд бодрости! 🏔️💪';
    } else if (option === 'прогулки по паркам') {
      message = '🌳 Прекрасный выбор! Прогулки по паркам — это уют и гармония с природой! 📸✨';
    } else {
      message = '✨ Отличный выбор! Пусть лето будет незабываемым! ✨';
    }
    answerResult.style.display = 'block';
    answerResult.innerHTML = message;
    answerResult.style.opacity = '0';
    setTimeout(() => { answerResult.style.opacity = '1'; }, 10);
  });
});

// КАРУСЕЛЬ МАРШРУТОВ
const routesTrack = document.getElementById('routesTrack');
const routeCards = document.querySelectorAll('.route-card');
const routesDots = document.getElementById('routesDots');
let currentRoute = 0;
let routeInterval;

function updateRouteDots() {
  const dots = document.querySelectorAll('#routesDots .dot');
  dots.forEach((d, i) => {
    d.classList.toggle('active', i === currentRoute);
  });
}

function goToRoute(i) {
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
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => {
      clearInterval(routeInterval);
      goToRoute(i);
      startRouteAuto();
    });
    routesDots.appendChild(dot);
  });
}

function startRouteAuto() {
  if (routeInterval) clearInterval(routeInterval);
  routeInterval = setInterval(() => goToRoute(currentRoute + 1), 4000);
}

if (routeCards.length > 0) {
  createRouteDots();
  goToRoute(0);
  startRouteAuto();
}

routeCards.forEach(card => {
  card.addEventListener('click', () => {
    showToast('🚗 Переход на страницу маршрута');
  });
});

// КАРУСЕЛЬ "ПЛАНИРУЮ ПОСЕТИТЬ"
const placesTrack = document.getElementById('placesTrack');
const placeCards = document.querySelectorAll('.place-card');
const placesDots = document.getElementById('placesDots');
let currentPlace = 0;
let placeInterval;

function updatePlaceDots() {
  const dots = document.querySelectorAll('#placesDots .dot');
  dots.forEach((d, i) => {
    d.classList.toggle('active', i === currentPlace);
  });
}

function goToPlace(i) {
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
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => {
      clearInterval(placeInterval);
      goToPlace(i);
      startPlaceAuto();
    });
    placesDots.appendChild(dot);
  });
}

function startPlaceAuto() {
  if (placeInterval) clearInterval(placeInterval);
  placeInterval = setInterval(() => goToPlace(currentPlace + 1), 4000);
}

if (placeCards.length > 0) {
  createPlaceDots();
  goToPlace(0);
  startPlaceAuto();
}

// Затемненные карточки с сообщением
placeCards.forEach(card => {
  card.addEventListener('click', () => {
    const placeName = card.getAttribute('data-place') || 'это место';
    showToast(`⭐ ${placeName} — скоро появится на сайте! Следите за обновлениями ⭐`);
  });
});

// ЗВЁЗДЫ
let currentRating = 0;
const stars = document.querySelectorAll('.star');

function updateStars(rating) {
  stars.forEach((star, index) => {
    if (index < rating) {
      star.classList.add('active');
    } else {
      star.classList.remove('active');
    }
  });
}

stars.forEach(star => {
  star.addEventListener('click', () => {
    const value = parseInt(star.getAttribute('data-value'));
    currentRating = value;
    updateStars(currentRating);
    showToast(`⭐ Оценка: ${currentRating} звезд${currentRating === 1 ? 'а' : ''}`);
  });
});

// ОТПРАВКА ОТЗЫВА
const reviewForm = document.getElementById('reviewForm');
const reviewerName = document.getElementById('reviewerName');
const reviewerEmail = document.getElementById('reviewerEmail');
const reviewText = document.getElementById('reviewText');

function showFieldError(field, message) {
  field.style.border = '2px solid #ff4444';
  field.style.backgroundColor = 'rgba(255,68,68,0.1)';
  setTimeout(() => {
    field.style.border = '2px solid var(--accent)';
    field.style.backgroundColor = '';
  }, 3000);
  showToast(message);
}

if (reviewForm) {
  reviewForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = reviewerName?.value.trim() || '';
    const email = reviewerEmail?.value.trim() || '';
    const text = reviewText?.value.trim() || '';
    
    let hasError = false;
    
    if (!name) {
      showFieldError(reviewerName, '📝 Введите ваше имя');
      hasError = true;
    }
    if (!email) {
      showFieldError(reviewerEmail, '📧 Введите вашу почту');
      hasError = true;
    } else if (!email.includes('@') || !email.includes('.')) {
      showFieldError(reviewerEmail, '📧 Введите корректный email');
      hasError = true;
    }
    if (!text) {
      showFieldError(reviewText, '💬 Напишите ваш отзыв');
      hasError = true;
    }
    
    if (hasError) return;
    
    if (currentRating === 0) {
      showToast('⭐ Поставьте оценку звёздами!');
      return;
    }
    
    const message = `🌟 ОТЗЫВ 🌟\n\n👤 Имя: ${name}\n📧 Почта: ${email}\n⭐ Оценка: ${currentRating}★\n📝 Отзыв: ${text}`;
    
    try {
      await navigator.clipboard.writeText(message + '\n\nОтправьте это сообщение: angelina.chernovalova@yandex.ru');
      showToast('📋 Спасибо! Отзыв скопирован, отправьте мне');
      reviewForm.reset();
      currentRating = 0;
      updateStars(0);
    } catch (err) {
      showToast('⚠️ Спасибо за отзыв!');
      console.log(message);
      reviewForm.reset();
      currentRating = 0;
      updateStars(0);
    }
  });
}

// КНОПКИ ШЕРИНГА
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
});

// МОДАЛЬНОЕ ОКНО
const modalOverlay = document.getElementById('introModal');
const aboutFloat = document.getElementById('about-float');
const closeModalBtn = document.getElementById('closeModalBtn');
let savedScrollY = 0;

function openModal() {
  if (!modalOverlay) return;
  savedScrollY = window.scrollY;
  document.body.style.position = 'fixed';
  document.body.style.top = `-${savedScrollY}px`;
  document.body.style.width = '100%';
  document.body.style.overflow = 'hidden';
  modalOverlay.classList.add('active');
}

function closeModal() {
  if (!modalOverlay) return;
  modalOverlay.classList.remove('active');
  document.body.style.position = '';
  document.body.style.top = '';
  document.body.style.width = '';
  document.body.style.overflow = '';
  window.scrollTo(0, savedScrollY);
}

if (aboutFloat) {
  aboutFloat.addEventListener('click', openModal);
}
if (closeModalBtn) {
  closeModalBtn.addEventListener('click', closeModal);
}
if (modalOverlay) {
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });
}

// СМЕНА ФОТО МОРЯ
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

// АВАТАР
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

// КНОПКА НАВЕРХ
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

// МОБИЛЬНОЕ МЕНЮ
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
}
if (mobileMenuClose) {
  mobileMenuClose.addEventListener('click', closeMobileMenu);
}
if (mobileMenuOverlay) {
  mobileMenuOverlay.addEventListener('click', (e) => {
    if (e.target === mobileMenuOverlay) closeMobileMenu();
  });
}

if (mobileRoutesBtn && mobileRoutesSub) {
  mobileRoutesBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    mobileRoutesSub.style.display = mobileRoutesSub.style.display === 'none' ? 'flex' : 'none';
  });
}

const menuItems = document.querySelectorAll('.mobile-menu-item[data-target]');
menuItems.forEach(item => {
  item.addEventListener('click', () => {
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
  });
});

const mobileSubLinks = document.querySelectorAll('.mobile-sub-link');
mobileSubLinks.forEach(link => {
  link.addEventListener('click', () => {
    const page = link.getAttribute('data-page');
    if (page) showToast('🚗 Переход на страницу маршрута');
    closeMobileMenu();
  });
});

console.log('Сайт загружен!');
// ========== ТЕМА (ДЕНЬ/НОЧЬ) ==========
function applyTheme(t) {
  const hero = document.getElementById('heroImg');
  const themeIcon = document.getElementById('themeIcon');
  const themeText = document.getElementById('themeText');
  
  if(t === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    if(hero) hero.src = 'Img.Roza/roza.jpeg';
    if(themeIcon) themeIcon.textContent = '🌙';
    if(themeText) themeText.textContent = 'Ночь';
  } else {
    document.documentElement.removeAttribute('data-theme');
    if(hero) hero.src = 'Img.Roza/roz.jpg';
    if(themeIcon) themeIcon.textContent = '☀️';
    if(themeText) themeText.textContent = 'День';
  }
  localStorage.setItem('siteTheme', t);
}
applyTheme(localStorage.getItem('siteTheme') || 'light');

const themeToggle = document.getElementById('theme-toggle');
if(themeToggle) {
  themeToggle.addEventListener('click', () => {
    const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(next);
  });
}

// ========== ВРЕМЯ ==========
function updateTime(){ 
  const timeElem = document.getElementById('st-time-txt');
  if(timeElem) timeElem.textContent = new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'}); 
}
updateTime(); 
setInterval(updateTime, 60000);

// ========== ПОГОДА ==========
async function fetchWeather() {
  try {
    const res = await fetch('https://api.open-meteo.com/v1/forecast?latitude=43.6792&longitude=40.2040&current_weather=true&hourly=temperature_2m,wind_speed_10m,precipitation,relativehumidity_2m');
    const data = await res.json();
    if(data.current_weather) {
      const temp = Math.round(data.current_weather.temperature);
      const wind = data.current_weather.windspeed || 5;
      const fog = data.hourly?.relativehumidity_2m?.[0] || 65;
      const precip = data.hourly?.precipitation?.[0] || 0;
      
      const tempElem = document.getElementById('weatherTemp');
      const windElem = document.getElementById('weatherWind');
      const fogElem = document.getElementById('weatherFog');
      
      if(tempElem) tempElem.innerHTML = temp;
      if(windElem) windElem.innerText = wind;
      if(fogElem) fogElem.innerText = fog;
      
      let mainIcon = '☀️';
      if(precip > 1) mainIcon = '🌧️';
      else if(fog > 80) mainIcon = '🌫️';
      else if(temp > 20) mainIcon = '☀️';
      else if(temp > 10 && temp <= 20) mainIcon = '⛅';
      else if(temp <= 10 && temp > 0) mainIcon = '☁️';
      else if(temp <= 0) mainIcon = '❄️';
      
      const mainIconElem = document.getElementById('weatherMainIcon');
      if(mainIconElem) mainIconElem.innerHTML = mainIcon;
      
      const badge = document.getElementById('weatherVerdictBadge');
      if(badge) {
        if(temp < -5 || wind > 15 || precip > 5) {
          badge.innerHTML = 'Подъём: ❌ НЕТ';
          badge.className = 'weather-verdict verdict-bad';
        } else if(temp < 5 || wind > 10 || precip > 2) {
          badge.innerHTML = 'Подъём: ⚠️ ОСТОРОЖНО';
          badge.className = 'weather-verdict verdict-warning';
        } else {
          badge.innerHTML = 'Подъём: ✅ ДА!';
          badge.className = 'weather-verdict verdict-good';
        }
      }
    }
  } catch(e) {
    const tempElem = document.getElementById('weatherTemp');
    const badge = document.getElementById('weatherVerdictBadge');
    if(tempElem) tempElem.innerHTML = '--';
    if(badge) badge.innerHTML = 'Подъём: ⚠️ Ошибка';
  }
}
fetchWeather();

// ========== МОДАЛЬНЫЕ ОКНА ДЛЯ ГОНДОЛ ==========
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if(modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}
function closeModal(modal) {
  if(modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// Открытие по клику на гондолы
document.querySelectorAll('.gondola').forEach(g => {
  g.addEventListener('click', (e) => {
    e.stopPropagation();
    const station = g.dataset.station;
    if(station === '1') openModal('gondolaModal1');
    else if(station === '2') openModal('gondolaModal2');
    else if(station === '3') openModal('gondolaModal3');
  });
});

// Закрытие по кнопке ✕
document.querySelectorAll('.gondola-modal-close').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const modal = btn.closest('.gondola-modal');
    closeModal(modal);
  });
});

// Закрытие по клику на фон
document.querySelectorAll('.gondola-modal').forEach(modal => {
  modal.addEventListener('click', (e) => {
    if(e.target === modal) closeModal(modal);
  });
});

// ========== ОПТИМИЗИРОВАННОЕ ВИДЕО (БИНОКЛЬ) ==========
const videoOverlay = document.getElementById('videoOverlay');
const localVideo = document.getElementById('localVideo');
const openVideoBtn = document.getElementById('openVideoBtn');
const closeVideoBtn = document.getElementById('closeVideoBtn');

// Флаг, открыто ли видео
let isVideoOpen = false;

// Функция закрытия видео (максимально быстрая)
function closeVideoAndGondola() {
  if(!videoOverlay) return;
  
  // Сначала скрываем оверлей (мгновенно)
  videoOverlay.classList.remove('active');
  isVideoOpen = false;
  
  // Затем останавливаем видео
  if(localVideo) {
    localVideo.pause();
    localVideo.currentTime = 0;
  }
  
  // Закрываем все модалки гондол
  document.querySelectorAll('.gondola-modal.active').forEach(modal => {
    modal.classList.remove('active');
  });
  
  document.body.style.overflow = '';
}

// Функция открытия видео
function openVideo() {
  if(!videoOverlay || !localVideo) return;
  
  videoOverlay.classList.add('active');
  isVideoOpen = true;
  
  // Загружаем видео если еще не загружено
  if(localVideo.readyState === 0) {
    localVideo.load();
  }
  
  // Пытаемся воспроизвести
  setTimeout(() => {
    localVideo.play().catch(e => {
      console.log('Автовоспроизведение заблокировано');
      // Показываем кнопку Play
      showPlayButton();
    });
  }, 50);
}

// Кнопка Play если авто запрещено
function showPlayButton() {
  const container = document.querySelector('.video-container-small');
  if(container && !container.querySelector('.manual-play-btn')) {
    const playBtn = document.createElement('button');
    playBtn.className = 'manual-play-btn';
    playBtn.innerHTML = '▶';
    playBtn.style.position = 'absolute';
    playBtn.style.top = '50%';
    playBtn.style.left = '50%';
    playBtn.style.transform = 'translate(-50%, -50%)';
    playBtn.style.width = '70px';
    playBtn.style.height = '70px';
    playBtn.style.borderRadius = '50%';
    playBtn.style.background = 'rgba(0,0,0,0.8)';
    playBtn.style.border = '3px solid white';
    playBtn.style.fontSize = '2rem';
    playBtn.style.color = 'white';
    playBtn.style.cursor = 'pointer';
    playBtn.style.zIndex = '35';
    playBtn.style.display = 'flex';
    playBtn.style.alignItems = 'center';
    playBtn.style.justifyContent = 'center';
    container.style.position = 'relative';
    container.appendChild(playBtn);
    
    playBtn.onclick = () => {
      localVideo.play();
      playBtn.remove();
    };
    
    // Убираем через 3 секунды если не нажали
    setTimeout(() => {
      if(playBtn && playBtn.parentNode) playBtn.remove();
    }, 3000);
  }
}

// Добавляем обработчики с максимальной производительностью
if(openVideoBtn) {
  openVideoBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    e.preventDefault();
    openVideo();
  });
}

// КРЕСТИК - максимально быстрая реакция
if(closeVideoBtn) {
  // Используем touchstart и mousedown для максимальной скорости
  closeVideoBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    e.stopPropagation();
    closeVideoAndGondola();
  });
  
  closeVideoBtn.addEventListener('mousedown', (e) => {
    e.preventDefault();
    e.stopPropagation();
    closeVideoAndGondola();
  });
}

// Закрытие по клику на фон
if(videoOverlay) {
  videoOverlay.addEventListener('click', (e) => {
    if(e.target === videoOverlay) {
      closeVideoAndGondola();
    }
  });
}

// Предзагрузка видео при загрузке страницы
if(localVideo) {
  localVideo.preload = 'metadata';
  localVideo.setAttribute('playsinline', '');
}

// ========== ЛАЙКИ ДЛЯ ВИДЕО ==========
let videoLikes = localStorage.getItem('videoLikesRoza') ? parseInt(localStorage.getItem('videoLikesRoza')) : 100;
let hasLikedVideo = localStorage.getItem('likedVideoRoza') === 'true';

const videoLikesSpan = document.getElementById('videoLikesCount');
const videoHeartBtn = document.getElementById('videoHeartBtn');
const videoHeartIcon = document.getElementById('videoHeartIcon');

if(videoLikesSpan) videoLikesSpan.textContent = videoLikes;
if(videoHeartIcon) {
  videoHeartIcon.textContent = hasLikedVideo ? '❤️' : '🤍';
}

function createFloatingHeartForVideo(x, y) {
  const heartSymbols = ['❤️', '💖', '💕', '💗', '💓', '❣️', '💝', '💘', '💟'];
  const randomHeart = heartSymbols[Math.floor(Math.random() * heartSymbols.length)];
  
  const heart = document.createElement('div');
  heart.className = 'floating-heart-roza';
  heart.textContent = randomHeart;
  
  const colors = ['#ff3333', '#ff5555', '#ff7777', '#ff9999', '#ff69b4', '#ff88cc', '#ff3366'];
  heart.style.color = colors[Math.floor(Math.random() * colors.length)];
  
  const offsetX = (Math.random() - 0.5) * 80;
  const randomSize = Math.floor(Math.random() * 28 + 20);
  
  heart.style.left = (x + offsetX - randomSize/2) + 'px';
  heart.style.top = y + 'px';
  heart.style.fontSize = randomSize + 'px';
  heart.style.position = 'fixed';
  heart.style.pointerEvents = 'none';
  heart.style.zIndex = '100000';
  heart.style.textShadow = '0 0 5px rgba(255,255,255,0.5)';
  
  document.body.appendChild(heart);
  
  let startTime = null;
  const startY = y;
  const startX = parseFloat(heart.style.left);
  const amplitude = Math.random() * 40 + 20;
  
  function animateHeartUp(timestamp) {
    if(!startTime) startTime = timestamp;
    const elapsed = timestamp - startTime;
    const progress = Math.min(elapsed / 1800, 1);
    
    const moveY = startY - (progress * 300);
    const moveX = startX + Math.sin(progress * Math.PI * 2) * amplitude * (1 - progress);
    
    heart.style.transform = `translate(${moveX - startX}px, ${moveY - startY}px) rotate(${progress * 360}deg)`;
    heart.style.opacity = 1 - progress;
    
    if(progress < 1) {
      requestAnimationFrame(animateHeartUp);
    } else {
      heart.remove();
    }
  }
  
  requestAnimationFrame(animateHeartUp);
}

function showVideoLikesBurst(btnElement) {
  const rect = btnElement.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  
  for(let i = 0; i < 25; i++) {
    setTimeout(() => {
      createFloatingHeartForVideo(centerX, centerY);
    }, i * 30);
  }
}

function showVideoToast(message) {
  let toast = document.getElementById('videoToastMsg');
  if(!toast) {
    toast = document.createElement('div');
    toast.id = 'videoToastMsg';
    toast.style.position = 'fixed';
    toast.style.bottom = '30px';
    toast.style.left = '50%';
    toast.style.transform = 'translateX(-50%)';
    toast.style.background = 'rgba(0,0,0,0.85)';
    toast.style.backdropFilter = 'blur(12px)';
    toast.style.color = '#ffefcf';
    toast.style.fontFamily = 'Pacifico, cursive';
    toast.style.padding = '10px 24px';
    toast.style.borderRadius = '60px';
    toast.style.zIndex = '100001';
    toast.style.fontSize = '0.9rem';
    toast.style.whiteSpace = 'nowrap';
    toast.style.opacity = '0';
    toast.style.transition = '0.2s';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.style.opacity = '1';
  setTimeout(() => toast.style.opacity = '0', 2000);
}

if(videoHeartBtn) {
  videoHeartBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    
    if(hasLikedVideo) {
      showVideoToast('❤️ Вы уже поставили лайк этому видео!');
      return;
    }
    
    hasLikedVideo = true;
    videoLikes++;
    
    if(videoLikesSpan) videoLikesSpan.textContent = videoLikes;
    if(videoHeartIcon) videoHeartIcon.textContent = '❤️';
    
    localStorage.setItem('videoLikesRoza', videoLikes);
    localStorage.setItem('likedVideoRoza', 'true');
    
    showVideoLikesBurst(videoHeartBtn);
    
    if(videoHeartIcon) {
      videoHeartIcon.style.transform = 'scale(1.4)';
      setTimeout(() => {
        if(videoHeartIcon) videoHeartIcon.style.transform = 'scale(1)';
      }, 200);
    }
  });
}

// ========== БИЛЕТ (переход на Сириус) ==========
const ticket = document.getElementById('ticketCorner');
function goToSea() {
  if(!ticket) return;
  ticket.classList.add('ticket-spin');
  setTimeout(() => { window.location.href = '../Sirius/Sirius.html'; }, 5000);
}
if(ticket) {
  ticket.addEventListener('click', (e) => { 
    e.stopPropagation(); 
    goToSea(); 
  });
}
const ticketInvite = document.getElementById('ticketInvite');
if(ticketInvite) {
  ticketInvite.addEventListener('click', (e) => { 
    e.stopPropagation(); 
    goToSea(); 
  });
}

// ========== КНОПКА СТРЕЛКА ВВЕРХ ==========
const scrollTopBtn = document.getElementById('scrollTopBtn');
if(scrollTopBtn) {
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

// ========== МОБИЛЬНОЕ МЕНЮ ==========
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
const mobileMenuClose = document.getElementById('mobileMenuClose');
const mobileRoutesBtn = document.getElementById('mobileRoutesBtn');
const mobileRoutesSub = document.getElementById('mobileRoutesSub');

if(mobileMenuBtn && mobileMenuOverlay) {
  mobileMenuBtn.addEventListener('click', () => {
    mobileMenuOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  });
  
  if(mobileMenuClose) {
    mobileMenuClose.addEventListener('click', () => {
      mobileMenuOverlay.classList.remove('active');
      document.body.style.overflow = '';
    });
  }
  
  mobileMenuOverlay.addEventListener('click', (e) => {
    if(e.target === mobileMenuOverlay) {
      mobileMenuOverlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
  
  if(mobileRoutesBtn && mobileRoutesSub) {
    mobileRoutesBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if(mobileRoutesSub.style.display === 'none') {
        mobileRoutesSub.style.display = 'flex';
      } else {
        mobileRoutesSub.style.display = 'none';
      }
    });
  }
  
  const menuItems = document.querySelectorAll('.mobile-menu-item[data-target]');
  menuItems.forEach(item => {
    item.addEventListener('click', () => {
      const target = item.getAttribute('data-target');
      if(target === 'index') {
        window.location.href = '../index.html';
      } else if(target === 'places') {
        const section = document.querySelector('.gondola-section');
        if(section) section.scrollIntoView({ behavior: 'smooth' });
      } else if(target === 'review') {
        alert('Поделитесь впечатлением: angelina.chernovalova@yandex.ru');
      }
      mobileMenuOverlay.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
}

// ========== ПК ЛИАНА (УЗЛЫ) ==========
const knotHome = document.getElementById('knotHome');
const knotPlaces = document.getElementById('knotPlaces');
const knotReview = document.getElementById('knotReview');

if(knotHome) {
  knotHome.addEventListener('click', () => {
    window.location.href = '../index.html';
  });
}

if(knotPlaces) {
  knotPlaces.addEventListener('click', () => {
    const gondolaSection = document.querySelector('.gondola-section');
    if(gondolaSection) gondolaSection.scrollIntoView({ behavior: 'smooth' });
  });
}

if(knotReview) {
  knotReview.addEventListener('click', () => {
    alert('Поделитесь впечатлением: angelina.chernovalova@yandex.ru');
  });
}
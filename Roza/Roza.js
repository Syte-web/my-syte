// ========== ТЕМА ==========
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

// ========== МОДАЛЬНЫЕ ОКНА (ИСПРАВЛЕННЫЕ - НИЧЕГО НЕ ЗАЕЗЖАЕТ) ==========
let savedScrollY = 0;

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if(!modal) return;
  
  savedScrollY = window.scrollY;
  
  document.body.style.position = 'fixed';
  document.body.style.top = `-${savedScrollY}px`;
  document.body.style.width = '100%';
  document.body.style.overflow = 'hidden';
  
  modal.classList.add('active');
}

function closeModal(modal) {
  if(!modal) return;
  
  modal.classList.remove('active');
  
  document.body.style.position = '';
  document.body.style.top = '';
  document.body.style.width = '';
  document.body.style.overflow = '';
  
  window.scrollTo(0, savedScrollY);
}

function closeAllModals() {
  const activeModals = document.querySelectorAll('.gondola-modal.active');
  activeModals.forEach(modal => {
    modal.classList.remove('active');
  });
  document.body.style.position = '';
  document.body.style.top = '';
  document.body.style.width = '';
  document.body.style.overflow = '';
  window.scrollTo(0, savedScrollY);
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
  g.addEventListener('touchstart', (e) => {
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
    e.stopPropagation();
    const modal = btn.closest('.gondola-modal');
    closeModal(modal);
  });
});

// Закрытие по клику на фон
document.querySelectorAll('.gondola-modal').forEach(modal => {
  modal.addEventListener('click', (e) => {
    if(e.target === modal) {
      closeModal(modal);
    }
  });
});

// Закрытие по ESC
document.addEventListener('keydown', (e) => {
  if(e.key === 'Escape') {
    const activeModal = document.querySelector('.gondola-modal.active');
    if(activeModal) closeModal(activeModal);
    if(videoOverlay && videoOverlay.classList.contains('active')) closeVideoAndGondola();
  }
});

// ========== ВИДЕО ==========
const videoOverlay = document.getElementById('videoOverlay');
const localVideo = document.getElementById('localVideo');
const openVideoBtn = document.getElementById('openVideoBtn');
const closeVideoBtn = document.getElementById('closeVideoBtn');

function closeVideoAndGondola() {
  if(!videoOverlay) return;
  
  videoOverlay.classList.remove('active');
  
  if(localVideo) {
    localVideo.pause();
    localVideo.currentTime = 0;
  }
  
  closeAllModals();
}

function openVideo() {
  if(!videoOverlay || !localVideo) return;
  
  videoOverlay.classList.add('active');
  
  if(localVideo.readyState === 0) {
    localVideo.load();
  }
  
  setTimeout(() => {
    localVideo.play().catch(e => console.log('Автовоспроизведение заблокировано'));
  }, 50);
}

if(openVideoBtn) {
  openVideoBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    e.preventDefault();
    openVideo();
  });
}

if(closeVideoBtn) {
  closeVideoBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    closeVideoAndGondola();
  });
}

if(videoOverlay) {
  videoOverlay.addEventListener('click', (e) => {
    if(e.target === videoOverlay) closeVideoAndGondola();
  });
}

if(localVideo) {
  localVideo.preload = 'metadata';
  localVideo.setAttribute('playsinline', '');
}

// ========== ЛАЙКИ ==========
let videoLikes = localStorage.getItem('videoLikesRoza') ? parseInt(localStorage.getItem('videoLikesRoza')) : 100;
let hasLikedVideo = localStorage.getItem('likedVideoRoza') === 'true';

const videoLikesSpan = document.getElementById('videoLikesCount');
const videoHeartBtn = document.getElementById('videoHeartBtn');
const videoHeartIcon = document.getElementById('videoHeartIcon');

if(videoLikesSpan) videoLikesSpan.textContent = videoLikes;
if(videoHeartIcon) videoHeartIcon.textContent = hasLikedVideo ? '❤️' : '🤍';

function createFloatingHeartForVideo(x, y) {
  const heartSymbols = ['❤️', '💖', '💕', '💗', '💓', '❣️', '💝', '💘'];
  const randomHeart = heartSymbols[Math.floor(Math.random() * heartSymbols.length)];
  const heart = document.createElement('div');
  heart.className = 'floating-heart-roza';
  heart.textContent = randomHeart;
  heart.style.color = '#ff3366';
  heart.style.left = (x + (Math.random() - 0.5) * 60) + 'px';
  heart.style.top = y + 'px';
  heart.style.fontSize = (Math.floor(Math.random() * 20 + 20)) + 'px';
  heart.style.position = 'fixed';
  heart.style.pointerEvents = 'none';
  heart.style.zIndex = '100000';
  heart.style.textShadow = '0 0 5px rgba(255,255,255,0.5)';
  document.body.appendChild(heart);
  
  let startTime = null;
  function animate(timestamp) {
    if(!startTime) startTime = timestamp;
    const elapsed = timestamp - startTime;
    const progress = Math.min(elapsed / 1500, 1);
    heart.style.transform = `translateY(-${progress * 250}px) scale(${1 - progress * 0.5})`;
    heart.style.opacity = 1 - progress;
    if(progress < 1) requestAnimationFrame(animate);
    else heart.remove();
  }
  requestAnimationFrame(animate);
}

if(videoHeartBtn) {
  videoHeartBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if(hasLikedVideo) return;
    hasLikedVideo = true;
    videoLikes++;
    if(videoLikesSpan) videoLikesSpan.textContent = videoLikes;
    if(videoHeartIcon) videoHeartIcon.textContent = '❤️';
    localStorage.setItem('videoLikesRoza', videoLikes);
    localStorage.setItem('likedVideoRoza', 'true');
    
    const rect = videoHeartBtn.getBoundingClientRect();
    for(let i = 0; i < 15; i++) {
      setTimeout(() => createFloatingHeartForVideo(rect.left + rect.width/2, rect.top + rect.height/2), i * 40);
    }
  });
}

// ========== БИЛЕТ ==========
const ticket = document.getElementById('ticketCorner');
function goToSea() {
  if(!ticket) return;
  ticket.classList.add('ticket-spin');
  setTimeout(() => { window.location.href = '../Sirius/Sirius.html'; }, 5000);
}
if(ticket) {
  ticket.addEventListener('click', (e) => { e.stopPropagation(); goToSea(); });
  ticket.addEventListener('touchstart', (e) => { e.stopPropagation(); goToSea(); });
}

// ========== КНОПКА НАВЕРХ ==========
const scrollTopBtn = document.getElementById('scrollTopBtn');
if(scrollTopBtn) {
  window.addEventListener('scroll', () => {
    if(window.scrollY > 300) scrollTopBtn.classList.add('show');
    else scrollTopBtn.classList.remove('show');
  });
  scrollTopBtn.addEventListener('click', () => { window.scrollTo({ top: 0, behavior: 'smooth' }); });
}

console.log('Roza.js загружен - модальные окна исправлены');
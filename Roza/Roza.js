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
document.getElementById('theme-toggle').addEventListener('click', () => {
  const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  applyTheme(next);
});

// ========== ВРЕМЯ ==========
function updateTime(){ document.getElementById('st-time-txt').textContent = new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'}); }
updateTime(); setInterval(updateTime, 60000);

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
      
      document.getElementById('weatherTemp').innerHTML = temp;
      document.getElementById('weatherWind').innerText = wind;
      document.getElementById('weatherFog').innerText = fog;
      
      let mainIcon = '☀️';
      if(precip > 1) mainIcon = '🌧️';
      else if(fog > 80) mainIcon = '🌫️';
      else if(temp > 20) mainIcon = '☀️';
      else if(temp > 10 && temp <= 20) mainIcon = '⛅';
      else if(temp <= 10 && temp > 0) mainIcon = '☁️';
      else if(temp <= 0) mainIcon = '❄️';
      document.getElementById('weatherMainIcon').innerHTML = mainIcon;
      
      const badge = document.getElementById('weatherVerdictBadge');
      
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
  } catch(e) {
    document.getElementById('weatherTemp').innerHTML = '--';
    document.getElementById('weatherVerdictBadge').innerHTML = 'Подъём: ⚠️ Ошибка';
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

// ========== ВИДЕО (БИНОКЛЬ) С КРЕСТИКОМ ==========
const videoOverlay = document.getElementById('videoOverlay');
const localVideo = document.getElementById('localVideo');
const openVideoBtn = document.getElementById('openVideoBtn');
const closeVideoBtn = document.getElementById('closeVideoBtn');

if(openVideoBtn) {
  openVideoBtn.addEventListener('click', () => {
    videoOverlay.classList.add('active');
    localVideo.load();
    setTimeout(() => {
      localVideo.play().catch(e => console.log('Автовоспроизведение заблокировано'));
    }, 100);
  });
}

// Закрытие видео + закрытие модалки гондолы
function closeVideoAndGondola() {
  videoOverlay.classList.remove('active');
  localVideo.pause();
  localVideo.currentTime = 0;
  
  document.querySelectorAll('.gondola-modal.active').forEach(modal => {
    modal.classList.remove('active');
  });
  document.body.style.overflow = '';
  // window.scrollTo({ top: 0, behavior: 'smooth' });
}

if(closeVideoBtn) {
  closeVideoBtn.addEventListener('click', closeVideoAndGondola);
}
if(videoOverlay) {
  videoOverlay.addEventListener('click', (e) => {
    if(e.target === videoOverlay) closeVideoAndGondola();
  });
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
document.getElementById('ticketInvite')?.addEventListener('click', (e) => { 
  e.stopPropagation(); 
  goToSea(); 
});

// ========== КНОПКА СТРЕЛКА ВВЕРХ ==========
const scrollTopBtn = document.getElementById('scrollTopBtn');
window.addEventListener('scroll', () => {
  if (window.scrollY > 300) {
    scrollTopBtn.classList.add('show');
  } else {
    scrollTopBtn.classList.remove('show');
  }
});
scrollTopBtn?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
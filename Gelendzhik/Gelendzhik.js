// ========== ТЕМА (ДЕНЬ/НОЧЬ) И ОБНОВЛЕНИЕ ФОТО ==========
function applyTheme(t) {
  const themeIcon = document.getElementById('themeIcon');
  const themeText = document.getElementById('themeText');
  if(t === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    if(themeIcon) themeIcon.textContent = '🌙';
    if(themeText) themeText.textContent = 'Ночь';
  } else {
    document.documentElement.removeAttribute('data-theme');
    if(themeIcon) themeIcon.textContent = '☀️';
    if(themeText) themeText.textContent = 'День';
  }
  localStorage.setItem('siteTheme', t);
  updateImages();
}
function updateImages() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const bayImg = document.getElementById('bayImage');
  if(bayImg) bayImg.src = isDark ? 'Img.Gelendzhik/gelendjik.jpg' : 'Img.Gelendzhik/10.jpg';
}
applyTheme(localStorage.getItem('siteTheme') || 'light');
document.getElementById('theme-toggle')?.addEventListener('click', ()=>{ 
  const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'; 
  applyTheme(next); 
});

// ========== ПОГОДА И ТЕМПЕРАТУРА ВОДЫ ==========
async function fetchWeatherAndSea() {
  try {
    const res = await fetch('https://api.open-meteo.com/v1/forecast?latitude=44.5622&longitude=38.0767&current_weather=true');
    const data = await res.json();
    if(data.current_weather) {
      const air = Math.round(data.current_weather.temperature);
      document.getElementById('st-weather-txt').innerHTML = air + '°C';
      let water = Math.min(28, Math.max(12, air - 2));
      document.getElementById('st-water-txt').innerHTML = water;
    }
  } catch(e) {
    document.getElementById('st-weather-txt').innerHTML = '22°C';
    document.getElementById('st-water-txt').innerHTML = '20°C';
  }
}
fetchWeatherAndSea();

// ========== ВРЕМЯ ==========
function updateTime() {
  document.getElementById('st-time-txt').textContent = new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'});
}
updateTime();
setInterval(updateTime, 60000);

// ========== МУЗЫКА С ВИЗУАЛИЗАТОРОМ (36 СТОЛБИКОВ) ==========
const audioPlayer = document.getElementById('audioPlayer');
const playPauseBtn = document.getElementById('playPauseBtn');
const visualizer = document.getElementById('musicVisualizer');
const bars = document.querySelectorAll('.visualizer-bar');
let isPlaying = false;
let animationId = null;

// Высота столбиков (случайные значения)
function getRandomHeights() {
  const heights = [];
  for (let i = 0; i < bars.length; i++) {
    const height = Math.floor(Math.random() * 35) + 12;
    heights.push(height);
  }
  return heights;
}

function animateVisualizer() {
  if (!isPlaying) {
    bars.forEach(bar => {
      bar.style.height = '6px';
      bar.style.opacity = '0.3';
    });
    if (animationId) cancelAnimationFrame(animationId);
    animationId = null;
    return;
  }
  
  const heights = getRandomHeights();
  
  bars.forEach((bar, index) => {
    bar.style.height = heights[index] + 'px';
    bar.style.opacity = '0.9';
  });
  
  animationId = requestAnimationFrame(animateVisualizer);
}

// Кнопка Play/Pause
if (playPauseBtn) {
  playPauseBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (isPlaying) {
      audioPlayer.pause();
      isPlaying = false;
      playPauseBtn.textContent = '▶';
      bars.forEach(bar => {
        bar.style.height = '6px';
        bar.style.opacity = '0.3';
      });
      if (animationId) cancelAnimationFrame(animationId);
      animationId = null;
    } else {
      audioPlayer.play().catch(e => console.log('Ошибка:', e));
      isPlaying = true;
      playPauseBtn.textContent = '⏸';
      animateVisualizer();
    }
  });
}

// Клик на визуализатор (тоже вкл/выкл)
if (visualizer) {
  visualizer.addEventListener('click', (e) => {
    e.stopPropagation();
    if (isPlaying) {
      audioPlayer.pause();
      isPlaying = false;
      playPauseBtn.textContent = '▶';
      bars.forEach(bar => {
        bar.style.height = '6px';
        bar.style.opacity = '0.3';
      });
      if (animationId) cancelAnimationFrame(animationId);
      animationId = null;
    } else {
      audioPlayer.play().catch(e => console.log('Ошибка:', e));
      isPlaying = true;
      playPauseBtn.textContent = '⏸';
      animateVisualizer();
    }
  });
}

// Автозапуск при первом клике по странице
function enableAutoplay() {
  if (audioPlayer && audioPlayer.paused && !isPlaying) {
    audioPlayer.play().catch(() => {});
    isPlaying = true;
    playPauseBtn.textContent = '⏸';
    animateVisualizer();
  }
  document.body.removeEventListener('click', enableAutoplay);
}
document.body.addEventListener('click', enableAutoplay, { once: true });

// Зацикливание музыки
if (audioPlayer) {
  audioPlayer.addEventListener('ended', () => {
    audioPlayer.currentTime = 0;
    audioPlayer.play();
  });
}

// ========== МОДАЛЬНЫЕ ОКНА ==========
const modalNab = document.getElementById('modalNaberezhnaya');
const modalKan = document.getElementById('modalKanatka');
function openModal(m){ m.classList.add('active'); document.body.style.overflow = 'hidden'; }
function closeModal(m){ m.classList.remove('active'); document.body.style.overflow = ''; }
document.querySelector('.map-point[data-point="naberezhnaya"]')?.addEventListener('click', (e) => { e.stopPropagation(); openModal(modalNab); });
document.querySelector('.map-point[data-point="kanatka"]')?.addEventListener('click', (e) => { e.stopPropagation(); openModal(modalKan); });
document.querySelectorAll('.modal-close-btn').forEach(btn => { btn.addEventListener('click', (e) => { const modal = e.target.closest('.modal-overlay'); closeModal(modal); }); });
document.querySelectorAll('.modal-overlay').forEach(modal => { modal.addEventListener('click', (e) => { if(e.target === modal) closeModal(modal); }); });
document.addEventListener('keydown', (e) => { if(e.key === 'Escape') document.querySelectorAll('.modal-overlay.active').forEach(m => closeModal(m)); });

// ========== ЛАЙКИ ДЛЯ МОДАЛЬНЫХ ОКОН ==========
function createFloatingHeartGel(x, y) {
  const heartSymbols = ['❤️', '💖', '💕', '💗', '💓', '❣️', '💝', '💘', '💟'];
  const randomHeart = heartSymbols[Math.floor(Math.random() * heartSymbols.length)];
  
  const heart = document.createElement('div');
  heart.className = 'floating-heart-gel';
  heart.textContent = randomHeart;
  
  const colors = ['#ff3333', '#ff5555', '#ff7777', '#ff9999', '#ff69b4', '#ff88cc', '#ff3366'];
  heart.style.color = colors[Math.floor(Math.random() * colors.length)];
  
  const offsetX = (Math.random() - 0.5) * 100;
  const randomSize = Math.floor(Math.random() * 32 + 24);
  
  heart.style.left = (x + offsetX - randomSize/2) + 'px';
  heart.style.top = (y - 20) + 'px';
  heart.style.fontSize = randomSize + 'px';
  heart.style.position = 'fixed';
  heart.style.pointerEvents = 'none';
  heart.style.zIndex = '100000';
  heart.style.textShadow = '0 0 5px rgba(255,255,255,0.5)';
  
  document.body.appendChild(heart);
  
  let startTime = null;
  const startY = heart.offsetTop;
  const startX = heart.offsetLeft;
  const swing = Math.random() * 60 - 30;
  
  function animateHeart(timestamp) {
    if(!startTime) startTime = timestamp;
    const elapsed = timestamp - startTime;
    const progress = Math.min(elapsed / 1800, 1);
    
    const moveY = startY + (progress * 500);
    const moveX = startX + Math.sin(progress * Math.PI * 2) * swing * (1 - progress);
    
    heart.style.transform = `translate(${moveX - startX}px, ${moveY - startY}px) rotate(${progress * 360}deg)`;
    heart.style.opacity = 1 - progress;
    
    if(progress < 1) {
      requestAnimationFrame(animateHeart);
    } else {
      heart.remove();
    }
  }
  
  requestAnimationFrame(animateHeart);
}

function showLikesBurst(btnElement) {
  const rect = btnElement.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  
  for(let i = 0; i < 30; i++) {
    setTimeout(() => {
      createFloatingHeartGel(centerX, centerY);
    }, i * 35);
  }
}

function showLikeToast(message) {
  let toast = document.getElementById('likeToastMsg');
  if(!toast) {
    toast = document.createElement('div');
    toast.id = 'likeToastMsg';
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
  setTimeout(() => {
    toast.style.opacity = '0';
  }, 2000);
}

// ========== ЛАЙКИ ДЛЯ НАБЕРЕЖНОЙ ==========
let likesNaberezhnaya = localStorage.getItem('likesNaberezhnaya') ? parseInt(localStorage.getItem('likesNaberezhnaya')) : 100;
let hasLikedNaberezhnaya = localStorage.getItem('likedNaberezhnaya') === 'true';

const likesNabSpan = document.getElementById('likesNaberezhnaya');
const nabHeartBtn = document.querySelector('#modalNaberezhnaya .modal-heart-btn');
const nabHeartIcon = document.querySelector('#modalNaberezhnaya .modal-heart-icon');

if(likesNabSpan) likesNabSpan.textContent = likesNaberezhnaya;
if(nabHeartIcon) {
  nabHeartIcon.textContent = hasLikedNaberezhnaya ? '❤️' : '🤍';
}

if(nabHeartBtn) {
  nabHeartBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if(hasLikedNaberezhnaya) {
      showLikeToast('❤️ Вы уже поставили лайк!');
      return;
    }
    hasLikedNaberezhnaya = true;
    likesNaberezhnaya++;
    if(likesNabSpan) likesNabSpan.textContent = likesNaberezhnaya;
    if(nabHeartIcon) nabHeartIcon.textContent = '❤️';
    localStorage.setItem('likesNaberezhnaya', likesNaberezhnaya);
    localStorage.setItem('likedNaberezhnaya', 'true');
    showLikesBurst(nabHeartBtn);
    if(nabHeartIcon) {
      nabHeartIcon.style.transform = 'scale(1.4)';
      setTimeout(() => { if(nabHeartIcon) nabHeartIcon.style.transform = 'scale(1)'; }, 200);
    }
  });
}

// ========== ЛАЙКИ ДЛЯ КАНАТКИ ==========
let likesKanatka = localStorage.getItem('likesKanatka') ? parseInt(localStorage.getItem('likesKanatka')) : 100;
let hasLikedKanatka = localStorage.getItem('likedKanatka') === 'true';

const likesKanSpan = document.getElementById('likesKanatka');
const kanHeartBtn = document.querySelector('#modalKanatka .modal-heart-btn');
const kanHeartIcon = document.querySelector('#modalKanatka .modal-heart-icon');

if(likesKanSpan) likesKanSpan.textContent = likesKanatka;
if(kanHeartIcon) {
  kanHeartIcon.textContent = hasLikedKanatka ? '❤️' : '🤍';
}

if(kanHeartBtn) {
  kanHeartBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if(hasLikedKanatka) {
      showLikeToast('❤️ Вы уже поставили лайк!');
      return;
    }
    hasLikedKanatka = true;
    likesKanatka++;
    if(likesKanSpan) likesKanSpan.textContent = likesKanatka;
    if(kanHeartIcon) kanHeartIcon.textContent = '❤️';
    localStorage.setItem('likesKanatka', likesKanatka);
    localStorage.setItem('likedKanatka', 'true');
    showLikesBurst(kanHeartBtn);
    if(kanHeartIcon) {
      kanHeartIcon.style.transform = 'scale(1.4)';
      setTimeout(() => { if(kanHeartIcon) kanHeartIcon.style.transform = 'scale(1)'; }, 200);
    }
  });
}

// ========== ОБНОВЛЕНИЕ ФОТО ПРИ СМЕНЕ ТЕМЫ ==========
const themeObs = new MutationObserver(() => updateImages());
themeObs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
updateImages();
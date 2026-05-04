// ========== ТЕМА (ДЕНЬ/НОЧЬ) ==========
function applyTheme(t) {
  const themeIcon = document.getElementById('themeIcon');
  const themeText = document.getElementById('themeText');
  const heroImg = document.getElementById('heroImg');
  if(t === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    if(themeIcon) themeIcon.textContent = '🌙';
    if(themeText) themeText.textContent = 'Ночь';
    if(heroImg) heroImg.src = 'Img.Sirius/adlernoch.jpeg';
  } else {
    document.documentElement.removeAttribute('data-theme');
    if(themeIcon) themeIcon.textContent = '☀️';
    if(themeText) themeText.textContent = 'День';
    if(heroImg) heroImg.src = 'Img.Sirius/adlerr.jpg';
  }
  localStorage.setItem('siteTheme', t);
}
applyTheme(localStorage.getItem('siteTheme') || 'light');
document.getElementById('theme-toggle').addEventListener('click', () => {
  const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  applyTheme(next);
});

// ========== ПОГОДА И ВОДА ==========
async function fetchWeatherAndSea() {
  try {
    const res = await fetch('https://api.open-meteo.com/v1/forecast?latitude=43.4283&longitude=39.9238&current_weather=true');
    const data = await res.json();
    if(data.current_weather) {
      const air = Math.round(data.current_weather.temperature);
      document.getElementById('st-weather-txt').innerHTML = air + '°C';
      let water = Math.min(28, Math.max(10, air - 2));
      document.getElementById('st-water-txt').innerHTML = water;
    }
  } catch(e) {
    document.getElementById('st-weather-txt').innerHTML = '23°C';
    document.getElementById('st-water-txt').innerHTML = '21°C';
  }
}
fetchWeatherAndSea();

// ========== ВРЕМЯ ==========
function updateTime() {
  document.getElementById('st-time-txt').textContent = new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'});
}
updateTime();
setInterval(updateTime, 60000);

// ========== ГОРИЗОНТАЛЬНАЯ ПРОКРУТКА ФОТОПЛЁНКИ ==========
const filmstrip = document.getElementById('filmstrip');
let isDown = false;
let startX;
let scrollLeft;

if(filmstrip) {
  filmstrip.addEventListener('mousedown', (e) => {
    isDown = true;
    filmstrip.style.cursor = 'grabbing';
    startX = e.pageX - filmstrip.offsetLeft;
    scrollLeft = filmstrip.scrollLeft;
  });
  filmstrip.addEventListener('mouseleave', () => {
    isDown = false;
    filmstrip.style.cursor = 'grab';
  });
  filmstrip.addEventListener('mouseup', () => {
    isDown = false;
    filmstrip.style.cursor = 'grab';
  });
  filmstrip.addEventListener('mousemove', (e) => {
    if(!isDown) return;
    e.preventDefault();
    const x = e.pageX - filmstrip.offsetLeft;
    const walk = (x - startX) * 1.5;
    filmstrip.scrollLeft = scrollLeft - walk;
  });
  filmstrip.addEventListener('touchstart', (e) => {
    isDown = true;
    startX = e.touches[0].pageX - filmstrip.offsetLeft;
    scrollLeft = filmstrip.scrollLeft;
  });
  filmstrip.addEventListener('touchend', () => {
    isDown = false;
  });
  filmstrip.addEventListener('touchmove', (e) => {
    if(!isDown) return;
    const x = e.touches[0].pageX - filmstrip.offsetLeft;
    const walk = (x - startX) * 1.5;
    filmstrip.scrollLeft = scrollLeft - walk;
  });
  filmstrip.style.cursor = 'grab';
}

// ========== САМОЛЁТ ==========
const plane = document.getElementById('planeCorner');
let isMobile = /iPhone|iPad|iPod|Android|Mobile|webOS|BlackBerry|Windows Phone/i.test(navigator.userAgent);

function flyToMountains() {
  if(!plane) return;
  if(isMobile) {
    plane.classList.add('plane-fly-mobile');
    setTimeout(() => { window.location.href = '../Roza/Roza.html'; }, 5000);
  } else {
    plane.classList.add('plane-fly');
    setTimeout(() => { window.location.href = '../Roza/Roza.html'; }, 500);
  }
}

// МОБИЛЬНАЯ ВЕРСИЯ САМОЛЁТА
if(isMobile && plane) {
  const planeInner = plane.querySelector('.plane-inner');
  if(planeInner) {
    planeInner.innerHTML = `
      <div class="plane-icon">✈️</div>
      <div class="plane-text">А может в Горы?</div>
    `;
    planeInner.style.gap = '12px';
    planeInner.style.padding = '12px 20px';
  }
  plane.style.animation = 'planeBlinkMobile 0.8s ease-in-out infinite';
  plane.style.boxShadow = '0 0 15px rgba(255,200,0,0.6)';
  plane.style.borderRadius = '60px';
  plane.style.width = 'auto';
  plane.addEventListener('click', (e) => {
    e.stopPropagation();
    flyToMountains();
  });
}

// ПК ВЕРСИЯ САМОЛЁТА
if(!isMobile && plane) {
  plane.addEventListener('click', (e) => {
    e.stopPropagation();
    flyToMountains();
  });
}
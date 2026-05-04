// ========== МУЗЫКА ==========
const bgMusic = document.getElementById('bgMusic');
const musicToggle = document.getElementById('musicToggle');
const musicIcon = document.getElementById('musicIcon');
let musicPlaying = true;
bgMusic.volume = 0.3;
bgMusic.play().catch(e => console.log('Autoplay prevented'));
musicToggle.addEventListener('click', () => {
  if(musicPlaying) { bgMusic.pause(); musicIcon.textContent = '🔇'; musicPlaying = false; }
  else { bgMusic.play(); musicIcon.textContent = '🎵'; musicPlaying = true; }
});

// ========== СЧЁТЧИК ПРОСМОТРОВ ==========
let siteViews = localStorage.getItem('siteTotalViews');
siteViews = siteViews ? Number(siteViews) + 1 : 1;
localStorage.setItem('siteTotalViews', siteViews);
document.getElementById('siteViewsCounter').textContent = siteViews;

// ========== ТЕМА (ДЕНЬ/НОЧЬ) ==========
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
}
applyTheme(localStorage.getItem('siteTheme') || 'light');
document.getElementById('theme-toggle').addEventListener('click', () => {
  const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  applyTheme(next);
});

// ========== ВРЕМЯ И ПОГОДА ==========
function updateTime(){ document.getElementById('st-time-txt').textContent = new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'}); }
updateTime(); setInterval(updateTime,60000);
async function fetchWeather(){ 
  try{ 
    const res=await fetch('https://api.open-meteo.com/v1/forecast?latitude=44.8953&longitude=37.3167&current_weather=true'); 
    const data=await res.json(); 
    if(data.current_weather) {
      const temp = Math.round(data.current_weather.temperature);
      document.getElementById('st-weather-txt').innerHTML = temp+'°C';
    }
  }catch(e){ document.getElementById('st-weather-txt').innerHTML='--°C'; } 
}
fetchWeather();

// ========== ОТВЕТ НА ВОПРОС "С ЧЕГО НАЧИНАЕТСЯ ЛЕТО" ==========
const answerResult = document.getElementById('answerResult');
const optionCards = document.querySelectorAll('.option-card');

optionCards.forEach(card => {
  card.addEventListener('click', () => {
    const option = card.getAttribute('data-option');
    let message = '';
    switch(option) {
      case 'пляжный релакс':
        message = '🏖️ Отличный выбор! Пляжный релакс — это солнце, песок и бесконечное море. Желаю вам золотистого загара и кристально чистой воды! 🌊✨';
        break;
      case 'актив в горах':
        message = '⛰️ Великолепный выбор! Активный отдых в горах дарит незабываемые виды, чистый воздух и заряд бодрости. Пусть вершины покоряются легко! 🏔️💪';
        break;
      case 'прогулки по паркам':
        message = '🌳 Прекрасный выбор! Прогулки по паркам — это вдохновение, уютные аллеи и гармония с природой. Желаю ярких впечатлений и красивых фото! 📸✨';
        break;
      default:
        message = '✨ Отличный выбор! Пусть ваше лето будет незабываемым! ✨';
    }
    answerResult.style.display = 'block';
    answerResult.innerHTML = message;
    answerResult.style.opacity = '0';
    setTimeout(() => { answerResult.style.opacity = '1'; }, 10);
    showToast(`✨ Вы выбрали: ${card.querySelector('.option-label').textContent} ✨`);
  });
});

// ========== ЧЕК-ЛИСТ (НЕ ЗАБУДЬ ЧЕМОДАН) ==========
const checklistItems = ['Паспорт 📄','Деньги и карты 💰','Документы на авто 🚗','Купальник 🩱','Аптечка 💊','Солнцезащитный крем 🧴','Головной убор 👒','Солнцезащитные очки 🕶️','Полотенце 🏖️','Зарядка и пауэрбанк 🔋','Наушники 🎧','Бутылка для воды 💧'];
function loadChecklist(){ try{ return JSON.parse(localStorage.getItem('checklist_popup')||'[]'); }catch{ return []; } }
function saveChecklist(arr){ localStorage.setItem('checklist_popup',JSON.stringify(arr)); }
function renderChecklist(){ const saved=loadChecklist(); const container=document.getElementById('checklist'); container.innerHTML=checklistItems.map(text=>`<label class="checkrow"><input type="checkbox" ${saved.includes(text)?'checked':''}> ${text}</label>`).join(''); document.querySelectorAll('#checklist input').forEach(cb=>{ cb.addEventListener('change',()=>{ let cur=loadChecklist(); const text=cb.parentElement.textContent.trim(); if(cb.checked){ if(!cur.includes(text)) cur.push(text); }else{ const idx=cur.indexOf(text); if(idx!==-1) cur.splice(idx,1); } saveChecklist(cur); }); }); }
renderChecklist();
const remind=document.getElementById('remind-area'), panelDiv=document.getElementById('panel');
function openPanel(){ panelDiv.classList.add('visible'); const btnRect=remind.getBoundingClientRect(); let left=window.scrollX+btnRect.left-panelDiv.offsetWidth-12; if(left<12) left=12; panelDiv.style.left=left+'px'; panelDiv.style.top=window.scrollY+btnRect.top+'px'; }
function closePanel(){ panelDiv.classList.remove('visible'); }
remind.addEventListener('click', ()=>{ panelDiv.classList.contains('visible')?closePanel():openPanel(); });
document.addEventListener('click',(e)=>{ if(panelDiv.classList.contains('visible') && !remind.contains(e.target) && !panelDiv.contains(e.target)) closePanel(); });

// ========== СМЕНА ФОТО МОРЯ ==========
document.getElementById('changeSeaBtn').addEventListener('click',()=>{ const inp=document.createElement('input'); inp.type='file'; inp.accept='image/*'; inp.onchange=(e)=>{ if(e.target.files[0]) document.getElementById('seaPhoto').src=URL.createObjectURL(e.target.files[0]); showToast('🌊 Фото моря обновлено!'); }; inp.click(); });
const aboutPhoto=document.getElementById('about-photo'), modalUserPhoto=document.getElementById('modalUserPhoto');
aboutPhoto.addEventListener('click',()=>{ const inp=document.createElement('input'); inp.type='file'; inp.accept='image/*'; inp.onchange=()=>{ if(inp.files[0]){ const url=URL.createObjectURL(inp.files[0]); aboutPhoto.src=url; modalUserPhoto.src=url; showToast('🖼️ Аватар обновлён'); } }; inp.click(); });

// ========== МОДАЛЬНОЕ ОКНО ЗНАКОМСТВА ==========
const modalOverlay=document.getElementById('introModal');
document.getElementById('about-float').addEventListener('click',()=>{ modalOverlay.classList.add('active'); document.body.style.overflow='hidden'; });
document.getElementById('closeModalBtn').addEventListener('click',()=>{ modalOverlay.classList.remove('active'); document.body.style.overflow=''; });
modalOverlay.addEventListener('click',(e)=>{ if(e.target===modalOverlay) modalOverlay.classList.remove('active'); });

function showToast(msg){ const toast=document.getElementById('toastMsg'); toast.textContent=msg; toast.classList.add('show'); setTimeout(()=>toast.classList.remove('show'),3000); }

// ========== КАРУСЕЛЬ МОИХ МАРШРУТОВ ==========
const routesTrack = document.getElementById('routesTrack');
const routeCards = Array.from(document.querySelectorAll('.route-card'));
const routesDots = document.getElementById('routesDots');
let currentRoute = 0, autoRouteInterval;
function updateRouteDots(){ document.querySelectorAll('#routesDots .dot').forEach((d,i)=>d.classList.toggle('active',i===currentRoute)); }
function goToRouteSlide(i){ currentRoute=(i+routeCards.length)%routeCards.length; routesTrack.style.transform=`translateX(-${currentRoute*100}%)`; updateRouteDots(); }
function createRouteDots(){ routesDots.innerHTML=''; routeCards.forEach((_,i)=>{ const dot=document.createElement('div'); dot.classList.add('dot'); if(i===currentRoute) dot.classList.add('active'); dot.addEventListener('click',()=>{ clearInterval(autoRouteInterval); goToRouteSlide(i); startAutoRoutes(); }); routesDots.appendChild(dot); }); }
function startAutoRoutes(){ if(autoRouteInterval) clearInterval(autoRouteInterval); autoRouteInterval=setInterval(()=>goToRouteSlide(currentRoute+1),4000); }
createRouteDots(); goToRouteSlide(0); startAutoRoutes();
document.getElementById('routesCarousel').addEventListener('mouseenter',()=>clearInterval(autoRouteInterval));
document.getElementById('routesCarousel').addEventListener('mouseleave',startAutoRoutes);
routeCards.forEach(c=>c.addEventListener('click',()=>{ const page=c.getAttribute('data-page'); if(page) window.location.href=page; }));

// ========== КАРУСЕЛЬ "ПЛАНИРУЮ ПОСЕТИТЬ" ==========
const placesTrack = document.getElementById('placesTrack');
const placeCards = Array.from(document.querySelectorAll('.place-card'));
const placesDots = document.getElementById('placesDots');
let currentPlace=0, autoPlaceInterval;
function updatePlaceDots(){ document.querySelectorAll('#placesDots .dot').forEach((d,i)=>d.classList.toggle('active',i===currentPlace)); }
function goToPlaceSlide(i){ currentPlace=(i+placeCards.length)%placeCards.length; placesTrack.style.transform=`translateX(-${currentPlace*100}%)`; updatePlaceDots(); }
function createPlaceDots(){ placesDots.innerHTML=''; placeCards.forEach((_,i)=>{ const dot=document.createElement('div'); dot.classList.add('dot'); if(i===currentPlace) dot.classList.add('active'); placesDots.appendChild(dot); }); }
function startAutoPlaces(){ if(autoPlaceInterval) clearInterval(autoPlaceInterval); autoPlaceInterval=setInterval(()=>goToPlaceSlide(currentPlace+1),4000); }
createPlaceDots(); goToPlaceSlide(0); startAutoPlaces();
document.getElementById('placesCarousel').addEventListener('mouseenter',()=>clearInterval(autoPlaceInterval));
document.getElementById('placesCarousel').addEventListener('mouseleave',startAutoPlaces);

// ========== ЗВЁЗДЫ ДЛЯ ОТЗЫВОВ ==========
let currentRating=0;
document.querySelectorAll('.star').forEach(star=>{ star.addEventListener('click',()=>{ currentRating=parseInt(star.dataset.value); document.querySelectorAll('.star').forEach((s,i)=>s.classList.toggle('active',i<currentRating)); }); });

// ========== ОТПРАВКА ОТЗЫВА ==========
document.getElementById('reviewForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('reviewerName').value.trim();
  const email = document.getElementById('reviewerEmail').value.trim();
  const text = document.getElementById('reviewText').value.trim();
  
  if (!name || !email || !text) {
    showToast('📝 Пожалуйста, заполните все поля');
    return;
  }
  if (currentRating === 0) {
    showToast('⭐ Поставьте оценку звёздами');
    return;
  }

  const message = `🌟 ОТЗЫВ 🌟\n\n👤 Имя: ${name}\n📧 Почта: ${email}\n⭐ Оценка: ${currentRating}★\n📝 Отзыв: ${text}`;
  
  function resetForm() {
    document.getElementById('reviewForm').reset();
    document.querySelectorAll('.star').forEach(s => s.classList.remove('active'));
    currentRating = 0;
  }
  
  if (navigator.share) {
    try {
      await navigator.share({
        title: 'Отзыв о сайте Мой юг',
        text: message,
      });
      showToast('✅ Спасибо! Отзыв отправлен');
      resetForm();
      return;
    } catch (err) {}
  }
  
  try {
    await navigator.clipboard.writeText(message + '\n\nОтправьте это сообщение: angelina.chernovalova@yandex.ru');
    showToast('📋 Отзыв скопирован! Отправьте его мне любым способом');
    resetForm();
  } catch (err) {
    showToast('⚠️ Не удалось скопировать, но отзыв сохранён');
    console.log(message);
    resetForm();
  }
});

// ========== ШЕРИНГ (ПОДЕЛИТЬСЯ) ==========
const shareUrl = encodeURIComponent(window.location.href);
const shareTitle = encodeURIComponent('Мой юг: от Анапы до Сочи');
document.querySelectorAll('.share-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const type = btn.dataset.share;
    let url = '';
    if (type === 'email') {
      url = `mailto:?subject=${shareTitle}&body=${shareUrl}`;
      window.location.href = url;
    } else if (type === 'vk') {
      url = `https://vk.com/share.php?url=${shareUrl}&title=${shareTitle}`;
      window.open(url, '_blank', 'width=600,height=400');
    } else if (type === 'ok') {
      url = `https://connect.ok.ru/offer?url=${shareUrl}&title=${shareTitle}`;
      window.open(url, '_blank', 'width=600,height=400');
    } else if (type === 'max') {
      navigator.clipboard.writeText(window.location.href);
      showToast('🔗 Ссылка скопирована! Поделитесь с друзьями');
    }
  });
});
// ========== TOAST ==========
function showToast(msg) {
    var toast = document.getElementById('toastMsg');
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(function() { 
        toast.classList.remove('show'); 
    }, 3000);
}

// ========== УВЕДОМЛЕНИЕ ДЛЯ "ПЛАНИРУЮ ПОСЕТИТЬ" ==========
function showSoonToast() {
    showToast('🔜 Скоро здесь появится подробный маршрут! Следите за обновлениями.');
}

// ========== ОБРАБОТЧИК ОПРОСА ==========
document.addEventListener('DOMContentLoaded', function() {
    var optionCards = document.querySelectorAll('.option-card');
    
    for (var i = 0; i < optionCards.length; i++) {
        var card = optionCards[i];
        
        var handler = function(e) {
            e.stopPropagation();
            e.preventDefault();
            
            var option = this.getAttribute('data-option');
            var answerResult = document.getElementById('answerResult');
            var message = '';
            
            switch (option) {
                case 'пляжный релакс':
                    message = '🏖️✨ Пляжный релакс — отличный выбор! ✨🏖️<br><br>Представьте: теплое море, мягкий песок и легкий бриз... 🌊<br>Идеальное лето начинается с расслабления на побережье! ☀️🍹';
                    break;
                case 'актив в горах':
                    message = '⛰️💪 Активный отдых в горах — великолепный выбор! 💪⛰️<br><br>Свежий горный воздух, захватывающие пейзажи и водопады... 🏔️🌲<br>Вас ждут незабываемые приключения! ✨';
                    break;
                case 'прогулки по паркам':
                    message = '🌳📸 Прогулки по паркам — прекрасный выбор! 📸🌳<br><br>Тенистые аллеи, пение птиц и красивые фонтаны... 🦆🌺<br>Идеальное время для вдохновения! ✨';
                    break;
                default:
                    message = '✨🌟 Прекрасный выбор! 🌟✨<br><br>Пусть ваше лето будет незабываемым! ☀️🎉';
            }
            
            if (answerResult) {
                answerResult.style.display = 'block';
                answerResult.innerHTML = message;
                answerResult.style.opacity = '0';
                answerResult.style.transform = 'translateY(10px)';
                
                setTimeout(function() {
                    answerResult.style.transition = 'all 0.3s ease';
                    answerResult.style.opacity = '1';
                    answerResult.style.transform = 'translateY(0)';
                }, 10);
                
                setTimeout(function() {
                    answerResult.style.opacity = '0';
                    answerResult.style.transform = 'translateY(10px)';
                    setTimeout(function() {
                        answerResult.style.display = 'none';
                    }, 300);
                }, 5000);
            }
        };
        
        card.addEventListener('click', handler);
        card.addEventListener('touchstart', handler);
    }
});

// ========== ПЛАНИРУЮ ПОСЕТИТЬ (ВСЯ КАРТОЧКА) ==========
document.addEventListener('DOMContentLoaded', function() {
    var futurePlaces = document.querySelectorAll('.place-future');
    
    for (var i = 0; i < futurePlaces.length; i++) {
        var place = futurePlaces[i];
        
        var toastHandler = function(e) {
            e.stopPropagation();
            showSoonToast();
        };
        
        place.addEventListener('click', toastHandler);
        place.addEventListener('touchstart', toastHandler);
    }
});

// ========== МУЗЫКА ==========
var bgMusic = document.getElementById('bgMusic');
var musicToggle = document.getElementById('musicToggle');
var musicIcon = document.getElementById('musicIcon');
var musicPlaying = false;

if (musicToggle) {
    var musicHandler = function(e) {
        e.stopPropagation();
        e.preventDefault();
        
        if (!bgMusic) return;
        
        if (musicPlaying) {
            bgMusic.pause();
            if (musicIcon) musicIcon.textContent = '🔇';
            musicPlaying = false;
        } else {
            bgMusic.play().catch(function(err) { console.log('Ошибка:', err); });
            if (musicIcon) musicIcon.textContent = '🎵';
            musicPlaying = true;
        }
    };
    
    musicToggle.addEventListener('click', musicHandler);
    musicToggle.addEventListener('touchstart', musicHandler);
}

// ========== СВЯЗАТЬСЯ СО МНОЙ ==========
var contactLink = document.querySelector('.footer-contact a');
if (contactLink) {
    contactLink.addEventListener('click', function(e) {
        e.preventDefault();
        window.location.href = 'mailto:angelina.chernovalova@yandex.ru';
    });
    contactLink.addEventListener('touchstart', function(e) {
        e.preventDefault();
        window.location.href = 'mailto:angelina.chernovalova@yandex.ru';
    });
}

// ========== СЧЁТЧИК ПРОСМОТРОВ ==========
var siteViews = localStorage.getItem('siteTotalViews');
siteViews = siteViews ? Number(siteViews) + 1 : 1;
localStorage.setItem('siteTotalViews', siteViews);
var viewsCounter = document.getElementById('siteViewsCounter');
if (viewsCounter) viewsCounter.textContent = siteViews;

// ========== ТЕМА (ДЕНЬ/НОЧЬ) ==========
var themeToggle = document.getElementById('theme-toggle');
var savedTheme = localStorage.getItem('siteTheme');

function applyTheme(t) {
    var themeIcon = document.getElementById('themeIcon');
    var themeText = document.getElementById('themeText');
    
    if (t === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        if (themeIcon) themeIcon.textContent = '🌙';
        if (themeText) themeText.textContent = 'Ночь';
    } else {
        document.documentElement.removeAttribute('data-theme');
        if (themeIcon) themeIcon.textContent = '☀️';
        if (themeText) themeText.textContent = 'День';
    }
    localStorage.setItem('siteTheme', t);
}

if (savedTheme === 'dark') {
    applyTheme('dark');
} else {
    applyTheme('light');
}

if (themeToggle) {
    var themeHandler = function(e) {
        e.preventDefault();
        e.stopPropagation();
        var next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        applyTheme(next);
    };
    themeToggle.addEventListener('click', themeHandler);
}

// ========== ВРЕМЯ ==========
function updateTime() {
    var timeElem = document.getElementById('st-time-txt');
    if (timeElem) {
        var now = new Date();
        var hours = now.getHours().toString().padStart(2, '0');
        var minutes = now.getMinutes().toString().padStart(2, '0');
        timeElem.textContent = hours + ':' + minutes;
    }
}
updateTime();
setInterval(updateTime, 60000);

// ========== ПОГОДА ==========
async function fetchWeather() {
    try {
        var res = await fetch('https://api.open-meteo.com/v1/forecast?latitude=44.8953&longitude=37.3167&current_weather=true');
        var data = await res.json();
        if (data.current_weather) {
            var temp = Math.round(data.current_weather.temperature);
            var weatherElem = document.getElementById('st-weather-txt');
            if (weatherElem) weatherElem.innerHTML = temp + '°C';
        }
    } catch(e) {
        var weatherElem = document.getElementById('st-weather-txt');
        if (weatherElem) weatherElem.innerHTML = '24°C';
    }
}
fetchWeather();

// ========== ЧЕК-ЛИСТ ==========
var checklistItems = ['Паспорт 📄', 'Деньги и карты 💰', 'Документы на авто 🚗', 'Купальник 🩱', 'Аптечка 💊', 'Солнцезащитный крем 🧴', 'Головной убор 👒', 'Солнцезащитные очки 🕶️', 'Полотенце 🏖️', 'Зарядка и пауэрбанк 🔋', 'Наушники 🎧', 'Бутылка для воды 💧'];

function loadChecklist() {
    try { return JSON.parse(localStorage.getItem('checklist_popup') || '[]'); } catch(e) { return []; }
}
function saveChecklist(arr) { localStorage.setItem('checklist_popup', JSON.stringify(arr)); }
function renderChecklist() {
    var saved = loadChecklist();
    var container = document.getElementById('checklist');
    if (!container) return;
    container.innerHTML = '';
    for (var i = 0; i < checklistItems.length; i++) {
        var text = checklistItems[i];
        var checked = saved.includes(text) ? 'checked' : '';
        container.innerHTML += '<label class="checkrow"><input type="checkbox" ' + checked + '> ' + text + '</label>';
    }
    var inputs = document.querySelectorAll('#checklist input');
    for (var j = 0; j < inputs.length; j++) {
        inputs[j].addEventListener('change', function(cb) {
            return function() {
                var cur = loadChecklist();
                var text = cb.parentElement.textContent.trim();
                if (cb.checked) {
                    if (cur.indexOf(text) === -1) cur.push(text);
                } else {
                    var idx = cur.indexOf(text);
                    if (idx !== -1) cur.splice(idx, 1);
                }
                saveChecklist(cur);
            };
        }(inputs[j]));
    }
}
renderChecklist();

var remind = document.getElementById('remind-area');
var panelDiv = document.getElementById('panel');

function openPanel() {
    if (!panelDiv) return;
    panelDiv.classList.add('visible');
    if (remind) {
        var btnRect = remind.getBoundingClientRect();
        var left = window.scrollX + btnRect.left - panelDiv.offsetWidth - 12;
        if (left < 12) left = 12;
        panelDiv.style.left = left + 'px';
        panelDiv.style.top = window.scrollY + btnRect.top + 'px';
    }
}
function closePanel() { if (panelDiv) panelDiv.classList.remove('visible'); }

if (remind) {
    remind.addEventListener('click', function(e) {
        e.stopPropagation();
        panelDiv.classList.contains('visible') ? closePanel() : openPanel();
    });
}

// ========== СМЕНА ФОТО МОРЯ ==========
var changeSeaBtn = document.getElementById('changeSeaBtn');
if (changeSeaBtn) {
    changeSeaBtn.addEventListener('click', function() {
        var inp = document.createElement('input');
        inp.type = 'file';
        inp.accept = 'image/*';
        inp.onchange = function(e) {
            if (e.target.files[0]) {
                var seaPhoto = document.getElementById('seaPhoto');
                if (seaPhoto) seaPhoto.src = URL.createObjectURL(e.target.files[0]);
                showToast('🌊 Фото моря обновлено!');
            }
        };
        inp.click();
    });
}

// ========== АВАТАР ==========
var aboutPhoto = document.getElementById('about-photo');
var modalUserPhoto = document.getElementById('modalUserPhoto');
if (aboutPhoto) {
    aboutPhoto.addEventListener('click', function() {
        var inp = document.createElement('input');
        inp.type = 'file';
        inp.accept = 'image/*';
        inp.onchange = function() {
            if (inp.files[0]) {
                var url = URL.createObjectURL(inp.files[0]);
                aboutPhoto.src = url;
                if (modalUserPhoto) modalUserPhoto.src = url;
                showToast('🖼️ Аватар обновлён');
            }
        };
        inp.click();
    });
}

// ========== МОДАЛЬНОЕ ОКНО ==========
var modalOverlay = document.getElementById('introModal');
var aboutFloat = document.getElementById('about-float');
var closeModalBtn = document.getElementById('closeModalBtn');
var savedScrollYModal = 0;

function openModalWindow() {
    if (!modalOverlay) return;
    savedScrollYModal = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = '-' + savedScrollYModal + 'px';
    document.body.style.width = '100%';
    document.body.style.overflow = 'hidden';
    modalOverlay.classList.add('active');
}

function closeModalWindow() {
    if (!modalOverlay) return;
    modalOverlay.classList.remove('active');
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    document.body.style.overflow = '';
    window.scrollTo(0, savedScrollYModal);
}

if (aboutFloat) {
    aboutFloat.addEventListener('click', function(e) { e.stopPropagation(); openModalWindow(); });
}
if (closeModalBtn) {
    closeModalBtn.addEventListener('click', function(e) { e.stopPropagation(); closeModalWindow(); });
}
if (modalOverlay) {
    modalOverlay.addEventListener('click', function(e) { if (e.target === modalOverlay) closeModalWindow(); });
}

// ========== КАРУСЕЛЬ МАРШРУТОВ ==========
var routesTrack = document.getElementById('routesTrack');
var routeCards = document.querySelectorAll('.route-card');
var routesDots = document.getElementById('routesDots');
var currentRoute = 0;
var autoRouteInterval;

function updateRouteDots() {
    if (!routesDots) return;
    var dots = document.querySelectorAll('#routesDots .dot');
    for (var i = 0; i < dots.length; i++) {
        if (i === currentRoute) {
            dots[i].classList.add('active');
        } else {
            dots[i].classList.remove('active');
        }
    }
}

function goToRouteSlide(i) {
    currentRoute = (i + routeCards.length) % routeCards.length;
    if (routesTrack) routesTrack.style.transform = 'translateX(-' + (currentRoute * 100) + '%)';
    updateRouteDots();
}

function createRouteDots() {
    if (!routesDots) return;
    routesDots.innerHTML = '';
    for (var i = 0; i < routeCards.length; i++) {
        var dot = document.createElement('div');
        dot.classList.add('dot');
        if (i === currentRoute) dot.classList.add('active');
        (function(index) {
            dot.addEventListener('click', function() {
                clearInterval(autoRouteInterval);
                goToRouteSlide(index);
                startAutoRoutes();
            });
        })(i);
        routesDots.appendChild(dot);
    }
}

function startAutoRoutes() {
    if (autoRouteInterval) clearInterval(autoRouteInterval);
    autoRouteInterval = setInterval(function() { 
        goToRouteSlide(currentRoute + 1); 
    }, 4000);
}

for (var i = 0; i < routeCards.length; i++) {
    routeCards[i].addEventListener('click', function(e) {
        e.stopPropagation();
        var page = this.getAttribute('data-page');
        if (page) window.location.href = page;
    });
}

if (routeCards.length > 0) {
    createRouteDots();
    goToRouteSlide(0);
    startAutoRoutes();
}

// ========== КАРУСЕЛЬ "ПЛАНИРУЮ ПОСЕТИТЬ" ==========
var placesTrack = document.getElementById('placesTrack');
var placeCards = document.querySelectorAll('.place-card');
var placesDots = document.getElementById('placesDots');
var currentPlace = 0;
var autoPlaceInterval;

function updatePlaceDots() {
    if (!placesDots) return;
    var dots = document.querySelectorAll('#placesDots .dot');
    for (var i = 0; i < dots.length; i++) {
        if (i === currentPlace) {
            dots[i].classList.add('active');
        } else {
            dots[i].classList.remove('active');
        }
    }
}

function goToPlaceSlide(i) {
    currentPlace = (i + placeCards.length) % placeCards.length;
    if (placesTrack) placesTrack.style.transform = 'translateX(-' + (currentPlace * 100) + '%)';
    updatePlaceDots();
}

function createPlaceDots() {
    if (!placesDots) return;
    placesDots.innerHTML = '';
    for (var i = 0; i < placeCards.length; i++) {
        var dot = document.createElement('div');
        dot.classList.add('dot');
        (function(index) {
            dot.addEventListener('click', function() {
                clearInterval(autoPlaceInterval);
                goToPlaceSlide(index);
                startAutoPlaces();
            });
        })(i);
        placesDots.appendChild(dot);
    }
}

function startAutoPlaces() {
    if (autoPlaceInterval) clearInterval(autoPlaceInterval);
    autoPlaceInterval = setInterval(function() { 
        goToPlaceSlide(currentPlace + 1); 
    }, 4000);
}

if (placeCards.length > 0) {
    createPlaceDots();
    goToPlaceSlide(0);
    startAutoPlaces();
}

// ========== ЗВЁЗДЫ ==========
var currentRating = 0;
var stars = document.querySelectorAll('.star');

function updateStars(rating) {
    for (var i = 0; i < stars.length; i++) {
        if (i < rating) {
            stars[i].classList.add('active');
            stars[i].style.color = '#ffc107';
        } else {
            stars[i].classList.remove('active');
            stars[i].style.color = '#f5e6b0';
        }
    }
}

for (var i = 0; i < stars.length; i++) {
    stars[i].addEventListener('click', function(star) {
        return function(e) {
            e.stopPropagation();
            var value = parseInt(star.getAttribute('data-value'));
            currentRating = value;
            updateStars(currentRating);
            showToast('⭐ Оценка: ' + currentRating + ' звезды');
        };
    }(stars[i]));
}

// ========== ОТПРАВКА ОТЗЫВА ==========
var reviewForm = document.getElementById('reviewForm');
var reviewerName = document.getElementById('reviewerName');
var reviewerEmail = document.getElementById('reviewerEmail');
var reviewText = document.getElementById('reviewText');

function showFieldError(field, message) {
    field.style.border = '2px solid #ff4444';
    field.style.backgroundColor = 'rgba(255,68,68,0.1)';
    setTimeout(function() {
        field.style.border = '2px solid var(--accent)';
        field.style.backgroundColor = '';
    }, 3000);
    showToast(message);
}

if (reviewForm) {
    reviewForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        var name = reviewerName ? reviewerName.value.trim() : '';
        var email = reviewerEmail ? reviewerEmail.value.trim() : '';
        var text = reviewText ? reviewText.value.trim() : '';
        
        var hasError = false;
        
        if (!name) {
            showFieldError(reviewerName, '📝 Пожалуйста, введите ваше имя');
            hasError = true;
        }
        if (!email) {
            showFieldError(reviewerEmail, '📧 Пожалуйста, введите вашу почту');
            hasError = true;
        } else if (email.indexOf('@') === -1 || email.indexOf('.') === -1) {
            showFieldError(reviewerEmail, '📧 Введите корректный email');
            hasError = true;
        }
        if (!text) {
            showFieldError(reviewText, '💬 Пожалуйста, напишите ваш отзыв');
            hasError = true;
        }
        
        if (hasError) return;
        if (currentRating === 0) {
            showToast('⭐ Поставьте оценку звёздами!');
            return;
        }
        
        var message = '🌟 ОТЗЫВ 🌟\n\n👤 Имя: ' + name + '\n📧 Почта: ' + email + '\n⭐ Оценка: ' + currentRating + '★\n📝 Отзыв: ' + text;
        
        function resetForm() {
            if (reviewForm) reviewForm.reset();
            currentRating = 0;
            updateStars(0);
        }
        
        if (navigator.share) {
            try {
                await navigator.share({ title: 'Отзыв о сайте Мой юг', text: message });
                showToast('✅ Спасибо! Отзыв отправлен');
                resetForm();
                return;
            } catch(err) { }
        }
        
        try {
            await navigator.clipboard.writeText(message + '\n\nОтправьте это сообщение: angelina.chernovalova@yandex.ru');
            showToast('📋 Отзыв скопирован! Отправьте его мне любым способом');
            resetForm();
        } catch(err) {
            showToast('⚠️ Не удалось скопировать, но отзыв сохранён');
            console.log(message);
            resetForm();
        }
    });
}

// ========== КНОПКИ ШЕРИНГА ==========
var shareUrl = encodeURIComponent(window.location.href);
var shareTitle = encodeURIComponent('Мой юг: от Анапы до Сочи');

var shareBtns = document.querySelectorAll('.share-btn');
for (var i = 0; i < shareBtns.length; i++) {
    shareBtns[i].addEventListener('click', function(e) {
        e.stopPropagation();
        var type = this.dataset.share;
        if (type === 'vk') {
            window.open('https://vk.com/share.php?url=' + shareUrl + '&title=' + shareTitle, '_blank', 'width=600,height=400');
        } else if (type === 'ok') {
            window.open('https://connect.ok.ru/offer?url=' + shareUrl + '&title=' + shareTitle, '_blank', 'width=600,height=400');
        } else if (type === 'max') {
            navigator.clipboard.writeText(window.location.href);
            showToast('🔗 Ссылка скопирована!');
        }
    });
}

// ========== КНОПКА НАВЕРХ ==========
var scrollTopBtn = document.getElementById('scrollTopBtn');
if (scrollTopBtn) {
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            scrollTopBtn.classList.add('show');
        } else {
            scrollTopBtn.classList.remove('show');
        }
    });
    scrollTopBtn.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ========== МОБИЛЬНОЕ МЕНЮ ==========
var mobileMenuBtn = document.getElementById('mobileMenuBtn');
var mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
var mobileMenuClose = document.getElementById('mobileMenuClose');
var mobileRoutesBtn = document.getElementById('mobileRoutesBtn');
var mobileRoutesSub = document.getElementById('mobileRoutesSub');

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
    mobileMenuBtn.addEventListener('click', function(e) { e.stopPropagation(); openMobileMenu(); });
}
if (mobileMenuClose) {
    mobileMenuClose.addEventListener('click', function(e) { e.stopPropagation(); closeMobileMenu(); });
}
if (mobileMenuOverlay) {
    mobileMenuOverlay.addEventListener('click', function(e) { if (e.target === mobileMenuOverlay) closeMobileMenu(); });
}

if (mobileRoutesBtn && mobileRoutesSub) {
    mobileRoutesBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        mobileRoutesSub.style.display = mobileRoutesSub.style.display === 'none' ? 'flex' : 'none';
    });
}

var menuItems = document.querySelectorAll('.mobile-menu-item[data-target]');
for (var i = 0; i < menuItems.length; i++) {
    menuItems[i].addEventListener('click', function(e) {
        e.stopPropagation();
        var target = this.getAttribute('data-target');
        if (target === 'section-main') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else if (target === 'section-places') {
            var placesSection = document.getElementById('section-places');
            if (placesSection) placesSection.scrollIntoView({ behavior: 'smooth' });
        } else if (target === 'section-review') {
            var reviewSection = document.getElementById('section-review');
            if (reviewSection) reviewSection.scrollIntoView({ behavior: 'smooth' });
        }
        closeMobileMenu();
    });
}

// ========== ПК ЛИАНА ==========
var knotItems = document.querySelectorAll('.knot-item[data-target]');
for (var i = 0; i < knotItems.length; i++) {
    knotItems[i].addEventListener('click', function(e) {
        e.stopPropagation();
        var targetId = this.getAttribute('data-target');
        if (targetId) {
            var targetElement = document.getElementById(targetId);
            if (targetElement) targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
}

// ========== ДВИЖЕНИЕ ЯКОРЯ ==========
function initRopeAnchor() {
    var ropeAnchor = document.getElementById('ropeAnchor');
    if (!ropeAnchor) return;
    
    function updateAnchorPosition() {
        var scrollPercent = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
        var minTop = 80, maxTop = window.innerHeight - 100;
        var newTop = minTop + (maxTop - minTop) * Math.min(1, Math.max(0, scrollPercent));
        ropeAnchor.style.top = Math.min(maxTop, Math.max(minTop, newTop)) + 'px';
    }
    
    var ticking = false;
    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(function() { 
                updateAnchorPosition(); 
                ticking = false; 
            });
            ticking = true;
        }
    });
    window.addEventListener('resize', updateAnchorPosition);
    updateAnchorPosition();
}
initRopeAnchor();

console.log('index.js загружен');
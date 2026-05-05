

(function() {
    "use strict";

    // ============================================================ ТЕМА (ДЕНЬ/НОЧЬ) ================================================================
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
    
    const savedTheme = localStorage.getItem('siteTheme');
    applyTheme(savedTheme === 'dark' ? 'dark' : 'light');
    
    const themeToggle = document.getElementById('theme-toggle');
    if(themeToggle) {
        themeToggle.addEventListener('click', () => {
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            applyTheme(isDark ? 'light' : 'dark');
        });
    }

    // ========================================================================= ВРЕМЯ ==============================================================
    function updateTime(){ 
        const timeSpan = document.getElementById('st-time-txt');
        if(timeSpan) timeSpan.textContent = new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'}); 
    }
    updateTime(); 
    setInterval(updateTime, 60000);

    // ================================================================== ПОГОДА + ВОДА (Анапа) ========================================================
    async function fetchWeatherAndSea(){
        try{
            const res = await fetch('https://api.open-meteo.com/v1/forecast?latitude=44.8953&longitude=37.3167&current_weather=true');
            const data = await res.json();
            if(data.current_weather){
                const air = Math.round(data.current_weather.temperature);
                const weatherSpan = document.getElementById('st-weather-txt');
                if(weatherSpan) weatherSpan.innerText = air + '°C';
                let water = Math.min(28, Math.max(12, air-2));
                const waterSpan = document.getElementById('st-water-txt');
                if(waterSpan) waterSpan.innerText = water;
            }
        }catch(e){
            const weatherSpan = document.getElementById('st-weather-txt');
            const waterSpan = document.getElementById('st-water-txt');
            if(weatherSpan) weatherSpan.innerText = '24°C';
            if(waterSpan) waterSpan.innerText = '22°C';
        }
    }
    fetchWeatherAndSea();

    // ======================================================================= СЛАЙДЕР ================================================================
    const track = document.getElementById('sliderTrack');
    const slides = document.querySelectorAll('.slider-item');
    const dotsContainer = document.getElementById('sliderDots');
    let currentSlide = 0;
    let autoInterval;
    
    function updateSliderDots(){ 
        document.querySelectorAll('.slider-dot').forEach((dot, i)=>{ 
            dot.classList.toggle('active', i===currentSlide); 
        }); 
    }
    
    function goToSlide(index){
        if(index<0) index=slides.length-1;
        if(index>=slides.length) index=0;
        currentSlide=index;
        if(track) track.style.transform = `translateX(-${currentSlide*100}%)`;
        updateSliderDots();
    }
    
    function createSliderDots(){
        if(!dotsContainer) return;
        dotsContainer.innerHTML='';
        slides.forEach((_,i)=>{
            const dot=document.createElement('div');
            dot.classList.add('slider-dot');
            if(i===currentSlide) dot.classList.add('active');
            dot.addEventListener('click',()=>{ clearInterval(autoInterval); goToSlide(i); startAutoScroll(); });
            dot.addEventListener('touchstart',()=>{ clearInterval(autoInterval); goToSlide(i); startAutoScroll(); });
            dotsContainer.appendChild(dot);
        });
    }
    
    function startAutoScroll(){ 
        if(autoInterval) clearInterval(autoInterval); 
        autoInterval = setInterval(()=>{ goToSlide(currentSlide+1); }, 3500); 
    }
    
    if(slides.length > 0) {
        createSliderDots(); 
        goToSlide(0); 
        startAutoScroll();
    }
    
    const sliderContainer = document.querySelector('.slider-container');
    if(sliderContainer) {
        sliderContainer.addEventListener('mouseenter',()=>{ if(autoInterval) clearInterval(autoInterval); });
        sliderContainer.addEventListener('mouseleave',startAutoScroll);
        sliderContainer.addEventListener('touchstart',()=>{ if(autoInterval) clearInterval(autoInterval); });
        sliderContainer.addEventListener('touchend',startAutoScroll);
    }

    // ======================================================================= ОПРОС ПРО ПЛЯЖИ ====================================================================
    const pollSection = document.getElementById('pollSection');
    const resultDiv = document.getElementById('pollResult');
    let isPollAnswered = false;

    const praiseMessages = {
        'Центральный пляж': '✨ Центральный пляж — Отличный выбор! Песок золотой, море ласковое. ✨',
        'Высокий пляж': '✨ Высокий пляж — Романтика! Галька, чистая вода и шикарный вид. ✨',
        'Благовещенская': '✨ Благовещенская — Дикий отдых! Дюны и бескрайний простор. ✨'
    };

    document.querySelectorAll('input[name="beach"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            if(isPollAnswered) return;
            if(e.target.checked){
                isPollAnswered = true;
                const selectedValue = e.target.value;
                const message = praiseMessages[selectedValue] || '✨ Отличный выбор! ✨';
                if(resultDiv) resultDiv.textContent = message;
                if(pollSection) pollSection.classList.add('disabled');
            }
        });
    });

    // ======================================================================= ПЕСОЧНЫЕ ЧАСТИЦЫ ===========================================
    function createSandParticles() {
        const container = document.getElementById('sandParticles');
        if(!container) return;
        container.innerHTML = '';
        for(let i=0; i<50; i++) {
            const particle = document.createElement('div');
            particle.className = 'sand-particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            container.appendChild(particle);
        }
    }
    
    const footerEl = document.getElementById('sandFooter');
    if(footerEl) {
        footerEl.addEventListener('touchstart', (e) => {
            const particles = document.querySelectorAll('.sand-particle');
            particles.forEach(p => {
                const dx = (Math.random() - 0.5) * 80;
                const dy = -Math.random() * 40 - 10;
                p.style.setProperty('--dx', dx + 'px');
                p.style.setProperty('--dy', dy + 'px');
                p.style.animation = 'none';
                p.offsetHeight;
                p.style.animation = 'sandFly 0.5s ease-out forwards';
            });
        });
        footerEl.addEventListener('click', (e) => {
            const particles = document.querySelectorAll('.sand-particle');
            particles.forEach(p => {
                const dx = (Math.random() - 0.5) * 80;
                const dy = -Math.random() * 40 - 10;
                p.style.setProperty('--dx', dx + 'px');
                p.style.setProperty('--dy', dy + 'px');
                p.style.animation = 'none';
                p.offsetHeight;
                p.style.animation = 'sandFly 0.5s ease-out forwards';
            });
        });
    }
    createSandParticles();

})();
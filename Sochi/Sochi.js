(function() {
    "use strict";

    // Карусель Ривьера
    const rivImages = ["20.jpg", "21.jpg", "22.jpg"];
    let rIdx = 0;
    const rImg = document.getElementById('rivieraImg');
    function updateRiviera() { if(rImg) rImg.src = "Img.Sochi/" + rivImages[rIdx]; }
    const prevRiv = document.getElementById('prevRivieraBtn');
    const nextRiv = document.getElementById('nextRivieraBtn');
    if(prevRiv) prevRiv.onclick = () => { rIdx = (rIdx - 1 + rivImages.length) % rivImages.length; updateRiviera(); };
    if(nextRiv) nextRiv.onclick = () => { rIdx = (rIdx + 1) % rivImages.length; updateRiviera(); };
    updateRiviera();

    // Карусель Музей
    const musImages = ["24.jpg", "25.jpg", "26.jpg", "27.jpg"];
    let mIdx = 0;
    const mImg = document.getElementById('museum90Img');
    function updateMuseum() { if(mImg) mImg.src = "Img.Sochi/" + musImages[mIdx]; }
    const prevMus = document.getElementById('prevMuseumBtn');
    const nextMus = document.getElementById('nextMuseumBtn');
    if(prevMus) prevMus.onclick = () => { mIdx = (mIdx - 1 + musImages.length) % musImages.length; updateMuseum(); };
    if(nextMus) nextMus.onclick = () => { mIdx = (mIdx + 1) % musImages.length; updateMuseum(); };
    updateMuseum();

    // Музыка
    const musicBtn = document.getElementById('photoMusicBtn');
    const musicState = document.getElementById('photoMusicState');
    const audio = document.getElementById('sochiMusic');
    let isPlaying = false;
    if(musicBtn && audio) {
        musicBtn.onclick = () => {
            if(isPlaying) { audio.pause(); musicState.textContent = '▶'; isPlaying = false; }
            else { audio.play().catch(()=>{}); musicState.textContent = '⏸'; isPlaying = true; }
        };
    }

    // Тема
    function applyTheme(t) {
        const icon = document.getElementById('themeIcon');
        const text = document.getElementById('themeText');
        if(t === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
            if(icon) icon.textContent = '🌙';
            if(text) text.textContent = 'Ночь';
        } else {
            document.documentElement.removeAttribute('data-theme');
            if(icon) icon.textContent = '☀️';
            if(text) text.textContent = 'День';
        }
        localStorage.setItem('siteTheme', t);
    }
    const saved = localStorage.getItem('siteTheme');
    applyTheme(saved === 'dark' ? 'dark' : 'light');
    const themeBtn = document.getElementById('theme-toggle');
    if(themeBtn) themeBtn.onclick = () => {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        applyTheme(isDark ? 'light' : 'dark');
    };

    // Погода и время (упрощённо)
    const timeSpan = document.getElementById('st-time-txt');
    if(timeSpan) {
        timeSpan.textContent = new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'});
        setInterval(() => { timeSpan.textContent = new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'}); }, 60000);
    }

    // Модалка
    const modal = document.getElementById('choiceModal');
    const openBtn = document.getElementById('openChoiceBtn');
    if(openBtn && modal) openBtn.onclick = () => modal.classList.add('active');
    if(modal) modal.onclick = (e) => { if(e.target === modal) modal.classList.remove('active'); };
    const backBtn = document.getElementById('backToMainModalBtn');
    if(backBtn) backBtn.onclick = () => window.location.href = '../Index/Index.html';
    const roza = document.getElementById('rozaCard');
    const sirius = document.getElementById('siriusCard');
    if(roza) roza.onclick = () => window.location.href = '../Roza/Roza.html';
    if(sirius) sirius.onclick = () => window.location.href = '../Sirius/Sirius.html';

    // Мобильное меню
    const menuBtn = document.getElementById('mobileMenuBtn');
    const overlay = document.getElementById('mobileMenuOverlay');
    const closeBtn = document.getElementById('mobileMenuClose');
    if(menuBtn && overlay) menuBtn.onclick = () => overlay.classList.add('active');
    if(closeBtn && overlay) closeBtn.onclick = () => overlay.classList.remove('active');
    if(overlay) overlay.onclick = (e) => { if(e.target === overlay) overlay.classList.remove('active'); };
})();
'use strict';

/* ══════════════════════════════════════════════════════════════════════
   main.js — Gallery rendering + Lightbox only.

   Everything else (loader, AOS, navbar, music, cursor, countdown,
   ticker, GSAP, RSVP, Wishes) is handled directly in index.html
   so that a single HTML page manages the full lifecycle with no
   cross-page audio interruption.
   ══════════════════════════════════════════════════════════════════════ */

/* ─── GALLERY ────────────────────────────────────────────────────────── */
window.weddingPhotos = window.weddingPhotos || [];
var lbPool = [], lbIdx = 0;

window.renderMainGallery = function (tab) {
  tab = tab || 'all';
  var grid    = document.getElementById('mainGalleryGrid');
  var countEl = document.getElementById('galleryPhotoCount');
  if (!grid) return;

  var all    = window.weddingPhotos || [];
  var photos = tab === 'all'    ? all
             : tab === 'couple' ? all.filter(function(p){ return p.type === 'couple'; })
             : tab === 'guest'  ? all.filter(function(p){ return p.type === 'guest'; })
             : all;

  lbPool = photos;

  if (!photos.length) {
    if (countEl) countEl.style.display = 'none';
    grid.innerHTML = '<div class="g-empty"><i class="fas fa-heart"></i><p>Photos will appear here as they\'re added</p><span>Check back after the wedding day!</span></div>';
    return;
  }

  var CAT = { memories:'💕 Memories', prenup:'📸 Pre-Nup', proposal:'💍 Proposal', travels:'✈️ Travels', everyday:'💛 Everyday', wedding:'🌸 Wedding' };

  if (countEl) {
    countEl.style.display = 'block';
    countEl.innerHTML = '<i class="fas fa-images"></i> ' + photos.length + ' photo' + (photos.length > 1 ? 's' : '') + ' in gallery';
  }

  grid.innerHTML = photos.map(function(p, i) {
    return '<div class="g-item ' + p.type + '-photo" onclick="openMainLb(' + i + ')">' +
      '<img src="' + escHtml(p.url) + '" alt="" loading="lazy">' +
      '<div class="g-overlay">' +
        '<div class="overlay-label">' + (p.type === 'guest' ? '📸 ' + escHtml(p.guestName || 'Guest') : (CAT[p.category] || '💕 Memory')) + '</div>' +
        (p.caption ? '<div class="overlay-sub">' + escHtml(p.caption) + '</div>' : '') +
        '<div class="overlay-icons"><div class="ov-icon"><i class="fas fa-search-plus"></i></div><div class="ov-icon"><i class="fas fa-heart"></i></div></div>' +
      '</div></div>';
  }).join('');
};

/* ─── LIGHTBOX ───────────────────────────────────────────────────────── */
window.openMainLb = function (i) {
  lbIdx = i;
  updateLb();
  document.getElementById('lightbox').classList.add('active');
  document.body.style.overflow = 'hidden';
};

window.closeLightbox = function () {
  document.getElementById('lightbox').classList.remove('active');
  document.body.style.overflow = '';
};

function updateLb() {
  if (!lbPool.length) return;
  var p   = lbPool[lbIdx];
  var img = document.getElementById('lightbox-img');
  img.style.opacity = '0';
  setTimeout(function() {
    img.src = p.url;
    img.style.opacity    = '1';
    img.style.transition = 'opacity .3s';
    var info    = document.getElementById('lbInfo');
    var counter = document.getElementById('lbCounter');
    if (info)    info.textContent    = p.type === 'guest' ? ('📸 ' + (p.guestName || 'Guest')) : (p.caption || '');
    if (counter) counter.textContent = (lbIdx + 1) + ' / ' + lbPool.length;
  }, 150);
}

/* Wire lightbox controls — safe to run immediately since scripts load after DOM */
(function() {
  var prev = document.getElementById('lbPrev');
  var next = document.getElementById('lbNext');
  var lb   = document.getElementById('lightbox');

  if (prev) prev.addEventListener('click', function(e) { e.stopPropagation(); lbIdx = (lbIdx - 1 + lbPool.length) % lbPool.length; updateLb(); });
  if (next) next.addEventListener('click', function(e) { e.stopPropagation(); lbIdx = (lbIdx + 1) % lbPool.length; updateLb(); });
  if (lb)   lb.addEventListener('click', function(e)   { if (e.target === this) closeLightbox(); });

  document.addEventListener('keydown', function(e) {
    if (!lb || !lb.classList.contains('active')) return;
    if (e.key === 'Escape')     closeLightbox();
    if (e.key === 'ArrowLeft')  { lbIdx = (lbIdx - 1 + lbPool.length) % lbPool.length; updateLb(); }
    if (e.key === 'ArrowRight') { lbIdx = (lbIdx + 1) % lbPool.length; updateLb(); }
  });
})();

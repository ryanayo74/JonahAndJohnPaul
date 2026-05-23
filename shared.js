/**
 * shared.js — Firebase initialisation + shared UI utilities
 */

/* ─── Firebase config ─────────────────────────────────────────────────── */
const FIREBASE_CONFIG = {
  apiKey:            "AIzaSyCwVfo4WCKON-kyBj310ANA9HxHOrRF3f8",
  authDomain:        "weeding-database.firebaseapp.com",
  projectId:         "weeding-database",
  storageBucket:     "weeding-database.firebasestorage.app",
  messagingSenderId: "27469893127",
  appId:             "1:27469893127:web:7bd5ad9a556fc5f30d24a2",
  measurementId:     "G-HZN23Y3ZKB"
};

/* ─── Bootstrap Firebase ────────────────────────────────────────────────── */
(function initFirebase() {
  if (typeof firebase === 'undefined') {
    console.error('[shared.js] Firebase SDK not loaded before shared.js');
    return;
  }
  if (!firebase.apps.length) {
    firebase.initializeApp(FIREBASE_CONFIG);
  }
  window.db = firebase.firestore();
})();

/* ─── Firestore collection helpers ──────────────────────────────────────── */
window.FS = {
  photos: () => window.db.collection('photos'),
  wishes: () => window.db.collection('wishes'),
  rsvps:  () => window.db.collection('rsvps'),
};

/* ─── Shared toast notification ─────────────────────────────────────────── */
window.showToast = function(msg, type = 'blue') {
  let toast = document.getElementById('globalToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'globalToast';
    toast.style.cssText = `
      position:fixed;bottom:28px;right:28px;
      padding:16px 28px;border-radius:16px;
      font-family:'Raleway',sans-serif;font-size:.88rem;font-weight:600;
      display:flex;align-items:center;gap:10px;
      transform:translateY(120px);opacity:0;
      transition:all .45s cubic-bezier(.175,.885,.32,1.275);
      z-index:99999;pointer-events:none;
      box-shadow:0 10px 40px rgba(0,0,0,.2);
    `;
    document.body.appendChild(toast);
  }
  toast.style.background = type === 'gold'
    ? 'linear-gradient(135deg,#c8a040,#f8edc8)'
    : 'linear-gradient(135deg,#122944,#2d78c0)';
  toast.style.color = 'white';
  toast.innerHTML   = `<i class="fas fa-heart"></i><span>${msg}</span>`;
  toast.style.transform = 'translateY(0)';
  toast.style.opacity   = '1';
  clearTimeout(window._toastTimer);
  window._toastTimer = setTimeout(() => {
    toast.style.transform = 'translateY(120px)';
    toast.style.opacity   = '0';
  }, 3800);
};

/* ─── Shared petal generator ─────────────────────────────────────────────── */
window.spawnPetals = function(containerId, count = 18) {
  const c = document.getElementById(containerId);
  if (!c) return;
  const colors = ['#7ec0e0','#4a9fd4','#b4d8ee','#2d78c0','#d8eef8','#edf6fb'];
  for (let i = 0; i < count; i++) {
    const p    = document.createElement('div');
    const size = 10 + Math.random() * 18;
    p.style.cssText = `
      position:absolute;top:-60px;
      left:${Math.random() * 100}%;
      width:${size}px;height:${size}px;
      border-radius:${Math.random() > .5 ? '0% 100% 0% 100%' : '100% 0% 100% 0%'};
      background:radial-gradient(ellipse,${colors[Math.floor(Math.random() * colors.length)]} 0%,transparent 100%);
      opacity:${0.2 + Math.random() * .45};
      animation:fall ${7 + Math.random() * 10}s linear ${Math.random() * 12}s infinite;
      pointer-events:none;
    `;
    c.appendChild(p);
  }
};

/* ─── HTML escape helper ─────────────────────────────────────────────────── */
window.escHtml = function(s) {
  return String(s).replace(/[&<>"']/g, c =>
    ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":"&#039;" }[c])
  );
};

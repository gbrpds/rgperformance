/* ─────────────────────────────────────────
   Gabriel Pereira dos Santos — Portfolio
   ───────────────────────────────────────── */

// ── Custom Cursor ──────────────────────────────────────
const cursor    = document.getElementById('cursor');
const cursorDot = document.getElementById('cursorDot');

if (cursor && cursorDot) {
  let mouseX = -100, mouseY = -100;
  let posX   = -100, posY   = -100;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.left = `${mouseX}px`;
    cursorDot.style.top  = `${mouseY}px`;
    cursor.classList.remove('hidden');
  });

  document.addEventListener('mouseleave', () => cursor.classList.add('hidden'));

  (function animateCursor() {
    posX += (mouseX - posX) * 0.1;
    posY += (mouseY - posY) * 0.1;
    cursor.style.left = `${posX}px`;
    cursor.style.top  = `${posY}px`;
    requestAnimationFrame(animateCursor);
  })();

  const hoverTargets = 'a, button, .service-item, .work-card, .tool-tag';
  document.querySelectorAll(hoverTargets).forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
  });
}


// ── Live BRT clock ─────────────────────────────────────
const clockEl = document.getElementById('navClock');

function updateClock() {
  const now = new Date();
  // BRT = UTC-3
  const brt = new Date(now.toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }));
  const hh  = String(brt.getHours()).padStart(2, '0');
  const mm  = String(brt.getMinutes()).padStart(2, '0');
  const ss  = String(brt.getSeconds()).padStart(2, '0');
  if (clockEl) clockEl.textContent = `BRT ${hh}:${mm}:${ss}`;
}

updateClock();
setInterval(updateClock, 1000);


// ── Navbar scroll state ────────────────────────────────
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 16);
}, { passive: true });


// ── Scroll reveal ──────────────────────────────────────
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('revealed');
    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0.1, rootMargin: '0px 0px -48px 0px' });

document.querySelectorAll('[data-reveal]').forEach(el => revealObserver.observe(el));


// ── Hero reveal on load ────────────────────────────────
function heroReveal() {
  document.querySelectorAll('.hero [data-reveal]').forEach(el => {
    const delay = parseInt(el.dataset.revealDelay || '0');
    setTimeout(() => el.classList.add('revealed'), delay + 80);
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', heroReveal);
} else {
  heroReveal();
}


// ── Smooth scroll ──────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

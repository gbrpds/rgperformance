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

  const hoverTargets = 'a, button, .service-item, .work-card, .tool-tag, .nav-link';
  document.querySelectorAll(hoverTargets).forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
  });
}


// ── Cursor glow (body::after tracks the mouse) ─────────
document.addEventListener('mousemove', e => {
  document.documentElement.style.setProperty('--cx', `${e.clientX}px`);
  document.documentElement.style.setProperty('--cy', `${e.clientY}px`);
  document.body.classList.add('cursor-active');
});
document.addEventListener('mouseleave', () => {
  document.body.classList.remove('cursor-active');
});


// ── Live BRT clock ─────────────────────────────────────
const clockEl = document.getElementById('navClock');

function updateClock() {
  const brt = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }));
  const hh  = String(brt.getHours()).padStart(2, '0');
  const mm  = String(brt.getMinutes()).padStart(2, '0');
  const ss  = String(brt.getSeconds()).padStart(2, '0');
  if (clockEl) clockEl.textContent = `BRT ${hh}:${mm}:${ss}`;
}
updateClock();
setInterval(updateClock, 1000);


// ── Navbar scroll ──────────────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 16);
}, { passive: true });


// ── Hero blur + scale on scroll ────────────────────────
// The hero is position:fixed; sections slide over it.
// As user scrolls, the hero content blurs and scales down.
const heroEl = document.querySelector('.hero');
let rafHero  = false;

function updateHero() {
  const scrollY = window.scrollY;
  const vph     = window.innerHeight;

  // Blur starts at 20% of viewport, fully blurred at 80%
  const progress = Math.max(0, Math.min(1, (scrollY - vph * 0.18) / (vph * 0.6)));

  if (progress === 0) {
    heroEl.style.filter    = '';
    heroEl.style.transform = '';
    heroEl.style.opacity   = '';
  } else {
    heroEl.style.filter    = `blur(${progress * 22}px)`;
    heroEl.style.transform = `scale(${1 - progress * 0.055})`;
    heroEl.style.opacity   = `${1 - progress * 0.45}`;
  }

  rafHero = false;
}

window.addEventListener('scroll', () => {
  if (!rafHero) {
    rafHero = true;
    requestAnimationFrame(updateHero);
  }
}, { passive: true });


// ── Scroll reveal (IntersectionObserver) ───────────────
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('revealed');
    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

// Observe both [data-reveal] and [data-reveal="slide-x"]
document.querySelectorAll('[data-reveal]').forEach(el => revealObserver.observe(el));


// ── Hero reveal on page load ───────────────────────────
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


// ── Page transition helper ─────────────────────────────
function navigateTo(url) {
  document.body.classList.add('page-exit');
  setTimeout(() => { window.location.href = url; }, 540);
}


// ── Work card clicks → page exit transition ────────────
document.querySelectorAll('a.work-card').forEach(card => {
  card.addEventListener('click', e => {
    e.preventDefault();
    navigateTo(card.href);
  });
});


// ── Back link on work pages ────────────────────────────
const backLink = document.getElementById('backLink');
if (backLink) {
  backLink.addEventListener('click', e => {
    e.preventDefault();
    navigateTo(backLink.href);
  });
}


// ── Reel filmstrip — JS-driven continuous scroll ───────
(function initReel() {
  const strip = document.querySelector('.reel-strip');
  if (!strip) return;

  let pos = 0;
  const SPEED = 0.55; // px per frame (~33 px/s at 60 fps)

  function halfWidth() {
    return strip.scrollWidth / 2;
  }

  (function tick() {
    pos += SPEED;
    const hw = halfWidth();
    if (pos >= hw) pos -= hw;
    strip.style.transform = `translateX(-${pos}px)`;
    requestAnimationFrame(tick);
  })();

  const btnPrev = document.querySelector('.reel-btn--prev');
  const btnNext = document.querySelector('.reel-btn--next');

  function nudge(delta) {
    const hw = halfWidth();
    pos = ((pos + delta) % hw + hw) % hw;
  }

  if (btnPrev) btnPrev.addEventListener('click', () => nudge(-330));
  if (btnNext) btnNext.addEventListener('click', () => nudge(330));
})();


// ── Instagram-like Carousel ────────────────────────────
(function initCarousels() {
  document.querySelectorAll('.carousel').forEach(function (carousel) {
    const track   = carousel.querySelector('.carousel-track');
    const slides  = Array.from(carousel.querySelectorAll('.carousel-slide'));
    const dots    = Array.from(carousel.querySelectorAll('.carousel-dot'));
    const counter = carousel.querySelector('.carousel-counter');
    const total   = slides.length;
    let current   = 0;

    function activateVideo(slide) {
      const iframe = slide.querySelector('iframe[data-src]');
      if (iframe) { iframe.src = iframe.dataset.src; iframe.removeAttribute('data-src'); }
    }
    function deactivateVideo(slide) {
      const iframe = slide.querySelector('iframe');
      if (iframe && iframe.src) { iframe.dataset.src = iframe.src; iframe.src = ''; }
    }

    function goTo(idx) {
      deactivateVideo(slides[current]);
      current = (idx + total) % total;
      track.style.transform = `translateX(-${current * 100}%)`;
      dots.forEach((d, i) => d.classList.toggle('active', i === current));
      if (counter) counter.textContent = `${current + 1} / ${total}`;
      activateVideo(slides[current]);
    }

    carousel.querySelector('.carousel-btn--prev').addEventListener('click', function (e) { e.stopPropagation(); goTo(current - 1); });
    carousel.querySelector('.carousel-btn--next').addEventListener('click', function (e) { e.stopPropagation(); goTo(current + 1); });
    dots.forEach(function (dot, i) { dot.addEventListener('click', function () { goTo(i); }); });

    // Touch / pointer drag
    let startX = 0, isDragging = false;
    track.addEventListener('pointerdown', function (e) { startX = e.clientX; isDragging = true; carousel.classList.add('is-dragging'); track.setPointerCapture(e.pointerId); });
    track.addEventListener('pointerup',   function (e) { if (!isDragging) return; isDragging = false; carousel.classList.remove('is-dragging'); const diff = e.clientX - startX; if (Math.abs(diff) > 40) goTo(diff < 0 ? current + 1 : current - 1); });
    track.addEventListener('pointermove', function (e) { /* captured — no default scroll interference */ });
  });
})();

// ── Smooth scroll for anchor links ────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const id     = anchor.getAttribute('href');
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

/* ─────────────────────────────────────────
   RG Performance — Main JS
   ───────────────────────────────────────── */

// ── Navbar scroll state ──
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 20) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}, { passive: true });

// ── Reveal on load ──
function revealElements() {
  const els = document.querySelectorAll('[data-reveal]');
  els.forEach((el, i) => {
    const delay = el.dataset.revealDelay ? parseInt(el.dataset.revealDelay) : i * 80;
    setTimeout(() => el.classList.add('revealed'), delay + 120);
  });
}

document.addEventListener('DOMContentLoaded', revealElements);

// ── Smooth scroll for nav links ──
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

/* ─────────────────────────────────────────
   Gabriel Pereira dos Santos — Portfolio
   v1.0
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


// ── Hero scroll effect ─────────────────────────────────
// Desktop: blur + scale + fade. Mobile/touch: opacity-only —
// applying filter to position:fixed causes iOS rendering glitches.
const heroEl     = document.querySelector('.hero');
const isTouch    = window.matchMedia('(pointer: coarse)').matches;

function updateHero() {
  const scrollY  = window.scrollY;
  const vph      = window.innerHeight;
  const progress = Math.max(0, Math.min(1, scrollY / vph));

  if (progress === 0) {
    heroEl.style.filter    = '';
    heroEl.style.transform = '';
    heroEl.style.opacity   = '';
  } else if (isTouch) {
    heroEl.style.opacity   = `${1 - progress * 0.75}`;
  } else {
    heroEl.style.filter    = `blur(${progress * 22}px)`;
    heroEl.style.transform = `scale(${1 - progress * 0.055})`;
    heroEl.style.opacity   = `${1 - progress * 0.45}`;
  }
}

// RAF loop — throttled: only runs updateHero when scrollY actually changed
let _lastScrollY = -1;
(function heroLoop() {
  const sy = window.scrollY;
  if (sy !== _lastScrollY) { _lastScrollY = sy; updateHero(); }
  requestAnimationFrame(heroLoop);
})();


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
  let paused = false;
  const SPEED = 0.55; // px per frame (~33 px/s at 60 fps)

  function halfWidth() {
    return strip.scrollWidth / 2;
  }

  (function tick() {
    if (!paused) {
      pos += SPEED;
      const hw = halfWidth();
      if (pos >= hw) pos -= hw;
      strip.style.transform = `translateX(-${pos}px)`;
    }
    requestAnimationFrame(tick);
  })();

  const viewport = document.querySelector('.reel-viewport');
  if (viewport) {
    viewport.addEventListener('mouseenter', () => { paused = true; });
    viewport.addEventListener('mouseleave', () => { paused = false; });

    // Touch drag — lets mobile users swipe the filmstrip
    let touchStartX = 0;
    let touchStartPos = 0;

    viewport.addEventListener('touchstart', e => {
      touchStartX   = e.touches[0].clientX;
      touchStartPos = pos;
      paused = true;
    }, { passive: true });

    viewport.addEventListener('touchmove', e => {
      const delta = touchStartX - e.touches[0].clientX;
      const hw = halfWidth();
      pos = ((touchStartPos + delta) % hw + hw) % hw;
      strip.style.transform = `translateX(-${pos}px)`;
    }, { passive: true });

    viewport.addEventListener('touchend', () => {
      paused = false;
    }, { passive: true });
  }

  const btnPrev = document.querySelector('.reel-btn--prev');
  const btnNext = document.querySelector('.reel-btn--next');

  function nudge(delta) {
    const hw = halfWidth();
    pos = ((pos + delta) % hw + hw) % hw;
    strip.style.transform = `translateX(-${pos}px)`;
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
      if (slide.querySelector('.yt-embed')) return; // handled by custom player
      const iframe = slide.querySelector('iframe[data-src]');
      if (iframe) { iframe.src = iframe.dataset.src; iframe.removeAttribute('data-src'); }
    }
    function deactivateVideo(slide) {
      const embed = slide.querySelector('.yt-embed');
      if (embed && window._ytPlayers) {
        const p = window._ytPlayers[embed.id];
        if (p && p.pauseVideo) { try { p.pauseVideo(); } catch (e) {} }
        return;
      }
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

// ── Reel video modal ──────────────────────────────────
(function initReelModal() {
  const modal    = document.getElementById('reelModal');
  const iframe   = document.getElementById('reelModalIframe');
  const closeBtn = document.getElementById('reelModalClose');
  const backdrop = document.getElementById('reelModalBackdrop');
  if (!modal) return;

  function openModal(videoId) {
    iframe.src = 'https://www.youtube-nocookie.com/embed/' + videoId + '?autoplay=1&rel=0&modestbranding=1&color=white';
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    iframe.src = '';
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.reel-item[data-video-id]').forEach(function (item) {
    item.addEventListener('click', function () { openModal(item.dataset.videoId); });
  });

  closeBtn.addEventListener('click', closeModal);
  backdrop.addEventListener('click', closeModal);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeModal(); });
})();


// ── Work grid "ver mais" — shows hidden cards above LIMIT ─────
(function initWorkMore() {
  const grid = document.querySelector('.work-grid');
  const wrap = document.getElementById('workMoreWrap');
  const btn  = document.getElementById('workLoadMore');
  if (!grid || !wrap || !btn) return;

  const LIMIT = 6;
  const cards = Array.from(grid.querySelectorAll('.work-card'));

  if (cards.length <= LIMIT) {
    wrap.style.display = 'none';
    return;
  }

  cards.slice(LIMIT).forEach(c => c.classList.add('work-card--hidden'));

  btn.addEventListener('click', () => {
    grid.querySelectorAll('.work-card--hidden').forEach(c => c.classList.remove('work-card--hidden'));
    wrap.style.display = 'none';
  });
})();


// ── Work pages: "Mais Projetos" ver-mais button ────────
(function initMoreProjects() {
  const wrap = document.getElementById('moreProjectsWrap');
  const btn  = document.getElementById('moreProjectsBtn');
  if (!wrap || !btn) return;

  const grid = wrap.previousElementSibling;
  if (!grid) return;

  const isMobile = window.matchMedia('(max-width: 640px)').matches;
  const LIMIT    = isMobile ? 4 : 3;
  const cards    = Array.from(grid.querySelectorAll('.work-card'));

  if (cards.length <= LIMIT) { wrap.style.display = 'none'; return; }

  cards.slice(LIMIT).forEach(c => c.classList.add('work-card--hidden'));

  btn.addEventListener('click', () => {
    grid.querySelectorAll('.work-card--hidden').forEach(c => c.classList.remove('work-card--hidden'));
    wrap.style.display = 'none';
  });
})();


// ── Sticky back button on work pages ─────────────────
(function initStickyBack() {
  const btn     = document.getElementById('stickyBack');
  const spacer  = document.querySelector('.hero-spacer');
  if (!btn || !spacer) return;

  const obs = new IntersectionObserver(entries => {
    btn.classList.toggle('is-visible', !entries[0].isIntersecting);
  }, { threshold: 0 });

  obs.observe(spacer);
})();


// ── Custom YouTube Player (Shorts + carousel video slides) ──
(function initYTPlayers() {
  function isYT(src) { return src && src.includes('youtube'); }

  const shorts = Array.from(document.querySelectorAll('.shorts-item'));
  const carouselSlides = Array.from(document.querySelectorAll('.carousel-slide')).filter(function (s) {
    const f = s.querySelector('iframe');
    return f && isYT(f.src || f.dataset.src || '');
  });
  const items = shorts.concat(carouselSlides);
  if (!items.length) return;

  window._ytPlayers = {};
  const timers = {};

  function buildHTML(vid, pid) {
    return (
      '<div class="yt-thumb">' +
        '<img src="https://i.ytimg.com/vi/' + vid + '/maxresdefault.jpg"' +
          ' onerror="this.src=\'https://i.ytimg.com/vi/' + vid + '/hqdefault.jpg\'"' +
          ' alt="" loading="lazy">' +
        '<button class="yt-big-play" aria-label="Reproduzir">' +
          '<svg width="18" height="18" viewBox="0 0 18 18" fill="none">' +
            '<path d="M4 2.5L15.5 9L4 15.5V2.5Z" fill="currentColor"/>' +
          '</svg>' +
        '</button>' +
      '</div>' +
      '<div class="yt-embed" id="' + pid + '"></div>' +
      '<div class="yt-bar">' +
        '<button class="yt-pp" aria-label="Play/Pause">' +
          '<svg class="ic-play" width="13" height="13" viewBox="0 0 13 13" fill="none">' +
            '<path d="M3 1.5L11.5 6.5L3 11.5V1.5Z" fill="currentColor"/>' +
          '</svg>' +
          '<svg class="ic-pause" width="13" height="13" viewBox="0 0 13 13" fill="none">' +
            '<rect x="2" y="1.5" width="3.5" height="10" rx="1" fill="currentColor"/>' +
            '<rect x="7.5" y="1.5" width="3.5" height="10" rx="1" fill="currentColor"/>' +
          '</svg>' +
        '</button>' +
        '<div class="yt-scrub">' +
          '<div class="yt-wave"></div>' +
          '<div class="yt-rail">' +
            '<div class="yt-done"></div>' +
            '<div class="yt-head"><span class="yt-cur">00:00</span></div>' +
          '</div>' +
          '<span class="yt-t0">00:00</span>' +
          '<span class="yt-t1">--:--</span>' +
        '</div>' +
        '<div class="yt-vol">' +
          '<button class="yt-mute" aria-label="Volume">' +
            '<svg class="ic-vol" width="14" height="14" viewBox="0 0 14 14" fill="none">' +
              '<path d="M2 5h3l4-3v10L5 9H2V5z" fill="currentColor"/>' +
              '<path d="M10.5 5.5a2.5 2.5 0 0 1 0 3" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>' +
            '</svg>' +
            '<svg class="ic-muted" width="14" height="14" viewBox="0 0 14 14" fill="none">' +
              '<path d="M2 5h3l4-3v10L5 9H2V5z" fill="currentColor"/>' +
              '<path d="M10.5 5.5 12 7m0 0 1.5-1.5M12 7l1.5 1.5M12 7l-1.5 1.5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>' +
            '</svg>' +
          '</button>' +
          '<input type="range" class="yt-vol-slider" min="0" max="100" value="100" aria-label="Volume">' +
        '</div>' +
      '</div>'
    );
  }

  // ── Transform items ────────────────────────────────────
  items.forEach(function (item, idx) {
    const iframe = item.querySelector('iframe');
    if (!iframe) return;
    const src   = iframe.src || iframe.dataset.src || '';
    const match = src.match(/embed\/([^?&]+)/);
    if (!match) return;

    const vid = match[1];
    const pid = 'ytpl-' + idx;
    item.dataset.pid  = pid;
    item.dataset.vid  = vid;
    item._pendingPlay = false;

    if (item.classList.contains('carousel-slide')) {
      item.style.position = 'relative';
      item.style.overflow = 'hidden';
    }

    item.innerHTML = buildHTML(vid, pid);

    // Waveform bars — seeded by video ID for a consistent look
    const wave = item.querySelector('.yt-wave');
    let seed = 0;
    for (let c = 0; c < vid.length; c++) seed = (seed * 31 + vid.charCodeAt(c)) & 0x7fffffff;
    for (let i = 0; i < 44; i++) {
      const bar = document.createElement('div');
      bar.className = 'yt-wb';
      const t = i / 44;
      const h = 18 +
        Math.abs(Math.sin(seed * 0.003 + t * 11.3)) * 32 +
        Math.abs(Math.sin(seed * 0.007 + t * 23.7)) * 22 +
        Math.abs(Math.sin(seed * 0.013 + t * 41.1)) * 14;
      bar.style.height = Math.min(96, Math.max(8, h)) + '%';
      wave.appendChild(bar);
    }

    // Large play button
    item.querySelector('.yt-big-play').addEventListener('click', function () {
      const p = window._ytPlayers[pid];
      if (p && p.playVideo) {
        p.playVideo();
      } else {
        item._pendingPlay = true;
        if (window.YT && window.YT.Player) createPlayer(item);
      }
      item.querySelector('.yt-thumb').classList.add('gone');
    });

    // Mini play/pause
    item.querySelector('.yt-pp').addEventListener('click', function () {
      const p = window._ytPlayers[pid];
      if (!p) return;
      if (p.getPlayerState() === YT.PlayerState.PLAYING) {
        p.pauseVideo();
      } else {
        p.playVideo();
        item.querySelector('.yt-thumb').classList.add('gone');
      }
    });

    // Scrubber seek
    const scrub = item.querySelector('.yt-scrub');
    scrub.addEventListener('click', function (e) {
      const p = window._ytPlayers[pid];
      if (!p) return;
      const r     = scrub.getBoundingClientRect();
      const ratio = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width));
      const dur   = p.getDuration() || 0;
      if (dur) { p.seekTo(ratio * dur, true); setProgress(item, ratio, ratio * dur); }
    });

    // Volume
    const muteBtn   = item.querySelector('.yt-mute');
    const volSlider = item.querySelector('.yt-vol-slider');

    muteBtn.addEventListener('click', function () {
      const p = window._ytPlayers[pid];
      if (!p) return;
      if (p.isMuted()) {
        p.unMute(); p.setVolume(parseInt(volSlider.value) || 100);
        muteBtn.classList.remove('muted');
      } else {
        p.mute();
        muteBtn.classList.add('muted');
      }
    });

    volSlider.addEventListener('input', function () {
      const p = window._ytPlayers[pid];
      if (!p) return;
      const vol = parseInt(volSlider.value);
      p.setVolume(vol);
      if (vol === 0) { p.mute(); muteBtn.classList.add('muted'); }
      else           { p.unMute(); muteBtn.classList.remove('muted'); }
    });
  });

  // ── Load YouTube IFrame API ────────────────────────────
  function loadAPI() {
    if (document.querySelector('script[src*="youtube.com/iframe_api"]')) return;
    const s = document.createElement('script');
    s.src = 'https://www.youtube.com/iframe_api';
    document.head.appendChild(s);
  }

  if (window.YT && window.YT.Player) {
    initAll();
  } else {
    const _prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = function () {
      if (typeof _prev === 'function') _prev();
      initAll();
    };
    loadAPI();
  }

  function createPlayer(item) {
    const pid = item.dataset.pid;
    const vid = item.dataset.vid;
    if (!pid || !vid || window._ytPlayers[pid]) return;

    window._ytPlayers[pid] = new YT.Player(pid, {
      videoId: vid,
      playerVars: {
        controls: 0, rel: 0, modestbranding: 1,
        playsinline: 1, iv_load_policy: 3, disablekb: 1, fs: 0,
      },
      events: {
        onReady: function (e) {
          const dur = e.target.getDuration();
          item.querySelector('.yt-t1').textContent = fmt(dur);
          if (item._pendingPlay) { e.target.playVideo(); item._pendingPlay = false; }
        },
        onStateChange: function (e) { handleState(item, pid, window._ytPlayers[pid], e.data); },
      },
    });
  }

  // Shorts: eager init. Carousel slides: lazy (on first play click).
  function initAll() {
    items.forEach(function (item) {
      if (item.classList.contains('shorts-item')) createPlayer(item);
    });
  }

  window._ytCreatePlayer = createPlayer; // exposed for external use

  function handleState(item, pid, player, state) {
    const pp = item.querySelector('.yt-pp');
    clearInterval(timers[pid]);
    if (state === YT.PlayerState.PLAYING) {
      pp.classList.add('playing');
      timers[pid] = setInterval(function () {
        const cur = player.getCurrentTime();
        const dur = player.getDuration() || 1;
        setProgress(item, cur / dur, cur);
      }, 200);
    } else {
      pp.classList.remove('playing');
      if (state === YT.PlayerState.ENDED) {
        setProgress(item, 0, 0);
        item.querySelector('.yt-thumb').classList.remove('gone');
      }
    }
  }

  function setProgress(item, ratio, cur) {
    item.querySelector('.yt-done').style.width = (ratio * 100) + '%';
    item.querySelector('.yt-head').style.left  = (ratio * 100) + '%';
    const curStr = fmt(cur || 0);
    item.querySelector('.yt-cur').textContent  = curStr;
    item.querySelector('.yt-t0').textContent   = curStr;
    const bars = item.querySelectorAll('.yt-wb');
    const n    = Math.floor(ratio * bars.length);
    bars.forEach(function (b, i) { b.classList.toggle('on', i < n); });
  }

  function fmt(s) {
    if (!s || isNaN(s)) return '00:00';
    s = Math.floor(s);
    return String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0');
  }
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

/* ─────────────────────────────────────────
   Gabriel Pereira dos Santos — Portfolio
   v1.0
   ───────────────────────────────────────── */

// ── Page edge vignette (top fade via body::before, bottom via div) ──
(function () {
  const el = document.createElement('div');
  el.className = 'page-vignette-bottom';
  document.body.appendChild(el);
})();


// ── Cursor glow (body::after tracks the mouse) ─────────
let _glowRaf = false, _glowX = 0, _glowY = 0;
document.addEventListener('mousemove', e => {
  _glowX = e.clientX; _glowY = e.clientY;
  if (_glowRaf) return;
  _glowRaf = true;
  requestAnimationFrame(() => {
    document.documentElement.style.setProperty('--cx', `${_glowX}px`);
    document.documentElement.style.setProperty('--cy', `${_glowY}px`);
    document.body.classList.add('cursor-active');
    _glowRaf = false;
  });
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

let _lastScrollY = -1, _heroRafId = null, _heroVisible = true;
function heroLoop() {
  if (!_heroVisible) { _heroRafId = null; return; }
  const sy = window.scrollY;
  if (sy !== _lastScrollY) { _lastScrollY = sy; updateHero(); }
  _heroRafId = requestAnimationFrame(heroLoop);
}
if (heroEl) {
  new IntersectionObserver(entries => {
    _heroVisible = entries[0].isIntersecting;
    if (_heroVisible && !_heroRafId) heroLoop();
    else if (!_heroVisible) updateHero();
  }, { threshold: 0 }).observe(heroEl);
  heroLoop();
}


// ── Scroll reveal (IntersectionObserver) ───────────────
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('revealed');
    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

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
  let stopped = false; // set permanently once a user opens a video
  const SPEED = 0.18;  // px per frame — slow, cinematic drift

  function halfWidth() {
    return strip.scrollWidth / 2;
  }

  let _reelRafId = null, _reelVisible = false;
  function tick() {
    if (!_reelVisible) { _reelRafId = null; return; }
    if (!paused && !stopped) {
      pos += SPEED;
      const hw = halfWidth();
      if (pos >= hw) pos -= hw;
      strip.style.transform = `translateX(-${pos}px)`;
    }
    _reelRafId = requestAnimationFrame(tick);
  }
  new IntersectionObserver(entries => {
    _reelVisible = entries[0].isIntersecting;
    if (_reelVisible && !_reelRafId) tick();
  }, { threshold: 0 }).observe(strip.parentElement || strip);

  // Once a user clicks any video the strip stops moving for good
  strip.addEventListener('click', () => { stopped = true; });

  const viewport = document.querySelector('.reel-viewport');
  if (viewport) {
    viewport.addEventListener('mouseenter', () => { paused = true; });
    viewport.addEventListener('mouseleave', () => { paused = false; });

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
      if (slide.querySelector('.yt-embed')) return;
      const iframe = slide.querySelector('iframe[data-src]');
      if (iframe) { iframe.src = iframe.dataset.src; iframe.removeAttribute('data-src'); }
    }
    function deactivateVideo(slide) {
      const embed = slide.querySelector('.yt-embed');
      if (embed && window._ytPlayers) {
        const p = window._ytPlayers[embed.dataset.pid];
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

    let startX = 0, isDragging = false;
    track.addEventListener('pointerdown', function (e) { startX = e.clientX; isDragging = true; carousel.classList.add('is-dragging'); track.setPointerCapture(e.pointerId); });
    track.addEventListener('pointerup',   function (e) { if (!isDragging) return; isDragging = false; carousel.classList.remove('is-dragging'); const diff = e.clientX - startX; if (Math.abs(diff) > 40) goTo(diff < 0 ? current + 1 : current - 1); });
    track.addEventListener('pointermove', function (e) { /* captured */ });
  });
})();


// ── Reel video modal ──────────────────────────────────
(function initReelModal() {
  const modal     = document.getElementById('reelModal');
  const videoWrap = document.getElementById('reelModalVideo');
  const closeBtn  = document.getElementById('reelModalClose');
  const backdrop  = document.getElementById('reelModalBackdrop');
  if (!modal || !videoWrap) return;

  let player = null;
  let timer  = null;

  function fmt(s) {
    if (!s || isNaN(s)) return '00:00';
    s = Math.floor(s);
    return String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0');
  }

  function buildWave(container, vid) {
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
      container.appendChild(bar);
    }
  }

  function setProgress(ratio, cur) {
    videoWrap.querySelector('.yt-done').style.width = (ratio * 100) + '%';
    videoWrap.querySelector('.yt-head').style.left  = (ratio * 100) + '%';
    const curStr = fmt(cur || 0);
    videoWrap.querySelector('.yt-cur').textContent = curStr;
    videoWrap.querySelector('.yt-t0').textContent  = curStr;
    const bars = videoWrap.querySelectorAll('.yt-wb');
    const n    = Math.floor(ratio * bars.length);
    bars.forEach(function (b, i) { b.classList.toggle('on', i < n); });
  }

  function handleState(state) {
    const pp         = videoWrap.querySelector('.yt-pp');
    const pauseCover = videoWrap.querySelector('.yt-pause-cover');
    clearInterval(timer);
    if (state === 1 /* PLAYING */) {
      pp.classList.add('playing');
      if (pauseCover) pauseCover.classList.remove('active');
      timer = setInterval(function () {
        if (!player) return;
        const cur = player.getCurrentTime();
        const dur = player.getDuration() || 1;
        setProgress(cur / dur, cur);
      }, 200);
    } else {
      pp.classList.remove('playing');
      if (state === 2 /* PAUSED */) {
        if (pauseCover) pauseCover.classList.add('active');
      } else if (state === 0 /* ENDED */) {
        setProgress(0, 0);
        const thumbEl = videoWrap.querySelector('.yt-thumb');
        if (thumbEl) thumbEl.classList.remove('gone');
        if (pauseCover) pauseCover.classList.remove('active');
      }
    }
  }

  function openModal(videoId) {
    const pid = 'ytpl-modal';

    videoWrap.innerHTML =
      '<div class="yt-thumb">' +
        '<img src="https://i.ytimg.com/vi/' + videoId + '/maxresdefault.jpg"' +
          ' onerror="this.src=\'https://i.ytimg.com/vi/' + videoId + '/hqdefault.jpg\'"' +
          ' alt="" loading="lazy">' +
        '<button class="yt-big-play" aria-label="Reproduzir" tabindex="-1">' +
          '<svg width="18" height="18" viewBox="0 0 18 18" fill="none">' +
            '<path d="M4 2.5L15.5 9L4 15.5V2.5Z" fill="currentColor"/>' +
          '</svg>' +
        '</button>' +
      '</div>' +
      '<div class="yt-embed" data-pid="' + pid + '"><div id="' + pid + '"></div></div>' +
      '<div class="yt-pause-cover"></div>' +
      '<div class="yt-click-zone"></div>' +
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
        '<button class="yt-fs" aria-label="Tela cheia">' +
          '<svg class="ic-expand" width="13" height="13" viewBox="0 0 13 13" fill="none">' +
            '<path d="M1 5V1h4M8 1h4v4M12 8v4H8M5 12H1V8" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>' +
          '</svg>' +
          '<svg class="ic-compress" width="13" height="13" viewBox="0 0 13 13" fill="none">' +
            '<path d="M5 1v4H1M8 1v4h4M12 8H8v4M1 8h4v4" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>' +
          '</svg>' +
        '</button>' +
      '</div>';

    buildWave(videoWrap.querySelector('.yt-wave'), videoId);

    const thumb     = videoWrap.querySelector('.yt-thumb');
    const clickZone = videoWrap.querySelector('.yt-click-zone');
    const pp        = videoWrap.querySelector('.yt-pp');
    const scrub     = videoWrap.querySelector('.yt-scrub');
    const muteBtn   = videoWrap.querySelector('.yt-mute');
    const volSlider = videoWrap.querySelector('.yt-vol-slider');
    const fsBtn     = videoWrap.querySelector('.yt-fs');

    // Click zone — unified handler for whole video area (play + pause)
    clickZone.addEventListener('click', function () {
      if (!player) return;
      if (player.getPlayerState() === 1 /* PLAYING */) {
        player.pauseVideo();
      } else {
        player.playVideo();
        thumb.classList.add('gone');
      }
    });

    pp.addEventListener('click', function () {
      if (!player) return;
      if (player.getPlayerState() === 1 /* PLAYING */) {
        player.pauseVideo();
      } else {
        player.playVideo();
        thumb.classList.add('gone');
      }
    });

    scrub.addEventListener('click', function (e) {
      if (!player) return;
      const r     = scrub.getBoundingClientRect();
      const ratio = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width));
      const dur   = player.getDuration() || 0;
      if (dur) { player.seekTo(ratio * dur, true); setProgress(ratio, ratio * dur); }
    });

    muteBtn.addEventListener('click', function () {
      if (!player) return;
      if (player.isMuted()) {
        player.unMute(); player.setVolume(parseInt(volSlider.value) || 100);
        muteBtn.classList.remove('muted');
      } else {
        player.mute(); muteBtn.classList.add('muted');
      }
    });

    volSlider.addEventListener('input', function () {
      if (!player) return;
      const vol = parseInt(volSlider.value);
      player.setVolume(vol);
      if (vol === 0) { player.mute(); muteBtn.classList.add('muted'); }
      else           { player.unMute(); muteBtn.classList.remove('muted'); }
    });

    fsBtn.addEventListener('click', function () {
      if (!document.fullscreenElement) {
        videoWrap.requestFullscreen().catch(function () {});
      } else {
        document.exitFullscreen().catch(function () {});
      }
    });
    document.addEventListener('fullscreenchange', function onFsChange() {
      const isFs = document.fullscreenElement === videoWrap;
      fsBtn.classList.toggle('is-fs', isFs);
      // Remove listener when modal closes (videoWrap gets cleared)
      if (!modal.classList.contains('is-open')) {
        document.removeEventListener('fullscreenchange', onFsChange);
      }
    });

    function spawnPlayer() {
      player = new YT.Player(pid, {
        videoId: videoId,
        playerVars: {
          autoplay: 1, controls: 0, rel: 0, modestbranding: 1,
          playsinline: 1, iv_load_policy: 3, disablekb: 1, fs: 0,
          origin: window.location.origin,
        },
        events: {
          onReady: function (e) {
            videoWrap.querySelector('.yt-t1').textContent = fmt(e.target.getDuration());
            e.target.playVideo();
            thumb.classList.add('gone');
          },
          onStateChange: function (e) { handleState(e.data); },
        },
      });
    }

    if (window.YT && window.YT.Player) {
      spawnPlayer();
    } else {
      const _prev = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = function () {
        if (typeof _prev === 'function') _prev();
        spawnPlayer();
      };
      if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
        const s = document.createElement('script');
        s.src = 'https://www.youtube.com/iframe_api';
        document.head.appendChild(s);
      }
    }

    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    // Exit fullscreen first if active
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(function () {});
    }
    clearInterval(timer);
    timer = null;
    if (player) {
      try { player.stopVideo(); } catch (e) {}
      try { player.destroy(); } catch (e) {}
      player = null;
    }
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    setTimeout(function () { videoWrap.innerHTML = ''; }, 400);
  }

  document.querySelectorAll('.reel-item[data-video-id]').forEach(function (item) {
    item.addEventListener('click', function () { openModal(item.dataset.videoId); });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (backdrop) backdrop.addEventListener('click', closeModal);
  // Escape closes modal only when not in fullscreen (first Escape exits fullscreen, second closes modal)
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !document.fullscreenElement) closeModal();
  });
})();


// ── Work grid "ver mais" ───────────────────────────────
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

  const extras = cards.slice(LIMIT);
  const label  = btn.querySelector('.wml-label');
  let expanded = false;

  // Take over reveal control for the extra cards so they animate on expand
  extras.forEach(c => {
    revealObserver.unobserve(c);
    c.classList.remove('revealed');
    c.style.transitionDelay = '0ms';
    c.classList.add('work-card--hidden');
  });

  function setLabel(txt) { if (label) label.textContent = txt; }

  btn.addEventListener('click', () => {
    if (!expanded) {
      // Expand — reveal with a soft stagger
      extras.forEach(c => c.classList.remove('work-card--hidden'));
      void grid.offsetHeight; // force reflow so the transition fires
      extras.forEach((c, i) => setTimeout(() => c.classList.add('revealed'), i * 70));
      setLabel('Ver menos');
      btn.classList.add('is-expanded');
      expanded = true;
    } else {
      // Collapse — fade out, then hide from layout
      extras.forEach(c => c.classList.remove('revealed'));
      setTimeout(() => extras.forEach(c => c.classList.add('work-card--hidden')), 480);
      setLabel('Ver mais projetos');
      btn.classList.remove('is-expanded');
      expanded = false;
      const workSection = document.getElementById('work');
      if (workSection) workSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
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
        '<button class="yt-big-play" aria-label="Reproduzir" tabindex="-1">' +
          '<svg width="18" height="18" viewBox="0 0 18 18" fill="none">' +
            '<path d="M4 2.5L15.5 9L4 15.5V2.5Z" fill="currentColor"/>' +
          '</svg>' +
        '</button>' +
      '</div>' +
      '<div class="yt-embed" data-pid="' + pid + '"><div id="' + pid + '"></div></div>' +
      '<div class="yt-pause-cover"></div>' +
      '<div class="yt-click-zone"></div>' +
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
        '<button class="yt-fs" aria-label="Tela cheia">' +
          '<svg class="ic-expand" width="13" height="13" viewBox="0 0 13 13" fill="none">' +
            '<path d="M1 5V1h4M8 1h4v4M12 8v4H8M5 12H1V8" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>' +
          '</svg>' +
          '<svg class="ic-compress" width="13" height="13" viewBox="0 0 13 13" fill="none">' +
            '<path d="M5 1v4H1M8 1v4h4M12 8H8v4M1 8h4v4" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>' +
          '</svg>' +
        '</button>' +
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

    item._els = {
      done:       item.querySelector('.yt-done'),
      head:       item.querySelector('.yt-head'),
      cur:        item.querySelector('.yt-cur'),
      t0:         item.querySelector('.yt-t0'),
      t1:         item.querySelector('.yt-t1'),
      thumb:      item.querySelector('.yt-thumb'),
      pp:         item.querySelector('.yt-pp'),
      pauseCover: item.querySelector('.yt-pause-cover'),
      bars:       null,
    };

    // Waveform bars
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
    item._els.bars = Array.from(wave.children);

    // Click zone — single handler for the entire video area
    item.querySelector('.yt-click-zone').addEventListener('click', function () {
      const p = window._ytPlayers[pid];
      if (!p) {
        // Lazy-create player (carousel slides)
        item._pendingPlay = true;
        item._els.thumb.classList.add('gone');
        if (window.YT && window.YT.Player) createPlayer(item);
        return;
      }
      if (p.getPlayerState() === 1 /* PLAYING */) {
        p.pauseVideo();
      } else {
        p.playVideo();
        item._els.thumb.classList.add('gone');
      }
    });

    // Mini play/pause button in bar
    item.querySelector('.yt-pp').addEventListener('click', function () {
      const p = window._ytPlayers[pid];
      if (!p) return;
      if (p.getPlayerState() === 1 /* PLAYING */) {
        p.pauseVideo();
      } else {
        p.playVideo();
        item._els.thumb.classList.add('gone');
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

    // Fullscreen button
    const fsBtn = item.querySelector('.yt-fs');
    fsBtn.addEventListener('click', function () {
      if (!document.fullscreenElement) {
        item.requestFullscreen().catch(function () {});
      } else {
        document.exitFullscreen().catch(function () {});
      }
    });
    document.addEventListener('fullscreenchange', function () {
      fsBtn.classList.toggle('is-fs', document.fullscreenElement === item);
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
        origin: window.location.origin,
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

  // Shorts: eager init. Carousel slides: lazy (on first click).
  function initAll() {
    items.forEach(function (item) {
      if (item.classList.contains('shorts-item')) createPlayer(item);
    });
  }

  window._ytCreatePlayer = createPlayer;

  function handleState(item, pid, player, state) {
    const els        = item._els || {};
    const pp         = els.pp || item.querySelector('.yt-pp');
    const pauseCover = els.pauseCover || item.querySelector('.yt-pause-cover');
    clearInterval(timers[pid]);
    if (state === 1 /* PLAYING */) {
      pp.classList.add('playing');
      if (pauseCover) pauseCover.classList.remove('active');
      timers[pid] = setInterval(function () {
        const cur = player.getCurrentTime();
        const dur = player.getDuration() || 1;
        setProgress(item, cur / dur, cur);
      }, 200);
    } else {
      pp.classList.remove('playing');
      if (state === 2 /* PAUSED */) {
        if (pauseCover) pauseCover.classList.add('active');
      } else if (state === 0 /* ENDED */) {
        setProgress(item, 0, 0);
        const thumb = els.thumb || item.querySelector('.yt-thumb');
        if (thumb) {
          thumb.classList.remove('gone');
          if (pauseCover) pauseCover.classList.remove('active');
        }
      }
    }
  }

  function setProgress(item, ratio, cur) {
    const els = item._els;
    const pct = (ratio * 100) + '%';
    if (els) {
      els.done.style.width = pct;
      els.head.style.left  = pct;
      const curStr = fmt(cur || 0);
      els.cur.textContent = curStr;
      els.t0.textContent  = curStr;
      const n = Math.floor(ratio * els.bars.length);
      els.bars.forEach(function (b, i) { b.classList.toggle('on', i < n); });
    } else {
      item.querySelector('.yt-done').style.width = pct;
      item.querySelector('.yt-head').style.left  = pct;
      const curStr = fmt(cur || 0);
      item.querySelector('.yt-cur').textContent = curStr;
      item.querySelector('.yt-t0').textContent  = curStr;
      const bars = item.querySelectorAll('.yt-wb');
      const n    = Math.floor(ratio * bars.length);
      bars.forEach(function (b, i) { b.classList.toggle('on', i < n); });
    }
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


// ── Momentum smooth scroll (desktop wheel) ─────────────
// Lightweight lerp-based smoothing for a premium, inertial feel.
// Disabled on touch devices (already smooth) and for reduced-motion users.
(function smoothScroll() {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const coarse = window.matchMedia('(pointer: coarse)').matches;
  if (reduce || coarse) return;

  let target  = window.scrollY;
  let current = window.scrollY;
  let rafId   = null;
  const EASE  = 0.11;

  function maxScroll() {
    return document.documentElement.scrollHeight - window.innerHeight;
  }
  function clamp(v) { return Math.max(0, Math.min(v, maxScroll())); }

  function animate() {
    current += (target - current) * EASE;
    if (Math.abs(target - current) < 0.5) {
      current = target;
      window.scrollTo(0, current);
      rafId = null;
      return;
    }
    window.scrollTo(0, current);
    rafId = requestAnimationFrame(animate);
  }

  window.addEventListener('wheel', e => {
    // Don't hijack while a modal is open (body scroll is locked)
    if (document.body.style.overflow === 'hidden') return;
    if (e.ctrlKey) return; // pinch-zoom gesture
    e.preventDefault();
    const mult = e.deltaMode === 1 ? 16 : (e.deltaMode === 2 ? window.innerHeight : 1);
    target = clamp(target + e.deltaY * mult);
    if (rafId === null) { current = window.scrollY; rafId = requestAnimationFrame(animate); }
  }, { passive: false });

  // Resync when the user scrolls by other means (keyboard, scrollbar, anchor)
  window.addEventListener('scroll', () => {
    if (rafId === null) { target = window.scrollY; current = window.scrollY; }
  }, { passive: true });
})();

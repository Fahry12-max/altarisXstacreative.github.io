// ============================================================
// ALTARIS — main script
// Sections: 1) Stars background  2) Navbar  3) Scroll reveal
//           4) Mobile menu       5) Photo Booth
// ============================================================

/* ---------- 1. STARS BACKGROUND (canvas, low-cost) ---------- */
(function stars() {
  const canvas = document.getElementById('stars-canvas');
  const ctx = canvas.getContext('2d');
  const STAR_COUNT = window.innerWidth < 600 ? 22 : 36; // keep cheap on phones

  let stars = [];
  let w, h;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }

  function makeStars() {
    stars = Array.from({ length: STAR_COUNT }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.4 + 0.4,
      baseAlpha: Math.random() * 0.5 + 0.3,
      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.4 + 0.15, // twinkle speed
      drift: (Math.random() - 0.5) * 0.04 // slow vertical drift
    }));
  }

  let t = 0;
  let rafId;
  function draw() {
    ctx.clearRect(0, 0, w, h);
    t += 0.016;
    for (const s of stars) {
      const alpha = s.baseAlpha + Math.sin(t * s.speed + s.phase) * 0.25;
      s.y += s.drift;
      if (s.y < -5) s.y = h + 5;
      if (s.y > h + 5) s.y = -5;

      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${Math.max(0, alpha)})`;
      ctx.fill();
    }
    rafId = requestAnimationFrame(draw);
  }

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  resize();
  makeStars();
  if (!reduceMotion) {
    draw();
  } else {
    // draw once, static
    ctx.clearRect(0, 0, w, h);
    for (const s of stars) {
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${s.baseAlpha})`;
      ctx.fill();
    }
  }

  window.addEventListener('resize', () => {
    resize();
    makeStars();
  });

  // pause animation when tab is hidden (saves battery/CPU)
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      if (rafId) cancelAnimationFrame(rafId);
    } else if (!reduceMotion) {
      draw();
    }
  });
})();

/* ---------- 2. NAVBAR: blur on scroll ---------- */
(function navbar() {
  const nav = document.getElementById('navbar');
  let lastState = false;

  function onScroll() {
    const shouldBlur = window.scrollY > 40;
    if (shouldBlur !== lastState) {
      nav.classList.toggle('scrolled', shouldBlur);
      lastState = shouldBlur;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ---------- 3. SCROLL REVEAL ---------- */
(function reveal() {
  const targets = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window) || targets.length === 0) {
    targets.forEach((el) => el.classList.add('in-view'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
  );

  targets.forEach((el) => observer.observe(el));
})();

/* ---------- 4. MOBILE MENU ---------- */
(function mobileMenu() {
  const toggle = document.getElementById('nav-toggle');
  const links = document.getElementById('nav-links');
  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    links.classList.toggle('open');
  });

  links.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', () => links.classList.remove('open'));
  });
})();

    

(function () {
  'use strict';

  // ── Progress bar + nav scroll ─────────────
  const progressBar = document.getElementById('progress-bar');
  const nav = document.getElementById('nav');

  function onScroll() {
    const scrolled = window.scrollY;
    const total = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.width = ((scrolled / total) * 100).toFixed(2) + '%';
    nav.classList.toggle('scrolled', scrolled > 60);
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  // ── Reveal on scroll ──────────────────────
  const revealObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        const delay = parseInt(entry.target.dataset.delay || '0', 10);
        setTimeout(function () {
          entry.target.classList.add('visible');
        }, delay);
        revealObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.08, rootMargin: '0px 0px -48px 0px' }
  );

  document.querySelectorAll('.reveal').forEach(function (el) {
    revealObserver.observe(el);
  });

  // ── Counter animation ─────────────────────
  function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

  function animateCounter(el, target, suffix, duration) {
    const start = performance.now();
    function frame(now) {
      const progress = Math.min((now - start) / duration, 1);
      const value = Math.floor(easeOutCubic(progress) * target);
      el.textContent = value + suffix;
      if (progress < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  const counterObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.dataset.count, 10);
        const suffix = el.dataset.suffix || '';
        animateCounter(el, target, suffix, 2000);
        counterObserver.unobserve(el);
      });
    },
    { threshold: 0.5 }
  );

  document.querySelectorAll('[data-count]').forEach(function (el) {
    counterObserver.observe(el);
  });

  // ── Experience accordion ──────────────────
  function closeAll() {
    document.querySelectorAll('.timeline-item.open').forEach(function (item) {
      item.classList.remove('open');
      item.querySelector('.timeline-body').classList.remove('open');
    });
  }

  document.querySelectorAll('.timeline-header').forEach(function (header) {
    header.addEventListener('click', function () {
      const item = header.closest('.timeline-item');
      const body = item.querySelector('.timeline-body');
      const wasOpen = item.classList.contains('open');

      closeAll();

      if (!wasOpen) {
        item.classList.add('open');
        body.classList.add('open');
      }
    });
  });

  // Open first item on load
  const firstItem = document.querySelector('.timeline-item');
  if (firstItem) {
    firstItem.classList.add('open');
    firstItem.querySelector('.timeline-body').classList.add('open');
  }

  // ── Contact form ──────────────────────────
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const btn = form.querySelector('.btn-submit');
      const arrow = btn.querySelector('.btn-arrow');

      btn.disabled = true;
      btn.style.background = '#22c55e';
      btn.style.color = '#fff';
      btn.childNodes[0].textContent = 'Message sent ';
      if (arrow) arrow.textContent = '✓';

      setTimeout(function () {
        btn.disabled = false;
        btn.style.background = '';
        btn.style.color = '';
        btn.childNodes[0].textContent = 'Send message ';
        if (arrow) arrow.textContent = '→';
        form.reset();
      }, 3500);
    });
  }
})();

(function () {
  'use strict';

  /* ── Progress bar + sticky nav ────────── */
  var bar = document.getElementById('progress-bar');
  var nav = document.getElementById('nav');

  window.addEventListener('scroll', function () {
    var scrolled = window.scrollY;
    var total = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (total > 0 ? (scrolled / total) * 100 : 0).toFixed(1) + '%';
    nav.classList.toggle('scrolled', scrolled > 55);
  }, { passive: true });

  /* ── Scroll reveal ────────────────────── */
  var ro = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var el = entry.target;
      var delay = parseInt(el.dataset.delay || '0', 10);
      setTimeout(function () { el.classList.add('in'); }, delay);
      ro.unobserve(el);
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -44px 0px' });

  document.querySelectorAll('.reveal').forEach(function (el) { ro.observe(el); });

  /* ── Counter animation ────────────────── */
  function easeOut(t) { return 1 - Math.pow(1 - t, 3); }

  function counter(el, target, suffix, ms) {
    var t0 = performance.now();
    (function tick(now) {
      var p = Math.min((now - t0) / ms, 1);
      el.textContent = Math.floor(easeOut(p) * target) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    })(t0);
  }

  var co = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var el = entry.target;
      counter(el, parseInt(el.dataset.count, 10), el.dataset.suffix || '', 1800);
      co.unobserve(el);
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-count]').forEach(function (el) { co.observe(el); });

  /* ── Experience accordion ─────────────── */
  function closeAll() {
    document.querySelectorAll('.exp-card.open').forEach(function (c) {
      c.classList.remove('open');
      c.querySelector('.exp-bd').classList.remove('open');
    });
  }

  document.querySelectorAll('.exp-hd').forEach(function (hd) {
    hd.addEventListener('click', function () {
      var card = hd.closest('.exp-card');
      var body = card.querySelector('.exp-bd');
      var wasOpen = card.classList.contains('open');
      closeAll();
      if (!wasOpen) {
        card.classList.add('open');
        body.classList.add('open');
      }
    });
  });

  /* Open first entry by default */
  var first = document.querySelector('.exp-card');
  if (first) {
    first.classList.add('open');
    first.querySelector('.exp-bd').classList.add('open');
  }

  /* ── Contact form ─────────────────────── */
  var form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = form.querySelector('[type="submit"]');
      btn.disabled = true;
      btn.textContent = 'Message sent ✓';
      btn.style.background = '#16a34a';
      setTimeout(function () {
        btn.disabled = false;
        btn.textContent = 'Send message →';
        btn.style.background = '';
        form.reset();
      }, 3500);
    });
  }

})();

/* =========================================================
   Portafolio wbt — main.js
   ========================================================= */
(function () {
  'use strict';

  const $  = (s, c) => (c || document).querySelector(s);
  const $$ = (s, c) => Array.from((c || document).querySelectorAll(s));
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- nav: scroll state + progress ---------- */
  const nav = $('#nav');
  const navProgress = $('#navProgress');

  function onScroll() {
    const y = window.scrollY;
    nav.classList.toggle('scrolled', y > 24);

    const doc = document.documentElement;
    const max = doc.scrollHeight - window.innerHeight;
    navProgress.style.width = (max > 0 ? (y / max) * 100 : 0) + '%';
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- mobile menu ---------- */
  const navToggle = $('#navToggle');
  const navLinks = $('#navLinks');

  navToggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  });

  $$('#navLinks a').forEach(a => a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  }));

  /* ---------- scroll spy ---------- */
  const sections = $$('main section[id]');
  const linkById = {};
  $$('#navLinks a').forEach(a => {
    const id = a.getAttribute('href');
    if (id && id.startsWith('#')) linkById[id.slice(1)] = a;
  });

  if ('IntersectionObserver' in window) {
    const spy = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          Object.values(linkById).forEach(l => l.classList.remove('active'));
          const link = linkById[e.target.id];
          if (link) link.classList.add('active');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
    sections.forEach(s => spy.observe(s));
  }

  /* ---------- reveal on scroll ---------- */
  const revealables = $$('.reveal');
  if (prefersReduced || !('IntersectionObserver' in window)) {
    revealables.forEach(el => el.classList.add('in'));
  } else {
    const ro = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          ro.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    revealables.forEach(el => ro.observe(el));
  }

  /* ---------- counters ---------- */
  const counters = $$('[data-count]');
  if (counters.length && 'IntersectionObserver' in window) {
    const co = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const el = e.target;
        const target = parseInt(el.getAttribute('data-count'), 10) || 0;
        const dur = 1100;
        const start = performance.now();
        co.unobserve(el);

        function tick(now) {
          const p = Math.min((now - start) / dur, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(target * eased) + (p === 1 ? '+' : '');
          if (p < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
      });
    }, { threshold: 0.5 });
    counters.forEach(el => co.observe(el));
  }

  /* ---------- skill bars ---------- */
  const bars = $$('.s-bar i');
  if (bars.length && 'IntersectionObserver' in window) {
    const bo = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const el = e.target;
        const w = el.style.getPropertyValue('--w') || '0%';
        setTimeout(() => { el.style.width = w; }, 90);
        bo.unobserve(el);
      });
    }, { threshold: 0.4 });
    bars.forEach(el => bo.observe(el));
  }

  /* ---------- project filter ---------- */
  const filterBar = $('#filterBar');
  if (filterBar) {
    const cards = $$('.proj');
    filterBar.addEventListener('click', ev => {
      const btn = ev.target.closest('.chip-btn');
      if (!btn) return;
      $$('.chip-btn', filterBar).forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const f = btn.dataset.filter;
      cards.forEach(c => {
        const show = f === 'all' || c.dataset.cat === f;
        c.classList.toggle('hidden', !show);
        if (show) {
          c.style.animation = 'none';
          void c.offsetWidth;
          c.style.animation = '';
          c.classList.add('in');
        }
      });
    });
  }

  /* ---------- code tabs ---------- */
  const codeTabs = $('#codeTabs');
  if (codeTabs) {
    const panes = $$('.code-pane');
    codeTabs.addEventListener('click', ev => {
      const tab = ev.target.closest('.code-tab');
      if (!tab) return;
      $$('.code-tab', codeTabs).forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      panes.forEach(p => p.classList.remove('active'));
      const pane = document.getElementById(tab.dataset.tab);
      if (pane) pane.classList.add('active');
    });
  }

  /* ---------- lightbox ---------- */
  const lightbox = $('#lightbox');
  const lbImage = $('#lbImage');
  const lbCaption = $('#lbCaption');
  const galleryItems = $$('.g-item');
  let lbIndex = 0;

  function openLb(i) {
    if (!galleryItems.length) return;
    lbIndex = (i + galleryItems.length) % galleryItems.length;
    const item = galleryItems[lbIndex];
    const img = $('img', item);
    lbImage.src = img.getAttribute('data-full') || img.src;
    lbImage.alt = img.alt || '';
    lbCaption.textContent = $('figcaption', item)?.textContent || '';
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeLb() {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  galleryItems.forEach((item, i) => {
    item.addEventListener('click', () => openLb(i));
    item.setAttribute('tabindex', '0');
    item.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLb(i); }
    });
  });

  $('#lbClose').addEventListener('click', closeLb);
  $('#lbPrev').addEventListener('click', e => { e.stopPropagation(); openLb(lbIndex - 1); });
  $('#lbNext').addEventListener('click', e => { e.stopPropagation(); openLb(lbIndex + 1); });
  lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLb(); });

  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLb();
    if (e.key === 'ArrowLeft') openLb(lbIndex - 1);
    if (e.key === 'ArrowRight') openLb(lbIndex + 1);
  });

  /* ---------- copy to clipboard ---------- */
  $$('[data-copy]').forEach(el => {
    el.addEventListener('click', async ev => {
      if (el.tagName === 'A' && el.getAttribute('href') !== '#') return;
      ev.preventDefault();
      const value = el.dataset.copy;
      const hint = $('.copy-hint', el);
      try {
        await navigator.clipboard.writeText(value);
        if (hint) { hint.textContent = '¡copiado!'; setTimeout(() => { hint.textContent = 'copiar'; }, 1600); }
      } catch (err) {
        if (hint) { hint.textContent = value; }
      }
    });
  });

  /* ---------- custom cursor ---------- */
  if (!prefersReduced && window.matchMedia('(pointer: fine)').matches) {
    const dot = $('.cursor-dot');
    const ring = $('.cursor-ring');
    let rx = 0, ry = 0, mx = 0, my = 0;

    window.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = `translate(${mx - 3}px, ${my - 3}px)`;
      if (!document.body.classList.contains('cursor-on')) document.body.classList.add('cursor-on');
    });

    (function loop() {
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      ring.style.transform = `translate(${rx - 15}px, ${ry - 15}px)`;
      requestAnimationFrame(loop);
    })();

    document.addEventListener('mouseover', e => {
      const hot = e.target.closest('a, button, .g-item, .c-card, .chip-btn, .code-tab');
      ring.classList.toggle('hot', !!hot);
    });
  }

  /* ---------- footer year ---------- */
  const year = $('#year');
  if (year) year.textContent = new Date().getFullYear();

  /* ---------- smooth anchor offset ---------- */
  $$('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - (parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) + 18);
      window.scrollTo({ top, behavior: prefersReduced ? 'auto' : 'smooth' });
    });
  });
})();

/* =========================================================
   wbt — portafolio · main.js
   ========================================================= */
(function () {
  'use strict';

  const $  = (s, c) => (c || document).querySelector(s);
  const $$ = (s, c) => Array.from((c || document).querySelectorAll(s));
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------- nav móvil ---------------- */
  const nav = $('#nav');
  const navBtn = $('#navBtn');
  navBtn.addEventListener('click', () => {
    const open = nav.classList.toggle('on');
    navBtn.setAttribute('aria-expanded', String(open));
  });
  $$('#nav a').forEach(a => a.addEventListener('click', () => {
    nav.classList.remove('on');
    navBtn.setAttribute('aria-expanded', 'false');
  }));

  /* ---------------- scroll spy ---------------- */
  const sections = $$('main section[id]');
  const navLinks = {};
  $$('#nav a').forEach(a => { navLinks[a.getAttribute('href').slice(1)] = a; });

  if ('IntersectionObserver' in window) {
    const spy = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        Object.values(navLinks).forEach(l => l.classList.remove('on'));
        const l = navLinks[e.target.id];
        if (l) l.classList.add('on');
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    sections.forEach(s => spy.observe(s));
  }

  /* ---------------- medidores de nivel ---------------- */
  const meters = $$('.meter i');
  if (meters.length && 'IntersectionObserver' in window) {
    const mo = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const el = e.target;
        const w = el.style.getPropertyValue('--w');
        setTimeout(() => { el.style.width = w; }, 60);
        mo.unobserve(el);
      });
    }, { threshold: 0.4 });
    meters.forEach(el => mo.observe(el));
  }

  /* ---------------- filtro de repos ---------------- */
  const filters = $('#filters');
  if (filters) {
    const repos = $$('.repo');
    filters.addEventListener('click', ev => {
      const btn = ev.target.closest('.fbtn');
      if (!btn) return;
      $$('.fbtn', filters).forEach(b => b.classList.remove('on'));
      btn.classList.add('on');
      const f = btn.dataset.f;
      repos.forEach(r => r.classList.toggle('hide', f !== 'all' && r.dataset.c !== f));
    });
  }

  /* ---------------- pestañas de código ---------------- */
  const codeTabs = $('#codeTabs');
  if (codeTabs) {
    const panes = $$('.cpane');
    codeTabs.addEventListener('click', ev => {
      const tab = ev.target.closest('.ctab');
      if (!tab) return;
      $$('.ctab', codeTabs).forEach(t => t.classList.remove('on'));
      tab.classList.add('on');
      panes.forEach(p => p.classList.remove('on'));
      const pane = document.getElementById(tab.dataset.t);
      if (pane) pane.classList.add('on');
    });
  }

  /* ---------------- resaltado de sintaxis ---------------- */
  const KW = {
    java: 'abstract assert boolean break byte case catch char class const continue default do double else enum extends final finally float for goto if implements import instanceof int interface long native new package private protected public return short static strictfp super switch synchronized this throw throws transient try void volatile while var record sealed permits yield true false null',
    kotlin: 'abstract actual annotation as break by catch class companion const constructor continue crossinline data delegate do dynamic else enum external false final finally for fun get if import in infix init inline inner interface internal is lateinit noinline null object open operator out override package param private property protected public reified return sealed set super suspend tailrec this throw true try typealias typeof val var vararg when where while'
  };
  const TYPES = {
    java: 'String Integer Long Double Float Boolean Byte Short Character Object List Map Set ArrayList HashMap Optional Stream Collection Exception RuntimeException Throwable UUID Date LocalDate LocalDateTime BigDecimal Void Override SuppressWarnings Deprecated FunctionalInterface',
    kotlin: 'String Int Long Double Float Boolean Byte Short Char Any Unit List MutableList Map MutableMap Set MutableSet Array HashMap Optional Sequence Collection Exception RuntimeException Throwable UUID LocalDate LocalDateTime BigDecimal'
  };

  function esc(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function highlight(code, lang) {
    const kws = KW[lang] || KW.java;
    const types = TYPES[lang] || TYPES.java;
    const re = new RegExp(
      '(/\\*[\\s\\S]*?\\*/|//[^\\n]*)' +          // 1 comentario
      '|("(?:\\\\.|[^"\\\\])*"|\'(?:\\\\.|[^\'\\\\])*\')' + // 2 string
      '|(@[A-Za-z_][\\w]*)' +                     // 3 anotación
      '|\\b(\\d+(?:\\.\\d+)?[fFlLdD]?)\\b' +       // 4 número
      '|\\b(' + kws + ')\\b' +                    // 5 keyword
      '|\\b(' + types + ')\\b' +                  // 6 tipo
      '|([A-Za-z_][\\w]*)(\\s*)(\\()',            // 7 llamada
      'g'
    );

    let out = '';
    let last = 0;
    let m;

    while ((m = re.exec(code)) !== null) {
      out += esc(code.slice(last, m.index));

      if (m[1])      out += '<span class="tk-cm">' + esc(m[1]) + '</span>';
      else if (m[2]) out += '<span class="tk-st">' + esc(m[2]) + '</span>';
      else if (m[3]) out += '<span class="tk-an">' + esc(m[3]) + '</span>';
      else if (m[4]) out += '<span class="tk-nu">' + esc(m[4]) + '</span>';
      else if (m[5]) out += '<span class="tk-kw">' + esc(m[5]) + '</span>';
      else if (m[6]) out += '<span class="tk-ty">' + esc(m[6]) + '</span>';
      else if (m[7]) out += '<span class="tk-fn">' + esc(m[7]) + '</span>' + esc(m[8]) + '<span class="tk-op">' + esc(m[9]) + '</span>';

      last = m.index + m[0].length;
    }
    out += esc(code.slice(last));
    return out;
  }

  $$('code[class^="lang-"]').forEach(el => {
    const lang = el.className.replace('lang-', '');
    el.innerHTML = highlight(el.textContent, lang);
  });

  /* ---------------- lightbox ---------------- */
  const lb = $('#lb');
  const lbImg = $('#lbImg');
  const lbCap = $('#lbCap');
  const shots = $$('[data-lb]');
  let idx = 0;

  function show(i) {
    if (!shots.length) return;
    idx = (i + shots.length) % shots.length;
    const el = shots[idx];
    lbImg.src = el.dataset.lb;
    lbImg.alt = el.querySelector('img') ? el.querySelector('img').alt : '';
    lbCap.textContent = el.dataset.cap || '';
    lb.classList.add('on');
    lb.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
  function hide() {
    lb.classList.remove('on');
    lb.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  shots.forEach((el, i) => {
    el.addEventListener('click', e => { e.preventDefault(); show(i); });
  });
  $('#lbX').addEventListener('click', hide);
  $('#lbP').addEventListener('click', e => { e.stopPropagation(); show(idx - 1); });
  $('#lbN').addEventListener('click', e => { e.stopPropagation(); show(idx + 1); });
  lb.addEventListener('click', e => { if (e.target === lb) hide(); });

  document.addEventListener('keydown', e => {
    if (!lb.classList.contains('on')) return;
    if (e.key === 'Escape') hide();
    if (e.key === 'ArrowLeft') show(idx - 1);
    if (e.key === 'ArrowRight') show(idx + 1);
  });

  /* ---------------- copiar ---------------- */
  $$('[data-copy]').forEach(el => {
    el.addEventListener('click', async () => {
      const hint = el.querySelector('[data-hint]');
      try {
        await navigator.clipboard.writeText(el.dataset.copy);
        if (hint) { hint.textContent = 'copiado'; setTimeout(() => { hint.textContent = 'copiar'; }, 1500); }
      } catch (err) {
        if (hint) hint.textContent = el.dataset.copy;
      }
    });
  });

  /* ---------------- año ---------------- */
  $('#year').textContent = new Date().getFullYear();

  /* ---------------- scroll suave con offset ---------------- */
  const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 52;
  $$('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - navH - 12;
      window.scrollTo({ top, behavior: reduced ? 'auto' : 'smooth' });
    });
  });
})();

// ========================================
// ANIMAȚII cu Motion (motion.dev) — vendor/motion.min.js se încarcă înainte.
// Se folosesc atribute în HTML, ca designul să poată fi schimbat fără să umbli aici:
//   data-reveal            apare ușor din jos când intră în ecran (--d = întârziere)
//   data-reveal="print"    poza „cade” pe masă, ca un print
//   data-stagger           copiii apar pe rând (ex. mesajele de la miri)
//   data-parallax="0.2"    imaginea se mișcă mai încet la scroll
//   data-count="150"       numărătoare
//   .line > span           rândurile titlului urcă la încărcare
//   .fade-in               apare după titlu
// Dacă Motion nu se încarcă sau e activat „reduce motion”, totul apare normal.
// ========================================

(function () {
  const M = window.Motion;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (!M || reduce) return;

  const { animate, inView, scroll, stagger, hover } = M;
  const ease = [0.25, 1, 0.5, 1];
  document.documentElement.classList.add('motion');

  // ----- Trecerea între pagini: pagina se estompează scurt -----
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href]');
    if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (a.target === '_blank' || a.hasAttribute('download')) return;
    const url = new URL(a.href, location.href);
    if (url.origin !== location.origin || url.pathname === location.pathname) return;
    e.preventDefault();
    animate('main, .footer', { opacity: 0, y: -12 }, { duration: 0.25, ease: 'easeIn' })
      .then(() => { location.href = url.href; });
  });
  window.addEventListener('pageshow', (e) => {
    if (e.persisted) document.querySelectorAll('main, .footer').forEach((el) => { el.style.opacity = ''; el.style.transform = ''; });
  });

  // ----- Intrarea în pagină -----
  const lines = document.querySelectorAll('.line > span');
  if (lines.length) animate(lines, { y: ['105%', '0%'] }, { duration: 0.9, ease, delay: stagger(0.1, { startDelay: 0.15 }) });
  const fades = document.querySelectorAll('.fade-in');
  if (fades.length) animate(fades, { opacity: [0, 1], y: [12, 0] }, { duration: 0.7, ease, delay: stagger(0.08, { startDelay: 0.45 }) });

  // ----- Apariție la scroll -----
  document.querySelectorAll('[data-reveal]').forEach((el) => {
    const d = (parseFloat(getComputedStyle(el).getPropertyValue('--d')) || 0) * 0.08;
    inView(el, () => {
      if (el.dataset.reveal === 'print') {
        animate(el, { opacity: [0, 1], y: [-30, 0], rotate: [-8, -2.2], scale: [1.04, 1] }, { type: 'spring', stiffness: 90, damping: 14, delay: d });
      } else {
        animate(el, { opacity: [0, 1], y: [24, 0] }, { duration: 0.8, ease, delay: d });
      }
    }, { amount: 0.15 });
  });

  // mesajele de la miri apar unul câte unul, ca pe telefon
  document.querySelectorAll('[data-stagger]').forEach((group) => {
    inView(group, () => {
      animate(group.children, { opacity: [0, 1], y: [20, 0], scale: [0.97, 1] }, { type: 'spring', stiffness: 160, damping: 20, delay: stagger(0.25) });
    }, { amount: 0.25 });
  });

  // ----- Numărătoare -----
  document.querySelectorAll('[data-count]').forEach((el) => {
    const target = Number(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    el.textContent = '0' + suffix;
    inView(el, () => {
      animate(0, target, { duration: 1.6, ease, onUpdate: (v) => { el.textContent = Math.round(v) + suffix; } });
    }, { amount: 0.6 });
  });

  // ----- Parallax pe imaginea mare -----
  document.querySelectorAll('[data-parallax]').forEach((el) => {
    const speed = Number(el.dataset.parallax) || 0.2;
    const target = el.closest('section, header') || el.parentElement;
    scroll(animate(el, { y: ['0%', `${speed * 100}%`] }, { ease: 'linear' }), { target, offset: ['start start', 'end start'] });
  });

  // ----- Hover pe filmulețe (doar cu mouse) -----
  if (fine) {
    hover('.work', (card) => {
      const img = card.querySelector('.work-thumb img');
      animate(img, { scale: 1.05 }, { type: 'spring', stiffness: 150, damping: 20 });
      return () => animate(img, { scale: 1 }, { type: 'spring', stiffness: 150, damping: 20 });
    });
  }

  // ----- Fereastra video -----
  const modal = document.getElementById('videoModal');
  if (modal) {
    new MutationObserver(() => {
      if (modal.classList.contains('is-open')) {
        animate(modal.querySelector('.modal-box'), { scale: [0.94, 1], opacity: [0, 1] }, { type: 'spring', stiffness: 200, damping: 24 });
      }
    }).observe(modal, { attributes: true, attributeFilter: ['class'] });
  }

  // ----- Filtre portofoliu: cardurile rămase intră pe rând -----
  document.querySelectorAll('.filter[data-filter]').forEach((btn) => btn.addEventListener('click', () => {
    requestAnimationFrame(() => {
      const shown = [...document.querySelectorAll('.work:not([hidden])')];
      animate(shown, { opacity: [0, 1], y: [16, 0] }, { duration: 0.5, ease, delay: stagger(0.05) });
    });
  }));
})();

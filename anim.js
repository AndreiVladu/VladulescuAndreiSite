// ========================================
// ANIMAȚII cu Motion (motion.dev) — vendor/motion.min.js se încarcă înainte.
// Se folosesc atribute în HTML, ca designul să poată fi schimbat fără să umbli aici:
//   data-reveal            apare din jos, cu blur, când intră în ecran (--d = întârziere)
//   data-reveal="mask"     imaginea se dezvăluie de jos în sus
//   data-stagger           copiii apar pe rând
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
  const ease = [0.22, 1, 0.36, 1];
  const root = document.documentElement;
  root.classList.add('motion');

  // ----- Cortina dintre pagini -----
  const curtain = document.createElement('div');
  curtain.className = 'curtain';
  curtain.setAttribute('aria-hidden', 'true');
  document.body.appendChild(curtain);
  const lift = () => animate(curtain, { scaleY: [1, 0] }, { duration: 0.7, ease: [0.76, 0, 0.24, 1], delay: 0.05 });
  curtain.style.transformOrigin = 'top';
  lift();
  window.addEventListener('pageshow', (e) => { if (e.persisted) { curtain.style.transform = 'scaleY(0)'; } });

  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href]');
    if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (a.target === '_blank' || a.hasAttribute('download')) return;
    const url = new URL(a.href, location.href);
    if (url.origin !== location.origin || url.pathname === location.pathname) return;
    e.preventDefault();
    curtain.style.transformOrigin = 'bottom';
    animate(curtain, { scaleY: [0, 1] }, { duration: 0.55, ease: [0.76, 0, 0.24, 1] })
      .then(() => { location.href = url.href; });
  });

  // ----- Intrarea în pagină: titlul urcă rând cu rând -----
  const lines = document.querySelectorAll('.line > span');
  if (lines.length) animate(lines, { y: ['110%', '0%'] }, { duration: 1.1, ease, delay: stagger(0.12, { startDelay: 0.45 }) });
  const fades = document.querySelectorAll('.fade-in');
  if (fades.length) animate(fades, { opacity: [0, 1], y: [24, 0] }, { duration: 0.9, ease, delay: stagger(0.1, { startDelay: 0.75 }) });

  const heroImg = document.querySelector('.hero-media img');
  if (heroImg) animate(heroImg, { scale: [1.15, 1] }, { duration: 2.4, ease });

  // ----- Apariție la scroll -----
  document.querySelectorAll('[data-reveal]').forEach((el) => {
    const d = (parseFloat(getComputedStyle(el).getPropertyValue('--d')) || 0) * 0.09;
    inView(el, () => {
      if (el.dataset.reveal === 'mask') {
        animate(el, { clipPath: ['inset(100% 0 0 0)', 'inset(0% 0 0 0)'] }, { duration: 1.3, ease: [0.76, 0, 0.24, 1], delay: d });
        const img = el.querySelector('img');
        if (img) animate(img, { scale: [1.25, 1] }, { duration: 1.8, ease, delay: d });
      } else {
        animate(el, { opacity: [0, 1], y: [40, 0], filter: ['blur(8px)', 'blur(0px)'] }, { duration: 1, ease, delay: d });
      }
    }, { amount: 0.15, margin: '0px 0px -8% 0px' });
  });

  document.querySelectorAll('[data-stagger]').forEach((group) => {
    inView(group, () => {
      animate(group.children, { opacity: [0, 1], y: [30, 0] }, { duration: 0.8, ease, delay: stagger(0.08) });
    }, { amount: 0.2 });
  });

  // ----- Numărătoare -----
  document.querySelectorAll('[data-count]').forEach((el) => {
    const target = Number(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    el.textContent = '0' + suffix;
    inView(el, () => {
      animate(0, target, { duration: 1.8, ease, onUpdate: (v) => { el.textContent = Math.round(v) + suffix; } });
    }, { amount: 0.6 });
  });

  // ----- Parallax pe scroll -----
  document.querySelectorAll('[data-parallax]').forEach((el) => {
    const speed = Number(el.dataset.parallax) || 0.2;
    const target = el.closest('section, header') || el.parentElement;
    scroll(animate(el, { y: ['0%', `${speed * 100}%`] }, { ease: 'linear' }), { target, offset: ['start start', 'end start'] });
  });

  // ----- Hover pe filmulețe și butoane (doar cu mouse) -----
  if (fine) {
    hover('.work', (card) => {
      const img = card.querySelector('img');
      const play = card.querySelector('.play');
      animate(img, { scale: 1.08 }, { type: 'spring', stiffness: 120, damping: 20 });
      if (play) animate(play, { scale: 1 }, { type: 'spring', stiffness: 300, damping: 18 });
      return () => {
        animate(img, { scale: 1.02 }, { type: 'spring', stiffness: 120, damping: 20 });
        if (play) animate(play, { scale: 0.85 }, { duration: 0.3 });
      };
    });

    // butoane „magnetice”: se apleacă ușor spre cursor
    document.querySelectorAll('.btn').forEach((btn) => {
      btn.addEventListener('pointermove', (e) => {
        const r = btn.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width / 2) * 0.25;
        const y = (e.clientY - r.top - r.height / 2) * 0.35;
        animate(btn, { x, y }, { type: 'spring', stiffness: 250, damping: 15 });
      });
      btn.addEventListener('pointerleave', () => animate(btn, { x: 0, y: 0 }, { type: 'spring', stiffness: 250, damping: 15 }));
    });
  }

  // ----- Fereastra video intră cu un arc -----
  const modal = document.getElementById('videoModal');
  if (modal) {
    new MutationObserver(() => {
      if (modal.classList.contains('is-open')) {
        animate(modal.querySelector('.modal-box'), { scale: [0.85, 1], opacity: [0, 1], y: [40, 0] }, { type: 'spring', stiffness: 160, damping: 22 });
      }
    }).observe(modal, { attributes: true, attributeFilter: ['class'] });
  }

  // ----- Filtre portofoliu: cardurile rămase intră pe rând -----
  document.querySelectorAll('.filter[data-filter]').forEach((btn) => btn.addEventListener('click', () => {
    requestAnimationFrame(() => {
      const shown = [...document.querySelectorAll('.work:not([hidden])')];
      animate(shown, { opacity: [0, 1], y: [30, 0], scale: [0.96, 1] }, { duration: 0.6, ease, delay: stagger(0.05) });
    });
  }));
})();

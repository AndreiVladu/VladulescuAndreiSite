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
//   .reel                  bobina 3D cu cadre: se rotește singură, se poate trage cu degetul/mouse-ul
//   .tslider               mesajele de la miri pe un inel 3D din sticlă, se rotesc singure
//   data-tilt              cardul se înclină 3D după mouse (doar pe calculator)
//   .scrub                 cuvintele se „aprind” pe rând la scroll
//   #offerStage .chip3d    etichetele 3D din cardul cu pachete
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
  // ----- Bobina 3D: se rotește singură, se poate trage -----
  const reel = document.querySelector('.reel');
  if (reel) {
    const ring = reel.querySelector('.reel-ring');
    const AUTO = -0.012; // grade pe milisecundă (o tură în ~30 s)
    let rot = 0, vel = AUTO, dragging = false, lastX = 0, lastT = 0, raf = 0, prev = 0, onScreen = false;
    const frame = (t) => {
      const dt = Math.min(t - (prev || t), 50);
      prev = t;
      if (!dragging) {
        vel += (AUTO - vel) * Math.min(dt / 900, 1); // după ce dai drumul, revine lin la viteza normală
        rot += vel * dt;
      }
      ring.style.setProperty('--rot', rot.toFixed(2));
      raf = requestAnimationFrame(frame);
    };
    const start = () => { if (!raf && onScreen && !document.hidden) { prev = 0; raf = requestAnimationFrame(frame); } };
    const stop = () => { cancelAnimationFrame(raf); raf = 0; };
    new IntersectionObserver(([e]) => { onScreen = e.isIntersecting; onScreen ? start() : stop(); }).observe(reel);
    document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));

    reel.addEventListener('pointerdown', (e) => {
      if (e.button !== 0) return;
      dragging = true; lastX = e.clientX; lastT = e.timeStamp; vel = 0;
      reel.classList.add('is-dragging');
      reel.setPointerCapture(e.pointerId);
    });
    reel.addEventListener('pointermove', (e) => {
      if (!dragging) return;
      const dx = e.clientX - lastX;
      const dt = Math.max(e.timeStamp - lastT, 1);
      rot += dx * 0.3;
      vel = Math.max(-1, Math.min(1, (dx * 0.3) / dt));
      lastX = e.clientX; lastT = e.timeStamp;
    });
    const release = () => { dragging = false; reel.classList.remove('is-dragging'); };
    reel.addEventListener('pointerup', release);
    reel.addEventListener('pointercancel', release); // pe telefon, scroll vertical
    reel.addEventListener('lostpointercapture', release);
  }

  // ----- Mesajele de la miri: carusel 3D, se oprește pe fiecare mesaj, se poate trage -----
  const tslider = document.querySelector('.tslider');
  const ttrack = tslider && tslider.querySelector('.ttrack');
  if (ttrack) {
    const originals = [...ttrack.querySelectorAll('.tcard')];
    const count = originals.length;
    const STEP = 60; // 6 fețe pe inel: mesajele se repetă ca inelul să fie plin
    const N = 360 / STEP;
    for (let k = count; k < N; k++) {
      const c = originals[k % count].cloneNode(true);
      c.setAttribute('aria-hidden', 'true');
      ttrack.appendChild(c);
    }
    const cards = [...ttrack.querySelectorAll('.tcard')];
    cards.forEach((c, i) => c.style.setProperty('--i', i));
    tslider.classList.add('is-3d');
    const dots = document.createElement('div');
    dots.className = 'tdots';
    dots.setAttribute('aria-hidden', 'true');
    dots.innerHTML = '<i></i>'.repeat(count);
    tslider.appendChild(dots);
    const nextBtn = tslider.querySelector('.tnav');

    let rot = 0, target = 0, vel = 0, dragging = false, moved = 0, lastX = 0, lastT = 0, flick = 0;
    let raf = 0, prev = 0, onScreen = false, hovering = false, timer = 0;
    const front = () => ((Math.round(-target / STEP) % N) + N) % N;
    const paint = () => {
      ttrack.style.setProperty('--rot', rot.toFixed(2));
      const f = front();
      cards.forEach((c, i) => {
        let a = ((i * STEP + rot) % 360 + 540) % 360 - 180; // unghiul față de privitor
        c.style.setProperty('--o', (0.25 + 0.75 * Math.max(0, Math.cos(a * Math.PI / 180)) ** 1.5).toFixed(3));
        c.classList.toggle('is-front', i === f);
      });
      [...dots.children].forEach((d, i) => d.classList.toggle('on', i === f % count));
    };
    const frame = (t) => {
      const dt = Math.min(t - (prev || t), 50);
      prev = t;
      if (!dragging) {
        // arc: se așază lin pe mesajul din față
        const k = 0.00012, damp = 0.022;
        vel += ((target - rot) * k - vel * damp) * dt;
        rot += vel * dt;
        if (Math.abs(target - rot) < 0.02 && Math.abs(vel) < 0.0005) { rot = target; vel = 0; }
      }
      paint();
      raf = (dragging || rot !== target) ? requestAnimationFrame(frame) : 0;
    };
    const kick = () => { if (!raf) { prev = 0; raf = requestAnimationFrame(frame); } };
    const go = (dir) => { target = Math.round(target / STEP) * STEP - dir * STEP; kick(); };
    const auto = () => {
      clearInterval(timer); timer = 0;
      if (onScreen && !hovering && !document.hidden) timer = setInterval(() => { if (!dragging) go(1); }, 4500);
    };
    new IntersectionObserver(([e]) => { onScreen = e.isIntersecting; auto(); }).observe(tslider);
    document.addEventListener('visibilitychange', auto);
    if (fine) {
      tslider.addEventListener('pointerenter', () => { hovering = true; auto(); });
      tslider.addEventListener('pointerleave', () => { hovering = false; auto(); });
    }
    if (nextBtn) nextBtn.addEventListener('click', () => { go(1); auto(); });
    ttrack.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); go(e.key === 'ArrowRight' ? 1 : -1); auto(); }
    });

    tslider.addEventListener('pointerdown', (e) => {
      if (e.button !== 0 || e.target.closest('.tnav')) return;
      dragging = true; moved = 0; flick = 0; lastX = e.clientX; lastT = e.timeStamp; vel = 0;
      tslider.classList.add('is-dragging');
      tslider.setPointerCapture(e.pointerId);
      kick();
    });
    tslider.addEventListener('pointermove', (e) => {
      if (!dragging) return;
      const dx = e.clientX - lastX;
      const dt = Math.max(e.timeStamp - lastT, 1);
      const d = dx * (STEP / Math.max(ttrack.offsetWidth, 200)); // o lățime de card = un mesaj
      rot += d; moved += Math.abs(dx);
      flick = d / dt;
      lastX = e.clientX; lastT = e.timeStamp;
    });
    const release = () => {
      if (!dragging) return;
      dragging = false; tslider.classList.remove('is-dragging');
      // se oprește pe cel mai apropiat mesaj, ținând cont de cât de repede ai dat
      target = Math.round((rot + flick * 180) / STEP) * STEP;
      vel = 0; kick(); auto();
    };
    tslider.addEventListener('pointerup', release);
    tslider.addEventListener('pointercancel', release); // pe telefon, scroll vertical
    tslider.addEventListener('lostpointercapture', release);
    paint();
  }

  // ----- Tilt 3D pe carduri (doar cu mouse) -----
  if (fine) {
    const spring = { type: 'spring', stiffness: 220, damping: 22 };
    document.querySelectorAll('[data-tilt]').forEach((el) => {
      const max = el.classList.contains('work') ? 5 : 8;
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        el.style.setProperty('--gx', `${(px * 100).toFixed(1)}%`);
        el.style.setProperty('--gy', `${(py * 100).toFixed(1)}%`);
        animate(el, { rotateY: (px - 0.5) * 2 * max, rotateX: (0.5 - py) * 2 * max, transformPerspective: 1000 }, spring);
      });
      el.addEventListener('pointerleave', () => animate(el, { rotateX: 0, rotateY: 0 }, spring));
    });
  }

  // ----- Text care se „aprinde” cuvânt cu cuvânt la scroll -----
  document.querySelectorAll('.scrub').forEach((el) => {
    const words = el.textContent.trim().split(/\s+/);
    el.textContent = '';
    const spans = words.map((w, i) => {
      const s = document.createElement('span');
      s.className = 'w';
      s.textContent = w;
      el.append(s);
      if (i < words.length - 1) el.append(' ');
      return s;
    });
    let lit = -1;
    scroll((p) => {
      const n = Math.round(p * spans.length);
      if (n === lit) return;
      lit = n;
      spans.forEach((s, i) => s.classList.toggle('on', i < n));
    }, { target: el, offset: ['start 0.85', 'end 0.5'] });
  });

  // ----- Etichetele 3D din cardul cu pachete -----
  const stage = document.getElementById('offerStage');
  if (stage) {
    const chips = [...stage.querySelectorAll('.chip3d')];
    const rot = (c) => parseFloat(c.style.getPropertyValue('--r')) || 0;
    chips.forEach((c) => { c.style.transform = 'none'; });
    inView(stage, () => {
      chips.forEach((c, i) => {
        animate(c, { opacity: [0, 1], y: [60, 0], rotateX: [70, 0], rotate: [0, rot(c)], scale: [0.7, 1], transformPerspective: 700 },
          { type: 'spring', stiffness: 110, damping: 13, delay: 0.15 + i * 0.12 });
      });
    }, { amount: 0.4 });
    if (fine) {
      stage.addEventListener('pointermove', (e) => {
        const r = stage.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        chips.forEach((c, i) => {
          const depth = 1 + (i % 2) * 0.6;
          animate(c, { rotateY: px * 30 * depth, rotateX: -py * 30 * depth, x: px * 14 * depth }, { type: 'spring', stiffness: 150, damping: 18 });
        });
      });
      stage.addEventListener('pointerleave', () => chips.forEach((c) => animate(c, { rotateX: 0, rotateY: 0, x: 0 }, { type: 'spring', stiffness: 150, damping: 18 })));
    }
  }
})();

// ----- Color grading: LOG vs final. Bara din mijloc se trage cu mouse-ul sau degetul (merge și fără Motion) -----
(function () {
  document.querySelectorAll('[data-ba]').forEach((ba) => {
    const tagL = ba.querySelector('.ba-tag-l');
    const tagR = ba.querySelector('.ba-tag-r');
    let pos = 50;
    const set = (p) => {
      pos = Math.max(0, Math.min(100, p));
      ba.style.setProperty('--pos', pos + '%');
      ba.setAttribute('aria-valuenow', Math.round(pos));
      ba.setAttribute('aria-valuetext', Math.round(pos) + '% LOG');
      if (tagL) tagL.style.opacity = pos < 14 ? 0 : 1;
      if (tagR) tagR.style.opacity = pos > 86 ? 0 : 1;
    };
    const fromX = (x) => { const r = ba.getBoundingClientRect(); set(((x - r.left) / r.width) * 100); };
    let id = null, startX = 0, startY = 0, decided = false, hinted = false;
    ba.addEventListener('pointerdown', (e) => {
      id = e.pointerId; startX = e.clientX; startY = e.clientY; hinted = true;
      // cu mouse-ul mută imediat; pe telefon așteaptă să vadă dacă degetul merge în lateral (altfel e scroll)
      decided = e.pointerType === 'mouse';
      if (decided) { ba.setPointerCapture(id); ba.classList.add('is-drag'); fromX(e.clientX); }
    });
    ba.addEventListener('pointermove', (e) => {
      if (e.pointerId !== id) return;
      if (!decided) {
        const dx = Math.abs(e.clientX - startX), dy = Math.abs(e.clientY - startY);
        if (dx < 6 && dy < 6) return;
        if (dy > dx) { id = null; return; }
        decided = true; ba.setPointerCapture(id); ba.classList.add('is-drag');
      }
      fromX(e.clientX);
    });
    const end = (e) => {
      if (e.pointerId !== id) return;
      if (!decided && e.type === 'pointerup') fromX(e.clientX); // atingere scurtă = sare acolo
      id = null; ba.classList.remove('is-drag');
    };
    ba.addEventListener('pointerup', end);
    ba.addEventListener('pointercancel', end);
    ba.addEventListener('keydown', (e) => {
      const step = e.shiftKey ? 10 : 2;
      if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') set(pos - step);
      else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') set(pos + step);
      else if (e.key === 'Home') set(0);
      else if (e.key === 'End') set(100);
      else return;
      hinted = true; e.preventDefault();
    });
    set(50);
    // când apare prima dată pe ecran, bara se mișcă puțin singură ca să se vadă că se poate trage
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches && 'IntersectionObserver' in window) {
      const io = new IntersectionObserver((ents) => {
        if (!ents[0].isIntersecting) return;
        io.disconnect();
        const keys = [[0, 50], [700, 30], [1500, 68], [2200, 50]];
        const t0 = performance.now();
        const ease = (t) => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
        const tick = (now) => {
          if (hinted) return;
          const t = now - t0;
          let k = 1; while (k < keys.length - 1 && t > keys[k][0]) k++;
          const [ta, pa] = keys[k - 1], [tb, pb] = keys[k];
          const f = Math.min(1, Math.max(0, (t - ta) / (tb - ta)));
          set(pa + (pb - pa) * ease(f));
          if (t < keys[keys.length - 1][0]) requestAnimationFrame(tick);
        };
        setTimeout(() => requestAnimationFrame(tick), 400);
      }, { threshold: 0.6 });
      io.observe(ba);
    }
  });
})();

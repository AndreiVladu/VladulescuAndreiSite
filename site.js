// ========================================
// ANDREI VLADULESCU — script comun pentru toate paginile
// Fiecare bloc pornește doar dacă elementele lui există pe pagină.
// ========================================

document.documentElement.classList.add('js');

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const useMotion = document.documentElement.classList.contains('motion');
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

// ----- Navigație: fundal la scroll, se ascunde la coborâre -----
const nav = document.getElementById('nav');
if (nav) {
  let lastY = window.scrollY;
  const onScroll = () => {
    const y = window.scrollY;
    nav.classList.toggle('is-scrolled', y > 40);
    const menuOpen = document.body.classList.contains('menu-open');
    nav.classList.toggle('is-hidden', !menuOpen && y > lastY && y > 400);
    lastY = y;
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// ----- Reflexia de pe bara de sus urmărește mouse-ul -----
const headerBar = document.querySelector('.header-bar');
if (headerBar && finePointer && !reduceMotion) {
  headerBar.addEventListener('pointermove', (e) => {
    const r = headerBar.getBoundingClientRect();
    headerBar.style.setProperty('--mx', `${(((e.clientX - r.left) / r.width) * 100).toFixed(1)}%`);
  });
}

// ----- Meniu mobil -----
const menuBtn = document.getElementById('menuBtn');
const menu = document.getElementById('menu');
if (menuBtn && menu) {
  const setMenu = (open) => {
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Închide meniul' : 'Deschide meniul');
    menu.classList.toggle('is-open', open);
    document.body.classList.toggle('menu-open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  };
  menuBtn.addEventListener('click', () => setMenu(menuBtn.getAttribute('aria-expanded') !== 'true'));
  menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });
}

// ----- Apariție la scroll -----
const revealEls = document.querySelectorAll('[data-reveal]');
if (useMotion) {
  // animate de anim.js
} else if ('IntersectionObserver' in window && !reduceMotion) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
  revealEls.forEach((el) => io.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add('is-in'));
}

// ----- Liniile din secțiunea „Cum lucrez” -----
document.querySelectorAll('.step').forEach((step, i) => {
  step.style.transitionDelay = `${i * 150}ms`;
  if (!('IntersectionObserver' in window)) return step.classList.add('is-in');
  new IntersectionObserver(([entry], obs) => {
    if (entry.isIntersecting) { step.classList.add('is-in'); obs.disconnect(); }
  }, { threshold: 0.4 }).observe(step);
});

// ----- Numărătoare pentru statistici -----
if (!useMotion) document.querySelectorAll('[data-count]').forEach((el) => {
  const target = Number(el.dataset.count);
  const suffix = el.dataset.suffix || '';
  if (reduceMotion || !('IntersectionObserver' in window)) { el.textContent = target + suffix; return; }
  new IntersectionObserver(([entry], obs) => {
    if (!entry.isIntersecting) return;
    obs.disconnect();
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / 1800, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 4))) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, { threshold: 0.6 }).observe(el);
});

// ----- Parallax ușor (doar pe calculator) -----
const parallaxEls = document.querySelectorAll('[data-parallax]');
if (parallaxEls.length && finePointer && !reduceMotion && !useMotion) {
  let ticking = false;
  const update = () => {
    parallaxEls.forEach((el) => {
      const speed = Number(el.dataset.parallax) || 0.15;
      const rect = el.parentElement.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;
      el.style.translate = `0 ${(-rect.top * speed).toFixed(1)}px`;
    });
    ticking = false;
  };
  window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  update();
}

// ----- Video: se deschide într-o fereastră peste pagină -----
const modal = document.getElementById('videoModal');
if (modal) {
  const iframe = modal.querySelector('iframe');
  let lastFocus = null;
  const open = (url) => {
    lastFocus = document.activeElement;
    iframe.src = url;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    document.body.classList.add('modal-open');
    modal.querySelector('.modal-close').focus();
  };
  const close = () => {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    document.body.classList.remove('modal-open');
    setTimeout(() => { iframe.src = ''; }, 400);
    if (lastFocus) lastFocus.focus();
  };
  document.querySelectorAll('.work[data-video]').forEach((card) => {
    card.addEventListener('click', () => open(card.dataset.video));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(card.dataset.video); }
    });
  });
  modal.querySelector('.modal-close').addEventListener('click', close);
  modal.addEventListener('click', (e) => { if (e.target === modal) close(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && modal.classList.contains('is-open')) close(); });
}

// ----- Filtre portofoliu (cu tranziție animată) -----
const filters = document.querySelectorAll('.filter[data-filter]');
if (filters.length) {
  const cards = document.querySelectorAll('.work');
  const nameCards = (on) => cards.forEach((card, i) => { card.style.viewTransitionName = on ? `work-${i}` : ''; });
  filters.forEach((btn) => {
    const f = btn.dataset.filter;
    const count = f === 'all' ? cards.length : [...cards].filter((c) => c.dataset.category === f).length;
    btn.insertAdjacentHTML('beforeend', `<sup>${count}</sup>`);
    btn.addEventListener('click', () => {
      const apply = () => {
        filters.forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
        cards.forEach((card) => { card.hidden = !(f === 'all' || card.dataset.category === f); });
      };
      if (!document.startViewTransition || reduceMotion || useMotion) return apply();
      nameCards(true);
      document.startViewTransition(apply).finished.finally(() => nameCards(false));
    });
  });
}

// ----- Mesajele de la miri: săgeata duce la următorul, apoi înapoi la primul -----
const ttrack = document.getElementById('ttrack');
const tnext = document.getElementById('tnext');
if (ttrack && tnext) {
  tnext.addEventListener('click', () => {
    if (ttrack.closest('.is-3d')) return; // caruselul 3D din anim.js se ocupă
    const card = ttrack.querySelector('.tcard');
    const step = card.offsetWidth + parseFloat(getComputedStyle(ttrack).columnGap || 0);
    const atEnd = ttrack.scrollLeft + ttrack.clientWidth >= ttrack.scrollWidth - 4;
    ttrack.scrollTo({ left: atEnd ? 0 : ttrack.scrollLeft + step, behavior: reduceMotion ? 'auto' : 'smooth' });
  });
}

// ----- Bara de jos: apare după primul card și se ascunde lângă footer -----
const dock = document.getElementById('dock');
if (dock) {
  const first = document.querySelector('main > *');
  const foot = document.querySelector('.footer');
  if (!('IntersectionObserver' in window) || !first || !foot) {
    dock.classList.add('is-visible');
  } else {
    let pastFirst = false;
    let nearFoot = false;
    const update = () => dock.classList.toggle('is-visible', pastFirst && !nearFoot);
    new IntersectionObserver(([e]) => { pastFirst = !e.isIntersecting && e.boundingClientRect.top < 0; update(); }).observe(first);
    new IntersectionObserver(([e]) => { nearFoot = e.isIntersecting; update(); }).observe(foot);
  }
}

// ----- Întrebări frecvente (acordeon) -----
document.querySelectorAll('.faq-item').forEach((item, _, all) => {
  const q = item.querySelector('.faq-q');
  q.addEventListener('click', () => {
    const open = !item.classList.contains('is-open');
    all.forEach((other) => {
      other.classList.remove('is-open');
      other.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
    });
    item.classList.toggle('is-open', open);
    q.setAttribute('aria-expanded', String(open));
  });
});

// ----- Prețuri: tab-uri Nuntă / Botez și monedă -----
const tabs = document.querySelectorAll('.tab');
if (tabs.length) {
  const pill = document.querySelector('.tabs-pill');
  const movePill = (tab) => {
    pill.style.width = `${tab.offsetWidth}px`;
    pill.style.transform = `translateX(${tab.offsetLeft}px)`;
  };
  tabs.forEach((tab) => tab.addEventListener('click', () => {
    tabs.forEach((t) => {
      const on = t === tab;
      t.setAttribute('aria-selected', String(on));
      document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
    });
    movePill(tab);
  }));
  movePill(document.querySelector('.tab[aria-selected="true"]'));
  window.addEventListener('resize', () => movePill(document.querySelector('.tab[aria-selected="true"]')));

  const currencyBtns = document.querySelectorAll('.currency .filter');
  currencyBtns.forEach((btn) => btn.addEventListener('click', () => {
    const cur = btn.dataset.currency;
    currencyBtns.forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
    document.querySelectorAll('.price-amount').forEach((el) => { el.textContent = el.dataset[cur]; });
    document.querySelectorAll('.price-currency').forEach((el) => { el.textContent = cur === 'eur' ? '€' : 'lei'; });
  }));
}

// ----- Formular de contact (EmailJS) -----
// CONFIGURAȚIE - Verifică dacă ID-urile sunt cele din contul tău!
const MAIL_CONFIG = {
  USER_KEY: 'Jyu4Yct8HwIZwfX60',
  MAIL_SERVICE: 'service_uoi2b9c',
  MAIL_TEMPLATE: 'template_spi0i5u'
};

const contactForm = document.getElementById('contactForm');
if (contactForm) {
  // scriptul EmailJS se încarcă cu „defer” (după site.js) și poate fi blocat de ad-blockere,
  // așa că îl verificăm abia când se trimite formularul
  let emailjsReady = false;
  const emailjsLoaded = () => {
    if (typeof emailjs === 'undefined') return false;
    if (!emailjsReady) { emailjs.init(MAIL_CONFIG.USER_KEY); emailjsReady = true; }
    return true;
  };

  const submitBtn = document.getElementById('submitBtn');
  const btnText = submitBtn.querySelector('.btn-text');
  const formMessage = document.getElementById('formMessage');
  const reset = () => setTimeout(() => {
    submitBtn.disabled = false;
    submitBtn.classList.remove('is-success', 'is-error');
    btnText.textContent = 'Trimite Mesajul';
  }, 3000);

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!emailjsLoaded()) {
      formMessage.textContent = 'Formularul nu poate fi trimis momentan. Scrie-mi direct la vladulescuandrei6@gmail.com sau sună la +40 762 309 113.';
      return;
    }
    submitBtn.disabled = true;
    btnText.textContent = 'Se trimite...';
    formMessage.textContent = '';

    // Numele câmpurilor trebuie să fie IDENTICE cu cele din șablonul EmailJS
    const formData = {
      nume: document.getElementById('nume').value,
      prenume: document.getElementById('prenume').value,
      email: document.getElementById('email').value,
      telefon: document.getElementById('telefon').value,
      data: document.getElementById('data').value,
      locatie: document.getElementById('locatie').value,
      mesaj: document.getElementById('mesaj').value,
      title: 'Mesaj Nou Site'
    };

    emailjs.send(MAIL_CONFIG.MAIL_SERVICE, MAIL_CONFIG.MAIL_TEMPLATE, formData).then(() => {
      btnText.textContent = 'Mesaj Trimis!';
      submitBtn.classList.add('is-success');
      contactForm.reset();
      reset();
    }, (error) => {
      console.error('EmailJS Error:', error);
      // arătăm și răspunsul EmailJS, ca să se vadă ce trebuie reparat în cont
      const why = error && (error.text || error.message) ? ` (${error.status || ''} ${error.text || error.message})` : '';
      formMessage.textContent = `Mesajul nu a putut fi trimis${why}. Scrie-mi direct la vladulescuandrei6@gmail.com sau sună la +40 762 309 113.`;
      btnText.textContent = 'Eroare! Reîncearcă';
      submitBtn.classList.add('is-error');
      reset();
    });
  });
}

// ----- Anul curent în footer -----
const yearEl = document.getElementById('currentYear');
if (yearEl) yearEl.textContent = new Date().getFullYear();

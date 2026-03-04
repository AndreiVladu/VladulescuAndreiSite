// ==================== NAVIGATION ====================
const navbar = document.querySelector('.navbar');
const menuToggle = document.querySelector('.menu-toggle');
const mobileMenu = document.querySelector('.mobile-menu');

// Navbar scroll effect
window.addEventListener('scroll', () => {
  if (window.scrollY > 100) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// Mobile menu toggle
menuToggle.addEventListener('click', () => {
  mobileMenu.classList.toggle('active');
  const isOpen = mobileMenu.classList.contains('active');
  menuToggle.innerHTML = isOpen 
    ? '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>'
    : '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>';
});

// Close mobile menu on link click
document.querySelectorAll('.mobile-menu a').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('active');
    menuToggle.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>';
  });
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// ==================== SCROLL REVEAL ANIMATIONS ====================
const scrollRevealElements = document.querySelectorAll('.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right');

const revealOnScroll = () => {
  scrollRevealElements.forEach(element => {
    const elementTop = element.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;
    
    if (elementTop < windowHeight - 100) {
      element.classList.add('visible');
    }
  });
};

window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', revealOnScroll);

// ==================== TESTIMONIALS CAROUSEL ====================
const testimonials = [
  {
    quote: '“Top Top , chiar nota 100, suntem cu nasii si l-au vazut si ei ,Genial , bravo tie ai evoluat super”',
    names:'Alexandra & Adi',
    date: 'Octombrie 2025',
    rating: 5
  },
  {
    quote: '...',
    names: '...',
    date: '...',
    rating: 5
  },
  {
    quote: '...',
    names: '...',
    date: '...',
    rating: 5
  }
];

let activeTestimonial = 0;
let testimonialInterval;

const testimonialQuote = document.querySelector('.testimonial-quote');
const testimonialNames = document.querySelector('.testimonial-author p');
const testimonialDate = document.querySelector('.testimonial-author span');
const testimonialDots = document.querySelector('.testimonial-dots');

function renderTestimonial(index) {
  const t = testimonials[index];
  testimonialQuote.textContent = `"${t.quote}"`;
  testimonialNames.textContent = t.names;
  testimonialDate.textContent = t.date;
  
  // Update dots
  testimonialDots.innerHTML = testimonials.map((_, i) => 
    `<button class="${i === index ? 'active' : ''}" onclick="goToTestimonial(${i})"></button>`
  ).join('');
}

function nextTestimonial() {
  activeTestimonial = (activeTestimonial + 1) % testimonials.length;
  renderTestimonial(activeTestimonial);
}

function prevTestimonial() {
  activeTestimonial = (activeTestimonial - 1 + testimonials.length) % testimonials.length;
  renderTestimonial(activeTestimonial);
}

function goToTestimonial(index) {
  activeTestimonial = index;
  renderTestimonial(activeTestimonial);
  resetTestimonialInterval();
}

function resetTestimonialInterval() {
  clearInterval(testimonialInterval);
  testimonialInterval = setInterval(nextTestimonial, 6000);
}

// Initialize testimonials
document.querySelector('.testimonial-next')?.addEventListener('click', () => {
  nextTestimonial();
  resetTestimonialInterval();
});

document.querySelector('.testimonial-prev')?.addEventListener('click', () => {
  prevTestimonial();
  resetTestimonialInterval();
});

renderTestimonial(0);
testimonialInterval = setInterval(nextTestimonial, 6000);

// ==================== VIDEO MODAL ====================
// ===== REVIEW MODAL OPEN/CLOSE (cu id-ul tău: reviewModal) =====
function openReviewModal() {
  const modal = document.getElementById("reviewModal");
  if (!modal) return;

  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";

  // focus pe primul input
  const first = document.getElementById("review-name");
  if (first) first.focus();
}

function closeReviewModal() {
  const modal = document.getElementById("reviewModal");
  if (!modal) return;

  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

// dacă ai folosit altă capitalizare în HTML
function CloseReviewModal(){ closeReviewModal(); }

// ESC închide modalul
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeReviewModal();
});

// ==================== CONTACT FORM ====================
const contactForm = document.getElementById('contactForm');

contactForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  showToast('Mesajul tău a fost trimis cu succes! Îți voi răspunde în curând.');
  contactForm.reset();
});

// ==================== TOAST NOTIFICATION ====================
function showToast(message) {
  const existingToast = document.querySelector('.toast');
  if (existingToast) {
    existingToast.remove();
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <svg class="toast-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
    <span>${message}</span>
  `;
  document.body.appendChild(toast);

  // Trigger animation
  requestAnimationFrame(() => {
    toast.classList.add('active');
  });

  // Remove after 4 seconds
  setTimeout(() => {
    toast.classList.remove('active');
    setTimeout(() => toast.remove(), 500);
  }, 4000);
}

// ==================== PARTICLES ====================
function createParticles() {
  const container = document.querySelector('.hero-particles');
  if (!container) return;

  for (let i = 0; i < 15; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.top = `${Math.random() * 100}%`;
    particle.style.animationDelay = `${Math.random() * 4}s`;
    particle.style.animationDuration = `${4 + Math.random() * 4}s`;
    container.appendChild(particle);
  }
}

createParticles();

// ==================== CURRENT YEAR ====================
document.querySelectorAll('.current-year').forEach(el => {
  el.textContent = new Date().getFullYear();
});







document.addEventListener("DOMContentLoaded", () => {

  const buttons = document.querySelectorAll(".film-thumb");
  const overlay = document.getElementById("videoOverlay");
  const frame = document.getElementById("videoFrame");
  const closeBtn = document.querySelector(".video-close");

  buttons.forEach(button => {
    button.addEventListener("click", function () {

      const videoUrl = this.getAttribute("data-bunny-embed");
      if (!videoUrl) return;

      frame.src = videoUrl;
      overlay.classList.add("active");
      document.body.style.overflow = "hidden";

    });
  });
// ==================== acel ecran mic cand dai click pe video====================
  function closeVideo() {
    overlay.classList.remove("active");
    frame.src = "";
    document.body.style.overflow = "";
  }

  closeBtn.addEventListener("click", closeVideo);

  overlay.addEventListener("click", function(e) {
    if (e.target === overlay) {
      closeVideo();
    }
  });

});

// ==================== tranzitie meniu====================


// ===== EMAILJS CONFIG =====
// ===== EMAILJS CONFIG =====
const EMAILJS_PUBLIC_KEY = "Jyu4Yct8HwIZwfX60";
const EMAILJS_SERVICE_ID = "service_0wraenh";     // din contul tău
const EMAILJS_TEMPLATE_ID = "template_wjipozn";    // din contul tău

document.addEventListener("DOMContentLoaded", () => {
  // 1) EmailJS init
  if (!window.emailjs) {
    console.error("EmailJS nu e încărcat. Verifică script-ul CDN.");
    return;
  }
  emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });

  // 2) Form submit (ID-urile tale din HTML)
  const form = document.getElementById("reviewForm");
  if (!form) {
    console.error("Nu găsesc #reviewForm în HTML.");
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nameEl = document.getElementById("review-name");
    const emailEl = document.getElementById("review-email");
    const msgEl = document.getElementById("review-message");

    const name = (nameEl?.value || "").trim();
    const reply_to = (emailEl?.value || "").trim();
    const message = (msgEl?.value || "").trim();

    if (!name || !message) {
      alert("Completează numele și recenzia 🙂");
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) submitBtn.disabled = true;

    try {
      // IMPORTANT: aceste chei trebuie să existe în template-ul EmailJS:
      // {{from_name}}, {{reply_to}}, {{message}}
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
        from_name: name,
        reply_to: reply_to,
        message: message
      });

      form.reset();
      if (typeof closeReviewModal === "function") closeReviewModal();
      alert("Trimis ✅ Mulțumesc!");
    } catch (err) {
      console.error("EmailJS error:", err);
      alert("Eroare la trimitere. Verifică service/template și variabilele din template.");
    } finally {
      if (submitBtn) submitBtn.disabled = false;
    }
  });
});
console.log("emailjs =", window.emailjs);
console.log("SERVICE:", EMAILJS_SERVICE_ID, "TEMPLATE:", EMAILJS_TEMPLATE_ID, "PUBLIC:", EMAILJS_PUBLIC_KEY);









const EMAILJS_PUBLIC_KEY1 = "Jyu4Yct8HwIZwfX60";
const EMAILJS_SERVICE_ID1 = "service_0wraenh";     // din contul tău
const EMAILJS_TEMPLATE_ID1 = "template_irqow5j";    // din contul tău

document.addEventListener("DOMContentLoaded", () => {
  // 1) EmailJS init
  if (!window.emailjs) {
    console.error("EmailJS nu e încărcat. Verifică script-ul CDN.");
    return;
  }
  emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY1 });

  // 2) Form submit (ID-urile tale din HTML)
  const form = document.getElementById("reviewForm");
  if (!form) {
    console.error("Nu găsesc #reviewForm în HTML.");
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nameEl = document.getElementById("review-name");
    const emailEl = document.getElementById("review-email");
    const msgEl = document.getElementById("review-message");

    const name = (nameEl?.value || "").trim();
    const reply_to = (emailEl?.value || "").trim();
    const message = (msgEl?.value || "").trim();

    if (!name || !message) {
      alert("Completează numele și recenzia 🙂");
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) submitBtn.disabled = true;

    try {
      // IMPORTANT: aceste chei trebuie să existe în template-ul EmailJS:
      // {{from_name}}, {{reply_to}}, {{message}}
      await emailjs.send(EMAILJS_SERVICE_ID1, EMAILJS_TEMPLATE_ID1, {
        from_name: name,
        reply_to: reply_to,
        message: message
      });

      form.reset();
      if (typeof closeReviewModal === "function") closeReviewModal();
      alert("Trimis ✅ Mulțumesc!");
    } catch (err) {
      console.error("EmailJS error:", err);
      alert("Eroare la trimitere. Verifică service/template și variabilele din template.");
    } finally {
      if (submitBtn) submitBtn.disabled = false;
    }
  });
});
console.log("emailjs =", window.emailjs);
console.log("SERVICE:", EMAILJS_SERVICE_ID1, "TEMPLATE:", EMAILJS_TEMPLATE_ID1, "PUBLIC:", EMAILJS_PUBLIC_KEY1);




document.addEventListener("DOMContentLoaded", () => {
  const burger = document.getElementById("menuToggle");
  const mobileMenu = document.getElementById("mobileMenu");

  if (!burger || !mobileMenu) return;

  const openMenu = () => {
    mobileMenu.classList.add("open");
    burger.setAttribute("aria-expanded", "true");
  };

  const closeMenu = () => {
    mobileMenu.classList.remove("open");
    burger.setAttribute("aria-expanded", "false");
  };

  const toggleMenu = () => {
    const isOpen = mobileMenu.classList.contains("open");
    isOpen ? closeMenu() : openMenu();
  };

  burger.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleMenu();
  });

  // click pe link => închide
  mobileMenu.addEventListener("click", (e) => {
    const link = e.target.closest("a");
    if (link) closeMenu();
  });

  // click în afara meniului => închide
  document.addEventListener("click", (e) => {
    if (!mobileMenu.classList.contains("open")) return;
    if (mobileMenu.contains(e.target) || burger.contains(e.target)) return;
    closeMenu();
  });

  // ESC => închide
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });

  // dacă treci pe desktop, închide
  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) closeMenu();
  });
});


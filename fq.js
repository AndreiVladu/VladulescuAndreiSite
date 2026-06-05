const body = document.body;
const navbar = document.getElementById('navbar');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');
const mobileLinks = document.querySelectorAll('.mobile-link, .mobile-cta');
const faqItems = document.querySelectorAll('.faq-item');
const scrollElements = document.querySelectorAll('.scroll-hidden');

// ========================================
// NAVBAR SCROLL EFFECT
// ========================================
function handleNavbarScroll() {
  if (window.scrollY > 40) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}

window.addEventListener('scroll', handleNavbarScroll, { passive: true });
handleNavbarScroll();

// ========================================
// MOBILE MENU
// ========================================
function closeMobileMenu() {
  mobileMenu.classList.remove('active');
  mobileMenuBtn.classList.remove('active');
  mobileMenuBtn.setAttribute('aria-expanded', 'false');
  body.classList.remove('menu-open');
}

mobileMenuBtn.addEventListener('click', () => {
  const isActive = mobileMenu.classList.toggle('active');

  mobileMenuBtn.classList.toggle('active');
  mobileMenuBtn.setAttribute('aria-expanded', isActive ? 'true' : 'false');

  body.classList.toggle('menu-open', isActive);
});

mobileLinks.forEach(link => {
  link.addEventListener('click', closeMobileMenu);
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 768) {
    closeMobileMenu();
  }
});

// ========================================
// FAQ ACCORDION
// ========================================
faqItems.forEach(item => {
  const button = item.querySelector('.faq-question');

  button.addEventListener('click', () => {
    const isActive = item.classList.contains('active');

    faqItems.forEach(faq => {
      faq.classList.remove('active');
      faq.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
    });

    if (!isActive) {
      item.classList.add('active');
      button.setAttribute('aria-expanded', 'true');
    }
  });
});

// ========================================
// SCROLL REVEAL
// ========================================
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('scroll-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '0px 0px -40px 0px'
});

scrollElements.forEach(element => {
  revealObserver.observe(element);
});

// ========================================
// ESCAPE CLOSE MENU
// ========================================
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeMobileMenu();
  }
});
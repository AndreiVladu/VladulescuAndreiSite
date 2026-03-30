// ========================================
// MOBILE MENU
// ========================================
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');
const mobileLinks = document.querySelectorAll('.mobile-link, .mobile-cta');

mobileMenuBtn.addEventListener('click', function() {
  this.classList.toggle('active');
  mobileMenu.classList.toggle('active');
  document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
});

mobileLinks.forEach(link => {
  link.addEventListener('click', function() {
    mobileMenuBtn.classList.remove('active');
    mobileMenu.classList.remove('active');
    document.body.style.overflow = '';
  });
});

// ========================================
// NAVBAR SCROLL
// ========================================
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', function() {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}, { passive: true });

// ========================================
// SCROLL REVEAL ANIMATIONS - FUNCȚIONAL
// ========================================
document.addEventListener('DOMContentLoaded', function() {
  
  // Selectează toate elementele cu clasa scroll-hidden
  const scrollElements = document.querySelectorAll('.scroll-hidden');
  
  // Funcție pentru a verifica dacă elementul e în viewport
  const elementInView = (el, percentageScroll = 100) => {
    const elementTop = el.getBoundingClientRect().top;
    return (
      elementTop <= 
      ((window.innerHeight || document.documentElement.clientHeight) * (percentageScroll/100))
    );
  };
  
  // Funcție pentru a adăuga clasa visible
  const displayScrollElement = (element) => {
    element.classList.add('scroll-visible');
  };
  
  // Funcție principală de animație
  const handleScrollAnimation = () => {
    scrollElements.forEach((el) => {
      if (elementInView(el, 85)) {
        displayScrollElement(el);
      }
    });
  };
  
  // Rulează la încărcare
  handleScrollAnimation();
  
  // Rulează la scroll
  window.addEventListener('scroll', handleScrollAnimation, { passive: true });
  
});

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
// SCROLL REVEAL ANIMATIONS - EXACT CA LA DESPRE
// ========================================
document.addEventListener('DOMContentLoaded', function() {
  
  const scrollElements = document.querySelectorAll('.scroll-hidden');
  
  const elementInView = (el, percentageScroll = 100) => {
    const elementTop = el.getBoundingClientRect().top;
    return (
      elementTop <= 
      ((window.innerHeight || document.documentElement.clientHeight) * (percentageScroll/100))
    );
  };
  
  const displayScrollElement = (element) => {
    element.classList.add('scroll-visible');
  };
  
  const handleScrollAnimation = () => {
    scrollElements.forEach((el) => {
      if (elementInView(el, 85)) {
        displayScrollElement(el);
      }
    });
  };
  
  handleScrollAnimation();
  
  window.addEventListener('scroll', handleScrollAnimation, { passive: true });
  
});





// FAQ Accordion
const faqQuestions = document.querySelectorAll('.faq-question');

faqQuestions.forEach(question => {
  question.addEventListener('click', () => {
    const faqItem = question.parentElement;
    const isActive = faqItem.classList.contains('active');
    
    // Close all other items
    document.querySelectorAll('.faq-item').forEach(item => {
      item.classList.remove('active');
    });
    
    // Toggle current item
    if (!isActive) {
      faqItem.classList.add('active');
    }
  });
});

// Open first item by default
document.addEventListener('DOMContentLoaded', () => {
  const firstFaqItem = document.querySelector('.faq-item');
  if (firstFaqItem) {
    firstFaqItem.classList.add('active');
  }
});




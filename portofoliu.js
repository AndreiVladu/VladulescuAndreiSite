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
// FILTER TABS
// ========================================
const filterTabs = document.querySelectorAll('.filter-tab');
const portfolioItems = document.querySelectorAll('.portfolio-item');

filterTabs.forEach(tab => {
  tab.addEventListener('click', function() {
    filterTabs.forEach(t => t.classList.remove('active'));
    this.classList.add('active');

    const filter = this.dataset.filter;

    portfolioItems.forEach(item => {
      if (filter === 'all' || item.dataset.category === filter) {
        item.classList.remove('hidden');
        item.classList.remove('scroll-visible');
        setTimeout(() => {
          item.classList.add('scroll-visible');
        }, 50);
      } else {
        item.classList.add('hidden');
      }
    });
  });
});

// ========================================
// VIDEO MODAL
// ========================================
const videoModal = document.getElementById('videoModal');
const videoIframe = document.getElementById('videoIframe');
const modalClose = document.getElementById('modalClose');
const modalOverlay = document.querySelector('.modal-overlay');

function openModal(videoUrl) {
  videoIframe.src = videoUrl + '?autoplay=true';
  videoModal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  videoModal.classList.remove('active');
  videoIframe.src = '';
  document.body.style.overflow = '';
}

portfolioItems.forEach(item => {
  item.addEventListener('click', function() {
    const videoUrl = this.dataset.video;
    if (videoUrl) {
      openModal(videoUrl);
    }
  });
});

modalClose.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape' && videoModal.classList.contains('active')) {
    closeModal();
  }
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

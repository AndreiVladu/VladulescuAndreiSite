document.addEventListener('DOMContentLoaded', function() {
  
  // ========================================
  // NAVIGATION
  // ========================================
  const navbar = document.getElementById('navbar');
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = document.querySelectorAll('.mobile-link, .mobile-cta');
  
  // Navbar scroll effect
  function handleNavbarScroll() {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }
  
  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  
  // Mobile menu toggle
  mobileMenuBtn.addEventListener('click', function() {
    this.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
  });
  
  // Close mobile menu on link click
  mobileLinks.forEach(link => {
    link.addEventListener('click', function() {
      mobileMenuBtn.classList.remove('active');
      mobileMenu.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
  
  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const offset = 80;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
      }
    });
  });
  
  // ========================================
  // STATS COUNTER ANIMATION
  // ========================================
  const statNumbers = document.querySelectorAll('.stat-number');
  let countersAnimated = false;
  
  function animateCounter(element, target, suffix, duration = 2000) {
    const startTime = performance.now();
    const startValue = 0;
    
    function updateCounter(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.floor(startValue + (target - startValue) * easeOut);
      
      element.textContent = currentValue + suffix;
      
      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      }
    }
    
    requestAnimationFrame(updateCounter);
  }
  
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !countersAnimated) {
        countersAnimated = true;
        
        statNumbers.forEach((stat, index) => {
          const target = parseInt(stat.dataset.target);
          const suffix = stat.dataset.suffix;
          
          setTimeout(() => {
            animateCounter(stat, target, suffix);
          }, index * 150);
        });
      }
    });
  }, { threshold: 0.3 });
  
  const statsRow = document.querySelector('.stats-row');
  if (statsRow) {
    statsObserver.observe(statsRow);
  }
  
  // ========================================
  // VIDEO MODAL
  // ========================================
  const videoModal = document.getElementById('videoModal');
  const videoIframe = document.getElementById('videoIframe');
  const modalClose = document.getElementById('modalClose');
  const modalOverlay = document.querySelector('.modal-overlay');
  const portfolioItems = document.querySelectorAll('.portfolio-item');
  
  function openModal(videoUrl) {
    videoIframe.src = videoUrl;
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
  // TESTIMONIALS SLIDER
  // ========================================
  const slides = document.querySelectorAll('.testimonial-slide');
  const dots = document.querySelectorAll('.dot');
  const prevBtn = document.getElementById('prevTestimonial');
  const nextBtn = document.getElementById('nextTestimonial');
  let currentSlide = 0;
  let autoSlideInterval;
  
  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.remove('active');
      dots[i].classList.remove('active');
    });
    
    slides[index].classList.add('active');
    dots[index].classList.add('active');
    currentSlide = index;
  }
  
  function nextSlide() {
    const next = (currentSlide + 1) % slides.length;
    showSlide(next);
  }
  
  function prevSlide() {
    const prev = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(prev);
  }
  
  function startAutoSlide() {
    autoSlideInterval = setInterval(nextSlide, 6000);
  }
  
  function stopAutoSlide() {
    clearInterval(autoSlideInterval);
  }
  
  prevBtn.addEventListener('click', function() {
    stopAutoSlide();
    prevSlide();
    startAutoSlide();
  });
  
  nextBtn.addEventListener('click', function() {
    stopAutoSlide();
    nextSlide();
    startAutoSlide();
  });
  
  dots.forEach((dot, index) => {
    dot.addEventListener('click', function() {
      stopAutoSlide();
      showSlide(index);
      startAutoSlide();
    });
  });
  
  startAutoSlide();
  
  // ========================================
  // FAQ ACCORDION
  // ========================================
  const faqItems = document.querySelectorAll('.faq-item');
  
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    
    question.addEventListener('click', function() {
      const isActive = item.classList.contains('active');
      
      faqItems.forEach(faq => {
        faq.classList.remove('active');
      });
      
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
  
  // ========================================
  // SCROLL REVEAL ANIMATIONS
  // ========================================
  const revealElements = document.querySelectorAll('.portfolio-item, .process-card, .about-image-wrapper, .about-content');
  
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
  
  revealElements.forEach((el, index) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
    revealObserver.observe(el);
  });
  
  const style = document.createElement('style');
  style.textContent = `.revealed { opacity: 1 !important; transform: translateY(0) !important; }`;
  document.head.appendChild(style);
  
  // ========================================
  // CURRENT YEAR
  // ========================================
  const currentYearEl = document.getElementById('currentYear');
  if (currentYearEl) {
    currentYearEl.textContent = new Date().getFullYear();
  }
  
  // ========================================
  // PARALLAX EFFECT (Desktop only)
  // ========================================
  const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
  
  if (!isTouchDevice) {
    const heroBg = document.querySelector('.hero-bg img');
    
    window.addEventListener('scroll', function() {
      const scrolled = window.pageYOffset;
      const rate = scrolled * 0.3;
      
      if (heroBg && scrolled < window.innerHeight) {
        heroBg.style.transform = `translateY(${rate}px) scale(1.1)`;
      }
    }, { passive: true });
  }
});

// ===== CUSTOM CURSOR =====
// Helper function to detect touch devices
const isTouchDevice = () => {
  return (('ontouchstart' in window) ||
     (navigator.maxTouchPoints > 0) ||
     (navigator.msMaxTouchPoints > 0));
};

const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursor-follower');
let mouseX = 0, mouseY = 0, followerX = 0, followerY = 0;

// Only enable custom cursor on non-touch devices
if (!isTouchDevice()) {
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
  });

  function animateFollower() {
    followerX += (mouseX - followerX) * 0.12;
    followerY += (mouseY - followerY) * 0.12;
    follower.style.left = followerX + 'px';
    follower.style.top = followerY + 'px';
    requestAnimationFrame(animateFollower);
  }
  animateFollower();

  document.querySelectorAll('a, button, .solution-card, .job-card, .insight-card, .about-pillar').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('hover');
      follower.classList.add('hover');
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('hover');
      follower.classList.remove('hover');
    });
  });
} else {
  // Hide cursor elements on touch devices
  if (cursor) cursor.style.display = 'none';
  if (follower) follower.style.display = 'none';
  document.body.style.cursor = 'auto';
}

// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// ===== SCROLL PROGRESS =====
const progressBar = document.getElementById('scroll-progress');
window.addEventListener('scroll', () => {
  const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
  progressBar.style.width = scrolled + '%';
});

// ===== SCROLL REVEAL =====
const revealElements = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

revealElements.forEach(el => observer.observe(el));

// ===== COUNT UP ANIMATION =====
function animateCounter(el, target, duration = 2000) {
  let start = 0;
  const step = (timestamp) => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(ease * target);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target;
  };
  requestAnimationFrame(step);
}

// Hero counter
const heroCounters = document.querySelectorAll('.count-up');
const heroSection = document.querySelector('.hero');
let heroCountersStarted = false;

const heroObserver = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting && !heroCountersStarted) {
    heroCountersStarted = true;
    setTimeout(() => {
      heroCounters.forEach(el => {
        animateCounter(el, parseInt(el.dataset.target), 2000);
      });
    }, 800);
  }
});
heroObserver.observe(heroSection);

// About section counters
const aboutCounters = document.querySelectorAll('.count-up-dark');
const aboutSection = document.getElementById('about');
let aboutCountersStarted = false;

const aboutObserver = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting && !aboutCountersStarted) {
    aboutCountersStarted = true;
    aboutCounters.forEach((el, i) => {
      setTimeout(() => {
        animateCounter(el, parseInt(el.dataset.target), 1500);
      }, i * 150);
    });
  }
}, { threshold: 0.3 });
aboutObserver.observe(aboutSection);

// ===== MOBILE MENU =====
function openMobileMenu() {
  document.getElementById('mobile-menu').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeMobileMenu() {
  document.getElementById('mobile-menu').classList.remove('open');
  document.body.style.overflow = '';
}
document.getElementById('mobile-close').addEventListener('click', closeMobileMenu);

// Close mobile menu when clicking on a link
document.querySelectorAll('.mobile-menu a').forEach(link => {
  link.addEventListener('click', closeMobileMenu);
});

// Close mobile menu on escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeMobileMenu();
  }
});

// ===== FORM SUBMIT =====
function handleSubmit(e) {
  e.preventDefault();
  const btn = e.target.querySelector('.btn-submit');
  const span = btn.querySelector('span');
  span.innerHTML = '✓ Message Sent!';
  btn.style.background = 'linear-gradient(135deg, #4a7a3a, #839705)';
  btn.style.cursor = 'default';
  setTimeout(() => {
    span.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m22 2-7 20-4-9-9-4 20-7z"/></svg> Send Message';
    btn.style.background = '';
  }, 3000);
}

// ===== NEWSLETTER =====
function subscribeNewsletter(e) {
  e.preventDefault();
  const btn = e.target;
  const original = btn.textContent;
  btn.textContent = '✓ Done!';
  btn.style.background = '#4a7a3a';
  setTimeout(() => {
    btn.textContent = original;
    btn.style.background = '';
  }, 2500);
}

// ===== SMOOTH ANCHOR SCROLLING (offset for nav) =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 72;
      const y = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  });
});

// ===== ACTIVE NAV LINK =====
const sections = document.querySelectorAll('section[id], .hero');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 100;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute('id');
    }
  });
  navLinks.forEach(link => {
    link.style.color = '';
    if (link.getAttribute('href') === '#' + current) {
      link.style.color = 'var(--green-primary)';
    }
  });
});

// ===== INSIGHTS CAROUSEL =====
let currentInsight = 0;
const insightCards = document.querySelectorAll('.insight-card-carousel');
const totalInsights = insightCards.length;

function updateCarousel() {
  insightCards.forEach((card, index) => {
    card.classList.remove('active', 'prev', 'next');
    
    if (index === currentInsight) {
      card.classList.add('active');
    } else if (index === (currentInsight - 1 + totalInsights) % totalInsights) {
      card.classList.add('prev');
    } else if (index === (currentInsight + 1) % totalInsights) {
      card.classList.add('next');
    }
  });
  
  // Update indicators
  updateIndicators();
}

function nextInsight() {
  currentInsight = (currentInsight + 1) % totalInsights;
  updateCarousel();
}

function prevInsight() {
  currentInsight = (currentInsight - 1 + totalInsights) % totalInsights;
  updateCarousel();
}

// Create indicator dots
function createIndicators() {
  const indicatorContainer = document.getElementById('carouselIndicators');
  if (!indicatorContainer) return;
  
  for (let i = 0; i < totalInsights; i++) {
    const dot = document.createElement('div');
    dot.className = 'carousel-dot';
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => {
      currentInsight = i;
      updateCarousel();
    });
    indicatorContainer.appendChild(dot);
  }
}

// Update indicator dots
function updateIndicators() {
  const dots = document.querySelectorAll('.carousel-dot');
  dots.forEach((dot, index) => {
    dot.classList.toggle('active', index === currentInsight);
  });
}

// Initialize carousel
createIndicators();
updateCarousel();

// Auto-advance carousel every 5 seconds
setInterval(nextInsight, 5000);

// Touch/Swipe support for mobile and desktop
let touchStartX = 0;
let touchEndX = 0;
let isDragging = false;
const carousel = document.querySelector('.insights-carousel');

if (carousel) {
  // Touch events for mobile
  carousel.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  carousel.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  });

  // Mouse events for desktop dragging
  carousel.addEventListener('mousedown', (e) => {
    isDragging = true;
    touchStartX = e.clientX;
    carousel.style.cursor = 'grabbing';
  });

  carousel.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    e.preventDefault();
  });

  carousel.addEventListener('mouseup', (e) => {
    if (!isDragging) return;
    isDragging = false;
    touchEndX = e.clientX;
    carousel.style.cursor = 'grab';
    handleSwipe();
  });

  carousel.addEventListener('mouseleave', () => {
    if (isDragging) {
      isDragging = false;
      carousel.style.cursor = 'grab';
    }
  });

  // Add grab cursor
  carousel.style.cursor = 'grab';

  function handleSwipe() {
    const swipeThreshold = 50;
    if (touchEndX < touchStartX - swipeThreshold) {
      nextInsight();
    }
    if (touchEndX > touchStartX + swipeThreshold) {
      prevInsight();
    }
  }
}

// ===== MOBILE VIEWPORT HEIGHT FIX =====
// Fix for mobile browsers where 100vh doesn't account for address bar
function setVH() {
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}

setVH();
window.addEventListener('resize', setVH);
window.addEventListener('orientationchange', setVH);

// ===== PREVENT ZOOM ON MOBILE FORM INPUTS =====
// Prevent iOS from zooming when focusing on form inputs
if (isTouchDevice()) {
  const viewportMeta = document.querySelector('meta[name="viewport"]');
  if (viewportMeta) {
    const content = viewportMeta.getAttribute('content');
    if (!content.includes('maximum-scale')) {
      viewportMeta.setAttribute('content', content + ', maximum-scale=1');
    }
  }
}

// ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === '#' || href === '') return;
    
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      const navHeight = document.getElementById('navbar').offsetHeight;
      const targetPosition = target.offsetTop - navHeight;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
      
      // Close mobile menu if open
      closeMobileMenu();
    }
  });
});

// ===== PERFORMANCE OPTIMIZATION =====
// Reduce animations on low-end devices
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.documentElement.style.setProperty('--ease-spring', 'ease');
  document.documentElement.style.setProperty('--ease-out', 'ease');
}

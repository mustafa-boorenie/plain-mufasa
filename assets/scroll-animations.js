/**
 * PRNTD Scroll Animations
 * 
 * Intersection Observer-based fade-in and reveal animations
 * for below-the-fold content. Lightweight, no dependencies.
 */

(function () {
  'use strict';

  function init() {
    // Fade-in on scroll
    const fadeEls = document.querySelectorAll('[data-animate]');
    if (!fadeEls.length) return;

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const el = entry.target;
          const delay = parseInt(el.dataset.animateDelay || '0', 10);
          setTimeout(function () {
            el.classList.add('is-visible');
          }, delay);
          observer.unobserve(el);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    });

    fadeEls.forEach(function (el) {
      observer.observe(el);
    });

    // Parallax scroll elements
    const parallaxEls = document.querySelectorAll('[data-parallax]');
    if (parallaxEls.length) {
      let ticking = false;
      window.addEventListener('scroll', function () {
        if (!ticking) {
          requestAnimationFrame(function () {
            const scrollY = window.pageYOffset;
            parallaxEls.forEach(function (el) {
              const speed = parseFloat(el.dataset.parallax || '0.1');
              const rect = el.getBoundingClientRect();
              const offset = (rect.top + scrollY - window.innerHeight / 2) * speed;
              el.style.transform = 'translateY(' + offset.toFixed(1) + 'px)';
            });
            ticking = false;
          });
          ticking = true;
        }
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

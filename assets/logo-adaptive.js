/* ============================================================
   Logo Adaptive — Scroll-driven logo animation
   PRNTD Rebrand · February 2026
   ============================================================
   Effects:
   1. Scale down on scroll (1.0 → 0.85)
   2. Section-aware contrast (dark sections → white logo, light → dark)
   3. Subtle parallax float when idle
   4. Entrance fade-in on page load
   ============================================================ */

(function () {
  'use strict';

  var SCALE_START = 1.0;
  var SCALE_END = 0.85;
  var SCROLL_RANGE = 300;
  var IDLE_DELAY = 150;
  var LOGO_SAMPLE_Y = 40; // px from top of viewport to check which section

  var logo, header, navLinks, scrollTicking, idleTimer, isScrolling, lastDark;
  var darkSections = []; // sections that should trigger white logo

  function init() {
    logo = document.querySelector('.prntd-header .prntd-logo-img');
    header = document.querySelector('.prntd-header');
    if (!logo || !header) return;

    navLinks = header.querySelectorAll('nav a, .prntd-header-nav a, a[href*="collections"], a[href*="shop"]');

    // Register known dark sections by selector
    var darkSelectors = [
      '#prntd-hero',
      '.brand-manifesto',
      '.prntd-header--dark',
      '[data-theme="dark"]'
    ];

    darkSelectors.forEach(function (sel) {
      var el = document.querySelector(sel);
      if (el) darkSections.push(el);
    });

    // Also detect sections with explicit dark backgrounds
    document.querySelectorAll('section, div').forEach(function (el) {
      var bg = getComputedStyle(el).backgroundColor;
      if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') {
        var c = parseBgColor(bg);
        if (c && luminance(c) < 0.2) {
          darkSections.push(el);
        }
      }
    });

    // Entrance animation
    logo.classList.add('logo-entrance');
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        logo.classList.add('logo-entrance--active');
        logo.addEventListener('transitionend', function onEnd(e) {
          if (e.propertyName === 'opacity') {
            logo.removeEventListener('transitionend', onEnd);
            logo.classList.add('logo-float');
          }
        });
      });
    });

    // Scroll listener
    scrollTicking = false;
    isScrolling = false;
    lastDark = null;
    window.addEventListener('scroll', onScroll, { passive: true });

    // Initial update
    update();
  }

  function onScroll() {
    if (!isScrolling) {
      isScrolling = true;
      logo.classList.remove('logo-float');
    }
    clearTimeout(idleTimer);
    idleTimer = setTimeout(function () {
      isScrolling = false;
      logo.classList.add('logo-float');
    }, IDLE_DELAY);

    if (!scrollTicking) {
      scrollTicking = true;
      requestAnimationFrame(function () {
        update();
        scrollTicking = false;
      });
    }
  }

  function update() {
    var y = window.scrollY || window.pageYOffset;

    // 1. Scale
    var t = Math.min(y / SCROLL_RANGE, 1);
    var scale = SCALE_START + (SCALE_END - SCALE_START) * t;
    logo.style.transform = 'scale(' + scale + ')';

    // 2. Section-aware contrast — check which section occupies the logo area
    var dark = isOverDarkSection();

    if (dark !== lastDark) {
      lastDark = dark;
      if (dark) {
        logo.style.filter = 'brightness(0) invert(1)';
        navLinks.forEach(function (a) { a.style.color = '#f5f5f3'; });
      } else {
        logo.style.filter = 'brightness(0)';
        navLinks.forEach(function (a) { a.style.color = ''; });
      }
    }
  }

  function isOverDarkSection() {
    // Check if any dark section covers the logo sampling point
    for (var i = 0; i < darkSections.length; i++) {
      var rect = darkSections[i].getBoundingClientRect();
      // Section covers the sampling y-position (near top of viewport)
      if (rect.top <= LOGO_SAMPLE_Y && rect.bottom > LOGO_SAMPLE_Y) {
        return true;
      }
    }
    return false;
  }

  function parseBgColor(str) {
    var m = str.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (!m) return null;
    return { r: +m[1], g: +m[2], b: +m[3] };
  }

  function luminance(c) {
    return 0.2126 * (c.r / 255) + 0.7152 * (c.g / 255) + 0.0722 * (c.b / 255);
  }

  // Boot
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

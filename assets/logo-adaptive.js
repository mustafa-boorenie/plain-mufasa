/* ============================================================
   Logo Adaptive — Scroll-driven logo animation
   PRNTD Rebrand · February 2026
   ============================================================
   Effects:
   1. Scale down on scroll (1.0 → 0.85)
   2. Section-aware contrast morphing (dark bg → white logo, light bg → dark logo)
   3. Subtle parallax float when idle (CSS class toggle)
   4. Entrance fade-in on page load
   ============================================================ */

(function () {
  'use strict';

  const SCALE_START = 1.0;
  const SCALE_END = 0.85;
  const SCROLL_RANGE = 300; // px over which scale transition completes
  const SAMPLE_OFFSET_Y = 60; // where to sample bg color (header vertical center-ish)
  const LUMINANCE_THRESHOLD = 0.45;
  const IDLE_DELAY = 150; // ms after last scroll to resume float

  let logo, header, scrollTicking, idleTimer, isScrolling, lastDark;

  function init() {
    logo = document.querySelector('.prntd-header .prntd-logo-img');
    header = document.querySelector('.prntd-header');
    if (!logo || !header) return;

    // Entrance animation
    logo.classList.add('logo-entrance');
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        logo.classList.add('logo-entrance--active');
        // After entrance, enable float
        logo.addEventListener('transitionend', function onEnd(e) {
          if (e.propertyName === 'opacity') {
            logo.removeEventListener('transitionend', onEnd);
            logo.classList.add('logo-float');
          }
        });
      });
    });

    // Scroll listener (passive for perf)
    scrollTicking = false;
    isScrolling = false;
    lastDark = null;
    window.addEventListener('scroll', onScroll, { passive: true });

    // Initial update
    update();
  }

  function onScroll() {
    // Pause float while scrolling
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

    // 2. Section-aware contrast
    sampleAndAdapt();
  }

  function sampleAndAdapt() {
    // Sample the element directly behind the logo center
    var rect = logo.getBoundingClientRect();
    var cx = rect.left + rect.width / 2;
    var cy = rect.top + rect.height / 2;

    // Hide logo momentarily to sample behind it
    var prev = logo.style.visibility;
    logo.style.visibility = 'hidden';
    var el = document.elementFromPoint(cx, cy);
    logo.style.visibility = prev;

    if (!el) return;

    var bg = getEffectiveBgColor(el);
    if (!bg) return;

    var lum = luminance(bg);
    var dark = lum < LUMINANCE_THRESHOLD;

    if (dark !== lastDark) {
      lastDark = dark;
      // dark bg → white logo (invert), light bg → dark logo (no invert)
      if (dark) {
        logo.style.filter = 'brightness(0) invert(1)';
        header.querySelectorAll('.prntd-header-nav a').forEach(function (a) {
          a.style.color = '#f5f5f3';
        });
      } else {
        logo.style.filter = 'brightness(0)';
        header.querySelectorAll('.prntd-header-nav a').forEach(function (a) {
          a.style.color = '';
        });
      }
    }
  }

  function getEffectiveBgColor(el) {
    var max = 10;
    while (el && max-- > 0) {
      var style = getComputedStyle(el);
      var bg = style.backgroundColor;
      if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') {
        return parseBgColor(bg);
      }
      el = el.parentElement;
    }
    // Fallback: light page
    return { r: 245, g: 245, b: 243 };
  }

  function parseBgColor(str) {
    var m = str.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (!m) return null;
    return { r: +m[1], g: +m[2], b: +m[3] };
  }

  function luminance(c) {
    // Relative luminance (simplified sRGB)
    var rs = c.r / 255, gs = c.g / 255, bs = c.b / 255;
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  }

  // Boot
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

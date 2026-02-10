/**
 * PRNTD Adaptive Logo
 * Tracks pixels behind the logo and smoothly transitions its color
 * to always contrast against the background content.
 */
(function () {
  'use strict';

  var logo = document.querySelector('.prntd-logo-img');
  var header = document.getElementById('prntd-header');
  if (!logo || !header) return;

  // Build a list of sections with their color hints
  // Dark sections get data-theme="dark", everything else is light
  var sections = [];
  function mapSections() {
    sections = [];
    var allSections = document.querySelectorAll('section, .brand-manifesto, .about-hero, .about-page, .lb-teaser, #prntd-hero, footer');
    allSections.forEach(function (el) {
      var bg = getComputedStyle(el).backgroundColor;
      var isDark = isColorDark(bg) || el.classList.contains('brand-manifesto') ||
                   el.id === 'prntd-hero' || el.classList.contains('about-hero') ||
                   el.classList.contains('lb-teaser');
      sections.push({ el: el, dark: isDark });
    });
    // Also check if the page wrapper itself is dark
    var pageWrap = document.querySelector('.about-page, .lb');
    if (pageWrap) {
      var pageBg = getComputedStyle(pageWrap).backgroundColor;
      if (isColorDark(pageBg)) {
        sections.unshift({ el: pageWrap, dark: true });
      }
    }
  }

  function isColorDark(bgColor) {
    if (!bgColor || bgColor === 'transparent' || bgColor === 'rgba(0, 0, 0, 0)') return false;
    var match = bgColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (!match) return false;
    var r = parseInt(match[1]);
    var g = parseInt(match[2]);
    var b = parseInt(match[3]);
    // Relative luminance
    var luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance < 0.45;
  }

  var currentMode = null;
  var rafId = null;

  function updateLogo() {
    var logoRect = logo.getBoundingClientRect();
    var logoCenterY = logoRect.top + logoRect.height / 2;
    var logoCenterX = logoRect.left + logoRect.width / 2;
    var overDark = false;

    // Check which section the logo center is over
    for (var i = sections.length - 1; i >= 0; i--) {
      var sec = sections[i];
      var rect = sec.el.getBoundingClientRect();
      if (logoCenterY >= rect.top && logoCenterY <= rect.bottom &&
          logoCenterX >= rect.left && logoCenterX <= rect.right) {
        overDark = sec.dark;
        break;
      }
    }

    var mode = overDark ? 'light' : 'dark';
    if (mode !== currentMode) {
      currentMode = mode;
      if (mode === 'light') {
        // Logo should be white/light on dark backgrounds
        logo.style.filter = 'brightness(0) invert(1)';
      } else {
        // Logo should be dark on light backgrounds
        logo.style.filter = 'brightness(0)';
      }
      // Also update nav links
      var navLinks = header.querySelectorAll('.prntd-header-nav a');
      navLinks.forEach(function (a) {
        a.style.color = mode === 'light' ? '#f5f5f3' : '#0a0a0a';
      });
    }
  }

  function onScroll() {
    if (rafId) return;
    rafId = requestAnimationFrame(function () {
      rafId = null;
      updateLogo();
    });
  }

  // Initialize
  mapSections();
  updateLogo();

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', function () {
    mapSections();
    updateLogo();
  });

  // Re-map after images load (can shift layout)
  window.addEventListener('load', function () {
    mapSections();
    updateLogo();
  });
})();

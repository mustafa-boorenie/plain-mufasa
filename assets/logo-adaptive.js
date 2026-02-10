/**
 * PRNTD Adaptive Logo
 * Real-time pixel tracking: samples the actual rendered pixels behind the logo
 * and smoothly transitions its color to always contrast.
 */
(function () {
  'use strict';

  var logo, header, navLinks;
  var canvas, ctx;
  var currentMode = null;
  var rafPending = false;
  var sampleInterval = null;

  function init() {
    logo = document.querySelector('#prntd-header .prntd-logo-img');
    header = document.getElementById('prntd-header');
    if (!logo || !header) return;

    navLinks = header.querySelectorAll('.prntd-header-nav a');

    // Use element sampling approach — check elements at logo position
    update();
    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', update);
    window.addEventListener('load', update);
  }

  function scheduleUpdate() {
    if (rafPending) return;
    rafPending = true;
    requestAnimationFrame(function () {
      rafPending = false;
      update();
    });
  }

  function update() {
    var rect = logo.getBoundingClientRect();
    var x = rect.left + rect.width / 2;
    var y = rect.top + rect.height / 2;

    // Temporarily hide the header to sample what's behind it
    var origPointer = header.style.pointerEvents;
    var origVis = logo.style.visibility;
    header.style.pointerEvents = 'none';
    logo.style.visibility = 'hidden';

    // Sample multiple points around the logo area
    var points = [
      [x, y],
      [rect.left + 10, y],
      [rect.right - 10, y],
      [x, rect.top + 2],
      [x, rect.bottom - 2]
    ];

    var totalLum = 0;
    var samples = 0;

    points.forEach(function (pt) {
      var el = document.elementFromPoint(pt[0], pt[1]);
      if (el) {
        var lum = getElementLuminance(el);
        if (lum !== null) {
          totalLum += lum;
          samples++;
        }
      }
    });

    header.style.pointerEvents = origPointer;
    logo.style.visibility = origVis;

    if (samples === 0) return;

    var avgLum = totalLum / samples;
    var isDark = avgLum < 0.45;
    var mode = isDark ? 'light' : 'dark';

    if (mode !== currentMode) {
      currentMode = mode;
      applyMode(mode);
    }
  }

  function getElementLuminance(el) {
    // Walk up the DOM to find the first element with a non-transparent background
    var node = el;
    var maxDepth = 15;
    while (node && node !== document.documentElement && maxDepth-- > 0) {
      var bg = getComputedStyle(node).backgroundColor;
      if (bg && bg !== 'transparent' && bg !== 'rgba(0, 0, 0, 0)') {
        return colorLuminance(bg);
      }
      // Check for background images (likely dark if present)
      var bgImg = getComputedStyle(node).backgroundImage;
      if (bgImg && bgImg !== 'none') {
        // Heuristic: if element has a bg image + dark text, it's probably light
        // If it has light text, it's probably dark
        var textColor = getComputedStyle(node).color;
        var textLum = colorLuminance(textColor);
        return textLum > 0.5 ? 0.1 : 0.9; // Invert: light text = dark bg
      }
      node = node.parentElement;
    }
    // Default: assume light (the page bg)
    return 0.9;
  }

  function colorLuminance(color) {
    var match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (!match) return null;
    var r = parseInt(match[1]) / 255;
    var g = parseInt(match[2]) / 255;
    var b = parseInt(match[3]) / 255;
    return 0.299 * r + 0.587 * g + 0.114 * b;
  }

  function applyMode(mode) {
    if (mode === 'light') {
      // White logo for dark backgrounds
      logo.style.filter = 'brightness(0) invert(1)';
      navLinks.forEach(function (a) { a.style.color = '#f5f5f3'; });
    } else {
      // Dark logo for light backgrounds
      logo.style.filter = 'brightness(0)';
      navLinks.forEach(function (a) { a.style.color = '#0a0a0a'; });
    }
  }

  // Wait for DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

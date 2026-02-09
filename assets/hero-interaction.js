/**
 * PRNTD Hero Interaction — Circular Reveal Cursor
 * v2.0 — Complete rewrite with correct compositing
 *
 * Architecture:
 *   - Layer 1 (base image) is a regular <img>, always visible
 *   - Canvas sits on top, draws Layer 2 ONLY within spotlight + echo regions
 *   - Grid canvas sits above both for subtle animated grid
 *   - UI elements float on top with parallax + inversion
 *
 * Features:
 *   - Circular spotlight cursor reveals Layer 2 beneath Layer 1
 *   - Motion echo trails on fast movement
 *   - Subtle animated background grid reacts to cursor
 *   - Dynamic UI element inversion when spotlight passes over
 *   - Light parallax on UI elements (opposite to cursor)
 *   - Touch support (tap & drag to reveal)
 *
 * Performance target: 60fps
 */

(function () {
  'use strict';

  // --- Configuration ---
  const CONFIG = {
    spotlight: {
      radius: 160,            // Core visible radius
      smoothing: 0.08,        // Lower = more lag/smoothness
      edgeSoftness: 80,       // Feather beyond radius
    },
    echoes: {
      maxCount: 12,
      fadeSpeed: 0.018,        // Slower fade = longer trails
      minVelocity: 5,
      spawnInterval: 40,
    },
    grid: {
      size: 60,
      opacity: 0.035,
      reactivity: 0.25,
    },
    parallax: {
      amount: 10,
    },
    inversion: {
      threshold: 0.6,
    },
    mobile: {
      spotlightRadius: 100,
    }
  };

  // --- State ---
  let mouse = { x: -9999, y: -9999 };
  let smoothMouse = { x: -9999, y: -9999 };
  let prevMouse = { x: -9999, y: -9999 };
  let velocity = 0;
  let echoes = [];
  let lastEchoTime = 0;
  let isTouch = false;
  let isTouching = false;
  let isHovering = false;
  let animationId = null;
  let layer2Image = null;
  let layer2Loaded = false;

  // --- DOM References ---
  let revealCanvas, revealCtx;
  let gridCanvas, gridCtx;
  let heroEl;
  let uiElements = [];

  // --- Initialization ---
  function init() {
    heroEl = document.getElementById('prntd-hero');
    if (!heroEl) return;

    const layer2El = heroEl.querySelector('.hero-layer-2');
    if (!layer2El) return;

    // Load Layer 2 as an offscreen image for canvas drawing
    layer2Image = new Image();
    layer2Image.crossOrigin = 'anonymous';
    layer2Image.onload = function () {
      layer2Loaded = true;
    };

    // Get Layer 2 source — either from img src or data attribute
    if (layer2El.tagName === 'IMG') {
      layer2Image.src = layer2El.src;
      // Hide the DOM element — we'll draw it ourselves on canvas
      layer2El.style.visibility = 'hidden';
    } else {
      // It's a placeholder div, check for data attribute
      var src = layer2El.getAttribute('data-src');
      if (src) {
        layer2Image.src = src;
        layer2El.style.visibility = 'hidden';
      }
    }

    // Create reveal canvas (draws layer 2 within spotlight regions)
    revealCanvas = document.createElement('canvas');
    revealCanvas.className = 'hero-reveal-canvas';
    heroEl.appendChild(revealCanvas);
    revealCtx = revealCanvas.getContext('2d');

    // Create grid canvas
    gridCanvas = document.createElement('canvas');
    gridCanvas.className = 'hero-grid-canvas';
    gridCanvas.style.opacity = CONFIG.grid.opacity;
    heroEl.appendChild(gridCanvas);
    gridCtx = gridCanvas.getContext('2d');

    // Collect UI elements for inversion + parallax
    uiElements = Array.from(heroEl.querySelectorAll('[data-hero-ui]'));

    // Size canvases
    resize();

    // Events
    window.addEventListener('resize', debounce(resize, 200));

    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
      isTouch = true;
      heroEl.addEventListener('touchstart', onTouchStart, { passive: true });
      heroEl.addEventListener('touchmove', onTouchMove, { passive: true });
      heroEl.addEventListener('touchend', onTouchEnd, { passive: true });
    }

    heroEl.addEventListener('mousemove', onMouseMove);
    heroEl.addEventListener('mouseenter', onMouseEnter);
    heroEl.addEventListener('mouseleave', onMouseLeave);

    // Start render loop
    animationId = requestAnimationFrame(render);
  }

  function resize() {
    var rect = heroEl.getBoundingClientRect();
    var dpr = Math.min(window.devicePixelRatio || 1, 2);

    revealCanvas.width = rect.width * dpr;
    revealCanvas.height = rect.height * dpr;
    revealCanvas.style.width = rect.width + 'px';
    revealCanvas.style.height = rect.height + 'px';
    revealCtx.setTransform(dpr, 0, 0, dpr, 0, 0);

    gridCanvas.width = rect.width * dpr;
    gridCanvas.height = rect.height * dpr;
    gridCanvas.style.width = rect.width + 'px';
    gridCanvas.style.height = rect.height + 'px';
    gridCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  // --- Utility ---
  function debounce(fn, ms) {
    var timer;
    return function () {
      clearTimeout(timer);
      timer = setTimeout(fn, ms);
    };
  }

  // --- Event Handlers ---
  function onMouseMove(e) {
    var rect = heroEl.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  }

  function onMouseEnter(e) {
    isHovering = true;
    var rect = heroEl.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
    // Snap smooth cursor to avoid trailing from edge
    smoothMouse.x = mouse.x;
    smoothMouse.y = mouse.y;
    heroEl.classList.add('hero-active');
  }

  function onMouseLeave() {
    isHovering = false;
    heroEl.classList.remove('hero-active');
    // Remove inversion from all UI elements
    uiElements.forEach(function (el) {
      el.classList.remove('hero-inverted');
    });
  }

  function onTouchStart(e) {
    isTouching = true;
    var touch = e.touches[0];
    var rect = heroEl.getBoundingClientRect();
    mouse.x = touch.clientX - rect.left;
    mouse.y = touch.clientY - rect.top;
    smoothMouse.x = mouse.x;
    smoothMouse.y = mouse.y;
    heroEl.classList.add('hero-active');
  }

  function onTouchMove(e) {
    if (!isTouching) return;
    var touch = e.touches[0];
    var rect = heroEl.getBoundingClientRect();
    mouse.x = touch.clientX - rect.left;
    mouse.y = touch.clientY - rect.top;
  }

  function onTouchEnd() {
    isTouching = false;
    heroEl.classList.remove('hero-active');
    // Fade out — move cursor off canvas
    mouse.x = -9999;
    mouse.y = -9999;
  }

  // --- Render Loop ---
  function render() {
    var active = isTouch ? isTouching : isHovering;

    // Smooth cursor position (lerp)
    if (active) {
      smoothMouse.x += (mouse.x - smoothMouse.x) * CONFIG.spotlight.smoothing;
      smoothMouse.y += (mouse.y - smoothMouse.y) * CONFIG.spotlight.smoothing;
    } else if (!isTouch) {
      // When not hovering on desktop, smoothly move cursor offscreen
      smoothMouse.x += (-9999 - smoothMouse.x) * 0.05;
      smoothMouse.y += (-9999 - smoothMouse.y) * 0.05;
    }

    // Calculate velocity
    var dx = smoothMouse.x - prevMouse.x;
    var dy = smoothMouse.y - prevMouse.y;
    velocity = Math.sqrt(dx * dx + dy * dy);
    prevMouse.x = smoothMouse.x;
    prevMouse.y = smoothMouse.y;

    // Spawn echoes
    if (active) {
      spawnEchoes();
    }

    // Fade echoes
    fadeEchoes();

    // Draw
    drawReveal();
    drawGrid();

    if (active) {
      updateParallax();
      updateInversion();
    }

    animationId = requestAnimationFrame(render);
  }

  // --- Echo Management ---
  function spawnEchoes() {
    var now = Date.now();
    if (velocity > CONFIG.echoes.minVelocity && now - lastEchoTime > CONFIG.echoes.spawnInterval) {
      echoes.push({
        x: smoothMouse.x,
        y: smoothMouse.y,
        opacity: 0.5,
        radius: (isTouch ? CONFIG.mobile.spotlightRadius : CONFIG.spotlight.radius) * 0.85
      });
      if (echoes.length > CONFIG.echoes.maxCount) {
        echoes.shift();
      }
      lastEchoTime = now;
    }
  }

  function fadeEchoes() {
    for (var i = echoes.length - 1; i >= 0; i--) {
      echoes[i].opacity -= CONFIG.echoes.fadeSpeed;
      if (echoes[i].opacity <= 0) {
        echoes.splice(i, 1);
      }
    }
  }

  // --- Drawing: Reveal Layer 2 through spotlight ---
  function drawReveal() {
    var rect = heroEl.getBoundingClientRect();
    var w = rect.width;
    var h = rect.height;
    var radius = isTouch ? CONFIG.mobile.spotlightRadius : CONFIG.spotlight.radius;
    var soft = CONFIG.spotlight.edgeSoftness;

    revealCtx.clearRect(0, 0, w, h);

    if (!layer2Loaded) return;

    var active = isTouch ? isTouching : isHovering;
    var hasEchoes = echoes.length > 0;

    if (!active && !hasEchoes) return;

    // Strategy: 
    // 1. Build a mask in a temporary approach: draw circles as the clipping region
    // 2. Draw layer 2 image clipped to those regions
    // We use globalCompositeOperation to achieve soft-edged circular masking.

    revealCtx.save();

    // Step 1: Draw soft spotlight circles as white-on-transparent (alpha mask)
    // We'll draw the alpha shapes first, then use 'source-in' to composite layer 2

    // Draw main spotlight with multi-stop gradient for premium soft edge
    if (active || smoothMouse.x > -1000) {
      var outerR = radius + soft;
      var grad = revealCtx.createRadialGradient(
        smoothMouse.x, smoothMouse.y, 0,
        smoothMouse.x, smoothMouse.y, outerR
      );
      // Multi-stop for smooth, cinematic falloff
      grad.addColorStop(0,    'rgba(255,255,255,1)');
      grad.addColorStop(0.35, 'rgba(255,255,255,1)');
      grad.addColorStop(0.5,  'rgba(255,255,255,0.85)');
      grad.addColorStop(0.65, 'rgba(255,255,255,0.55)');
      grad.addColorStop(0.8,  'rgba(255,255,255,0.2)');
      grad.addColorStop(0.92, 'rgba(255,255,255,0.05)');
      grad.addColorStop(1,    'rgba(255,255,255,0)');
      revealCtx.fillStyle = grad;
      revealCtx.beginPath();
      revealCtx.arc(smoothMouse.x, smoothMouse.y, outerR, 0, Math.PI * 2);
      revealCtx.fill();
    }

    // Draw echo trails with smooth falloff
    for (var i = 0; i < echoes.length; i++) {
      var echo = echoes[i];
      var echoGrad = revealCtx.createRadialGradient(
        echo.x, echo.y, 0,
        echo.x, echo.y, echo.radius
      );
      var a = echo.opacity;
      echoGrad.addColorStop(0,    'rgba(255,255,255,' + a + ')');
      echoGrad.addColorStop(0.3,  'rgba(255,255,255,' + (a * 0.8) + ')');
      echoGrad.addColorStop(0.6,  'rgba(255,255,255,' + (a * 0.35) + ')');
      echoGrad.addColorStop(0.85, 'rgba(255,255,255,' + (a * 0.08) + ')');
      echoGrad.addColorStop(1,    'rgba(255,255,255,0)');
      revealCtx.fillStyle = echoGrad;
      revealCtx.beginPath();
      revealCtx.arc(echo.x, echo.y, echo.radius, 0, Math.PI * 2);
      revealCtx.fill();
    }

    // Step 2: Composite layer 2 image using 'source-in' — only draws where alpha already exists
    revealCtx.globalCompositeOperation = 'source-in';

    // Draw layer 2 image covering the full canvas
    // We need to handle aspect ratio: cover the hero area
    var imgW = layer2Image.naturalWidth;
    var imgH = layer2Image.naturalHeight;
    var scale = Math.max(w / imgW, h / imgH);
    var drawW = imgW * scale;
    var drawH = imgH * scale;
    var drawX = (w - drawW) / 2;
    var drawY = (h - drawH) / 2;

    revealCtx.drawImage(layer2Image, drawX, drawY, drawW, drawH);

    revealCtx.restore();
  }

  // --- Drawing: Grid ---
  function drawGrid() {
    var rect = heroEl.getBoundingClientRect();
    var w = rect.width;
    var h = rect.height;
    var size = CONFIG.grid.size;

    gridCtx.clearRect(0, 0, w, h);
    gridCtx.strokeStyle = 'rgba(255,255,255,0.4)';
    gridCtx.lineWidth = 0.5;

    // Offset based on cursor position for subtle reactivity
    var cx = smoothMouse.x > -1000 ? smoothMouse.x : w / 2;
    var cy = smoothMouse.y > -1000 ? smoothMouse.y : h / 2;
    var offsetX = ((cx / w) - 0.5) * size * CONFIG.grid.reactivity;
    var offsetY = ((cy / h) - 0.5) * size * CONFIG.grid.reactivity;

    gridCtx.beginPath();
    for (var x = (offsetX % size + size) % size; x < w; x += size) {
      gridCtx.moveTo(x, 0);
      gridCtx.lineTo(x, h);
    }
    for (var y = (offsetY % size + size) % size; y < h; y += size) {
      gridCtx.moveTo(0, y);
      gridCtx.lineTo(w, y);
    }
    gridCtx.stroke();
  }

  // --- Parallax ---
  function updateParallax() {
    var rect = heroEl.getBoundingClientRect();
    var centerX = rect.width / 2;
    var centerY = rect.height / 2;
    var amt = CONFIG.parallax.amount;

    var px = -((smoothMouse.x - centerX) / centerX) * amt;
    var py = -((smoothMouse.y - centerY) / centerY) * amt;

    for (var i = 0; i < uiElements.length; i++) {
      uiElements[i].style.transform = 'translate(' + px.toFixed(1) + 'px, ' + py.toFixed(1) + 'px)';
    }
  }

  // --- Inversion ---
  function updateInversion() {
    var radius = isTouch ? CONFIG.mobile.spotlightRadius : CONFIG.spotlight.radius;
    var threshold = radius * (1 + CONFIG.inversion.threshold);
    var heroRect = heroEl.getBoundingClientRect();

    for (var i = 0; i < uiElements.length; i++) {
      var el = uiElements[i];
      var elRect = el.getBoundingClientRect();
      var elCenterX = elRect.left - heroRect.left + elRect.width / 2;
      var elCenterY = elRect.top - heroRect.top + elRect.height / 2;

      var dist = Math.sqrt(
        (smoothMouse.x - elCenterX) * (smoothMouse.x - elCenterX) +
        (smoothMouse.y - elCenterY) * (smoothMouse.y - elCenterY)
      );

      if (dist < threshold) {
        el.classList.add('hero-inverted');
      } else {
        el.classList.remove('hero-inverted');
      }
    }
  }

  // --- Cleanup ---
  function destroy() {
    if (animationId) cancelAnimationFrame(animationId);
    window.removeEventListener('resize', resize);
    if (heroEl) {
      heroEl.removeEventListener('mousemove', onMouseMove);
      heroEl.removeEventListener('mouseenter', onMouseEnter);
      heroEl.removeEventListener('mouseleave', onMouseLeave);
    }
  }

  // --- Boot ---
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.__prntdHero = { destroy: destroy, CONFIG: CONFIG };
})();

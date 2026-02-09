/**
 * PRNTD Hero Interaction — Circular Reveal Cursor
 * 
 * Dual-layer image reveal with:
 * - Circular spotlight cursor that reveals Layer 2 beneath Layer 1
 * - Motion echo trails on fast movement
 * - Subtle animated background grid
 * - Dynamic UI element inversion when spotlight passes over
 * - Light parallax on UI elements
 * 
 * Performance target: 60fps
 */

(function () {
  'use strict';

  // --- Configuration ---
  const CONFIG = {
    spotlight: {
      radius: 80,
      smoothing: 0.12,        // Lerp factor (lower = smoother, more delay)
      edgeSoftness: 40,       // Feather pixels on spotlight edge
    },
    echoes: {
      maxCount: 8,
      fadeSpeed: 0.03,
      minVelocity: 8,         // Min px/frame to spawn echo
      spawnInterval: 60,      // ms between echo spawns
    },
    grid: {
      size: 60,
      opacity: 0.04,
      reactivity: 0.3,        // How much grid shifts with cursor (0-1)
    },
    parallax: {
      amount: 8,              // Max px shift for UI elements
    },
    inversion: {
      transitionMs: 300,
    },
    mobile: {
      enabled: true,
      spotlightRadius: 60,
    }
  };

  // --- State ---
  let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  let smoothMouse = { x: mouse.x, y: mouse.y };
  let prevMouse = { x: mouse.x, y: mouse.y };
  let velocity = 0;
  let echoes = [];
  let lastEchoTime = 0;
  let isTouch = false;
  let isTouching = false;
  let animationId = null;

  // --- DOM References ---
  let canvas, ctx;
  let heroEl, layer1, layer2, gridCanvas, gridCtx;
  let uiElements = [];

  // --- Initialization ---
  function init() {
    heroEl = document.getElementById('prntd-hero');
    if (!heroEl) return;

    layer1 = heroEl.querySelector('.hero-layer-1');
    layer2 = heroEl.querySelector('.hero-layer-2');
    if (!layer1 || !layer2) return;

    // Create reveal canvas (sits on top of layer 1, masks to reveal layer 2)
    canvas = document.createElement('canvas');
    canvas.className = 'hero-reveal-canvas';
    canvas.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:3;';
    heroEl.appendChild(canvas);
    ctx = canvas.getContext('2d');

    // Create grid canvas
    gridCanvas = document.createElement('canvas');
    gridCanvas.className = 'hero-grid-canvas';
    gridCanvas.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:1;opacity:' + CONFIG.grid.opacity + ';';
    heroEl.appendChild(gridCanvas);
    gridCtx = gridCanvas.getContext('2d');

    // Collect UI elements for inversion + parallax
    uiElements = Array.from(heroEl.querySelectorAll('[data-hero-ui]'));

    // Size canvases
    resize();

    // Events
    window.addEventListener('resize', resize);
    
    if ('ontouchstart' in window) {
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
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = heroEl.getBoundingClientRect();

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    gridCanvas.width = rect.width * dpr;
    gridCanvas.height = rect.height * dpr;
    gridCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  // --- Event Handlers ---
  function onMouseMove(e) {
    const rect = heroEl.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  }

  function onMouseEnter() {
    heroEl.classList.add('hero-active');
  }

  function onMouseLeave() {
    heroEl.classList.remove('hero-active');
  }

  function onTouchStart(e) {
    isTouching = true;
    const touch = e.touches[0];
    const rect = heroEl.getBoundingClientRect();
    mouse.x = touch.clientX - rect.left;
    mouse.y = touch.clientY - rect.top;
    smoothMouse.x = mouse.x;
    smoothMouse.y = mouse.y;
    heroEl.classList.add('hero-active');
  }

  function onTouchMove(e) {
    if (!isTouching) return;
    const touch = e.touches[0];
    const rect = heroEl.getBoundingClientRect();
    mouse.x = touch.clientX - rect.left;
    mouse.y = touch.clientY - rect.top;
  }

  function onTouchEnd() {
    isTouching = false;
    heroEl.classList.remove('hero-active');
  }

  // --- Render Loop ---
  function render() {
    // Smooth cursor position (lerp)
    smoothMouse.x += (mouse.x - smoothMouse.x) * CONFIG.spotlight.smoothing;
    smoothMouse.y += (mouse.y - smoothMouse.y) * CONFIG.spotlight.smoothing;

    // Calculate velocity
    const dx = smoothMouse.x - prevMouse.x;
    const dy = smoothMouse.y - prevMouse.y;
    velocity = Math.sqrt(dx * dx + dy * dy);
    prevMouse.x = smoothMouse.x;
    prevMouse.y = smoothMouse.y;

    // On mobile, only render when touching
    if (isTouch && !isTouching) {
      drawGrid();
      animationId = requestAnimationFrame(render);
      return;
    }

    // Spawn echoes
    spawnEchoes();

    // Draw
    drawReveal();
    drawGrid();
    updateParallax();
    updateInversion();

    animationId = requestAnimationFrame(render);
  }

  // --- Drawing ---
  function drawReveal() {
    const w = canvas.width / (Math.min(window.devicePixelRatio || 1, 2));
    const h = canvas.height / (Math.min(window.devicePixelRatio || 1, 2));
    const radius = isTouch ? CONFIG.mobile.spotlightRadius : CONFIG.spotlight.radius;

    ctx.clearRect(0, 0, w, h);

    // Fill entire canvas black (this will mask layer 2 where NOT spotlighted)
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, w, h);

    // Cut out spotlight circle (reveals layer 2 beneath)
    ctx.globalCompositeOperation = 'destination-out';

    // Main spotlight
    const gradient = ctx.createRadialGradient(
      smoothMouse.x, smoothMouse.y, radius * 0.3,
      smoothMouse.x, smoothMouse.y, radius + CONFIG.spotlight.edgeSoftness
    );
    gradient.addColorStop(0, 'rgba(0,0,0,1)');
    gradient.addColorStop(0.7, 'rgba(0,0,0,0.8)');
    gradient.addColorStop(1, 'rgba(0,0,0,0)');

    ctx.beginPath();
    ctx.arc(smoothMouse.x, smoothMouse.y, radius + CONFIG.spotlight.edgeSoftness, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();

    // Echo trails
    for (let i = echoes.length - 1; i >= 0; i--) {
      const echo = echoes[i];
      echo.opacity -= CONFIG.echoes.fadeSpeed;
      if (echo.opacity <= 0) {
        echoes.splice(i, 1);
        continue;
      }
      const echoGrad = ctx.createRadialGradient(
        echo.x, echo.y, radius * 0.1,
        echo.x, echo.y, radius * 0.8
      );
      echoGrad.addColorStop(0, 'rgba(0,0,0,' + echo.opacity + ')');
      echoGrad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.beginPath();
      ctx.arc(echo.x, echo.y, radius * 0.8, 0, Math.PI * 2);
      ctx.fillStyle = echoGrad;
      ctx.fill();
    }

    ctx.globalCompositeOperation = 'source-over';
  }

  function spawnEchoes() {
    const now = Date.now();
    if (velocity > CONFIG.echoes.minVelocity && now - lastEchoTime > CONFIG.echoes.spawnInterval) {
      echoes.push({
        x: smoothMouse.x,
        y: smoothMouse.y,
        opacity: 0.5
      });
      if (echoes.length > CONFIG.echoes.maxCount) {
        echoes.shift();
      }
      lastEchoTime = now;
    }
  }

  function drawGrid() {
    const w = gridCanvas.width / (Math.min(window.devicePixelRatio || 1, 2));
    const h = gridCanvas.height / (Math.min(window.devicePixelRatio || 1, 2));
    const size = CONFIG.grid.size;

    gridCtx.clearRect(0, 0, w, h);
    gridCtx.strokeStyle = 'rgba(255,255,255,0.5)';
    gridCtx.lineWidth = 0.5;

    // Offset based on cursor position
    const offsetX = (smoothMouse.x / w - 0.5) * size * CONFIG.grid.reactivity;
    const offsetY = (smoothMouse.y / h - 0.5) * size * CONFIG.grid.reactivity;

    gridCtx.beginPath();
    for (let x = offsetX % size; x < w; x += size) {
      gridCtx.moveTo(x, 0);
      gridCtx.lineTo(x, h);
    }
    for (let y = offsetY % size; y < h; y += size) {
      gridCtx.moveTo(0, y);
      gridCtx.lineTo(w, y);
    }
    gridCtx.stroke();
  }

  function updateParallax() {
    if (!heroEl) return;
    const rect = heroEl.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const amt = CONFIG.parallax.amount;

    // Opposite direction parallax
    const px = -((smoothMouse.x - centerX) / centerX) * amt;
    const py = -((smoothMouse.y - centerY) / centerY) * amt;

    uiElements.forEach(function (el) {
      el.style.transform = 'translate(' + px.toFixed(2) + 'px, ' + py.toFixed(2) + 'px)';
    });
  }

  function updateInversion() {
    const radius = isTouch ? CONFIG.mobile.spotlightRadius : CONFIG.spotlight.radius;

    uiElements.forEach(function (el) {
      const elRect = el.getBoundingClientRect();
      const heroRect = heroEl.getBoundingClientRect();
      const elCenterX = elRect.left - heroRect.left + elRect.width / 2;
      const elCenterY = elRect.top - heroRect.top + elRect.height / 2;

      const dist = Math.sqrt(
        Math.pow(smoothMouse.x - elCenterX, 2) +
        Math.pow(smoothMouse.y - elCenterY, 2)
      );

      if (dist < radius + CONFIG.spotlight.edgeSoftness) {
        el.classList.add('hero-inverted');
      } else {
        el.classList.remove('hero-inverted');
      }
    });
  }

  // --- Cleanup ---
  function destroy() {
    if (animationId) cancelAnimationFrame(animationId);
    window.removeEventListener('resize', resize);
  }

  // --- Boot ---
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose for debugging
  window.__prntdHero = { destroy: destroy, CONFIG: CONFIG };
})();

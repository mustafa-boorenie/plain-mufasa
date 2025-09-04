// Custom Cursor Implementation with Hover Scaling
document.addEventListener('DOMContentLoaded', function() {
  // Create custom cursor element
  const cursor = document.createElement('div');
  cursor.id = 'custom-cursor';
  cursor.style.cssText = `
    position: fixed;
    pointer-events: none;
    z-index: 9999;
    transition: transform 0.1s ease-out;
    transform-origin: center;
  `;
  document.body.appendChild(cursor);

  // Get the custom cursor image from CSS custom property
  const bodyStyles = getComputedStyle(document.body);
  const cursorImage = bodyStyles.getPropertyValue('--custom-cursor').trim();

  if (cursorImage) {
    cursor.style.backgroundImage = `url(${cursorImage})`;
    cursor.style.backgroundSize = 'contain';
    cursor.style.backgroundRepeat = 'no-repeat';
    cursor.style.width = '24px'; // Default cursor size
    cursor.style.height = '24px';
  }

  let mouseX = 0;
  let mouseY = 0;
  let cursorX = 0;
  let cursorY = 0;

  // Track mouse movement
  document.addEventListener('mousemove', function(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // Smooth cursor following animation
  function updateCursor() {
    const dx = mouseX - cursorX;
    const dy = mouseY - cursorY;

    cursorX += dx * 0.25; // Smooth following factor
    cursorY += dy * 0.25;

    cursor.style.left = cursorX - 12 + 'px'; // Center the cursor
    cursor.style.top = cursorY - 12 + 'px';

    requestAnimationFrame(updateCursor);
  }

  updateCursor();

  // Handle hover scaling
  let isHovering = false;

  // Function to check if element has dark/black background
  function hasDarkBackground(element) {
    if (!element) return false;

    const computedStyle = getComputedStyle(element);
    const backgroundColor = computedStyle.backgroundColor;

    // Check for transparent or no background
    if (backgroundColor === 'transparent' || backgroundColor === 'rgba(0, 0, 0, 0)') {
      return false;
    }

    // Convert RGB/RGBA to brightness value
    const rgbMatch = backgroundColor.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    const rgbaMatch = backgroundColor.match(/^rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)$/);

    let r, g, b;
    if (rgbMatch) {
      r = parseInt(rgbMatch[1]);
      g = parseInt(rgbMatch[2]);
      b = parseInt(rgbMatch[3]);
    } else if (rgbaMatch) {
      r = parseInt(rgbaMatch[1]);
      g = parseInt(rgbaMatch[2]);
      b = parseInt(rgbaMatch[3]);
    } else {
      return false;
    }

    // Calculate brightness (YIQ formula)
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;

    // Consider it dark if brightness is below 128 (out of 255)
    return brightness < 128;
  }

  // Function to update cursor color inversion
  function updateCursorInversion(e) {
    const element = document.elementFromPoint(e.clientX, e.clientY);
    if (hasDarkBackground(element)) {
      cursor.style.filter = 'invert(100%)';
    } else {
      cursor.style.filter = 'none';
    }
  }

  document.addEventListener('mouseenter', function(e) {
    if (e.target.matches('a, button, [role="button"], input[type="submit"], input[type="button"], .clickable, [onclick]')) {
      isHovering = true;
      cursor.style.transform = 'scale(1.5)';
    }
  }, true);

  document.addEventListener('mouseleave', function(e) {
    if (e.target.matches('a, button, [role="button"], input[type="submit"], input[type="button"], .clickable, [onclick]')) {
      isHovering = false;
      cursor.style.transform = 'scale(1)';
    }
  }, true);

  // Add mousemove listener for cursor color inversion
  document.addEventListener('mousemove', updateCursorInversion);

  // Prevent cursor from changing to pointer on any element
  const style = document.createElement('style');
  style.textContent = `
    * {
      cursor: none !important;
    }
    #custom-cursor {
      cursor: none !important;
    }
  `;
  document.head.appendChild(style);
});

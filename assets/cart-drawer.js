/**
 * PRNTD Cart Drawer
 * Slide-out cart experience with upsell, free shipping nudge, and editorial feel
 */
(function() {
  'use strict';

  const FREE_SHIPPING_THRESHOLD = 15000; // $150 in cents
  const CART_DRAWER_ID = 'prntd-cart-drawer';

  // Create drawer HTML
  function createDrawer() {
    const drawer = document.createElement('div');
    drawer.id = CART_DRAWER_ID;
    drawer.className = 'cart-drawer';
    drawer.innerHTML = `
      <div class="cart-drawer__overlay" data-cart-close></div>
      <div class="cart-drawer__panel">
        <div class="cart-drawer__header">
          <h2 class="cart-drawer__title">Your Bag</h2>
          <button class="cart-drawer__close" data-cart-close aria-label="Close cart">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M15 5L5 15M5 5l10 10" stroke="currentColor" stroke-width="1.5"/>
            </svg>
          </button>
        </div>
        
        <div class="cart-drawer__shipping-bar">
          <div class="cart-drawer__shipping-text"></div>
          <div class="cart-drawer__shipping-track">
            <div class="cart-drawer__shipping-progress"></div>
          </div>
        </div>
        
        <div class="cart-drawer__body">
          <div class="cart-drawer__items"></div>
          <div class="cart-drawer__empty">
            <p class="cart-drawer__empty-text">Nothing here yet</p>
            <p class="cart-drawer__empty-sub">Every piece tells a story — find yours.</p>
            <a href="/collections/all" class="prntd-btn cart-drawer__shop-btn">Explore the Collection</a>
          </div>
        </div>
        
        <div class="cart-drawer__footer">
          <div class="cart-drawer__subtotal">
            <span>Subtotal</span>
            <span class="cart-drawer__subtotal-amount"></span>
          </div>
          <p class="cart-drawer__tax-note">Shipping & taxes calculated at checkout</p>
          <a href="/checkout" class="cart-drawer__checkout-btn">
            Checkout
          </a>
          <a href="/collections/all" class="cart-drawer__continue">Continue Shopping</a>
        </div>
      </div>
    `;
    document.body.appendChild(drawer);
    return drawer;
  }

  // Build item HTML
  function renderItem(item) {
    const img = item.image ? item.image.replace(/(\.[^.]+)$/, '_200x$1') : '';
    return `
      <div class="cart-drawer__item" data-line="${item.key}">
        <a href="${item.url}" class="cart-drawer__item-image">
          ${img ? `<img src="${img}" alt="${item.title}" loading="lazy">` : ''}
        </a>
        <div class="cart-drawer__item-details">
          <a href="${item.url}" class="cart-drawer__item-title">${item.product_title}</a>
          ${item.variant_title ? `<span class="cart-drawer__item-variant">${item.variant_title}</span>` : ''}
          <div class="cart-drawer__item-bottom">
            <div class="cart-drawer__qty">
              <button class="cart-drawer__qty-btn" data-action="minus" data-key="${item.key}" aria-label="Decrease quantity">−</button>
              <span class="cart-drawer__qty-value">${item.quantity}</span>
              <button class="cart-drawer__qty-btn" data-action="plus" data-key="${item.key}" aria-label="Increase quantity">+</button>
            </div>
            <span class="cart-drawer__item-price">${formatMoney(item.final_line_price)}</span>
          </div>
        </div>
        <button class="cart-drawer__item-remove" data-action="remove" data-key="${item.key}" aria-label="Remove item">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M10.5 3.5L3.5 10.5M3.5 3.5l7 7" stroke="currentColor" stroke-width="1.2"/>
          </svg>
        </button>
      </div>
    `;
  }

  // Format cents to dollars
  function formatMoney(cents) {
    return '$' + (cents / 100).toFixed(2);
  }

  // Update shipping bar
  function updateShippingBar(total) {
    const text = document.querySelector('.cart-drawer__shipping-text');
    const progress = document.querySelector('.cart-drawer__shipping-progress');
    if (!text || !progress) return;

    if (total >= FREE_SHIPPING_THRESHOLD) {
      text.innerHTML = '🎉 You\'ve unlocked <strong>free shipping!</strong>';
      progress.style.width = '100%';
      progress.classList.add('cart-drawer__shipping-progress--complete');
    } else {
      const remaining = FREE_SHIPPING_THRESHOLD - total;
      text.innerHTML = `Spend <strong>${formatMoney(remaining)}</strong> more for free shipping`;
      const pct = Math.min((total / FREE_SHIPPING_THRESHOLD) * 100, 100);
      progress.style.width = pct + '%';
      progress.classList.remove('cart-drawer__shipping-progress--complete');
    }
  }

  // Fetch cart and render
  async function refreshCart() {
    try {
      const res = await fetch('/cart.js');
      const cart = await res.json();
      
      const itemsEl = document.querySelector('.cart-drawer__items');
      const emptyEl = document.querySelector('.cart-drawer__empty');
      const footerEl = document.querySelector('.cart-drawer__footer');
      const subtotalEl = document.querySelector('.cart-drawer__subtotal-amount');
      const shippingBar = document.querySelector('.cart-drawer__shipping-bar');
      
      // Update cart count badges
      document.querySelectorAll('.cart-count').forEach(el => {
        el.textContent = cart.item_count;
      });

      if (cart.items.length === 0) {
        if (itemsEl) itemsEl.style.display = 'none';
        if (emptyEl) emptyEl.style.display = 'flex';
        if (footerEl) footerEl.style.display = 'none';
        if (shippingBar) shippingBar.style.display = 'none';
      } else {
        if (itemsEl) {
          itemsEl.style.display = 'block';
          itemsEl.innerHTML = cart.items.map(renderItem).join('');
        }
        if (emptyEl) emptyEl.style.display = 'none';
        if (footerEl) footerEl.style.display = 'block';
        if (shippingBar) shippingBar.style.display = 'block';
        if (subtotalEl) subtotalEl.textContent = formatMoney(cart.total_price);
        updateShippingBar(cart.total_price);
      }
    } catch (e) {
      console.error('Cart fetch failed:', e);
    }
  }

  // Update item quantity
  async function updateQuantity(key, change) {
    try {
      const res = await fetch('/cart.js');
      const cart = await res.json();
      const item = cart.items.find(i => i.key === key);
      if (!item) return;

      const newQty = Math.max(0, item.quantity + change);
      
      await fetch('/cart/change.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: key, quantity: newQty })
      });
      
      await refreshCart();
    } catch (e) {
      console.error('Cart update failed:', e);
    }
  }

  // Open / close
  function openDrawer() {
    const drawer = document.getElementById(CART_DRAWER_ID);
    if (!drawer) return;
    refreshCart();
    drawer.classList.add('cart-drawer--open');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    const drawer = document.getElementById(CART_DRAWER_ID);
    if (!drawer) return;
    drawer.classList.remove('cart-drawer--open');
    document.body.style.overflow = '';
  }

  // Event delegation
  function initEvents(drawer) {
    drawer.addEventListener('click', async (e) => {
      // Close
      if (e.target.closest('[data-cart-close]')) {
        closeDrawer();
        return;
      }
      
      // Quantity
      const qtyBtn = e.target.closest('[data-action]');
      if (qtyBtn) {
        const action = qtyBtn.dataset.action;
        const key = qtyBtn.dataset.key;
        if (action === 'minus') await updateQuantity(key, -1);
        else if (action === 'plus') await updateQuantity(key, 1);
        else if (action === 'remove') await updateQuantity(key, -999);
      }
    });

    // ESC to close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeDrawer();
    });
  }

  // Intercept all cart links / bag clicks to open drawer instead
  function interceptCartLinks() {
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[href="/cart"], .prntd-cart-link');
      if (link) {
        e.preventDefault();
        openDrawer();
      }
    });
  }

  // Intercept add-to-cart form submissions
  function interceptAddToCart() {
    document.addEventListener('submit', async (e) => {
      const form = e.target.closest('form[action*="/cart/add"]');
      if (!form) return;
      
      e.preventDefault();
      const btn = form.querySelector('[type="submit"]');
      const originalText = btn ? btn.textContent : '';
      
      if (btn) {
        btn.textContent = 'Adding...';
        btn.disabled = true;
      }
      
      try {
        const formData = new FormData(form);
        await fetch('/cart/add.js', {
          method: 'POST',
          body: formData
        });
        
        if (btn) {
          btn.textContent = 'Added ✓';
          btn.classList.add('added');
        }
        
        // Open drawer after short delay
        setTimeout(() => {
          openDrawer();
          if (btn) {
            btn.textContent = originalText;
            btn.disabled = false;
            btn.classList.remove('added');
          }
        }, 600);
        
      } catch (err) {
        console.error('Add to cart failed:', err);
        if (btn) {
          btn.textContent = originalText;
          btn.disabled = false;
        }
      }
    });
  }

  // Init
  function init() {
    const drawer = createDrawer();
    initEvents(drawer);
    interceptCartLinks();
    interceptAddToCart();
    refreshCart();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose for external use
  window.PRNTDCart = { open: openDrawer, close: closeDrawer, refresh: refreshCart };
})();

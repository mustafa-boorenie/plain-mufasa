/**
 * PRNTD Product Page — Interactions
 * - Image gallery (thumbnail switching)
 * - Variant selection (option buttons → hidden select sync)
 * - AJAX add to cart
 * - Price/availability updates on variant change
 */

(function () {
  'use strict';

  // --- Image Gallery ---
  var thumbs = document.querySelectorAll('.pdp-thumb');
  var mainImage = document.getElementById('pdp-main-image');

  thumbs.forEach(function (thumb) {
    thumb.addEventListener('click', function () {
      var url = this.getAttribute('data-image-url');
      if (mainImage && url) {
        mainImage.style.opacity = '0';
        var img = mainImage;
        setTimeout(function () {
          img.src = url;
          img.onload = function () {
            img.style.opacity = '1';
          };
        }, 200);
      }
      thumbs.forEach(function (t) { t.classList.remove('active'); });
      this.classList.add('active');
    });
  });

  // --- Variant Selection ---
  var optionBtns = document.querySelectorAll('.pdp-option-btn');
  var productSelect = document.getElementById('product-select');
  var addToCartBtn = document.querySelector('.pdp-add-to-bag');
  var priceEl = document.querySelector('.pdp-price');

  if (optionBtns.length > 0 && productSelect) {
    var options = productSelect.querySelectorAll('option');
    var currentOptions = [];

    // Initialize from selected variant
    var selectedOpt = productSelect.querySelector('option[selected]') || options[0];
    if (selectedOpt) {
      try {
        currentOptions = JSON.parse(selectedOpt.getAttribute('data-options') || '[]');
      } catch (e) {
        currentOptions = [];
      }
    }

    optionBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var idx = parseInt(this.getAttribute('data-option-index'));
        var val = this.getAttribute('data-value');

        // Update selection state
        currentOptions[idx] = val;

        // Update button active states
        var siblings = this.parentElement.querySelectorAll('.pdp-option-btn');
        siblings.forEach(function (s) { s.classList.remove('selected'); });
        this.classList.add('selected');

        // Find matching variant
        for (var i = 0; i < options.length; i++) {
          var opts;
          try {
            opts = JSON.parse(options[i].getAttribute('data-options') || '[]');
          } catch (e) {
            continue;
          }

          var match = true;
          for (var j = 0; j < currentOptions.length; j++) {
            if (opts[j] !== currentOptions[j]) { match = false; break; }
          }

          if (match) {
            productSelect.value = options[i].value;
            var isAvailable = options[i].getAttribute('data-available') === 'true';
            var price = options[i].getAttribute('data-price');
            var comparePrice = options[i].getAttribute('data-compare-price');
            var variantImageUrl = options[i].getAttribute('data-image-url');

            // Update add to cart button
            if (!isAvailable) {
              addToCartBtn.disabled = true;
              addToCartBtn.textContent = 'Sold Out';
            } else {
              addToCartBtn.disabled = false;
              addToCartBtn.textContent = 'Add to Bag';
            }

            // Update price display
            if (priceEl && price) {
              var priceHTML = '';
              if (comparePrice && comparePrice !== price) {
                priceHTML += '<span class="pdp-price-compare">' + comparePrice + '</span> ';
              }
              priceHTML += price;
              priceEl.innerHTML = priceHTML;
            }

            // Update main image if variant has its own image
            if (variantImageUrl && mainImage) {
              mainImage.style.opacity = '0';
              setTimeout(function () {
                mainImage.src = variantImageUrl;
                mainImage.onload = function () {
                  mainImage.style.opacity = '1';
                };
              }, 200);

              // Also highlight matching thumb
              thumbs.forEach(function (t) {
                t.classList.remove('active');
                if (t.getAttribute('data-image-url') === variantImageUrl) {
                  t.classList.add('active');
                }
              });
            }

            break;
          }
        }
      });
    });
  }

  // --- AJAX Add to Cart ---
  var form = document.querySelector('.pdp-editorial form[action="/cart/add"]');
  if (form && addToCartBtn) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var formData = new FormData(form);
      var originalText = addToCartBtn.textContent.trim();

      addToCartBtn.disabled = true;
      addToCartBtn.textContent = 'Adding...';

      fetch('/cart/add.js', {
        method: 'POST',
        body: formData
      })
        .then(function (res) {
          if (!res.ok) throw new Error('Failed to add');
          return res.json();
        })
        .then(function () {
          addToCartBtn.textContent = 'Added ✓';
          addToCartBtn.classList.add('added');

          // Open cart drawer after adding
          setTimeout(function () {
            if (window.PRNTDCart) {
              window.PRNTDCart.open();
            }
            addToCartBtn.disabled = false;
            addToCartBtn.textContent = originalText;
            addToCartBtn.classList.remove('added');
          }, 600);
        })
        .catch(function () {
          addToCartBtn.disabled = false;
          addToCartBtn.textContent = originalText;
        });
    });
  }
})();

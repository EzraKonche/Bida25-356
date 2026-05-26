function getCartItems() {
  const stored = localStorage.getItem('citrusGroveCart');
  return stored ? JSON.parse(stored) : [];
}

function saveCartItems(items) {
  localStorage.setItem('citrusGroveCart', JSON.stringify(items));
}

function formatPrice(value) {
  return `P${value.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function parsePrice(priceString) {
  return Number(priceString.replace(/[^0-9.]/g, '')) || 0;
}

function buildCartItemMarkup(item) {
  const itemTotal = parsePrice(item.price) * item.quantity;
  return `
    <div class="cart-item" data-slug="${item.slug}">
      <img src="${item.image}" alt="${item.alt}" />
      <div class="cart-item-details">
        <h3>${item.name}</h3>
        <p>${item.category}</p>
        <p>Unit price: ${item.price}</p>
        <div class="quantity-controls">
          <button class="btn btn-tertiary qty-decrease" type="button" aria-label="Decrease quantity">−</button>
          <span class="quantity-value">${item.quantity}</span>
          <button class="btn btn-tertiary qty-increase" type="button" aria-label="Increase quantity">+</button>
        </div>
      </div>
      <div class="cart-item-controls">
        <p>${formatPrice(itemTotal)}</p>
        <button class="btn btn-secondary remove-item" type="button">Remove</button>
      </div>
    </div>
  `;
}

function renderCart() {
  const cartContainer = document.getElementById('cartContainer');
  const cartItems = getCartItems();
  if (!cartContainer) return;

  if (!cartItems.length) {
    cartContainer.innerHTML = `
      <div class="cart-empty">
        <h2>Your cart is empty</h2>
        <p>Browse products and add items to your cart to start shopping.</p>
        <a class="btn btn-primary" href="products.html">Browse Products</a>
      </div>
    `;
    return;
  }

  const cartContent = cartItems.map(item => buildCartItemMarkup(item)).join('');
  const totalAmount = cartItems.reduce((total, item) => total + parsePrice(item.price) * item.quantity, 0);

  cartContainer.innerHTML = `
    ${cartContent}
    <div class="cart-summary">
      <p>Cart total</p>
      <strong>${formatPrice(totalAmount)}</strong>
    </div>
  `;

  cartContainer.querySelectorAll('.remove-item').forEach(button => {
    button.addEventListener('click', (event) => {
      const slug = event.target.closest('.cart-item')?.dataset.slug;
      if (slug) {
        removeCartItem(slug);
      }
    });
  });

  cartContainer.querySelectorAll('.qty-decrease').forEach(button => {
    button.addEventListener('click', (event) => {
      const slug = event.target.closest('.cart-item')?.dataset.slug;
      if (slug) {
        updateCartQuantity(slug, -1);
      }
    });
  });

  cartContainer.querySelectorAll('.qty-increase').forEach(button => {
    button.addEventListener('click', (event) => {
      const slug = event.target.closest('.cart-item')?.dataset.slug;
      if (slug) {
        updateCartQuantity(slug, 1);
      }
    });
  });
}

function updateCartQuantity(slug, change) {
  const updatedCart = getCartItems().map(item => {
    if (item.slug !== slug) return item;
    const quantity = Math.max(1, item.quantity + change);
    return { ...item, quantity };
  });
  saveCartItems(updatedCart);
  renderCart();
  if (window.updateCartCount) {
    window.updateCartCount();
  }
}

function removeCartItem(slug) {
  const updatedCart = getCartItems().filter(item => item.slug !== slug);
  saveCartItems(updatedCart);
  renderCart();
  if (window.updateCartCount) {
    window.updateCartCount();
  }
}

function clearCart() {
  saveCartItems([]);
  renderCart();
  if (window.updateCartCount) {
    window.updateCartCount();
  }
}

window.addEventListener('DOMContentLoaded', () => {
  renderCart();
  const clearButton = document.getElementById('clearCart');
  if (clearButton) {
    clearButton.addEventListener('click', clearCart);
  }
});

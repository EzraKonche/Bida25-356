function getCartItems() {
  const stored = localStorage.getItem('citrusGroveCart');
  return stored ? JSON.parse(stored) : [];
}

function getCartQuantity() {
  return getCartItems().reduce((total, item) => total + (item.quantity || 0), 0);
}

function updateCartCount() {
  const countNode = document.getElementById('cartCount');
  if (!countNode) return;
  const total = getCartQuantity();
  countNode.textContent = total;
}

window.updateCartCount = updateCartCount;
window.addEventListener('DOMContentLoaded', updateCartCount);

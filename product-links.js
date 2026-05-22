document.addEventListener('DOMContentLoaded', () => {
  const slugify = (text) => text
    .trim()
    .toLowerCase()
    .replace(/[’'“”]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  document.querySelectorAll('.product-card').forEach((card) => {
    const nameEl = card.querySelector('.product-name');
    const btn = card.querySelector('.product-btn');

    if (nameEl && btn) {
      const productSlug = slugify(nameEl.textContent);
      btn.href = `product-detail.html?product=${productSlug}`;
    }
  });
});

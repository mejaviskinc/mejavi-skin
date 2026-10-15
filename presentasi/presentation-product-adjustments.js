(() => {
  'use strict';

  function applyPresentationProductAdjustments() {
    // Remove the Complete Package section entirely from the presentation site.
    const packageSection = document.querySelector('.package');
    if (packageSection) packageSection.remove();

    // Keep presentation copy focused on the individual product lineup.
    const heroCopy = document.querySelector('.hero-copy > p');
    if (heroCopy) {
      heroCopy.textContent = 'Mejavi Skin+ is a modern Indonesian skin and body care brand built around a simple idea: everyday skincare should feel clear, comfortable and easy to follow. The presentation brings together the brand story, six core products, selected ingredients, BPOM registration references and collaboration opportunities in one English-language experience created for meetings, pitches, events and partner presentations.';
    }

    // Update Fresh Hydra Cream size everywhere the product data is rendered.
    if (typeof products !== 'undefined' && Array.isArray(products)) {
      const fresh = products.find(product => product.id === 'fresh');
      if (fresh) fresh.size = '30 g';

      const activeFilter = document.querySelector('#filterRow .filter.active')?.dataset.filter || 'all';
      if (typeof renderProducts === 'function') renderProducts(activeFilter);
      if (typeof setShowcase === 'function') {
        const currentIndex = typeof activeProduct === 'number' ? activeProduct : 0;
        setShowcase(currentIndex);
      }
    }

    // Defensive DOM replacements for any already-rendered Fresh Hydra Cream detail.
    const modalName = document.querySelector('#modalName');
    if (modalName?.textContent.trim() === 'Fresh Hydra Cream') {
      const modalSize = document.querySelector('#modalSize');
      if (modalSize) modalSize.textContent = '30 g';
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyPresentationProductAdjustments, { once: true });
  } else {
    applyPresentationProductAdjustments();
  }
})();

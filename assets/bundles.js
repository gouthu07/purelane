document.addEventListener('DOMContentLoaded', () => {
  const buttons = document.querySelectorAll('[data-bundle-add]');

  buttons.forEach((button) => {
    button.addEventListener('click', async () => {
      const variantIds = button.dataset.variantIds
        .split(',')
        .filter((id) => id.trim() !== '');

      if (variantIds.length === 0) return;

      button.disabled = true;
      button.textContent = 'Adding...';

      try {
        const items = variantIds.map((id) => ({ id: id.trim(), quantity: 1 }));

        const response = await fetch('/cart/add.js', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ items }),
        });

        if (response.ok) {
          button.textContent = 'Added!';
          setTimeout(() => {
            button.textContent = 'Add bundle to cart';
            button.disabled = false;
          }, 1500);
        } else {
          throw new Error('Failed to add bundle');
        }
      } catch (error) {
        button.textContent = 'Error — try again';
        setTimeout(() => {
          button.textContent = 'Add bundle to cart';
          button.disabled = false;
        }, 1500);
      }
    });
  });
});
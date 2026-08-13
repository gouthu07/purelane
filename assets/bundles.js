document.addEventListener('DOMContentLoaded', () => {
  const buttons = document.querySelectorAll('[data-bundle-add]');

  buttons.forEach((button) => {
    button.addEventListener('click', async () => {
      const defaultButtonText = button.textContent.trim() || 'Add bundle to cart';
      const variantIds = (button.dataset.variantIds || '')
        .split(',')
        .filter((id) => id.trim() !== '');

      if (button.disabled || variantIds.length === 0) return;

      button.disabled = true;
      button.textContent = 'Adding...';

      try {
        const items = variantIds.map((id) => ({ id: id.trim(), quantity: 1 }));

        const response = await fetch('/cart/add.js', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ items }),
        });

        if (!response.ok) {
          const message = await response.text();
          throw new Error(message || 'Failed to add bundle');
        }

        button.textContent = 'Added!';
        setTimeout(() => {
          button.textContent = defaultButtonText;
          button.disabled = false;
        }, 1500);
      } catch (error) {
        button.textContent = 'Error - try again';
        setTimeout(() => {
          button.textContent = defaultButtonText;
          button.disabled = false;
        }, 1500);
      }
    });
  });
});

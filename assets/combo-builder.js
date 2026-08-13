class ComboBuilder extends HTMLElement {
  constructor() {
    super();
    this.selects = this.querySelectorAll('[data-slot-select]');
    this.totalEl = this.querySelector('[data-combo-total]');
    this.addButton = this.querySelector('[data-combo-add]');
    this.defaultButtonText = this.addButton?.textContent.trim() || 'Add combo to cart';

    this.selects.forEach((select) => {
      select.addEventListener('change', () => this.updateCombo());
    });

    this.addButton?.addEventListener('click', () => this.addComboToCart());
  }

  getSelections() {
    return Array.from(this.selects).map((select) => {
      const option = select.options[select.selectedIndex];
      if (!option || !option.value || option.disabled) return null;

      return {
        variantId: option.value,
        price: option.dataset.price || '$0.00',
        title: option.dataset.title || '',
        image: option.dataset.image || '',
      };
    });
  }

  updateCombo() {
    const selections = this.getSelections();
    const bothSelected = selections[0] && selections[1];

    selections.forEach((selection, index) => {
      const preview = this.querySelector(`[data-slot-preview="${index + 1}"]`);
      if (!preview) return;

      if (!selection) {
        preview.replaceChildren();
        return;
      }

      preview.replaceChildren();

      if (selection.image) {
        const image = document.createElement('img');
        image.src = selection.image;
        image.alt = selection.title;
        image.className = 'combo-slot__image';
        image.loading = 'lazy';
        preview.append(image);
      } else {
        const placeholder = document.createElement('span');
        placeholder.className = 'combo-slot__placeholder';
        placeholder.setAttribute('aria-hidden', 'true');
        preview.append(placeholder);
      }

      const price = document.createElement('span');
      price.className = 'combo-slot__price';
      price.textContent = selection.price;
      preview.append(price);
    });

    if (bothSelected) {
      const total = selections.reduce((sum, selection) => {
        const numeric = parseFloat(selection.price.replace(/[^0-9.]/g, ''));
        return sum + (Number.isNaN(numeric) ? 0 : numeric);
      }, 0);

      if (this.totalEl) this.totalEl.textContent = this.formatMoney(total);
      if (this.addButton) this.addButton.disabled = false;
    } else {
      if (this.totalEl) this.totalEl.textContent = '-';
      if (this.addButton) this.addButton.disabled = true;
    }
  }

  formatMoney(amount) {
    return '$' + amount.toFixed(2);
  }

  async addComboToCart() {
    const selections = this.getSelections();
    if (!this.addButton || !selections[0] || !selections[1]) return;

    this.addButton.disabled = true;
    this.addButton.textContent = 'Adding...';

    try {
      const response = await fetch('/cart/add.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: [
            { id: selections[0].variantId, quantity: 1 },
            { id: selections[1].variantId, quantity: 1 },
          ],
        }),
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || 'Failed to add to cart');
      }

      this.addButton.textContent = 'Added!';
      setTimeout(() => {
        this.addButton.textContent = this.defaultButtonText;
        this.addButton.disabled = false;
      }, 1500);
    } catch (error) {
      this.addButton.textContent = 'Error - try again';
      setTimeout(() => {
        this.addButton.textContent = this.defaultButtonText;
        this.addButton.disabled = false;
      }, 1500);
    }
  }
}

if (!customElements.get('combo-builder')) {
  customElements.define('combo-builder', ComboBuilder);
}

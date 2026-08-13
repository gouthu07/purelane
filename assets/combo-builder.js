class ComboBuilder extends HTMLElement {
  constructor() {
    super();
    this.selects = this.querySelectorAll('[data-slot-select]');
    this.totalEl = this.querySelector('[data-combo-total]');
    this.addButton = this.querySelector('[data-combo-add]');

    this.selects.forEach((select) => {
      select.addEventListener('change', () => this.updateCombo());
    });

    this.addButton.addEventListener('click', () => this.addComboToCart());
  }

  getSelections() {
    return Array.from(this.selects).map((select) => {
      const option = select.options[select.selectedIndex];
      if (!option || !option.value) return null;
      return {
        variantId: option.value,
        price: option.dataset.price,
        title: option.dataset.title,
        image: option.dataset.image,
      };
    });
  }

  updateCombo() {
    const selections = this.getSelections();
    const bothSelected = selections[0] && selections[1];

    selections.forEach((selection, index) => {
      const preview = this.querySelector(`[data-slot-preview="${index + 1}"]`);
      if (selection) {
        preview.innerHTML = `
          <img src="${selection.image}" alt="${selection.title}" class="combo-slot__image">
          <span class="combo-slot__price">${selection.price}</span>
        `;
      } else {
        preview.innerHTML = '';
      }
    });

    if (bothSelected) {
      const total = selections.reduce((sum, s) => {
        const numeric = parseFloat(s.price.replace(/[^0-9.]/g, ''));
        return sum + numeric;
      }, 0);
      this.totalEl.textContent = this.formatMoney(total);
      this.addButton.disabled = false;
    } else {
      this.totalEl.textContent = '—';
      this.addButton.disabled = true;
    }
  }

  formatMoney(amount) {
    return '$' + amount.toFixed(2);
  }

  async addComboToCart() {
    const selections = this.getSelections();
    if (!selections[0] || !selections[1]) return;

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

      if (response.ok) {
        this.addButton.textContent = 'Added!';
        setTimeout(() => {
          this.addButton.textContent = 'Add combo to cart';
          this.addButton.disabled = false;
        }, 1500);
      } else {
        throw new Error('Failed to add to cart');
      }
    } catch (error) {
      this.addButton.textContent = 'Error — try again';
      setTimeout(() => {
        this.addButton.textContent = 'Add combo to cart';
        this.addButton.disabled = false;
      }, 1500);
    }
  }
}

customElements.define('combo-builder', ComboBuilder);
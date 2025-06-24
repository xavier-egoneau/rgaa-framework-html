// components/accordeons.js

class Accordion {
  constructor(element, options = {}) {
    this.element = element;
    this.options = {
      allowMultiple: false,  // Permet plusieurs panneaux ouverts
      closeOthers: true,     // Ferme les autres au clic
      keyboard: true,        // Navigation clavier
      ...options
    };
    
    this.items = [];
    this.currentlyOpen = null;
    
    this.init();
  }

  init() {
    this.setupItems();
    this.bindEvents();
    this.setupKeyboardNavigation();
  }

  setupItems() {
    const accordionItems = this.element.querySelectorAll('.rf-accordion-item');
    
    accordionItems.forEach((item, index) => {
      const button = item.querySelector('.rf-accordion-button');
      const collapse = item.querySelector('.rf-accordion-collapse');
      const body = item.querySelector('.rf-accordion-body');
      
      if (!button || !collapse || !body) {
        console.warn('Structure d\'accordéon incomplète détectée');
        return;
      }
      
      // Génère des IDs si nécessaires
      if (!collapse.id) {
        collapse.id = RGAAAria.generateId('accordion-collapse');
      }
      if (!button.id) {
        button.id = RGAAAria.generateId('accordion-button');
      }
      
      // Setup ARIA
      button.setAttribute('aria-controls', collapse.id);
      button.setAttribute('aria-expanded', 'false');
      collapse.setAttribute('aria-labelledby', button.id);
      
      // État initial
      const isOpen = item.hasAttribute('data-rf-open') || button.classList.contains('rf-show');
      
      if (isOpen) {
        this.openItem(item, false); // false = pas d'animation initiale
      } else {
        this.closeItem(item, false);
      }
      
      this.items.push({
        item,
        button,
        collapse,
        body,
        index,
        isOpen
      });
    });
  }

  bindEvents() {
    // Délégation d'événements pour les boutons
    this.element.addEventListener('click', (e) => {
      const button = e.target.closest('.rf-accordion-button');
      if (button) {
        e.preventDefault();
        this.toggle(button);
      }
    });
  }

  setupKeyboardNavigation() {
    if (!this.options.keyboard) return;
    
    this.element.addEventListener('keydown', (e) => {
      const button = e.target.closest('.rf-accordion-button');
      if (!button) return;
      
      const currentIndex = this.items.findIndex(item => item.button === button);
      let targetIndex = currentIndex;
      
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          targetIndex = currentIndex < this.items.length - 1 ? currentIndex + 1 : 0;
          break;
          
        case 'ArrowUp':
          e.preventDefault();
          targetIndex = currentIndex > 0 ? currentIndex - 1 : this.items.length - 1;
          break;
          
        case 'Home':
          e.preventDefault();
          targetIndex = 0;
          break;
          
        case 'End':
          e.preventDefault();
          targetIndex = this.items.length - 1;
          break;
          
        case 'Enter':
        case ' ':
          e.preventDefault();
          this.toggle(button);
          return;
          
        default:
          return;
      }
      
      // Focus sur le bouton cible
      if (this.items[targetIndex]) {
        this.items[targetIndex].button.focus();
      }
    });
  }

  toggle(buttonOrItem) {
    const item = this.getItemFromButton(buttonOrItem);
    if (!item) return;
    
    if (item.isOpen) {
      this.close(item.button);
    } else {
      this.open(item.button);
    }
  }

  open(buttonOrItem, animate = true) {
    const item = this.getItemFromButton(buttonOrItem);
    if (!item || item.isOpen) return;
    
    // Ferme les autres si nécessaire
    if (this.options.closeOthers && !this.options.allowMultiple) {
      this.closeAll(item);
    }
    
    // Événement avant ouverture
    const openEvent = new CustomEvent('rf:accordion:show', {
      detail: { accordion: this, item: item.item },
      cancelable: true
    });
    
    this.element.dispatchEvent(openEvent);
    if (openEvent.defaultPrevented) return;
    
    this.openItem(item, animate);
    
    // Annonce pour lecteurs d'écran
    const buttonText = item.button.textContent.trim();
    RGAAAria.announce(`Section ${buttonText} ouverte`);
    
    // Événement après ouverture
    this.element.dispatchEvent(new CustomEvent('rf:accordion:shown', {
      detail: { accordion: this, item: item.item }
    }));
  }

  close(buttonOrItem, animate = true) {
    const item = this.getItemFromButton(buttonOrItem);
    if (!item || !item.isOpen) return;
    
    // Événement avant fermeture
    const hideEvent = new CustomEvent('rf:accordion:hide', {
      detail: { accordion: this, item: item.item },
      cancelable: true
    });
    
    this.element.dispatchEvent(hideEvent);
    if (hideEvent.defaultPrevented) return;
    
    this.closeItem(item, animate);
    
    // Annonce pour lecteurs d'écran
    const buttonText = item.button.textContent.trim();
    RGAAAria.announce(`Section ${buttonText} fermée`);
    
    // Événement après fermeture
    this.element.dispatchEvent(new CustomEvent('rf:accordion:hidden', {
      detail: { accordion: this, item: item.item }
    }));
  }

  openItem(item, animate = true) {
    item.isOpen = true;
    item.button.classList.remove('rf-collapsed');
    item.button.setAttribute('aria-expanded', 'true');
    
    if (animate) {
      this.slideDown(item.collapse);
    } else {
      item.collapse.classList.add('rf-show');
      item.collapse.style.height = 'auto';
    }
    
    this.currentlyOpen = item;
  }

  closeItem(item, animate = true) {
    item.isOpen = false;
    item.button.classList.add('rf-collapsed');
    item.button.setAttribute('aria-expanded', 'false');
    
    if (animate) {
      this.slideUp(item.collapse);
    } else {
      item.collapse.classList.remove('rf-show');
      item.collapse.style.height = '0';
    }
    
    if (this.currentlyOpen === item) {
      this.currentlyOpen = null;
    }
  }

  slideDown(element) {
    element.style.height = '0';
    element.classList.add('rf-show');
    
    // Force reflow
    element.offsetHeight;
    
    // Calcule la hauteur cible
    const targetHeight = element.scrollHeight + 'px';
    element.style.height = targetHeight;
    
    // Nettoie après l'animation
    const cleanup = () => {
      element.style.height = 'auto';
      element.removeEventListener('transitionend', cleanup);
    };
    
    element.addEventListener('transitionend', cleanup);
  }

  slideUp(element) {
    element.style.height = element.scrollHeight + 'px';
    
    // Force reflow
    element.offsetHeight;
    
    element.style.height = '0';
    
    // Nettoie après l'animation
    const cleanup = () => {
      element.classList.remove('rf-show');
      element.removeEventListener('transitionend', cleanup);
    };
    
    element.addEventListener('transitionend', cleanup);
  }

  closeAll(exceptItem = null) {
    this.items.forEach(item => {
      if (item !== exceptItem && item.isOpen) {
        this.closeItem(item);
      }
    });
  }

  openAll() {
    if (!this.options.allowMultiple) return;
    
    this.items.forEach(item => {
      if (!item.isOpen) {
        this.openItem(item);
      }
    });
  }

  getItemFromButton(buttonOrItem) {
    if (typeof buttonOrItem === 'object' && buttonOrItem.button) {
      return buttonOrItem; // C'est déjà un item
    }
    
    // C'est un bouton, trouve l'item correspondant
    return this.items.find(item => item.button === buttonOrItem);
  }

  destroy() {
    // Les événements sont délégués, pas besoin de cleanup manuel
    this.items = [];
    this.currentlyOpen = null;
  }

  // Factory method
  static init(selector = '.rf-accordion') {
    const accordions = document.querySelectorAll(selector);
    const instances = [];
    
    accordions.forEach(accordion => {
      if (!accordion.rfAccordion) {
        const options = this.parseOptions(accordion);
        accordion.rfAccordion = new Accordion(accordion, options);
        instances.push(accordion.rfAccordion);
      }
    });
    
    return instances;
  }

  static parseOptions(element) {
    const options = {};
    
    if (element.hasAttribute('data-rf-allow-multiple')) {
      options.allowMultiple = element.getAttribute('data-rf-allow-multiple') === 'true';
    }
    if (element.hasAttribute('data-rf-close-others')) {
      options.closeOthers = element.getAttribute('data-rf-close-others') !== 'false';
    }
    if (element.hasAttribute('data-rf-keyboard')) {
      options.keyboard = element.getAttribute('data-rf-keyboard') !== 'false';
    }
    
    return options;
  }
}

// Auto-initialisation
document.addEventListener('DOMContentLoaded', () => {
  Accordion.init();
});

// Export global
window.RGAAAccordion = Accordion;
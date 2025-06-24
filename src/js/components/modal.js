// components/modal.js

class Modal {
  constructor(element, options = {}) {
    this.element = element;
    this.options = {
      backdrop: true,        // true, false, or 'static'
      keyboard: true,        // ESC pour fermer
      focus: true,           // Focus automatique
      show: false,           // Afficher immédiatement
      restoreFocus: true,    // Restaurer le focus à la fermeture
      ...options
    };
    
    this.isShown = false;
    this.backdrop = null;
    this.focusTrap = null;
    this.triggerElement = null;
    
    this.init();
  }

  /**
   * Initialisation
   */
  init() {
    // Assure que c'est un vrai dialog
    if (this.element.tagName !== 'DIALOG') {
      console.warn('Utilisez <dialog> pour une meilleure accessibilité');
    }
    
    // Attributs ARIA
    this.element.setAttribute('role', 'dialog');
    this.element.setAttribute('aria-modal', 'true');
    this.element.setAttribute('aria-hidden', 'true');
    
    // ID si nécessaire
    if (!this.element.id) {
      this.element.id = RGAAAria.generateId('modal');
    }
    
    // Trouve ou crée le titre
    this.setupTitle();
    
    // Événements
    this.bindEvents();
    
    // Affichage initial
    if (this.options.show) {
      this.show();
    }
  }

  /**
   * Configure le titre de la modale
   */
  setupTitle() {
    let title = this.element.querySelector('.rf-modal-title, h1, h2, h3, h4, h5, h6');
    
    if (title) {
      if (!title.id) {
        title.id = RGAAAria.generateId('modal-title');
      }
      this.element.setAttribute('aria-labelledby', title.id);
    } else {
      // Fallback sur aria-label
      if (!this.element.getAttribute('aria-label')) {
        console.warn('Modale sans titre détectable. Ajoutez aria-label ou un titre.');
      }
    }
  }

  /**
   * Événements
   */
  bindEvents() {
    // Boutons de fermeture
    const closeButtons = this.element.querySelectorAll('[data-rf-modal-close], .rf-modal-close');
    closeButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.hide();
      });
    });

    // ESC pour fermer
    if (this.options.keyboard) {
      this.element.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          e.preventDefault();
          this.hide();
        }
      });
    }

    // Clic sur backdrop
    if (this.options.backdrop === true) {
      this.element.addEventListener('click', (e) => {
        if (e.target === this.element) {
          this.hide();
        }
      });
    }
  }

  /**
   * Affiche la modale
   */
  show(triggerElement = null) {
    if (this.isShown) return;

    this.triggerElement = triggerElement;
    
    // Événement avant affichage
    const showEvent = new CustomEvent('rf:modal:show', {
      detail: { modal: this },
      cancelable: true
    });
    
    this.element.dispatchEvent(showEvent);
    if (showEvent.defaultPrevented) return;

    // Sauvegarde le focus
    if (this.options.restoreFocus) {
      RGAAFocus.saveFocus();
    }

    // Prépare la page
    this.prepareDocument();
    
    // Affiche la modale
    this.element.style.display = 'block';
    this.element.classList.add('rf-show');
    this.element.setAttribute('aria-hidden', 'false');
    
    // Backdrop
    if (this.options.backdrop) {
      this.showBackdrop();
    }
    
    // Focus et piège
    if (this.options.focus) {
      this.enforceFocus();
    }
    
    this.isShown = true;
    
    // Annonce aux lecteurs d'écran
    const title = this.element.getAttribute('aria-label') || 
                  this.element.querySelector('.rf-modal-title')?.textContent ||
                  'Boîte de dialogue';
    RGAAAria.announce(`Ouverture de ${title}`, 'assertive');
    
    // Événement après affichage
    this.element.dispatchEvent(new CustomEvent('rf:modal:shown', {
      detail: { modal: this }
    }));
  }

  /**
   * Cache la modale
   */
  hide() {
    if (!this.isShown) return;
    
    // Événement avant fermeture
    const hideEvent = new CustomEvent('rf:modal:hide', {
      detail: { modal: this },
      cancelable: true
    });
    
    this.element.dispatchEvent(hideEvent);
    if (hideEvent.defaultPrevented) return;

    // Libère le piège à focus
    if (this.focusTrap) {
      this.focusTrap.release();
      this.focusTrap = null;
    }
    
    // Cache la modale
    this.element.classList.remove('rf-show');
    this.element.setAttribute('aria-hidden', 'true');
    
    // Cache le backdrop
    if (this.backdrop) {
      this.hideBackdrop();
    }
    
    // Restaure la page
    this.restoreDocument();
    
    // Restaure le focus
    if (this.options.restoreFocus) {
      if (!RGAAFocus.restoreFocus() && this.triggerElement) {
        this.triggerElement.focus();
      }
    }
    
    // Cache complètement après l'animation
    setTimeout(() => {
      this.element.style.display = 'none';
    }, 150);
    
    this.isShown = false;
    
    // Événement après fermeture
    this.element.dispatchEvent(new CustomEvent('rf:modal:hidden', {
      detail: { modal: this }
    }));
  }

  /**
   * Toggle
   */
  toggle(triggerElement = null) {
    if (this.isShown) {
      this.hide();
    } else {
      this.show(triggerElement);
    }
  }

  /**
   * Prépare le document
   */
  prepareDocument() {
    document.body.classList.add('rf-modal-open');
    
    // Désactive le scroll
    document.body.style.overflow = 'hidden';
    
    // Masque le contenu aux lecteurs d'écran
    const siblings = Array.from(document.body.children).filter(
      child => !child.contains(this.element) && 
               !child.classList.contains('rf-modal-backdrop') &&
               !child.id === 'rf-announcer'
    );
    
    this.hiddenSiblings = siblings;
    siblings.forEach(sibling => {
      if (!sibling.getAttribute('aria-hidden')) {
        sibling.setAttribute('aria-hidden', 'true');
        sibling.dataset.rfModalHidden = 'true';
      }
    });
  }

  /**
   * Restaure le document
   */
  restoreDocument() {
    document.body.classList.remove('rf-modal-open');
    document.body.style.overflow = '';
    
    // Restaure la visibilité
    if (this.hiddenSiblings) {
      this.hiddenSiblings.forEach(sibling => {
        if (sibling.dataset.rfModalHidden) {
          sibling.removeAttribute('aria-hidden');
          delete sibling.dataset.rfModalHidden;
        }
      });
    }
  }

  /**
   * Affiche le backdrop
   */
  showBackdrop() {
    this.backdrop = document.createElement('div');
    this.backdrop.className = 'rf-modal-backdrop rf-fade';
    
    document.body.appendChild(this.backdrop);
    
    // Force reflow puis ajoute la classe show
    this.backdrop.offsetHeight;
    this.backdrop.classList.add('rf-show');
  }

  /**
   * Cache le backdrop
   */
  hideBackdrop() {
    if (this.backdrop) {
      this.backdrop.classList.remove('rf-show');
      
      setTimeout(() => {
        if (this.backdrop && this.backdrop.parentNode) {
          this.backdrop.parentNode.removeChild(this.backdrop);
        }
        this.backdrop = null;
      }, 150);
    }
  }

  /**
   * Applique le piège à focus
   */
  enforceFocus() {
    this.focusTrap = RGAAFocus.trapFocus(this.element);
  }

  /**
   * Détruit la modale
   */
  destroy() {
    if (this.isShown) {
      this.hide();
    }
    
    if (this.focusTrap) {
      this.focusTrap.release();
    }
    
    // Supprime les événements
    // (délégation d'événements, donc pas besoin de cleanup manuel)
  }

  /**
   * Fabrique statique
   */
  static init(selector = '[data-rf-modal]') {
    const modals = document.querySelectorAll(selector);
    const instances = [];
    
    modals.forEach(modalElement => {
      if (!modalElement.rfModal) {
        modalElement.rfModal = new Modal(modalElement);
        instances.push(modalElement.rfModal);
      }
    });
    
    return instances;
  }

  /**
   * API de déclenchement
   */
  static setupTriggers() {
    document.addEventListener('click', (e) => {
      const trigger = e.target.closest('[data-rf-modal-trigger]');
      if (!trigger) return;
      
      e.preventDefault();
      
      const targetSelector = trigger.getAttribute('data-rf-modal-trigger');
      const targetModal = document.querySelector(targetSelector);
      
      if (targetModal) {
        if (!targetModal.rfModal) {
          targetModal.rfModal = new Modal(targetModal);
        }
        targetModal.rfModal.show(trigger);
      }
    });
  }
}

// Auto-initialisation
document.addEventListener('DOMContentLoaded', () => {
  Modal.init();
  Modal.setupTriggers();
});

// Export global
window.RGAAModal = Modal;
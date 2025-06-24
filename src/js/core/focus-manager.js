// focus-manager.js

class FocusManager {
  constructor() {
    this.focusableElements = [
      'a[href]',
      'area[href]',
      'input:not([disabled]):not([type="hidden"])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      'button:not([disabled])',
      'iframe',
      'object',
      'embed',
      '[contenteditable]',
      '[tabindex]:not([tabindex^="-"])'
    ].join(',');
    
    this.focusHistory = [];
    this.trapStack = [];
  }

  /**
   * Trouve tous les éléments focusables dans un conteneur
   */
  getFocusableElements(container = document) {
    return Array.from(container.querySelectorAll(this.focusableElements))
      .filter(el => this.isVisible(el) && this.isEnabled(el));
  }

  /**
   * Vérifie si un élément est visible
   */
  isVisible(element) {
    return !!(element.offsetWidth || element.offsetHeight || element.getClientRects().length);
  }

  /**
   * Vérifie si un élément est activé
   */
  isEnabled(element) {
    return !element.disabled && !element.hasAttribute('aria-disabled');
  }

  /**
   * Sauvegarde le focus actuel
   */
  saveFocus() {
    const activeElement = document.activeElement;
    if (activeElement && activeElement !== document.body) {
      this.focusHistory.push(activeElement);
    }
  }

  /**
   * Restaure le dernier focus sauvegardé
   */
  restoreFocus() {
    const lastFocused = this.focusHistory.pop();
    if (lastFocused && this.isVisible(lastFocused) && this.isEnabled(lastFocused)) {
      lastFocused.focus();
      return true;
    }
    return false;
  }

  /**
   * Crée un piège à focus
   */
  trapFocus(container) {
    const focusableElements = this.getFocusableElements(container);
    
    if (focusableElements.length === 0) {
      console.warn('Aucun élément focusable trouvé dans le conteneur');
      return null;
    }

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const trapHandler = (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          // Shift + Tab
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          // Tab
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    container.addEventListener('keydown', trapHandler);
    
    // Focus sur le premier élément
    firstElement.focus();

    const trap = {
      container,
      handler: trapHandler,
      release: () => {
        container.removeEventListener('keydown', trapHandler);
        const index = this.trapStack.indexOf(trap);
        if (index > -1) {
          this.trapStack.splice(index, 1);
        }
      }
    };

    this.trapStack.push(trap);
    return trap;
  }

  /**
   * Libère tous les pièges à focus
   */
  releaseAllTraps() {
    this.trapStack.forEach(trap => trap.release());
    this.trapStack = [];
  }

  /**
   * Gestion de l'échappement (ESC)
   */
  handleEscape(callback) {
    const escapeHandler = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        callback();
        document.removeEventListener('keydown', escapeHandler);
      }
    };

    document.addEventListener('keydown', escapeHandler);
    return escapeHandler;
  }
}

// Instance globale
window.RGAAFocus = new FocusManager();
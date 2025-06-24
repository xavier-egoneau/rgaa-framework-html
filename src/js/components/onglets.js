// components/alertes.js

class Alert {
  constructor(element, options = {}) {
    this.element = element;
    this.options = {
      autoClose: false,        // Fermeture automatique
      autoCloseDelay: 5000,    // Délai en ms
      fade: true,              // Animation de fermeture
      ...options
    };
    
    this.isVisible = true;
    this.autoCloseTimer = null;
    
    this.init();
  }

  init() {
    this.setupCloseButton();
    this.setupAutoClose();
    this.setupAria();
  }

  setupCloseButton() {
    const closeButton = this.element.querySelector('.rf-alert-close');
    
    if (closeButton) {
      closeButton.addEventListener('click', (e) => {
        e.preventDefault();
        this.close();
      });
      
      // Assure l'accessibilité du bouton
      if (!closeButton.getAttribute('aria-label')) {
        closeButton.setAttribute('aria-label', 'Fermer cette alerte');
      }
    }
  }

  setupAutoClose() {
    if (this.options.autoClose && this.options.autoCloseDelay > 0) {
      this.autoCloseTimer = setTimeout(() => {
        this.close();
      }, this.options.autoCloseDelay);
      
      // Pause sur hover
      this.element.addEventListener('mouseenter', () => {
        this.pauseAutoClose();
      });
      
      this.element.addEventListener('mouseleave', () => {
        this.resumeAutoClose();
      });
      
      // Pause sur focus
      this.element.addEventListener('focusin', () => {
        this.pauseAutoClose();
      });
      
      this.element.addEventListener('focusout', () => {
        this.resumeAutoClose();
      });
    }
  }

  setupAria() {
    // Assure que l'alerte a un rôle approprié
    if (!this.element.getAttribute('role')) {
      this.element.setAttribute('role', 'alert');
    }
    
    // Assure que l'alerte est annoncée
    if (!this.element.getAttribute('aria-live')) {
      this.element.setAttribute('aria-live', 'polite');
    }
    
    // Pour les alertes importantes
    if (this.element.classList.contains('rf-alert-danger')) {
      this.element.setAttribute('aria-live', 'assertive');
    }
  }

  show() {
    if (this.isVisible) return;
    
    // Événement avant affichage
    const showEvent = new CustomEvent('rf:alert:show', {
      detail: { alert: this },
      cancelable: true
    });
    
    this.element.dispatchEvent(showEvent);
    if (showEvent.defaultPrevented) return;
    
    this.isVisible = true;
    this.element.style.display = 'block';
    
    if (this.options.fade) {
      this.element.classList.remove('rf-fade-out');
      this.element.style.opacity = '1';
    }
    
    // Relance l'auto-close si nécessaire
    if (this.options.autoClose) {
      this.setupAutoClose();
    }
    
    // Événement après affichage
    this.element.dispatchEvent(new CustomEvent('rf:alert:shown', {
      detail: { alert: this }
    }));
  }

  close() {
    if (!this.isVisible) return;
    
    // Événement avant fermeture
    const closeEvent = new CustomEvent('rf:alert:close', {
      detail: { alert: this },
      cancelable: true
    });
    
    this.element.dispatchEvent(closeEvent);
    if (closeEvent.defaultPrevented) return;
    
    // Nettoie l'auto-close
    this.clearAutoClose();
    
    if (this.options.fade) {
      this.element.classList.add('rf-fade-out');
      
      // Attend la fin de l'animation
      setTimeout(() => {
        this.hideElement();
      }, 300);
    } else {
      this.hideElement();
    }
  }

  hideElement() {
    this.isVisible = false;
    this.element.style.display = 'none';
    
    // Événement après fermeture
    this.element.dispatchEvent(new CustomEvent('rf:alert:closed', {
      detail: { alert: this }
    }));
  }

  pauseAutoClose() {
    if (this.autoCloseTimer) {
      clearTimeout(this.autoCloseTimer);
      this.autoCloseTimer = null;
    }
  }

  resumeAutoClose() {
    if (this.options.autoClose && !this.autoCloseTimer && this.isVisible) {
      this.autoCloseTimer = setTimeout(() => {
        this.close();
      }, this.options.autoCloseDelay);
    }
  }

  clearAutoClose() {
    if (this.autoCloseTimer) {
      clearTimeout(this.autoCloseTimer);
      this.autoCloseTimer = null;
    }
  }

  destroy() {
    this.clearAutoClose();
    // Les événements sont délégués, pas besoin de cleanup manuel
  }

  // Factory methods
  static init(selector = '.rf-alert') {
    const alerts = document.querySelectorAll(selector);
    const instances = [];
    
    alerts.forEach(alert => {
      if (!alert.rfAlert) {
        const options = this.parseOptions(alert);
        alert.rfAlert = new Alert(alert, options);
        instances.push(alert.rfAlert);
      }
    });
    
    return instances;
  }

  static parseOptions(element) {
    const options = {};
    
    if (element.hasAttribute('data-rf-auto-close')) {
      options.autoClose = element.getAttribute('data-rf-auto-close') === 'true';
    }
    if (element.hasAttribute('data-rf-auto-close-delay')) {
      options.autoCloseDelay = parseInt(element.getAttribute('data-rf-auto-close-delay')) || 5000;
    }
    if (element.hasAttribute('data-rf-fade')) {
      options.fade = element.getAttribute('data-rf-fade') !== 'false';
    }
    
    return options;
  }

  // Méthodes statiques utilitaires
  static create(type, message, options = {}) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `rf-alert rf-alert-${type}`;
    alertDiv.setAttribute('role', 'alert');
    
    if (options.dismissible) {
      alertDiv.classList.add('rf-alert-dismissible');
      alertDiv.innerHTML = `
        ${message}
        <button type="button" class="rf-alert-close" aria-label="Fermer cette alerte">
          <span class="rf-sr-only">Fermer</span>
        </button>
      `;
    } else {
      alertDiv.innerHTML = message;
    }
    
    // Ajoute au conteneur ou au body
    const container = options.container ? document.querySelector(options.container) : document.body;
    container.appendChild(alertDiv);
    
    // Initialise l'alerte
    const alertInstance = new Alert(alertDiv, options);
    
    // Auto-remove après fermeture si créée dynamiquement
    alertDiv.addEventListener('rf:alert:closed', () => {
      setTimeout(() => {
        if (alertDiv.parentNode) {
          alertDiv.parentNode.removeChild(alertDiv);
        }
      }, 100);
    });
    
    return alertInstance;
  }

  static success(message, options = {}) {
    return this.create('success', message, { ...options, dismissible: true });
  }

  static error(message, options = {}) {
    return this.create('danger', message, { ...options, dismissible: true });
  }

  static warning(message, options = {}) {
    return this.create('warning', message, { ...options, dismissible: true });
  }

  static info(message, options = {}) {
    return this.create('info', message, { ...options, dismissible: true });
  }
}

// Auto-initialisation
document.addEventListener('DOMContentLoaded', () => {
  Alert.init();
});

// Gestion des boutons de fermeture par délégation
document.addEventListener('click', (e) => {
  const closeButton = e.target.closest('.rf-alert-close');
  if (closeButton) {
    e.preventDefault();
    const alert = closeButton.closest('.rf-alert');
    if (alert && alert.rfAlert) {
      alert.rfAlert.close();
    }
  }
});

// Export global
window.RGAAAlert = Alert;
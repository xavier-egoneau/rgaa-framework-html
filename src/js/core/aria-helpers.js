// aria-helpers.js

class AriaHelpers {
  /**
   * Annonce un message aux lecteurs d'écran
   */
  static announce(message, priority = 'polite') {
    const announcer = document.getElementById('rf-announcer') || this.createAnnouncer();
    
    // Nettoie le message précédent
    announcer.textContent = '';
    
    // Force le reflow puis ajoute le nouveau message
    announcer.offsetHeight;
    announcer.textContent = message;
    announcer.setAttribute('aria-live', priority);
  }

  /**
   * Crée la zone d'annonce ARIA
   */
  static createAnnouncer() {
    const announcer = document.createElement('div');
    announcer.id = 'rf-announcer';
    announcer.className = 'rf-sr-only rf-aria-live';
    announcer.setAttribute('aria-live', 'polite');
    announcer.setAttribute('aria-atomic', 'true');
    document.body.appendChild(announcer);
    return announcer;
  }

  /**
   * Met à jour les attributs ARIA de manière sécurisée
   */
  static updateAria(element, attributes) {
    Object.entries(attributes).forEach(([attr, value]) => {
      if (value === null || value === undefined) {
        element.removeAttribute(attr);
      } else {
        element.setAttribute(attr, value);
      }
    });
  }

  /**
   * Génère un ID unique pour les relations ARIA
   */
  static generateId(prefix = 'rf') {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Associe des éléments avec aria-describedby ou aria-labelledby
   */
  static associateElements(trigger, target, relationship = 'describedby') {
    if (!target.id) {
      target.id = this.generateId('aria-target');
    }
    
    const attr = `aria-${relationship}`;
    const existing = trigger.getAttribute(attr);
    const ids = existing ? existing.split(' ') : [];
    
    if (!ids.includes(target.id)) {
      ids.push(target.id);
      trigger.setAttribute(attr, ids.join(' '));
    }
  }

  /**
   * Gestion des états expanded/collapsed
   */
  static toggleExpanded(trigger, target = null) {
    const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
    const newState = !isExpanded;
    
    trigger.setAttribute('aria-expanded', newState);
    
    if (target) {
      target.setAttribute('aria-hidden', !newState);
    }
    
    return newState;
  }
}

window.RGAAAria = AriaHelpers;
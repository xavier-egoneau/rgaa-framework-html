// rgaa.js - Framework principal avec tous les composants

class RGAA {
  constructor() {
    this.version = '1.0.0';
    this.components = new Map();
    this.isInitialized = false;
    this.config = {
      autoInit: true,
      skipLinks: true,
      announcer: true,
      debug: false
    };
  }

  /**
   * Initialisation principale
   */
  init(userConfig = {}) {
    if (this.isInitialized) {
      console.warn('RGAA Framework déjà initialisé');
      return;
    }

    // Fusion de la configuration
    this.config = { ...this.config, ...userConfig };

    if (this.config.debug) {
      console.log('🚀 Initialisation RGAA Framework v' + this.version);
    }

    // Initialise les composants de base
    this.initCore();
    
    // Auto-détection des composants
    if (this.config.autoInit) {
      this.autoInitComponents();
    }

    this.isInitialized = true;
    
    // Événement d'initialisation terminée
    document.dispatchEvent(new CustomEvent('rgaa:ready', {
      detail: { framework: this }
    }));

    if (this.config.debug) {
      console.log('✅ RGAA Framework initialisé');
      this.logComponentsFound();
    }
  }

  /**
   * Initialise les composants de base
   */
  initCore() {
    // Créer l'annonceur ARIA si nécessaire
    if (this.config.announcer) {
      RGAAAria.createAnnouncer();
    }

    // Initialise les skip links
    if (this.config.skipLinks) {
      const skipLinks = new RGAASkipLinks();
      skipLinks.init();
      this.components.set('skipLinks', skipLinks);
    }

    // Gestion globale de l'échappement
    this.setupGlobalKeyHandlers();
    
    // Observer les changements DOM pour les composants dynamiques
    this.setupMutationObserver();
  }

  /**
   * Auto-détection et initialisation des composants
   */
  autoInitComponents() {
    const componentSelectors = {
      'modal': '[data-rf-modal], .rf-modal',
      'navigation': '.rf-nav',
      'navbar': '.rf-navbar',
      'dropdown': '.rf-dropdown',
      'forms': 'form[data-rf-validate]',
      'accordion': '.rf-accordion',
      'tabs': '.rf-tabs',
      'alerts': '.rf-alert'
    };

    // Initialise chaque type de composant
    Object.entries(componentSelectors).forEach(([componentName, selector]) => {
      const elements = document.querySelectorAll(selector);
      
      if (elements.length > 0) {
        if (this.config.debug) {
          console.log(`🔍 Trouvé ${elements.length} composant(s) ${componentName}`);
        }
        
        this.initComponentType(componentName, elements);
      }
    });
  }

  /**
   * Initialise un type de composant
   */
  initComponentType(componentName, elements) {
    switch (componentName) {
      case 'modal':
        if (window.RGAAModal) {
          RGAAModal.init();
          RGAAModal.setupTriggers();
          this.components.set('modals', Array.from(elements).map(el => el.rfModal).filter(Boolean));
        }
        break;
        
      case 'navigation':
        if (window.RGAANavigation) {
          const instances = RGAANavigation.init();
          this.components.set('navigations', instances);
        }
        break;
        
      case 'navbar':
        if (window.RGAANavbar) {
          const instances = RGAANavbar.init();
          this.components.set('navbars', instances);
        }
        break;
        
      case 'dropdown':
        if (window.RGAADropdown) {
          const instances = RGAADropdown.init();
          this.components.set('dropdowns', instances);
        }
        break;
        
      case 'forms':
        if (window.RGAAFormValidator) {
          const instances = RGAAFormValidator.init();
          this.components.set('forms', instances);
        }
        break;
        
      case 'accordion':
        if (window.RGAAAccordion) {
          const instances = RGAAAccordion.init();
          this.components.set('accordions', instances);
        }
        break;
        
      case 'tabs':
        if (window.RGAATabs) {
          const instances = RGAATabs.init();
          this.components.set('tabs', instances);
        }
        break;
        
      case 'alerts':
        if (window.RGAAAlert) {
          const instances = RGAAAlert.init();
          this.components.set('alerts', instances);
        }
        break;
    }
  }

  /**
   * Log des composants trouvés (debug)
   */
  logComponentsFound() {
    console.group('📊 Composants détectés:');
    this.components.forEach((instances, componentName) => {
      const count = Array.isArray(instances) ? instances.length : 1;
      console.log(`${componentName}: ${count} instance(s)`);
    });
    console.groupEnd();
  }

  /**
   * Gestionnaires de touches globaux
   */
  setupGlobalKeyHandlers() {
    document.addEventListener('keydown', (e) => {
      // ESC global pour fermer les composants
      if (e.key === 'Escape') {
        this.handleGlobalEscape(e);
      }
      
      // Tab pour la gestion du focus
      if (e.key === 'Tab') {
        this.handleGlobalTab(e);
      }
    });
  }

  /**
   * Gestion globale de l'échappement
   */
  handleGlobalEscape(e) {
    // Ferme les modales ouvertes
    const openModals = document.querySelectorAll('.rf-modal.rf-show');
    if (openModals.length > 0) {
      const lastModal = openModals[openModals.length - 1];
      if (lastModal.rfModal) {
        lastModal.rfModal.hide();
      }
      return;
    }
    
    // Ferme les dropdowns ouverts
    const openDropdowns = document.querySelectorAll('.rf-dropdown-menu.rf-show');
    if (openDropdowns.length > 0) {
      openDropdowns.forEach(menu => {
        const dropdown = menu.closest('.rf-dropdown');
        if (dropdown && dropdown.rfDropdown) {
          dropdown.rfDropdown.close();
        }
      });
      return;
    }
    
    // Libère les pièges à focus actifs
    if (RGAAFocus.trapStack.length > 0) {
      const lastTrap = RGAAFocus.trapStack[RGAAFocus.trapStack.length - 1];
      lastTrap.release();
      RGAAFocus.restoreFocus();
    }
  }

  /**
   * Gestion globale du Tab
   */
  handleGlobalTab(e) {
    // Ajout de la classe focus-visible si navigation au clavier
    document.body.classList.add('rf-keyboard-navigation');
    
    // Supprime la classe après un délai
    clearTimeout(this.keyboardTimeout);
    this.keyboardTimeout = setTimeout(() => {
      document.body.classList.remove('rf-keyboard-navigation');
    }, 100);
  }

  /**
   * Observer pour les composants ajoutés dynamiquement
   */
  setupMutationObserver() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              this.initNewElements(node);
            }
          });
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    this.mutationObserver = observer;
  }

  /**
   * Initialise les nouveaux éléments ajoutés au DOM
   */
  initNewElements(container) {
    if (!this.config.autoInit) return;
    
    // Re-scan pour les nouveaux composants
    const componentChecks = [
      { selector: '.rf-modal', init: () => window.RGAAModal && RGAAModal.init(container.querySelectorAll('.rf-modal')) },
      { selector: '.rf-nav', init: () => window.RGAANavigation && RGAANavigation.init(container.querySelectorAll('.rf-nav')) },
      { selector: '.rf-navbar', init: () => window.RGAANavbar && RGAANavbar.init(container.querySelectorAll('.rf-navbar')) },
      { selector: '.rf-dropdown', init: () => window.RGAADropdown && RGAADropdown.init(container.querySelectorAll('.rf-dropdown')) },
      { selector: 'form[data-rf-validate]', init: () => window.RGAAFormValidator && RGAAFormValidator.init(container.querySelectorAll('form[data-rf-validate]')) },
      { selector: '.rf-accordion', init: () => window.RGAAAccordion && RGAAAccordion.init(container.querySelectorAll('.rf-accordion')) },
      { selector: '.rf-tabs', init: () => window.RGAATabs && RGAATabs.init(container.querySelectorAll('.rf-tabs')) },
      { selector: '.rf-alert', init: () => window.RGAAAlert && RGAAAlert.init(container.querySelectorAll('.rf-alert')) }
    ];
    
    componentChecks.forEach(check => {
      if (container.querySelector && container.querySelector(check.selector)) {
        check.init();
      }
    });
  }

  /**
   * API publique pour enregistrer un composant
   */
  registerComponent(name, componentClass) {
    this.components.set(name, componentClass);
    
    if (this.config.debug) {
      console.log(`📝 Composant personnalisé enregistré: ${name}`);
    }
  }

  /**
   * Obtient un composant
   */
  getComponent(name) {
    return this.components.get(name);
  }

  /**
   * Obtient toutes les instances d'un type de composant
   */
  getAllComponents(type) {
    const components = this.components.get(type);
    return Array.isArray(components) ? components : [components].filter(Boolean);
  }

  /**
   * Actualise les skip links (utile pour les SPA)
   */
  refreshSkipLinks() {
    const skipLinks = this.components.get('skipLinks');
    if (skipLinks) {
      skipLinks.refresh();
    }
  }

  /**
   * Statistiques d'accessibilité
   */
  getAccessibilityStats() {
    const stats = {
      modals: document.querySelectorAll('.rf-modal').length,
      formsWithValidation: document.querySelectorAll('form[data-rf-validate]').length,
      skipLinksPresent: !!document.querySelector('.rf-skip-links'),
      ariaLiveRegions: document.querySelectorAll('[aria-live]').length,
      landmarksWithLabels: document.querySelectorAll('[role="navigation"][aria-label], [role="main"][aria-label], [role="banner"][aria-label], [role="contentinfo"][aria-label]').length,
      accordions: document.querySelectorAll('.rf-accordion').length,
      tabSystems: document.querySelectorAll('.rf-tabs').length,
      alertMessages: document.querySelectorAll('.rf-alert').length
    };
    
    return stats;
  }

  /**
   * Détruit le framework
   */
  destroy() {
    if (this.mutationObserver) {
      this.mutationObserver.disconnect();
    }
    
    // Détruit tous les composants
    this.components.forEach((instances, type) => {
      if (Array.isArray(instances)) {
        instances.forEach(instance => {
          if (instance && typeof instance.destroy === 'function') {
            instance.destroy();
          }
        });
      } else if (instances && typeof instances.destroy === 'function') {
        instances.destroy();
      }
    });
    
    RGAAFocus.releaseAllTraps();
    this.components.clear();
    this.isInitialized = false;
    
    if (this.config.debug) {
      console.log('🗑️ RGAA Framework détruit');
    }
  }
}

// Instance globale
window.RGAA = new RGAA();

// Auto-initialisation au chargement du DOM
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.RGAA.init();
  });
} else {
  window.RGAA.init();
}

// Gestion des clics souris pour retirer la classe keyboard-navigation
document.addEventListener('mousedown', () => {
  document.body.classList.remove('rf-keyboard-navigation');
});

// Gestion de la navigation dans les SPA
window.addEventListener('popstate', () => {
  // Actualise les skip links et la navigation active
  setTimeout(() => {
    window.RGAA.refreshSkipLinks();
    
    // Met à jour les états actifs dans la navigation
    const navigations = window.RGAA.getAllComponents('navigations');
    navigations.forEach(nav => {
      if (nav.updateCurrentPage) {
        nav.updateCurrentPage();
      }
    });
  }, 100);
});

// Export pour utilisation en module
if (typeof module !== 'undefined' && module.exports) {
  module.exports = RGAA;
}
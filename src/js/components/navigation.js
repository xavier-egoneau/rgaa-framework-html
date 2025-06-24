// components/navigation.js

class Navigation {
  constructor(element, options = {}) {
    this.element = element;
    this.options = {
      closeOnOutsideClick: true,
      closeOnEscape: true,
      restoreFocus: true,
      ...options
    };
    
    this.isOpen = false;
    this.triggerElement = null;
    this.menuItems = [];
    
    this.init();
  }

  init() {
    this.setupAria();
    this.bindEvents();
    this.findMenuItems();
  }

  setupAria() {
    // Assure les attributs ARIA de base
    if (!this.element.getAttribute('role')) {
      this.element.setAttribute('role', 'navigation');
    }
    
    // Label si absent
    if (!this.element.getAttribute('aria-label') && !this.element.getAttribute('aria-labelledby')) {
      this.element.setAttribute('aria-label', 'Navigation');
    }
  }

  findMenuItems() {
    this.menuItems = Array.from(this.element.querySelectorAll('.rf-nav-link, .rf-dropdown-item'));
  }

  bindEvents() {
    // Gestion clavier
    this.element.addEventListener('keydown', (e) => this.handleKeydown(e));
    
    // Page courante
    this.updateCurrentPage();
  }

  handleKeydown(e) {
    if (!this.menuItems.length) return;
    
    const currentIndex = this.menuItems.indexOf(document.activeElement);
    let targetIndex = currentIndex;
    
    switch (e.key) {
      case 'ArrowDown':
      case 'ArrowRight':
        e.preventDefault();
        targetIndex = currentIndex < this.menuItems.length - 1 ? currentIndex + 1 : 0;
        break;
        
      case 'ArrowUp':
      case 'ArrowLeft':
        e.preventDefault();
        targetIndex = currentIndex > 0 ? currentIndex - 1 : this.menuItems.length - 1;
        break;
        
      case 'Home':
        e.preventDefault();
        targetIndex = 0;
        break;
        
      case 'End':
        e.preventDefault();
        targetIndex = this.menuItems.length - 1;
        break;
        
      default:
        return;
    }
    
    this.menuItems[targetIndex].focus();
  }

  updateCurrentPage() {
    const currentUrl = window.location.href;
    const currentPath = window.location.pathname;
    
    this.menuItems.forEach(item => {
      const href = item.getAttribute('href');
      
      if (href === currentUrl || href === currentPath) {
        item.setAttribute('aria-current', 'page');
        item.classList.add('rf-active');
      } else {
        item.removeAttribute('aria-current');
        item.classList.remove('rf-active');
      }
    });
  }

  static init(selector = '.rf-nav') {
    const navs = document.querySelectorAll(selector);
    const instances = [];
    
    navs.forEach(nav => {
      if (!nav.rfNavigation) {
        nav.rfNavigation = new Navigation(nav);
        instances.push(nav.rfNavigation);
      }
    });
    
    return instances;
  }
}

class Navbar extends Navigation {
  constructor(element, options = {}) {
    super(element, options);
    this.toggler = null;
    this.collapse = null;
    this.setupNavbar();
  }

  setupNavbar() {
    this.toggler = this.element.querySelector('.rf-navbar-toggler');
    this.collapse = this.element.querySelector('.rf-navbar-collapse');
    
    if (this.toggler && this.collapse) {
      this.setupToggler();
    }
  }

  setupToggler() {
    // ID pour l'association ARIA
    if (!this.collapse.id) {
      this.collapse.id = RGAAAria.generateId('navbar-collapse');
    }
    
    // Attributs ARIA
    this.toggler.setAttribute('aria-controls', this.collapse.id);
    this.toggler.setAttribute('aria-expanded', 'false');
    this.toggler.setAttribute('aria-label', 'Basculer la navigation');
    
    // Événement clic
    this.toggler.addEventListener('click', (e) => {
      e.preventDefault();
      this.toggle();
    });
    
    // Fermeture automatique sur resize
    window.addEventListener('resize', () => {
      if (window.innerWidth >= 992 && this.isOpen) { // lg breakpoint
        this.close();
      }
    });
    
    // Fermeture sur clic extérieur
    if (this.options.closeOnOutsideClick) {
      document.addEventListener('click', (e) => {
        if (this.isOpen && !this.element.contains(e.target)) {
          this.close();
        }
      });
    }
    
    // Fermeture sur ESC
    if (this.options.closeOnEscape) {
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.isOpen) {
          this.close();
          this.toggler.focus();
        }
      });
    }
  }

  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  open() {
    if (this.isOpen) return;
    
    this.collapse.classList.add('rf-show');
    this.toggler.setAttribute('aria-expanded', 'true');
    this.isOpen = true;
    
    // Focus sur le premier lien
    const firstLink = this.collapse.querySelector('.rf-nav-link');
    if (firstLink) {
      firstLink.focus();
    }
    
    RGAAAria.announce('Menu ouvert');
  }

  close() {
    if (!this.isOpen) return;
    
    this.collapse.classList.remove('rf-show');
    this.toggler.setAttribute('aria-expanded', 'false');
    this.isOpen = false;
    
    RGAAAria.announce('Menu fermé');
  }

  static init(selector = '.rf-navbar') {
    const navbars = document.querySelectorAll(selector);
    const instances = [];
    
    navbars.forEach(navbar => {
      if (!navbar.rfNavbar) {
        navbar.rfNavbar = new Navbar(navbar);
        instances.push(navbar.rfNavbar);
      }
    });
    
    return instances;
  }
}

class Dropdown {
  constructor(element, options = {}) {
    this.element = element;
    this.options = {
      autoClose: true,
      ...options
    };
    
    this.toggle = element.querySelector('.rf-dropdown-toggle');
    this.menu = element.querySelector('.rf-dropdown-menu');
    this.isOpen = false;
    
    this.init();
  }

  init() {
    if (!this.toggle || !this.menu) return;
    
    this.setupAria();
    this.bindEvents();
  }

  setupAria() {
    // IDs pour l'association
    if (!this.menu.id) {
      this.menu.id = RGAAAria.generateId('dropdown-menu');
    }
    
    this.toggle.setAttribute('aria-haspopup', 'true');
    this.toggle.setAttribute('aria-expanded', 'false');
    this.toggle.setAttribute('aria-controls', this.menu.id);
    
    // Role pour le menu
    this.menu.setAttribute('role', 'menu');
    
    // Role pour les items
    const items = this.menu.querySelectorAll('.rf-dropdown-item');
    items.forEach(item => {
      item.setAttribute('role', 'menuitem');
    });
  }

  bindEvents() {
    // Clic sur toggle
    this.toggle.addEventListener('click', (e) => {
      e.preventDefault();
      this.toggle();
    });
    
    // Navigation clavier
    this.element.addEventListener('keydown', (e) => this.handleKeydown(e));
    
    // Fermeture automatique
    if (this.options.autoClose) {
      document.addEventListener('click', (e) => {
        if (this.isOpen && !this.element.contains(e.target)) {
          this.close();
        }
      });
    }
  }

  handleKeydown(e) {
    const items = Array.from(this.menu.querySelectorAll('.rf-dropdown-item:not(.rf-disabled)'));
    const currentIndex = items.indexOf(document.activeElement);
    
    switch (e.key) {
      case 'Escape':
        e.preventDefault();
        this.close();
        this.toggle.focus();
        break;
        
      case 'ArrowDown':
        e.preventDefault();
        if (!this.isOpen) {
          this.open();
        } else {
          const nextIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
          items[nextIndex].focus();
        }
        break;
        
      case 'ArrowUp':
        e.preventDefault();
        if (!this.isOpen) {
          this.open();
        } else {
          const prevIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
          items[prevIndex].focus();
        }
        break;
        
      case 'Home':
        if (this.isOpen) {
          e.preventDefault();
          items[0].focus();
        }
        break;
        
      case 'End':
        if (this.isOpen) {
          e.preventDefault();
          items[items.length - 1].focus();
        }
        break;
    }
  }

  open() {
    if (this.isOpen) return;
    
    this.menu.classList.add('rf-show');
    this.toggle.setAttribute('aria-expanded', 'true');
    this.isOpen = true;
    
    // Focus sur le premier item
    const firstItem = this.menu.querySelector('.rf-dropdown-item:not(.rf-disabled)');
    if (firstItem) {
      firstItem.focus();
    }
  }

  close() {
    if (!this.isOpen) return;
    
    this.menu.classList.remove('rf-show');
    this.toggle.setAttribute('aria-expanded', 'false');
    this.isOpen = false;
  }

  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  static init(selector = '.rf-dropdown') {
    const dropdowns = document.querySelectorAll(selector);
    const instances = [];
    
    dropdowns.forEach(dropdown => {
      if (!dropdown.rfDropdown) {
        dropdown.rfDropdown = new Dropdown(dropdown);
        instances.push(dropdown.rfDropdown);
      }
    });
    
    return instances;
  }
}

// Auto-initialisation
document.addEventListener('DOMContentLoaded', () => {
  Navigation.init();
  Navbar.init();
  Dropdown.init();
});

// Exports globaux
window.RGAANavigation = Navigation;
window.RGAANavbar = Navbar;
window.RGAADropdown = Dropdown;
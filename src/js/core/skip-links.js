// skip-links.js

class SkipLinks {
  constructor() {
    this.skipLinks = [];
    this.container = null;
  }

  /**
   * Initialise les skip links automatiquement
   */
  init() {
    this.createContainer();
    this.detectLandmarks();
    this.render();
  }

  /**
   * Crée le conteneur des skip links
   */
  createContainer() {
    // Vérifie si le conteneur existe déjà
    this.container = document.querySelector('.rf-skip-links');
    
    if (!this.container) {
      this.container = document.createElement('nav');
      this.container.className = 'rf-skip-links';
      this.container.setAttribute('aria-label', 'Liens d\'évitement');
      
      // Insère en premier dans le body
      document.body.insertBefore(this.container, document.body.firstChild);
    }
  }

  /**
   * Détecte automatiquement les landmarks
   */
  detectLandmarks() {
    const landmarks = [
      {
        selector: 'main, [role="main"], .rf-main',
        text: 'Aller au contenu principal',
        priority: 1
      },
      {
        selector: 'nav[aria-label*="principal"], nav.rf-nav-primary, .rf-nav-primary',
        text: 'Aller à la navigation principale',
        priority: 2
      },
      {
        selector: '[role="search"], .rf-search, form[role="search"]',
        text: 'Aller à la recherche',
        priority: 3
      },
      {
        selector: 'footer, [role="contentinfo"], .rf-footer',
        text: 'Aller au pied de page',
        priority: 4
      }
    ];

    this.skipLinks = [];

    landmarks.forEach(landmark => {
      const element = document.querySelector(landmark.selector);
      if (element) {
        // Assure que l'élément a un ID
        if (!element.id) {
          element.id = RGAAAria.generateId('landmark');
        }

        // Ajoute scroll-margin pour un meilleur focus
        element.style.scrollMarginTop = '1rem';

        this.skipLinks.push({
          href: `#${element.id}`,
          text: landmark.text,
          priority: landmark.priority,
          target: element
        });
      }
    });

    // Trie par priorité
    this.skipLinks.sort((a, b) => a.priority - b.priority);
  }

  /**
   * Rend les skip links dans le DOM
   */
  render() {
    this.container.innerHTML = '';

    if (this.skipLinks.length === 0) {
      return;
    }

    this.skipLinks.forEach(link => {
      const skipLink = document.createElement('a');
      skipLink.href = link.href;
      skipLink.className = 'rf-skip-links__link';
      skipLink.textContent = link.text;
      
      // Améliore la navigation
      skipLink.addEventListener('click', (e) => {
        e.preventDefault();
        this.focusTarget(link.target);
      });

      this.container.appendChild(skipLink);
    });
  }

  /**
   * Focus sur la cible avec gestion du tabindex
   */
  focusTarget(target) {
    // Sauvegarde le tabindex original
    const originalTabIndex = target.getAttribute('tabindex');
    
    // Rend focusable temporairement si nécessaire
    if (!target.matches(RGAAFocus.focusableElements)) {
      target.setAttribute('tabindex', '-1');
    }

    // Focus et scroll
    target.focus();
    target.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'start' 
    });

    // Annonce aux lecteurs d'écran
    const landmarkName = target.getAttribute('aria-label') || 
                         target.querySelector('h1, h2, h3, h4, h5, h6')?.textContent || 
                         'Section';
    
    RGAAAria.announce(`Navigation vers : ${landmarkName}`);

    // Restaure le tabindex après un délai
    setTimeout(() => {
      if (originalTabIndex === null) {
        target.removeAttribute('tabindex');
      } else {
        target.setAttribute('tabindex', originalTabIndex);
      }
    }, 100);
  }

  /**
   * Mise à jour dynamique (utile pour les SPA)
   */
  refresh() {
    this.detectLandmarks();
    this.render();
  }

  /**
   * Ajoute un skip link personnalisé
   */
  addCustomLink(selector, text, priority = 99) {
    const element = document.querySelector(selector);
    if (element) {
      if (!element.id) {
        element.id = RGAAAria.generateId('custom-landmark');
      }

      this.skipLinks.push({
        href: `#${element.id}`,
        text: text,
        priority: priority,
        target: element
      });

      this.skipLinks.sort((a, b) => a.priority - b.priority);
      this.render();
    }
  }
}

window.RGAASkipLinks = SkipLinks;
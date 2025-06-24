# Guide du développeur - RGAA Framework

## 🎯 Principes fondamentaux

### 1. Accessibilité first
Chaque composant est conçu pour être accessible **dès la conception**, pas ajouté après coup.

### 2. Sémantique HTML
Utiliser les bonnes balises pour le bon usage :
```html
<!-- ✅ Bon -->
<button type="button">Action</button>
<nav role="navigation" aria-label="Navigation principale">
<main role="main">
<dialog class="rf-modal">

<!-- ❌ Éviter -->
<div onclick="action()">Action</div>
<div class="navigation">
<div class="main-content">
<div class="modal">
```

### 3. ARIA intelligent
ARIA complète HTML, ne le remplace pas :
```html
<!-- ✅ Bon usage ARIA -->
<button aria-expanded="false" aria-controls="menu">Menu</button>
<div id="menu" aria-hidden="true">...</div>

<!-- ❌ ARIA inutile -->
<button role="button">Button</button> <!-- role redondant -->
```

## 🏗️ Architecture des composants

### Structure type d'un composant

#### 1. Fichier Sass (`_composant.scss`)
```scss
// components/_moncomposant.scss
@use "../core/mixins" as *;
@use "../core/variables" as *;

// Variables spécifiques
$mon-composant-bg: get-color('white') !default;
$mon-composant-border: get-color('light') !default;

// Composant de base
.rf-mon-composant {
  // Propriétés CSS AVANT les nested rules
  background-color: $mon-composant-bg;
  border: 1px solid $mon-composant-border;
  
  // Puis les nested rules et states
  &:focus {
    @include focus-ring();
  }
  
  &.rf-active {
    background-color: get-color('primary');
  }
}

// Variantes
.rf-mon-composant-large {
  padding: 1rem 2rem;
}
```

#### 2. Fichier JavaScript (`moncomposant.js`)
```javascript
// components/moncomposant.js
class MonComposant {
  constructor(element, options = {}) {
    this.element = element;
    this.options = {
      autoClose: true,
      keyboard: true,
      ...options
    };
    
    this.isActive = false;
    this.init();
  }

  init() {
    this.setupAria();
    this.bindEvents();
  }

  setupAria() {
    // Configuration ARIA obligatoire
    if (!this.element.id) {
      this.element.id = RGAAAria.generateId('mon-composant');
    }
    
    this.element.setAttribute('role', 'button');
    this.element.setAttribute('aria-expanded', 'false');
  }

  bindEvents() {
    // Événements clavier obligatoires
    this.element.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.toggle();
      }
    });
    
    // Événements souris
    this.element.addEventListener('click', () => this.toggle());
  }

  toggle() {
    this.isActive ? this.close() : this.open();
  }

  open() {
    this.isActive = true;
    this.element.setAttribute('aria-expanded', 'true');
    
    // Annonce pour lecteurs d'écran
    RGAAAria.announce('Composant ouvert');
    
    // Événement personnalisé
    this.element.dispatchEvent(new CustomEvent('rf:composant:open', {
      detail: { composant: this }
    }));
  }

  close() {
    this.isActive = false;
    this.element.setAttribute('aria-expanded', 'false');
    
    RGAAAria.announce('Composant fermé');
    
    this.element.dispatchEvent(new CustomEvent('rf:composant:close', {
      detail: { composant: this }
    }));
  }

  destroy() {
    // Nettoyage si nécessaire
  }

  // Factory method
  static init(selector = '.rf-mon-composant') {
    const elements = document.querySelectorAll(selector);
    const instances = [];
    
    elements.forEach(el => {
      if (!el.rfMonComposant) {
        el.rfMonComposant = new MonComposant(el);
        instances.push(el.rfMonComposant);
      }
    });
    
    return instances;
  }
}

// Export global
window.RGAAMonComposant = MonComposant;
```

## 🎨 Guide CSS/Sass

### Organisation des fichiers
```scss
// main.scss - Point d'entrée
@forward 'core/variables';  // Variables globales

@use 'core/variables' as *;
@use 'core/mixins' as *;
@use 'core/reset';
@use 'core/grid';

@use 'utilities/screenreader';
@use 'utilities/focus';

@use 'components/modal';
@use 'components/navigation';
```

### Conventions de nommage
- **Préfixe** : `rf-` (RGAA Framework)
- **BEM light** : `.rf-component`, `.rf-component-element`, `.rf-component--modifier`
- **États** : `.rf-active`, `.rf-show`, `.rf-disabled`

### Couleurs et contrastes
```scss
// ✅ Utiliser les couleurs conformes
.mon-element {
  color: get-color('primary');           // #0053b3 - ratio 4.5:1
  background-color: get-color('white');
}

// ✅ Vérification automatique contraste
.mon-element-dark {
  @include ensure-contrast(get-color('dark'), get-color('white'));
}

// ❌ Éviter les couleurs custom sans vérification
.mon-element-bad {
  color: #ccc;           // Peut ne pas être conforme
  background: #ddd;
}
```

### Focus et navigation clavier
```scss
// ✅ Focus ring cohérent
.rf-mon-bouton {
  @include button-base;
  
  &:focus {
    @include focus-ring();  // Focus uniforme
  }
  
  // Focus visible uniquement au clavier
  &:focus:not(:focus-visible) {
    outline: none;
  }
}
```

### Responsive accessible
```scss
.rf-mon-composant {
  // Mobile first
  padding: 0.5rem;
  
  @include breakpoint(md) {
    padding: 1rem;
  }
  
  // Réduction mouvement
  transition: all 0.3s ease;
  
  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
}
```

## 🔧 Guide JavaScript

### Helpers disponibles
```javascript
// Gestion ARIA
RGAAAria.announce('Message aux lecteurs d\'écran', 'polite');
RGAAAria.updateAria(element, { 'aria-expanded': 'true' });
RGAAAria.generateId('mon-prefix');

// Gestion focus
RGAAFocus.saveFocus();
RGAAFocus.restoreFocus();
const trap = RGAAFocus.trapFocus(container);
trap.release();

// Skip links
const skipLinks = new RGAASkipLinks();
skipLinks.addCustomLink('#ma-section', 'Aller à ma section');
```

### Patterns d'événements
```javascript
class MonComposant {
  bindEvents() {
    // Délégation d'événements globale
    document.addEventListener('click', (e) => {
      const trigger = e.target.closest('[data-mon-trigger]');
      if (trigger) {
        this.handleTrigger(trigger, e);
      }
    });
    
    // Support ESC global
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
    });
  }
  
  handleTrigger(trigger, event) {
    event.preventDefault();
    
    const targetId = trigger.getAttribute('data-mon-trigger');
    const target = document.querySelector(targetId);
    
    if (target && target.rfMonComposant) {
      target.rfMonComposant.toggle();
    }
  }
}
```

### Gestion des états
```javascript
class MonComposant {
  setState(newState) {
    const oldState = this.state;
    this.state = newState;
    
    // Met à jour le DOM
    this.element.dataset.state = newState;
    this.element.setAttribute('aria-expanded', newState === 'open');
    
    // Annonce le changement
    if (oldState !== newState) {
      const message = newState === 'open' ? 'Ouvert' : 'Fermé';
      RGAAAria.announce(message);
    }
    
    // Événement personnalisé
    this.element.dispatchEvent(new CustomEvent('rf:state:change', {
      detail: { oldState, newState, component: this }
    }));
  }
}
```

## 🧪 Tests et validation

### Checklist accessibilité par composant
```javascript
// Fichier de test : tests/accessibility.test.js
const accessibilityChecklist = {
  modal: [
    '✓ Focus piégé dans la modale',
    '✓ ESC ferme la modale',
    '✓ Focus restauré sur le déclencheur',
    '✓ aria-modal="true"',
    '✓ aria-labelledby sur le titre',
    '✓ Backdrop cliquable (si option activée)'
  ],
  
  navigation: [
    '✓ Navigation clavier (flèches)',
    '✓ aria-current="page" sur lien actuel',
    '✓ role="navigation"',
    '✓ aria-label descriptif',
    '✓ Skip links fonctionnels'
  ],
  
  forms: [
    '✓ Labels associés aux champs',
    '✓ Erreurs annoncées',
    '✓ aria-required sur champs obligatoires',
    '✓ aria-invalid sur erreurs',
    '✓ Focus sur première erreur'
  ]
};
```

### Tests automatisés
```javascript
// Validation W3C intégrée
gulp.task('test:html', () => {
  return gulp.src('dist/**/*.html')
    .pipe(validateHTML());
});

// Tests accessibilité avec axe-core
gulp.task('test:a11y', () => {
  return gulp.src('dist/**/*.html')
    .pipe(axeWebdriver());
});
```

## 🚀 Bonnes pratiques

### 1. Performance
```javascript
// ✅ Délégation d'événements
document.addEventListener('click', globalHandler);

// ❌ Événements multiples
buttons.forEach(btn => btn.addEventListener('click', handler));
```

### 2. Progressivité
```html
<!-- ✅ Fonctionne sans JS -->
<details class="rf-accordion">
  <summary class="rf-accordion-trigger">Titre</summary>
  <div class="rf-accordion-content">Contenu</div>
</details>

<!-- JS améliore l'expérience -->
<script>
  // Transforme en accordion custom si JS disponible
  RGAAAccordion.enhance('.rf-accordion');
</script>
```

### 3. Erreurs gracieuses
```javascript
class MonComposant {
  init() {
    try {
      this.setupAdvancedFeatures();
    } catch (error) {
      console.warn('Fonctionnalité avancée indisponible:', error);
      this.fallbackMode();
    }
  }
  
  fallbackMode() {
    // Version simplifiée mais fonctionnelle
    this.element.style.display = 'block';
  }
}
```

## 📋 Checklist de release

Avant chaque release, vérifier :

### Code
- [ ] Tous les composants ont des tests
- [ ] Validation W3C passe
- [ ] Pas d'erreurs console
- [ ] Performance acceptable (< 100kb total)

### Accessibilité
- [ ] Navigation clavier complète
- [ ] Lecteur d'écran fonctionnel
- [ ] Contrastes respectés
- [ ] Focus visible
- [ ] ARIA cohérent

### Documentation
- [ ] README à jour
- [ ] Exemples fonctionnels
- [ ] Changelog mis à jour
- [ ] Migration guide si breaking changes

---

**Ce guide évolue avec le framework. N'hésitez pas à contribuer !**
# Guide des composants - RGAA Framework

## 🎯 Vue d'ensemble

Tous les composants sont **accessibles par défaut** et respectent les critères RGAA 4.1.2.

### Fonctionnalités communes
- ✅ Navigation clavier complète
- ✅ Support lecteurs d'écran
- ✅ Focus management
- ✅ ARIA approprié
- ✅ États visuels clairs
- ✅ Messages d'erreur accessibles

---

## 📐 Système de grille

### Conteneurs
```html
<!-- Conteneur fixe responsive -->
<div class="rf-container">
  <!-- Contenu centré avec max-width -->
</div>

<!-- Conteneur fluide -->
<div class="rf-container-fluid">
  <!-- Contenu sur toute la largeur -->
</div>
```

### Grille responsive
```html
<div class="rf-container">
  <div class="rf-row">
    <!-- Colonnes égales -->
    <div class="rf-col">Colonne 1</div>
    <div class="rf-col">Colonne 2</div>
    <div class="rf-col">Colonne 3</div>
  </div>
  
  <div class="rf-row">
    <!-- Colonnes spécifiques -->
    <div class="rf-col-md-8">Contenu principal</div>
    <div class="rf-col-md-4">Sidebar</div>
  </div>
  
  <div class="rf-row">
    <!-- Responsive breakpoints -->
    <div class="rf-col-12 rf-col-md-6 rf-col-lg-4">
      Mobile: 100%, Tablet: 50%, Desktop: 33%
    </div>
    <div class="rf-col-12 rf-col-md-6 rf-col-lg-8">
      Mobile: 100%, Tablet: 50%, Desktop: 67%
    </div>
  </div>
</div>
```

### Utilitaires d'alignement
```html
<div class="rf-row rf-justify-center rf-align-center">
  <div class="rf-col-auto">Centré horizontal et vertical</div>
</div>

<div class="rf-row rf-justify-between">
  <div class="rf-col-auto">Gauche</div>
  <div class="rf-col-auto">Droite</div>
</div>
```

---

## 🖱️ Boutons

### Boutons de base
```html
<!-- Boutons principaux -->
<button type="button" class="rf-btn rf-btn-primary">Primaire</button>
<button type="button" class="rf-btn rf-btn-secondary">Secondaire</button>
<button type="button" class="rf-btn rf-btn-success">Succès</button>
<button type="button" class="rf-btn rf-btn-danger">Danger</button>
<button type="button" class="rf-btn rf-btn-warning">Attention</button>

<!-- Boutons outline -->
<button type="button" class="rf-btn rf-btn-outline-primary">Outline primaire</button>
<button type="button" class="rf-btn rf-btn-outline-secondary">Outline secondaire</button>

<!-- Tailles -->
<button type="button" class="rf-btn rf-btn-primary rf-btn-lg">Grand</button>
<button type="button" class="rf-btn rf-btn-primary">Normal</button>
<button type="button" class="rf-btn rf-btn-primary rf-btn-sm">Petit</button>

<!-- États -->
<button type="button" class="rf-btn rf-btn-primary" disabled>Désactivé</button>
<button type="button" class="rf-btn rf-btn-primary rf-btn-block">Pleine largeur</button>
```

### Boutons avec icônes
```html
<button type="button" class="rf-btn rf-btn-primary">
  <span aria-hidden="true">📧</span>
  Envoyer un e-mail
</button>

<!-- Bouton icône seule avec label accessible -->
<button type="button" class="rf-btn rf-btn-secondary" aria-label="Fermer">
  <span aria-hidden="true">×</span>
</button>
```

---

## 📝 Formulaires

### Champs de base
```html
<form data-rf-validate>
  <!-- Champ texte -->
  <div class="rf-form-group">
    <label for="nom" class="rf-form-label">
      Nom <span class="rf-required">obligatoire</span>
    </label>
    <input type="text" 
           id="nom" 
           class="rf-form-control" 
           required 
           aria-describedby="nom-error">
    <div id="nom-error" class="rf-invalid-feedback"></div>
  </div>

  <!-- Email avec validation -->
  <div class="rf-form-group">
    <label for="email" class="rf-form-label">E-mail</label>
    <input type="email" 
           id="email" 
           class="rf-form-control" 
           required>
  </div>

  <!-- Mot de passe -->
  <div class="rf-form-group">
    <label for="password" class="rf-form-label">Mot de passe</label>
    <input type="password" 
           id="password" 
           class="rf-form-control" 
           required 
           minlength="8">
  </div>

  <!-- Textarea -->
  <div class="rf-form-group">
    <label for="message" class="rf-form-label">Message</label>
    <textarea id="message" 
              class="rf-form-control rf-textarea" 
              rows="4"></textarea>
  </div>

  <!-- Select -->
  <div class="rf-form-group">
    <label for="pays" class="rf-form-label">Pays</label>
    <select id="pays" class="rf-form-select">
      <option value="">Choisir un pays</option>
      <option value="fr">France</option>
      <option value="be">Belgique</option>
      <option value="ch">Suisse</option>
    </select>
  </div>

  <button type="submit" class="rf-btn rf-btn-primary">Valider</button>
</form>
```

### Checkbox et radio
```html
<!-- Checkboxes -->
<fieldset>
  <legend>Préférences</legend>
  
  <div class="rf-form-check">
    <input type="checkbox" id="newsletter" class="rf-form-check-input">
    <label for="newsletter" class="rf-form-check-label">
      Recevoir la newsletter
    </label>
  </div>
  
  <div class="rf-form-check">
    <input type="checkbox" id="sms" class="rf-form-check-input">
    <label for="sms" class="rf-form-check-label">
      Recevoir les SMS
    </label>
  </div>
</fieldset>

<!-- Radio buttons -->
<fieldset>
  <legend>Genre <span class="rf-required">obligatoire</span></legend>
  
  <div class="rf-form-check">
    <input type="radio" name="genre" id="homme" class="rf-form-check-input" value="homme">
    <label for="homme" class="rf-form-check-label">Homme</label>
  </div>
  
  <div class="rf-form-check">
    <input type="radio" name="genre" id="femme" class="rf-form-check-input" value="femme">
    <label for="femme" class="rf-form-check-label">Femme</label>
  </div>
  
  <div class="rf-form-check">
    <input type="radio" name="genre" id="autre" class="rf-form-check-input" value="autre">
    <label for="autre" class="rf-form-check-label">Autre</label>
  </div>
</fieldset>
```

### Floating labels
```html
<div class="rf-form-floating">
  <input type="email" 
         id="floatingEmail" 
         class="rf-form-control" 
         placeholder="nom@exemple.com">
  <label for="floatingEmail">Adresse e-mail</label>
</div>

<div class="rf-form-floating">
  <select id="floatingSelect" class="rf-form-select">
    <option selected>Choisir...</option>
    <option value="1">Option 1</option>
    <option value="2">Option 2</option>
  </select>
  <label for="floatingSelect">Sélection</label>
</div>
```

### Input groups
```html
<!-- Avec texte -->
<div class="rf-input-group">
  <span class="rf-input-group-text">@</span>
  <input type="text" class="rf-form-control" placeholder="Nom d'utilisateur">
</div>

<!-- Avec bouton -->
<div class="rf-input-group">
  <input type="text" class="rf-form-control" placeholder="Rechercher...">
  <button class="rf-btn rf-btn-primary" type="button">
    <span aria-hidden="true">🔍</span>
    <span class="rf-sr-only">Rechercher</span>
  </button>
</div>
```

### Validation personnalisée
```html
<form data-rf-validate>
  <div class="rf-form-group">
    <label for="telephone" class="rf-form-label">Téléphone</label>
    <input type="tel" 
           id="telephone" 
           class="rf-form-control" 
           pattern="^0[1-9](?:[0-9]{8})$"
           data-rf-validator="telephone">
  </div>
</form>

<script>
// Validateur personnalisé
window.RGAA.init({
  customValidators: {
    telephone: (value) => {
      const regex = /^0[1-9](?:[0-9]{8})$/;
      return regex.test(value) || 'Format: 0123456789';
    }
  }
});
</script>
```

---

## 🪟 Modales

### Modale basique
```html
<!-- Déclencheur -->
<button type="button" 
        class="rf-btn rf-btn-primary" 
        data-rf-modal-trigger="#ma-modal">
  Ouvrir la modale
</button>

<!-- Modale -->
<dialog id="ma-modal" class="rf-modal rf-fade">
  <div class="rf-modal-dialog">
    <div class="rf-modal-content">
      <div class="rf-modal-header">
        <h4 class="rf-modal-title">Titre de la modale</h4>
        <button type="button" class="rf-modal-close" data-rf-modal-close>
          <span class="rf-sr-only">Fermer</span>
        </button>
      </div>
      <div class="rf-modal-body">
        <p>Contenu de la modale...</p>
        
        <!-- Test du focus -->
        <div class="rf-form-group">
          <label for="modal-input" class="rf-form-label">Test du focus</label>
          <input type="text" id="modal-input" class="rf-form-control" 
                 placeholder="Navigation clavier">
        </div>
      </div>
      <div class="rf-modal-footer">
        <button type="button" class="rf-btn rf-btn-secondary" data-rf-modal-close>
          Annuler
        </button>
        <button type="button" class="rf-btn rf-btn-primary">
          Confirmer
        </button>
      </div>
    </div>
  </div>
</dialog>
```

### Tailles de modales
```html
<!-- Petite modale -->
<dialog class="rf-modal rf-modal-sm">
  <div class="rf-modal-dialog">...</div>
</dialog>

<!-- Grande modale -->
<dialog class="rf-modal rf-modal-lg">
  <div class="rf-modal-dialog">...</div>
</dialog>

<!-- Très grande modale -->
<dialog class="rf-modal rf-modal-xl">
  <div class="rf-modal-dialog">...</div>
</dialog>
```

### Modale centrée et scrollable
```html
<dialog class="rf-modal">
  <div class="rf-modal-dialog rf-modal-dialog-centered rf-modal-dialog-scrollable">
    <div class="rf-modal-content">
      <!-- Contenu très long qui scroll -->
    </div>
  </div>
</dialog>
```

### Contrôle par JavaScript
```javascript
// Ouvrir programmatiquement
const modal = document.querySelector('#ma-modal');
if (modal.rfModal) {
  modal.rfModal.show();
}

// Événements
modal.addEventListener('rf:modal:show', (e) => {
  console.log('Modale en cours d\'ouverture');
});

modal.addEventListener('rf:modal:shown', (e) => {
  console.log('Modale affichée');
});

modal.addEventListener('rf:modal:hide', (e) => {
  console.log('Modale en cours de fermeture');
});
```

---

## 🧭 Navigation

### Navigation horizontale
```html
<nav class="rf-nav rf-nav-horizontal" role="navigation" aria-label="Navigation principale">
  <ul>
    <li class="rf-nav-item">
      <a href="/" class="rf-nav-link" aria-current="page">Accueil</a>
    </li>
    <li class="rf-nav-item">
      <a href="/services" class="rf-nav-link">Services</a>
    </li>
    <li class="rf-nav-item">
      <a href="/contact" class="rf-nav-link">Contact</a>
    </li>
    <li class="rf-nav-item">
      <a href="/disabled" class="rf-nav-link rf-disabled">Désactivé</a>
    </li>
  </ul>
</nav>
```

### Navigation verticale
```html
<nav class="rf-nav rf-nav-vertical" role="navigation" aria-label="Navigation secondaire">
  <ul>
    <li class="rf-nav-item">
      <a href="#section1" class="rf-nav-link">Section 1</a>
    </li>
    <li class="rf-nav-item">
      <a href="#section2" class="rf-nav-link">Section 2</a>
    </li>
  </ul>
</nav>
```

### Navbar responsive
```html
<nav class="rf-navbar rf-navbar-light" role="navigation" aria-label="Navigation principale">
  <div class="rf-container">
    <!-- Brand/Logo -->
    <a class="rf-navbar-brand" href="/">Mon Site</a>
    
    <!-- Bouton mobile -->
    <button class="rf-navbar-toggler" type="button">
      <span class="rf-sr-only">Basculer la navigation</span>
    </button>
    
    <!-- Menu collapsible -->
    <div class="rf-navbar-collapse">
      <ul class="rf-navbar-nav">
        <li><a href="/" class="rf-nav-link">Accueil</a></li>
        <li><a href="/services" class="rf-nav-link">Services</a></li>
        <li><a href="/contact" class="rf-nav-link">Contact</a></li>
      </ul>
    </div>
  </div>
</nav>
```

### Navbar sombre
```html
<nav class="rf-navbar rf-navbar-dark" style="background-color: #212529;">
  <!-- Contenu identique, styles adaptés automatiquement -->
</nav>
```

### Navbar fixe
```html
<!-- Fixée en haut -->
<nav class="rf-navbar rf-navbar-fixed-top">...</nav>

<!-- Fixée en bas -->
<nav class="rf-navbar rf-navbar-fixed-bottom">...</nav>

<!-- Sticky -->
<nav class="rf-navbar rf-navbar-sticky-top">...</nav>
```

---

## 📋 Dropdowns

### Dropdown basique
```html
<div class="rf-dropdown">
  <button class="rf-dropdown-toggle rf-btn rf-btn-primary" type="button">
    Actions
  </button>
  
  <div class="rf-dropdown-menu">
    <a class="rf-dropdown-item" href="#action1">Action 1</a>
    <a class="rf-dropdown-item" href="#action2">Action 2</a>
    <div class="rf-dropdown-divider"></div>
    <a class="rf-dropdown-item" href="#action3">Action 3</a>
    <a class="rf-dropdown-item rf-disabled">Action désactivée</a>
  </div>
</div>
```

### Dropdown dans navigation
```html
<nav class="rf-navbar">
  <ul class="rf-navbar-nav">
    <li class="rf-nav-item rf-dropdown">
      <a class="rf-nav-link rf-dropdown-toggle" href="#" role="button">
        Services
      </a>
      
      <div class="rf-dropdown-menu">
        <a class="rf-dropdown-item" href="/web">Développement web</a>
        <a class="rf-dropdown-item" href="/mobile">Applications mobiles</a>
        <a class="rf-dropdown-item" href="/consulting">Conseil</a>
      </div>
    </li>
  </ul>
</nav>
```

### Contrôle JavaScript
```javascript
// Ouvrir/fermer programmatiquement
const dropdown = document.querySelector('.rf-dropdown');
dropdown.rfDropdown.open();
dropdown.rfDropdown.close();
dropdown.rfDropdown.toggle();

// Événements
dropdown.addEventListener('rf:dropdown:show', () => {
  console.log('Dropdown ouvert');
});
```

---

## 🔧 Utilitaires

### Screen reader only
```html
<!-- Texte visible uniquement aux lecteurs d'écran -->
<span class="rf-sr-only">Informations supplémentaires</span>

<!-- Visible quand focus -->
<a href="#main" class="rf-sr-only-focusable">Aller au contenu principal</a>
```

### Focus ring personnalisé
```html
<!-- Focus par défaut -->
<button class="rf-focus-ring">Bouton avec focus</button>

<!-- Focus coloré -->
<button class="rf-focus-primary">Focus primaire</button>
<button class="rf-focus-danger">Focus danger</button>
```

### Skip links (automatiques)
```html
<!-- Générés automatiquement par le framework -->
<nav class="rf-skip-links" aria-label="Liens d'évitement">
  <a href="#main" class="rf-skip-links__link">Aller au contenu principal</a>
  <a href="#nav" class="rf-skip-links__link">Aller à la navigation</a>
  <a href="#search" class="rf-skip-links__link">Aller à la recherche</a>
</nav>
```

---

## 🎨 Composants de mise en page

### Alertes
```html
<div class="rf-alert rf-alert-primary">
  <strong>Information :</strong> Message d'information important.
</div>

<div class="rf-alert rf-alert-success">
  <strong>Succès :</strong> Opération réalisée avec succès.
</div>

<div class="rf-alert rf-alert-warning">
  <strong>Attention :</strong> Vérifiez ces informations.
</div>

<div class="rf-alert rf-alert-danger">
  <strong>Erreur :</strong> Une erreur est survenue.
</div>
```

### Cards accessibles
```html
<article class="rf-card">
  <div class="rf-card-header">
    <h3 class="rf-card-title">Titre de la carte</h3>
  </div>
  <div class="rf-card-body">
    <p class="rf-card-text">Contenu de la carte avec description.</p>
    <a href="#" class="rf-btn rf-btn-primary">En savoir plus</a>
  </div>
  <div class="rf-card-footer">
    <small class="text-muted">Dernière mise à jour il y a 3 minutes</small>
  </div>
</article>
```

---

## 🔍 Patterns avancés

### Formulaire de recherche accessible
```html
<form role="search" aria-label="Recherche sur le site">
  <div class="rf-input-group">
    <label for="search-input" class="rf-sr-only">Termes de recherche</label>
    <input type="search" 
           id="search-input" 
           class="rf-form-control" 
           placeholder="Rechercher..."
           aria-describedby="search-help">
    <button type="submit" class="rf-btn rf-btn-primary">
      <span aria-hidden="true">🔍</span>
      <span class="rf-sr-only">Lancer la recherche</span>
    </button>
  </div>
  <div id="search-help" class="rf-form-text">
    Utilisez des mots-clés pour affiner votre recherche
  </div>
</form>
```

### Table responsive accessible
```html
<div class="rf-table-responsive">
  <table class="rf-table">
    <caption>Liste des utilisateurs enregistrés</caption>
    <thead>
      <tr>
        <th scope="col">Nom</th>
        <th scope="col">E-mail</th>
        <th scope="col">Date d'inscription</th>
        <th scope="col">Actions</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <th scope="row">Jean Dupont</th>
        <td>jean@exemple.com</td>
        <td>15/01/2024</td>
        <td>
          <button class="rf-btn rf-btn-sm rf-btn-outline-primary">
            Modifier
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</div>
```

---

## 📱 Responsive et mobile

### Points de rupture
```scss
// Breakpoints disponibles
xs: 0px      // Mobile portrait
sm: 576px    // Mobile paysage
md: 768px    // Tablette
lg: 992px    // Desktop
xl: 1200px   // Large desktop
xxl: 1400px  // Extra large
```

### Classes utilitaires responsive
```html
<!-- Affichage conditionnel -->
<div class="rf-d-none rf-d-md-block">Visible à partir de md</div>
<div class="rf-d-block rf-d-lg-none">Caché à partir de lg</div>

<!-- Texte responsive -->
<h1 class="rf-h3 rf-h1-lg">H3 sur mobile, H1 sur desktop</h1>

<!-- Espacement responsive -->
<div class="rf-p-2 rf-p-md-4">Padding responsive</div>
```

---

## ⚙️ Configuration JavaScript

### Initialisation globale
```javascript
// Configuration par défaut
window.RGAA.init();

// Configuration personnalisée
window.RGAA.init({
  autoInit: true,           // Auto-détection des composants
  skipLinks: true,          // Skip links automatiques
  announcer: true,          // Zone d'annonce ARIA
  debug: false,            // Mode debug
  
  // Validateurs personnalisés
  customValidators: {
    telephone: (value) => /^0[1-9]\d{8}$/.test(value),
    siret: (value) => validateSiret(value)
  }
});
```

### API programmatique
```javascript
// Obtenir des composants
const modals = window.RGAA.getAllComponents('modals');
const navs = window.RGAA.getAllComponents('navigations');

// Statistiques d'accessibilité
const stats = window.RGAA.getAccessibilityStats();
console.log(stats);
// {
//   modals: 3,
//   formsWithValidation: 2,
//   skipLinksPresent: true,
//   ariaLiveRegions: 1,
//   landmarksWithLabels: 4
// }

// Actualiser les skip links (SPA)
window.RGAA.refreshSkipLinks();

// Enregistrer un composant personnalisé
window.RGAA.registerComponent('monComposant', MaClasse);
```

---

## 🧪 Tests d'accessibilité

### Tests manuels essentiels
```javascript
// Checklist de test par composant
const testChecklist = {
  keyboard: [
    'Tab pour naviguer entre les éléments',
    'Entrée/Espace pour activer',
    'Flèches pour naviguer dans les menus',
    'Échap pour fermer/annuler',
    'Home/End pour aller au début/fin'
  ],
  
  screenReader: [
    'Rôles ARIA appropriés',
    'Labels descriptifs',
    'États annoncés (ouvert/fermé)',
    'Erreurs annoncées',
    'Changements de contenu annoncés'
  ],
  
  visual: [
    'Focus visible sur tous les éléments',
    'Contraste suffisant (4.5:1)',
    'Texte lisible à 200% de zoom',
    'Pas de clignotement rapide',
    'Animation respecte prefers-reduced-motion'
  ]
};
```

### Outils recommandés
- **axe DevTools** - Extension navigateur
- **WAVE** - Évaluation automatique
- **Lighthouse** - Audit intégré Chrome
- **NVDA/JAWS** - Tests lecteur d'écran
- **Colour Contrast Analyser** - Vérification contrastes

---

**Tous les composants sont testés et validés RGAA 4.1.2 ✅**
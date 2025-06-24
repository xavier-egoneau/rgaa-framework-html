# RGAA Framework

> Framework CSS/JS accessible et conforme RGAA 4.1.2

[![RGAA 4.1.2](https://img.shields.io/badge/RGAA-4.1.2-blue)](https://www.numerique.gouv.fr/publications/rgaa-accessibilite/)
[![W3C Validated](https://img.shields.io/badge/W3C-Validated-green)](https://validator.w3.org/)

## 🎯 Objectif

Fournir des composants web **entièrement accessibles dès la conception**, conformes aux critères RGAA 4.1.2 et WCAG 2.1 AA.

## ✨ Fonctionnalités

### Accessibilité native
- ✅ **Skip links automatiques** vers les landmarks
- ✅ **Gestion focus avancée** (piège, restauration, navigation clavier)
- ✅ **Annonces ARIA** pour les lecteurs d'écran
- ✅ **Contraste respecté** (4.5:1 minimum)
- ✅ **Navigation clavier complète**
- ✅ **Support lecteurs d'écran**

### Composants inclus
- **Modales** accessibles avec piège focus
- **Navigation/Navbar** responsive avec ARIA
- **Formulaires** avec validation temps réel
- **Dropdowns** accessibles
- **Système de grille** flexible
- **Utilitaires focus** et screen reader

## 🚀 Installation rapide

### 1. Cloner et installer
```bash
git clone [votre-repo]
cd rgaa-framework
npm install
```

### 2. Développement
```bash
npm run dev      # Build + watch
npm run watch    # Watch seulement
```

### 3. Production
```bash
npm run build    # Build optimisé
npm run test     # Validation W3C
```

## 📖 Utilisation

### HTML de base
```html
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mon site accessible</title>
    <link rel="stylesheet" href="assets/css/main.css">
</head>
<body>
    <!-- Skip links automatiques -->
    
    <header class="rf-header" role="banner">
        <h1>Mon site</h1>
    </header>

    <nav class="rf-nav" role="navigation" aria-label="Navigation principale">
        <!-- Navigation -->
    </nav>

    <main class="rf-main" role="main">
        <!-- Contenu principal -->
    </main>

    <footer class="rf-footer" role="contentinfo">
        <!-- Pied de page -->
    </footer>

    <script src="assets/js/rgaa.js"></script>
</body>
</html>
```

### Système de grille
```html
<div class="rf-container">
    <div class="rf-row">
        <div class="rf-col-md-6">Colonne 1</div>
        <div class="rf-col-md-6">Colonne 2</div>
    </div>
</div>
```

## 🧩 Composants

### Modale accessible
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

### Formulaire avec validation
```html
<form data-rf-validate class="rf-form">
    <div class="rf-form-group">
        <label for="email" class="rf-form-label">
            E-mail <span class="rf-required">obligatoire</span>
        </label>
        <input type="email" 
               id="email" 
               class="rf-form-control" 
               required 
               aria-describedby="email-error">
        <div id="email-error" class="rf-invalid-feedback"></div>
    </div>
    
    <button type="submit" class="rf-btn rf-btn-primary">
        Valider
    </button>
</form>
```

### Navigation accessible
```html
<nav class="rf-navbar" role="navigation" aria-label="Navigation principale">
    <div class="rf-container">
        <a class="rf-navbar-brand" href="/">Mon site</a>
        
        <button class="rf-navbar-toggler" type="button">
            <span class="rf-sr-only">Basculer la navigation</span>
        </button>
        
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

## 🎨 Personnalisation

### Variables Sass principales
```scss
// Couleurs conformes RGAA
$colors: (
  'primary': #0053b3,    // Contraste 4.5:1 sur blanc
  'secondary': #6c757d,
  'success': #198754,
  'danger': #dc3545,
  // ...
);

// Focus
$focus-color: #005fcc;
$focus-width: 2px;
$focus-offset: 2px;

// Grille
$grid-breakpoints: (
  xs: 0,
  sm: 576px,
  md: 768px,
  lg: 992px,
  xl: 1200px,
  xxl: 1400px
);
```

### Configuration JavaScript
```javascript
// Configuration personnalisée
window.RGAA.init({
  autoInit: true,        // Auto-détection composants
  skipLinks: true,       // Skip links automatiques
  announcer: true,       // Annonceur ARIA
  debug: false          // Mode debug
});

// Ajouter un composant personnalisé
window.RGAA.registerComponent('monComposant', MaClasse);
```

## 🧪 Tests et validation

### Validation W3C automatique
```bash
npm run test
```

### Tests d'accessibilité manuels
- [ ] Navigation au clavier uniquement
- [ ] Test avec lecteur d'écran
- [ ] Vérification contrastes
- [ ] Validation RGAA 4.1.2

### Outils recommandés
- **axe DevTools** (extension navigateur)
- **WAVE** (Web Accessibility Evaluation Tool)
- **Lighthouse** (audit accessibilité)
- **NVDA/JAWS** (lecteurs d'écran)

## 📁 Structure du projet

```
rgaa-framework/
├── dist/                 # Build de production
│   ├── assets/
│   │   ├── css/main.css
│   │   └── js/rgaa.js
│   └── index.html
├── src/
│   ├── sass/
│   │   ├── core/         # Variables, mixins, reset, grille
│   │   ├── components/   # Composants (modal, nav, forms...)
│   │   ├── utilities/    # Utilitaires (focus, sr-only...)
│   │   └── main.scss
│   ├── js/
│   │   ├── core/         # Helpers (ARIA, focus, skip-links)
│   │   ├── components/   # Composants JS
│   │   └── rgaa.js       # Fichier principal
│   ├── twig/             # Templates
│   └── img/              # Images
├── tasks/                # Tâches Gulp
├── gulpfile.js
└── package.json
```

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature
3. Respecter les critères RGAA
4. Tester l'accessibilité
5. Soumettre une Pull Request

## 📝 Licence

MIT License - Voir `LICENSE` pour plus de détails.

## 🔗 Ressources

- [RGAA 4.1.2](https://www.numerique.gouv.fr/publications/rgaa-accessibilite/)
- [WCAG 2.1](https://www.w3.org/WAI/WCAG21/quickref/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [WebAIM](https://webaim.org/)

---

**Développé avec ❤️ pour l'accessibilité web**
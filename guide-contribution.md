# Guide de contribution - RGAA Framework

Merci de votre intérêt pour contribuer au RGAA Framework ! 🎉

Ce guide vous aidera à contribuer de manière efficace et cohérente.

## 🎯 Notre mission

Créer le framework web le plus accessible possible, conforme RGAA 4.1.2, pour démocratiser l'accessibilité numérique.

## 🤝 Types de contributions

### 🐛 Signaler un bug
- Vérifiez que le bug n'est pas déjà signalé
- Utilisez le template d'issue fourni
- Incluez les étapes de reproduction
- Précisez le navigateur et la technologie d'assistance

### ✨ Proposer une fonctionnalité
- Ouvrez d'abord une Discussion GitHub
- Décrivez le besoin d'accessibilité adressé
- Proposez une implémentation RGAA-conforme
- Attendez les retours avant de coder

### 📚 Améliorer la documentation
- Corrigez les erreurs ou imprécisions
- Ajoutez des exemples pratiques
- Traduisez en d'autres langues
- Améliorez la clarté des explications

### 🔧 Contribuer au code
- Respectez les standards d'accessibilité
- Suivez les conventions de code
- Ajoutez des tests d'accessibilité
- Documentez vos changements

## 🚀 Démarrage rapide

### 1. Fork et clone
```bash
# Fork sur GitHub puis clonez
git clone https://github.com/[votre-username]/rgaa-framework.git
cd rgaa-framework

# Ajoutez l'upstream
git remote add upstream https://github.com/[repo-principal]/rgaa-framework.git
```

### 2. Installation
```bash
# Installez les dépendances
npm install

# Lancez le développement
npm run dev
```

### 3. Créez une branche
```bash
# Créez une branche descriptive
git checkout -b feature/composant-accordeon
git checkout -b fix/modal-focus-trap
git checkout -b docs/guide-validation
```

## 📝 Standards de code

### CSS/Sass

#### Conventions de nommage
```scss
// ✅ Bon
.rf-accordion { }
.rf-accordion-header { }
.rf-accordion-content { }
.rf-accordion--expanded { }

// ❌ Éviter
.accordion { }
.AccordionHeader { }
.accordion_content { }
```

#### Structure des fichiers
```scss
// components/_accordion.scss
@use "../core/mixins" as *;
@use "../core
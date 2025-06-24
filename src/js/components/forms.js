// components/forms.js

class FormValidator {
  constructor(form, options = {}) {
    this.form = form;
    this.options = {
      validateOnSubmit: true,
      validateOnBlur: true,
      validateOnInput: false,
      showSuccessMessages: false,
      customValidators: {},
      messages: {
        required: 'Ce champ est obligatoire.',
        email: 'Veuillez saisir une adresse e-mail valide.',
        minlength: 'Ce champ doit contenir au moins {min} caractères.',
        maxlength: 'Ce champ ne peut pas contenir plus de {max} caractères.',
        pattern: 'Le format saisi n\'est pas valide.',
        min: 'La valeur doit être supérieure ou égale à {min}.',
        max: 'La valeur doit être inférieure ou égale à {max}.',
        custom: 'La valeur saisie n\'est pas valide.'
      },
      ...options
    };
    
    this.fields = new Map();
    this.isValid = false;
    
    this.init();
  }

  init() {
    this.setupForm();
    this.findFields();
    this.bindEvents();
    this.createErrorContainer();
  }

  setupForm() {
    this.form.setAttribute('novalidate', 'true'); // Désactive la validation native
    
    if (!this.form.getAttribute('role')) {
      this.form.setAttribute('role', 'form');
    }
  }

  findFields() {
    const fields = this.form.querySelectorAll('input, textarea, select');
    
    fields.forEach(field => {
      this.registerField(field);
    });
  }

  registerField(field) {
    const fieldData = {
      element: field,
      validators: this.getValidators(field),
      errorElement: null,
      isValid: true,
      isDirty: false
    };
    
    this.fields.set(field, fieldData);
    this.setupFieldAria(field, fieldData);
  }

  setupFieldAria(field, fieldData) {
    // Associe le champ à son label si nécessaire
    if (!field.getAttribute('aria-label') && !field.getAttribute('aria-labelledby')) {
      const label = this.form.querySelector(`label[for="${field.id}"]`);
      if (label && !label.id) {
        label.id = RGAAAria.generateId('label');
        field.setAttribute('aria-labelledby', label.id);
      }
    }
    
    // Création de l'élément d'erreur
    fieldData.errorElement = this.createErrorElement(field);
    field.setAttribute('aria-describedby', fieldData.errorElement.id);
    
    // Attribut required pour les champs obligatoires
    if (fieldData.validators.required) {
      field.setAttribute('aria-required', 'true');
    }
  }

  createErrorElement(field) {
    const errorId = RGAAAria.generateId('error');
    let errorElement = document.getElementById(errorId);
    
    if (!errorElement) {
      errorElement = document.createElement('div');
      errorElement.id = errorId;
      errorElement.className = 'rf-invalid-feedback';
      errorElement.setAttribute('role', 'alert');
      errorElement.setAttribute('aria-live', 'polite');
      
      // Insère après le champ ou après son conteneur parent
      const parent = field.closest('.rf-form-group') || field.parentNode;
      parent.appendChild(errorElement);
    }
    
    return errorElement;
  }

  createErrorContainer() {
    this.errorContainer = document.createElement('div');
    this.errorContainer.className = 'rf-form-errors rf-sr-only';
    this.errorContainer.setAttribute('role', 'alert');
    this.errorContainer.setAttribute('aria-live', 'assertive');
    this.form.insertBefore(this.errorContainer, this.form.firstChild);
  }

  getValidators(field) {
    const validators = {};
    
    // Required
    if (field.hasAttribute('required') || field.getAttribute('aria-required') === 'true') {
      validators.required = true;
    }
    
    // Type email
    if (field.type === 'email') {
      validators.email = true;
    }
    
    // Length
    if (field.hasAttribute('minlength')) {
      validators.minlength = parseInt(field.getAttribute('minlength'));
    }
    if (field.hasAttribute('maxlength')) {
      validators.maxlength = parseInt(field.getAttribute('maxlength'));
    }
    
    // Min/Max pour les nombres
    if (field.hasAttribute('min')) {
      validators.min = parseFloat(field.getAttribute('min'));
    }
    if (field.hasAttribute('max')) {
      validators.max = parseFloat(field.getAttribute('max'));
    }
    
    // Pattern
    if (field.hasAttribute('pattern')) {
      validators.pattern = new RegExp(field.getAttribute('pattern'));
    }
    
    // Validateurs personnalisés
    const customValidator = field.getAttribute('data-rf-validator');
    if (customValidator && this.options.customValidators[customValidator]) {
      validators.custom = this.options.customValidators[customValidator];
    }
    
    return validators;
  }

  bindEvents() {
    // Validation à la soumission
    if (this.options.validateOnSubmit) {
      this.form.addEventListener('submit', (e) => {
        if (!this.validateForm()) {
          e.preventDefault();
          this.focusFirstError();
        }
      });
    }
    
    // Validation au blur
    if (this.options.validateOnBlur) {
      this.form.addEventListener('blur', (e) => {
        const field = e.target;
        if (this.fields.has(field)) {
          this.validateField(field);
        }
      }, true);
    }
    
    // Validation en temps réel
    if (this.options.validateOnInput) {
      this.form.addEventListener('input', (e) => {
        const field = e.target;
        if (this.fields.has(field)) {
          const fieldData = this.fields.get(field);
          fieldData.isDirty = true;
          
          // Délai pour éviter la validation à chaque frappe
          clearTimeout(fieldData.inputTimeout);
          fieldData.inputTimeout = setTimeout(() => {
            this.validateField(field);
          }, 300);
        }
      });
    }
  }

  validateField(field) {
    const fieldData = this.fields.get(field);
    if (!fieldData) return true;
    
    const validators = fieldData.validators;
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    // Required
    if (validators.required && !value) {
      isValid = false;
      errorMessage = this.options.messages.required;
    }
    
    // Email
    else if (validators.email && value && !this.isValidEmail(value)) {
      isValid = false;
      errorMessage = this.options.messages.email;
    }
    
    // Length
    else if (validators.minlength && value.length < validators.minlength) {
      isValid = false;
      errorMessage = this.options.messages.minlength.replace('{min}', validators.minlength);
    }
    else if (validators.maxlength && value.length > validators.maxlength) {
      isValid = false;
      errorMessage = this.options.messages.maxlength.replace('{max}', validators.maxlength);
    }
    
    // Min/Max
    else if (validators.min && parseFloat(value) < validators.min) {
      isValid = false;
      errorMessage = this.options.messages.min.replace('{min}', validators.min);
    }
    else if (validators.max && parseFloat(value) > validators.max) {
      isValid = false;
      errorMessage = this.options.messages.max.replace('{max}', validators.max);
    }
    
    // Pattern
    else if (validators.pattern && value && !validators.pattern.test(value)) {
      isValid = false;
      errorMessage = this.options.messages.pattern;
    }
    
    // Custom
    else if (validators.custom && value) {
      const customResult = validators.custom(value, field);
      if (customResult !== true) {
        isValid = false;
        errorMessage = typeof customResult === 'string' ? customResult : this.options.messages.custom;
      }
    }
    
    this.setFieldValidity(field, isValid, errorMessage);
    return isValid;
  }

  setFieldValidity(field, isValid, errorMessage = '') {
    const fieldData = this.fields.get(field);
    
    fieldData.isValid = isValid;
    
    // Classes CSS
    field.classList.toggle('rf-is-valid', isValid && this.options.showSuccessMessages);
    field.classList.toggle('rf-is-invalid', !isValid);
    
    // ARIA
    field.setAttribute('aria-invalid', !isValid);
    
    // Message d'erreur
    if (fieldData.errorElement) {
      fieldData.errorElement.textContent = errorMessage;
      fieldData.errorElement.style.display = !isValid ? 'block' : 'none';
    }
    
    // Annonce pour les lecteurs d'écran
    if (!isValid && fieldData.isDirty) {
      const fieldName = this.getFieldName(field);
      RGAAAria.announce(`Erreur dans le champ ${fieldName}: ${errorMessage}`, 'assertive');
    }
  }

  validateForm() {
    let isFormValid = true;
    const errors = [];
    
    this.fields.forEach((fieldData, field) => {
      const isFieldValid = this.validateField(field);
      if (!isFieldValid) {
        isFormValid = false;
        errors.push({
          field: field,
          message: fieldData.errorElement.textContent,
          name: this.getFieldName(field)
        });
      }
    });
    
    this.isValid = isFormValid;
    this.form.classList.toggle('rf-was-validated', true);
    
    // Résumé des erreurs
    if (!isFormValid) {
      this.showErrorSummary(errors);
    }
    
    // Événement personnalisé
    this.form.dispatchEvent(new CustomEvent('rf:form:validated', {
      detail: { isValid: isFormValid, errors: errors }
    }));
    
    return isFormValid;
  }

  showErrorSummary(errors) {
    const errorCount = errors.length;
    const summary = `Le formulaire contient ${errorCount} erreur${errorCount > 1 ? 's' : ''}. `;
    const errorList = errors.map(error => `${error.name}: ${error.message}`).join('. ');
    
    this.errorContainer.textContent = summary + errorList;
    
    // Annonce immédiate
    RGAAAria.announce(summary + `Première erreur: ${errors[0].message}`, 'assertive');
  }

  focusFirstError() {
    const firstErrorField = this.form.querySelector('.rf-is-invalid');
    if (firstErrorField) {
      firstErrorField.focus();
      firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  getFieldName(field) {
    // Essaie de trouver le nom du champ
    const label = this.form.querySelector(`label[for="${field.id}"]`);
    if (label) {
      return label.textContent.replace('*', '').trim();
    }
    
    return field.getAttribute('aria-label') || 
           field.getAttribute('placeholder') || 
           field.name || 
           'Champ';
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // API publique
  reset() {
    this.form.classList.remove('rf-was-validated');
    this.fields.forEach((fieldData, field) => {
      field.classList.remove('rf-is-valid', 'rf-is-invalid');
      field.removeAttribute('aria-invalid');
      if (fieldData.errorElement) {
        fieldData.errorElement.textContent = '';
        fieldData.errorElement.style.display = 'none';
      }
      fieldData.isValid = true;
      fieldData.isDirty = false;
    });
    this.errorContainer.textContent = '';
  }

  destroy() {
    this.fields.clear();
    // Les événements sont délégués, pas besoin de cleanup manuel
  }

  static init(selector = 'form[data-rf-validate]') {
    const forms = document.querySelectorAll(selector);
    const instances = [];
    
    forms.forEach(form => {
      if (!form.rfValidator) {
        const options = this.parseOptions(form);
        form.rfValidator = new FormValidator(form, options);
        instances.push(form.rfValidator);
      }
    });
    
    return instances;
  }

  static parseOptions(form) {
    const options = {};
    
    // Parse les options depuis les data-attributes
    if (form.hasAttribute('data-rf-validate-on-submit')) {
      options.validateOnSubmit = form.getAttribute('data-rf-validate-on-submit') !== 'false';
    }
    if (form.hasAttribute('data-rf-validate-on-blur')) {
      options.validateOnBlur = form.getAttribute('data-rf-validate-on-blur') !== 'false';
    }
    if (form.hasAttribute('data-rf-validate-on-input')) {
      options.validateOnInput = form.getAttribute('data-rf-validate-on-input') === 'true';
    }
    
    return options;
  }
}

// Auto-initialisation
document.addEventListener('DOMContentLoaded', () => {
  FormValidator.init();
});

// Export global
window.RGAAFormValidator = FormValidator;
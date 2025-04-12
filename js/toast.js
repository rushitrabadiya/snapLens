const toast = {
  container: null,

  init() {
    if (!this.container) {
      this.container = document.createElement("div");
      this.container.className = "toast-container";
      document.body.appendChild(this.container);
    }
  },

  show(options) {
    this.init();

    const defaults = {
      type: "info",
      title: "",
      message: "",
      duration: 3000,
    };

    const settings = { ...defaults, ...options };

    const icons = {
      success: "fas fa-check-circle",
      error: "fas fa-times-circle",
      warning: "fas fa-exclamation-circle",
      info: "fas fa-info-circle",
    };

    const toast = document.createElement("div");
    toast.className = `toast ${settings.type}`;

    const icon = document.createElement("i");
    icon.className = `toast-icon ${icons[settings.type]}`;

    const content = document.createElement("div");
    content.className = "toast-content";

    if (settings.title) {
      const title = document.createElement("div");
      title.className = "toast-title";
      title.textContent = settings.title;
      content.appendChild(title);
    }

    const message = document.createElement("div");
    message.className = "toast-message";
    message.textContent = settings.message;
    content.appendChild(message);

    toast.appendChild(icon);
    toast.appendChild(content);

    this.container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add("closing");
      toast.addEventListener("animationend", () => {
        toast.remove();
      });
    }, settings.duration);
  },

  success(message, title = "") {
    this.show({
      type: "success",
      title,
      message,
    });
  },

  error(message, title = "") {
    this.show({
      type: "error",
      title,
      message,
    });
  },

  warning(message, title = "") {
    this.show({
      type: "warning",
      title,
      message,
    });
  },

  info(message, title = "") {
    this.show({
      type: "info",
      title,
      message,
    });
  },
};

// Form validation utilities
const formValidation = {
  patterns: {
    name: /^[a-zA-Z\s]{2,50}$/,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    phone: /^\+?[\d\s-]{10,}$/,
    orderNumber: /^[A-Z0-9-]{5,}$/i,
  },

  messages: {
    name: {
      required: "Please enter your name",
      invalid: "Name should only contain letters and spaces (2-50 characters)",
    },
    email: {
      required: "Please enter your email address",
      invalid: "Please enter a valid email address",
    },
    phone: {
      required: "Please enter your phone number",
      invalid: "Please enter a valid phone number (minimum 10 digits)",
    },
    platform: {
      required: "Please select your platform",
    },
    product: {
      required: "Please select your product",
    },
    orderNumber: {
      required: "Please enter your order number",
      invalid: "Please enter a valid order number",
    },
    orderDate: {
      required: "Please select your order date",
      invalid: "Order date cannot be in the future",
    },
    subject: {
      required: "Please enter a subject",
      invalid: "Subject should be between 2 and 100 characters",
    },
    message: {
      required: "Please enter your message",
      invalid: "Message should be between 10 and 1000 characters",
    },
  },

  validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    const formGroup = field.closest(".form-group");

    // Required field validation
    if (!value) {
      this.setFieldStatus(
        formGroup,
        "invalid",
        this.messages[fieldName].required
      );
      return false;
    }

    // Pattern validation for specific fields
    if (this.patterns[fieldName]) {
      if (!this.patterns[fieldName].test(value)) {
        this.setFieldStatus(
          formGroup,
          "invalid",
          this.messages[fieldName].invalid
        );
        return false;
      }
    }

    // Special validations
    switch (fieldName) {
      case "orderDate":
        const selectedDate = new Date(value);
        const today = new Date();
        if (selectedDate > today) {
          this.setFieldStatus(
            formGroup,
            "invalid",
            this.messages.orderDate.invalid
          );
          return false;
        }
        break;

      case "message":
        if (value.length < 10 || value.length > 1000) {
          this.setFieldStatus(
            formGroup,
            "invalid",
            this.messages.message.invalid
          );
          return false;
        }
        break;

      case "subject":
        if (value.length < 2 || value.length > 100) {
          this.setFieldStatus(
            formGroup,
            "invalid",
            this.messages.subject.invalid
          );
          return false;
        }
        break;
    }

    this.setFieldStatus(formGroup, "valid");
    return true;
  },

  setFieldStatus(formGroup, status, message = "") {
    formGroup.classList.remove("valid", "invalid");
    formGroup.classList.add(status);

    const errorElement = formGroup.querySelector(".error-message");
    if (errorElement) {
      errorElement.textContent = message;
    } else if (message) {
      const errorDiv = document.createElement("div");
      errorDiv.className = "error-message";
      errorDiv.textContent = message;
      formGroup.appendChild(errorDiv);
    }
  },

  validateForm(form) {
    let isValid = true;
    const fields = form.querySelectorAll("input, select, textarea");

    fields.forEach((field) => {
      if (!this.validateField(field)) {
        isValid = false;
      }
    });

    return isValid;
  },
};

// Export both modules
window.toast = toast;
window.formValidation = formValidation;

// Form validation rules
const validationRules = {
  name: {
    required: true,
    minLength: 2,
    maxLength: 50,
  },
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  phone: {
    required: true,
    pattern: /^\+?[\d\s-]{10,}$/,
  },
  product: {
    required: true,
    minLength: 2,
  },
  orderNumber: {
    required: true,
    minLength: 3,
  },
  platform: {
    required: true,
  },
  orderDate: {
    required: true,
  },
};

// Function to show notification
function showNotification(message, type = "success") {
  const notification = document.createElement("div");
  notification.className = `notification ${type}`;
  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 3000);
}

// Function to validate form field
function validateField(field, rules) {
  const value = field.value.trim();
  const formGroup = field.closest(".form-group");
  const errorMessage =
    formGroup.querySelector(".error-message") || document.createElement("div");
  errorMessage.className = "error-message";
  formGroup.appendChild(errorMessage);

  if (rules.required && !value) {
    formGroup.classList.add("error");
    errorMessage.textContent = "This field is required";
    return false;
  }

  if (rules.minLength && value.length < rules.minLength) {
    formGroup.classList.add("error");
    errorMessage.textContent = `Minimum ${rules.minLength} characters required`;
    return false;
  }

  if (rules.maxLength && value.length > rules.maxLength) {
    formGroup.classList.add("error");
    errorMessage.textContent = `Maximum ${rules.maxLength} characters allowed`;
    return false;
  }

  if (rules.pattern && !rules.pattern.test(value)) {
    formGroup.classList.add("error");
    errorMessage.textContent = "Invalid format";
    return false;
  }

  formGroup.classList.remove("error");
  return true;
}

// Function to save warranty data to localStorage
function saveWarrantyData(data) {
  try {
    let warrantyData = JSON.parse(localStorage.getItem("warrantyData")) || [];
    warrantyData.push(data);
    localStorage.setItem("warrantyData", JSON.stringify(warrantyData));
    return true;
  } catch (error) {
    console.error("Error saving warranty data:", error);
    return false;
  }
}

// Function to convert data to Excel format
function convertToExcel(data) {
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Warranty Data");
  return wb;
}

// Function to handle form submission
function handleFormSubmit(event) {
  event.preventDefault();

  const form = event.target;
  let isValid = true;

  // Validate all fields
  Object.keys(validationRules).forEach((fieldName) => {
    const field = form.querySelector(`[name="${fieldName}"]`);
    if (field) {
      if (!validateField(field, validationRules[fieldName])) {
        isValid = false;
      }
    }
  });

  if (!isValid) {
    showNotification("Please correct the errors in the form", "error");
    return;
  }

  // Show loading state
  const submitButton = form.querySelector('button[type="submit"]');
  submitButton.classList.add("loading");
  submitButton.disabled = true;

  // Collect form data
  const formData = {
    name: form.querySelector('[name="name"]').value.trim(),
    email: form.querySelector('[name="email"]').value.trim(),
    phone: form.querySelector('[name="phone"]').value.trim(),
    product: form.querySelector('[name="product"]').value.trim(),
    orderNumber: form.querySelector('[name="orderNumber"]').value.trim(),
    platform: form.querySelector('[name="platform"]').value,
    orderDate: form.querySelector('[name="orderDate"]').value,
    submissionDate: new Date().toISOString(),
  };

  // Simulate API call delay
  setTimeout(() => {
    if (saveWarrantyData(formData)) {
      showNotification(
        "Warranty activated successfully! Thank you for your submission."
      );
      form.reset();
    } else {
      showNotification(
        "Error saving warranty data. Please try again.",
        "error"
      );
    }

    // Remove loading state
    submitButton.classList.remove("loading");
    submitButton.disabled = false;
  }, 1000);
}

// Initialize the form
document.addEventListener("DOMContentLoaded", () => {
  const warrantyForm = document.getElementById("warrantyForm");
  if (warrantyForm) {
    // Add real-time validation
    Object.keys(validationRules).forEach((fieldName) => {
      const field = warrantyForm.querySelector(`[name="${fieldName}"]`);
      if (field) {
        field.addEventListener("blur", () => {
          validateField(field, validationRules[fieldName]);
        });
      }
    });

    warrantyForm.addEventListener("submit", handleFormSubmit);
  }
});

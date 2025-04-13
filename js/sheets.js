// Google Sheets API configuration
const SHEET_ID = "1l3FXXSo9PGekhfQv42V3RpogeYF1BE2qjU-9YU5Ahj4"; // Google Sheet ID
const WARRANTY_SHEET_NAME = "Warranty Submissions";
const CONTACT_SHEET_NAME = "Contact Submissions";
const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbxSisaG6UtHN7nqtjEFrHioLwB8MTKsGmlsPaa_HndGnzUXw-k227KQ3dXuR9HbPvKI/exec";

// Function to submit form data using JSONP approach
function submitFormData(url) {
  return new Promise((resolve, reject) => {
    // Create a temporary form
    const form = document.createElement("form");
    form.method = "POST";
    form.target = "hidden-iframe";
    form.action = url;

    // Add it to the document body
    document.body.appendChild(form);

    // Create a hidden iframe to handle the response
    const iframe = document.createElement("iframe");
    iframe.name = "hidden-iframe";
    iframe.style.display = "none";
    document.body.appendChild(iframe);

    // Handle the response
    iframe.onload = () => {
      try {
        resolve({ success: true });
        // Clean up
        setTimeout(() => {
          document.body.removeChild(form);
          document.body.removeChild(iframe);
        }, 1000);
      } catch (error) {
        reject(error);
      }
    };

    // Submit the form
    form.submit();
  });
}

// Function to submit warranty form data
async function submitWarrantyForm(formData) {
  try {
    console.log("Submitting warranty form data:", formData);

    // Create form data URL
    const params = new URLSearchParams({
      sheetName: WARRANTY_SHEET_NAME,
      ...formData,
    });

    const url = `${SCRIPT_URL}?${params.toString()}`;
    console.log("Request URL:", url);

    const result = await submitFormData(url);
    console.log("Form submission result:", result);

    return result;
  } catch (error) {
    console.error("Error submitting warranty form:", error);
    throw error;
  }
}

// Function to submit contact form data
async function submitContactForm(formData) {
  try {
    console.log("Submitting contact form data:", formData);

    // Create form data URL
    const params = new URLSearchParams({
      sheetName: CONTACT_SHEET_NAME,
      ...formData,
    });

    const url = `${SCRIPT_URL}?${params.toString()}`;
    console.log("Request URL:", url);

    const result = await submitFormData(url);
    console.log("Form submission result:", result);

    return result;
  } catch (error) {
    console.error("Error submitting contact form:", error);
    throw error;
  }
}

// Export the functions
window.sheets = {
  submitWarrantyForm,
  submitContactForm,
};

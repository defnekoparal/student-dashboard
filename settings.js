// Basic interactivity for Settings page
document.addEventListener("DOMContentLoaded", () => {

  // Log out button
  document.getElementById("logout-btn").addEventListener("click", () => {
    window.location.href = "login.html";
  });

  // Update account button
  document.getElementById("update-account-btn").addEventListener("click", () => {
    alert("Account updated!");
  });

  // Export data button
  document.getElementById("export-data-btn").addEventListener("click", () => {
    alert("Your data has been exported!");
  });

  // Delete account button
  document.getElementById("delete-account-btn").addEventListener("click", () => {
    if (confirm("Are you sure you want to delete your account? This cannot be undone.")) {
      alert("Account deleted.");
      window.location.href = "login.html";
    }
  });

});

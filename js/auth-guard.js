// auth-guard.js
(function() {
  // Check for token in localStorage
  const token = localStorage.getItem('authToken');
  if (!token) {
    // Redirect to login if not authenticated
    window.location.href = 'login.html';
  }
})(); 
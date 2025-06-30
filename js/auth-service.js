// auth-service.js
const API_BASE_URL = 'http://localhost:8080/api'; // Change to your backend URL

async function login(email, password) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  if (!response.ok) throw new Error('Login failed');
  const data = await response.json();
  localStorage.setItem('authToken', data.token);
  return data;
}

async function signup(email, password) {
  const response = await fetch(`${API_BASE_URL}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  if (!response.ok) throw new Error('Signup failed');
  const data = await response.json();
  localStorage.setItem('authToken', data.token);
  return data;
}

function logout() {
  localStorage.removeItem('authToken');
  window.location.href = 'login.html';
} 
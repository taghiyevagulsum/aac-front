// user-service.js
const USER_API_URL = `${API_BASE_URL}/users`;

async function getUserProfile() {
  const token = localStorage.getItem('authToken');
  const response = await fetch(`${USER_API_URL}/me`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!response.ok) throw new Error('Failed to fetch user profile');
  return response.json();
} 
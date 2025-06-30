// category-service.js
const CATEGORY_API_URL = `${API_BASE_URL}/categories`;

async function getCategories() {
  const token = localStorage.getItem('authToken');
  const response = await fetch(CATEGORY_API_URL, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!response.ok) throw new Error('Failed to fetch categories');
  return response.json();
} 
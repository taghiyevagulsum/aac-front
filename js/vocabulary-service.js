// vocabulary-service.js
const VOCAB_API_URL = `${API_BASE_URL}/vocabulary`;

async function getVocabulary() {
  const token = localStorage.getItem('authToken');
  const response = await fetch(VOCAB_API_URL, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!response.ok) throw new Error('Failed to fetch vocabulary');
  return response.json();
} 
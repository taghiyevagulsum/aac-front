// edit-page.js

document.addEventListener('DOMContentLoaded', async function() {
  // Check authentication
  if (!authService.isLoggedIn()) {
    window.location.href = 'login.html';
    return;
  }

  // Get item ID from URL
  const urlParams = new URLSearchParams(window.location.search);
  const itemId = urlParams.get('id');
  if (!itemId) {
    alert('No item ID provided.');
    window.location.href = 'index.html';
    return;
  }

  const categorySelect = document.querySelector('select');
  const form = document.querySelector('form');
  const nameInput = document.getElementById('name');
  const typeInputs = document.querySelectorAll('input[type="radio"][name="type"]');
  const imageInput = document.createElement('input');
  imageInput.type = 'file';
  imageInput.accept = CONFIG.SETTINGS.SUPPORTED_IMAGE_TYPES.join(',');
  let selectedImage = null;

  // Add image upload button logic
  const uploadBtn = Array.from(document.querySelectorAll('button')).find(btn => btn.textContent.includes('Upload Image'));
  if (uploadBtn) {
    uploadBtn.addEventListener('click', (e) => {
      e.preventDefault();
      imageInput.click();
    });
  }
  imageInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    const validation = vocabularyService.validateImageFile(file);
    if (!validation.valid) {
      alert(validation.error);
      selectedImage = null;
      return;
    }
    selectedImage = file;
  });

  // Populate categories
  async function loadCategories(selectedId) {
    const categories = await categoryService.getAllCategories();
    if (categorySelect) {
      categorySelect.innerHTML = '<option value="">-- Select a category --</option>';
      categories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat.id;
        option.textContent = cat.name;
        if (cat.id == selectedId) option.selected = true;
        categorySelect.appendChild(option);
      });
    }
  }

  // Load item data
  async function loadItem() {
    // For now, fetch all and find by ID (replace with get by ID if available)
    const all = await vocabularyService.getAllVocabulary();
    const item = all.find(i => i.id == itemId);
    if (!item) {
      alert('Item not found.');
      window.location.href = 'index.html';
      return;
    }
    nameInput.value = item.name;
    Array.from(typeInputs).forEach(r => { r.checked = (r.value === item.type); });
    await loadCategories(item.categoryId);
    // Optionally, show image preview
    // ...
  }
  await loadItem();

  // Handle form submission
  if (form) {
    form.addEventListener('submit', async function(e) {
      e.preventDefault();
      const name = nameInput.value.trim();
      const type = Array.from(typeInputs).find(r => r.checked)?.value || 'word';
      const categoryId = categorySelect.value;
      if (!name || !categoryId) {
        alert('Please fill in all required fields.');
        return;
      }
      const updates = { name, type, categoryId };
      if (selectedImage) updates.image = selectedImage;
      const result = await vocabularyService.updateVocabularyItem(itemId, updates);
      if (result.success) {
        window.location.href = 'index.html';
      } else {
        alert('Failed to update item: ' + result.error);
      }
    });
  }
}); 
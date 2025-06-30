// upload-page.js

document.addEventListener('DOMContentLoaded', async function() {
  // Check authentication
  if (!authService.isLoggedIn()) {
    window.location.href = 'login.html';
    return;
  }

  const categorySelect = document.querySelector('select');
  const form = document.querySelector('form');
  const nameInput = document.querySelector('input[placeholder="Name"]');
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
  async function loadCategories() {
    const categories = await categoryService.getAllCategories();
    if (categorySelect) {
      categorySelect.innerHTML = '<option selected>Choose a Category</option>';
      categories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat.id;
        option.textContent = cat.name;
        categorySelect.appendChild(option);
      });
    }
  }
  await loadCategories();

  // Handle form submission
  if (form) {
    form.addEventListener('submit', async function(e) {
      e.preventDefault();
      const name = nameInput.value.trim();
      const type = Array.from(typeInputs).find(r => r.checked)?.value || 'word';
      const categoryId = categorySelect.value;
      if (!name || !categoryId || categoryId === 'Choose a Category') {
        alert('Please fill in all required fields.');
        return;
      }
      const item = { name, type, categoryId };
      if (selectedImage) item.image = selectedImage;
      const result = await vocabularyService.createVocabularyItem(item);
      if (result.success) {
        window.location.href = 'index.html';
      } else {
        alert('Failed to create item: ' + result.error);
      }
    });
  }
}); 
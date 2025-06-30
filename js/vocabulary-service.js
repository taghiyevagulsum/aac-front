// Vocabulary Service for managing AAC vocabulary items
class VocabularyService {
    constructor() {
        this.cache = new Map();
        this.lastCacheUpdate = 0;
    }

    async getAllVocabulary() {
        try {
            // Check cache first
            if (this.isCacheValid()) {
                return Array.from(this.cache.values());
            }

            const response = await fetch(`${CONFIG.API_BASE_URL}${CONFIG.ENDPOINTS.VOCABULARY.GET_ALL}`, {
                method: 'GET',
                headers: authService.getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error('Failed to fetch vocabulary');
            }

            const vocabulary = await response.json();
            
            // Update cache
            this.updateCache(vocabulary);
            
            return vocabulary;
        } catch (error) {
            console.error('Error fetching vocabulary:', error);
            return [];
        }
    }

    async getVocabularyByCategory(categoryId) {
        try {
            const response = await fetch(`${CONFIG.API_BASE_URL}${CONFIG.ENDPOINTS.VOCABULARY.GET_BY_CATEGORY}/${categoryId}`, {
                method: 'GET',
                headers: authService.getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error('Failed to fetch vocabulary by category');
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching vocabulary by category:', error);
            return [];
        }
    }

    async createVocabularyItem(item) {
        try {
            const formData = new FormData();
            
            // Add text fields
            formData.append('name', item.name);
            formData.append('type', item.type);
            formData.append('categoryId', item.categoryId);
            
            // Add image if provided
            if (item.image) {
                formData.append('image', item.image);
            }

            const response = await fetch(`${CONFIG.API_BASE_URL}${CONFIG.ENDPOINTS.VOCABULARY.CREATE}`, {
                method: 'POST',
                headers: {
                    'Authorization': authService.getAuthHeaders().Authorization
                },
                body: formData
            });

            if (!response.ok) {
                throw new Error('Failed to create vocabulary item');
            }

            const newItem = await response.json();
            
            // Update cache
            this.cache.set(newItem.id, newItem);
            
            return { success: true, item: newItem };
        } catch (error) {
            console.error('Error creating vocabulary item:', error);
            return { success: false, error: error.message };
        }
    }

    async updateVocabularyItem(id, updates) {
        try {
            const formData = new FormData();
            
            // Add text fields
            Object.keys(updates).forEach(key => {
                if (key !== 'image') {
                    formData.append(key, updates[key]);
                }
            });
            
            // Add image if provided
            if (updates.image) {
                formData.append('image', updates.image);
            }

            const response = await fetch(`${CONFIG.API_BASE_URL}${CONFIG.ENDPOINTS.VOCABULARY.UPDATE}/${id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': authService.getAuthHeaders().Authorization
                },
                body: formData
            });

            if (!response.ok) {
                throw new Error('Failed to update vocabulary item');
            }

            const updatedItem = await response.json();
            
            // Update cache
            this.cache.set(updatedItem.id, updatedItem);
            
            return { success: true, item: updatedItem };
        } catch (error) {
            console.error('Error updating vocabulary item:', error);
            return { success: false, error: error.message };
        }
    }

    async deleteVocabularyItem(id) {
        try {
            const response = await fetch(`${CONFIG.API_BASE_URL}${CONFIG.ENDPOINTS.VOCABULARY.DELETE}/${id}`, {
                method: 'DELETE',
                headers: authService.getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error('Failed to delete vocabulary item');
            }

            // Remove from cache
            this.cache.delete(id);
            
            return { success: true };
        } catch (error) {
            console.error('Error deleting vocabulary item:', error);
            return { success: false, error: error.message };
        }
    }

    async searchIcons(query) {
        try {
            // This would typically call an icon library API
            // For now, we'll return a mock response
            const mockIcons = [
                { id: 1, url: 'https://example.com/icon1.png', name: 'Go' },
                { id: 2, url: 'https://example.com/icon2.png', name: 'Stop' },
                { id: 3, url: 'https://example.com/icon3.png', name: 'Help' }
            ];
            
            return mockIcons.filter(icon => 
                icon.name.toLowerCase().includes(query.toLowerCase())
            );
        } catch (error) {
            console.error('Error searching icons:', error);
            return [];
        }
    }

    // Cache management
    updateCache(vocabulary) {
        this.cache.clear();
        vocabulary.forEach(item => {
            this.cache.set(item.id, item);
        });
        this.lastCacheUpdate = Date.now();
    }

    isCacheValid() {
        return Date.now() - this.lastCacheUpdate < CONFIG.SETTINGS.CACHE_DURATION;
    }

    clearCache() {
        this.cache.clear();
        this.lastCacheUpdate = 0;
    }

    // Utility methods
    validateImageFile(file) {
        if (!file) return { valid: false, error: 'No file provided' };
        
        if (!CONFIG.SETTINGS.SUPPORTED_IMAGE_TYPES.includes(file.type)) {
            return { valid: false, error: 'Unsupported file type' };
        }
        
        if (file.size > CONFIG.SETTINGS.MAX_UPLOAD_SIZE) {
            return { valid: false, error: 'File too large' };
        }
        
        return { valid: true };
    }
}

// Create global instance
const vocabularyService = new VocabularyService();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = VocabularyService;
}
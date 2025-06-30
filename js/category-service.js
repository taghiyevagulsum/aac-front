// Category Service for managing AAC vocabulary categories
class CategoryService {
    constructor() {
        this.categories = [];
        this.lastUpdate = 0;
    }

    async getAllCategories() {
        try {
            // Check if we have recent data
            if (this.categories.length > 0 && Date.now() - this.lastUpdate < CONFIG.SETTINGS.CACHE_DURATION) {
                return this.categories;
            }

            const response = await fetch(`${CONFIG.API_BASE_URL}${CONFIG.ENDPOINTS.CATEGORIES.GET_ALL}`, {
                method: 'GET',
                headers: authService.getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error('Failed to fetch categories');
            }

            this.categories = await response.json();
            this.lastUpdate = Date.now();
            
            return this.categories;
        } catch (error) {
            console.error('Error fetching categories:', error);
            // Return default categories if API fails
            return this.getDefaultCategories();
        }
    }

    async createCategory(category) {
        try {
            const response = await fetch(`${CONFIG.API_BASE_URL}${CONFIG.ENDPOINTS.CATEGORIES.CREATE}`, {
                method: 'POST',
                headers: authService.getAuthHeaders(),
                body: JSON.stringify(category)
            });

            if (!response.ok) {
                throw new Error('Failed to create category');
            }

            const newCategory = await response.json();
            this.categories.push(newCategory);
            
            return { success: true, category: newCategory };
        } catch (error) {
            console.error('Error creating category:', error);
            return { success: false, error: error.message };
        }
    }

    async updateCategory(id, updates) {
        try {
            const response = await fetch(`${CONFIG.API_BASE_URL}${CONFIG.ENDPOINTS.CATEGORIES.UPDATE}/${id}`, {
                method: 'PUT',
                headers: authService.getAuthHeaders(),
                body: JSON.stringify(updates)
            });

            if (!response.ok) {
                throw new Error('Failed to update category');
            }

            const updatedCategory = await response.json();
            
            // Update local array
            const index = this.categories.findIndex(cat => cat.id === id);
            if (index !== -1) {
                this.categories[index] = updatedCategory;
            }
            
            return { success: true, category: updatedCategory };
        } catch (error) {
            console.error('Error updating category:', error);
            return { success: false, error: error.message };
        }
    }

    async deleteCategory(id) {
        try {
            const response = await fetch(`${CONFIG.API_BASE_URL}${CONFIG.ENDPOINTS.CATEGORIES.DELETE}/${id}`, {
                method: 'DELETE',
                headers: authService.getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error('Failed to delete category');
            }

            // Remove from local array
            this.categories = this.categories.filter(cat => cat.id !== id);
            
            return { success: true };
        } catch (error) {
            console.error('Error deleting category:', error);
            return { success: false, error: error.message };
        }
    }

    getCategoryById(id) {
        return this.categories.find(cat => cat.id === id);
    }

    getCategoryByName(name) {
        return this.categories.find(cat => cat.name.toLowerCase() === name.toLowerCase());
    }

    // Default categories for fallback
    getDefaultCategories() {
        return [
            { id: 1, name: 'Basic Needs', description: 'Essential daily needs', color: '#FF6B6B' },
            { id: 2, name: 'Actions', description: 'Common actions and verbs', color: '#4ECDC4' },
            { id: 3, name: 'Emotions', description: 'Feelings and emotions', color: '#45B7D1' },
            { id: 4, name: 'Food & Drink', description: 'Food and beverage items', color: '#96CEB4' },
            { id: 5, name: 'Places', description: 'Locations and places', color: '#FFEAA7' },
            { id: 6, name: 'People', description: 'Family and people', color: '#DDA0DD' },
            { id: 7, name: 'Objects', description: 'Common objects and items', color: '#98D8C8' },
            { id: 8, name: 'Activities', description: 'Hobbies and activities', color: '#F7DC6F' }
        ];
    }

    // Utility methods
    clearCache() {
        this.categories = [];
        this.lastUpdate = 0;
    }

    isValidCategory(category) {
        return category && 
               category.name && 
               category.name.trim().length > 0 &&
               category.name.trim().length <= 50;
    }
}

// Create global instance
const categoryService = new CategoryService();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CategoryService;
} 
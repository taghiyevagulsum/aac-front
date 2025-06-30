// User Service for managing user profiles and preferences
class UserService {
    constructor() {
        this.currentUser = null;
    }

    async getUserProfile() {
        try {
            const response = await fetch(`${CONFIG.API_BASE_URL}${CONFIG.ENDPOINTS.USERS.PROFILE}`, {
                method: 'GET',
                headers: authService.getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error('Failed to fetch user profile');
            }

            this.currentUser = await response.json();
            return this.currentUser;
        } catch (error) {
            console.error('Error fetching user profile:', error);
            return null;
        }
    }

    async updateUserProfile(updates) {
        try {
            const response = await fetch(`${CONFIG.API_BASE_URL}${CONFIG.ENDPOINTS.USERS.UPDATE}`, {
                method: 'PUT',
                headers: authService.getAuthHeaders(),
                body: JSON.stringify(updates)
            });

            if (!response.ok) {
                throw new Error('Failed to update user profile');
            }

            this.currentUser = await response.json();
            
            // Update stored user data
            localStorage.setItem('aac_user_data', JSON.stringify(this.currentUser));
            
            return { success: true, user: this.currentUser };
        } catch (error) {
            console.error('Error updating user profile:', error);
            return { success: false, error: error.message };
        }
    }

    async updatePreferences(preferences) {
        try {
            const response = await fetch(`${CONFIG.API_BASE_URL}${CONFIG.ENDPOINTS.USERS.UPDATE}`, {
                method: 'PUT',
                headers: authService.getAuthHeaders(),
                body: JSON.stringify({ preferences })
            });

            if (!response.ok) {
                throw new Error('Failed to update preferences');
            }

            this.currentUser = await response.json();
            localStorage.setItem('aac_user_data', JSON.stringify(this.currentUser));
            
            return { success: true, preferences: this.currentUser.preferences };
        } catch (error) {
            console.error('Error updating preferences:', error);
            return { success: false, error: error.message };
        }
    }

    getCurrentUser() {
        return this.currentUser || authService.getCurrentUser();
    }

    getUserPreferences() {
        const user = this.getCurrentUser();
        return user ? user.preferences : this.getDefaultPreferences();
    }

    getDefaultPreferences() {
        return {
            theme: 'light',
            fontSize: 'medium',
            gridSize: 'medium',
            autoSpeak: true,
            soundEffects: true,
            accessibility: {
                highContrast: false,
                reducedMotion: false,
                screenReader: false
            }
        };
    }

    // Utility methods
    isValidProfileUpdate(updates) {
        const allowedFields = ['name', 'email', 'preferences'];
        return Object.keys(updates).every(key => allowedFields.includes(key));
    }

    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    validateName(name) {
        return name && name.trim().length >= 2 && name.trim().length <= 50;
    }
}

// Create global instance
const userService = new UserService();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UserService;
} 
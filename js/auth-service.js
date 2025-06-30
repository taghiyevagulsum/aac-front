// Authentication Service
class AuthService {
    constructor() {
        this.isAuthenticated = false;
        this.user = null;
        this.token = null;
        this.init();
    }

    init() {
        // Check if user is already logged in
        this.token = localStorage.getItem('aac_auth_token');
        const userData = localStorage.getItem('aac_user_data');
        
        if (this.token && userData) {
            try {
                this.user = JSON.parse(userData);
                this.isAuthenticated = true;
            } catch (error) {
                this.logout();
            }
        }
    }

    async login(email, password) {
        try {
            const response = await fetch(`${CONFIG.API_BASE_URL}${CONFIG.ENDPOINTS.AUTH.LOGIN}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password })
            });

            if (!response.ok) {
                throw new Error('Login failed');
            }

            const data = await response.json();
            
            this.token = data.token;
            this.user = data.user;
            this.isAuthenticated = true;

            // Store in localStorage
            localStorage.setItem('aac_auth_token', this.token);
            localStorage.setItem('aac_user_data', JSON.stringify(this.user));

            return { success: true, user: this.user };
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, error: error.message };
        }
    }

    async signup(name, email, password) {
        try {
            const response = await fetch(`${CONFIG.API_BASE_URL}${CONFIG.ENDPOINTS.AUTH.SIGNUP}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password })
            });

            if (!response.ok) {
                throw new Error('Signup failed');
            }

            const data = await response.json();
            
            this.token = data.token;
            this.user = data.user;
            this.isAuthenticated = true;

            // Store in localStorage
            localStorage.setItem('aac_auth_token', this.token);
            localStorage.setItem('aac_user_data', JSON.stringify(this.user));

            return { success: true, user: this.user };
        } catch (error) {
            console.error('Signup error:', error);
            return { success: false, error: error.message };
        }
    }

    logout() {
        this.token = null;
        this.user = null;
        this.isAuthenticated = false;
        
        localStorage.removeItem('aac_auth_token');
        localStorage.removeItem('aac_user_data');
        
        // Redirect to login page
        window.location.href = 'signup.html';
    }

    getAuthHeaders() {
        return {
            'Authorization': `Bearer ${this.token}`,
            'Content-Type': 'application/json'
        };
    }

    isLoggedIn() {
        return this.isAuthenticated && this.token !== null;
    }

    getCurrentUser() {
        return this.user;
    }
}

// Create global instance
const authService = new AuthService();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AuthService;
}
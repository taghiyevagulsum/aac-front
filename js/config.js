// Configuration for the AAC application
const CONFIG = {
    // API endpoints - replace with your actual backend URLs
    // For production, use your deployed backend URL
    API_BASE_URL: 'https://goldfish-app-un8nb.ondigitalocean.app',
    
    // Alternative examples for different deployment scenarios:
    // API_BASE_URL: 'https://your-backend-domain.com/api',  // Custom domain
    // API_BASE_URL: 'https://your-app.herokuapp.com/api',   // Heroku
    // API_BASE_URL: 'https://your-app.railway.app/api',     // Railway
    // API_BASE_URL: 'https://your-app.render.com/api',      // Render
    // API_BASE_URL: 'https://api.yourdomain.com',           // Subdomain
    // API_BASE_URL: 'http://localhost:8080/api',            // Local development
    
    ENDPOINTS: {
        AUTH: {
            LOGIN: '/auth/login',
            SIGNUP: '/auth/signup',
            LOGOUT: '/auth/logout',
            VERIFY: '/auth/verify'
        },
        VOCABULARY: {
            GET_ALL: '/vocabulary',
            GET_BY_CATEGORY: '/vocabulary/category',
            CREATE: '/vocabulary',
            UPDATE: '/vocabulary',
            DELETE: '/vocabulary'
        },
        CATEGORIES: {
            GET_ALL: '/categories',
            CREATE: '/categories',
            UPDATE: '/categories',
            DELETE: '/categories'
        },
        USERS: {
            PROFILE: '/users/profile',
            UPDATE: '/users/profile'
        }
    },
    
    // Local storage keys
    STORAGE_KEYS: {
        AUTH_TOKEN: 'aac_auth_token',
        USER_DATA: 'aac_user_data',
        VOCABULARY_CACHE: 'aac_vocabulary_cache',
        CATEGORIES_CACHE: 'aac_categories_cache'
    },
    
    // App settings
    SETTINGS: {
        CACHE_DURATION: 5 * 60 * 1000, // 5 minutes
        MAX_UPLOAD_SIZE: 5 * 1024 * 1024, // 5MB
        SUPPORTED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
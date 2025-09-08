// API Configuration
// This file centralizes all API-related configuration

export const API_CONFIG = {
  // Base URL for API calls
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  
  // Timeout for API requests (in milliseconds)
  TIMEOUT: 30000,
  
  // File upload settings
  UPLOAD: {
    MAX_FILE_SIZE: 500 * 1024 * 1024, // 500MB
    ALLOWED_TYPES: ['*/*'], // All file types
  },
  
  // Endpoints
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      LOGOUT: '/auth/logout',
      SESSION: '/auth/session',
    },
    USER: {
      PROFILE: '/user/profile',
      PROFILE_PICTURE: '/user/profile-picture',
    },
    RESOURCES: {
      LIST: '/resources/list',
      UPLOAD: '/resources/upload',
      DOWNLOAD: '/resources/download',
      DELETE: '/resources',
      MY_RESOURCES: '/resources/my-resources',
    },
    PROFILE: {
      UPLOAD_PICTURE: '/profile/upload-picture',
      PICTURE: '/profile/picture',
    },
  },
  
  // Headers
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
};

// Helper function to build full API URLs
export const buildApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Helper function to get profile picture URL
export const getProfilePictureUrl = (userId: number): string => {
  return buildApiUrl(`/users/${userId}/profile-pic`);
};

// Helper function to get resource download URL
export const getResourceDownloadUrl = (resourceId: number): string => {
  return buildApiUrl(`/resources/download/${resourceId}`);
};

export default API_CONFIG;

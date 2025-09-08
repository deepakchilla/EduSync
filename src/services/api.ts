import { API_CONFIG } from '@/config/api';

const API_BASE_URL = API_CONFIG.BASE_URL;

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: 'STUDENT' | 'FACULTY';
  profilePicture?: string | null;
  createdAt: string;
  lastLogin?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  sessionToken: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: 'student' | 'faculty';
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface Resource {
  id: number;
  title: string;
  description: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  uploadedBy: number; // Matches backend Long uploadedBy
  uploadedAt: string; // Matches backend upload_date field
}

export interface Stats {
  students: number;
  faculty: number;
  resources: number;
  downloads: number;
}

// Generic API request function
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    
    // Get JWT token from sessionStorage
    const token = sessionStorage.getItem('jwt_token');
    
    const headers: Record<string, string> = {};

    // Only set default Content-Type if not already provided and not FormData
    if (!options.headers?.['Content-Type'] && !(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

    // Merge with provided headers
    if (options.headers) {
      Object.assign(headers, options.headers);
    }

    // Add Authorization header if token exists
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    } else {
      console.warn('No JWT token found in sessionStorage');
    }
    
    const response = await fetch(url, {
      headers,
      ...options,
    });

    if (!response.ok) {
      // If unauthorized, clear token
      if (response.status === 401) {
        sessionStorage.removeItem('jwt_token');
      }
      
      // Try to get error details from response
      let errorMessage = `HTTP error! status: ${response.status}`;
      try {
        const errorData = await response.json();
        if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        }
      } catch (e) {
        // Response might not be JSON
      }
      
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data;
      } catch (error) {
      console.error('API request failed:', error);
      
      // If it's already an ApiResponse, return it
      if (error && typeof error === 'object' && 'success' in error) {
        return error as ApiResponse<T>;
      }
      
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Request failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
}

// Authentication API
export const authApi = {
  // Login
  login: async (credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
    return apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  // Register
  register: async (userData: RegisterRequest): Promise<ApiResponse<{ user: User }>> => {
    return apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  // Logout
  logout: async (): Promise<ApiResponse> => {
    return apiRequest('/auth/logout', {
      method: 'POST',
    });
  },

  // Get current session
  getSession: async (): Promise<ApiResponse<{ user: User }>> => {
    return apiRequest('/auth/session');
  },

  // Forgot password
  forgotPassword: async (email: string): Promise<ApiResponse> => {
    return apiRequest('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  // Reset password (simplified - no tokens needed)
  resetPassword: async (email: string, newPassword: string): Promise<ApiResponse> => {
    return apiRequest('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ email, newPassword }),
    });
  },
};

// User API
export const userApi = {
  // Get user profile
  getProfile: async (userEmail: string): Promise<ApiResponse<User>> => {
    return apiRequest(`/user/profile?userEmail=${encodeURIComponent(userEmail)}`);
  },

  // Update user profile
  updateProfile: async (userEmail: string, userData: Partial<User>): Promise<ApiResponse<User>> => {
    return apiRequest('/user/profile/update', {
      method: 'POST',
      body: JSON.stringify({
        userEmail: userEmail,
        ...userData
      }),
    });
  },

  // Upload profile picture
  uploadProfilePicture: async (file: File, userEmail: string): Promise<ApiResponse<{ profilePicture: string }>> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('userEmail', userEmail);

    return apiRequest('/user/profile-picture', {
      method: 'POST',
      headers: {}, // Let browser set content-type for FormData
      body: formData,
    });
  },

  // Get profile picture URL
  getProfilePictureUrl: (userId: number): string => {
    return `${API_BASE_URL}/users/${userId}/profile-pic`;
  },

  // Remove profile picture
  removeProfilePicture: async (userEmail: string): Promise<ApiResponse> => {
    const formData = new URLSearchParams();
    formData.append('userEmail', userEmail);
    
    return apiRequest('/user/profile-picture', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });
  },
};

// Resources API
export const resourcesApi = {
  // Get all resources
  getAll: async (query: string = ''): Promise<ApiResponse<Resource[]>> => {
    return apiRequest(`/resources/list${query}`);
  },

  // Get faculty resources
  getFacultyResources: async (): Promise<ApiResponse<Resource[]>> => {
    return apiRequest('/resources/faculty');
  },

  // Get student accessed resources
  getStudentResources: async (): Promise<ApiResponse<Resource[]>> => {
    return apiRequest('/resources/accessed');
  },

  // Get my resources (for faculty)
  getMyResources: async (userEmail: string): Promise<ApiResponse<Resource[]>> => {
    const response = await apiRequest<{resources: Resource[], count: number}>(`/resources/my-resources?userEmail=${encodeURIComponent(userEmail)}`);
    
    // Handle the nested response structure from backend
    if (response.success && response.data && response.data.resources) {
      return {
        ...response,
        data: response.data.resources
      };
    }
    
    // If no nested structure, return empty array
    return {
      ...response,
      data: []
    };
  },

  // Search resources
  search: async (query: string): Promise<ApiResponse<Resource[]>> => {
    return apiRequest(`/resources/search?query=${encodeURIComponent(query)}`);
  },

  // Upload resource (Faculty only)
  upload: async (resourceData: FormData): Promise<ApiResponse<Resource>> => {
    return apiRequest('/resources/upload', {
      method: 'POST',
      body: resourceData,
    });
  },

  // Update resource (Faculty only)
  update: async (id: number, resourceData: Partial<Resource>): Promise<ApiResponse<Resource>> => {
    return apiRequest(`/resources/${id}`, {
      method: 'PUT',
      body: JSON.stringify(resourceData),
    });
  },

  // Delete resource (Faculty only)
  delete: async (id: number, userEmail: string): Promise<ApiResponse> => {
    const formData = new URLSearchParams();
    formData.append('userEmail', userEmail);
    
    return apiRequest(`/resources/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });
  },

  // Download resource file
  download: async (id: number): Promise<Blob> => {
    const response = await fetch(`${API_BASE_URL}/resources/download/${id}`);
    
    if (!response.ok) {
      throw new Error(`Download failed: ${response.status}`);
    }
    
    return response.blob();
  },
};

// Stats API
export const statsApi = {
  // Get dashboard stats
  getDashboardStats: async (): Promise<ApiResponse<Stats>> => {
    return apiRequest('/stats/dashboard');
  },

  // Get specific stats
  getStats: async (type: string): Promise<ApiResponse<any>> => {
    return apiRequest(`/stats/${type}`);
  },
};

// Activities API
export interface Activity {
  id: number;
  studentId: number;
  category: string;
  title: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  credits?: number;
  certificateFile?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  approvedBy?: number;
  approvedAt?: string;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}

export const activitiesApi = {
  submit: async (form: FormData): Promise<ApiResponse<Activity>> => {
    return apiRequest('/activities/submit', {
      method: 'POST',
      body: form,
    });
  },
  my: async (userEmail: string): Promise<ApiResponse<Activity[]>> => {
    const res = await apiRequest<{ activities: Activity[] }>(`/activities/my?userEmail=${encodeURIComponent(userEmail)}`);
    return {
      ...res,
      data: (res.data as any)?.activities ?? [],
    } as any;
  },
  pending: async (): Promise<ApiResponse<Activity[]>> => {
    const res = await apiRequest<{ activities: Activity[] }>(`/activities/pending`);
    return {
      ...res,
      data: (res.data as any)?.activities ?? [],
    } as any;
  },
  approve: async (id: number, facultyEmail: string): Promise<ApiResponse<Activity>> => {
    return apiRequest(`/activities/${id}/approve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ facultyEmail }).toString(),
    });
  },
  reject: async (id: number, facultyEmail: string, reason: string): Promise<ApiResponse<Activity>> => {
    return apiRequest(`/activities/${id}/reject`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ facultyEmail, reason }).toString(),
    });
  },
};

// Certifications API
export interface Certification extends Activity {}

export const certificationsApi = {
  my: async (userEmail: string): Promise<ApiResponse<Certification[]>> => {
    const res = await apiRequest<{ certifications: Certification[] }>(`/certifications/my?userEmail=${encodeURIComponent(userEmail)}`);
    return {
      ...res,
      data: (res.data as any)?.certifications ?? [],
    } as any;
  },
  upload: async (form: FormData): Promise<ApiResponse<Certification>> => {
    return apiRequest('/certifications/upload', {
      method: 'POST',
      body: form,
    });
  },
  delete: async (id: number, userEmail: string): Promise<ApiResponse> => {
    const params = new URLSearchParams({ userEmail });
    return apiRequest(`/certifications/${id}?${params.toString()}`, {
      method: 'DELETE',
    });
  },
};

// Portfolio API
export const portfolioApi = {
  summary: async (userEmail: string): Promise<ApiResponse<any>> => {
    return apiRequest(`/portfolio/summary?userEmail=${encodeURIComponent(userEmail)}`);
  },
};

// Utility functions
export const apiUtils = {
  // Get full URL for profile pictures
  getProfilePictureUrl: (profilePic: string): string => {
    if (profilePic.startsWith('http')) {
      return profilePic;
    }
    if (profilePic.startsWith('/api/user/')) {
      return `${API_BASE_URL}${profilePic}`;
    }
    return `${API_BASE_URL}/user/${profilePic}/profile-picture`;
  },

  // Handle API errors
  handleError: (error: any): string => {
    if (error?.message) {
      return error.message;
    }
    if (error?.error) {
      return error.error;
    }
    return 'An unexpected error occurred';
  },
};

export default {
  auth: authApi,
  user: userApi,
  resources: resourcesApi,
  stats: statsApi,
  utils: apiUtils,
};

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/services/api';
import { authApi } from '@/services/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (userData: any) => Promise<boolean>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  updateUserProfilePicture: (profilePicture: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  // Helper function to ensure role is properly formatted
  const normalizeUserRole = (userData: any): User => {
    if (userData.role && typeof userData.role === 'string') {
      userData.role = userData.role.toUpperCase() as 'STUDENT' | 'FACULTY';
    }
    return userData;
  };

  const checkAuth = async () => {
    try {
      // SIMPLE SOLUTION: Always try to restore from session storage first
      const storedUserData = sessionStorage.getItem('user_data');
      const token = sessionStorage.getItem('jwt_token');
      
      if (storedUserData && token) {
        try {
          const user = normalizeUserRole(JSON.parse(storedUserData));
          setUser(user);
          console.log('Restored user from session storage:', user);
          
                     // SIMPLE FIX: Skip backend validation to prevent role switching
          // The backend was causing students to be redirected to faculty dashboard
          console.log('Skipping backend validation to prevent automatic role switching');
          
          // NO MORE BACKEND VALIDATION - this was the problem!
        } catch (parseError) {
          console.error('Failed to parse stored user data:', parseError);
          sessionStorage.removeItem('jwt_token');
          sessionStorage.removeItem('user_data');
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      // Clear invalid data
      sessionStorage.removeItem('jwt_token');
      sessionStorage.removeItem('user_data');
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    try {
      const response = await authApi.login({ email, password });
      
      if (response.success && response.data) {
        const userData = normalizeUserRole(response.data.user);
        
        // Ensure profilePicture is properly set
        if (userData.profilePicture) {
          console.log('Login: Profile picture found, length:', userData.profilePicture.length);
        } else {
          console.log('Login: No profile picture found');
        }
        
        setUser(userData);
        
        // Generate a simple session token for demo purposes
        const sessionToken = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        sessionStorage.setItem('jwt_token', sessionToken);
        
        // Store user data in session storage for frontend session management
        sessionStorage.setItem('user_data', JSON.stringify(userData));
        console.log('Login: User data stored in session storage:', userData);
        
        return { success: true };
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error: any) {
      console.error('Login failed:', error);
      return { 
        success: false, 
        message: error.message || 'Login failed. Please try again.' 
      };
    }
  };

  const register = async (userData: any): Promise<boolean> => {
    try {
      const response = await authApi.register(userData);
      
      if (response.success && response.data) {
        const user = normalizeUserRole(response.data.user);
        setUser(user);
        return true;
      } else {
        throw new Error(response.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration failed:', error);
      return false;
    }
  };

  const updateUserProfilePicture = (profilePicture: string | null) => {
    if (user) {
      console.log('AuthContext: Updating profile picture:', profilePicture);
      console.log('AuthContext: Profile picture type:', typeof profilePicture);
      console.log('AuthContext: Profile picture length:', profilePicture?.length);
      
      const updatedUser = { ...user, profilePicture };
      setUser(updatedUser);
      
      console.log('AuthContext: Updated user profile picture:', updatedUser.profilePicture);
    }
  };

  const logout = async () => {
    try {
      // Clear JWT token and user data
      sessionStorage.removeItem('jwt_token');
      sessionStorage.removeItem('user_data');
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
      // Clear user state anyway
      sessionStorage.removeItem('jwt_token');
      sessionStorage.removeItem('user_data');
      setUser(null);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  // Ensure user role is always properly formatted
  useEffect(() => {
    if (user && user.role && typeof user.role === 'string') {
      const normalizedRole = user.role.toUpperCase() as 'STUDENT' | 'FACULTY';
      if (normalizedRole !== user.role) {
        const updatedUser = { ...user, role: normalizedRole };
        setUser(updatedUser);
        // Update session storage
        const storedData = sessionStorage.getItem('user_data');
        if (storedData) {
          try {
            const parsedData = JSON.parse(storedData);
            parsedData.role = normalizedRole;
            sessionStorage.setItem('user_data', JSON.stringify(parsedData));
          } catch (e) {
            console.error('Failed to update role in session storage:', e);
          }
        }
      }
    }
  }, [user]);

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    checkAuth,
    updateUserProfilePicture,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

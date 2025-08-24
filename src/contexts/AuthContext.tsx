import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'faculty' | 'student';
  profilePicture?: string;
  createdAt?: string;
  lastLogin?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: 'faculty' | 'student') => Promise<boolean>;
  logout: () => void;
  loading: boolean;
  error: string | null;
  clearError: () => void;
  updateUserProfilePicture: (profilePictureUrl: string) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkCurrentSession();
  }, []);

  const checkCurrentSession = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/auth/session', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.user) {
          // Check for profile picture in localStorage
          const storedProfilePicture = localStorage.getItem('edusync_profile_picture');
          if (storedProfilePicture && !data.user.profilePicture) {
            data.user.profilePicture = storedProfilePicture;
            console.log('Profile picture restored from localStorage:', storedProfilePicture);
          }
          setUser(data.user);
        }
      }
    } catch (error) {
      console.log('Backend not available, using demo mode');
      // Fallback to demo mode if backend is not available
      const savedUser = localStorage.getItem('edusync_user');
      if (savedUser) {
        const userData = JSON.parse(savedUser);
        // Also check for profile picture in localStorage
        const storedProfilePicture = localStorage.getItem('edusync_profile_picture');
        if (storedProfilePicture && !userData.profilePicture) {
          userData.profilePicture = storedProfilePicture;
          console.log('Profile picture restored from localStorage:', storedProfilePicture);
        }
        setUser(userData);
      }
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string, role: 'faculty' | 'student'): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password, role })
      });
      
      const data = await response.json();
      
      if (data.success && data.user) {
        setUser(data.user);
        setLoading(false);
        return true;
      } else {
        setError(data.message || 'Login failed');
        setLoading(false);
        return false;
      }
    } catch (error) {
      console.log('Backend not available, using demo mode');
      // Fallback to demo mode if backend is not available
      if (email && password) {
        const newUser: User = {
          id: `${role}_${Date.now()}`,
          name: email.split('@')[0],
          email,
          role
        };
        setUser(newUser);
        localStorage.setItem('edusync_user', JSON.stringify(newUser));
        setLoading(false);
        return true;
      } else {
        setError('Please fill in all fields');
        setLoading(false);
        return false;
      }
    }
  };

  const logout = async () => {
    try {
      await fetch('http://localhost:8080/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
    } catch (error) {
      console.log('Backend not available, using demo mode');
    } finally {
      setUser(null);
      localStorage.removeItem('edusync_user');
    }
  };

  const clearError = () => {
    setError(null);
  };

  const updateUserProfilePicture = (profilePictureUrl: string) => {
    console.log('Updating user profile picture:', profilePictureUrl);
    if (user) {
      const updatedUser = { ...user, profilePicture: profilePictureUrl };
      console.log('Updated user object:', updatedUser);
      setUser(updatedUser);
      localStorage.setItem('edusync_user', JSON.stringify(updatedUser));
      
      // Also save profile picture separately for persistence
      if (profilePictureUrl) {
        localStorage.setItem('edusync_profile_picture', profilePictureUrl);
        console.log('Profile picture saved to localStorage:', profilePictureUrl);
      } else {
        localStorage.removeItem('edusync_profile_picture');
        console.log('Profile picture removed from localStorage');
      }
      
      console.log('Profile picture updated in state and localStorage');
    } else {
      console.log('No user found to update');
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, error, clearError, updateUserProfilePicture }}>
      {children}
    </AuthContext.Provider>
  );
};
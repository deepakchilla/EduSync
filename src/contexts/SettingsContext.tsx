import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { userApi } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

interface UserSettings {
  // Notifications
  emailNotifications: boolean;
  resourceUpdates: boolean;
  academicReminders: boolean;
  
  // Privacy
  profileVisibility: "public" | "private";
  showEmail: boolean;
  
  // Security
  sessionTimeout: "1h" | "8h" | "24h" | "7d";
}

interface SettingsContextType {
  settings: UserSettings;
  isLoading: boolean;
  updateSetting: (key: keyof UserSettings, value: any) => Promise<void>;
  saveSettings: () => Promise<void>;
  loadSettings: () => Promise<void>;
}

const defaultSettings: UserSettings = {
  emailNotifications: true,
  resourceUpdates: true,
  academicReminders: true,
  profileVisibility: "public",
  showEmail: false,
  sessionTimeout: "24h"
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

interface SettingsProviderProps {
  children: ReactNode;
}

export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(false);

  // Load user-specific settings when user changes
  useEffect(() => {
    if (user) {
      loadSettings();
    } else {
      // Reset to default when user logs out
      setSettings(defaultSettings);
    }
  }, [user]);

  // Remove dark theme functionality
  useEffect(() => {
    // Ensure dark mode is always removed
    document.documentElement.classList.remove('dark');
  }, []);

  const loadSettings = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      // Try to get user settings from backend
      // For now, we'll use a user-specific localStorage key as a fallback
      const userSettingsKey = `edusync-settings-${user.id}`;
      const savedSettings = localStorage.getItem(userSettingsKey);
      
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        setSettings(prev => ({ ...prev, ...parsed }));
      }
      
      // TODO: Replace with actual backend API call
      // const response = await userApi.getSettings(user.id);
      // if (response.success && response.data) {
      //   setSettings(prev => ({ ...prev, ...response.data }));
      // }
    } catch (error) {
      console.error('Failed to load user settings:', error);
      toast({
        title: "Error",
        description: "Failed to load your settings. Using defaults.",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateSetting = async (key: keyof UserSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    
    // Auto-save theme changes immediately
    if (key === 'theme') {
      await saveSettings();
    }
  };

  const saveSettings = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      // Save to user-specific localStorage key
      const userSettingsKey = `edusync-settings-${user.id}`;
      localStorage.setItem(userSettingsKey, JSON.stringify(settings));
      
      // TODO: Replace with actual backend API call
      // const response = await userApi.updateSettings(user.id, settings);
      // if (!response.success) {
      //   throw new Error(response.message || 'Failed to save settings');
      // }
      
      toast({
        title: "Settings Saved",
        description: "Your preferences have been updated successfully.",
        duration: 3000,
      });
    } catch (error) {
      console.error('Failed to save settings:', error);
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const value: SettingsContextType = {
    settings,
    isLoading,
    updateSetting,
    saveSettings,
    loadSettings,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

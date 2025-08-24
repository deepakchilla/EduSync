import React, { useState, useRef, useEffect } from 'react';
import { User, Camera, X, Loader2, Eye } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import ProfilePictureModal from './ProfilePictureModal';

interface ProfilePictureProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showUpload?: boolean;
  className?: string;
  onPictureChange?: (url: string) => void;
}

const ProfilePicture: React.FC<ProfilePictureProps> = ({
  size = 'md',
  showUpload = false,
  className = '',
  onPictureChange
}) => {
  const { user, updateUserProfilePicture } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [backendStatus, setBackendStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Local state for profile picture with persistence
  const [localProfilePicture, setLocalProfilePicture] = useState<string | null>(() => {
    // Try to get from localStorage first
    const stored = localStorage.getItem('edusync_profile_picture');
    if (stored) {
      console.log('Loaded profile picture from localStorage:', stored);
      return stored;
    }
    // Fallback to user's profile picture
    return user?.profilePicture || null;
  });

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select an image file');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('File size must be less than 5MB');
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setUploadError(null);
  };

  const handleSave = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      console.log('Starting file upload:', selectedFile.name, selectedFile.size, selectedFile.type);
      
      const formData = new FormData();
      formData.append('file', selectedFile);

      console.log('Sending request to:', 'http://localhost:8080/api/profile/upload-picture');
      
      const response = await fetch('http://localhost:8080/api/profile/upload-picture', {
        method: 'POST',
        credentials: 'include',
        body: formData
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Response data:', data);

             if (data.success) {
         console.log('Upload successful:', data.profilePictureUrl);
         
                   // Update local state and localStorage for persistence
          setLocalProfilePicture(data.profilePictureUrl);
          localStorage.setItem('edusync_profile_picture', data.profilePictureUrl);
          console.log('Profile picture saved to localStorage:', data.profilePictureUrl);
          
          // Dispatch custom event to notify other components
          window.dispatchEvent(new CustomEvent('profilePictureUpdated', { 
            detail: { profilePictureUrl: data.profilePictureUrl } 
          }));
          
          // Update global user state with new profile picture
          updateUserProfilePicture(data.profilePictureUrl);
         
         // Also call the local callback if provided
         if (onPictureChange) {
           onPictureChange(data.profilePictureUrl);
         }
         
         // Clear the selected file and preview
         setSelectedFile(null);
         setPreviewUrl(null);
       } else {
        const errorMsg = data.message || 'Upload failed';
        console.error('Upload failed:', errorMsg);
        setUploadError(errorMsg);
      }
    } catch (error) {
      console.error('Upload error:', error);
      
      if (error instanceof Error) {
        if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
          setUploadError('Backend not available. Please check if the server is running.');
        } else {
          setUploadError(`Upload failed: ${error.message}`);
        }
      } else {
        setUploadError('Upload failed: Unknown error occurred');
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancel = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setUploadError(null);
  };

  const removePicture = async () => {
    try {
      // Call backend to remove profile picture
      const response = await fetch('http://localhost:8080/api/profile/remove-picture', {
        method: 'DELETE',
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
               if (data.success) {
         console.log('Profile picture removed successfully');
         
                   // Update local state and localStorage
          setLocalProfilePicture(null);
          localStorage.removeItem('edusync_profile_picture');
          console.log('Profile picture removed from localStorage');
          
          // Dispatch custom event to notify other components
          window.dispatchEvent(new CustomEvent('profilePictureUpdated', { 
            detail: { profilePictureUrl: null } 
          }));
          
          // Update global user state to remove profile picture
          updateUserProfilePicture('');
         
         // Also call the local callback if provided
         if (onPictureChange) {
           onPictureChange('');
         }
       } else {
          console.error('Failed to remove profile picture:', data.message);
        }
      } else {
        console.error('Failed to remove profile picture:', response.status);
      }
         } catch (error) {
       console.error('Error removing profile picture:', error);
       // Fallback: still update the UI even if backend call fails
       setLocalProfilePicture(null);
       localStorage.removeItem('edusync_profile_picture');
       
       // Dispatch custom event to notify other components
       window.dispatchEvent(new CustomEvent('profilePictureUpdated', { 
         detail: { profilePictureUrl: null } 
       }));
       
       updateUserProfilePicture('');
       if (onPictureChange) {
         onPictureChange('');
       }
     }
  };

  // Check backend status on component mount
  useEffect(() => {
    const checkBackendStatus = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/stats/dashboard', {
          method: 'GET',
          credentials: 'include'
        });
        if (response.ok) {
          setBackendStatus('online');
        } else {
          setBackendStatus('offline');
        }
      } catch (error) {
        console.log('Backend check failed:', error);
        setBackendStatus('offline');
      }
    };

    checkBackendStatus();
  }, []);

  // Sync local state with user state when user changes
  useEffect(() => {
    if (user?.profilePicture && !localProfilePicture) {
      console.log('Syncing profile picture from user state:', user.profilePicture);
      setLocalProfilePicture(user.profilePicture);
      localStorage.setItem('edusync_profile_picture', user.profilePicture);
    }
  }, [user?.profilePicture, localProfilePicture]);

  // Also sync when localStorage changes (for cross-component updates)
  useEffect(() => {
    const handleStorageChange = () => {
      const stored = localStorage.getItem('edusync_profile_picture');
      if (stored && stored !== localProfilePicture) {
        console.log('Profile picture updated from localStorage:', stored);
        setLocalProfilePicture(stored);
      }
    };

    const handleProfilePictureUpdate = (event: CustomEvent) => {
      const { profilePictureUrl } = event.detail;
      if (profilePictureUrl !== localProfilePicture) {
        console.log('Profile picture updated from custom event:', profilePictureUrl);
        setLocalProfilePicture(profilePictureUrl);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('profilePictureUpdated', handleProfilePictureUpdate as EventListener);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('profilePictureUpdated', handleProfilePictureUpdate as EventListener);
    };
  }, [localProfilePicture]);

  const getProfilePictureUrl = () => {
    // Use local state first (persistent), then fallback to user state
    const profilePic = localProfilePicture || user?.profilePicture;
    
    if (profilePic) {
      console.log('Profile picture source:', profilePic);
      // If it's already a full URL, return as is
      if (profilePic.startsWith('http')) {
        console.log('Returning full URL:', profilePic);
        return profilePic;
      }
      // If it's a relative path like "/api/user/{id}/profile-picture", construct the full URL
      if (profilePic.startsWith('/api/user/')) {
        const fullUrl = `http://localhost:8080${profilePic}`;
        console.log('Constructed full URL from relative path:', fullUrl);
        return fullUrl;
      }
      // If it's just a user ID, construct the full URL for the new endpoint
      if (/^\d+$/.test(profilePic)) {
        const fullUrl = `http://localhost:8080/api/user/${profilePic}/profile-picture`;
        console.log('Constructed full URL from user ID:', fullUrl);
        return fullUrl;
      }
      // If it's a user ID with profile-picture suffix, construct the full URL
      if (profilePic.includes('/profile-picture')) {
        const fullUrl = `http://localhost:8080/api/user/${profilePic}`;
        console.log('Constructed full URL from profile-picture path:', fullUrl);
        return fullUrl;
      }
    }
    console.log('No profile picture found');
    return null;
  };

  const profilePictureUrl = getProfilePictureUrl();

  return (
    <div className={`relative ${className}`}>
      {/* Backend Status Indicator */}
      {showUpload && (
        <div className="absolute -top-2 -left-2">
          <div className={`w-3 h-3 rounded-full ${
            backendStatus === 'online' ? 'bg-green-500' : 
            backendStatus === 'offline' ? 'bg-red-500' : 'bg-yellow-500'
          }`} title={`Backend: ${backendStatus}`}></div>
        </div>
      )}
      
      {/* Profile Picture Display */}
      <div className={`${sizeClasses[size]} rounded-full overflow-hidden bg-gray-200 flex items-center justify-center relative group`}>
        {previewUrl ? (
          // Show preview when file is selected
          <img
            src={previewUrl}
            alt="Preview"
            className="w-full h-full object-cover"
          />
        ) : profilePictureUrl ? (
          // Show actual profile picture
          <>
            <img
              src={profilePictureUrl}
              alt={`${user?.name || 'User'}'s profile`}
              className="w-full h-full object-cover cursor-pointer"
              onLoad={() => console.log('Image loaded successfully:', profilePictureUrl)}
              onError={(e) => {
                console.error('Image failed to load:', profilePictureUrl, e);
                // Fallback to default icon if image fails to load
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
              onClick={() => setIsModalOpen(true)}
            />
            {/* View overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 flex items-center justify-center transition-all duration-200">
              <button
                onClick={() => setIsModalOpen(true)}
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-white hover:text-blue-200"
                title="View profile picture"
              >
                <Eye className={iconSizes[size]} />
              </button>
            </div>
          </>
        ) : (
          <User className={`${iconSizes[size]} text-gray-500`} />
        )}
      </div>

      {/* Save/Cancel Buttons when file is selected */}
      {selectedFile && (
        <div className="absolute -bottom-12 left-0 right-0 flex space-x-2 justify-center">
          <button
            onClick={handleSave}
            disabled={isUploading}
            className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 disabled:opacity-50"
          >
            {isUploading ? 'Saving...' : 'Save'}
          </button>
          <button
            onClick={handleCancel}
            className="px-3 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-700"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Upload Overlay */}
      {showUpload && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="text-white hover:text-blue-200 transition-colors"
              title="Select profile picture"
            >
              <Camera className={iconSizes[size]} />
            </button>
          </div>
        </div>
      )}

      {/* Remove Picture Button */}
      {showUpload && profilePictureUrl && (
        <button
          onClick={removePicture}
          className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
          title="Remove profile picture"
        >
          <X className="w-3 h-3" />
        </button>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Upload Error */}
      {uploadError && (
        <div className="absolute top-full left-0 mt-2 bg-red-100 border border-red-300 text-red-700 px-3 py-1 rounded text-xs whitespace-nowrap z-10">
          {uploadError}
          <button
            onClick={() => setUploadError(null)}
            className="ml-2 text-red-500 hover:text-red-700"
          >
            ×
          </button>
        </div>
      )}

      {/* Profile Picture Modal */}
      <ProfilePictureModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        imageUrl={profilePictureUrl || ''}
        userName={user?.name || 'User'}
        onRemove={removePicture}
      />
    </div>
  );
};

export default ProfilePicture;

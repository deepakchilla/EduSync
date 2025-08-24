import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Camera, 
  Save, 
  Lock, 
  Bell, 
  Shield,
  Edit3
} from 'lucide-react';
import ProfilePicture from '../Common/ProfilePicture';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'settings' | 'security'>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    department: user?.role === 'faculty' ? 'Computer Science' : 'Computer Science',
    bio: '',
    location: '',
    website: ''
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: false,
    weeklyDigest: true,
    courseUpdates: true
  });

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle profile update
    setIsEditing(false);
    // Show success message
  };

  const handleNotificationChange = (key: keyof typeof notifications) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const tabs = [
    { id: 'profile', label: 'Profile Information', icon: User },
    { id: 'settings', label: 'Preferences', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield }
  ];

  return (
    <>
      <Helmet>
        <title>Profile - EduSync</title>
        <meta name="description" content="Manage your profile information, preferences, and account settings." />
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
            <p className="text-gray-600 mt-2">
              Manage your account information and preferences
            </p>
          </div>

          {/* Profile Header */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex items-center space-x-6">
              <ProfilePicture 
                size="xl" 
                showUpload={true}
                onPictureChange={(url) => {
                  // Handle profile picture change
                  console.log('Profile picture updated:', url);
                }}
              />
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{user?.name}</h2>
                <p className="text-gray-600">{user?.email}</p>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 mt-2">
                  {user?.role === 'faculty' ? 'Faculty Member' : 'Student'}
                </span>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="border-b border-gray-200">
              <nav className="flex">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600 bg-blue-50'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <tab.icon className="w-5 h-5 mr-2" />
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-6">
              {/* Profile Information Tab */}
              {activeTab === 'profile' && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
                    <button
                      onClick={() => setIsEditing(!isEditing)}
                      className="flex items-center px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      <Edit3 className="w-4 h-4 mr-2" />
                      {isEditing ? 'Cancel' : 'Edit'}
                    </button>
                  </div>

                  <form onSubmit={handleProfileUpdate} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="text"
                            value={profileData.name}
                            onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                            disabled={!isEditing}
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="email"
                            value={profileData.email}
                            onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                            disabled={!isEditing}
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="tel"
                            value={profileData.phone}
                            onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                            disabled={!isEditing}
                            placeholder="(555) 123-4567"
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {user?.role === 'faculty' ? 'Department' : 'Major'}
                        </label>
                        <input
                          type="text"
                          value={profileData.department}
                          onChange={(e) => setProfileData(prev => ({ ...prev, department: e.target.value }))}
                          disabled={!isEditing}
                          className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bio
                      </label>
                      <textarea
                        rows={4}
                        value={profileData.bio}
                        onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                        disabled={!isEditing}
                        placeholder="Tell us about yourself..."
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                      />
                    </div>

                    {isEditing && (
                      <div className="flex justify-end">
                        <button
                          type="submit"
                          className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                          <Save className="w-4 h-4 mr-2" />
                          Save Changes
                        </button>
                      </div>
                    )}
                  </form>
                </motion.div>
              )}

              {/* Settings Tab */}
              {activeTab === 'settings' && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">Notification Preferences</h3>
                  
                  <div className="space-y-6">
                    {Object.entries(notifications).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">
                            {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                          </h4>
                          <p className="text-sm text-gray-500">
                            {key === 'emailNotifications' && 'Receive notifications via email'}
                            {key === 'pushNotifications' && 'Receive push notifications in browser'}
                            {key === 'weeklyDigest' && 'Get a weekly summary of your activity'}
                            {key === 'courseUpdates' && 'Notifications about course updates and announcements'}
                          </p>
                        </div>
                        <button
                          onClick={() => handleNotificationChange(key as keyof typeof notifications)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            value ? 'bg-blue-600' : 'bg-gray-200'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              value ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Security Tab */}
              {activeTab === 'security' && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">Security Settings</h3>
                  
                  <div className="space-y-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">Password</h4>
                          <p className="text-sm text-gray-500">Last changed 3 months ago</p>
                        </div>
                        <button className="flex items-center px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
                          <Lock className="w-4 h-4 mr-2" />
                          Change Password
                        </button>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">Two-Factor Authentication</h4>
                          <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                        </div>
                        <button className="px-4 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 transition-colors">
                          Enable 2FA
                        </button>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">Login Sessions</h4>
                          <p className="text-sm text-gray-500">Manage your active login sessions</p>
                        </div>
                        <button className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors">
                          View Sessions
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default Profile;
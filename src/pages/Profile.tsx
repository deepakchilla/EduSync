import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/Layout/Header";
import { useAuth } from "@/contexts/AuthContext";
import { userApi, portfolioApi } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  GraduationCap,
  BookOpen,
  Download,
  Clock,
  Edit3,
  Save,
  X,
  Camera,
  Shield,
  Bell,
  Globe,
  Palette
} from "lucide-react";

// Extended user interface to include additional profile fields
interface ExtendedUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: 'STUDENT' | 'FACULTY';
  profilePicture?: string;
  createdAt: string;
  // Additional profile fields that might be added later
  phone?: string;
  location?: string;
  bio?: string;
  subjects?: string[];
  stats?: {
    resourcesAccessed: number;
    downloads: number;
    studyHours: number;
    favoriteSubjects: number;
  };
}

export default function Profile() {
  const { user: authUser, isAuthenticated, updateUserProfilePicture } = useAuth();
  const { toast } = useToast();
  const [user, setUser] = useState<ExtendedUser | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
    bio: ''
  });
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [portfolio, setPortfolio] = useState<any | null>(null);

  useEffect(() => {
    const loadPortfolio = async () => {
      if (!authUser?.email) return;
      const res = await portfolioApi.summary(authUser.email);
      if (res.success) setPortfolio(res.data);
    };
    loadPortfolio();
  }, [authUser?.email]);

  // Initialize user data from auth context
  useEffect(() => {
    if (authUser) {
      const extendedUser: ExtendedUser = {
        id: authUser.id,
        firstName: authUser.firstName,
        lastName: authUser.lastName,
        email: authUser.email,
        role: authUser.role,
        profilePicture: authUser.profilePicture,
        createdAt: authUser.createdAt,
        // Default values for optional fields
        phone: '+1 (555) 123-4567',
        location: 'New York, NY',
        bio: 'Passionate student pursuing Computer Science with a focus on AI and Machine Learning. Love exploring new technologies and contributing to open-source projects.',
        subjects: ['Computer Science', 'Mathematics', 'Physics'],
        stats: {
          resourcesAccessed: 47,
          downloads: 23,
          studyHours: 12.5,
          favoriteSubjects: 3
        }
      };
      
      setUser(extendedUser);
      setEditForm({
        firstName: extendedUser.firstName,
        lastName: extendedUser.lastName,
        email: extendedUser.email,
        phone: extendedUser.phone || '',
        location: extendedUser.location || '',
        bio: extendedUser.bio || ''
      });
    }
  }, [authUser]);

  // Sync local user state with authUser when profile picture changes
  useEffect(() => {
    if (authUser && user && authUser.profilePicture !== user.profilePicture) {
      setUser(prev => prev ? { ...prev, profilePicture: authUser.profilePicture } : null);
    }
  }, [authUser?.profilePicture, user]);

  const handleSave = async () => {
    if (!user) return;
    
    try {
      // Call API to update profile
      const response = await userApi.updateProfile(user.email, {
        firstName: editForm.firstName,
        lastName: editForm.lastName
      });
      
      if (response.success) {
        // Update local state with response data
        const updatedUser = { ...user, ...editForm };
        setUser(updatedUser);
        setIsEditing(false);
        
        // Show success message
        toast({
          title: "Profile Updated",
          description: "Your profile has been updated successfully!",
        });
        
        console.log('Profile updated successfully:', editForm);
      } else {
        // Show error message
        toast({
          variant: "destructive",
          title: "Update Failed",
          description: response.message || "Failed to update profile. Please try again.",
        });
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: "An error occurred while updating your profile. Please try again.",
      });
    }
  };

  const handleCancel = () => {
    if (!user) return;
    
    setEditForm({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone || '',
      location: user.location || '',
      bio: user.bio || ''
    });
    setIsEditing(false);
  };

  const handleProfilePictureUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

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

    setIsUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('userEmail', user.email);

      const data = await userApi.uploadProfilePicture(file, user.email);
      
      if (data.success) {
        // Update user profile picture with base64 data from response
        const profilePictureData = data.data?.profilePicture || '';
        
        console.log('Upload response data:', data);
        console.log('Profile picture base64 data received');
        
        // Update local state with the base64 data
        setUser(prev => prev ? { ...prev, profilePicture: profilePictureData } : null);
        
        // Update the auth context so navbar shows the new picture
        updateUserProfilePicture(profilePictureData);
        
        console.log('Profile picture uploaded successfully');
      } else {
        throw new Error(data.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      setUploadError('Failed to upload profile picture');
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Show loading state while user data is being fetched
  if (!authUser || !user) {
    return (
      <div className="min-h-screen bg-background">
        <Header isAuthenticated={false} />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading profile...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header isAuthenticated={true} userRole={user.role.toLowerCase() as 'student' | 'faculty'} userName={`${user.firstName} ${user.lastName}`} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Profile</h1>
              <p className="text-muted-foreground">Manage your account and preferences</p>
            </div>
            <Button 
              onClick={() => setIsEditing(!isEditing)}
              className="edu-button-primary"
            >
              {isEditing ? (
                <>
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </>
              ) : (
                <>
                  <Edit3 className="mr-2 h-4 w-4" />
                  Edit Profile
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info Card */}
            <Card className="edu-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Basic Information</span>
                </CardTitle>
                <CardDescription>Your personal details and contact information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Avatar Section */}
                <div className="flex items-center space-x-6">
                  <div className="relative">
                    <Avatar className="h-24 w-24">
                      <AvatarImage 
                        src={user?.profilePicture || ""} 
                        alt={`${user.firstName} ${user.lastName}`} 
                      />
                      <AvatarFallback className="text-2xl bg-blue-900 text-white">
                        {`${user.firstName[0]}${user.lastName[0]}`.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    {isEditing && (
                      <Button 
                        size="sm" 
                        className="absolute -bottom-2 -right-2 rounded-full p-2"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                      >
                        <Camera className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <div className="flex-1">
                    {isEditing ? (
                      <div className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="firstName">First Name</Label>
                            <Input
                              id="firstName"
                              value={editForm.firstName}
                              onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                              className="edu-input mt-1"
                            />
                          </div>
                          <div>
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input
                              id="lastName"
                              value={editForm.lastName}
                              onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                              className="edu-input mt-1"
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={editForm.email}
                            onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                            className="edu-input mt-1"
                          />
                        </div>
                      </div>
                    ) : (
                      <div>
                        <h3 className="text-xl font-semibold text-foreground">{user.firstName} {user.lastName}</h3>
                        <p className="text-muted-foreground">{user.email}</p>
                        <Badge className="mt-2 capitalize">{user.role.toLowerCase()}</Badge>
                      </div>
                    )}
                  </div>
                </div>

                {/* Contact Details */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label className="flex items-center space-x-2 text-sm font-medium text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      <span>Phone</span>
                    </Label>
                    {isEditing ? (
                      <Input
                        value={editForm.phone}
                        onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                        className="edu-input mt-1"
                      />
                    ) : (
                      <p className="mt-1 text-foreground">{user.phone || 'Not provided'}</p>
                    )}
                  </div>
                  <div>
                    <Label className="flex items-center space-x-2 text-sm font-medium text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>Location</span>
                    </Label>
                    {isEditing ? (
                      <Input
                        value={editForm.location}
                        onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                        className="edu-input mt-1"
                      />
                    ) : (
                      <p className="mt-1 text-foreground">{user.location || 'Not provided'}</p>
                    )}
                  </div>
                  <div>
                    <Label className="flex items-center space-x-2 text-sm font-medium text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>Joined</span>
                    </Label>
                    <p className="mt-1 text-foreground">{new Date(user.createdAt).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long' 
                    })}</p>
                  </div>
                  <div>
                    <Label className="flex items-center space-x-2 text-sm font-medium text-muted-foreground">
                      <GraduationCap className="h-4 w-4" />
                      <span>Role</span>
                    </Label>
                    <Badge className="mt-1 capitalize">{user.role.toLowerCase()}</Badge>
                  </div>
                </div>

                {/* Bio */}
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Bio</Label>
                  {isEditing ? (
                    <textarea
                      value={editForm.bio}
                      onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                      className="edu-input mt-1 w-full h-24 resize-none"
                      placeholder="Tell us about yourself..."
                    />
                  ) : (
                    <p className="mt-1 text-foreground">{user.bio || 'No bio provided'}</p>
                  )}
                </div>

                {/* Save/Cancel Buttons */}
                {isEditing && (
                  <div className="flex space-x-3 pt-4">
                    <Button onClick={handleSave} className="edu-button-primary">
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </Button>
                    <Button onClick={handleCancel} variant="outline">
                      <X className="mr-2 h-4 w-4" />
                      Cancel
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Academic Information */}
            <Card className="edu-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BookOpen className="h-5 w-5" />
                  <span>Academic Information</span>
                </CardTitle>
                <CardDescription>Your study preferences and academic details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Favorite Subjects</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {user.subjects && user.subjects.length > 0 ? (
                        user.subjects.map((subject, index) => (
                          <Badge key={index} variant="secondary" className="capitalize">
                            {subject}
                          </Badge>
                        ))
                      ) : (
                        <p className="text-muted-foreground text-sm">No subjects specified</p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Portfolio Summary */}
            <Card className="edu-card">
              <CardHeader>
                <CardTitle>Portfolio Summary</CardTitle>
                <CardDescription>Verified achievements overview</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Approved Activities</span>
                  <span className="font-semibold text-foreground">{portfolio?.approvedActivities ?? 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total Credits</span>
                  <span className="font-semibold text-foreground">{portfolio?.totalCredits ?? 0}</span>
                </div>
                <Button className="w-full mt-2" onClick={() => window.location.href = '/activities'}>
                  View Activities
                </Button>
              </CardContent>
            </Card>
            {/* Stats Summary */}
            <Card className="edu-card">
              <CardHeader>
                <CardTitle>Your Stats</CardTitle>
                <CardDescription>Quick overview of your activity</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Resources Accessed</span>
                  <span className="font-semibold text-foreground">{user.stats?.resourcesAccessed || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Downloads</span>
                  <span className="font-semibold text-foreground">{user.stats?.downloads || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Study Hours</span>
                  <span className="font-semibold text-foreground">{user.stats?.studyHours || 0}h</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Favorite Subjects</span>
                  <span className="font-semibold text-foreground">{user.stats?.favoriteSubjects || 0}</span>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="edu-card">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common profile tasks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Shield className="mr-2 h-4 w-4" />
                  Privacy Settings
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Bell className="mr-2 h-4 w-4" />
                  Notification Preferences
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Globe className="mr-2 h-4 w-4" />
                  Language & Region
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Palette className="mr-2 h-4 w-4" />
                  Theme Settings
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleProfilePictureUpload}
        className="hidden"
      />

      {/* Upload Error Display */}
      {uploadError && (
        <div className="fixed top-4 right-4 bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-md z-50">
          <div className="flex items-center justify-between">
            <span>{uploadError}</span>
            <button
              onClick={() => setUploadError(null)}
              className="ml-4 text-red-500 hover:text-red-700"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Upload Loading Indicator */}
      {isUploading && (
        <div className="fixed top-4 right-4 bg-blue-100 border border-blue-300 text-blue-700 px-4 py-3 rounded-md z-50">
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-700 mr-2"></div>
            Uploading profile picture...
          </div>
        </div>
      )}
    </div>
  );
}

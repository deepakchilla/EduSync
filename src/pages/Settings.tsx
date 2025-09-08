import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Header } from "@/components/Layout/Header";
import { useAuth } from "@/contexts/AuthContext";
import { useSettings } from "@/contexts/SettingsContext";
import { useToast } from "@/hooks/use-toast";
import { 
  Bell, 
  Shield, 
  Save,
  Trash2,
  AlertTriangle,
  Check
} from "lucide-react";

export default function Settings() {
  const { user: authUser, logout } = useAuth();
  const { settings, isLoading, updateSetting, saveSettings } = useSettings();
  const { toast } = useToast();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleSettingChange = async (key: keyof typeof settings, value: any) => {
    await updateSetting(key, value);
  };

  const handleSave = async () => {
    await saveSettings();
  };

  const handleDeleteAccount = async () => {
    if (!showDeleteConfirm) {
      setShowDeleteConfirm(true);
      return;
    }

    try {
      // In a real app, this would call the backend API
      await logout();
      toast({
        title: "Account Deleted",
        description: "Your account has been permanently deleted.",
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete account. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setShowDeleteConfirm(false);
    }
  };

  // Show loading state while user data is being fetched
  if (!authUser) {
    return (
      <div className="min-h-screen bg-background">
        <Header isAuthenticated={false} />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading settings...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header isAuthenticated={true} userRole={authUser.role.toLowerCase() as "student" | "faculty"} userName={`${authUser.firstName} ${authUser.lastName}`} />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Settings</h1>
              <p className="text-muted-foreground">Manage your account preferences and security</p>
            </div>
            <Button 
              onClick={handleSave} 
              disabled={isLoading}
              className="edu-button-primary"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Save Changes
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          {/* Notifications */}
          <Card className="edu-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5" />
                <span>Notifications</span>
              </CardTitle>
              <CardDescription>Manage how you receive updates and alerts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Email Notifications</Label>
                  <p className="text-xs text-muted-foreground">Receive updates via email</p>
                </div>
                <Switch
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => handleSettingChange('emailNotifications', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Resource Updates</Label>
                  <p className="text-xs text-muted-foreground">Notify when new resources are available</p>
                </div>
                <Switch
                  checked={settings.resourceUpdates}
                  onCheckedChange={(checked) => handleSettingChange('resourceUpdates', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Academic Reminders</Label>
                  <p className="text-xs text-muted-foreground">Important deadlines and reminders</p>
                </div>
                <Switch
                  checked={settings.academicReminders}
                  onCheckedChange={(checked) => handleSettingChange('academicReminders', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Privacy */}
          <Card className="edu-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Privacy & Security</span>
              </CardTitle>
              <CardDescription>Control your profile visibility and security settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Profile Visibility</Label>
                <Select value={settings.profileVisibility} onValueChange={(value) => handleSettingChange('profileVisibility', value)}>
                  <SelectTrigger className="edu-input mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Show Email Address</Label>
                  <p className="text-xs text-muted-foreground">Display email in public profile</p>
                </div>
                <Switch
                  checked={settings.showEmail}
                  onCheckedChange={(checked) => handleSettingChange('showEmail', checked)}
                />
              </div>
              
              <div>
                <Label className="text-sm font-medium">Session Timeout</Label>
                <Select value={settings.sessionTimeout} onValueChange={(value) => handleSettingChange('sessionTimeout', value)}>
                  <SelectTrigger className="edu-input mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1h">1 Hour</SelectItem>
                    <SelectItem value="8h">8 Hours</SelectItem>
                    <SelectItem value="24h">24 Hours</SelectItem>
                    <SelectItem value="7d">7 Days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Appearance section removed */}

          {/* Account Information */}
          <Card className="edu-card">
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>Your account details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Name</Label>
                <p className="text-foreground">{authUser.firstName} {authUser.lastName}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                <p className="text-foreground">{authUser.email}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Role</Label>
                <p className="text-foreground capitalize">{authUser.role}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Member Since</Label>
                <p className="text-foreground">{new Date(authUser.createdAt).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long' 
                })}</p>
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="edu-card border-destructive">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-destructive">
                <AlertTriangle className="h-5 w-5" />
                <span>Danger Zone</span>
              </CardTitle>
              <CardDescription>Irreversible and destructive actions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Delete Account</Label>
                  <p className="text-xs text-muted-foreground">Permanently delete your account and all data</p>
                </div>
                <Button 
                  variant="destructive" 
                  onClick={handleDeleteAccount}
                  disabled={isLoading}
                  className={showDeleteConfirm ? "bg-red-600 hover:bg-red-700" : ""}
                >
                  {showDeleteConfirm ? (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Confirm Delete
                    </>
                  ) : (
                    <>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Account
                    </>
                  )}
                </Button>
              </div>
              {showDeleteConfirm && (
                <p className="text-xs text-destructive mt-2">
                  This action cannot be undone. All your data will be permanently deleted.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

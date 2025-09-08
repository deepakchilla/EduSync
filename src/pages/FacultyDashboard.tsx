import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/Layout/Header";
import ResourceUpload from "@/components/Faculty/ResourceUpload";
import { activitiesApi } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { resourcesApi } from "@/services/api";
import { 
  BookOpen, 
  Upload, 
  Download, 
  Users, 
  TrendingUp,
  FileText,
  Video,
  Image,
  Archive,
  Clock,
  Eye,
  Trash2,
  Plus,
  Calendar,
  HardDrive
} from "lucide-react";

interface Resource {
  id: number;
  title: string;
  description?: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  uploadedBy: number; // Matches backend Long uploadedBy
  uploadedAt: string;
}

export default function FacultyDashboard() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const loadResources = async () => {
    if (!user?.email) return;
    
    try {
      setIsLoading(true);
      const data = await resourcesApi.getMyResources(user.email);
      if (data.success && Array.isArray(data.data)) {
        setResources(data.data);
      } else {
        console.warn('API returned unexpected data format:', data);
        setResources([]);
      }
    } catch (error) {
      console.error('Error loading resources:', error);
      setResources([]);
      toast({
        title: "Error",
        description: "Failed to load resources",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadResources();
    const loadPending = async () => {
      const res = await activitiesApi.pending();
      if (res.success) setPendingCount((res.data || []).length);
    };
    loadPending();
  }, [user?.email]);

  const handleUploadSuccess = () => {
    setShowUploadForm(false);
    loadResources();
    toast({
      title: "Success",
      description: "Resource uploaded successfully!",
      className: "border-green-500 bg-green-500 text-white",
    });
  };

  const handleDeleteResource = async (resourceId: number) => {
    if (!user?.email) return;
    
    if (!confirm('Are you sure you want to delete this resource?')) return;
    
    try {
      const data = await resourcesApi.delete(resourceId, user.email);
      if (data.success) {
        toast({
          title: "Resource deleted",
          description: "The resource has been successfully deleted.",
          className: "border-green-500 bg-green-500 text-white",
        });
        loadResources();
      }
    } catch (error) {
      console.error('Error deleting resource:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete resource. Please try again.",
      });
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileType: string) => {
    if (fileType?.includes('video')) return <Video className="h-5 w-5 text-red-500" />;
    if (fileType?.includes('image')) return <Image className="h-5 w-5 text-green-500" />;
    if (fileType?.includes('pdf')) return <FileText className="h-5 w-5 text-red-600" />;
    return <Archive className="h-5 w-5 text-blue-500" />;
  };

  const totalSize = Array.isArray(resources) ? resources.reduce((sum, resource) => sum + resource.fileSize, 0) : 0;

  if (!user || user.role !== 'FACULTY') {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground">Access Denied</h1>
            <p className="text-muted-foreground mt-2">This page is only accessible to faculty members.</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Faculty Dashboard</h1>
              <p className="text-muted-foreground mt-2">
                Welcome back, {user.firstName} {user.lastName}! Manage your educational resources.
              </p>
            </div>
            <Button 
              onClick={() => setShowUploadForm(!showUploadForm)}
              className="edu-button-primary"
            >
              <Plus className="mr-2 h-4 w-4" />
              {showUploadForm ? 'Cancel' : 'Upload Resource'}
            </Button>
          </div>
        </div>

        {/* Upload Form */}
        {showUploadForm && (
          <div className="mb-8">
            <ResourceUpload onUploadSuccess={handleUploadSuccess} />
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-muted-foreground">Total Resources</p>
                  <p className="text-2xl font-bold text-foreground">{resources.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-lg">
                  <HardDrive className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-muted-foreground">Storage Used</p>
                  <p className="text-2xl font-bold text-foreground">{formatFileSize(totalSize)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-muted-foreground">Students Reached</p>
                  <p className="text-2xl font-bold text-foreground">--</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <Download className="w-6 h-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-muted-foreground">Total Downloads</p>
                  <p className="text-2xl font-bold text-foreground">--</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending Approvals</p>
                  <p className="text-2xl font-bold text-foreground">{pendingCount}</p>
                </div>
                <Button onClick={() => (window.location.href = '/faculty/approvals')} variant="outline">Review</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Resources List */}
        <Card>
          <CardHeader>
            <CardTitle>Your Resources</CardTitle>
            <CardDescription>Manage all your uploaded educational materials</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : resources.length > 0 ? (
              <div className="space-y-4">
                {resources.map((resource) => (
                  <div key={resource.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        {getFileIcon(resource.fileType)}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-foreground">{resource.title}</h3>
                        {resource.description && (
                          <p className="text-sm text-muted-foreground">{resource.description}</p>
                        )}
                        <div className="flex items-center space-x-4 mt-2">
                          <span className="flex items-center text-xs text-muted-foreground">
                            <Calendar className="w-3 h-3 mr-1" />
                            {new Date(resource.uploadedAt).toLocaleDateString()}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {formatFileSize(resource.fileSize)}
                          </span>
                          <Badge variant="secondary" className="text-xs">
                            {resource.fileType}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:9090/api'}/resources/download/${resource.id}`, '_blank')}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteResource(resource.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No resources yet</h3>
                <p className="text-muted-foreground mb-4">Start sharing educational materials with your students</p>
                <Button onClick={() => setShowUploadForm(true)} className="edu-button-primary">
                  <Plus className="mr-2 h-4 w-4" />
                  Upload Your First Resource
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

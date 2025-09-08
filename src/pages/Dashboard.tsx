import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/Layout/Header";
import { Footer } from "@/components/Layout/Footer";
import { useAuth } from "@/contexts/AuthContext";
import FacultyDashboard from "./FacultyDashboard";
import { resourcesApi } from "@/services/api";
import { portfolioApi } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
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
  Heart,
  Plus,
  Star,
  History,
  Bookmark,
  Search,
  Filter,
  Calendar,
  Award,
  Target,
  BarChart3,
  PlayCircle,
  CheckCircle,
  RotateCcw
} from "lucide-react";

// Mock user data removed - using real authentication context

export default function Dashboard() {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [resources, setResources] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [recentlyAccessed, setRecentlyAccessed] = useState<any[]>([]);
  const [studyProgress, setStudyProgress] = useState({
    totalStudyTime: 0,
    completedResources: 0,
    currentStreak: 0,
    weeklyGoal: 10
  });
  const [isFavoritesLoading, setIsFavoritesLoading] = useState(false);
  const [isRecentlyAccessedLoading, setIsRecentlyAccessedLoading] = useState(false);
  const [portfolio, setPortfolio] = useState<any | null>(null);

  // Helper functions - defined first to avoid hoisting issues
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'pdf':
        return <FileText className="h-4 w-4" />;
      case 'video':
        return <Video className="h-4 w-4" />;
      case 'image':
        return <Image className="h-4 w-4" />;
      case 'archive':
        return <Archive className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const convertRoleForHeader = (role: string): 'student' | 'faculty' => {
    return role === 'FACULTY' ? 'faculty' : 'student';
  };

  // Helper functions for new features
  const toggleFavorite = async (resourceId: number) => {
    try {
      setIsFavoritesLoading(true);
      const isFavorited = favorites.some(fav => fav.id === resourceId);
      const resource = resources.find(r => r.id === resourceId);
      
      if (isFavorited) {
        // Remove from favorites
        const newFavorites = favorites.filter(fav => fav.id !== resourceId);
        setFavorites(newFavorites);
        localStorage.setItem(`favorites_${user?.email}`, JSON.stringify(newFavorites));
        toast({
          title: "Removed from favorites",
          description: `${resource?.title || 'Resource'} has been removed from your favorites`,
        });
      } else {
        // Add to favorites
        if (resource) {
          const newFavorite = { ...resource, favoritedAt: new Date().toISOString() };
          const newFavorites = [...favorites, newFavorite];
          setFavorites(newFavorites);
          localStorage.setItem(`favorites_${user?.email}`, JSON.stringify(newFavorites));
          toast({
            title: "Added to favorites",
            description: `${resource.title} has been added to your favorites`,
          });
        }
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast({
        title: "Error",
        description: "Failed to update favorites. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsFavoritesLoading(false);
    }
  };

  const addToRecentlyAccessed = (resource: any) => {
    try {
      setIsRecentlyAccessedLoading(true);
      const newRecentlyAccessed = (() => {
        const existing = recentlyAccessed.find(r => r.id === resource.id);
        if (existing) {
          // Move to top and update timestamp
          return [{ ...resource, accessedAt: new Date().toISOString() }, ...recentlyAccessed.filter(r => r.id !== resource.id)];
        } else {
          // Add new resource
          return [{ ...resource, accessedAt: new Date().toISOString() }, ...recentlyAccessed].slice(0, 10); // Keep only last 10
        }
      })();
      
      setRecentlyAccessed(newRecentlyAccessed);
      localStorage.setItem(`recentlyAccessed_${user?.email}`, JSON.stringify(newRecentlyAccessed));
    } catch (error) {
      console.error('Error adding to recently accessed:', error);
    } finally {
      setIsRecentlyAccessedLoading(false);
    }
  };

  const handleResourceClick = (resource: any) => {
    addToRecentlyAccessed(resource);
    updateStudyProgress();
    navigate(`/resource/${resource.id}`);
  };

  const updateStudyProgress = () => {
    if (user?.email) {
      const newProgress = {
        ...studyProgress,
        completedResources: studyProgress.completedResources + 1,
        totalStudyTime: studyProgress.totalStudyTime + 0.5, // Assume 30 minutes per resource
        currentStreak: Math.max(studyProgress.currentStreak, 1) // At least 1 day streak
      };
      setStudyProgress(newProgress);
      localStorage.setItem(`studyProgress_${user.email}`, JSON.stringify(newProgress));
    }
  };

  const isFavorited = (resourceId: number) => {
    return favorites.some(fav => fav.id === resourceId);
  };

  // Debug logging
  console.log('Dashboard render - User:', user);
  console.log('Dashboard render - User role:', user?.role);
  console.log('Dashboard render - User role type:', typeof user?.role);
  console.log('Dashboard render - Resources:', resources);
  console.log('Dashboard render - Loading:', isLoading);

  // Load all resources for students
  useEffect(() => {
    const loadResources = async () => {
      try {
        setIsLoading(true);
        const data = await resourcesApi.getAll();
        console.log('Resources API response:', data);
        
        if (data.success && data.data) {
          let resourcesArray: any[] = [];
          
          if (Array.isArray(data.data)) {
            resourcesArray = data.data;
          } else if (data.data && typeof data.data === 'object') {
            const dataObj = data.data as any;
            if (dataObj.resources && Array.isArray(dataObj.resources)) {
              resourcesArray = dataObj.resources;
            } else if (dataObj.content && Array.isArray(dataObj.content)) {
              resourcesArray = dataObj.content;
            }
          }
          
          console.log('Processed resources array:', resourcesArray);
          setResources(resourcesArray);
        } else {
          console.log('No resources data found, using empty array');
          setResources([]);
        }
      } catch (error) {
        console.error('Error loading resources:', error);
        setResources([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadResources();

    // Set up auto-refresh every 30 seconds
    const interval = setInterval(loadResources, 30000);
    
    return () => clearInterval(interval);
  }, []);

  // Load portfolio for student
  useEffect(() => {
    const loadPortfolio = async () => {
      if (!user?.email) return;
      const res = await portfolioApi.summary(user.email);
      if (res.success) setPortfolio(res.data);
    };
    loadPortfolio();
  }, [user?.email]);

  // Load persisted user data
  useEffect(() => {
    if (user?.email) {
      // Load favorites
      try {
        const savedFavorites = localStorage.getItem(`favorites_${user.email}`);
        if (savedFavorites) {
          setFavorites(JSON.parse(savedFavorites));
        }
      } catch (error) {
        console.error('Error loading favorites:', error);
      }

      // Load recently accessed
      try {
        const savedRecentlyAccessed = localStorage.getItem(`recentlyAccessed_${user.email}`);
        if (savedRecentlyAccessed) {
          setRecentlyAccessed(JSON.parse(savedRecentlyAccessed));
        }
      } catch (error) {
        console.error('Error loading recently accessed:', error);
      }

      // Load study progress
      try {
        const savedStudyProgress = localStorage.getItem(`studyProgress_${user.email}`);
        if (savedStudyProgress) {
          setStudyProgress(JSON.parse(savedStudyProgress));
        }
      } catch (error) {
        console.error('Error loading study progress:', error);
      }
    }
  }, [user?.email]);
  
  // Show loading while authentication is being checked
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  // If user is not authenticated, redirect to login
  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">Please log in to access the dashboard</h2>
          <p className="text-muted-foreground mb-4">You need to be authenticated to view this page.</p>
          <a href="/auth/login" className="text-primary hover:underline">Go to Login</a>
        </div>
      </div>
    );
  }

  // CRITICAL: Ensure user data is complete before proceeding
  if (!user.role || !user.email) {
    console.log('User data incomplete, waiting for full data...', user);
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <div className="ml-3 text-muted-foreground">Loading user data...</div>
      </div>
    );
  }

  // Determine dashboard type based on user role
  const isFaculty = user.role === 'FACULTY';
  const isStudent = user.role === 'STUDENT';

  // Debug logging for role determination
  console.log('🔍 ROLE DEBUG:', {
    userEmail: user.email,
    userRole: user.role,
    userRoleType: typeof user.role,
    userRoleLength: user.role?.length,
    isFaculty,
    isStudent,
    fullUser: user
  });

  // Redirect faculty users to the dedicated faculty dashboard
  if (isFaculty) {
    navigate('/faculty-dashboard');
    return null;
  }
  
  // Student Dashboard Data - now using real data
  const recentResources = resources.slice(0, 5).map((resource: any) => ({
    id: resource.id,
    title: resource.title || 'Untitled Resource',
    subject: resource.description ? resource.description.substring(0, 20) + '...' : 'General',
    type: resource.fileType || 'Unknown',
    size: resource.fileSize ? formatFileSize(resource.fileSize) : 'Unknown',
    downloadedAt: resource.uploadedAt ? new Date(resource.uploadedAt).toLocaleDateString() : 'Unknown',
    author: `User #${resource.uploadedBy || 'Unknown'}`
  }));
  
  // Fallback mock data if no real resources
  const mockRecentResources = [
    {
      id: 1,
      title: "Machine Learning Fundamentals - Week 3",
      subject: "Computer Science",
      type: "PDF",
      size: "8.7 MB",
      downloadedAt: "2 hours ago",
      author: "Dr. Sarah Chen"
    },
    {
      id: 2,
      title: "Data Structures & Algorithms Lab",
      subject: "Computer Science",
      type: "ZIP",
      size: "15.2 MB",
      downloadedAt: "1 day ago",
      author: "Prof. Michael Rodriguez"
    },
    {
      id: 3,
      title: "Web Development Best Practices",
      subject: "Software Engineering",
      type: "PDF",
      size: "3.9 MB",
      downloadedAt: "3 days ago",
      author: "Dr. Emily Watson"
    }
  ];

  const recommendedResources = [
    {
      id: 4,
      title: "React.js Complete Course 2024",
      subject: "Frontend Development",
      type: "Video",
      views: 2847,
      rating: 4.9
    },
    {
      id: 5,
      title: "Python for Data Science",
      subject: "Programming",
      type: "PDF",
      views: 1563,
      rating: 4.8
    },
    {
      id: 6,
      title: "DevOps & CI/CD Pipeline Guide",
      subject: "Software Engineering",
      type: "ZIP",
      views: 3421,
      rating: 4.7
    }
  ];

  // Faculty Dashboard Data (would be conditionally rendered based on role)
  const myUploads = [
    {
      id: 1,
      title: "Full-Stack Development Workshop",
      subject: "Web Development",
      type: "PDF",
      uploads: "15 minutes ago",
      views: 89,
      downloads: 34
    },
    {
      id: 2,
      title: "Mobile App UI/UX Guidelines",
      subject: "Design",
      type: "PDF",
      uploads: "2 days ago",
      views: 234,
      downloads: 156
    }
  ];

  // Render appropriate dashboard based on role
  if (isFaculty) {
    return (
      <div className="min-h-screen bg-background">
        <Header isAuthenticated={true} userRole={convertRoleForHeader(user.role)} userName={`${user.firstName || ''} ${user.lastName || ''}`.trim() || 'User'} />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Faculty Dashboard</h1>
            <p className="text-muted-foreground">Create, manage, and track your educational content with real-time analytics</p>
          </div>

          {/* Real-time Faculty Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="edu-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Uploads</CardTitle>
                <Upload className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{resources.length}</div>
                <p className="text-xs text-muted-foreground">
                  {resources.length > 0 ? 'Active resources' : 'No uploads yet'}
                </p>
              </CardContent>
            </Card>

            <Card className="edu-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">File Types</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {new Set(resources.map((r: any) => r.fileType?.split('/')[0] || 'Unknown')).size}
                </div>
                <p className="text-xs text-muted-foreground">
                  Different categories
                </p>
              </CardContent>
            </Card>

            <Card className="edu-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Size</CardTitle>
                <Download className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatFileSize(resources.reduce((total: number, r: any) => total + (r.fileSize || 0), 0))}
                </div>
                <p className="text-xs text-muted-foreground">
                  Combined storage
                </p>
              </CardContent>
            </Card>

            <Card className="edu-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Latest Upload</CardTitle>
                <Heart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {resources.length > 0 ? 
                    new Date(resources[0]?.uploadedAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                    : 'N/A'
                  }
                </div>
                <p className="text-xs text-muted-foreground">
                  {resources.length > 0 ? 'Most recent' : 'No uploads'}
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Quick Actions */}
            <Card className="edu-card">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Manage your content efficiently</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full edu-button-primary">
                  <Plus className="mr-2 h-4 w-4" />
                  Upload New Resource
                </Button>
                <Button variant="outline" className="w-full">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  View Analytics
                </Button>
                <Button variant="outline" className="w-full">
                  <Users className="mr-2 h-4 w-4" />
                  Manage Students
                </Button>
              </CardContent>
            </Card>

            {/* Real-time Recent Uploads */}
            <Card className="edu-card lg:col-span-2">
              <CardHeader>
                <CardTitle>Recent Uploads</CardTitle>
                <CardDescription>Your latest educational content</CardDescription>
              </CardHeader>
              <CardContent>
                {!isLoading && resources.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="bg-muted rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      <Upload className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">No uploads yet</h3>
                    <p className="text-muted-foreground mb-4">Start sharing educational resources with your students</p>
                    <Button className="edu-button-primary">
                      <Plus className="mr-2 h-4 w-4" />
                      Upload First Resource
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {resources.slice(0, 5).map((resource: any) => (
                      <div
                        key={resource.id}
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-muted transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="bg-primary text-primary-foreground p-2 rounded">
                            {getTypeIcon(resource.fileType || 'Unknown')}
                          </div>
                          <div>
                            <h4 className="font-medium text-foreground">{resource.title || 'Untitled'}</h4>
                            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                              <span>{resource.description ? resource.description.substring(0, 30) + '...' : 'No description'}</span>
                              <span>•</span>
                              <span className="flex items-center">
                                <Clock className="mr-1 h-3 w-3" />
                                {resource.uploadedAt ? new Date(resource.uploadedAt).toLocaleDateString() : 'Unknown date'}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-foreground">
                            {formatFileSize(resource.fileSize || 0)}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {resource.fileType || 'Unknown type'}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Student Dashboard
  return (
    <div className="min-h-screen bg-background">
      <Header isAuthenticated={true} userRole={convertRoleForHeader(user.role)} userName={`${user.firstName || ''} ${user.lastName || ''}`.trim() || 'User'} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="bg-white border border-gray-200 rounded-md mb-8">
          <div className="px-6 py-5 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user.firstName || 'User'}!</h1>
              <p className="text-gray-600">Your personalized learning hub</p>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-xs text-gray-500">Resources</span>
              <span className="px-3 py-1 text-sm rounded-full border border-gray-300 text-gray-700 bg-gray-50">
                {resources.length}
              </span>
            </div>
          </div>
        </div>

        {/* Real-time Status */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${isLoading ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`}></div>
              <span className="text-sm text-muted-foreground">
                {isLoading ? 'Updating resources...' : `Last updated: ${new Date().toLocaleTimeString()}`}
              </span>
              {isFavoritesLoading && (
                <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700">
                  Updating favorites...
                </Badge>
              )}
              {isRecentlyAccessedLoading && (
                <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700">
                  Updating history...
                </Badge>
              )}
            </div>
            {!isLoading && resources.length > 0 && (
              <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-xs">
                {resources.length} resources available
                </Badge>
                {favorites.length > 0 && (
                  <Badge variant="outline" className="text-xs bg-red-50 text-red-700">
                    {favorites.length} favorites
                  </Badge>
                )}
                {recentlyAccessed.length > 0 && (
                  <Badge variant="outline" className="text-xs bg-green-50 text-green-700">
                    {recentlyAccessed.length} recent
              </Badge>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2 text-lg">Loading resources...</span>
          </div>
        )}

        {/* Modern Stats Dashboard - Professional Layout */}
        <div className="bg-white border-l-4 border-l-blue-900 mb-6">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Resource Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-10 h-10 bg-blue-900 text-white rounded-full flex items-center justify-center mx-auto mb-3">
                  <BookOpen className="h-5 w-5" />
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{resources.length}</div>
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wider">Total Resources</p>
              </div>

              <div className="text-center">
                <div className="w-10 h-10 bg-blue-900 text-white rounded-full flex items-center justify-center mx-auto mb-3">
                  <Download className="h-5 w-5" />
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {new Set(resources.map((r: any) => r.fileType?.split('/')[0] || 'Unknown')).size}
                </div>
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wider">File Types</p>
              </div>

              <div className="text-center">
                <div className="w-10 h-10 bg-blue-900 text-white rounded-full flex items-center justify-center mx-auto mb-3">
                  <Clock className="h-5 w-5" />
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {formatFileSize(resources.reduce((total: number, r: any) => total + (r.fileSize || 0), 0))}
                </div>
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wider">Total Size</p>
              </div>

              <div className="text-center">
                <div className="w-10 h-10 bg-blue-900 text-white rounded-full flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {resources.length > 0 ? 
                    new Date(resources[0]?.uploadedAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                    : 'N/A'
                  }
                </div>
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wider">Latest Upload</p>
              </div>
            </div>
            {portfolio && (
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border rounded-md p-4 flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-600">Approved Activities</div>
                    <div className="text-xl font-semibold text-gray-900">{portfolio.approvedActivities ?? 0}</div>
                  </div>
                  <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center">✓</div>
                </div>
                <div className="border rounded-md p-4 flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-600">Total Credits</div>
                    <div className="text-xl font-semibold text-gray-900">{portfolio.totalCredits ?? 0}</div>
                  </div>
                  <div className="w-8 h-8 bg-blue-900 text-white rounded-full flex items-center justify-center">CR</div>
                </div>
                <button onClick={() => navigate('/activities')} className="border rounded-md p-4 text-left hover:bg-gray-50">
                  <div className="text-sm text-gray-600">Activities</div>
                  <div className="text-sm text-blue-900 font-semibold">View and submit →</div>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Professional Action Bar */}
        <div className="bg-white border border-gray-200 rounded-md py-6 mb-8">
          <div className="px-6 flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-y-0">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Quick Actions</h2>
              <p className="text-gray-600">Access your learning tools instantly</p>
            </div>
            
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => navigate('/resources')}
                className="edu-button-primary flex items-center py-2 px-4 text-sm font-medium"
              >
                <BookOpen className="mr-2 h-4 w-4" />
                Browse Resources
              </button>
              <button
                onClick={() => navigate('/resources')}
                className="edu-button-secondary flex items-center py-2 px-4 text-sm font-medium"
              >
                <Search className="mr-2 h-4 w-4" />
                Search
              </button>
              <button
                onClick={() => navigate('/profile')}
                className="edu-button-secondary flex items-center py-2 px-4 text-sm font-medium"
              >
                <Target className="mr-2 h-4 w-4" />
                Goals
              </button>
              <button
                onClick={() => window.location.reload()} 
                className="edu-button-secondary flex items-center py-2 px-4 text-sm font-medium"
              >
                <Clock className="mr-2 h-4 w-4" />
                Refresh
              </button>
              <button
                onClick={() => {
                  if (confirm('Clear all personal data? This will reset favorites, history, and progress.')) {
                    localStorage.removeItem(`favorites_${user?.email}`);
                    localStorage.removeItem(`recentlyAccessed_${user?.email}`);
                    localStorage.removeItem(`studyProgress_${user?.email}`);
                    setFavorites([]);
                    setRecentlyAccessed([]);
                    setStudyProgress({
                      totalStudyTime: 0,
                      completedResources: 0,
                      currentStreak: 0,
                      weeklyGoal: 10
                    });
                    toast({
                      title: "Data cleared",
                      description: "All personal data has been reset",
                    });
                  }
                }}
                className="flex items-center py-2 px-4 text-sm font-medium bg-white border border-red-200 text-red-700 hover:bg-red-50 transition-colors"
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Reset
              </button>
            </div>
          </div>
        </div>


        {/* Professional Content Layout */}
        <div className="space-y-8">
          {/* Recently Accessed Materials */}
          <div className="bg-white">
            <div className="border-l-4 border-l-blue-900 bg-gray-50 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <History className="h-6 w-6 text-blue-900" />
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Recently Accessed Materials</h2>
                  <p className="text-gray-600 text-sm">Resources you've recently viewed or downloaded</p>
                </div>
              </div>
              <div className="bg-blue-900 text-white px-4 py-2 font-semibold">
                {recentlyAccessed.length} ITEMS
              </div>
            </div>
            
            <div className="p-6">
              {!isLoading && recentlyAccessed.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-gray-300">
                  <History className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">No Recent Activity</h3>
                  <p className="text-gray-600 mb-6">Start exploring resources to see them here</p>
                  <button 
                    onClick={() => navigate('/resources')} 
                    className="bg-blue-900 hover:bg-blue-800 text-white font-bold py-3 px-8 transition-colors"
                  >
                    <BookOpen className="mr-2 h-5 w-5 inline" />
                    BROWSE RESOURCES
                  </button>
                </div>
              ) : (
                <div className="space-y-1">
                  {recentlyAccessed.slice(0, 5).map((resource, index) => (
                    <div
                      key={resource.id}
                      className={`flex items-center justify-between p-4 border-l-4 transition-all cursor-pointer ${
                        index % 2 === 0 ? 'bg-gray-50 border-l-blue-900' : 'bg-white border-l-gray-300'
                      } hover:bg-blue-50 hover:border-l-blue-900`}
                      onClick={() => handleResourceClick(resource)}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-blue-900 text-white flex items-center justify-center">
                          {getTypeIcon(resource.fileType || 'unknown')}
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 text-lg">
                            {resource.title}
                          </h4>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span className="font-medium">{resource.description?.substring(0, 40) || 'No description'}...</span>
                            <span>•</span>
                            <span className="font-semibold">{formatFileSize(resource.fileSize || 0)}</span>
                            <span>•</span>
                            <span>{new Date(resource.uploadedAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <button
                          className="p-3 hover:bg-white border-2 border-transparent hover:border-red-500 transition-all"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(resource.id);
                          }}
                          disabled={isFavoritesLoading}
                        >
                          {isFavoritesLoading ? (
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-900"></div>
                          ) : (
                            <Heart 
                              className={`h-6 w-6 ${
                                isFavorited(resource.id) 
                                  ? 'text-red-500 fill-current' 
                                  : 'text-gray-400 hover:text-red-500'
                              }`} 
                            />
                          )}
                        </button>
                        <div className="text-sm text-gray-500 font-medium">
                          {resource.accessedAt ? 
                            new Date(resource.accessedAt).toLocaleDateString() : 
                            'JUST NOW'
                          }
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Favorites Section */}
          <div className="bg-white">
            <div className="border-l-4 border-l-blue-900 bg-gray-50 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Bookmark className="h-6 w-6 text-blue-900" />
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Your Favorites</h2>
                  <p className="text-gray-600 text-sm">Your bookmarked resources</p>
                </div>
              </div>
              <div className="bg-blue-900 text-white px-4 py-2 font-semibold">
                {favorites.length} SAVED
              </div>
            </div>
            
            <div className="p-6">
              {favorites.length === 0 ? (
                <div className="text-center py-8 border-2 border-dashed border-gray-300">
                  <Bookmark className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-gray-900 mb-2">No Favorites Yet</h3>
                  <p className="text-gray-600">Click the heart icon to save resources</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {favorites.slice(0, 4).map((resource) => (
                    <div
                      key={resource.id}
                      className="border-l-4 border-l-blue-900 bg-gray-50 p-4 hover:bg-blue-50 transition-colors cursor-pointer"
                      onClick={() => handleResourceClick(resource)}
                    >
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-10 h-10 bg-blue-900 text-white flex items-center justify-center">
                          {getTypeIcon(resource.fileType || 'unknown')}
                        </div>
                        <h5 className="font-bold text-gray-900 text-base">
                          {resource.title}
                        </h5>
                      </div>
                      <p className="text-sm text-gray-600 mb-3 font-medium">
                        {resource.description?.substring(0, 60) || 'No description'}...
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="bg-blue-900 text-white text-xs font-bold px-2 py-1">
                          {resource.fileType?.split('/')[0]?.toUpperCase() || 'UNKNOWN'}
                        </span>
                        <span className="text-sm text-gray-700 font-semibold">
                          {formatFileSize(resource.fileSize || 0)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Study Progress Section */}
          <div className="bg-white">
            <div className="border-l-4 border-l-blue-900 bg-gray-50 px-6 py-4">
              <div className="flex items-center space-x-3">
                <BarChart3 className="h-6 w-6 text-blue-900" />
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Study Progress</h2>
                  <p className="text-gray-600 text-sm">Track your learning journey</p>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="text-center border-r border-gray-200">
                  <div className="text-3xl font-bold text-blue-900 mb-2">{studyProgress.totalStudyTime}h</div>
                  <p className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Study Time</p>
                </div>
                <div className="text-center border-r border-gray-200">
                  <div className="text-3xl font-bold text-blue-900 mb-2">{studyProgress.completedResources}</div>
                  <p className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Completed</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-900 mb-2">{studyProgress.currentStreak}</div>
                  <p className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Day Streak</p>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 border-l-4 border-l-blue-900">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-bold text-gray-900">Weekly Goal Progress</span>
                  <span className="font-bold text-blue-900">{studyProgress.completedResources}/{studyProgress.weeklyGoal}</span>
                </div>
                <div className="w-full bg-gray-300 h-3">
                  <div 
                    className="bg-blue-900 h-3 transition-all duration-500"
                    style={{ 
                      width: `${Math.min((studyProgress.completedResources / studyProgress.weeklyGoal) * 100, 100)}%` 
                    }}
                  ></div>
                </div>
              </div>
              
              <button 
                className="w-full mt-6 bg-blue-900 hover:bg-blue-800 text-white font-bold py-3 px-6 transition-colors"
                onClick={() => navigate('/profile')}
              >
                <Target className="mr-2 h-5 w-5 inline" />
                UPDATE GOALS
              </button>
            </div>
          </div>
                  </div>
        </main>
        <Footer />
      </div>
    );
  }
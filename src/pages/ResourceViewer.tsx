import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/Layout/Header";
import { Footer } from "@/components/Layout/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { resourcesApi } from "@/services/api";
import { summaryApi } from "@/services/summaryApi";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowLeft,
  Download,
  Eye,
  Clock,
  User,
  FileText,
  Video,
  Image,
  Archive,
  ExternalLink,
  Loader2,
  AlertCircle,
  Heart,
  Share2,
  Bookmark,
  Star,
  ThumbsUp,
  MessageCircle,
  MoreVertical,
  Maximize2,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Play,
  Pause,
  Volume2,
  Settings,
  Brain,
  Sparkles
} from "lucide-react";

interface Resource {
  id: number;
  title: string;
  description: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  uploadedBy: number;
  uploadedAt: string;
}

export default function ResourceViewer() {
  const { resourceId } = useParams<{ resourceId: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  
  const [resource, setResource] = useState<Resource | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewerUrl, setViewerUrl] = useState<string>("");
  const [isFavorited, setIsFavorited] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(100);
  const [viewerError, setViewerError] = useState<string | null>(null);
  const [isViewerLoading, setIsViewerLoading] = useState(true);
  
  // Add state for AI summary
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [summaryError, setSummaryError] = useState<string | null>(null);

  useEffect(() => {
    if (resourceId) {
      loadResource();
    }
  }, [resourceId]);

  const loadResource = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('Loading resource with ID:', resourceId);
      
      // For now, we'll get the resource from the list and create a viewer URL
      // In a real app, you'd have a specific endpoint for getting a single resource
      const response = await resourcesApi.getAll();
      
      console.log('API Response:', response);
      
      if (response.success && response.data) {
        let resourcesArray: any[] = [];
        
        if (Array.isArray(response.data)) {
          resourcesArray = response.data;
        } else if (response.data && typeof response.data === 'object') {
          const dataObj = response.data as any;
          if (dataObj.resources && Array.isArray(dataObj.resources)) {
            resourcesArray = dataObj.resources;
          } else if (dataObj.content && Array.isArray(dataObj.content)) {
            resourcesArray = dataObj.content;
          }
        }
        
        console.log('Resources array:', resourcesArray);
        console.log('Looking for resource ID:', parseInt(resourceId!));
        
        const foundResource = resourcesArray.find((r: any) => r.id === parseInt(resourceId!));
        
        console.log('Found resource:', foundResource);
        
        if (foundResource) {
          setResource(foundResource);
          createViewerUrl(foundResource);
          // Generate summary when resource is loaded
          generateSummary(foundResource);
        } else {
          setError('Resource not found');
        }
      } else {
        throw new Error(response.message || 'Failed to load resource');
      }
    } catch (error: any) {
      console.error('Error loading resource:', error);
      setError(error.message || 'Failed to load resource');
    } finally {
      setIsLoading(false);
    }
  };

  // Function to generate AI summary using Cohere API
  const generateSummary = async (resourceData: Resource) => {
    try {
      setIsGeneratingSummary(true);
      setSummaryError(null);
      
      // Call the backend endpoint to generate summary using Cohere API
      const response = await summaryApi.generateResourceSummary(resourceData.id);
      
      if (response && response.summary) {
        setAiSummary(response.summary);
        toast({
          title: "Summary Generated",
          description: "AI has analyzed the file content and generated an educational summary.",
        });
      } else {
        throw new Error('No summary received from the API');
      }
    } catch (error: any) {
      console.error('Error generating summary:', error);
      const errorMessage = error.message || 'Failed to generate summary';
      setSummaryError(errorMessage);
      
      toast({
        title: "Summary Generation Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  const createViewerUrl = (resource: any) => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
    
    console.log('Creating viewer URL for resource:', resource);
    console.log('Base URL:', baseUrl);
    console.log('File type:', resource.fileType);
    
    try {
      // Create viewer URL using the backend /view endpoint
      const url = `${baseUrl}/resources/view/${resource.id}`;
      console.log('Viewer URL:', url);
      setViewerUrl(url);
      setViewerError(null);
      setIsViewerLoading(true);
    } catch (error) {
      console.error('Error creating viewer URL:', error);
      setViewerError('Failed to create viewer URL');
      setIsViewerLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!resource) return;
    
    try {
      const blob = await resourcesApi.download(resource.id);
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = resource.fileName || `resource_${resource.id}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: "Download started",
        description: "Your file download has begun.",
      });
    } catch (error: any) {
      console.error('Download error:', error);
      toast({
        title: "Download failed",
        description: error.message || "Failed to download resource",
        variant: "destructive",
      });
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'pdf':
        return <FileText className="h-5 w-5" />;
      case 'video':
        return <Video className="h-5 w-5" />;
      case 'image':
        return <Image className="h-5 w-5" />;
      case 'archive':
        return <Archive className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'pdf':
        return 'bg-red-100 text-red-800';
      case 'video':
        return 'bg-blue-100 text-blue-800';
      case 'image':
        return 'bg-green-100 text-green-800';
      case 'archive':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Helper functions for enhanced features
  const toggleFavorite = () => {
    setIsFavorited(!isFavorited);
    toast({
      title: isFavorited ? "Removed from favorites" : "Added to favorites",
      description: isFavorited ? "Resource removed from your favorites" : "Resource added to your favorites",
    });
  };

  const toggleLike = () => {
    setIsLiked(!isLiked);
    toast({
      title: isLiked ? "Unliked" : "Liked",
      description: isLiked ? "You unliked this resource" : "You liked this resource",
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: resource?.title,
          text: resource?.description,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied",
        description: "Resource link copied to clipboard",
      });
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 25, 300));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 25, 50));
  };

  const resetZoom = () => {
    setZoomLevel(100);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header isAuthenticated={isAuthenticated} user={user} />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-lg">Loading resource...</span>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !resource) {
    return (
      <div className="min-h-screen bg-background">
        <Header isAuthenticated={isAuthenticated} user={user} />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Error loading resource</h3>
            <p className="text-muted-foreground mb-4">{error || 'Resource not found'}</p>
            <Button onClick={() => navigate('/resources')} variant="outline">
              Back to Resources
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header isAuthenticated={isAuthenticated} user={user} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Modern Page Header */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-6">
              <Button
                variant="outline"
                onClick={() => navigate('/resources')}
                className="h-12 px-6"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Resources
              </Button>
              <div>
                <h1 className="text-5xl font-bold text-foreground mb-3 tracking-tight">Resource Viewer</h1>
                <p className="text-xl text-muted-foreground">View and interact with your educational resources</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className={`text-sm px-4 py-2 ${getTypeColor(resource.fileType)} font-medium`}>
                {resource.fileType}
              </Badge>
              <div className="flex items-center space-x-1 bg-background rounded-xl p-1 border">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleFavorite}
                  className={`h-10 w-10 ${isFavorited ? 'text-red-500 bg-red-50' : 'text-muted-foreground hover:text-red-500 hover:bg-red-50'}`}
                >
                  <Heart className={`h-5 w-5 ${isFavorited ? 'fill-current' : ''}`} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleLike}
                  className={`h-10 w-10 ${isLiked ? 'text-blue-500 bg-blue-50' : 'text-muted-foreground hover:text-blue-500 hover:bg-blue-50'}`}
                >
                  <ThumbsUp className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleShare}
                  className="h-10 w-10 text-muted-foreground hover:text-primary hover:bg-primary/10"
                >
                  <Share2 className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-10 w-10 text-muted-foreground hover:text-primary hover:bg-primary/10"
                >
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Clean Resource Information */}
        <div className="mb-16">
          <div className="bg-white border border-border rounded-lg p-8">
            <div className="flex items-start justify-between mb-8">
              <div className="flex items-start space-x-6">
                <div className="bg-primary text-primary-foreground p-4 rounded-lg">
                  {getTypeIcon(resource.fileType)}
                </div>
                <div className="space-y-3">
                  <h2 className="text-4xl font-bold text-foreground leading-tight">
                    {resource.title}
                  </h2>
                  <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl">
                    {resource.description}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-muted-foreground font-medium mb-1">File Size</div>
                <div className="text-2xl font-bold text-foreground">{formatFileSize(resource.fileSize)}</div>
              </div>
            </div>
            
            {/* Resource Metadata */}
            <div className="grid md:grid-cols-3 gap-6 pt-6 border-t border-border">
              <div className="flex items-center space-x-4">
                <div className="bg-primary/10 p-3 rounded-lg">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground font-medium">Uploaded By</div>
                  <div className="text-lg font-semibold text-foreground">User #{resource.uploadedBy}</div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="bg-green-100 p-3 rounded-lg">
                  <Clock className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground font-medium">Upload Date</div>
                  <div className="text-lg font-semibold text-foreground">{new Date(resource.uploadedAt).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <FileText className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground font-medium">File Type</div>
                  <div className="text-lg font-semibold text-foreground">{resource.fileType}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Clean Resource Viewer */}
        <div className="mb-16">
          {/* Viewer Controls */}
          <div className="flex items-center justify-between mb-6 p-4 bg-white border border-border rounded-lg">
            <div className="flex items-center space-x-4">
              <div className="bg-primary text-primary-foreground p-3 rounded-lg">
                <Eye className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-foreground">Resource Viewer</h3>
                <p className="text-muted-foreground">Interactive document viewer with advanced controls</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {/* Zoom Controls */}
              <div className="flex items-center space-x-1 bg-muted rounded-lg p-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleZoomOut}
                  className="h-8 w-8 p-0"
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <span className="text-sm font-medium px-2 min-w-[50px] text-center">{zoomLevel}%</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleZoomIn}
                  className="h-8 w-8 p-0"
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetZoom}
                  className="h-8 w-8 p-0"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>
              {/* Fullscreen Toggle */}
              <Button
                variant="outline"
                size="sm"
                onClick={toggleFullscreen}
                className="h-10 px-4 font-medium"
              >
                <Maximize2 className="h-4 w-4 mr-2" />
                Fullscreen
              </Button>
            </div>
          </div>
          
          {/* Clean Viewer Content */}
          <div className="bg-white border border-border rounded-lg overflow-hidden">
            {viewerError ? (
              <div className="text-center py-16 bg-red-50">
                <div className="bg-red-100 rounded-lg w-20 h-20 flex items-center justify-center mx-auto mb-6">
                  <AlertCircle className="h-10 w-10 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">Viewer Error</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  {viewerError}
                </p>
                <Button onClick={handleDownload} className="h-10 px-6 bg-primary text-primary-foreground">
                  <Download className="mr-2 h-4 w-4" />
                  Download Resource
                </Button>
              </div>
            ) : viewerUrl ? (
              <div className="w-full" style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top left' }}>
                {resource.fileType?.toLowerCase().includes('pdf') ? (
                  <div className="w-full h-[90vh] overflow-hidden bg-muted/30">
                    <div className="bg-background border-b border-border px-4 py-3 flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="bg-red-100 p-2 rounded-lg">
                          <FileText className="h-5 w-5 text-red-600" />
                        </div>
                        <span className="text-lg font-semibold text-foreground">PDF Document Viewer</span>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" onClick={() => window.open(viewerUrl, '_blank')}>
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Open in New Tab
                        </Button>
                      </div>
                    </div>
                    {isViewerLoading && (
                      <div className="flex items-center justify-center h-64">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <span className="ml-2 text-lg">Loading PDF...</span>
                      </div>
                    )}
                    <iframe
                      src={viewerUrl}
                      className="w-full h-full border-0"
                      title={resource.title}
                      onLoad={() => setIsViewerLoading(false)}
                      onError={() => {
                        setViewerError('Failed to load PDF');
                        setIsViewerLoading(false);
                      }}
                    />
                  </div>
                ) : resource.fileType?.toLowerCase().includes('image') ? (
                  <div className="w-full p-6">
                    <div className="bg-muted rounded-lg p-3 mb-4 flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="bg-green-100 p-2 rounded-lg">
                          <Image className="h-5 w-5 text-green-600" />
                        </div>
                        <span className="text-lg font-semibold text-foreground">Image Viewer</span>
                      </div>
                      <Button size="sm" variant="outline" onClick={() => window.open(viewerUrl, '_blank')}>
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Open Full Size
                      </Button>
                    </div>
                    <div className="flex justify-center bg-muted/30 rounded-lg p-6">
                      {isViewerLoading && (
                        <div className="flex items-center justify-center h-64">
                          <Loader2 className="h-8 w-8 animate-spin text-primary" />
                          <span className="ml-2 text-lg">Loading image...</span>
                        </div>
                      )}
                      <img
                        src={viewerUrl}
                        alt={resource.title}
                        className={`max-w-full max-h-[80vh] object-contain rounded-lg shadow-sm hover:shadow-md transition-all duration-200 ${isViewerLoading ? 'hidden' : ''}`}
                        onLoad={() => setIsViewerLoading(false)}
                        onError={(e) => {
                          console.error('Image load error:', e);
                          setViewerError('Failed to load image');
                          setIsViewerLoading(false);
                        }}
                      />
                    </div>
                  </div>
                ) : resource.fileType?.toLowerCase().includes('video') ? (
                  <div className="w-full p-6">
                    <div className="bg-muted rounded-lg p-3 mb-4 flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="bg-blue-100 p-2 rounded-lg">
                          <Video className="h-5 w-5 text-blue-600" />
                        </div>
                        <span className="text-lg font-semibold text-foreground">Video Player</span>
                      </div>
                      <Button size="sm" variant="outline" onClick={() => window.open(viewerUrl, '_blank')}>
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Open in New Tab
                      </Button>
                    </div>
                    <div className="flex justify-center bg-muted/30 rounded-lg p-6">
                      {isViewerLoading && (
                        <div className="flex items-center justify-center h-64">
                          <Loader2 className="h-8 w-8 animate-spin text-primary" />
                          <span className="ml-2 text-lg">Loading video...</span>
                        </div>
                      )}
                      <video
                        src={viewerUrl}
                        controls
                        className={`max-w-full max-h-[80vh] rounded-lg shadow-sm ${isViewerLoading ? 'hidden' : ''}`}
                        controlsList="nodownload"
                        onLoadedData={() => setIsViewerLoading(false)}
                        onError={(e) => {
                          console.error('Video load error:', e);
                          setViewerError('Failed to load video');
                          setIsViewerLoading(false);
                        }}
                      >
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-16 bg-muted/20">
                    <div className="bg-primary/10 rounded-lg w-20 h-20 flex items-center justify-center mx-auto mb-6">
                      <FileText className="h-10 w-10 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-3">Preview Not Available</h3>
                    <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                      This file type cannot be previewed in the browser. Please download the file to view it with the appropriate application.
                    </p>
                    <Button onClick={handleDownload} className="h-10 px-6 bg-primary text-primary-foreground">
                      <Download className="mr-2 h-4 w-4" />
                      Download to View
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-16 bg-muted/20">
                <div className="bg-orange-100 rounded-lg w-20 h-20 flex items-center justify-center mx-auto mb-6">
                  <FileText className="h-10 w-10 text-orange-600" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">Viewer Not Available</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Unable to create a preview for this file. Please download the resource to view it.
                </p>
                <Button onClick={handleDownload} className="h-10 px-6 bg-primary text-primary-foreground">
                  <Download className="mr-2 h-4 w-4" />
                  Download Resource
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* AI Summary Section */}
        <div className="mb-16">
          <div className="bg-white border border-border rounded-lg overflow-hidden">
            {/* Summary Header */}
            <div className="flex items-center justify-between p-6 border-b border-border bg-gradient-to-r from-blue-50 to-purple-50">
              <div className="flex items-center space-x-4">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-lg">
                  <Brain className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-foreground">AI-Powered Summary</h3>
                  <p className="text-muted-foreground">Key insights extracted using Cohere AI</p>
                </div>
              </div>
              <Button
                variant="outline"
                onClick={() => generateSummary(resource)}
                disabled={isGeneratingSummary}
                className="h-10 px-4"
              >
                {isGeneratingSummary ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4 mr-2" />
                )}
                {isGeneratingSummary ? 'Generating...' : 'Regenerate'}
              </Button>
            </div>
            
            {/* Summary Content */}
            <div className="p-6">
              {summaryError ? (
                <div className="text-center py-8 bg-red-50 rounded-lg">
                  <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-3" />
                  <h4 className="text-lg font-semibold text-foreground mb-2">Summary Error</h4>
                  <p className="text-muted-foreground mb-4">{summaryError}</p>
                  <Button onClick={() => generateSummary(resource)} className="h-10 px-6 bg-primary text-primary-foreground">
                    Try Again
                  </Button>
                </div>
              ) : isGeneratingSummary ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                  <span className="text-lg text-muted-foreground mb-2">Extracting content from file...</span>
                  <span className="text-sm text-muted-foreground">AI is analyzing the material...</span>
                </div>
              ) : aiSummary ? (
                <div className="max-w-none">
                  <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
                    <p className="text-blue-800 font-medium flex items-center">
                      <Sparkles className="h-4 w-4 mr-2" />
                      {aiSummary.includes("Cohere API key") ? 
                        "This is a basic summary from file content. Configure Cohere API key for AI-powered analysis." :
                        "This summary was generated by Cohere AI analyzing the resource content"
                      }
                    </p>
                  </div>
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <p className="text-foreground leading-relaxed whitespace-pre-line">{aiSummary}</p>
                  </div>
                  
                  {/* Summary Actions */}
                  <div className="flex items-center justify-between mt-6 pt-6 border-t border-border">
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <ThumbsUp className="h-4 w-4" />
                      <span>Was this summary helpful?</span>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" className="h-9">
                        <ThumbsUp className="h-4 w-4 mr-2" />
                        Yes
                      </Button>
                      <Button variant="outline" size="sm" className="h-9">
                        <ThumbsUp className="h-4 w-4 mr-2 rotate-180" />
                        No
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 bg-muted/20 rounded-lg">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <h4 className="text-lg font-semibold text-foreground mb-2">No Summary Available</h4>
                  <p className="text-muted-foreground mb-4">We couldn't generate a summary for this resource.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Clean Action Buttons */}
        <div className="bg-white border border-border rounded-lg p-6">
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-foreground mb-2">Quick Actions</h3>
            <p className="text-muted-foreground">Download or open this resource in different ways</p>
          </div>
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-3 sm:space-y-0 sm:space-x-4">
            <Button 
              onClick={handleDownload} 
              className="h-12 px-8 text-base font-semibold bg-primary text-primary-foreground"
            >
              <Download className="mr-2 h-5 w-5" />
              Download Resource
            </Button>
            <Button 
              onClick={() => window.open(viewerUrl, '_blank')} 
              variant="outline"
              disabled={!viewerUrl}
              className="h-12 px-8 text-base font-semibold"
            >
              <ExternalLink className="mr-2 h-5 w-5" />
              Open in New Tab
            </Button>
            <Button 
              onClick={() => navigate('/resources')} 
              variant="ghost"
              className="h-12 px-6 text-base font-semibold text-muted-foreground hover:text-foreground hover:bg-muted"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Back to Resources
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}4
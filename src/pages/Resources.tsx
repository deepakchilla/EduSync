import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Header } from "@/components/Layout/Header";
import { Footer } from "@/components/Layout/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { resourcesApi } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { 
  Search, 
  Filter,
  FileText,
  Video,
  Image,
  Archive,
  Download,
  Eye,
  Star,
  Clock,
  Loader2,
  AlertCircle
} from "lucide-react";

export default function Resources() {
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [branch, setBranch] = useState("");
  const [subject, setSubject] = useState("");
  const [resources, setResources] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadResources();
  }, []);

  const loadResources = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const params = new URLSearchParams();
      if (branch) params.set('branch', branch);
      if (subject) params.set('subject', subject);
      const response = await resourcesApi.getAll(`${params.toString() ? '?' + params.toString() : ''}` as any);
      
      // Debug logging to see what backend returns
      console.log('Backend response:', response);
      console.log('Response data type:', typeof response.data);
      console.log('Response data:', response.data);
      
      if (response.success && response.data) {
        // Handle different response formats from backend
        let resourcesArray: any[] = [];
        
        // If data is not an array, try to extract it
        if (Array.isArray(response.data)) {
          resourcesArray = response.data;
        } else if (response.data && typeof response.data === 'object') {
          const dataObj = response.data as any;
          if (dataObj.resources && Array.isArray(dataObj.resources)) {
            resourcesArray = dataObj.resources;
          } else if (dataObj.content && Array.isArray(dataObj.content)) {
            resourcesArray = dataObj.content;
          } else {
            console.warn('Unexpected response format:', response.data);
            resourcesArray = [];
          }
        }
        
        // Ensure all resources have required properties
        const safeResources = resourcesArray.map((resource: any) => ({
          id: resource.id || Math.random(),
          title: resource.title || 'Untitled Resource',
          description: resource.description || 'No description available',
          fileName: resource.fileName || 'unknown',
          fileSize: resource.fileSize || 0,
          fileType: resource.fileType || 'PDF',
          uploadedBy: resource.uploadedBy || 0,
          uploadedAt: resource.uploadedAt || new Date().toISOString()
        }));
        setResources(safeResources);
      } else {
        throw new Error(response.message || 'Failed to load resources');
      }
    } catch (error: any) {
      console.error('Error loading resources:', error);
      setError(error.message || 'Failed to load resources');
      toast({
        title: "Error",
        description: "Failed to load resources. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async (resourceId: number) => {
    try {
      const blob = await resourcesApi.download(resourceId);
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `resource_${resourceId}`;
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

  const types = ["all", "PDF", "Video", "Image", "Archive"];

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

  const filteredResources = resources.filter((resource) => {
    const title = (resource.title || '').toLowerCase();
    const description = (resource.description || '').toLowerCase();
    const fileType = (resource.fileType || '').toLowerCase();
    
    const matchesSearch = 
      title.includes(searchQuery.toLowerCase()) ||
      description.includes(searchQuery.toLowerCase()) ||
      fileType.includes(searchQuery.toLowerCase());
    
    const matchesType = selectedType === "all" || fileType.includes(selectedType.toLowerCase());
    
    return matchesSearch && matchesType;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header isAuthenticated={isAuthenticated} user={user} />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-lg">Loading resources...</span>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header isAuthenticated={isAuthenticated} user={user} />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Error loading resources</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={loadResources} variant="outline">
              Try again
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Educational Resources</h1>
          <p className="text-muted-foreground">Discover and access thousands of learning materials</p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4 lg:space-y-0 lg:flex lg:items-center lg:space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search resources by title, description, or file type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="edu-input pl-10"
            />
          </div>
          
          <div className="flex space-x-4">
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                {types.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type === "all" ? "All Types" : type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={branch || "all"} onValueChange={(v) => { setBranch(v === 'all' ? '' : v); }}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Branch" />
              </SelectTrigger>
              <SelectContent>
                {['all','CSE','ECE','EEE','ME','CE','IT'].map(b => (
                  <SelectItem key={b} value={b}>{b === 'all' ? 'All Branches' : b}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              placeholder={branch === 'CSE' ? 'Subject (e.g., DSA, DBMS)' : 'Subject (optional)'}
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-56"
            />
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            {filteredResources.length} resource{filteredResources.length !== 1 ? 's' : ''} found
          </p>
        </div>

        {/* Resources Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredResources.map((resource) => (
            <Card key={resource.id || Math.random()} className="edu-card animate-fade-in">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="bg-primary text-primary-foreground p-2 rounded">
                      {getTypeIcon(resource.fileType || 'pdf')}
                    </div>
                    <Badge variant="secondary" className={getTypeColor(resource.fileType || 'pdf')}>
                      {resource.fileType || 'PDF'}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-medium">4.5</span>
                  </div>
                </div>
                <CardTitle className="text-lg leading-tight">{resource.title || 'Untitled Resource'}</CardTitle>
                <CardDescription className="text-muted-foreground">
                  {resource.description || 'No description available'}
                </CardDescription>
                {(resource.branch || resource.subject) && (
                  <div className="mt-2 flex items-center gap-2">
                    {resource.branch && (
                      <Badge variant="secondary" className="bg-blue-900 text-white">{resource.branch}</Badge>
                    )}
                    {resource.subject && (
                      <Badge variant="secondary" className="bg-gray-100 text-gray-800">{resource.subject}</Badge>
                    )}
                  </div>
                )}
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>File Size</span>
                    <span>{formatFileSize(resource.fileSize || 0)}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>by User #{resource.uploadedBy}</span>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>{new Date(resource.uploadedAt || Date.now()).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Eye className="h-3 w-3" />
                        <span>0</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Download className="h-3 w-3" />
                        <span>0</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-2 pt-2">
                    <Button 
                      size="sm" 
                      className="flex-1 edu-button-primary"
                      onClick={() => window.location.href = `/resource/${resource.id}`}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      View
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => handleDownload(resource.id)}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredResources.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-muted rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No resources found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search terms or filters
            </p>
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchQuery("");
                setSelectedType("all");
              }}
            >
              Clear all filters
            </Button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

// Helper function to format file size
function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { resourcesApi } from "@/services/api";
import { 
  Upload, 
  File, 
  X, 
  Plus,
  AlertCircle,
  CheckCircle2
} from "lucide-react";

interface ResourceUploadProps {
  onUploadSuccess?: () => void;
}

export default function ResourceUpload({ onUploadSuccess }: ResourceUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    branch: "CSE",
    subject: "",
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size (500MB max)
    const maxSize = 500 * 1024 * 1024; // 500MB in bytes
    if (file.size > maxSize) {
      setUploadError('File size must be less than 500MB');
      return;
    }

    setSelectedFile(file);
    setUploadError(null);
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile) {
      setUploadError('Please select a file to upload');
      return;
    }

    if (!formData.title.trim()) {
      setUploadError('Please enter a title for the resource');
      return;
    }

    if (!user?.email) {
      setUploadError('User email not found');
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', selectedFile);
      uploadFormData.append('title', formData.title.trim());
      uploadFormData.append('description', formData.description.trim());
      uploadFormData.append('userEmail', user.email);
      uploadFormData.append('branch', formData.branch);
      if (formData.subject) uploadFormData.append('subject', formData.subject);

      // Validate FormData
      if (!uploadFormData.has('file')) {
        throw new Error('File is missing from FormData');
      }
      if (!uploadFormData.has('title')) {
        throw new Error('Title is missing from FormData');
      }

      const response = await resourcesApi.upload(uploadFormData);
      
      if (response.success) {
        toast({
          title: "Resource uploaded successfully!",
          description: `${formData.title} has been uploaded and is now available to students.`,
          className: "border-green-500 bg-green-500 text-white",
        });
        
        // Reset form
        setFormData({ title: "", description: "" });
        setFormData({ title: "", description: "", branch: "CSE", subject: "" });
        setSelectedFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        
        onUploadSuccess?.();
      } else {
        throw new Error(response.message || 'Upload failed');
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      
      let errorMessage = 'Unknown error occurred';
      
      if (error.message) {
        errorMessage = error.message;
      } else if (error.error) {
        errorMessage = error.error;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      
      setUploadError(`Failed to upload resource: ${errorMessage}`);
      
      // Show error toast
      toast({
        title: "Upload failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Upload className="h-5 w-5" />
          <span>Upload Resource</span>
        </CardTitle>
        <CardDescription>
          Share educational resources with students. All file types are supported (max 500MB).
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium">
              Resource Title *
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter a descriptive title for your resource"
              className="w-full"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Description
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Provide additional details about the resource (optional)"
              className="w-full min-h-[100px]"
            />
          </div>

          {/* Branch */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Branch *</Label>
            <select
              value={formData.branch}
              onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
              className="w-full border rounded-md p-2"
              required
            >
              {['CSE','ECE','EEE','ME','CE','IT'].map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          {/* Subject (CSE subjects list when CSE selected) */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Subject</Label>
            {formData.branch === 'CSE' ? (
              <select
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full border rounded-md p-2"
              >
                <option value="">Select Subject (optional)</option>
                {['DSA','DBMS','OS','CN','SE','AI','ML','DL','CSF','TOC','C++','Java','Python'].map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            ) : (
              <Input
                placeholder="Subject (optional)"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              />
            )}
          </div>

          {/* File Upload Area */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">File *</Label>
            
            {!selectedFile ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 hover:bg-blue-50 transition-colors cursor-pointer"
              >
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-600">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">
                    Any file type, max 500MB
                  </p>
                </div>
              </div>
            ) : (
              <div className="border rounded-lg p-4 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <File className="h-8 w-8 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {selectedFile.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(selectedFile.size)}
                      </p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={removeSelectedFile}
                    className="text-gray-500 hover:text-red-600"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
            
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileSelect}
              className="hidden"
              accept="*/*"
              name="file"
            />
          </div>

          {/* Error Display */}
          {uploadError && (
            <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-md">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <span className="text-sm text-red-700">{uploadError}</span>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex space-x-3">
            <Button
              type="submit"
              disabled={isUploading || !selectedFile || !formData.title.trim()}
              className="flex-1"
            >
              {isUploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Uploading...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Upload Resource
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

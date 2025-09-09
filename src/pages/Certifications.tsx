import React, { useEffect, useMemo, useState } from 'react';
import { certificationsApi } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Header } from '@/components/Layout/Header';
import { ChevronDown, Plus, Trash2, UploadCloud, Download, Eye, Award, Calendar, FileText, Search, X, ZoomIn } from 'lucide-react';

type CertType = 'COURSE' | 'INTERNSHIP';

const Certifications: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [active, setActive] = useState<CertType>('COURSE');
  const [allItems, setAllItems] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [search, setSearch] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [selectedCert, setSelectedCert] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);

  const load = async () => {
    if (!user?.email) return;
    try {
      const res = await certificationsApi.my(user.email);
      console.log('Certificates API response:', res);
      if (res.success) {
        setAllItems(res.data || []);
        console.log('Certificates loaded:', res.data);
      } else {
        console.error('Certificates API error:', res.message);
        toast({ title: 'Error', description: res.message, variant: 'destructive' });
      }
    } catch (error) {
      console.error('Error loading certificates:', error);
      toast({ title: 'Error', description: 'Failed to load certificates', variant: 'destructive' });
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.email]);

  const filtered = useMemo(() => {
    const byType = allItems.filter((x: any) => {
      if (active === 'COURSE') {
        return x.type === 'COURSE' || !x.type; // Default to COURSE if no type specified
      } else {
        return x.type === 'INTERNSHIP';
      }
    });
    if (!search.trim()) return byType;
    const q = search.toLowerCase();
    return byType.filter((x: any) => (x.title || '').toLowerCase().includes(q) || (x.description || '').toLowerCase().includes(q));
  }, [allItems, active, search]);

  const onUpload = async () => {
    if (!user?.email || !file || !title.trim()) {
      toast({ title: 'Missing info', description: 'Title and file are required', variant: 'destructive' });
      return;
    }
    setIsUploading(true);
    try {
      const form = new FormData();
      form.append('userEmail', user.email);
      form.append('type', active);
      form.append('title', title);
      if (desc) form.append('description', desc);
      form.append('file', file);
      
      console.log('Uploading certificate:', { userEmail: user.email, type: active, title, desc, fileName: file.name });
      
      const res = await certificationsApi.upload(form);
      console.log('Upload response:', res);
      
      if (res.success) {
        setTitle(''); setDesc(''); setFile(null);
        setShowUpload(false);
        toast({ title: 'Uploaded', description: 'Certification saved successfully' });
        await load();
      } else {
        console.error('Upload failed:', res.message);
        toast({ title: 'Error', description: res.message, variant: 'destructive' });
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast({ title: 'Error', description: 'Failed to upload certificate', variant: 'destructive' });
    } finally {
      setIsUploading(false);
    }
  };

  const onDelete = async (id: number) => {
    if (!user?.email) return;
    const res = await certificationsApi.delete(id, user.email);
    if (res.success) {
      toast({ title: 'Deleted', description: 'Certificate deleted successfully' });
      load();
    } else {
      toast({ title: 'Error', description: res.message, variant: 'destructive' });
    }
  };

  const onDownload = async (id: number, title: string) => {
    if (!user?.email) return;
    try {
      const blob = await certificationsApi.download(id, user.email);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${title}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast({ title: 'Downloaded', description: 'Certificate downloaded successfully' });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to download certificate', variant: 'destructive' });
    }
  };

  const onView = (cert: any) => {
    setSelectedCert(cert);
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Award className="h-8 w-8 text-[#0f1a2a]" />
                My Certifications
              </h1>
              <p className="text-gray-600 mt-2">
                Upload and manage your course and internship certifications
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Total Certificates</p>
                <p className="text-2xl font-bold text-[#0f1a2a]">{allItems.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-0 shadow-lg bg-white">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Course Certificates</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {allItems.filter(item => item.type === 'COURSE' || !item.type).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Award className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Internship Certificates</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {allItems.filter(item => item.type === 'INTERNSHIP').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Calendar className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">This Month</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {allItems.filter(item => {
                      const uploadDate = new Date(item.uploadDate);
                      const now = new Date();
                      return uploadDate.getMonth() === now.getMonth() && uploadDate.getFullYear() === now.getFullYear();
                    }).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="border-0 shadow-lg bg-white">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Filter & Upload</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Type Filter */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Certificate Type</h3>
                  <Tabs value={active} onValueChange={(v) => setActive(v as CertType)} className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="COURSE" className="text-xs">Courses</TabsTrigger>
                      <TabsTrigger value="INTERNSHIP" className="text-xs">Internships</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>

                {/* Search */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Search</h3>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search certificates..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="pl-10 border-gray-300 focus:border-[#0f1a2a] focus:ring-[#0f1a2a]"
                    />
                  </div>
                </div>

                {/* Upload Button */}
                <Button 
                  onClick={() => setShowUpload(!showUpload)}
                  className="w-full bg-[#0f1a2a] hover:bg-[#0a141f] text-white shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {showUpload ? 'Cancel Upload' : 'Upload Certificate'}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {/* Upload Form */}
            {showUpload && (
              <Card className="border-0 shadow-lg bg-white mb-6">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900">Upload New Certificate</CardTitle>
                  <CardDescription>Upload your course or internship certificate</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">Certificate Title *</label>
                        <Input 
                          placeholder="e.g., Python Programming Certificate" 
                          value={title} 
                          onChange={e => setTitle(e.target.value)}
                          className="border-gray-300 focus:border-[#0f1a2a] focus:ring-[#0f1a2a]"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">Certificate Type *</label>
                        <Tabs value={active} onValueChange={(v) => setActive(v as CertType)}>
                          <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="COURSE">Course</TabsTrigger>
                            <TabsTrigger value="INTERNSHIP">Internship</TabsTrigger>
                          </TabsList>
                        </Tabs>
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">File Upload *</label>
                      <Input 
                        type="file" 
                        accept="application/pdf,image/*,.doc,.docx" 
                        onChange={e => setFile(e.target.files?.[0] || null)}
                        className="border-gray-300 focus:border-[#0f1a2a] focus:ring-[#0f1a2a]"
                      />
                      <p className="text-xs text-gray-500 mt-1">Supported formats: PDF, Images, Word documents</p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Description (Optional)</label>
                      <Textarea 
                        placeholder="Add a description for your certificate..." 
                        value={desc} 
                        onChange={e => setDesc(e.target.value)}
                        className="border-gray-300 focus:border-[#0f1a2a] focus:ring-[#0f1a2a]"
                        rows={3}
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-end gap-3 mt-6">
                    <Button 
                      variant="outline" 
                      onClick={() => setShowUpload(false)}
                      className="border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={onUpload} 
                      disabled={isUploading || !title.trim() || !file}
                      className="bg-[#0f1a2a] hover:bg-[#0a141f] text-white shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
                    >
                      <UploadCloud className="h-4 w-4 mr-2" />
                      {isUploading ? 'Uploading...' : 'Upload Certificate'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Certificates List */}
            <Card className="border-0 shadow-lg bg-white">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">
                  {active === 'COURSE' ? 'Course Certificates' : 'Internship Certificates'}
                </CardTitle>
                <CardDescription>
                  {filtered.length} certificate{filtered.length === 1 ? '' : 's'} found
                </CardDescription>
              </CardHeader>
              <CardContent>
                {filtered.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filtered.map((cert: any) => (
                      <div key={cert.id} className="group relative bg-white border border-gray-200 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
                        {/* Certificate Image/Preview */}
                        <div 
                          className="aspect-[4/3] bg-gray-100 relative overflow-hidden cursor-pointer"
                          onClick={() => onView(cert)}
                        >
                          {cert.filePath && (
                            <>
                              {/* Try to show image preview first */}
                              <img
                                src={`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'}/api/certificates/view/${cert.id}?userEmail=${encodeURIComponent(user?.email || '')}`}
                                alt={cert.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                onError={(e) => {
                                  // Hide image and show file type preview
                                  e.currentTarget.style.display = 'none';
                                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                                }}
                              />
                              {/* Fallback file type preview */}
                              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#0f1a2a] to-[#0a141f] hidden">
                                <div className="text-center text-white p-4">
                                  <FileText className="h-16 w-16 mx-auto mb-3 opacity-80" />
                                  <p className="text-sm font-medium mb-2">{cert.title}</p>
                                  <p className="text-xs opacity-70 mb-3">
                                    {cert.filePath?.split('.').pop()?.toUpperCase() || 'FILE'}
                                  </p>
                                  <div className="flex items-center justify-center space-x-2 text-xs opacity-60">
                                    <Eye className="h-3 w-3" />
                                    <span>Click to view</span>
                                  </div>
                                </div>
                              </div>
                            </>
                          )}
                          {!cert.filePath && (
                            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#0f1a2a] to-[#0a141f]">
                              <div className="text-center text-white p-4">
                                <FileText className="h-16 w-16 mx-auto mb-3 opacity-80" />
                                <p className="text-sm font-medium mb-2">{cert.title}</p>
                                <p className="text-xs opacity-70 mb-3">FILE</p>
                                <div className="flex items-center justify-center space-x-2 text-xs opacity-60">
                                  <Eye className="h-3 w-3" />
                                  <span>Click to view</span>
                                </div>
                              </div>
                            </div>
                          )}
                          
                          {/* Overlay with actions */}
                          {/* Removed hover overlay; actions moved to footer */}
                        </div>
                        
                        {/* Certificate Info */}
                        <div className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 flex-1">{cert.title}</h3>
                            <Badge 
                              variant={cert.type === 'INTERNSHIP' ? 'default' : 'secondary'}
                              className={`ml-2 flex-shrink-0 ${
                                cert.type === 'INTERNSHIP' 
                                  ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                                  : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                              }`}
                            >
                              {cert.type === 'INTERNSHIP' ? 'Internship' : 'Course'}
                            </Badge>
                          </div>
                          
                          {cert.description && (
                            <p className="text-sm text-gray-600 mb-3 line-clamp-2">{cert.description}</p>
                          )}
                          
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              {new Date(cert.uploadDate).toLocaleDateString()}
                            </span>
                            <span className="text-gray-400">
                              {cert.filePath?.split('.').pop()?.toUpperCase() || 'FILE'}
                            </span>
                          </div>
                        </div>

                        {/* Actions Footer */}
                        <div className="px-4 pb-4">
                          <div className="flex items-center justify-between gap-2">
                            <Button
                              variant="outline"
                              className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
                              onClick={() => onView(cert)}
                            >
                              <ZoomIn className="h-4 w-4 mr-2" />
                              View
                            </Button>
                            <Button
                              className="flex-1 bg-[#0f1a2a] hover:bg-[#0a141f] text-white"
                              onClick={() => onDownload(cert.id, cert.title)}
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </Button>
                            <Button
                              variant="destructive"
                              className="flex-1"
                              onClick={() => onDelete(cert.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="flex flex-col items-center space-y-4">
                      <div className="p-4 bg-gray-100 rounded-full">
                        <UploadCloud className="h-12 w-12 text-gray-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No certificates found</h3>
                        <p className="text-gray-600 mb-4">
                          {search ? 'No certificates match your search criteria.' : 'Upload your first certificate to get started!'}
                        </p>
                        {!search && (
                          <Button 
                            onClick={() => setShowUpload(true)}
                            className="bg-[#0f1a2a] hover:bg-[#0a141f] text-white shadow-lg hover:shadow-xl transition-all duration-300"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Upload Certificate
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Certificate View Modal */}
      {showModal && selectedCert && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setShowModal(false)}
        >
          <div 
            className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{selectedCert.title}</h2>
                <div className="flex items-center space-x-4 mt-2">
                  <Badge 
                    variant={selectedCert.type === 'INTERNSHIP' ? 'default' : 'secondary'}
                    className={selectedCert.type === 'INTERNSHIP' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}
                  >
                    {selectedCert.type === 'INTERNSHIP' ? 'Internship' : 'Course'}
                  </Badge>
                  <span className="text-sm text-gray-500 flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {new Date(selectedCert.uploadDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  onClick={() => onDownload(selectedCert.id, selectedCert.title)}
                  className="bg-[#0f1a2a] hover:bg-[#0a141f] text-white"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowModal(false)}
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  <X className="h-4 w-4 mr-2" />
                  Close
                </Button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 max-h-[calc(90vh-120px)] overflow-auto">
              {selectedCert.description && (
                <p className="text-gray-600 mb-4">{selectedCert.description}</p>
              )}
              
              {/* PDF Viewer */}
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <iframe
                  src={`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'}/api/certificates/view/${selectedCert.id}?userEmail=${encodeURIComponent(user?.email || '')}#toolbar=0&navpanes=0&scrollbar=0`}
                  className="w-full h-[600px] border-0"
                  title={selectedCert.title}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Certifications;



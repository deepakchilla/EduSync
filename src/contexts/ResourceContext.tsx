import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Resource {
  id: string;
  title: string;
  description: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  uploadedBy: string;
  uploadedAt: string;
  lastModified: string;
}

interface ResourceContextType {
  resources: Resource[];
  recentlyAccessed: Resource[];
  addResource: (resource: Omit<Resource, 'id' | 'uploadedAt' | 'lastModified'>) => void;
  updateResource: (id: string, updates: Partial<Resource>) => void;
  deleteResource: (id: string) => void;
  accessResource: (resource: Resource) => void;
  loading: boolean;
}

const ResourceContext = createContext<ResourceContextType | null>(null);

export const useResources = () => {
  const context = useContext(ResourceContext);
  if (!context) {
    throw new Error('useResources must be used within a ResourceProvider');
  }
  return context;
};

export const ResourceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [recentlyAccessed, setRecentlyAccessed] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load initial data from localStorage (simulating backend)
    const savedResources = localStorage.getItem('edusync_resources');
    const savedRecent = localStorage.getItem('edusync_recent');
    
    if (savedResources) {
      setResources(JSON.parse(savedResources));
    } else {
      // Mock initial data
      const mockResources: Resource[] = [
        {
          id: '1',
          title: 'Introduction to React',
          description: 'Comprehensive guide to getting started with React development',
          fileName: 'react-intro.pdf',
          fileType: 'pdf',
          fileSize: 2048000,
          uploadedBy: 'Dr. Smith',
          uploadedAt: '2024-01-15T10:30:00Z',
          lastModified: '2024-01-15T10:30:00Z'
        },
        {
          id: '2',
          title: 'Database Design Principles',
          description: 'Learn the fundamentals of effective database design and normalization',
          fileName: 'db-design.docx',
          fileType: 'docx',
          fileSize: 1536000,
          uploadedBy: 'Prof. Johnson',
          uploadedAt: '2024-01-14T14:20:00Z',
          lastModified: '2024-01-14T14:20:00Z'
        }
      ];
      setResources(mockResources);
      localStorage.setItem('edusync_resources', JSON.stringify(mockResources));
    }
    
    if (savedRecent) {
      setRecentlyAccessed(JSON.parse(savedRecent));
    }
  }, []);

  const addResource = (resourceData: Omit<Resource, 'id' | 'uploadedAt' | 'lastModified'>) => {
    const newResource: Resource = {
      ...resourceData,
      id: Date.now().toString(),
      uploadedAt: new Date().toISOString(),
      lastModified: new Date().toISOString()
    };

    const updatedResources = [...resources, newResource];
    setResources(updatedResources);
    localStorage.setItem('edusync_resources', JSON.stringify(updatedResources));
  };

  const updateResource = (id: string, updates: Partial<Resource>) => {
    const updatedResources = resources.map(resource =>
      resource.id === id
        ? { ...resource, ...updates, lastModified: new Date().toISOString() }
        : resource
    );
    setResources(updatedResources);
    localStorage.setItem('edusync_resources', JSON.stringify(updatedResources));
  };

  const deleteResource = (id: string) => {
    const updatedResources = resources.filter(resource => resource.id !== id);
    setResources(updatedResources);
    localStorage.setItem('edusync_resources', JSON.stringify(updatedResources));
  };

  const accessResource = (resource: Resource) => {
    const updatedRecent = [
      resource,
      ...recentlyAccessed.filter(r => r.id !== resource.id)
    ].slice(0, 5); // Keep only 5 most recent
    
    setRecentlyAccessed(updatedRecent);
    localStorage.setItem('edusync_recent', JSON.stringify(updatedRecent));
  };

  return (
    <ResourceContext.Provider value={{
      resources,
      recentlyAccessed,
      addResource,
      updateResource,
      deleteResource,
      accessResource,
      loading
    }}>
      {children}
    </ResourceContext.Provider>
  );
};
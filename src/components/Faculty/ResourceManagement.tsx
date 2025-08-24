import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useResources } from '../../contexts/ResourceContext';
import { useAuth } from '../../contexts/AuthContext';
import { FileText, Edit, Trash2, Calendar, Search, Download, Eye } from 'lucide-react';
import { formatFileSize } from '../../utils/fileUtils';
import { getFileIcon } from '../../utils/fileUtils';

const ResourceManagement: React.FC = () => {
  const { resources, deleteResource } = useResources();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'title' | 'uploadedAt' | 'fileSize'>('uploadedAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const myResources = resources.filter(resource => resource.uploadedBy === user?.name);

  const filteredResources = myResources
    .filter(resource => 
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];
      
      if (sortBy === 'uploadedAt') {
        const aDate = new Date(aValue as string).getTime();
        const bDate = new Date(bValue as string).getTime();
        return sortOrder === 'asc' ? aDate - bDate : bDate - aDate;
      }
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      return sortOrder === 'asc' 
        ? (aValue as number) - (bValue as number)
        : (bValue as number) - (aValue as number);
    });

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      deleteResource(id);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Manage Resources</h1>
        <p className="text-gray-600 mt-2">View, edit, and organize your uploaded resources</p>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search resources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'title' | 'uploadedAt' | 'fileSize')}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="uploadedAt">Sort by Date</option>
              <option value="title">Sort by Title</option>
              <option value="fileSize">Sort by Size</option>
            </select>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
          </div>
        </div>
      </div>

      {/* Resources List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">
              Your Resources ({filteredResources.length})
            </h2>
            <Link
              to="/faculty/upload"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Add New Resource
            </Link>
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {filteredResources.length > 0 ? (
            filteredResources.map((resource) => {
              const FileIcon = getFileIcon(resource.fileType);
              return (
                <div key={resource.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="p-3 bg-blue-100 rounded-lg">
                        <FileIcon className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-medium text-gray-900 truncate">
                          {resource.title}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                          {resource.description}
                        </p>
                        <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500">
                          <span className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {new Date(resource.uploadedAt).toLocaleDateString()}
                          </span>
                          <span>{formatFileSize(resource.fileSize)}</span>
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                            {resource.fileType.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          File: {resource.fileName}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                        title="Preview"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <button
                        className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                        title="Download"
                      >
                        <Download className="w-5 h-5" />
                      </button>
                      <Link
                        to={`/faculty/edit/${resource.id}`}
                        className="p-2 text-blue-600 hover:text-blue-800 transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-5 h-5" />
                      </Link>
                      <button
                        onClick={() => handleDelete(resource.id, resource.title)}
                        className="p-2 text-red-600 hover:text-red-800 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-12 text-center">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm ? 'No resources found' : 'No resources yet'}
              </h3>
              <p className="text-gray-500 mb-6">
                {searchTerm 
                  ? 'Try adjusting your search terms or filters'
                  : 'Start by uploading your first educational resource'
                }
              </p>
              {!searchTerm && (
                <Link
                  to="/faculty/upload"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Upload Your First Resource
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResourceManagement;
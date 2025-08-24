import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useResources } from '../../contexts/ResourceContext';
import { Save, ArrowLeft, File } from 'lucide-react';

const EditResource: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { resources, updateResource } = useResources();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [resource, setResource] = useState(() => 
    resources.find(r => r.id === id)
  );

  useEffect(() => {
    const foundResource = resources.find(r => r.id === id);
    if (foundResource) {
      setResource(foundResource);
      setTitle(foundResource.title);
      setDescription(foundResource.description);
    }
  }, [id, resources]);

  if (!resource) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <p className="text-gray-500">Resource not found</p>
          <button
            onClick={() => navigate('/faculty/resources')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Back to Resources
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !description) {
      alert('Please fill in all required fields');
      return;
    }

    setLoading(true);
    
    // Simulate update delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    updateResource(resource.id, {
      title,
      description
    });

    setLoading(false);
    navigate('/faculty/resources');
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <button
          onClick={() => navigate('/faculty/resources')}
          className="flex items-center text-gray-600 hover:text-gray-800 transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Resources
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Edit Resource</h1>
        <p className="text-gray-600 mt-2">Update the details of your educational resource</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        {/* Current File Info */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Current File</h3>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <File className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">{resource.fileName}</p>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span>{formatFileSize(resource.fileSize)}</span>
                <span className="px-2 py-1 bg-gray-200 text-gray-700 rounded-full text-xs">
                  {resource.fileType.toUpperCase()}
                </span>
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Note: To change the file, you'll need to create a new resource
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title Field */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Resource Title *
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter a descriptive title for your resource"
              required
            />
          </div>

          {/* Description Field */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              id="description"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Provide a detailed description of the resource content and learning objectives"
              required
            />
          </div>

          {/* Metadata */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm font-medium text-gray-700">Uploaded By</p>
              <p className="text-sm text-gray-600">{resource.uploadedBy}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Upload Date</p>
              <p className="text-sm text-gray-600">
                {new Date(resource.uploadedAt).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Last Modified</p>
              <p className="text-sm text-gray-600">
                {new Date(resource.lastModified).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/faculty/resources')}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !title || !description}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditResource;
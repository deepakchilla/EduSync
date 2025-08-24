import React from 'react';
import { Link } from 'react-router-dom';
import { useResources } from '../../contexts/ResourceContext';
import { useAuth } from '../../contexts/AuthContext';
import { Upload, FileText, Eye, Download, Calendar, User } from 'lucide-react';
import { formatFileSize } from '../../utils/fileUtils';

const FacultyDashboard: React.FC = () => {
  const { resources } = useResources();
  const { user } = useAuth();

  const myResources = resources.filter(resource => resource.uploadedBy === user?.name);
  const totalResources = myResources.length;
  const totalSize = myResources.reduce((sum, resource) => sum + resource.fileSize, 0);

  const recentResources = myResources
    .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())
    .slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Faculty Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Welcome back, {user?.name}! Manage your educational resources here.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Resources</p>
              <p className="text-2xl font-bold text-gray-900">{totalResources}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <Upload className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Storage Used</p>
              <p className="text-2xl font-bold text-gray-900">{formatFileSize(totalSize)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Eye className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Views</p>
              <p className="text-2xl font-bold text-gray-900">--</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Link
          to="/faculty/upload"
          className="bg-blue-600 text-white rounded-lg p-6 hover:bg-blue-700 transition-colors"
        >
          <div className="flex items-center">
            <Upload className="w-8 h-8 mr-4" />
            <div>
              <h3 className="text-lg font-semibold">Upload New Resource</h3>
              <p className="text-blue-100 mt-1">Share educational materials with students</p>
            </div>
          </div>
        </Link>

        <Link
          to="/faculty/resources"
          className="bg-gray-800 text-white rounded-lg p-6 hover:bg-gray-900 transition-colors"
        >
          <div className="flex items-center">
            <FileText className="w-8 h-8 mr-4" />
            <div>
              <h3 className="text-lg font-semibold">Manage Resources</h3>
              <p className="text-gray-300 mt-1">Edit, delete, and organize your content</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Recent Resources */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Uploads</h2>
        </div>
        <div className="p-6">
          {recentResources.length > 0 ? (
            <div className="space-y-4">
              {recentResources.map((resource) => (
                <div key={resource.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <FileText className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{resource.title}</h3>
                      <p className="text-sm text-gray-500">{resource.fileName}</p>
                      <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                        <span className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {new Date(resource.uploadedAt).toLocaleDateString()}
                        </span>
                        <span>{formatFileSize(resource.fileSize)}</span>
                      </div>
                    </div>
                  </div>
                  <Link
                    to={`/faculty/edit/${resource.id}`}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md text-sm hover:bg-blue-200 transition-colors"
                  >
                    Edit
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No resources uploaded yet</p>
              <Link
                to="/faculty/upload"
                className="inline-flex items-center mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Your First Resource
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FacultyDashboard;
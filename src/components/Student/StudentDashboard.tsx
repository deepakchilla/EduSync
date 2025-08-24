import React, { useState } from 'react';
import { useResources } from '../../contexts/ResourceContext';
import { useSearch } from '../../contexts/SearchContext';
import { useAuth } from '../../contexts/AuthContext';
import { Search, Download, Eye, Clock, FileText, Filter, X, Star, Bookmark } from 'lucide-react';
import { formatFileSize, getFileIcon } from '../../utils/fileUtils';
import { motion } from 'framer-motion';

const StudentDashboard: React.FC = () => {
  const { resources, recentlyAccessed, accessResource } = useResources();
  const { 
    searchTerm, 
    setSearchTerm, 
    searchResults, 
    recentSearches, 
    performSearch, 
    searchFilters, 
    updateFilters,
    isSearching,
    clearSearchHistory 
  } = useSearch();
  const { user } = useAuth();
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'title' | 'uploadedAt' | 'uploadedBy'>('uploadedAt');
  const [savedResources, setSavedResources] = useState<string[]>([]);

  const fileTypes = Array.from(new Set(resources.map(r => r.fileType)));

  // Use search results if searching, otherwise use filtered resources
  const displayResources = searchTerm ? searchResults.map(result => {
    // Convert search result to resource format
    const resource = resources.find(r => r.id === result.id);
    return resource || {
      id: result.id,
      title: result.title,
      description: result.description,
      fileName: `${result.title}.pdf`,
      fileType: 'pdf',
      fileSize: 1024000,
      uploadedBy: 'Faculty',
      uploadedAt: new Date().toISOString(),
      lastModified: new Date().toISOString()
    };
  }) : resources
    .filter(resource => {
      const matchesType = selectedType === 'all' || resource.fileType === selectedType;
      return matchesType;
    })
    .sort((a, b) => {
      if (sortBy === 'uploadedAt') {
        return new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime();
      }
      return a[sortBy].localeCompare(b[sortBy]);
    });

  const handleSearch = async (term: string) => {
    setSearchTerm(term);
    if (term.trim()) {
      await performSearch(term);
      setShowSearchDropdown(false);
    }
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setShowSearchDropdown(value.length > 0);
    
    if (value.trim()) {
      // Debounced search
      const timeoutId = setTimeout(() => {
        performSearch(value);
      }, 300);
      return () => clearTimeout(timeoutId);
    }
  };

  const toggleSaveResource = (resourceId: string) => {
    setSavedResources(prev => 
      prev.includes(resourceId) 
        ? prev.filter(id => id !== resourceId)
        : [...prev, resourceId]
    );
  };

  const handleViewResource = (resource: any) => {
    accessResource(resource);
    // In a real app, this would open the file viewer or download
    alert(`Viewing: ${resource.title}`);
  };

  const handleDownloadResource = (resource: any) => {
    accessResource(resource);
    // In a real app, this would trigger the download
    alert(`Downloading: ${resource.fileName}`);
  };

  // Mock recommended resources based on user activity
  const recommendedResources = resources
    .filter(r => !recentlyAccessed.some(recent => recent.id === r.id))
    .slice(0, 6);
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Educational Resources</h1>
        <p className="text-gray-600 mt-2">
          Welcome, {user?.name}! Explore and access educational materials.
        </p>
      </div>

      {/* Recently Accessed Section */}
      {recentlyAccessed.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-gray-500" />
                <h2 className="text-lg font-semibold text-gray-900">Recently Accessed</h2>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                {recentlyAccessed.map((resource) => {
                  const FileIcon = getFileIcon(resource.fileType);
                  return (
                    <div
                      key={resource.id}
                      className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer"
                      onClick={() => handleViewResource(resource)}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <FileIcon className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-gray-900 truncate text-sm">
                            {resource.title}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            by {resource.uploadedBy}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Search and Filter Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6"
      >
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search resources, descriptions, or faculty names..."
              value={searchTerm}
              onChange={handleSearchInputChange}
              onFocus={() => setShowSearchDropdown(searchTerm.length > 0)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            
            {/* Search Dropdown */}
            {showSearchDropdown && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                {recentSearches.length > 0 && (
                  <div className="p-3 border-b border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Recent Searches
                      </span>
                      <button
                        onClick={clearSearchHistory}
                        className="text-xs text-gray-400 hover:text-gray-600"
                      >
                        Clear
                      </button>
                    </div>
                    {recentSearches.slice(0, 5).map((search, index) => (
                      <button
                        key={index}
                        onClick={() => handleSearch(search)}
                        className="block w-full text-left px-2 py-1 text-sm text-gray-700 hover:bg-gray-50 rounded"
                      >
                        {search}
                      </button>
                    ))}
                  </div>
                )}
                
                {isSearching && (
                  <div className="p-3 text-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent mx-auto"></div>
                    <span className="text-sm text-gray-500 mt-2">Searching...</span>
                  </div>
                )}
              </div>
            )}
          </div>
          
          <div className="flex gap-2">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Types</option>
              {fileTypes.map(type => (
                <option key={type} value={type}>
                  {type.toUpperCase()}
                </option>
              ))}
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'title' | 'uploadedAt' | 'uploadedBy')}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="uploadedAt">Latest First</option>
              <option value="title">Title A-Z</option>
              <option value="uploadedBy">Faculty A-Z</option>
            </select>
          </div>
        </div>
        
        {/* Active Search Indicator */}
        {searchTerm && (
          <div className="mt-4 flex items-center justify-between">
            <span className="text-sm text-gray-600">
              {searchResults.length > 0 
                ? `Found ${searchResults.length} results for "${searchTerm}"`
                : `No results found for "${searchTerm}"`
              }
            </span>
            <button
              onClick={() => {
                setSearchTerm('');
                setShowSearchDropdown(false);
              }}
              className="flex items-center text-sm text-gray-500 hover:text-gray-700"
            >
              <X className="w-4 h-4 mr-1" />
              Clear search
            </button>
          </div>
        )}
      </motion.div>

      {/* Resources Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8"
      >
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            {searchTerm ? 'Search Results' : 'All Resources'} ({displayResources.length})
          </h2>
        </div>

        {displayResources.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-gray-200">
            {displayResources.map((resource, index) => {
              const FileIcon = getFileIcon(resource.fileType);
              const isSaved = savedResources.includes(resource.id);
              return (
                <div
                  key={resource.id}
                  className={`p-6 hover:bg-gray-50 transition-colors ${
                    index % 2 === 0 ? 'lg:border-r' : ''
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <FileIcon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        {resource.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {resource.description}
                      </p>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                        <span>by {resource.uploadedBy}</span>
                        <span>•</span>
                        <span>{new Date(resource.uploadedAt).toLocaleDateString()}</span>
                        <span>•</span>
                        <span>{formatFileSize(resource.fileSize)}</span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleViewResource(resource)}
                          className="flex items-center space-x-2 px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
                        >
                          <Eye className="w-4 h-4" />
                          <span>View</span>
                        </button>
                        <button
                          onClick={() => handleDownloadResource(resource)}
                          className="flex items-center space-x-2 px-3 py-1 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-sm"
                        >
                          <Download className="w-4 h-4" />
                          <span>Download</span>
                        </button>
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                          {resource.fileType.toUpperCase()}
                        </span>
                      </div>
                          <button
                            onClick={() => toggleSaveResource(resource.id)}
                            className={`p-2 rounded-md transition-colors ${
                              isSaved 
                                ? 'text-yellow-600 bg-yellow-50 hover:bg-yellow-100' 
                                : 'text-gray-400 hover:text-yellow-600 hover:bg-yellow-50'
                            }`}
                            title={isSaved ? 'Remove from saved' : 'Save for later'}
                          >
                            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                          </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-12 text-center">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? 'No search results found' : selectedType !== 'all' ? 'No resources found' : 'No resources available'}
            </h3>
            <p className="text-gray-500">
              {searchTerm ? 'Try different search terms or check your spelling'
                : selectedType !== 'all'
                ? 'Try adjusting your search terms or filters'
                : 'Check back later for new educational materials'
              }
            </p>
            {(searchTerm || selectedType !== 'all') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedType('all');
                  setShowSearchDropdown(false);
                }}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}
      </motion.div>

      {/* Recommended Resources Section */}
      {!searchTerm && recommendedResources.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200"
        >
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <Star className="w-5 h-5 text-yellow-500" />
              <h2 className="text-lg font-semibold text-gray-900">Recommended for You</h2>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendedResources.map((resource) => {
                const FileIcon = getFileIcon(resource.fileType);
                const isSaved = savedResources.includes(resource.id);
                return (
                  <div
                    key={resource.id}
                    className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-sm transition-all"
                  >
                    <div className="flex items-start space-x-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <FileIcon className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 truncate text-sm mb-1">
                          {resource.title}
                        </h3>
                        <p className="text-xs text-gray-500 mb-2 line-clamp-2">
                          {resource.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">
                            by {resource.uploadedBy}
                          </span>
                          <button
                            onClick={() => toggleSaveResource(resource.id)}
                            className={`p-1 rounded transition-colors ${
                              isSaved 
                                ? 'text-yellow-600' 
                                : 'text-gray-400 hover:text-yellow-600'
                            }`}
                          >
                            <Bookmark className={`w-3 h-3 ${isSaved ? 'fill-current' : ''}`} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default StudentDashboard;
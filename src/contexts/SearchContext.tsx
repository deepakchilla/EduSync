import React, { createContext, useContext, useState, useCallback } from 'react';

export interface SearchResult {
  id: string;
  title: string;
  description: string;
  type: 'resource' | 'course' | 'faculty';
  category?: string;
  relevanceScore: number;
  thumbnail?: string;
}

export interface SearchFilters {
  type: 'all' | 'resource' | 'course' | 'faculty';
  category: string;
  difficulty: 'all' | 'beginner' | 'intermediate' | 'advanced';
}

interface SearchContextType {
  searchTerm: string;
  searchResults: SearchResult[];
  recentSearches: string[];
  searchFilters: SearchFilters;
  isSearching: boolean;
  setSearchTerm: (term: string) => void;
  performSearch: (term: string, filters?: Partial<SearchFilters>) => Promise<void>;
  updateFilters: (filters: Partial<SearchFilters>) => void;
  clearSearchHistory: () => void;
  addToRecentSearches: (term: string) => void;
}

const SearchContext = createContext<SearchContextType | null>(null);

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};

export const SearchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    const saved = localStorage.getItem('edusync_recent_searches');
    return saved ? JSON.parse(saved) : [];
  });
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    type: 'all',
    category: 'all',
    difficulty: 'all'
  });
  const [isSearching, setIsSearching] = useState(false);

  const mockSearchData: SearchResult[] = [
    {
      id: '1',
      title: 'Introduction to React',
      description: 'Comprehensive guide to getting started with React development',
      type: 'resource',
      category: 'Programming',
      relevanceScore: 0.95
    },
    {
      id: '2',
      title: 'Database Design Principles',
      description: 'Learn the fundamentals of effective database design',
      type: 'resource',
      category: 'Database',
      relevanceScore: 0.88
    },
    {
      id: '3',
      title: 'Dr. Sarah Johnson',
      description: 'Professor of Computer Science, specializing in AI and Machine Learning',
      type: 'faculty',
      category: 'Computer Science',
      relevanceScore: 0.82
    },
    {
      id: '4',
      title: 'Advanced Web Development',
      description: 'Full-stack web development course covering modern frameworks',
      type: 'course',
      category: 'Programming',
      relevanceScore: 0.79
    }
  ];

  const performSearch = useCallback(async (term: string, filters?: Partial<SearchFilters>) => {
    if (!term.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    
    // Update filters if provided
    if (filters) {
      setSearchFilters(prev => ({ ...prev, ...filters }));
    }

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Mock search logic
    const results = mockSearchData
      .filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(term.toLowerCase()) ||
                             item.description.toLowerCase().includes(term.toLowerCase());
        const matchesType = searchFilters.type === 'all' || item.type === searchFilters.type;
        const matchesCategory = searchFilters.category === 'all' || item.category === searchFilters.category;
        
        return matchesSearch && matchesType && matchesCategory;
      })
      .sort((a, b) => b.relevanceScore - a.relevanceScore);

    setSearchResults(results);
    setIsSearching(false);
    
    if (term.trim()) {
      addToRecentSearches(term);
    }
  }, [searchFilters]);

  const updateFilters = useCallback((filters: Partial<SearchFilters>) => {
    setSearchFilters(prev => ({ ...prev, ...filters }));
    if (searchTerm) {
      performSearch(searchTerm, filters);
    }
  }, [searchTerm, performSearch]);

  const addToRecentSearches = useCallback((term: string) => {
    const trimmedTerm = term.trim();
    if (!trimmedTerm) return;

    setRecentSearches(prev => {
      const updated = [trimmedTerm, ...prev.filter(s => s !== trimmedTerm)].slice(0, 10);
      localStorage.setItem('edusync_recent_searches', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const clearSearchHistory = useCallback(() => {
    setRecentSearches([]);
    localStorage.removeItem('edusync_recent_searches');
  }, []);

  return (
    <SearchContext.Provider value={{
      searchTerm,
      searchResults,
      recentSearches,
      searchFilters,
      isSearching,
      setSearchTerm,
      performSearch,
      updateFilters,
      clearSearchHistory,
      addToRecentSearches
    }}>
      {children}
    </SearchContext.Provider>
  );
};
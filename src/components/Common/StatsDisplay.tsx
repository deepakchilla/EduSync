import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, BookOpen, Download, Clock, Activity } from 'lucide-react';

interface StatsData {
  totalUsers?: number;
  totalStudents?: number;
  totalFaculty?: number;
  totalResources?: number;
  totalDownloads?: number;
  recentUploads?: number;
  activeSessions?: number;
  systemStatus?: string;
  timestamp?: string;
}

interface StatsDisplayProps {
  type?: 'dashboard' | 'resources' | 'users';
  className?: string;
  refreshInterval?: number; // in milliseconds
}

const StatsDisplay: React.FC<StatsDisplayProps> = ({
  type = 'dashboard',
  className = '',
  refreshInterval = 30000 // 30 seconds default
}) => {
  const [stats, setStats] = useState<StatsData>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`http://localhost:8080/api/stats/${type}`, {
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setStats(data.stats);
          setLastUpdated(new Date());
        } else {
          setError(data.message || 'Failed to fetch stats');
        }
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error) {
      console.log('Backend not available, using demo stats');
      // Demo mode: use mock data
      const demoStats: StatsData = {
        totalUsers: 1250,
        totalStudents: 1100,
        totalFaculty: 150,
        totalResources: 850,
        totalDownloads: 3200,
        recentUploads: 25,
        activeSessions: 45,
        systemStatus: 'Online',
        timestamp: new Date().toISOString()
      };
      setStats(demoStats);
      setLastUpdated(new Date());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    
    const interval = setInterval(fetchStats, refreshInterval);
    
    return () => clearInterval(interval);
  }, [type, refreshInterval]);

  const formatNumber = (num: number | undefined) => {
    if (num === undefined) return '0';
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatTime = (date: Date | null) => {
    if (!date) return 'Never';
    return date.toLocaleTimeString();
  };

  const getStatsCards = () => {
    switch (type) {
      case 'dashboard':
        return [
          {
            title: 'Total Users',
            value: formatNumber(stats.totalUsers),
            icon: Users,
            color: 'bg-blue-500',
            description: 'Registered users'
          },
          {
            title: 'Total Resources',
            value: formatNumber(stats.totalResources),
            icon: BookOpen,
            color: 'bg-green-500',
            description: 'Available resources'
          },
          {
            title: 'Total Downloads',
            value: formatNumber(stats.totalDownloads),
            icon: Download,
            color: 'bg-purple-500',
            description: 'Resource downloads'
          },
          {
            title: 'Active Sessions',
            value: formatNumber(stats.activeSessions),
            icon: Activity,
            color: 'bg-orange-500',
            description: 'Current users'
          }
        ];
      
      case 'users':
        return [
          {
            title: 'Total Users',
            value: formatNumber(stats.totalUsers),
            icon: Users,
            color: 'bg-blue-500',
            description: 'All registered users'
          },
          {
            title: 'Students',
            value: formatNumber(stats.totalStudents),
            icon: Users,
            color: 'bg-green-500',
            description: 'Student accounts'
          },
          {
            title: 'Faculty',
            value: formatNumber(stats.totalFaculty),
            icon: Users,
            color: 'bg-purple-500',
            description: 'Faculty accounts'
          },
          {
            title: 'System Status',
            value: stats.systemStatus || 'Unknown',
            icon: Activity,
            color: 'bg-gray-500',
            description: 'Platform status'
          }
        ];
      
      case 'resources':
        return [
          {
            title: 'Total Resources',
            value: formatNumber(stats.totalResources),
            icon: BookOpen,
            color: 'bg-blue-500',
            description: 'Available resources'
          },
          {
            title: 'Recent Uploads',
            value: formatNumber(stats.recentUploads),
            icon: TrendingUp,
            color: 'bg-green-500',
            description: 'This week'
          },
          {
            title: 'Total Downloads',
            value: formatNumber(stats.totalDownloads),
            icon: Download,
            color: 'bg-purple-500',
            description: 'All time'
          },
          {
            title: 'Last Updated',
            value: formatTime(lastUpdated),
            icon: Clock,
            color: 'bg-orange-500',
            description: 'Stats refresh time'
          }
        ];
      
      default:
        return [];
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 capitalize">
          {type} Statistics
        </h3>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Clock className="w-4 h-4" />
          <span>Last updated: {formatTime(lastUpdated)}</span>
          <button
            onClick={fetchStats}
            disabled={loading}
            className="text-blue-600 hover:text-blue-800 transition-colors disabled:opacity-50"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {getStatsCards().map((card, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{card.title}</p>
                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                <p className="text-xs text-gray-500 mt-1">{card.description}</p>
              </div>
              <div className={`${card.color} p-3 rounded-full`}>
                <card.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center py-8">
          <div className="inline-flex items-center space-x-2 text-gray-500">
            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <span>Updating statistics...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatsDisplay;

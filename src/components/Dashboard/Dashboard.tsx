import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useResources } from '../../contexts/ResourceContext';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  TrendingUp, 
  Clock, 
  Award, 
  Users, 
  FileText,
  Calendar,
  Bell,
  Plus,
  Eye
} from 'lucide-react';
import { Link } from 'react-router-dom';
import StatsDisplay from '../Common/StatsDisplay';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { resources, recentlyAccessed } = useResources();

  const isFaculty = user?.role === 'faculty';
  const myResources = isFaculty ? resources.filter(r => r.uploadedBy === user?.name) : resources;

  const stats = isFaculty ? [
    {
      icon: FileText,
      label: 'My Resources',
      value: myResources.length.toString(),
      color: 'bg-blue-100 text-blue-600',
      change: '+2 this week'
    },
    {
      icon: Eye,
      label: 'Total Views',
      value: '1,247',
      color: 'bg-green-100 text-green-600',
      change: '+15% this month'
    },
    {
      icon: Users,
      label: 'Active Students',
      value: '89',
      color: 'bg-purple-100 text-purple-600',
      change: '+5 new this week'
    },
    {
      icon: Award,
      label: 'Course Rating',
      value: '4.8',
      color: 'bg-yellow-100 text-yellow-600',
      change: '+0.2 this month'
    }
  ] : [
    {
      icon: BookOpen,
      label: 'Enrolled Courses',
      value: '6',
      color: 'bg-blue-100 text-blue-600',
      change: '2 in progress'
    },
    {
      icon: TrendingUp,
      label: 'Progress',
      value: '78%',
      color: 'bg-green-100 text-green-600',
      change: '+12% this week'
    },
    {
      icon: Clock,
      label: 'Study Hours',
      value: '24.5',
      color: 'bg-purple-100 text-purple-600',
      change: 'This week'
    },
    {
      icon: Award,
      label: 'Achievements',
      value: '12',
      color: 'bg-yellow-100 text-yellow-600',
      change: '3 new badges'
    }
  ];

  const recentActivities = [
    {
      type: 'resource',
      title: 'New resource uploaded: Advanced React Patterns',
      time: '2 hours ago',
      icon: FileText
    },
    {
      type: 'assignment',
      title: 'Assignment submitted: Database Design Project',
      time: '1 day ago',
      icon: BookOpen
    },
    {
      type: 'grade',
      title: 'Grade received: Web Development Quiz - 95%',
      time: '2 days ago',
      icon: Award
    },
    {
      type: 'announcement',
      title: 'New announcement from Prof. Johnson',
      time: '3 days ago',
      icon: Bell
    }
  ];

  const upcomingDeadlines = [
    {
      title: 'React Project Submission',
      course: 'Advanced Web Development',
      dueDate: '2024-02-15',
      priority: 'high'
    },
    {
      title: 'Database Quiz',
      course: 'Database Systems',
      dueDate: '2024-02-18',
      priority: 'medium'
    },
    {
      title: 'Research Paper Draft',
      course: 'Computer Science Research',
      dueDate: '2024-02-22',
      priority: 'low'
    }
  ];

  return (
    <>
      <Helmet>
        <title>Dashboard - EduSync</title>
        <meta name="description" content="Your personalized dashboard with course progress, assignments, and educational resources." />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {user?.name}!
            </h1>
            <p className="text-gray-600 mt-2">
              {isFaculty 
                ? "Here's an overview of your teaching activities and resources."
                : "Here's your learning progress and upcoming activities."
              }
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                    <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.color}`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Real-time Statistics */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
              >
                <StatsDisplay type="dashboard" refreshInterval={30000} />
              </motion.div>

              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.25 }}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
              >
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {isFaculty ? (
                    <>
                      <Link
                        to="/faculty/upload"
                        className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                      >
                        <Plus className="w-5 h-5 text-blue-600 mr-3" />
                        <span className="font-medium text-blue-900">Upload Resource</span>
                      </Link>
                      <Link
                        to="/faculty/resources"
                        className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                      >
                        <FileText className="w-5 h-5 text-green-600 mr-3" />
                        <span className="font-medium text-green-900">Manage Resources</span>
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/student"
                        className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                      >
                        <BookOpen className="w-5 h-5 text-blue-600 mr-3" />
                        <span className="font-medium text-blue-900">Browse Resources</span>
                      </Link>
                      <Link
                        to="/profile"
                        className="flex items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
                      >
                        <Users className="w-5 h-5 text-purple-600 mr-3" />
                        <span className="font-medium text-purple-900">Update Profile</span>
                      </Link>
                    </>
                  )}
                </div>
              </motion.div>

              {/* Recent Activity */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
              >
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
                <div className="space-y-4">
                  {recentActivities.map((activity, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        <activity.icon className="w-4 h-4 text-gray-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900">{activity.title}</p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Recently Accessed */}
              {recentlyAccessed.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
                >
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Recently Accessed</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {recentlyAccessed.slice(0, 4).map((resource) => (
                      <div key={resource.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
                        <FileText className="w-5 h-5 text-blue-600 mr-3" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {resource.title}
                          </p>
                          <p className="text-xs text-gray-500">
                            by {resource.uploadedBy}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Upcoming Deadlines */}
              {!isFaculty && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
                >
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Deadlines</h2>
                  <div className="space-y-4">
                    {upcomingDeadlines.map((deadline, index) => (
                      <div key={index} className="border-l-4 border-blue-500 pl-4">
                        <h3 className="text-sm font-medium text-gray-900">{deadline.title}</h3>
                        <p className="text-xs text-gray-600">{deadline.course}</p>
                        <div className="flex items-center mt-1">
                          <Calendar className="w-3 h-3 text-gray-400 mr-1" />
                          <span className="text-xs text-gray-500">
                            {new Date(deadline.dueDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Progress Chart Placeholder */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
              >
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  {isFaculty ? 'Resource Views' : 'Learning Progress'}
                </h2>
                <div className="h-48 bg-gray-50 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Chart visualization</p>
                    <p className="text-xs text-gray-400">Coming soon</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default Dashboard;
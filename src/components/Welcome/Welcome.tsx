import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { BookOpen, Users, Award, TrendingUp, ArrowRight, Play } from 'lucide-react';
import Navbar from '../Navigation/Navbar';
import StatsDisplay from '../Common/StatsDisplay';
import { useAuth } from '../../contexts/AuthContext';
import ProfilePicture from '../Common/ProfilePicture';

const Welcome: React.FC = () => {
  const { user } = useAuth();
  
  const features = [
    {
      icon: BookOpen,
      title: 'Comprehensive Resources',
      description: 'Access thousands of educational materials, courses, and learning resources.'
    },
    {
      icon: Users,
      title: 'Expert Faculty',
      description: 'Learn from industry professionals and experienced educators.'
    },
    {
      icon: Award,
      title: 'Quality Education',
      description: 'Accredited programs designed to meet industry standards.'
    },
    {
      icon: TrendingUp,
      title: 'Track Progress',
      description: 'Monitor your learning journey with detailed analytics and insights.'
    }
  ];

  const stats = [
    { number: '10,000+', label: 'Active Students' },
    { number: '500+', label: 'Expert Faculty' },
    { number: '1,200+', label: 'Courses Available' },
    { number: '95%', label: 'Success Rate' }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Computer Science Student',
      content: 'EduSync has transformed my learning experience. The platform is intuitive and the resources are top-notch.',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
    },
    {
      name: 'Dr. Michael Chen',
      role: 'Professor of Engineering',
      content: 'As a faculty member, I appreciate how easy it is to share resources and engage with students through this platform.',
      avatar: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Business Administration Student',
      content: 'The personalized learning recommendations have helped me discover resources I never would have found otherwise.',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
    }
  ];

  return (
    <>
      <Helmet>
        <title>Welcome to EduSync - Transform Your Learning Experience</title>
        <meta name="description" content="Join thousands of students and faculty in our comprehensive educational platform. Access quality resources, expert instruction, and personalized learning." />
        <meta name="keywords" content="education, learning, online courses, faculty, students, resources" />
      </Helmet>

      <div className="min-h-screen">
        {/* Navigation */}
        <Navbar />
        
        {/* Hero Section */}
        <section 
          className="relative bg-gray-800 text-white overflow-hidden"
        >
          {/* Background Image with Blur */}
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              filter: 'blur(1px)'
            }}
          ></div>
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/40 to-slate-800/40"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              {/* Profile Picture Display for Logged-in Users */}
              {user && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="mb-8 flex justify-center"
                >
                  <div className="text-center">
                    <ProfilePicture 
                      size="xl" 
                      showUpload={true}
                      className="mx-auto mb-4"
                    />
                    <h3 className="text-2xl font-semibold text-white mb-2">
                      Welcome back, {user.name}!
                    </h3>
                    <p className="text-blue-200">
                      Ready to continue your learning journey?
                    </p>
                  </div>
                </motion.div>
              )}
              
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Transform Your
                <span className="block text-blue-200">Learning Experience</span>
              </h1>
              <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-blue-100">
                Join thousands of students and faculty in our comprehensive educational platform designed for the modern learner.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {user ? (
                  <Link
                    to="/dashboard"
                    className="inline-flex items-center px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
                  >
                    Go to Dashboard
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                ) : (
                  <Link
                    to="/login"
                    className="inline-flex items-center px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
                  >
                    Get Started
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                )}
                <button className="inline-flex items-center px-8 py-4 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
                  <Play className="w-5 h-5 mr-2" />
                  Watch Demo
                </button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Real-time Stats Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <StatsDisplay type="dashboard" refreshInterval={60000} />
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Why Choose EduSync?
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Our platform combines cutting-edge technology with proven educational methods to deliver an exceptional learning experience.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center hover:shadow-md transition-shadow"
                >
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <feature.icon className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                What Our Community Says
              </h2>
              <p className="text-xl text-gray-600">
                Hear from students and faculty who have transformed their educational experience with EduSync.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-gray-50 p-8 rounded-lg"
                >
                  <p className="text-gray-700 mb-6 italic">
                    "{testimonial.content}"
                  </p>
                  <div className="flex items-center">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full mr-4"
                    />
                    <div>
                      <div className="font-semibold text-gray-900">
                        {testimonial.name}
                      </div>
                      <div className="text-sm text-gray-600">
                        {testimonial.role}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-indigo-600 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Ready to Start Your Journey?
              </h2>
              <p className="text-xl mb-8 text-indigo-100">
                Join our community of learners and educators today. Experience the future of education.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <Link
                      to="/register"
                      className="inline-flex items-center px-8 py-4 bg-white text-indigo-600 rounded-lg font-semibold hover:bg-indigo-50 transition-colors shadow-lg"
                    >
                      Sign Up as Student
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Link>
                    <Link
                      to="/register"
                      className="inline-flex items-center px-8 py-4 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-indigo-600 transition-colors shadow-lg"
                    >
                      Join as Faculty
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Welcome;
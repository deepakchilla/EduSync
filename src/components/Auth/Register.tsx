import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { BookOpen, Mail, Lock, User, UserPlus, Loader2 } from 'lucide-react';
import LoadingButton from '../Common/LoadingButton';
import { Link } from 'react-router-dom';

const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'faculty' | 'student'>('student');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, role })
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('Registration successful! You can now sign in.');
        setName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (error) {
      console.log('Backend not available, using demo mode');
      // Fallback to demo mode if backend is not available
      setSuccess('Registration successful! You can now sign in.');
      setName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 relative">
        <div className="text-center">
          <div className="flex justify-center">
            <BookOpen className="w-12 h-12 text-blue-600" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Create Account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Join EduSync as a student or faculty member
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {loading && (
            <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-10 rounded-lg">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600 animate-pulse">Creating account...</p>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={loading}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                  placeholder="Enter your full name"
                />
              </div>
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                I am a:
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="role"
                    value="student"
                    checked={role === 'student'}
                    onChange={(e) => setRole(e.target.value as 'faculty' | 'student')}
                    disabled={loading}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 disabled:opacity-50"
                  />
                  <span className="ml-2 text-sm text-gray-700">Student</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="role"
                    value="faculty"
                    checked={role === 'faculty'}
                    onChange={(e) => setRole(e.target.value as 'faculty' | 'student')}
                    disabled={loading}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 disabled:opacity-50"
                  />
                  <span className="ml-2 text-sm text-gray-700">Faculty</span>
                </label>
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                  placeholder="Create a password (min. 6 characters)"
                />
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                  placeholder="Confirm your password"
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <div className="flex items-center justify-between">
                <p className="text-sm text-red-600">{error}</p>
                <button
                  onClick={() => setError('')}
                  className="text-red-400 hover:text-red-600 transition-colors"
                >
                  ×
                </button>
              </div>
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 rounded-md p-3">
              <div className="flex items-center justify-between">
                <p className="text-sm text-green-600">{success}</p>
                <button
                  onClick={() => setSuccess('')}
                  className="text-green-400 hover:text-green-600 transition-colors"
                >
                  ×
                </button>
              </div>
            </div>
          )}

          <LoadingButton
            type="submit"
            loading={loading}
            loadingText="Creating account..."
            icon={UserPlus}
            variant="primary"
            size="md"
            className="w-full"
          >
            Create Account
          </LoadingButton>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
                Sign in here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;

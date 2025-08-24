import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ResourceProvider } from './contexts/ResourceContext';
import { SearchProvider } from './contexts/SearchContext';
import Navigation from './components/Navigation/Navigation';
import Footer from './components/Layout/Footer';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from './components/Dashboard/Dashboard';
import Profile from './components/Profile/Profile';
import About from './components/About/About';
import Contact from './components/Contact/Contact';
import Welcome from './components/Welcome/Welcome';
import FacultyDashboard from './components/Faculty/FacultyDashboard';
import StudentDashboard from './components/Student/StudentDashboard';
import ResourceManagement from './components/Faculty/ResourceManagement';
import UploadResource from './components/Faculty/UploadResource';
import EditResource from './components/Faculty/EditResource';
import ErrorBoundary from './components/Common/ErrorBoundary';

const ProtectedRoute: React.FC<{ 
  children: React.ReactNode; 
  allowedRole?: 'faculty' | 'student' 
}> = ({ children, allowedRole }) => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to={user.role === 'faculty' ? '/faculty' : '/student'} />;
  }
  
  return <>{children}</>;
};

const AppContent: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {user && <Navigation />}
      <main className={`flex-1 ${user ? 'pt-16' : ''}`}>
        <ErrorBoundary>
        <Routes>
            <Route 
              path="/welcome" 
              element={<Welcome />} 
            />
            <Route 
              path="/about" 
              element={<About />} 
            />
            <Route 
              path="/contact" 
              element={<Contact />} 
            />
          <Route 
            path="/login" 
              element={!user ? <Login /> : <Navigate to="/dashboard" />} 
            />
            <Route 
              path="/register" 
              element={!user ? <Register /> : <Navigate to="/dashboard" />} 
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
          />
          <Route
            path="/faculty"
            element={
              <ProtectedRoute allowedRole="faculty">
                <FacultyDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/faculty/resources"
            element={
              <ProtectedRoute allowedRole="faculty">
                <ResourceManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/faculty/upload"
            element={
              <ProtectedRoute allowedRole="faculty">
                <UploadResource />
              </ProtectedRoute>
            }
          />
          <Route
            path="/faculty/edit/:id"
            element={
              <ProtectedRoute allowedRole="faculty">
                <EditResource />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student"
            element={
              <ProtectedRoute allowedRole="student">
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/"
            element={
              user ? (
                  <Navigate to="/dashboard" />
              ) : (
                  <Navigate to="/welcome" />
              )
            }
          />
        </Routes>
        </ErrorBoundary>
      </main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <ResourceProvider>
          <SearchProvider>
            <Router>
              <AppContent />
            </Router>
          </SearchProvider>
        </ResourceProvider>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;
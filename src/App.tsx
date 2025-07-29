import React, { useState } from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import AttendanceHistory from './components/Attendance/AttendanceHistory';
import LoginForm from './components/Auth/LoginForm';
import DashboardStats from './components/Dashboard/DashboardStats';
import { Employee } from './components/Employees/Employee';
import Sidebar from './components/Layout/Sidebar';
import LeaveManagement from './components/Leaves/LeaveManagement';
import UserProfile from './components/Profile/UserProfile';
import PublicLayout from './components/Public/PublicLayout';
import TimeClock from './components/TimeClock/TimeClock';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';

const DashboardApp: React.FC = () => {
  const { user, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user.name}!</h1>
              <p className="text-gray-600">Here's your attendance overview for this month.</p>
            </div>
            <DashboardStats />
          </div>
        );
      case 'clock':
        return <TimeClock />;
      case 'attendance':
        return <AttendanceHistory />;
      case 'leaves':
        return <LeaveManagement />;
      case 'profile':
        return <UserProfile />;
      case 'employees':
        return <Employee/>
      default:
        return (
          <div className="text-center py-12">
            <p className="text-gray-600">Feature coming soon!</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          <div className="container mx-auto px-6 py-8">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

const AppContent: React.FC = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<HomePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="register" element={<RegisterPage />} />
        </Route>
        
        {/* Auth Routes */}
        <Route 
          path="/login" 
          element={user ? <Navigate to="/dashboard" replace /> : <LoginForm />} 
        />
        
        {/* Protected Dashboard Routes */}
        <Route 
          path="/dashboard/*" 
          element={user ? <DashboardApp /> : <Navigate to="/login" replace />} 
        />
        
        {/* Redirect old routes */}
        <Route path="/app" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
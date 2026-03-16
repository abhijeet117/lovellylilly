import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './features/auth/hooks/useAuth';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './features/auth/pages/LoginPage';
import SignupPage from './features/auth/pages/SignupPage';
import VerifyEmailPage from './features/auth/pages/VerifyEmailPage';
import ForgotPasswordPage from './features/auth/pages/ForgotPasswordPage';
import ResetPasswordPage from './features/auth/pages/ResetPasswordPage';
import DashboardPage from './features/chat/pages/DashboardPage';
import ImageStudioPage from './features/studio/pages/ImageStudioPage';
import VideoStudioPage from './features/studio/pages/VideoStudioPage';
import WebsiteBuilderPage from './features/studio/pages/WebsiteBuilderPage';
import DocumentVaultPage from './features/documents/pages/DocumentVaultPage';
import SettingsPage from './features/user/pages/SettingsPage';
import AdminDashboard from './features/admin/pages/AdminDashboard';

// Components
import AppShell from './components/layout/AppShell';

// Helpers
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null; // Or a full-screen loader
  return user ? children : <Navigate to="/login" replace />;
};

const PlaceholderPage = ({ title }) => (
  <AppShell>
    <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)]">
      <h1 className="text-h1 gradient-text">{title}</h1>
      <p className="text-text-secondary mt-4">This page is under construction.</p>
    </div>
  </AppShell>
);

function App() {
  const { loading } = useAuth();

  if (loading) {
     return (
        <div className="min-h-screen bg-bg-base flex items-center justify-center">
           <div className="w-12 h-12 border-4 border-brand-primary/20 border-t-brand-primary rounded-full animate-spin" />
        </div>
     );
  }

  return (
    <Router>
      <Toaster 
        position="top-right" 
        toastOptions={{
          style: {
            background: '#131824',
            color: '#EDF0FF',
            border: '1px solid #222840',
            borderRadius: '10px',
            padding: '12px 16px',
            fontSize: '14px',
          },
          success: {
            iconTheme: {
              primary: '#22D3A0',
              secondary: '#131824',
            },
          },
          error: {
            iconTheme: {
              primary: '#FF4F6A',
              secondary: '#131824',
            },
          },
        }}
      />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />

        {/* Protected Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        } />
        
        <Route path="/studio/image" element={
          <ProtectedRoute>
            <ImageStudioPage />
          </ProtectedRoute>
        } />
        
        <Route path="/studio/video" element={
          <ProtectedRoute>
            <VideoStudioPage />
          </ProtectedRoute>
        } />
        
        <Route path="/studio/website" element={
          <ProtectedRoute>
            <WebsiteBuilderPage />
          </ProtectedRoute>
        } />
        
        <Route path="/documents" element={
          <ProtectedRoute>
            <DocumentVaultPage />
          </ProtectedRoute>
        } />
        
        <Route path="/settings" element={
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        } />
        
        {/* Admin Route */}
        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        } />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;

import React, { useEffect, useLayoutEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './features/auth/hooks/useAuth';
import { destroyLenis, getLenis, initLenis, scrollToTarget } from './lib/animations/lenis';

// Pages
import LandingPage from './pages/LandingPage';
import ProductPage from './pages/ProductPage';
import FeaturesPage from './pages/FeaturesPage';
import PricingPage from './pages/PricingPage';
import ChangelogPage from './pages/ChangelogPage';
import ApiDocsPage from './pages/ApiDocsPage';
import AboutPage from './pages/AboutPage';
import BlogPage from './pages/BlogPage';
import CareersPage from './pages/CareersPage';
import PressPage from './pages/PressPage';
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
import SeoAnalysisPage from './features/seo/pages/SeoAnalysisPage';

// Components
import AppShell from './components/layout/AppShell';
import CustomCursor from './components/ui/CustomCursor';

// ── Error Boundary ────────────────────────────────────────────────────────────
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    console.error('[ErrorBoundary]', error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh', background: 'var(--clr-bg)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          gap: '16px', padding: '24px', textAlign: 'center',
        }}>
          <div style={{ fontSize: '40px' }}>⚠️</div>
          <h2 style={{ fontFamily: 'var(--f-groote)', fontSize: '24px', color: 'var(--clr-text)' }}>
            Something went wrong
          </h2>
          <p style={{ fontFamily: 'var(--f-lunchtype)', fontSize: '14px', color: 'var(--clr-muted)', maxWidth: '380px' }}>
            {this.state.error?.message || 'An unexpected error occurred.'}
          </p>
          <button
            onClick={() => { this.setState({ hasError: false, error: null }); window.location.href = '/'; }}
            style={{
              padding: '10px 24px', background: 'var(--clr-accent)', color: 'var(--clr-bg)',
              border: 'none', borderRadius: '6px', cursor: 'pointer',
              fontFamily: 'var(--f-lunchtype)', fontSize: '14px', fontWeight: 600,
            }}
          >
            Return Home
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// ── Auth Loading Screen ───────────────────────────────────────────────────────
const AuthLoadingScreen = () => (
  <div style={{
    minHeight: '100vh', background: 'var(--clr-bg)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  }}>
    <div style={{
      width: 44, height: 44,
      border: '3px solid color-mix(in srgb, var(--clr-accent) 25%, transparent)',
      borderTopColor: 'var(--clr-accent)',
      borderRadius: '50%',
      animation: 'spin 0.8s linear infinite',
    }} />
  </div>
);

// ── Protected Route ───────────────────────────────────────────────────────────
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <AuthLoadingScreen />;
  return user ? children : <Navigate to="/login" replace />;
};

// ── Placeholder (under construction) ────────────────────────────────────────
const PlaceholderPage = ({ title }) => (
  <AppShell>
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '12px', textAlign: 'center', padding: '24px' }}>
      <h1 style={{ fontFamily: 'var(--f-groote)', fontSize: 'clamp(28px,5vw,48px)', color: 'var(--clr-text)' }}>{title}</h1>
      <p style={{ color: 'var(--clr-muted)', fontFamily: 'var(--f-lunchtype)' }}>This page is under construction.</p>
    </div>
  </AppShell>
);

// ── App ───────────────────────────────────────────────────────────────────────
function App() {
  useLayoutEffect(() => {
    initLenis();
    return () => { destroyLenis(); };
  }, []);

  useEffect(() => {
    const onAnchorClick = (event) => {
      if (!(event.target instanceof Element)) return;
      const anchor = event.target.closest('a[href^="#"]');
      if (!anchor) return;
      const href = anchor.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (!target || !getLenis()) return;
      event.preventDefault();
      scrollToTarget(href, { offset: -80 });
    };
    document.addEventListener('click', onAnchorClick);
    return () => { document.removeEventListener('click', onAnchorClick); };
  }, []);

  return (
    <Router>
      <ErrorBoundary>
        <CustomCursor />
        <div id="scroll-progress" />

        {/* Theme-aware toast — reads CSS vars from document root */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: 'var(--toast-bg, var(--clr-surface))',
              color: 'var(--toast-text, var(--clr-text))',
              border: '1px solid var(--toast-border, var(--clr-border))',
              borderRadius: '8px',
              padding: '12px 16px',
              fontSize: '14px',
              fontFamily: 'var(--f-lunchtype)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
            },
            success: { iconTheme: { primary: 'var(--color-success)', secondary: 'var(--clr-bg)' } },
            error:   { iconTheme: { primary: 'var(--color-danger)',  secondary: 'var(--clr-bg)' } },
          }}
        />

        <Routes>
          {/* Public */}
          <Route path="/"                       element={<LandingPage />} />
          <Route path="/product"                element={<ProductPage />} />
          <Route path="/features"               element={<FeaturesPage />} />
          <Route path="/pricing"                element={<PricingPage />} />
          <Route path="/changelog"              element={<ChangelogPage />} />
          <Route path="/api-docs"               element={<ApiDocsPage />} />
          <Route path="/about"                  element={<AboutPage />} />
          <Route path="/blog"                   element={<BlogPage />} />
          <Route path="/careers"                element={<CareersPage />} />
          <Route path="/press"                  element={<PressPage />} />
          <Route path="/login"                  element={<LoginPage />} />
          <Route path="/signup"                 element={<SignupPage />} />
          <Route path="/forgot-password"        element={<ForgotPasswordPage />} />
          <Route path="/reset-password/:token"  element={<ResetPasswordPage />} />
          <Route path="/verify-email"           element={<VerifyEmailPage />} />
          <Route path="/verify-email/:token"    element={<VerifyEmailPage />} />

          {/* Protected */}
          <Route path="/dashboard"      element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/studio/image"   element={<ProtectedRoute><ImageStudioPage /></ProtectedRoute>} />
          <Route path="/studio/video"   element={<ProtectedRoute><VideoStudioPage /></ProtectedRoute>} />
          <Route path="/studio/website" element={<ProtectedRoute><WebsiteBuilderPage /></ProtectedRoute>} />
          <Route path="/documents"      element={<ProtectedRoute><DocumentVaultPage /></ProtectedRoute>} />
          <Route path="/settings"       element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
          <Route path="/seo"            element={<ProtectedRoute><SeoAnalysisPage /></ProtectedRoute>} />
          <Route path="/admin"          element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ErrorBoundary>
    </Router>
  );
}

export default App;

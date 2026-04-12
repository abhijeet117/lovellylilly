import React from 'react';

/**
 * React Error Boundary
 * Catches JS errors anywhere in the child component tree and shows a fallback UI
 * instead of crashing the entire application.
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // In production you'd send this to an error tracking service (e.g. Sentry)
    console.error('[ErrorBoundary] Uncaught error:', error, info.componentStack);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    // Optionally navigate home
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--clr-bg, #0a0a0a)',
          padding: '32px',
          textAlign: 'center',
        }}>
          <div style={{
            maxWidth: '480px',
            padding: '40px',
            background: 'var(--clr-card, #111)',
            border: '1px solid var(--clr-border, #222)',
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
            <h1 style={{
              fontFamily: 'var(--f-syne, sans-serif)',
              fontSize: '22px',
              color: 'var(--clr-text, #fff)',
              marginBottom: '12px',
            }}>
              Something went wrong
            </h1>
            <p style={{
              fontSize: '13px',
              color: 'var(--clr-muted, #888)',
              fontFamily: 'var(--f-lunchtype, sans-serif)',
              marginBottom: '24px',
              lineHeight: '1.6',
            }}>
              An unexpected error occurred. Please try refreshing the page.
              {import.meta.env.DEV && this.state.error && (
                <span>
                  <br /><br />
                  <code style={{ fontSize: '11px', color: '#ef4444', wordBreak: 'break-all' }}>
                    {this.state.error.message}
                  </code>
                </span>
              )}
            </p>
            <button
              onClick={this.handleReset}
              style={{
                padding: '10px 24px',
                background: 'var(--clr-accent, #7c3aed)',
                color: '#fff',
                border: 'none',
                fontSize: '14px',
                fontFamily: 'var(--f-lunchtype, sans-serif)',
                cursor: 'pointer',
              }}
            >
              Go to Home
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

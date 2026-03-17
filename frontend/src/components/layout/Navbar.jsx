import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../features/auth/hooks/useAuth';
import ThemeSwitcher from '../ui/ThemeSwitcher';
import './Navbar.css';

const Navbar = ({ onToggleSidebar, showSidebar = false }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isLanding = location.pathname === '/';
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const closeMobile = () => setMobileOpen(false);

  return (
    <>
      <nav id="nav" className={`${scrolled ? 'scrolled' : ''}`}>
        {/* Left: Logo + Sidebar toggle */}
        <div className="nav-l">
          {showSidebar && (
            <button
              onClick={onToggleSidebar}
              className="ham"
              aria-label="Toggle sidebar"
            >
              <svg viewBox="0 0 24 24"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            </button>
          )}
          <Link to="/" className="nav-logo">
            Lovelly<em>Lilly</em>
          </Link>
        </div>

        {/* Center: Landing nav links */}
        {isLanding && (
          <ul className="nav-links">
            {[
              { label: 'Features', href: '#features' },
              { label: 'How It Works', href: '#how' },
              { label: 'Pricing', href: '#pricing' },
              { label: 'About', href: '#about' },
            ].map(link => (
              <li key={link.label}>
                <a href={link.href}>{link.label}</a>
              </li>
            ))}
          </ul>
        )}

        {/* Right: Swatches + CTAs */}
        <div className="nav-r">
          <div className="swatches swatches-desktop">
            <ThemeSwitcher />
          </div>
          
          {isLanding && !user && (
            <div className="nav-cta-btns">
              <button className="btn-ghost-sm" onClick={() => navigate('/login')}>
                Sign In
              </button>
              <button className="btn-solid-sm" onClick={() => navigate('/signup')}>
                Get Started
              </button>
            </div>
          )}

          {user && !isLanding && (
            <div className="nav-cta-btns">
              <button className="btn-ghost-sm" onClick={() => navigate('/settings')}>
                Settings
              </button>
            </div>
          )}

          {/* Hamburger for mobile */}
          <button
            className="ham"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            {mobileOpen ? (
              <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            ) : (
              <svg viewBox="0 0 24 24"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <div className={`mob-drawer ${mobileOpen ? 'open' : ''}`}>
        {isLanding && (
          <>
            <a className="mob-lnk" href="#features" onClick={closeMobile}>Features</a>
            <a className="mob-lnk" href="#how" onClick={closeMobile}>How It Works</a>
            <a className="mob-lnk" href="#pricing" onClick={closeMobile}>Pricing</a>
            <a className="mob-lnk" href="#about" onClick={closeMobile}>About</a>
          </>
        )}
        {!isLanding && (
          <>
            <a className="mob-lnk" onClick={() => { navigate('/dashboard'); closeMobile(); }}>Dashboard</a>
            <a className="mob-lnk" onClick={() => { navigate('/settings'); closeMobile(); }}>Settings</a>
          </>
        )}
        <div className="mob-swatches">
          <ThemeSwitcher />
        </div>
        {isLanding && !user && (
          <div className="mob-actions">
            <button className="btn-ghost-sm" onClick={() => { navigate('/login'); closeMobile(); }}>Sign In</button>
            <button className="btn-solid-sm" onClick={() => { navigate('/signup'); closeMobile(); }}>Get Started</button>
          </div>
        )}
      </div>
    </>
  );
};

export default Navbar;

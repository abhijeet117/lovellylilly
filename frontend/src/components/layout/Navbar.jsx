import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../features/auth/hooks/useAuth';
import { useAnimationConfig } from '../../lib/animations/useAnimationConfig';
import ThemeSwitcher from '../ui/ThemeSwitcher';
import './Navbar.css';

const NAV_LINKS = [
  { label: 'Features', href: '#features', section: 'features' },
  { label: 'How It Works', href: '#how', section: 'how' },
  { label: 'Pricing', href: '#pricing', section: 'pricing' },
  { label: 'About', href: '#about', section: 'about' },
  { label: 'Contact', href: '#cta', section: 'cta' },
];

const Navbar = ({ onToggleSidebar, showSidebar = false }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const animation = useAnimationConfig();
  const isLanding = location.pathname === '/';
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const sections = ['hero', ...NAV_LINKS.map((link) => link.section)];

    const onScroll = () => {
      setScrolled(window.scrollY > 24);

      if (!isLanding) return;

      let currentSection = '';
      sections.forEach((sectionId) => {
        const section = document.getElementById(sectionId);
        if (section && section.getBoundingClientRect().top <= 120) {
          currentSection = sectionId;
        }
      });

      setActiveSection(currentSection);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    return () => window.removeEventListener('scroll', onScroll);
  }, [isLanding]);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 768) {
        setMobileOpen(false);
      }
    };
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
    }
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const closeMobile = () => {
    setMobileOpen(false);
  };

  return (
      <>
      <nav id="nav" data-nav className={`${scrolled ? 'scrolled' : ''}`}>
        {showSidebar && !isLanding && (
          <button
            onClick={onToggleSidebar}
            className="ham"
            aria-label="Toggle sidebar"
          >
            <svg viewBox="0 0 24 24"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          </button>
        )}

        <a
          className="nav-logo"
          href={isLanding ? '#hero' : '/'}
          onClick={(e) => {
            if (!isLanding) {
              e.preventDefault();
              navigate('/');
            }
          }}
        >
          Lovelly<em>Lilly</em>
        </a>

        {isLanding && (
          <ul className="nav-links" id="nav-links">
            {NAV_LINKS.map((link) => (
              <li key={link.label} className="motion-nav-shell">
                <motion.a
                  href={link.href}
                  data-s={link.section}
                  className={`motion-nav-link ${activeSection === link.section ? 'active' : ''}`}
                  onClick={closeMobile}
                  variants={animation.navLinkInteraction}
                  initial="rest"
                  animate="rest"
                  whileHover={animation.reducedMotion ? undefined : { y: -1, opacity: 0.6 }}
                  whileTap={animation.reducedMotion ? undefined : { scale: 0.96 }}
                  transition={animation.reducedMotion ? { duration: 0 } : { duration: 0.15 }}
                >
                  {link.label}
                  {activeSection === link.section && (
                    <motion.span
                      layoutId="nav-line"
                      className="motion-nav-underline"
                      transition={{ ...animation.transitions.snappy, restDelta: 0.001 }}
                    />
                  )}
                </motion.a>
              </li>
            ))}
          </ul>
        )}

        <div className="nav-r">
          {isLanding && (
            <div aria-hidden="true" style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              {[0, 1, 2].map((dot) => (
                <motion.span
                  key={dot}
                  data-nav-dot
                  style={{ width: '6px', height: '6px', borderRadius: '999px', background: 'var(--clr-accent)' }}
                  initial={animation.reducedMotion ? false : { scale: 0 }}
                  animate={animation.reducedMotion ? undefined : { scale: 1 }}
                  transition={
                    animation.reducedMotion
                      ? { duration: 0 }
                      : {
                          ...animation.transitions.snappy,
                          delay: dot * 0.08,
                        }
                  }
                />
              ))}
            </div>
          )}

          <ThemeSwitcher id="swatches" className="swatches-desktop" />

          {isLanding && !user && (
            <div className="nav-cta-btns" style={{ display: 'flex', gap: '10px' }}>
              <a
                className="btn-ghost-sm"
                id="btn-login"
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/login');
                }}
              >
                Sign In
              </a>
              <motion.a
                className="btn-solid-sm get-started-btn"
                id="btn-reg"
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/signup');
                }}
                whileHover={animation.reducedMotion ? undefined : { scale: 1.04 }}
                whileTap={animation.reducedMotion ? undefined : { scale: 0.93 }}
                transition={animation.reducedMotion ? { duration: 0 } : animation.transitions.snappy}
              >
                Get Started
              </motion.a>
            </div>
          )}

          {user && !isLanding && (
            <div className="nav-cta-btns" style={{ display: 'flex', gap: '10px' }}>
              <a
                className="btn-ghost-sm"
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/settings');
                }}
              >
                Settings
              </a>
            </div>
          )}

          {isLanding && (
            <button
              className="ham"
              id="ham"
              onClick={() => setMobileOpen((prev) => !prev)}
              aria-label="Menu"
            >
              <motion.svg viewBox="0 0 24 24" id="ham-ico" initial={false} animate={mobileOpen ? 'open' : 'closed'}>
                <motion.line
                  x1="3"
                  y1="6"
                  x2="21"
                  y2="6"
                  variants={{
                    closed: { rotate: 0, y: 0, transformOrigin: 'center' },
                    open: { rotate: 45, y: 6, transformOrigin: 'center' },
                  }}
                  transition={animation.transitions.heavy}
                />
                <motion.line
                  x1="3"
                  y1="12"
                  x2="21"
                  y2="12"
                  variants={{
                    closed: { opacity: 1, scaleX: 1, transformOrigin: 'center' },
                    open: { opacity: 0, scaleX: 0, transformOrigin: 'center' },
                  }}
                  transition={animation.transitions.heavy}
                />
                <motion.line
                  x1="3"
                  y1="18"
                  x2="21"
                  y2="18"
                  variants={{
                    closed: { rotate: 0, y: 0, transformOrigin: 'center' },
                    open: { rotate: -45, y: -6, transformOrigin: 'center' },
                  }}
                  transition={animation.transitions.heavy}
                />
              </motion.svg>
            </button>
          )}
        </div>
      </nav>

      {isLanding && (
        <AnimatePresence mode="wait">
          {mobileOpen && (
            <>
              <motion.div
                className="mob-drawer open"
                id="mob-drawer"
                aria-hidden={!mobileOpen}
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={animation.mobileMenu}
              >
                {NAV_LINKS.map((link, index) => (
                  <motion.a
                    key={link.section}
                    className="mob-lnk motion-mobile-link"
                    href={link.href}
                    onClick={closeMobile}
                    custom={index}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={animation.drawerItem}
                  >
                    {link.label}
                  </motion.a>
                ))}

                <motion.div
                  style={{ display: 'flex', gap: '8px', paddingTop: '14px' }}
                  custom={NAV_LINKS.length}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={animation.drawerItem}
                >
                  <ThemeSwitcher className="mob-swatches-inline" />
                </motion.div>

                {!user && (
                  <motion.div
                    style={{ display: 'flex', gap: '10px', paddingTop: '10px' }}
                    custom={NAV_LINKS.length + 1}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={animation.drawerItem}
                  >
                    <a
                      className="btn-ghost-sm"
                      id="mob-login"
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        navigate('/login');
                        closeMobile();
                      }}
                    >
                      Sign In
                    </a>
                    <a
                      className="btn-solid-sm"
                      id="mob-reg"
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        navigate('/signup');
                        closeMobile();
                      }}
                    >
                      Get Started
                    </a>
                  </motion.div>
                )}
              </motion.div>
              <motion.div
                className="mob-backdrop"
                onClick={closeMobile}
                aria-hidden="true"
                initial={animation.backdrop.hidden}
                animate={animation.backdrop.visible}
                exit={animation.backdrop.exit}
              />
            </>
          )}
        </AnimatePresence>
      )}
    </>
  );
};

export default Navbar;

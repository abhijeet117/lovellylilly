import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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

  useEffect(() => {
    const NAV = document.getElementById('nav')
    const SECS = ['hero','features','how','pricing','about','cta']
    const onNavScroll = () => {
      NAV.classList.toggle('scrolled',window.scrollY>24)
      let cur=''
      SECS.forEach(id=>{
        const el=document.getElementById(id)
        if(el && el.getBoundingClientRect().top<=120) cur=id
      })
      document.querySelectorAll('.nav-links a').forEach(a=>
        a.classList.toggle('active',a.dataset.s===cur)
      )
    }

    window.addEventListener('scroll', onNavScroll, { passive: true })
    onNavScroll()

    return () => {
      window.removeEventListener('scroll', onNavScroll)
    }
  }, [])

  useEffect(() => {
    const DRAWER=document.getElementById('mob-drawer')
    const HAM=document.getElementById('ham')
    let mob=false

    function closeMob(){
      DRAWER.classList.remove('open'); mob=false
      HAM.innerHTML='<svg viewBox="0 0 24 24" style="width:20px;height:20px;stroke:currentColor;fill:none;stroke-width:2;"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>'
    }
    window.closeMob = closeMob

    const onHamClick = () => {
      mob=!mob; DRAWER.classList.toggle('open',mob)
      HAM.innerHTML=mob
        ?'<svg viewBox="0 0 24 24" style="width:20px;height:20px;stroke:currentColor;fill:none;stroke-width:2;"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>'
        :'<svg viewBox="0 0 24 24" style="width:20px;height:20px;stroke:currentColor;fill:none;stroke-width:2;"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>'
    }
    HAM.addEventListener('click', onHamClick)

    return () => {
      HAM.removeEventListener('click', onHamClick)
      if (window.closeMob === closeMob) {
        delete window.closeMob
      }
    }
  }, [])

  const closeMobile = () => {
    setMobileOpen(false);
    if (typeof window.closeMob === 'function') {
      window.closeMob();
    }
  };

  return (
    <>
      <nav id="nav" className={`${scrolled ? 'scrolled' : ''}`}>
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
            {[
              { label: 'Features', href: '#features', section: 'features' },
              { label: 'How It Works', href: '#how', section: 'how' },
              { label: 'Pricing', href: '#pricing', section: 'pricing' },
              { label: 'About', href: '#about', section: 'about' },
              { label: 'Contact', href: '#cta', section: 'cta' },
            ].map((link) => (
              <li key={link.label}>
                <a href={link.href} data-s={link.section} onClick={closeMobile}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        )}

        <div className="nav-r">
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
              <a
                className="btn-solid-sm"
                id="btn-reg"
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/signup');
                }}
              >
                Get Started
              </a>
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

          <button
            className="ham"
            id="ham"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            {mobileOpen ? (
              <svg viewBox="0 0 24 24" id="ham-ico"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            ) : (
              <svg viewBox="0 0 24 24" id="ham-ico"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            )}
          </button>
        </div>
      </nav>

      <div className={`mob-drawer ${mobileOpen ? 'open' : ''}`} id="mob-drawer">
        {isLanding && (
          <>
            <a className="mob-lnk" href="#features" onClick={closeMobile}>Features</a>
            <a className="mob-lnk" href="#how" onClick={closeMobile}>How It Works</a>
            <a className="mob-lnk" href="#pricing" onClick={closeMobile}>Pricing</a>
            <a className="mob-lnk" href="#about" onClick={closeMobile}>About</a>
            <a className="mob-lnk" href="#cta" onClick={closeMobile}>Contact</a>
          </>
        )}
        {!isLanding && (
          <>
            <a className="mob-lnk" href="#" onClick={(e) => { e.preventDefault(); navigate('/dashboard'); closeMobile(); }}>Dashboard</a>
            <a className="mob-lnk" href="#" onClick={(e) => { e.preventDefault(); navigate('/settings'); closeMobile(); }}>Settings</a>
          </>
        )}

        <div style={{ display: 'flex', gap: '8px', paddingTop: '14px' }}>
          <ThemeSwitcher className="mob-swatches-inline" />
        </div>

        {isLanding && !user && (
          <div style={{ display: 'flex', gap: '10px', paddingTop: '10px' }}>
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
          </div>
        )}
      </div>
    </>
  );
};

export default Navbar;

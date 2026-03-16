import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu } from 'lucide-react';
import Logo from '../ui/Logo';
import Button from '../ui/Button';

const Navbar = ({ onToggleSidebar, showSidebar = false }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isLanding = location.pathname === '/';

  return (
    <header className="glass-navbar sticky top-0 z-50 h-16 flex items-center px-6">
      <div className="flex items-center justify-between w-full max-w-[1400px] mx-auto">
        {/* Left */}
        <div className="flex items-center gap-3">
          {showSidebar && (
            <button
              onClick={onToggleSidebar}
              className="text-lunar-gray hover:text-zero-white transition-colors p-1.5 rounded-md hover:bg-corona"
            >
              <Menu size={20} />
            </button>
          )}
          <Link to="/">
            <Logo size={isLanding ? 'md' : 'sm'} />
          </Link>
        </div>

        {/* Center — Landing nav links */}
        {isLanding && (
          <nav className="hidden md:flex items-center gap-8">
            {['Features', 'Studio', 'Docs'].map(link => (
              <a
                key={link}
                href={`#${link.toLowerCase()}`}
                className="text-[14px] text-lunar-gray hover:text-zero-white transition-colors font-medium"
              >
                {link}
              </a>
            ))}
          </nav>
        )}

        {/* Right */}
        <div className="flex items-center gap-3">
          {isLanding ? (
            <>
              <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>
                Sign In
              </Button>
              <Button size="sm" onClick={() => navigate('/signup')}>
                Get Started
              </Button>
            </>
          ) : null}
        </div>
      </div>
    </header>
  );
};

export default Navbar;

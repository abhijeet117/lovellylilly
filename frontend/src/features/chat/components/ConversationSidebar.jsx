import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  PlusSquare, 
  Search, 
  Settings, 
  MessageSquare, 
  MoreHorizontal, 
  Trash2, 
  Edit3,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../auth/hooks/useAuth';
import Button from '../../../components/ui/Button';

const SidebarItem = ({ title, isActive, timestamp, onEdit, onDelete, onClick }) => (
  <div 
    onClick={onClick}
    className={`group relative flex items-center justify-between p-3 rounded-md cursor-pointer transition-all duration-150 ${isActive ? 'bg-bg-chat-user border-l-2 border-brand-primary' : 'hover:bg-bg-hover'}`}
  >
    <div className="flex flex-col flex-1 min-w-0 pr-8">
      <span className={`text-[14px] truncate ${isActive ? 'text-text-primary' : 'text-text-secondary'}`}>{title}</span>
      {timestamp && <span className="text-[12px] text-text-muted mt-1">{timestamp}</span>}
    </div>
    
    <div className="absolute right-2 opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity">
      <button onClick={(e) => { e.stopPropagation(); onEdit(); }} className="p-1 hover:text-brand-primary text-text-muted">
        <Edit3 size={14} />
      </button>
      <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className="p-1 hover:text-semantic-danger text-text-muted">
        <Trash2 size={14} />
      </button>
    </div>
  </div>
);

const Sidebar = ({ isCollapsed, toggleSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <aside className={`fixed top-0 left-0 bottom-0 bg-bg-sidebar border-r border-border-subtle z-40 transition-all duration-300 flex flex-col ${isCollapsed ? 'w-0 -translate-x-full' : 'w-[260px]'}`}>
      {/* Top Section */}
      <div className="p-4 border-b border-border-subtle flex flex-col gap-4">
        <Button className="w-full h-10 justify-start" icon={PlusSquare}>
          New Chat
        </Button>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
          <input 
            type="text" 
            placeholder="Search conversations..."
            className="w-full bg-bg-elevated border border-border-subtle rounded-sm py-2 pl-10 pr-4 text-sm text-text-primary focus:border-brand-primary outline-none transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto p-2 scrollbar-hide">
        <div className="mb-4">
          <div className="px-3 py-2 text-label text-text-muted uppercase tracking-wider">Today</div>
          <SidebarItem title="Researching quantum AI" timestamp="12:45 PM" isActive={true} />
          <SidebarItem title="Website landing page" timestamp="10:30 AM" />
        </div>
        <div>
          <div className="px-3 py-2 text-label text-text-muted uppercase tracking-wider">Yesterday</div>
          <SidebarItem title="Image prompt engineering" timestamp="Mar 14" />
          <SidebarItem title="Business strategy doc" timestamp="Mar 14" />
        </div>
      </div>

      {/* Footer Mini-Profile */}
      <div className="mt-auto p-4 border-t border-border-subtle bg-bg-sidebar">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-brand-gradient flex items-center justify-center text-[12px] font-bold text-white shadow-brand-glow">
            {user?.fullName?.split(' ').map(n => n[0]).join('') || 'US'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-text-primary truncate">{user?.fullName || 'User'}</p>
            <p className="text-[12px] text-text-muted truncate">{user?.email}</p>
          </div>
          <Link to="/settings" className="text-text-muted hover:text-text-primary transition-colors">
            <Settings size={18} />
          </Link>
        </div>
        <button 
          onClick={handleLogout}
          className="w-full text-left text-[12px] text-text-muted hover:text-semantic-danger mt-4 transition-colors"
        >
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

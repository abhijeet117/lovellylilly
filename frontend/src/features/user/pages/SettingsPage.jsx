import React, { useState } from 'react';
import AppShell from '../../../components/layout/AppShell';
import Card   from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Input  from '../../../components/ui/Input';
import { 
  User, 
  Shield, 
  CreditCard, 
  Key, 
  Bell, 
  Smartphone,
  Check,
  ChevronRight,
  LogOut
} from 'lucide-react';
import Badge from '../../../components/ui/Badge';
import { useAuth } from '../../auth/hooks/useAuth';

const SettingsPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'api', label: 'API Keys', icon: Key },
    { id: 'notifications', label: 'Notifications', icon: Bell }
  ];

  return (
    <AppShell>
      <div className="max-w-[1200px] mx-auto p-6 md:p-10">
        <div className="mb-10">
           <h1 className="text-h2 gradient-text mb-2">Settings</h1>
           <p className="text-text-secondary">Manage your account preferences and application settings.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
           {/* Sidebar Navigation */}
           <div className="w-full lg:w-[280px] flex flex-col gap-1">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-sm transition-all text-sm font-medium ${activeTab === tab.id ? 'bg-brand-primary/10 text-brand-primary border-l-2 border-brand-primary' : 'text-text-secondary hover:bg-bg-hover hover:text-text-primary'}`}
                >
                  <tab.icon size={18} />
                  {tab.label}
                </button>
              ))}
              <div className="my-4 border-t border-border-subtle" />
              <button className="flex items-center gap-3 px-4 py-3 rounded-sm text-sm font-medium text-semantic-danger hover:bg-semantic-danger/10 transition-all">
                 <LogOut size={18} />
                 Sign Out
              </button>
           </div>

           {/* Content Area */}
           <div className="flex-1 min-w-0">
              <Card className="p-8">
                 {activeTab === 'profile' && (
                    <div className="space-y-8">
                       <div className="flex items-center justify-between pb-6 border-b border-border-subtle">
                          <div>
                             <h3 className="text-lg font-bold">Public Profile</h3>
                             <p className="text-sm text-text-muted">How others see you on the platform.</p>
                          </div>
                          <Button size="sm">Save Changes</Button>
                       </div>

                       <div className="flex items-center gap-8">
                          <div className="relative group">
                             <div className="w-24 h-24 rounded-full bg-brand-gradient flex items-center justify-center text-2xl font-bold text-white shadow-brand-glow">
                                {user?.fullName?.split(' ').map(n => n[0]).join('') || 'US'}
                             </div>
                             <button className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold">
                                Change
                             </button>
                          </div>
                          <div className="flex-1 flex flex-col gap-1">
                             <p className="text-sm font-bold text-text-primary">Profile Photo</p>
                             <p className="text-xs text-text-muted">JPG, GIF or PNG. Max size 2MB.</p>
                             <div className="flex gap-2 mt-2">
                                <Button variant="ghost" size="sm">Upload Image</Button>
                                <Button variant="ghost" size="sm" className="text-semantic-danger">Remove</Button>
                             </div>
                          </div>
                       </div>

                       <div className="grid md:grid-cols-2 gap-6">
                          <Input label="Full Name" defaultValue={user?.fullName} />
                          <Input label="Email address" defaultValue={user?.email} />
                       </div>

                       <div className="flex flex-col gap-2">
                          <label className="text-[13px] text-text-secondary font-medium">Bio</label>
                          <textarea 
                             className="w-full h-24 bg-bg-elevated border border-border-subtle rounded-sm p-4 text-sm text-text-primary outline-none focus:border-brand-primary"
                             placeholder="A few words about yourself..."
                          />
                       </div>
                    </div>
                 )}

                 {activeTab === 'security' && (
                    <div className="space-y-8">
                       <div className="pb-6 border-b border-border-subtle">
                          <h3 className="text-lg font-bold">Security Settings</h3>
                          <p className="text-sm text-text-muted">Manage your password and account security extensions.</p>
                       </div>

                       <div className="space-y-6">
                          <div className="flex items-center justify-between p-4 bg-bg-elevated rounded-sm">
                             <div className="flex items-center gap-4">
                                <div className="p-3 bg-bg-base rounded-sm border border-border-subtle">
                                   <Smartphone size={20} className="text-text-primary" />
                                </div>
                                <div>
                                   <p className="font-bold text-sm">Two-Factor Authentication</p>
                                   <p className="text-xs text-text-muted">Secure your account with 2FA using your phone.</p>
                                </div>
                             </div>
                             <Button variant="ghost" size="sm">Enable</Button>
                          </div>

                          <div className="flex items-center justify-between p-4 bg-bg-elevated rounded-sm">
                             <div className="flex items-center gap-4">
                                <div className="p-3 bg-bg-base rounded-sm border border-border-subtle">
                                   <Key size={20} className="text-text-primary" />
                                </div>
                                <div>
                                   <p className="font-bold text-sm">Password</p>
                                   <p className="text-xs text-text-muted">Last changed 3 months ago.</p>
                                </div>
                             </div>
                             <Button variant="ghost" size="sm">Change Password</Button>
                          </div>
                       </div>
                    </div>
                 )}

                 {activeTab === 'billing' && (
                    <div className="space-y-8">
                       <div className="pb-6 border-b border-border-subtle">
                          <h3 className="text-lg font-bold">Plan & Billing</h3>
                          <p className="text-sm text-text-muted">Manage your subscription and billing details.</p>
                       </div>
                       
                       <div className="bg-brand-primary/5 border border-brand-primary/20 rounded-lg p-6 flex flex-col md:flex-row justify-between gap-6">
                          <div>
                             <div className="flex items-center gap-2 mb-2">
                                <span className="text-xl font-bold">Free Plan</span>
                                <Badge variant="success">Active</Badge>
                             </div>
                             <p className="text-sm text-text-secondary">Your next billing cycle starts on April 15, 2024.</p>
                          </div>
                          <Button>Upgrade to Pro</Button>
                       </div>
                    </div>
                 )}
                 
                 {/* Other tabs can be added similarly */}
              </Card>
           </div>
        </div>
      </div>
    </AppShell>
  );
};

export default SettingsPage;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppShell from '../../../components/layout/AppShell';
import Card   from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Input  from '../../../components/ui/Input';
import {
  User, Shield, CreditCard, Key, Bell,
  Smartphone, LogOut
} from 'lucide-react';
import Badge from '../../../components/ui/Badge';
import { useAuth } from '../../auth/hooks/useAuth';
import { updateProfile } from '../services/user.api';
import { toast } from 'react-hot-toast';

const SettingsPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [profileName, setProfileName] = useState(user?.name || user?.fullName || '');
  const [profileEmail, setProfileEmail] = useState(user?.email || '');
  const [profileBio, setProfileBio] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSignOut = async () => {
    await logout();
    navigate('/login');
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      await updateProfile({ name: profileName });
      toast.success('Profile updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save');
    } finally {
      setIsSaving(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'api', label: 'API Keys', icon: Key },
    { id: 'notifications', label: 'Notifications', icon: Bell }
  ];

  return (
    <AppShell>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
        <div style={{ marginBottom: '36px' }}>
          <h1 style={{ fontFamily: 'var(--f-groote)', fontSize: 'clamp(28px, 4vw, 40px)', color: 'var(--clr-text)', marginBottom: '6px' }}>
            Settings
          </h1>
          <p style={{ color: 'var(--clr-muted)', fontFamily: 'var(--f-lunchtype)', fontSize: '14px' }}>
            Manage your account preferences and application settings.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '28px', flexDirection: 'row', flexWrap: 'wrap' }}>
          {/* Tab Nav */}
          <div style={{ width: 'min(240px, 100%)', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '10px 14px', border: 'none', cursor: 'pointer',
                  fontFamily: 'var(--f-lunchtype)', fontSize: '14px',
                  background: activeTab === tab.id ? 'var(--clr-card)' : 'transparent',
                  color: activeTab === tab.id ? 'var(--clr-accent)' : 'var(--clr-muted)',
                  borderLeft: activeTab === tab.id ? '2px solid var(--clr-accent)' : '2px solid transparent',
                  transition: 'all 0.15s ease',
                }}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
            <div style={{ margin: '12px 0', borderTop: '1px solid var(--clr-border)' }} />
            <button onClick={handleSignOut} style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '10px 14px', border: 'none', cursor: 'pointer',
              fontFamily: 'var(--f-lunchtype)', fontSize: '14px',
              background: 'transparent', color: 'var(--color-danger)',
            }}>
              <LogOut size={16} /> Sign Out
            </button>
          </div>

          {/* Content */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <Card style={{ padding: '28px' }}>
              {activeTab === 'profile' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '20px', borderBottom: '1px solid var(--clr-border)', marginBottom: '24px' }}>
                    <div>
                      <h3 style={{ fontFamily: 'var(--f-syne)', fontWeight: 700, fontSize: '18px', color: 'var(--clr-text)' }}>Public Profile</h3>
                      <p style={{ fontSize: '13px', color: 'var(--clr-muted)', fontFamily: 'var(--f-lunchtype)' }}>How others see you on the platform.</p>
                    </div>
                    <Button size="sm" onClick={handleSaveProfile} loading={isSaving}>Save Changes</Button>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '24px', flexWrap: 'wrap' }}>
                    <div style={{ position: 'relative' }}>
                      <div style={{
                        width: '80px', height: '80px', borderRadius: '50%',
                        background: 'var(--clr-accent)', display: 'flex',
                        alignItems: 'center', justifyContent: 'center',
                        fontSize: '22px', fontFamily: 'var(--f-doll)', color: 'var(--clr-bg)',
                      }}>
                        {(user?.name || user?.fullName || 'User').split(' ').map(n => n[0]).join('') || 'US'}
                      </div>
                    </div>
                    <div>
                      <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--clr-text)' }}>Profile Photo</p>
                      <p style={{ fontSize: '12px', color: 'var(--clr-muted)' }}>JPG, GIF or PNG. Max 2MB.</p>
                      <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                        <Button variant="ghost" size="sm">Upload</Button>
                        <Button variant="danger" size="sm">Remove</Button>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                    <Input label="Full Name" value={profileName} onChange={(e) => setProfileName(e.target.value)} />
                    <Input label="Email Address" value={profileEmail} onChange={(e) => setProfileEmail(e.target.value)} />
                  </div>

                  <div>
                    <label className="fl" style={{ marginBottom: '6px', display: 'block' }}>Bio</label>
                    <textarea
                      className="fi"
                      style={{ width: '100%', height: '96px', resize: 'none' }}
                      placeholder="A few words about yourself..."
                      value={profileBio}
                      onChange={(e) => setProfileBio(e.target.value)}
                    />
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div>
                  <div style={{ paddingBottom: '20px', borderBottom: '1px solid var(--clr-border)', marginBottom: '24px' }}>
                    <h3 style={{ fontFamily: 'var(--f-syne)', fontWeight: 700, fontSize: '18px', color: 'var(--clr-text)' }}>Security Settings</h3>
                    <p style={{ fontSize: '13px', color: 'var(--clr-muted)', fontFamily: 'var(--f-lunchtype)' }}>Manage your password and account security.</p>
                  </div>
                  {[
                    { icon: Smartphone, title: '2FA', desc: 'Secure with your phone.', action: 'Enable' },
                    { icon: Key, title: 'Password', desc: 'Last changed 3 months ago.', action: 'Change' },
                  ].map((item, i) => (
                    <div key={i} style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: '14px', background: 'var(--clr-surface)', marginBottom: '10px',
                      border: '1px solid var(--clr-border)',
                    }}>
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <item.icon size={18} style={{ color: 'var(--clr-text)' }} />
                        <div>
                          <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--clr-text)' }}>{item.title}</p>
                          <p style={{ fontSize: '12px', color: 'var(--clr-muted)' }}>{item.desc}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">{item.action}</Button>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'billing' && (
                <div>
                  <div style={{ paddingBottom: '20px', borderBottom: '1px solid var(--clr-border)', marginBottom: '24px' }}>
                    <h3 style={{ fontFamily: 'var(--f-syne)', fontWeight: 700, fontSize: '18px', color: 'var(--clr-text)' }}>Plan & Billing</h3>
                    <p style={{ fontSize: '13px', color: 'var(--clr-muted)', fontFamily: 'var(--f-lunchtype)' }}>Manage your subscription.</p>
                  </div>
                  <div style={{
                    padding: '20px',
                    background: 'color-mix(in srgb, var(--clr-accent) 5%, transparent)',
                    border: '1px solid color-mix(in srgb, var(--clr-accent) 20%, transparent)',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px',
                  }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                        <span style={{ fontFamily: 'var(--f-syne)', fontWeight: 700, fontSize: '20px', color: 'var(--clr-text)' }}>Free Plan</span>
                        <Badge variant="success">Active</Badge>
                      </div>
                      <p style={{ fontSize: '13px', color: 'var(--clr-muted)' }}>Next billing: April 15, 2024.</p>
                    </div>
                    <Button>Upgrade to Pro</Button>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  );
};

export default SettingsPage;

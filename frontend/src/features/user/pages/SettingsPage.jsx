import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import AppShell from '../../../components/layout/AppShell';
import Card   from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Input  from '../../../components/ui/Input';
import {
  User, Shield, CreditCard, Key, Bell,
  Smartphone, LogOut, Eye, EyeOff, Copy, RefreshCw,
  CheckCircle, AlertTriangle, Trash2, Upload, Plus
} from 'lucide-react';
import Badge from '../../../components/ui/Badge';
import { useAuth } from '../../auth/hooks/useAuth';
import { updateProfile, changePassword, uploadAvatar, deleteAccount, getApiKeys, createApiKey, deleteApiKey } from '../services/user.api';
import { toast } from 'react-hot-toast';

// ── helpers ────────────────────────────────────────────────────────────────
// (helper removed — keys now generated server-side)

// ── component ──────────────────────────────────────────────────────────────
const SettingsPage = () => {
  const { user, logout, checkAuth } = useAuth();
  const navigate = useNavigate();
  const avatarInputRef = useRef(null);

  // ── active tab ──────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState('profile');

  // ── profile tab state ───────────────────────────────────────────────────
  const [profileName, setProfileName] = useState(user?.name || '');
  const [profileEmail] = useState(user?.email || '');
  const [profileBio, setProfileBio] = useState(user?.bio || '');
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  // ── security tab state ──────────────────────────────────────────────────
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [pwErrors, setPwErrors] = useState({});

  // ── notifications tab state ─────────────────────────────────────────────
  const [notifEmail, setNotifEmail] = useState(user?.preferences?.notifications?.email ?? true);
  const [notifBrowser, setNotifBrowser] = useState(user?.preferences?.notifications?.browser ?? true);
  const [isSavingNotif, setIsSavingNotif] = useState(false);

  // ── API keys tab state ──────────────────────────────────────────────────
  const [apiKeys, setApiKeys] = useState([]);
  const [isLoadingKeys, setIsLoadingKeys] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [isCreatingKey, setIsCreatingKey] = useState(false);
  const [generatedKey, setGeneratedKey] = useState(null); // { fullKey, name }

  // ─────────────────────────────────────────────────────────────────────────

  const handleSignOut = async () => {
    await logout();
    navigate('/login');
  };

  // profile
  const handleSaveProfile = async () => {
    setIsSavingProfile(true);
    try {
      await updateProfile({ name: profileName, bio: profileBio });
      await checkAuth(); // refresh user in AuthContext so Navbar picks up changes
      toast.success('Profile updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save');
    } finally {
      setIsSavingProfile(false);
    }
  };

  // avatar
  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { toast.error('Please select an image file'); return; }
    if (file.size > 2 * 1024 * 1024) { toast.error('Image must be smaller than 2MB'); return; }
    // Show preview immediately
    const reader = new FileReader();
    reader.onload = (ev) => setAvatarPreview(ev.target.result);
    reader.readAsDataURL(file);
    // Upload
    setIsUploadingAvatar(true);
    try {
      await uploadAvatar(file);
      await checkAuth(); // sync avatar into AuthContext so Navbar updates
      toast.success('Avatar updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to upload avatar');
      setAvatarPreview(user?.avatar || null);
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  // account deletion
  const handleDeleteAccount = async () => {
    if (!window.confirm('This will permanently delete your account, all chats, and all data. This CANNOT be undone. Are you absolutely sure?')) return;
    setIsDeletingAccount(true);
    try {
      await deleteAccount();
      toast.success('Account deleted');
      await logout();
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete account');
      setIsDeletingAccount(false);
    }
  };

  // password validation
  const validatePassword = () => {
    const errs = {};
    if (!currentPassword) errs.current = 'Current password is required';
    if (!newPassword) errs.new = 'New password is required';
    else if (newPassword.length < 8) errs.new = 'Password must be at least 8 characters';
    if (!confirmPassword) errs.confirm = 'Please confirm your new password';
    else if (newPassword !== confirmPassword) errs.confirm = 'Passwords do not match';
    setPwErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!validatePassword()) return;
    setIsSavingPassword(true);
    try {
      await changePassword({ currentPassword, newPassword });
      toast.success('Password changed successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setPwErrors({});
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to change password';
      if (msg.toLowerCase().includes('current')) {
        setPwErrors({ current: 'Current password is incorrect' });
      } else {
        toast.error(msg);
      }
    } finally {
      setIsSavingPassword(false);
    }
  };

  // notifications
  const handleSaveNotifications = async () => {
    setIsSavingNotif(true);
    try {
      await updateProfile({
        'preferences.notifications.email': notifEmail,
        'preferences.notifications.browser': notifBrowser,
      });
      toast.success('Notification preferences saved');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save');
    } finally {
      setIsSavingNotif(false);
    }
  };

  // api keys — backed by server
  const fetchApiKeys = useCallback(async () => {
    setIsLoadingKeys(true);
    try {
      const res = await getApiKeys();
      setApiKeys(res.data?.keys || []);
    } catch { /* silently ignore if tab not opened */ }
    finally { setIsLoadingKeys(false); }
  }, []);

  useEffect(() => {
    if (activeTab === 'api') fetchApiKeys();
  }, [activeTab, fetchApiKeys]);

  const handleGenerateKey = async () => {
    if (!newKeyName.trim()) { toast.error('Enter a name for this key'); return; }
    setIsCreatingKey(true);
    try {
      const res = await createApiKey(newKeyName.trim());
      setGeneratedKey({ fullKey: res.data.fullKey, name: res.data.name });
      setNewKeyName('');
      await fetchApiKeys();
      toast.success('API key created');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create key');
    } finally {
      setIsCreatingKey(false);
    }
  };

  const handleDeleteKey = async (id) => {
    try {
      await deleteApiKey(id);
      setApiKeys(prev => prev.filter(k => k.id !== id));
      toast.success('API key revoked');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to revoke key');
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  // strength meter
  const getStrength = (pw) => {
    let score = 0;
    if (pw.length >= 8) score++;
    if (pw.length >= 12) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    return score;
  };
  const strengthColors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#16a34a'];
  const strengthLabels = ['Very weak', 'Weak', 'Fair', 'Strong', 'Very strong'];

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'api', label: 'API Keys', icon: Key },
    { id: 'notifications', label: 'Notifications', icon: Bell }
  ];

  const fieldStyle = { marginBottom: '16px' };
  const labelStyle = { display: 'block', fontSize: '12px', color: 'var(--clr-muted)', marginBottom: '6px', fontFamily: 'var(--f-lunchtype)' };
  const inputWrap = { position: 'relative' };
  const pwInputStyle = {
    width: '100%', padding: '10px 42px 10px 12px', border: '1px solid var(--clr-border)',
    background: 'var(--clr-surface)', color: 'var(--clr-text)', fontSize: '14px',
    fontFamily: 'var(--f-lunchtype)', outline: 'none', boxSizing: 'border-box',
  };
  const eyeBtn = {
    position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)',
    background: 'none', border: 'none', cursor: 'pointer', color: 'var(--clr-muted)', padding: '2px',
  };
  const errorStyle = { fontSize: '11px', color: '#ef4444', marginTop: '4px', fontFamily: 'var(--f-lunchtype)' };
  const sectionHeader = { paddingBottom: '20px', borderBottom: '1px solid var(--clr-border)', marginBottom: '24px' };
  const toggleRow = {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '14px 0', borderBottom: '1px solid var(--clr-border)',
  };

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

              {/* ── PROFILE TAB ── */}
              {activeTab === 'profile' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', ...sectionHeader }}>
                    <div>
                      <h3 style={{ fontFamily: 'var(--f-groote)', fontWeight: 700, fontSize: '18px', color: 'var(--clr-text)' }}>Public Profile</h3>
                      <p style={{ fontSize: '13px', color: 'var(--clr-muted)', fontFamily: 'var(--f-lunchtype)' }}>How others see you on the platform.</p>
                    </div>
                    <Button size="sm" onClick={handleSaveProfile} loading={isSavingProfile}>Save Changes</Button>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '24px', flexWrap: 'wrap' }}>
                    <div style={{ position: 'relative' }}>
                      {avatarPreview ? (
                        <img src={avatarPreview} alt="Avatar" style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--clr-border)' }} />
                      ) : (
                        <div style={{
                          width: '80px', height: '80px', borderRadius: '50%',
                          background: 'var(--clr-accent)', display: 'flex',
                          alignItems: 'center', justifyContent: 'center',
                          fontSize: '22px', fontFamily: 'var(--f-doll)', color: 'var(--clr-bg)',
                        }}>
                          {(user?.name || 'U').split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase()}
                        </div>
                      )}
                      {isUploadingAvatar && (
                        <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <RefreshCw size={16} style={{ color: '#fff', animation: 'spin 1s linear infinite' }} />
                        </div>
                      )}
                    </div>
                    <div>
                      <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--clr-text)' }}>Profile Photo</p>
                      <p style={{ fontSize: '12px', color: 'var(--clr-muted)' }}>JPG, GIF or PNG. Max 2MB.</p>
                      <input type="file" ref={avatarInputRef} accept="image/*" style={{ display: 'none' }} onChange={handleAvatarChange} />
                      <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                        <Button variant="ghost" size="sm" loading={isUploadingAvatar} onClick={() => avatarInputRef.current?.click()}>
                          <Upload size={13} style={{ marginRight: '4px' }} /> {avatarPreview ? 'Change' : 'Upload'}
                        </Button>
                        {avatarPreview && (
                          <Button variant="danger" size="sm" onClick={async () => {
                            try {
                              await updateProfile({ avatar: '' });
                              setAvatarPreview(null);
                              await checkAuth();
                              toast.success('Avatar removed');
                            } catch (err) {
                              toast.error(err.response?.data?.message || 'Failed to remove avatar');
                            }
                          }}>Remove</Button>
                        )}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                    <Input label="Full Name" value={profileName} onChange={(e) => setProfileName(e.target.value)} />
                    <Input label="Email Address" value={profileEmail} disabled style={{ opacity: 0.6 }} />
                  </div>

                  <div>
                    <label style={labelStyle}>Bio</label>
                    <textarea
                      className="fi"
                      style={{ width: '100%', height: '96px', resize: 'none', boxSizing: 'border-box' }}
                      placeholder="A few words about yourself..."
                      value={profileBio}
                      onChange={(e) => setProfileBio(e.target.value)}
                    />
                  </div>
                </div>
              )}

              {/* ── SECURITY TAB ── */}
              {activeTab === 'security' && (
                <div>
                  <div style={sectionHeader}>
                    <h3 style={{ fontFamily: 'var(--f-groote)', fontWeight: 700, fontSize: '18px', color: 'var(--clr-text)' }}>Security Settings</h3>
                    <p style={{ fontSize: '13px', color: 'var(--clr-muted)', fontFamily: 'var(--f-lunchtype)' }}>Manage your password and account security.</p>
                  </div>

                  {/* Change Password Form */}
                  <div style={{ marginBottom: '32px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                      <Shield size={16} style={{ color: 'var(--clr-accent)' }} />
                      <h4 style={{ fontFamily: 'var(--f-groote)', fontWeight: 600, fontSize: '15px', color: 'var(--clr-text)' }}>Change Password</h4>
                    </div>

                    <form onSubmit={handleChangePassword} style={{ maxWidth: '440px' }}>
                      {/* Current password */}
                      <div style={fieldStyle}>
                        <label style={labelStyle}>Current Password</label>
                        <div style={inputWrap}>
                          <input
                            type={showCurrent ? 'text' : 'password'}
                            value={currentPassword}
                            onChange={(e) => { setCurrentPassword(e.target.value); setPwErrors(p => ({ ...p, current: '' })); }}
                            placeholder="Enter current password"
                            style={{ ...pwInputStyle, borderColor: pwErrors.current ? '#ef4444' : 'var(--clr-border)' }}
                            autoComplete="current-password"
                          />
                          <button type="button" style={eyeBtn} onClick={() => setShowCurrent(v => !v)}>
                            {showCurrent ? <EyeOff size={14} /> : <Eye size={14} />}
                          </button>
                        </div>
                        {pwErrors.current && <p style={errorStyle}>{pwErrors.current}</p>}
                      </div>

                      {/* New password */}
                      <div style={fieldStyle}>
                        <label style={labelStyle}>New Password</label>
                        <div style={inputWrap}>
                          <input
                            type={showNew ? 'text' : 'password'}
                            value={newPassword}
                            onChange={(e) => { setNewPassword(e.target.value); setPwErrors(p => ({ ...p, new: '' })); }}
                            placeholder="At least 8 characters"
                            style={{ ...pwInputStyle, borderColor: pwErrors.new ? '#ef4444' : 'var(--clr-border)' }}
                            autoComplete="new-password"
                          />
                          <button type="button" style={eyeBtn} onClick={() => setShowNew(v => !v)}>
                            {showNew ? <EyeOff size={14} /> : <Eye size={14} />}
                          </button>
                        </div>
                        {pwErrors.new && <p style={errorStyle}>{pwErrors.new}</p>}
                        {/* Strength meter */}
                        {newPassword.length > 0 && (
                          <div style={{ marginTop: '8px' }}>
                            <div style={{ display: 'flex', gap: '4px', marginBottom: '4px' }}>
                              {[1,2,3,4,5].map(i => (
                                <div key={i} style={{
                                  flex: 1, height: '3px',
                                  background: i <= getStrength(newPassword) ? strengthColors[getStrength(newPassword) - 1] : 'var(--clr-border)',
                                  transition: 'background 0.2s',
                                }} />
                              ))}
                            </div>
                            <p style={{ fontSize: '11px', color: strengthColors[getStrength(newPassword) - 1] || 'var(--clr-muted)' }}>
                              {strengthLabels[getStrength(newPassword) - 1] || 'Enter a password'}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Confirm password */}
                      <div style={fieldStyle}>
                        <label style={labelStyle}>Confirm New Password</label>
                        <div style={inputWrap}>
                          <input
                            type={showConfirm ? 'text' : 'password'}
                            value={confirmPassword}
                            onChange={(e) => { setConfirmPassword(e.target.value); setPwErrors(p => ({ ...p, confirm: '' })); }}
                            placeholder="Repeat new password"
                            style={{ ...pwInputStyle, borderColor: pwErrors.confirm ? '#ef4444' : 'var(--clr-border)' }}
                            autoComplete="new-password"
                          />
                          <button type="button" style={eyeBtn} onClick={() => setShowConfirm(v => !v)}>
                            {showConfirm ? <EyeOff size={14} /> : <Eye size={14} />}
                          </button>
                        </div>
                        {pwErrors.confirm && <p style={errorStyle}>{pwErrors.confirm}</p>}
                        {confirmPassword && newPassword === confirmPassword && (
                          <p style={{ ...errorStyle, color: '#22c55e', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <CheckCircle size={11} /> Passwords match
                          </p>
                        )}
                      </div>

                      <Button type="submit" loading={isSavingPassword} style={{ marginTop: '4px' }}>
                        Update Password
                      </Button>
                    </form>
                  </div>

                  {/* Divider */}
                  <div style={{ borderTop: '1px solid var(--clr-border)', marginBottom: '24px' }} />

                  {/* 2FA placeholder */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px', background: 'var(--clr-surface)', border: '1px solid var(--clr-border)' }}>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <Smartphone size={18} style={{ color: 'var(--clr-text)' }} />
                      <div>
                        <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--clr-text)' }}>Two-Factor Authentication</p>
                        <p style={{ fontSize: '12px', color: 'var(--clr-muted)' }}>Add an extra layer of security to your account.</p>
                      </div>
                    </div>
                    <Badge variant="warning">Coming soon</Badge>
                  </div>

                  {/* Danger zone */}
                  <div style={{ marginTop: '32px', borderTop: '1px solid var(--clr-border)', paddingTop: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                      <AlertTriangle size={16} style={{ color: '#ef4444' }} />
                      <h4 style={{ fontFamily: 'var(--f-groote)', fontWeight: 600, fontSize: '14px', color: '#ef4444' }}>Danger Zone</h4>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px', border: '1px solid #ef444430', background: '#ef444408' }}>
                      <div>
                        <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--clr-text)' }}>Delete Account</p>
                        <p style={{ fontSize: '12px', color: 'var(--clr-muted)' }}>Permanently delete your account and all your data. This cannot be undone.</p>
                      </div>
                      <Button variant="danger" size="sm" loading={isDeletingAccount} onClick={handleDeleteAccount}>
                        <Trash2 size={13} style={{ marginRight: '4px' }} /> Delete
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* ── BILLING TAB ── */}
              {activeTab === 'billing' && (
                <div>
                  <div style={sectionHeader}>
                    <h3 style={{ fontFamily: 'var(--f-groote)', fontWeight: 700, fontSize: '18px', color: 'var(--clr-text)' }}>Plan & Billing</h3>
                    <p style={{ fontSize: '13px', color: 'var(--clr-muted)', fontFamily: 'var(--f-lunchtype)' }}>Manage your subscription and billing details.</p>
                  </div>
                  <div style={{
                    padding: '20px',
                    background: 'color-mix(in srgb, var(--clr-accent) 5%, transparent)',
                    border: '1px solid color-mix(in srgb, var(--clr-accent) 20%, transparent)',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px',
                    marginBottom: '24px',
                  }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                        <span style={{ fontFamily: 'var(--f-groote)', fontWeight: 700, fontSize: '20px', color: 'var(--clr-text)' }}>Free Plan</span>
                        <Badge variant="success">Active</Badge>
                      </div>
                      <p style={{ fontSize: '13px', color: 'var(--clr-muted)' }}>Includes 100 AI queries/day, 5 image generations/day.</p>
                    </div>
                    <Button onClick={() => toast('Subscription system coming soon!')}>Upgrade to Pro</Button>
                  </div>
                  <div style={{ padding: '16px', background: 'var(--clr-surface)', border: '1px solid var(--clr-border)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <CreditCard size={16} style={{ color: 'var(--clr-muted)' }} />
                    <p style={{ fontSize: '13px', color: 'var(--clr-muted)' }}>No payment method on file. Upgrade to Pro to add billing details.</p>
                  </div>
                </div>
              )}

              {/* ── API KEYS TAB ── */}
              {activeTab === 'api' && (
                <div>
                  <div style={sectionHeader}>
                    <h3 style={{ fontFamily: 'var(--f-groote)', fontWeight: 700, fontSize: '18px', color: 'var(--clr-text)' }}>API Keys</h3>
                    <p style={{ fontSize: '13px', color: 'var(--clr-muted)', fontFamily: 'var(--f-lunchtype)' }}>Create and manage personal API keys for programmatic access.</p>
                  </div>

                  {/* Create new key */}
                  <div style={{ display: 'flex', gap: '10px', marginBottom: '24px', flexWrap: 'wrap' }}>
                    <input
                      value={newKeyName}
                      onChange={(e) => setNewKeyName(e.target.value)}
                      placeholder="Key name (e.g. My App)"
                      onKeyDown={(e) => e.key === 'Enter' && handleGenerateKey()}
                      style={{
                        flex: 1, minWidth: '160px', padding: '9px 12px',
                        border: '1px solid var(--clr-border)', background: 'var(--clr-surface)',
                        color: 'var(--clr-text)', fontSize: '13px', fontFamily: 'var(--f-lunchtype)', outline: 'none',
                      }}
                    />
                    <Button size="sm" onClick={handleGenerateKey}>
                      <RefreshCw size={13} style={{ marginRight: '4px' }} /> Generate Key
                    </Button>
                  </div>

                  {/* Newly generated key — show once */}
                  {generatedKey && (
                    <div style={{ padding: '14px', background: 'color-mix(in srgb, #22c55e 8%, transparent)', border: '1px solid #22c55e30', marginBottom: '20px' }}>
                      <p style={{ fontSize: '12px', fontWeight: 600, color: '#22c55e', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <CheckCircle size={12} /> "{generatedKey.name}" — copy it now, it won't be shown again!
                      </p>
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                        <code style={{ flex: 1, fontSize: '12px', wordBreak: 'break-all', color: 'var(--clr-text)', fontFamily: 'monospace', background: 'var(--clr-surface)', padding: '6px 10px', border: '1px solid var(--clr-border)' }}>
                          {generatedKey.fullKey}
                        </code>
                        <Button variant="ghost" size="sm" onClick={() => { handleCopy(generatedKey.fullKey); setGeneratedKey(null); }}>
                          <Copy size={13} style={{ marginRight: '4px' }} /> Copy & Close
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Keys list */}
                  {isLoadingKeys ? (
                    <div style={{ textAlign: 'center', padding: '32px', color: 'var(--clr-muted)', fontSize: '13px' }}>
                      <div style={{ width: '20px', height: '20px', border: '2px solid var(--clr-accent)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
                      Loading keys…
                    </div>
                  ) : apiKeys.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px', color: 'var(--clr-muted)', fontSize: '13px', fontFamily: 'var(--f-lunchtype)' }}>
                      No API keys yet. Create one above to get started.
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {apiKeys.map(k => (
                        <div key={k.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', background: 'var(--clr-surface)', border: '1px solid var(--clr-border)', gap: '12px' }}>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--clr-text)', marginBottom: '2px' }}>{k.name}</p>
                            <p style={{ fontSize: '12px', color: 'var(--clr-muted)', fontFamily: 'monospace' }}>
                              {k.prefix}{'•'.repeat(20)}
                              <span style={{ fontFamily: 'var(--f-lunchtype)', marginLeft: '8px' }}>
                                · Created {new Date(k.createdAt).toLocaleDateString()}
                                {k.lastUsedAt && ` · Last used ${new Date(k.lastUsedAt).toLocaleDateString()}`}
                              </span>
                            </p>
                          </div>
                          <Button variant="danger" size="sm" onClick={() => handleDeleteKey(k.id)}>
                            <Trash2 size={12} />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ── NOTIFICATIONS TAB ── */}
              {activeTab === 'notifications' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', ...sectionHeader }}>
                    <div>
                      <h3 style={{ fontFamily: 'var(--f-groote)', fontWeight: 700, fontSize: '18px', color: 'var(--clr-text)' }}>Notification Preferences</h3>
                      <p style={{ fontSize: '13px', color: 'var(--clr-muted)', fontFamily: 'var(--f-lunchtype)' }}>Choose how you'd like to be notified.</p>
                    </div>
                    <Button size="sm" onClick={handleSaveNotifications} loading={isSavingNotif}>Save</Button>
                  </div>

                  {[
                    { label: 'Email Notifications', desc: 'Receive notifications about account activity and updates via email.', value: notifEmail, setter: setNotifEmail },
                    { label: 'Browser Notifications', desc: 'Get real-time push notifications in your browser while using the app.', value: notifBrowser, setter: setNotifBrowser },
                  ].map((item) => (
                    <div key={item.label} style={toggleRow}>
                      <div>
                        <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--clr-text)', marginBottom: '2px' }}>{item.label}</p>
                        <p style={{ fontSize: '12px', color: 'var(--clr-muted)', maxWidth: '400px' }}>{item.desc}</p>
                      </div>
                      <label style={{ position: 'relative', display: 'inline-block', width: '42px', height: '24px', cursor: 'pointer', flexShrink: 0 }}>
                        <input
                          type="checkbox"
                          checked={item.value}
                          onChange={(e) => item.setter(e.target.checked)}
                          style={{ opacity: 0, width: 0, height: 0, position: 'absolute' }}
                        />
                        <span style={{
                          position: 'absolute', inset: 0,
                          background: item.value ? 'var(--clr-accent)' : 'var(--clr-border)',
                          borderRadius: '24px', transition: 'background 0.2s',
                        }} />
                        <span style={{
                          position: 'absolute', left: item.value ? '20px' : '2px', top: '2px',
                          width: '20px', height: '20px', background: '#fff',
                          borderRadius: '50%', transition: 'left 0.2s',
                        }} />
                      </label>
                    </div>
                  ))}
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

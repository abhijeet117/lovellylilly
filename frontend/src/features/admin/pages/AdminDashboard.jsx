import React, { useState, useEffect, useCallback } from 'react';
import AppShell from '../../../components/layout/AppShell';
import Card from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import { getStats, getUsers, banUser, unbanUser, deleteUser } from '../services/admin.api';
import {
  Users, Activity, Database, Cpu, AlertTriangle, Search,
  ArrowUpRight, LayoutGrid, RefreshCw, Shield, ShieldOff, Trash2, CheckCircle
} from 'lucide-react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, Title, Tooltip, Legend, Filler
} from 'chart.js';
import toast from 'react-hot-toast';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const AdminDashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [actionId, setActionId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const fetchStats = useCallback(async () => {
    setLoadingStats(true);
    try {
      const res = await getStats();
      setStats(res.data);
    } catch {
      toast.error('Failed to load stats');
    } finally {
      setLoadingStats(false);
    }
  }, []);

  const fetchUsers = useCallback(async (search = '') => {
    setLoadingUsers(true);
    try {
      const res = await getUsers(search ? `?search=${encodeURIComponent(search)}` : '');
      setUsers(res.data?.users || []);
    } catch {
      toast.error('Failed to load users');
    } finally {
      setLoadingUsers(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
    fetchUsers();
  }, [fetchStats, fetchUsers]);

  useEffect(() => {
    const t = setTimeout(() => fetchUsers(searchQuery), 350);
    return () => clearTimeout(t);
  }, [searchQuery, fetchUsers]);

  const handleBan = async (userId, currentlyBanned) => {
    setActionId(userId);
    try {
      if (currentlyBanned) {
        await unbanUser(userId);
        setUsers(prev => prev.map(u => u._id === userId ? { ...u, isBanned: false } : u));
        toast.success('User unbanned');
      } else {
        await banUser(userId);
        setUsers(prev => prev.map(u => u._id === userId ? { ...u, isBanned: true } : u));
        toast.success('User banned');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed');
    } finally {
      setActionId(null);
    }
  };

  const handleDelete = async (userId) => {
    setActionId(userId);
    try {
      await deleteUser(userId);
      setUsers(prev => prev.filter(u => u._id !== userId));
      setConfirmDelete(null);
      toast.success('User deleted');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    } finally {
      setActionId(null);
    }
  };

  // Build chart data from queryTrend
  const chartLabels = stats?.queryTrend?.map(d => d._id) || ['—'];
  const chartValues = stats?.queryTrend?.map(d => d.count) || [0];

  const chartData = {
    labels: chartLabels,
    datasets: [{
      label: 'Queries',
      data: chartValues,
      borderColor: 'var(--clr-accent)',
      backgroundColor: 'color-mix(in srgb, var(--clr-accent) 10%, transparent)',
      fill: true,
      tension: 0.4,
    }]
  };

  const chartOptions = {
    responsive: true,
    plugins: { legend: { display: false }, tooltip: { mode: 'index', intersect: false } },
    scales: {
      x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#888', fontSize: 11 } },
      y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#888', fontSize: 11 } }
    }
  };

  const exportCSV = () => {
    const headers = ['Name', 'Email', 'Role', 'Verified', 'Banned', 'Total Queries', 'Joined'];
    const rows = users.map(u => [u.name, u.email, u.role, u.isEmailVerified, u.isBanned, u.totalQueries, new Date(u.createdAt).toLocaleDateString()]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lovelylilly-users-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('CSV exported');
  };

  return (
    <AppShell>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '24px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontFamily: 'var(--f-groote)', fontSize: 'clamp(24px, 4vw, 36px)', color: 'var(--clr-text)', marginBottom: '4px' }}>
              Admin <em style={{ color: 'var(--clr-accent)' }}>Control</em>
            </h1>
            <p style={{ color: 'var(--clr-muted)', fontFamily: 'var(--f-lunchtype)', fontSize: '14px' }}>Global system monitoring and user management.</p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <Button variant="ghost" icon={RefreshCw} onClick={() => { fetchStats(); fetchUsers(searchQuery); }}>Refresh</Button>
            <Button icon={LayoutGrid} onClick={exportCSV}>Export CSV</Button>
          </div>
        </div>

        {/* Metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '28px' }}>
          {loadingStats ? (
            [1,2,3,4].map(i => (
              <Card key={i} style={{ padding: '20px' }}>
                <div style={{ height: '60px', background: 'var(--clr-border)', borderRadius: '4px', animation: 'pulse 1.5s infinite' }} />
              </Card>
            ))
          ) : [
            { label: 'Total Users', val: stats?.totalUsers?.toLocaleString() || '0', icon: Users },
            { label: 'Total Queries', val: stats?.totalQueries?.toLocaleString() || '0', icon: Activity },
            { label: 'Verified Users', val: stats?.verifiedUsers?.toLocaleString() || '0', icon: CheckCircle },
            { label: 'Last 7 Days', val: stats?.recentQueries?.toLocaleString() || '0', icon: ArrowUpRight },
          ].map((stat, i) => (
            <Card key={i} style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <stat.icon size={18} style={{ color: 'var(--clr-accent)' }} />
              </div>
              <p className="fl" style={{ marginBottom: '4px' }}>{stat.label}</p>
              <p style={{ fontFamily: 'var(--f-doll)', fontSize: '28px', color: 'var(--clr-text)', letterSpacing: '1px' }}>{stat.val}</p>
            </Card>
          ))}
        </div>

        {/* Chart */}
        <Card style={{ padding: '24px', marginBottom: '24px' }}>
          <h3 style={{ fontFamily: 'var(--f-groote)', fontWeight: 700, fontSize: '16px', color: 'var(--clr-text)', marginBottom: '20px' }}>
            Query Activity — Last 7 Days
          </h3>
          {loadingStats ? (
            <div style={{ height: '200px', background: 'var(--clr-border)', borderRadius: '4px', animation: 'pulse 1.5s infinite' }} />
          ) : (
            <Line data={chartData} options={chartOptions} />
          )}
        </Card>

        {/* Users Table */}
        <Card>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--clr-border)', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <h3 style={{ fontFamily: 'var(--f-groote)', fontWeight: 700, fontSize: '16px', color: 'var(--clr-text)', flex: 1 }}>
              Users ({users.length})
            </h3>
            <div style={{ position: 'relative', width: '260px' }}>
              <Search style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--clr-muted)' }} size={14} />
              <input className="fi" style={{ paddingLeft: '32px', width: '100%', height: '36px', fontSize: '13px' }}
                placeholder="Search by name or email…"
                value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--clr-border)' }}>
                  {['User', 'Email', 'Role', 'Queries', 'Status', 'Joined', 'Actions'].map(h => (
                    <th key={h} className="fl" style={{ padding: '12px 16px', fontSize: '11px', letterSpacing: '1px', textTransform: 'uppercase' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loadingUsers ? (
                  <tr><td colSpan={7} style={{ padding: '40px', textAlign: 'center', color: 'var(--clr-muted)', fontFamily: 'var(--f-lunchtype)' }}>Loading users…</td></tr>
                ) : users.length === 0 ? (
                  <tr><td colSpan={7} style={{ padding: '40px', textAlign: 'center', color: 'var(--clr-muted)', fontFamily: 'var(--f-lunchtype)' }}>No users found</td></tr>
                ) : users.map(user => (
                  <tr key={user._id} style={{ borderBottom: '1px solid var(--clr-border)', opacity: user.isBanned ? 0.6 : 1 }}>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--clr-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700, color: 'var(--clr-bg)', fontFamily: 'var(--f-doll)', flexShrink: 0 }}>
                          {user.name?.charAt(0).toUpperCase()}
                        </div>
                        <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--clr-text)', fontFamily: 'var(--f-lunchtype)' }}>{user.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '13px', color: 'var(--clr-muted)', fontFamily: 'var(--f-lunchtype)' }}>{user.email}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <Badge variant={user.role === 'admin' ? 'warning' : 'info'}>{user.role}</Badge>
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '13px', color: 'var(--clr-text)', fontFamily: 'var(--f-lunchtype)' }}>
                      {user.totalQueries?.toLocaleString() || 0}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      {user.isBanned ? (
                        <Badge variant="danger">Banned</Badge>
                      ) : user.isEmailVerified ? (
                        <Badge variant="success">Verified</Badge>
                      ) : (
                        <Badge variant="warning">Unverified</Badge>
                      )}
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '12px', color: 'var(--clr-muted)', fontFamily: 'var(--f-lunchtype)' }}>
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      {user.role !== 'admin' && (
                        <div style={{ display: 'flex', gap: '4px' }}>
                          <button
                            onClick={() => handleBan(user._id, user.isBanned)}
                            disabled={actionId === user._id}
                            title={user.isBanned ? 'Unban user' : 'Ban user'}
                            style={{ padding: '4px 8px', background: user.isBanned ? 'color-mix(in srgb, var(--color-success) 10%, transparent)' : 'color-mix(in srgb, #f59e0b 10%, transparent)', border: `1px solid ${user.isBanned ? 'color-mix(in srgb, var(--color-success) 30%, transparent)' : 'color-mix(in srgb, #f59e0b 30%, transparent)'}`, borderRadius: '4px', cursor: 'pointer', color: user.isBanned ? 'var(--color-success)' : '#f59e0b', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontFamily: 'var(--f-lunchtype)' }}>
                            {user.isBanned ? <><ShieldOff size={11} /> Unban</> : <><Shield size={11} /> Ban</>}
                          </button>
                          {confirmDelete === user._id ? (
                            <button onClick={() => handleDelete(user._id)} disabled={actionId === user._id}
                              style={{ padding: '4px 8px', background: 'color-mix(in srgb, var(--color-danger) 20%, transparent)', border: '1px solid var(--color-danger)', borderRadius: '4px', cursor: 'pointer', color: 'var(--color-danger)', fontSize: '11px', fontFamily: 'var(--f-lunchtype)' }}>
                              Confirm
                            </button>
                          ) : (
                            <button onClick={() => setConfirmDelete(user._id)}
                              style={{ padding: '4px 8px', background: 'color-mix(in srgb, var(--color-danger) 10%, transparent)', border: '1px solid color-mix(in srgb, var(--color-danger) 30%, transparent)', borderRadius: '4px', cursor: 'pointer', color: 'var(--color-danger)', display: 'flex', alignItems: 'center' }}>
                              <Trash2 size={12} />
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Dismiss confirm delete on outside click */}
        {confirmDelete && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 1 }} onClick={() => setConfirmDelete(null)} />
        )}
      </div>
    </AppShell>
  );
};

export default AdminDashboard;

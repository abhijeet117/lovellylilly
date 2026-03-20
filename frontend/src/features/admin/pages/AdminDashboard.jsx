import React, { useState } from 'react';
import AppShell from '../../../components/layout/AppShell';
import Card   from '../../../components/ui/Card';
import Badge  from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import {
  Users, Activity, Database, Cpu, AlertTriangle, Search,
  MoreVertical, ArrowUpRight, ArrowDownRight, LayoutGrid
} from 'lucide-react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, Title, Tooltip, Legend, Filler
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const AdminDashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'Active Users',
      data: [1200, 1900, 3000, 5000, 4800, 6200],
      borderColor: 'var(--clr-accent)',
      backgroundColor: 'color-mix(in srgb, var(--clr-accent) 10%, transparent)',
      fill: true, tension: 0.4,
    }]
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
            <p style={{ color: 'var(--clr-muted)', fontFamily: 'var(--f-lunchtype)', fontSize: '14px' }}>
              Global system monitoring and user management.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <Button variant="ghost" icon={Activity}>System Status</Button>
            <Button icon={LayoutGrid}>Export CSV</Button>
          </div>
        </div>

        {/* Metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '28px' }}>
          {[
            { label: 'Total Users', val: '12,482', change: '+12%', up: true, icon: Users },
            { label: 'API Requests', val: '1.2M', change: '+24%', up: true, icon: Activity },
            { label: 'Db Load', val: '14%', change: '-2%', up: false, icon: Database },
            { label: 'CPU Usage', val: '32%', change: '+5%', up: true, icon: Cpu },
          ].map((stat, i) => (
            <Card key={i} style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <stat.icon size={18} style={{ color: 'var(--clr-text)' }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '11px', fontFamily: 'var(--f-cotham)', color: stat.up ? 'var(--color-success)' : 'var(--color-danger)' }}>
                  {stat.up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                  {stat.change}
                </div>
              </div>
              <p className="fl" style={{ marginBottom: '4px' }}>{stat.label}</p>
              <p style={{ fontFamily: 'var(--f-doll)', fontSize: '28px', color: 'var(--clr-text)', letterSpacing: '1px' }}>{stat.val}</p>
            </Card>
          ))}
        </div>

        {/* Chart + Alerts */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', marginBottom: '24px' }}>
          <Card style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h3 style={{ fontFamily: 'var(--f-syne)', fontWeight: 700, fontSize: '16px', color: 'var(--clr-text)' }}>Growth Metrics</h3>
              <select className="fi" style={{ width: 'auto', padding: '4px 10px', fontSize: '12px' }}>
                <option>Last 6 Months</option>
                <option>Last 30 Days</option>
              </select>
            </div>
            <div style={{ height: '280px' }}>
              <Line data={chartData} options={{
                responsive: true, maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                  y: { grid: { color: 'rgba(255,255,255,0.04)' }, border: { display: false }, ticks: { color: 'var(--clr-muted)' } },
                  x: { grid: { display: false }, border: { display: false }, ticks: { color: 'var(--clr-muted)' } }
                }
              }} />
            </div>
          </Card>

          <Card style={{ padding: '24px' }}>
            <h3 style={{ fontFamily: 'var(--f-syne)', fontWeight: 700, fontSize: '16px', color: 'var(--clr-text)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <AlertTriangle size={16} style={{ color: 'var(--color-warning)' }} /> Alerts
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { type: 'danger', msg: 'High latency detected in us-east-1', time: '2m ago' },
                { type: 'warning', msg: 'Gemini API limit at 85%', time: '14m ago' },
                { type: 'info', msg: 'Scheduled maintenance in 2h', time: '1h ago' },
                { type: 'success', msg: 'Database backup completed', time: '4h ago' },
              ].map((alert, i) => (
                <div key={i} style={{ padding: '10px', background: 'var(--clr-surface)', border: '1px solid var(--clr-border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <Badge variant={alert.type}>{alert.type.toUpperCase()}</Badge>
                    <span style={{ fontSize: '10px', color: 'var(--clr-muted)', fontFamily: 'var(--f-cotham)' }}>{alert.time}</span>
                  </div>
                  <p style={{ fontSize: '12px', color: 'var(--clr-muted)', fontFamily: 'var(--f-lunchtype)' }}>{alert.msg}</p>
                </div>
              ))}
            </div>
            <Button variant="ghost" className="w-full" style={{ marginTop: '14px', justifyContent: 'center' }}>View All</Button>
          </Card>
        </div>

        {/* User Table */}
        <Card>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--clr-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <h3 style={{ fontFamily: 'var(--f-syne)', fontWeight: 700, fontSize: '16px', color: 'var(--clr-text)' }}>User Management</h3>
            <div style={{ position: 'relative', width: '280px' }}>
              <Search style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--clr-muted)' }} size={14} />
              <input
                type="text" placeholder="Search users..."
                className="fi" style={{ paddingLeft: '34px', width: '100%', fontSize: '12px' }}
                value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--clr-border)' }}>
                  {['User', 'Status', 'Plan', 'Join Date', 'Actions'].map(h => (
                    <th key={h} className="fl" style={{ padding: '12px 20px' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { name: 'John Doe', email: 'john@example.com', status: 'active', plan: 'Pro', date: 'Jan 12, 2024' },
                  { name: 'Sarah Smith', email: 'sarah@design.io', status: 'active', plan: 'Free', date: 'Feb 04, 2024' },
                  { name: 'Mike Johnson', email: 'mike@tech.co', status: 'banned', plan: 'Pro', date: 'Mar 01, 2024' },
                  { name: 'Alex Wong', email: 'alex@wong.me', status: 'inactive', plan: 'Free', date: 'Mar 12, 2024' },
                ].map((u, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--clr-border)' }}>
                    <td style={{ padding: '14px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                          width: '32px', height: '32px', borderRadius: '50%',
                          background: 'var(--clr-card)', display: 'flex',
                          alignItems: 'center', justifyContent: 'center',
                          fontSize: '10px', fontFamily: 'var(--f-doll)', color: 'var(--clr-text)',
                        }}>
                          {u.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--clr-text)' }}>{u.name}</p>
                          <p style={{ fontSize: '11px', color: 'var(--clr-muted)' }}>{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      <Badge variant={u.status === 'active' ? 'success' : u.status === 'banned' ? 'danger' : 'info'}>{u.status}</Badge>
                    </td>
                    <td style={{ padding: '14px 20px', fontSize: '13px', color: 'var(--clr-muted)' }}>{u.plan}</td>
                    <td style={{ padding: '14px 20px', fontSize: '13px', color: 'var(--clr-muted)' }}>{u.date}</td>
                    <td style={{ padding: '14px 20px' }}>
                      <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--clr-muted)', padding: '4px' }}>
                        <MoreVertical size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </AppShell>
  );
};

export default AdminDashboard;

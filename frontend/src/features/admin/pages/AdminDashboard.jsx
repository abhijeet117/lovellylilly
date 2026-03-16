import React, { useState } from 'react';
import AppShell from '../../../components/layout/AppShell';
import Card   from '../../../components/ui/Card';
import Badge  from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import { 
  Users, 
  Activity, 
  Database, 
  Cpu, 
  AlertTriangle, 
  Search,
  MoreVertical,
  ArrowUpRight,
  ArrowDownRight,
  LayoutGrid
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const AdminDashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');

  // Mock chart data
  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Active Users',
        data: [1200, 1900, 3000, 5000, 4800, 6200],
        borderColor: '#4F7EFF',
        backgroundColor: 'rgba(79, 126, 255, 0.1)',
        fill: true,
        tension: 0.4,
      }
    ]
  };

  return (
    <AppShell>
      <div className="max-w-[1400px] mx-auto p-6 md:p-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
           <div>
              <h1 className="text-h2 gradient-text mb-2">Admin Control</h1>
              <p className="text-text-secondary">Global system monitoring and user management.</p>
           </div>
           <div className="flex gap-3">
              <Button variant="ghost" icon={Activity}>System Status</Button>
              <Button icon={LayoutGrid}>Export CSV</Button>
           </div>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
           {[
             { label: 'Total Users', val: '12,482', change: '+12%', up: true, icon: Users },
             { label: 'API Requests', val: '1.2M', change: '+24%', up: true, icon: Activity },
             { label: 'Db Load', val: '14%', change: '-2%', up: false, icon: Database },
             { label: 'CPU Usage', val: '32%', change: '+5%', up: true, icon: Cpu }
           ].map((stat, i) => (
             <Card key={i} className="p-6">
                <div className="flex justify-between items-start mb-4">
                   <div className="p-2 bg-bg-elevated rounded-sm text-text-primary">
                      <stat.icon size={20} />
                   </div>
                   <div className={`flex items-center gap-1 text-[11px] font-bold ${stat.up ? 'text-semantic-success' : 'text-semantic-danger'}`}>
                      {stat.up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                      {stat.change}
                   </div>
                </div>
                <h4 className="text-text-muted text-label mb-1 uppercase tracking-wider">{stat.label}</h4>
                <p className="text-3xl font-extrabold text-text-primary">{stat.val}</p>
             </Card>
           ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           {/* Chart Area */}
           <Card className="lg:col-span-2 p-8">
              <div className="flex justify-between items-center mb-8">
                 <h3 className="text-lg font-bold">Growth Metrics</h3>
                 <select className="bg-bg-elevated border border-border-subtle rounded-sm text-xs p-1.5 text-text-primary outline-none">
                    <option>Last 6 Months</option>
                    <option>Last 30 Days</option>
                 </select>
              </div>
              <div className="h-[300px]">
                 <Line 
                   data={chartData} 
                   options={{ 
                     responsive: true, 
                     maintainAspectRatio: false,
                     plugins: { legend: { display: false } },
                     scales: {
                       y: { grid: { color: 'rgba(255,255,255,0.05)' }, border: { display: false } },
                       x: { grid: { display: false }, border: { display: false } }
                     }
                   }} 
                 />
              </div>
           </Card>

           {/* Alerts Panel */}
           <Card className="p-8">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                 <AlertTriangle size={18} className="text-semantic-warning" />
                 System Alerts
              </h3>
              <div className="space-y-4">
                 {[
                   { type: 'danger', msg: 'High latency detected in us-east-1', time: '2m ago' },
                   { type: 'warning', msg: 'Gemini API limit at 85%', time: '14m ago' },
                   { type: 'info', msg: 'Scheduled maintenance in 2h', time: '1h ago' },
                   { type: 'success', msg: 'Database backup completed', time: '4h ago' }
                 ].map((alert, i) => (
                   <div key={i} className="p-3 bg-bg-elevated border border-border-subtle rounded-sm flex flex-col gap-1">
                      <div className="flex justify-between items-center">
                         <Badge variant={alert.type === 'danger' ? 'danger' : alert.type === 'warning' ? 'warning' : alert.type === 'info' ? 'info' : 'success'}>
                            {alert.type.toUpperCase()}
                         </Badge>
                         <span className="text-[10px] text-text-muted">{alert.time}</span>
                      </div>
                      <p className="text-xs text-text-secondary font-medium mt-1">{alert.msg}</p>
                   </div>
                 ))}
              </div>
              <Button variant="ghost" className="w-full mt-6 text-xs">View All Alerts</Button>
           </Card>
        </div>

        {/* User Management Table */}
        <Card className="mt-8 overflow-hidden">
           <div className="p-6 border-b border-border-subtle flex flex-col md:flex-row justify-between items-center gap-4">
              <h3 className="text-lg font-bold">User Management</h3>
              <div className="relative w-full md:w-80">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
                 <input 
                   type="text" 
                   placeholder="Search users..."
                   className="w-full bg-bg-elevated border border-border-subtle rounded-pill py-2 pl-10 pr-4 text-xs text-text-primary outline-none"
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                 />
              </div>
           </div>
           <div className="overflow-x-auto">
              <table className="w-full text-left">
                 <thead className="bg-bg-elevated/50 text-text-muted text-[11px] font-bold uppercase tracking-widest border-b border-border-subtle">
                    <tr>
                       <th className="px-6 py-4">User</th>
                       <th className="px-6 py-4">Status</th>
                       <th className="px-6 py-4">Plan</th>
                       <th className="px-6 py-4">Join Date</th>
                       <th className="px-6 py-4">Actions</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-border-subtle">
                    {[
                      { name: 'John Doe', email: 'john@example.com', status: 'active', plan: 'Pro', date: 'Jan 12, 2024' },
                      { name: 'Sarah Smith', email: 'sarah@design.io', status: 'active', plan: 'Free', date: 'Feb 04, 2024' },
                      { name: 'Mike Johnson', email: 'mike@tech.co', status: 'banned', plan: 'Pro', date: 'Mar 01, 2024' },
                      { name: 'Alex Wong', email: 'alex@wong.me', status: 'inactive', plan: 'Free', date: 'Mar 12, 2024' }
                    ].map((user, i) => (
                      <tr key={i} className="hover:bg-bg-hover transition-colors">
                         <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                               <div className="w-8 h-8 rounded-full bg-bg-elevated flex items-center justify-center text-[10px] font-bold text-text-primary">
                                  {user.name.split(' ').map(n => n[0]).join('')}
                               </div>
                               <div>
                                  <p className="text-sm font-medium">{user.name}</p>
                                  <p className="text-[11px] text-text-muted">{user.email}</p>
                               </div>
                            </div>
                         </td>
                         <td className="px-6 py-4">
                            <Badge variant={user.status === 'active' ? 'success' : user.status === 'banned' ? 'danger' : 'info'}>
                               {user.status}
                            </Badge>
                         </td>
                         <td className="px-6 py-4 text-sm text-text-secondary">{user.plan}</td>
                         <td className="px-6 py-4 text-sm text-text-secondary">{user.date}</td>
                         <td className="px-6 py-4">
                            <button className="p-2 text-text-muted hover:text-text-primary transition-colors">
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

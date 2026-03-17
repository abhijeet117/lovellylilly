import React, { useState } from 'react';
import AppShell from '../../../components/layout/AppShell';
import Button from '../../../components/ui/Button';
import Card   from '../../../components/ui/Card';
import Badge  from '../../../components/ui/Badge';
import {
  FileText, Upload, Search, Trash2, FileCode, FileBox,
  MoreVertical, Download, Eye, MessageSquare, Filter
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DocumentVaultPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const [documents, setDocuments] = useState([
    { id: 1, name: '2024 Market Research.pdf', size: '2.4 MB', type: 'PDF', date: 'Mar 15, 2024', status: 'Analyzed' },
    { id: 2, name: 'Quarterly Report.docx', size: '1.1 MB', type: 'DOCX', date: 'Mar 14, 2024', status: 'Ready' },
    { id: 3, name: 'AI Safety Guidelines.pdf', size: '3.8 MB', type: 'PDF', date: 'Mar 12, 2024', status: 'Analyzed' },
    { id: 4, name: 'Project Timeline.xlsx', size: '850 KB', type: 'XLSX', date: 'Mar 10, 2024', status: 'Ready' },
  ]);

  const handleUpload = () => {
    setIsUploading(true);
    setTimeout(() => {
      setDocuments(prev => [{ id: Date.now(), name: 'New Document.pdf', size: '1.2 MB', type: 'PDF', date: 'Today', status: 'Ready' }, ...prev]);
      setIsUploading(false);
    }, 1500);
  };

  const getFileIcon = (type) => {
    switch (type) {
      case 'PDF': return <FileText size={18} style={{ color: 'var(--color-danger)' }} />;
      case 'XLSX': return <FileCode size={18} style={{ color: 'var(--color-success)' }} />;
      default: return <FileBox size={18} style={{ color: 'var(--clr-accent)' }} />;
    }
  };

  return (
    <AppShell>
      <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '24px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '28px' }}>
          <div>
            <h1 style={{ fontFamily: 'var(--f-groote)', fontSize: 'clamp(24px, 4vw, 36px)', color: 'var(--clr-text)', marginBottom: '4px' }}>
              Document <em style={{ color: 'var(--clr-accent)' }}>Vault</em>
            </h1>
            <p style={{ color: 'var(--clr-muted)', fontFamily: 'var(--f-lunchtype)', fontSize: '14px' }}>
              Secure storage and AI analysis for your research files.
            </p>
          </div>
          <Button size="lg" icon={Upload} onClick={handleUpload} loading={isUploading}>Upload Document</Button>
        </div>

        {/* Search */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--clr-muted)' }} size={16} />
            <input
              type="text" placeholder="Search documents..."
              className="fi" style={{ paddingLeft: '36px', width: '100%' }}
              value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="ghost" icon={Filter}>Filter</Button>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px', marginBottom: '24px' }}>
          {[
            { label: 'Total Files', val: '42' },
            { label: 'Storage Used', val: '156 MB' },
            { label: 'AI Summaries', val: '128' },
            { label: 'Limit', val: '2 GB' },
          ].map((stat, i) => (
            <Card key={i} style={{ padding: '14px' }}>
              <p className="fl" style={{ marginBottom: '3px' }}>{stat.label}</p>
              <p style={{ fontFamily: 'var(--f-doll)', fontSize: '22px', color: 'var(--clr-text)', letterSpacing: '1px' }}>{stat.val}</p>
            </Card>
          ))}
        </div>

        {/* Table */}
        <Card>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--clr-border)' }}>
                  {['File Name', 'Size', 'Date Added', 'Status', 'Actions'].map(h => (
                    <th key={h} className="fl" style={{ padding: '12px 18px' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {documents.map((doc) => (
                    <motion.tr key={doc.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      style={{ borderBottom: '1px solid var(--clr-border)' }}>
                      <td style={{ padding: '14px 18px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          {getFileIcon(doc.type)}
                          <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--clr-text)' }}>{doc.name}</span>
                        </div>
                      </td>
                      <td style={{ padding: '14px 18px', fontSize: '13px', color: 'var(--clr-muted)' }}>{doc.size}</td>
                      <td style={{ padding: '14px 18px', fontSize: '13px', color: 'var(--clr-muted)' }}>{doc.date}</td>
                      <td style={{ padding: '14px 18px' }}>
                        <Badge variant={doc.status === 'Analyzed' ? 'success' : 'info'}>{doc.status}</Badge>
                      </td>
                      <td style={{ padding: '14px 18px' }}>
                        <div style={{ display: 'flex', gap: '4px' }}>
                          {[MessageSquare, Eye, Download, Trash2].map((Icon, j) => (
                            <button key={j} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--clr-muted)', padding: '4px' }}>
                              <Icon size={14} />
                            </button>
                          ))}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </AppShell>
  );
};

export default DocumentVaultPage;

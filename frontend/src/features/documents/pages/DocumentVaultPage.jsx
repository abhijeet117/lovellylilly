import React, { useState } from 'react';
import AppShell from '../../../components/layout/AppShell';
  import Button from '../../../components/ui/Button';
  import Card   from '../../../components/ui/Card';
  import Badge  from '../../../components/ui/Badge';
import { 
  FileText, 
  Upload, 
  Search, 
  Trash2, 
  FileCode, 
  FileBox, 
  MoreVertical,
  Download,
  Eye,
  MessageSquare,
  Filter
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DocumentVaultPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  
  // Mock document data
  const [documents, setDocuments] = useState([
    { id: 1, name: '2024 Market Research.pdf', size: '2.4 MB', type: 'PDF', date: 'Mar 15, 2024', status: 'Analyzed' },
    { id: 2, name: 'Quarterly Report.docx', size: '1.1 MB', type: 'DOCX', date: 'Mar 14, 2024', status: 'Ready' },
    { id: 3, name: 'AI Safety Guidelines.pdf', size: '3.8 MB', type: 'PDF', date: 'Mar 12, 2024', status: 'Analyzed' },
    { id: 4, name: 'Project Timeline.xlsx', size: '850 KB', type: 'XLSX', date: 'Mar 10, 2024', status: 'Ready' }
  ]);

  const handleUpload = () => {
    setIsUploading(true);
    setTimeout(() => {
      setDocuments(prev => [{
        id: Date.now(),
        name: 'New Document.pdf',
        size: '1.2 MB',
        type: 'PDF',
        date: 'Today',
        status: 'Ready'
      }, ...prev]);
      setIsUploading(false);
    }, 1500);
  };

  const getFileIcon = (type) => {
    switch (type) {
      case 'PDF': return <FileText size={20} className="text-semantic-danger" />;
      case 'XLSX': return <FileCode size={20} className="text-semantic-success" />;
      default: return <FileBox size={20} className="text-brand-primary" />;
    }
  };

  return (
    <AppShell>
      <div className="max-w-[1240px] mx-auto p-6 md:p-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
           <div>
              <h1 className="text-h2 gradient-text mb-2">Document Vault</h1>
              <p className="text-text-secondary">Secure storage and AI analysis for all your research files.</p>
           </div>
           <Button size="lg" icon={Upload} onClick={handleUpload} isLoading={isUploading}>
              Upload Document
           </Button>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row gap-4 items-center mb-6">
           <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
              <input 
                type="text" 
                placeholder="Search documents by name or content..."
                className="w-full bg-bg-surface border border-border-subtle rounded-sm py-3 pl-10 pr-4 text-[15px] outline-none focus:border-brand-primary transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
           </div>
           <div className="flex items-center gap-2 w-full md:w-auto">
              <Button variant="ghost" icon={Filter}>Filter</Button>
              <div className="h-6 w-px bg-border-subtle mx-2" />
              <div className="text-[13px] text-text-muted">
                 Sorted by <span className="text-text-primary font-bold">Newest First</span>
              </div>
           </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
           {[
             { label: 'Total Files', val: '42' },
             { label: 'Storage Used', val: '156 MB' },
             { label: 'AI Summaries', val: '128' },
             { label: 'Limit', val: '2 GB' }
           ].map((stat, i) => (
             <Card key={i} className="p-4 bg-bg-surface/40 backdrop-blur-sm">
                <p className="text-[11px] text-text-muted uppercase tracking-wider mb-1">{stat.label}</p>
                <p className="text-xl font-bold text-text-primary">{stat.val}</p>
             </Card>
           ))}
        </div>

        {/* Document List */}
        <Card className="overflow-hidden">
           <div className="overflow-x-auto">
              <table className="w-full text-left">
                 <thead>
                    <tr className="bg-bg-elevated border-b border-border-subtle">
                       <th className="px-6 py-4 text-[13px] font-bold text-text-muted uppercase tracking-wider">File Name</th>
                       <th className="px-6 py-4 text-[13px] font-bold text-text-muted uppercase tracking-wider">Size</th>
                       <th className="px-6 py-4 text-[13px] font-bold text-text-muted uppercase tracking-wider">Date Added</th>
                       <th className="px-6 py-4 text-[13px] font-bold text-text-muted uppercase tracking-wider">Status</th>
                       <th className="px-6 py-4 text-[13px] font-bold text-text-muted uppercase tracking-wider">Actions</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-border-subtle">
                    <AnimatePresence>
                       {documents.map((doc) => (
                         <motion.tr 
                           key={doc.id}
                           initial={{ opacity: 0 }}
                           animate={{ opacity: 1 }}
                           className="hover:bg-bg-hover transition-colors group"
                         >
                            <td className="px-6 py-5">
                               <div className="flex items-center gap-3">
                                  {getFileIcon(doc.type)}
                                  <span className="text-[15px] font-medium text-text-primary">{doc.name}</span>
                               </div>
                            </td>
                            <td className="px-6 py-5 text-[14px] text-text-secondary">{doc.size}</td>
                            <td className="px-6 py-5 text-[14px] text-text-secondary">{doc.date}</td>
                            <td className="px-6 py-5">
                               <Badge variant={doc.status === 'Analyzed' ? 'success' : 'think'}>
                                  {doc.status}
                               </Badge>
                            </td>
                            <td className="px-6 py-5">
                               <div className="flex items-center gap-1">
                                  <button className="p-2 hover:bg-bg-elevated rounded-sm text-text-muted hover:text-brand-primary transition-all" title="Summarize">
                                     <MessageSquare size={16} />
                                  </button>
                                  <button className="p-2 hover:bg-bg-elevated rounded-sm text-text-muted hover:text-text-primary transition-all" title="View">
                                     <Eye size={16} />
                                  </button>
                                  <button className="p-2 hover:bg-bg-elevated rounded-sm text-text-muted hover:text-text-primary transition-all" title="Download">
                                     <Download size={16} />
                                  </button>
                                  <button className="p-2 hover:bg-bg-elevated rounded-sm text-text-muted hover:text-semantic-danger transition-all" title="Delete">
                                     <Trash2 size={16} />
                                  </button>
                               </div>
                            </td>
                         </motion.tr>
                       ))}
                    </AnimatePresence>
                 </tbody>
              </table>
           </div>
           
           {documents.length === 0 && (
              <div className="py-20 flex flex-col items-center justify-center text-center">
                 <div className="w-16 h-16 rounded-full bg-bg-base flex items-center justify-center text-text-muted mb-4 border border-border-subtle">
                    <FileText size={32} />
                 </div>
                 <h3 className="text-lg font-bold">No documents found</h3>
                 <p className="text-text-muted text-sm mt-1">Upload a PDF or DOCX to start analyzing.</p>
              </div>
           )}
        </Card>
      </div>
    </AppShell>
  );
};

export default DocumentVaultPage;

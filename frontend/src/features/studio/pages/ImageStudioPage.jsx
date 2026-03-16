import React, { useState } from 'react';
import AppShell from '../../../components/layout/AppShell';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import Input from '../../../components/ui/Input';
import { 
  Image as ImageIcon, 
  Settings2, 
  Download, 
  Share2, 
  Trash2, 
  Maximize2,
  Sparkles,
  Layers,
  History,
  Grid
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ImageStudioPage = () => {
  const [prompt, setPrompt] = useState('');
  const [activeTab, setActiveTab] = useState('generate'); // generate, history
  const [selectedAspect, setSelectedAspect] = useState('1:1');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState([]);

  const handleGenerate = () => {
    if (!prompt) return;
    setIsLoading(true);
    // Mock generation
    setTimeout(() => {
      setResults(prev => [{
        id: Date.now(),
        url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800',
        prompt: prompt,
        aspect: selectedAspect
      }, ...prev]);
      setIsLoading(false);
      setPrompt('');
    }, 2000);
  };

  return (
    <AppShell>
      <div className="max-w-[1400px] mx-auto p-6 md:p-8">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Left Panel: Settings */}
          <div className="w-full md:w-[400px] flex flex-col gap-6">
             <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-brand-gradient flex items-center justify-center text-white shadow-brand-glow">
                   <ImageIcon size={22} />
                </div>
                <div>
                   <h1 className="text-h4">Image Studio</h1>
                   <p className="text-[13px] text-text-muted">Powered by Gemini Imagen 3</p>
                </div>
             </div>

             <Card className="p-6">
                <h3 className="text-sm font-bold text-text-primary mb-4 flex items-center gap-2">
                   <Sparkles size={16} className="text-brand-primary" />
                   Generate Image
                </h3>
                
                <div className="flex flex-col gap-4">
                   <div className="flex flex-col gap-2">
                      <label className="text-[13px] text-text-secondary font-medium">Prompt</label>
                      <textarea
                        className="w-full h-32 bg-bg-elevated border border-border-subtle rounded-sm p-4 text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-brand-primary transition-all resize-none"
                        placeholder="A futuristic city with floating neon structures, digital art style..."
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                      />
                   </div>

                   <div className="flex flex-col gap-2">
                      <label className="text-[13px] text-text-secondary font-medium">Aspect Ratio</label>
                      <div className="grid grid-cols-3 gap-2">
                         {['1:1', '16:9', '9:16'].map(ratio => (
                           <button
                             key={ratio}
                             onClick={() => setSelectedAspect(ratio)}
                             className={`py-2 rounded-sm border text-xs font-medium transition-all ${selectedAspect === ratio ? 'bg-brand-primary/10 border-brand-primary text-brand-primary' : 'bg-bg-elevated border-border-subtle text-text-muted hover:border-border-default'}`}
                           >
                             {ratio}
                           </button>
                         ))}
                      </div>
                   </div>

                   <Button 
                     className="w-full mt-2" 
                     onClick={handleGenerate}
                     isLoading={isLoading}
                     icon={Sparkles}
                   >
                     Generate
                   </Button>
                </div>
             </Card>

             <Card className="p-6">
                <h3 className="text-sm font-bold text-text-primary mb-4 flex items-center gap-2">
                   <Settings2 size={16} className="text-brand-primary" />
                   Advanced Settings
                </h3>
                <div className="space-y-4">
                   <div className="flex items-center justify-between text-[13px]">
                      <span className="text-text-secondary">Image Quatlity</span>
                      <span className="text-text-primary font-mono">Standard</span>
                   </div>
                   <div className="flex items-center justify-between text-[13px]">
                      <span className="text-text-secondary">Safety Filter</span>
                      <span className="text-semantic-success font-semibold px-2 py-0.5 bg-semantic-success/10 rounded-full text-[10px]">Active</span>
                   </div>
                </div>
             </Card>
          </div>

          {/* Right Panel: Canvas/Results */}
          <div className="flex-1 min-w-0">
             <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-1 bg-bg-surface border border-border-subtle p-1 rounded-sm">
                   <button 
                     onClick={() => setActiveTab('generate')}
                     className={`px-4 py-1.5 rounded-sm text-[13px] font-medium transition-all ${activeTab === 'generate' ? 'bg-bg-elevated text-text-primary shadow-sm' : 'text-text-muted hover:text-text-secondary'}`}
                   >
                     Recent
                   </button>
                   <button 
                     onClick={() => setActiveTab('history')}
                     className={`px-4 py-1.5 rounded-sm text-[13px] font-medium transition-all ${activeTab === 'history' ? 'bg-bg-elevated text-text-primary shadow-sm' : 'text-text-muted hover:text-text-secondary'}`}
                   >
                     Collection
                   </button>
                </div>
                <div className="flex items-center gap-2">
                   <Button variant="ghost" size="sm" icon={Grid} className="w-9 h-9 p-0" />
                   <Button variant="ghost" size="sm" icon={History} className="w-9 h-9 p-0" />
                </div>
             </div>

             {results.length === 0 ? (
                <div className="h-[600px] border-2 border-dashed border-border-subtle rounded-sm flex flex-col items-center justify-center text-center p-8">
                   <div className="w-16 h-16 rounded-full bg-bg-elevated flex items-center justify-center text-text-muted mb-4">
                      <ImageIcon size={32} />
                   </div>
                   <h3 className="text-h4 mb-2">No images generated yet</h3>
                   <p className="text-text-muted max-w-[320px]">Enter a prompt on the left to start creating amazing visuals.</p>
                </div>
             ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                   <AnimatePresence>
                      {results.map((img) => (
                        <motion.div
                          key={img.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="group relative aspect-square bg-bg-surface border border-border-subtle rounded-lg overflow-hidden"
                        >
                           <img src={img.url} alt={img.prompt} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                           <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity p-6 flex flex-col justify-between">
                              <div className="flex justify-end gap-2">
                                 <button className="w-8 h-8 rounded-sm bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-all">
                                    <Download size={16} />
                                 </button>
                                 <button className="w-8 h-8 rounded-sm bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-all">
                                    <Share2 size={16} />
                                 </button>
                                 <button className="w-8 h-8 rounded-sm bg-semantic-danger/20 backdrop-blur-md flex items-center justify-center text-semantic-danger hover:bg-semantic-danger/30 transition-all">
                                    <Trash2 size={16} />
                                 </button>
                              </div>
                              <div>
                                 <p className="text-white text-xs line-clamp-2 mb-3">{img.prompt}</p>
                                 <div className="flex items-center gap-2">
                                    <span className="px-2 py-0.5 bg-brand-primary/20 rounded-full text-[10px] text-brand-primary font-bold">GEMINI 3</span>
                                    <span className="text-[10px] text-white/60">{img.aspect}</span>
                                 </div>
                              </div>
                           </div>
                        </motion.div>
                      ))}
                   </AnimatePresence>
                </div>
             )}
          </div>
        </div>
      </div>
    </AppShell>
  );
};

export default ImageStudioPage;

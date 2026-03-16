import React, { useState } from 'react';
import AppShell from '../../../components/layout/AppShell';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import {
   Film,
   Play,
   Settings2,
   Download,
   Share2,
   Trash2,
   Sparkles,
   Zap,
   Clock,
   Video
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const VideoStudioPage = () => {
  const [prompt, setPrompt] = useState('');
  const [motionScale, setMotionScale] = useState(5);
  const [duration, setDuration] = useState(4); // 4 or 8 seconds
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState([]);

  const handleGenerate = () => {
    if (!prompt) return;
    setIsLoading(true);
    setTimeout(() => {
      setResults(prev => [{
        id: Date.now(),
        thumbnail: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&q=80&w=800',
        prompt: prompt,
        duration: duration,
        motion: motionScale
      }, ...prev]);
      setIsLoading(false);
      setPrompt('');
    }, 3000);
  };

  return (
    <AppShell>
      <div className="max-w-[1400px] mx-auto p-6 md:p-8">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Left Panel: Video Settings */}
          <div className="w-full md:w-[400px] flex flex-col gap-6">
             <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-brand-gradient flex items-center justify-center text-white shadow-brand-glow">
                   <Film size={22} />
                </div>
                <div>
                   <h1 className="text-h4">Video Studio</h1>
                   <p className="text-[13px] text-text-muted">Powered by Gemini Veo 2</p>
                </div>
             </div>

             <Card className="p-6">
                <h3 className="text-sm font-bold text-text-primary mb-4 flex items-center gap-2">
                   <Sparkles size={16} className="text-brand-primary" />
                   Create Video
                </h3>
                
                <div className="flex flex-col gap-5">
                   <div className="flex flex-col gap-2">
                      <label className="text-[13px] text-text-secondary font-medium">Text to Video</label>
                      <textarea
                        className="w-full h-32 bg-bg-elevated border border-border-subtle rounded-sm p-4 text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-brand-primary transition-all resize-none"
                        placeholder="Cinematic drone shot of an alpine lake at sunset, mirror reflections..."
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                      />
                   </div>

                   <div className="space-y-4">
                      <div className="flex flex-col gap-3">
                         <div className="flex justify-between items-center text-[12px]">
                            <span className="text-text-secondary">Motion Scale ({motionScale})</span>
                            <span className="text-text-muted">High</span>
                         </div>
                         <input 
                           type="range" min="1" max="10" 
                           value={motionScale} 
                           onChange={(e) => setMotionScale(parseInt(e.target.value))}
                           className="w-full accent-brand-primary h-1.5 rounded-pill bg-bg-elevated appearance-none cursor-pointer"
                         />
                      </div>

                      <div className="flex flex-col gap-2">
                         <label className="text-[13px] text-text-secondary font-medium">Duration</label>
                         <div className="flex gap-2">
                            {[4, 8].map(d => (
                              <button
                                key={d}
                                onClick={() => setDuration(d)}
                                className={`flex-1 py-2 rounded-sm border text-xs font-medium transition-all ${duration === d ? 'bg-brand-primary/10 border-brand-primary text-brand-primary' : 'bg-bg-elevated border-border-subtle text-text-muted hover:border-border-default'}`}
                              >
                                {d} Seconds
                              </button>
                            ))}
                         </div>
                      </div>
                   </div>

                   <Button 
                     className="w-full mt-2" 
                     onClick={handleGenerate}
                     isLoading={isLoading}
                     icon={Video}
                   >
                     Generate Video
                   </Button>
                </div>
             </Card>

             <Card className="p-6">
                <h3 className="text-sm font-bold text-text-primary mb-4 flex items-center gap-2">
                   <Clock size={16} className="text-brand-primary" />
                   Quota & Usage
                </h3>
                <div className="p-3 bg-bg-elevated rounded-sm border border-border-subtle">
                   <div className="flex justify-between items-center mb-2">
                      <span className="text-[11px] text-text-muted uppercase tracking-wider">MONTHLY CREDITS</span>
                      <span className="text-[11px] text-text-primary font-bold">45/100</span>
                   </div>
                   <div className="w-full h-1.5 bg-bg-base rounded-full overflow-hidden">
                      <div className="h-full bg-brand-primary w-[45%] shadow-brand-glow" />
                   </div>
                </div>
             </Card>
          </div>

          {/* Right Panel: Canvas/Results */}
          <div className="flex-1 min-w-0">
             <div className="flex items-center justify-between mb-8">
                <h2 className="text-h4">Recent Generations</h2>
                <div className="flex items-center gap-2">
                   <span className="text-[12px] text-text-muted">Quality: HD (1080p)</span>
                </div>
             </div>

             {results.length === 0 ? (
                <div className="h-[500px] border-2 border-dashed border-border-subtle rounded-sm flex flex-col items-center justify-center text-center p-8">
                   <div className="w-16 h-16 rounded-full bg-bg-elevated flex items-center justify-center text-text-muted mb-4 group hover:bg-brand-primary/10 transition-colors">
                      <Video size={32} className="group-hover:text-brand-primary transition-colors" />
                   </div>
                   <h3 className="text-h4 mb-2">Create cinematic clips</h3>
                   <p className="text-text-muted max-w-[320px]">Generate up to 8 seconds of photorealistic AI video from single prompts.</p>
                </div>
             ) : (
                <div className="grid grid-cols-1 gap-8">
                   <AnimatePresence>
                      {results.map((vid) => (
                        <motion.div
                          key={vid.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-bg-surface border border-border-subtle rounded-lg overflow-hidden"
                        >
                           <div className="relative aspect-video bg-black group">
                              <img src={vid.thumbnail} alt={vid.prompt} className="w-full h-full object-cover opacity-60" />
                              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                 <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/40">
                                    <Play size={28} className="ml-1" />
                                 </div>
                              </div>
                              <div className="absolute top-4 right-4 flex gap-2">
                                 <button className="w-8 h-8 rounded-sm bg-black/40 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/60 transition-all">
                                    <Download size={16} />
                                 </button>
                                 <button className="w-8 h-8 rounded-sm bg-semantic-danger/40 backdrop-blur-md flex items-center justify-center text-semantic-danger hover:bg-semantic-danger/60 transition-all">
                                    <Trash2 size={16} />
                                 </button>
                              </div>
                              <div className="absolute bottom-4 left-4 flex gap-2">
                                 <span className="px-2 py-0.5 bg-black/60 backdrop-blur-sm border border-white/20 rounded-full text-[10px] text-white font-mono">{vid.duration}s</span>
                                 <span className="px-2 py-0.5 bg-brand-primary/60 backdrop-blur-sm border border-brand-primary/20 rounded-full text-[10px] text-white font-bold">VEO 2</span>
                              </div>
                           </div>
                           <div className="p-4 flex items-center justify-between">
                              <p className="text-sm text-text-secondary truncate pr-8">{vid.prompt}</p>
                              <div className="flex items-center gap-3">
                                 <Share2 size={16} className="text-text-muted cursor-pointer hover:text-text-primary" />
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

export default VideoStudioPage;

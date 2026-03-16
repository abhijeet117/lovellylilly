import React from 'react';
import { motion } from 'framer-motion';
import { Globe, Image as ImageIcon, Film, Code, MessageSquare, Search, CheckCircle, Play, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Logo from '../components/ui/Logo';
import ParticleRing from '../components/ui/ParticleRing';

const FeatureCard = ({ icon: Icon, title, description, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay: index * 0.1 }}
    viewport={{ once: true }}
  >
    <Card className="h-full p-8">
      <div className="w-12 h-12 rounded-xl bg-ion-blue/10 flex items-center justify-center mb-5">
        <Icon size={24} className="text-ion-blue" />
      </div>
      <h4 className="text-[18px] font-bold text-zero-white mb-3">{title}</h4>
      <p className="text-[14px] text-lunar-gray leading-relaxed">{description}</p>
    </Card>
  </motion.div>
);

const LandingPage = () => {
  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: 'var(--color-void)' }}>
      <Navbar />

      {/* ── HERO SECTION ── */}
      <section className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden">
        <ParticleRing size={800} className="z-0" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_50%_at_50%_40%,rgba(66,133,244,0.06),transparent)] pointer-events-none" />

        <div className="relative z-10 text-center max-w-3xl mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-label text-ion-blue mb-8"
          >
            LOVELYLILLY AI
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-hero text-zero-white leading-[1.1] font-extrabold tracking-[-2.5px] mb-8"
          >
            Search. Create.<br />Think with AI.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-[16px] text-lunar-gray leading-relaxed max-w-[560px] mx-auto mb-10"
          >
            A Perplexity-style AI workspace. Real-time web search, image & video generation, website building, and document intelligence — all in one dark-mode studio.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8"
          >
            <Link to="/signup">
              <Button size="lg">Start for Free</Button>
            </Link>
            <Button variant="ghost" size="lg" icon={Play}>Watch Demo</Button>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-label text-crater-gray"
          >
            Powered by GPT-4o · Claude · Gemini
          </motion.p>
        </div>
      </section>

      {/* ── FEATURE GRID ── */}
      <section id="features" className="py-32 px-6">
        <div className="max-w-[960px] mx-auto">
          <div className="text-center mb-16">
            <p className="text-label text-ion-blue mb-4">CAPABILITIES</p>
            <h2 className="text-h1 text-zero-white mb-4">Everything in one workspace.</h2>
            <p className="text-lunar-gray text-[16px]">One platform for AI search, creation, and document intelligence.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <FeatureCard
              icon={Globe}
              title="AI Chat + Web Search"
              description="Real-time web results with inline citations from trusted sources. Stream answers as they generate."
              index={0}
            />
            <FeatureCard
              icon={ImageIcon}
              title="Image Studio"
              description="Gemini Imagen 3 powered studio. Multiple aspect ratios, style presets, and history gallery."
              index={1}
            />
            <FeatureCard
              icon={Film}
              title="Video Studio"
              description="Generate cinematic video clips with Gemini Veo 2. Async polling with real-time status pipeline."
              index={2}
            />
            <FeatureCard
              icon={Code}
              title="Website Builder + Document Chat"
              description="Build complete websites from text or chat with your PDFs, DOCX, and spreadsheets."
              index={3}
            />
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-32 px-6" style={{ background: 'rgba(13,17,32,0.5)' }}>
        <div className="max-w-[960px] mx-auto text-center">
          <p className="text-label text-ion-blue mb-4">HOW IT WORKS</p>
          <h2 className="text-h1 text-zero-white mb-16">From question to answer in seconds.</h2>

          <div className="grid md:grid-cols-3 gap-12 relative">
            {[
              { icon: MessageSquare, title: 'Ask or Upload', desc: 'Type your question or upload a document to analyze' },
              { icon: Search, title: 'AI Searches & Creates', desc: 'Langchain routes to the best model and searches the web' },
              { icon: CheckCircle, title: 'Get Sourced Results', desc: 'Receive cited, accurate, streaming answers instantly' },
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15 }}
                viewport={{ once: true }}
                className="flex flex-col items-center relative z-10"
              >
                <div className="w-16 h-16 rounded-2xl bg-ion-blue/10 flex items-center justify-center mb-6">
                  <step.icon size={28} className="text-ion-blue" />
                </div>
                <h4 className="text-[18px] font-bold text-zero-white mb-3">{step.title}</h4>
                <p className="text-lunar-gray text-[14px] max-w-[240px]">{step.desc}</p>
              </motion.div>
            ))}
            <div className="hidden md:block absolute top-8 left-[20%] right-[20%] h-px border-t-2 border-dashed border-stardust" />
          </div>
        </div>
      </section>

      {/* ── STATS ROW ── */}
      <section className="py-20 px-6 border-y border-stardust" style={{ background: 'var(--color-nebula)' }}>
        <div className="max-w-[960px] mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { val: '50M+', label: 'AI Queries Answered' },
              { val: '99.9%', label: 'Platform Uptime SLA' },
              { val: '<2s', label: 'Average Response Time' },
              { val: '4', label: 'AI Generation Studios' },
            ].map((stat, i) => (
              <div key={i} className={`flex flex-col items-center px-4 ${i < 3 ? 'md:border-r border-stardust' : ''}`}>
                <span className="text-h1 gradient-text font-extrabold mb-2">{stat.val}</span>
                <span className="text-label text-lunar-gray">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-ion-blue/[0.03] to-transparent" />
        <div className="max-w-[640px] mx-auto text-center relative z-10">
          <h2 className="text-h1 text-zero-white mb-6">Your AI workspace starts today.</h2>
          <p className="text-lunar-gray text-[16px] mb-10">Free plan includes 100 queries/month. No credit card required.</p>
          <div className="relative inline-block group">
            <div className="absolute -inset-6 bg-ion-blue/15 blur-2xl group-hover:bg-ion-blue/25 transition-all duration-300 rounded-full" />
            <Link to="/signup">
              <Button size="lg" className="relative h-14 px-10 text-[16px]">Create Free Account</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="pt-20 pb-10 px-6 border-t border-stardust" style={{ background: 'var(--color-void)' }}>
        <div className="max-w-[960px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div>
              <Logo size="md" className="mb-6" />
              <p className="text-crater-gray text-[14px] leading-relaxed">
                The ultimate workspace for AI productivity, creation, and research.
              </p>
            </div>
            {[
              { title: 'Product', links: ['AI Search', 'Studios', 'Doc Vault', 'Pricing'] },
              { title: 'Resources', links: ['Documentation', 'API', 'Community', 'Blog'] },
              { title: 'Legal', links: ['Terms', 'Privacy', 'Cookies'] },
            ].map((col, i) => (
              <div key={i}>
                <h5 className="text-label text-lunar-gray mb-5">{col.title.toUpperCase()}</h5>
                <ul className="flex flex-col gap-3">
                  {col.links.map(link => (
                    <li key={link} className="text-[14px] text-crater-gray hover:text-zero-white cursor-pointer transition-colors">
                      {link}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="pt-8 border-t border-stardust flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-crater-gray text-[13px]">© 2025 LovellyLilly AI. All rights reserved.</p>
            <p className="text-crater-gray text-[13px]">
              Powered by <span className="text-lunar-gray font-semibold">Gemini & Langchain</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

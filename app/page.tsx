'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, TrendingUp, Search, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import ChatInterface from '@/components/ChatInterface';

const SUGGESTIONS = [
  "Uber for Dog Walking",
  "AI-powered Trash Can",
  "Airbnb for Swimming Pools",
  "Social Network for Introverts"
];

export default function Home() {
  const [idea, setIdea] = useState('');
  const [hasStarted, setHasStarted] = useState(false);

  const handleSubmit = () => {
    if (!idea.trim()) return;
    setHasStarted(true);
  };

  return (
    <main className="min-h-screen bg-[#09090b] text-white overflow-hidden selection:bg-blue-500/30">
      
      {/* Background Gradients */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 h-screen flex flex-col">
        
        {/* Header */}
        <header className="p-6 flex items-center justify-between border-b border-white/5 bg-[#09090b]/50 backdrop-blur-md">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span>First<span className="text-blue-500">Step</span></span>
          </div>
          <div className="flex gap-4 text-sm text-zinc-400">
            <span className="hover:text-white cursor-pointer transition">History</span>
            <span className="hover:text-white cursor-pointer transition">Settings</span>
          </div>
        </header>

        {/* Main Content Area */}
        <AnimatePresence mode="wait">
          {!hasStarted ? (
            <motion.div 
              key="landing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex-1 flex flex-col items-center justify-center p-4 max-w-3xl mx-auto w-full text-center"
            >
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 bg-gradient-to-b from-white to-zinc-400 bg-clip-text text-transparent">
                What will you build today?
              </h1>
              <p className="text-zinc-400 mb-10 text-lg">
                Validate your startup idea with a swarm of AI agents. <br />
                Real-time market analysis, competitor scouting, and financial modeling.
              </p>

              {/* Big Input Box */}
              <div className="w-full relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl opacity-20 group-hover:opacity-40 transition duration-500 blur"></div>
                <div className="relative bg-[#09090b] rounded-xl border border-white/10 p-2 shadow-2xl">
                  <Textarea 
                    value={idea}
                    onChange={(e) => setIdea(e.target.value)}
                    placeholder="Describe your startup idea..."
                    className="min-h-[120px] bg-transparent border-none text-lg resize-none focus-visible:ring-0 placeholder:text-zinc-600"
                    onKeyDown={(e) => {
                      if(e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSubmit();
                      }
                    }}
                  />
                  <div className="flex justify-between items-center px-2 pb-2 mt-2">
                    <div className="text-xs text-zinc-500 flex items-center gap-2">
                      <span className="bg-white/5 px-2 py-1 rounded border border-white/5">⌘ + Enter</span>
                      to run
                    </div>
                    <Button 
                      onClick={handleSubmit}
                      className="bg-blue-600 hover:bg-blue-500 text-white font-medium px-6"
                    >
                      Validate Idea <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Suggestions */}
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => { setIdea(s); }}
                    className="text-sm px-4 py-2 rounded-full bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/20 transition text-zinc-400 hover:text-white"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </motion.div>
          ) : (
            <ChatInterface initialIdea={idea} onReset={() => setHasStarted(false)} />
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Loader2, CheckCircle2, CircleDashed, Terminal, ArrowLeft } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useKestra } from '@/hooks/useKestra'; 
import { AgentCard } from './AgentCard'; 

interface ChatInterfaceProps {
  initialIdea: string;
  onReset: () => void;
}

export default function ChatInterface({ initialIdea, onReset }: ChatInterfaceProps) {
  const { startValidation, results, loading } = useKestra();
  const hasStartedRef = useRef(false);

  useEffect(() => {
    if (!hasStartedRef.current) {
      startValidation(initialIdea);
      hasStartedRef.current = true;
    }
  }, [initialIdea, startValidation]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex h-full overflow-hidden"
    >
      {/* Sidebar */}
      <aside className="w-80 border-r border-white/5 bg-[#09090b]/50 backdrop-blur-xl hidden md:flex flex-col">
        <div className="p-4 border-b border-white/5">
          <button onClick={onReset} className="flex items-center text-sm text-zinc-400 hover:text-white transition mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </button>
          <h2 className="font-semibold text-white">Validation Protocol</h2>
          <p className="text-xs text-zinc-500 mt-1">Execution ID: #8X29-A</p>
        </div>
        <div className="p-4 space-y-4">
          <StatusStep label="Gathering Intelligence" status={results.detective ? 'done' : 'active'} />
          <StatusStep label="Competitor Analysis" status={results.detective ? 'done' : 'waiting'} />
          <StatusStep label="Financial Modeling" status={results.cfo ? 'done' : 'waiting'} />
          <StatusStep label="Risk Assessment" status={results.skeptic ? 'done' : 'waiting'} />
          <StatusStep label="Final Verdict" status={results.memo ? 'done' : 'waiting'} />
        </div>
        
        <div className="mt-auto p-4 border-t border-white/5 bg-black/20">
           <div className="flex items-center gap-2 text-xs text-zinc-500">
              <Terminal className="w-4 h-4" />
              <span className="font-mono">kestra-agent-swarm v2.1</span>
           </div>
        </div>
      </aside>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-[#09090b] relative">
        <ScrollArea className="flex-1 p-4 md:p-8">
          <div className="max-w-3xl mx-auto space-y-8 pb-20">
            
            {/* User Message */}
            <div className="flex justify-end">
              <div className="bg-blue-600/10 border border-blue-500/20 text-blue-100 rounded-2xl rounded-tr-sm px-6 py-4 max-w-[80%]">
                <p className="text-sm font-medium text-blue-400 mb-1">Target Idea</p>
                <p className="text-lg">{initialIdea}</p>
              </div>
            </div>

            {/* Agent Responses */}
            {/* Note: TypeScript now knows 'results.detective' is string | undefined */}
            
            {results.detective && (
               <AgentCard 
                 title="The Detective" 
                 icon="search" 
                 content={results.detective} 
                 color="blue"
               />
            )}

            {results.cfo && (
              <AgentCard 
                title="The CFO" 
                icon="dollar" 
                content={results.cfo} 
                color="green"
                isTable={true} 
              />
            )}

             {results.skeptic && (
              <AgentCard 
                title="The Skeptic" 
                icon="shield" 
                content={results.skeptic} 
                color="red"
              />
            )}

             {results.strategist && (
              <AgentCard 
                title="The Pivot Master" 
                icon="chess" 
                content={results.strategist} 
                color="purple"
              />
            )}

            {results.memo && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gradient-to-br from-zinc-900 to-black border border-white/10 rounded-xl p-8 shadow-2xl ring-1 ring-white/10"
              >
                <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
                   <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-black font-bold text-lg">
                      VC
                   </div>
                   <div>
                      <h3 className="text-xl font-bold text-white">Investment Memo</h3>
                      <p className="text-sm text-zinc-400">Sequoia Capital Simulation</p>
                   </div>
                </div>
                <div className="prose prose-invert max-w-none prose-headings:text-zinc-200 prose-p:text-zinc-400">
                  <pre className="whitespace-pre-wrap font-sans">{results.memo}</pre>
                </div>
              </motion.div>
            )}

            {loading && !results.memo && (
               <div className="flex items-center gap-3 text-zinc-500 animate-pulse">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Agents are thinking...</span>
               </div>
            )}

          </div>
        </ScrollArea>
      </div>
    </motion.div>
  );
}

// 4. Strictly Typed Helper Component
interface StatusStepProps {
  label: string;
  status: 'waiting' | 'active' | 'done';
}

function StatusStep({ label, status }: StatusStepProps) {
  return (
    <div className={`flex items-center gap-3 text-sm ${status === 'waiting' ? 'opacity-40' : 'opacity-100'}`}>
      {status === 'done' ? (
        <CheckCircle2 className="w-5 h-5 text-green-500" />
      ) : status === 'active' ? (
        <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
      ) : (
        <CircleDashed className="w-5 h-5 text-zinc-600" />
      )}
      <span className={status === 'active' ? 'text-blue-400 font-medium' : 'text-zinc-300'}>{label}</span>
    </div>
  );
}
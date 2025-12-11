'use client';
import { motion } from 'framer-motion';
import { Search, TrendingUp, ShieldAlert, DollarSign, BrainCircuit, LucideIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';
import ReactMarkdown from 'react-markdown'; 
import remarkGfm from 'remark-gfm'; // <--- 1. Import this

// 1. Define Valid Keys
type IconKey = 'search' | 'dollar' | 'shield' | 'chess' | 'trend';
type ColorKey = 'blue' | 'green' | 'red' | 'purple';

// 2. Define Props Interface
interface AgentCardProps {
  title: string;
  icon: string; 
  content: string;
  color?: ColorKey; 
  isTable?: boolean;
}

// 3. Typed Maps
const ICONS: Record<string, LucideIcon> = {
  search: Search,
  dollar: DollarSign,
  shield: ShieldAlert,
  chess: BrainCircuit,
  trend: TrendingUp
};

const COLORS: Record<string, string> = {
  blue: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  green: "bg-green-500/10 text-green-400 border-green-500/20",
  red: "bg-red-500/10 text-red-400 border-red-500/20",
  purple: "bg-purple-500/10 text-purple-400 border-purple-500/20",
};

export function AgentCard({ title, icon, content, color = "blue", isTable = false }: AgentCardProps) {
  const Icon = ICONS[icon] || Search;
  const theme = COLORS[color] || COLORS.blue;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="bg-[#0c0c0e] border border-white/5 overflow-hidden">
        
        {/* Card Header */}
        <div className={`px-6 py-4 border-b border-white/5 flex items-center gap-3 ${theme}`}>
          <div className="p-2 rounded-lg bg-black/20">
            <Icon className="w-5 h-5" />
          </div>
          <span className="font-semibold tracking-wide">{title}</span>
        </div>

        {/* Card Content */}
        <div className="p-6 text-sm text-zinc-300 leading-relaxed">
          {isTable ? (
            <div className="overflow-x-auto">
               <ReactMarkdown 
                 remarkPlugins={[remarkGfm]} // <--- 2. Enable Tables
                 components={{
                    table: ({node, ...props}) => (
                      <table className="w-full text-left border-collapse my-4" {...props} />
                    ),
                    thead: ({node, ...props}) => (
                      <thead className="bg-white/5" {...props} />
                    ),
                    th: ({node, ...props}) => (
                      <th className="border-b border-white/10 p-3 font-semibold text-zinc-100" {...props} />
                    ),
                    td: ({node, ...props}) => (
                      <td className="border-b border-white/5 p-3 text-zinc-400" {...props} />
                    )
                 }}
               >
                 {content}
               </ReactMarkdown>
            </div>
          ) : (
            // 3. Add 'prose' classes to style Lists, Headings, and Bold text
            <div className="prose prose-invert prose-sm max-w-none 
              prose-p:text-zinc-300 
              prose-headings:text-zinc-100 prose-headings:font-bold prose-headings:mt-4 prose-headings:mb-2
              prose-strong:text-white prose-strong:font-semibold
              prose-ul:list-disc prose-ul:pl-4 prose-ul:my-2
              prose-li:text-zinc-300 prose-li:my-1"
            >
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {content}
              </ReactMarkdown>
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
}
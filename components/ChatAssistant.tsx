
import React, { useState, useRef, useEffect } from 'react';
import { getAcademicAssistantResponse } from '../services/geminiService';
import { Message, User, Report } from '../types';
import { Icons } from '../constants';

interface ChatAssistantProps {
  t: any;
  currentUser: User;
  onReport: (report: Omit<Report, 'id' | 'timestamp' | 'status'>) => void;
}

const ChatAssistant: React.FC<ChatAssistantProps> = ({ t, currentUser, onReport }) => {
  const [messages, setMessages] = useState<(Message & { sources?: any[] })[]>([
    { role: 'model', text: 'Welcome to "Ask Cyber". I am your academic AI engine with real-time search capabilities. How can I help you today?', timestamp: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAudit, setIsAudit] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    if (input.toLowerCase().includes('report') || input.toLowerCase().includes('بلاغ') || input.toLowerCase().includes('شكوى')) {
       onReport({ reporterId: currentUser.id, reporterName: currentUser.name, targetId: 'AI Chat', targetTitle: 'Direct Complaint', targetType: 'Complaint', reason: input });
       setMessages(prev => [...prev, { role: 'user', text: input, timestamp: new Date() }, { role: 'model', text: 'Thank you. Your report has been submitted to the Owner, Faculty, and Experts for immediate action.', timestamp: new Date() }]);
       setInput('');
       return;
    }

    const prompt = isAudit ? `SECURITY AUDIT THIS CODE AND SEARCH FOR RELEVANT CVEs: \n\n${input}` : input;
    setMessages(prev => [...prev, { role: 'user', text: input, timestamp: new Date() }]);
    setInput('');
    setIsLoading(true);

    const result = await getAcademicAssistantResponse(prompt, messages.map(m => ({ role: m.role, parts: [{ text: m.text }] })));
    setMessages(prev => [...prev, { role: 'model', text: result.text || '', sources: result.sources, timestamp: new Date() }]);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-[75vh] bg-white dark:bg-slate-900/50 rounded-3xl overflow-hidden border border-slate-200 dark:border-cyan-500/20 shadow-2xl">
      <div className="p-6 border-b border-white/10 flex items-center justify-between cyber-gradient">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-lg flex items-center justify-center"><Icons.Robot className="w-8 h-8 text-white" /></div>
          <div><h2 className="text-white font-bold text-lg font-orbitron">{t.askCyber}</h2><p className="text-white/70 text-[9px] uppercase tracking-widest font-black">AI Engineering Brain</p></div>
        </div>
        <button onClick={() => setIsAudit(!isAudit)} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${isAudit ? 'bg-red-500 text-white' : 'bg-white/10 text-white'}`}>{isAudit ? t.auditMode : t.generalChat}</button>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50 dark:bg-slate-950/30">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-4 rounded-3xl shadow-lg ${m.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-200 rounded-tl-none prose prose-slate dark:prose-invert prose-sm'}`}>
              <div className="leading-relaxed whitespace-pre-wrap">{m.text}</div>
              {m.sources && m.sources.length > 0 && (
                <div className="mt-4 pt-4 border-t border-white/10">
                  <p className="text-[10px] font-black text-cyan-500 uppercase mb-2">{t.sources}</p>
                  <div className="flex flex-col gap-1">
                    {m.sources.map((src, idx) => (
                      <a key={idx} href={src.web?.uri} target="_blank" rel="noopener noreferrer" className="text-[10px] text-blue-400 hover:underline flex items-center gap-1">
                        <Icons.Globe className="w-3 h-3" /> {src.web?.title || 'External Source'}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
             <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl animate-pulse flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-cyan-500 animate-bounce" />
                <div className="w-2 h-2 rounded-full bg-cyan-500 animate-bounce delay-75" />
                <div className="w-2 h-2 rounded-full bg-cyan-500 animate-bounce delay-150" />
             </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/80 backdrop-blur-xl">
        <div className="relative">
          <textarea value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }} placeholder={isAudit ? t.placeholderAudit : t.placeholderAI} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-2xl py-4 px-6 pr-16 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 text-slate-900 dark:text-white min-h-[60px] max-h-[150px] resize-none" />
          <button onClick={handleSend} disabled={isLoading || !input.trim()} className="absolute right-3 bottom-3 h-12 w-12 flex items-center justify-center cyber-gradient rounded-xl text-white disabled:opacity-50"><svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg></button>
        </div>
      </div>
    </div>
  );
};

export default ChatAssistant;

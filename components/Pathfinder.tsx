
import React, { useState } from 'react';
import { recommendLearningPath } from '../services/geminiService';
import { Icons } from '../constants';

interface PathfinderProps {
  t: any;
}

const Pathfinder: React.FC<PathfinderProps> = ({ t }) => {
  const [goal, setGoal] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [roadmap, setRoadmap] = useState<any>(null);

  const handleGenerate = async () => {
    if (!goal.trim() || isLoading) return;
    setIsLoading(true);
    const result = await recommendLearningPath(goal);
    setRoadmap(result);
    setIsLoading(false);
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-20">
      <div className="max-w-3xl text-start">
        <h2 className="text-4xl font-bold font-orbitron text-cyan-500">{t.pathfinderTitle}</h2>
        <p className="text-slate-500 mt-4 text-lg leading-relaxed">{t.pathfinderDesc}</p>
      </div>

      <div className="glass p-10 rounded-[3rem] border-white/5 shadow-2xl space-y-8">
        <div className="flex flex-col md:flex-row gap-6">
          <input 
            value={goal}
            onChange={e => setGoal(e.target.value)}
            placeholder="e.g. 'I want to specialize in AI-driven cybersecurity for cloud infrastructures'"
            className="flex-1 bg-slate-900 border border-white/10 rounded-2xl px-8 py-5 text-white outline-none focus:ring-2 ring-cyan-500/30"
          />
          <button 
            onClick={handleGenerate}
            disabled={isLoading || !goal.trim()}
            className="cyber-gradient px-12 py-5 rounded-2xl text-white font-black text-xs uppercase tracking-widest shadow-2xl hover:scale-105 transition-all disabled:opacity-50"
          >
            {isLoading ? 'Processing Neural Path...' : t.generatePath}
          </button>
        </div>
      </div>

      {roadmap && (
        <div className="space-y-10 animate-in slide-in-from-bottom-10 duration-700">
           <div className="cyber-gradient p-12 rounded-[4rem] text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-12 opacity-10 text-[180px]"><Icons.Robot /></div>
              <div className="relative z-10">
                 <h3 className="text-3xl font-bold font-orbitron mb-4">{roadmap.title}</h3>
                 <p className="text-white/80 text-lg leading-relaxed max-w-2xl">{roadmap.description}</p>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {roadmap.steps.map((step: any, idx: number) => (
                <div key={idx} className="glass p-8 rounded-[3rem] border-white/5 flex gap-8 group hover:border-cyan-500/30 transition-all">
                   <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 flex items-center justify-center shrink-0 border border-cyan-500/20 shadow-inner">
                      <span className="text-2xl font-black text-cyan-500">{idx + 1}</span>
                   </div>
                   <div className="text-start">
                      <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-1 block">{step.type}</span>
                      <h4 className="text-xl font-bold mb-2 group-hover:text-cyan-400 transition-colors">{step.label}</h4>
                      <p className="text-slate-400 text-sm leading-relaxed">{step.description}</p>
                   </div>
                </div>
              ))}
           </div>
        </div>
      )}
    </div>
  );
};

export default Pathfinder;

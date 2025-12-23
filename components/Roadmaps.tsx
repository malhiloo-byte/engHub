
import React, { useState } from 'react';
import { Roadmap, User } from '../types';
import { MOCK_ROADMAPS, Icons } from '../constants';

interface RoadmapsProps {
  currentUser: User;
  onUpdateProgress: (stepId: string) => void;
  t: any;
}

const Roadmaps: React.FC<RoadmapsProps> = ({ currentUser, onUpdateProgress, t }) => {
  const [selectedRoadmap, setSelectedRoadmap] = useState<Roadmap | null>(null);

  const calculateProgress = (roadmap: Roadmap) => {
    const completed = roadmap.steps.filter(s => currentUser.completedRoadmapSteps?.includes(s.id)).length;
    return (completed / roadmap.steps.length) * 100;
  };

  if (selectedRoadmap) {
    const progress = calculateProgress(selectedRoadmap);
    return (
      <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-8">
        <button 
          onClick={() => setSelectedRoadmap(null)}
          className="flex items-center space-x-2 space-x-reverse text-slate-500 hover:text-cyan-500 transition-colors font-bold"
        >
          <div className="rtl:rotate-0 ltr:rotate-180"><Icons.ChevronRight /></div>
          <span>{t.roadmapsTitle}</span>
        </button>

        <div className="cyber-gradient p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
           <div className="absolute -right-10 -bottom-10 opacity-10 text-[150px]">{selectedRoadmap.icon}</div>
           <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="max-w-xl">
                 <h2 className="text-4xl font-bold font-orbitron mb-4">{selectedRoadmap.title}</h2>
                 <p className="text-white/80 leading-relaxed">{selectedRoadmap.description}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-xl p-8 rounded-[2rem] border border-white/20 text-center min-w-[200px]">
                 <div className="text-4xl font-black mb-1">{Math.round(progress)}%</div>
                 <div className="text-[10px] font-bold uppercase tracking-widest text-white/60">{t.stepsCompleted}</div>
                 <div className="w-full h-1.5 bg-white/10 rounded-full mt-4 overflow-hidden">
                    <div className="h-full bg-white shadow-[0_0_10px_white] transition-all duration-1000" style={{ width: `${progress}%` }} />
                 </div>
              </div>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
           {selectedRoadmap.steps.map((step, idx) => {
             const isCompleted = currentUser.completedRoadmapSteps?.includes(step.id);
             return (
               <div 
                 key={step.id} 
                 className={`group p-6 rounded-[2rem] border transition-all flex items-start space-x-6 space-x-reverse ${isCompleted ? 'bg-emerald-500/5 border-emerald-500/30' : 'glass border-white/5 hover:border-cyan-500/30'}`}
               >
                  <div className="flex flex-col items-center space-y-2">
                    <button 
                      onClick={() => onUpdateProgress(step.id)}
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${isCompleted ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' : 'bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-400 group-hover:text-cyan-500'}`}
                    >
                      {isCompleted ? <Icons.Check className="w-6 h-6" /> : <span className="font-black text-sm">{idx + 1}</span>}
                    </button>
                    <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500">{step.type}</span>
                  </div>
                  <div className="flex-1">
                     <h4 className={`font-bold text-lg mb-1 ${isCompleted ? 'text-emerald-600 dark:text-emerald-400' : ''}`}>{step.label}</h4>
                     <p className="text-sm text-slate-500">{step.description}</p>
                  </div>
               </div>
             );
           })}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="max-w-3xl">
        <h2 className="text-4xl font-bold font-orbitron">{t.roadmapsTitle}</h2>
        <p className="text-slate-500 mt-2 text-lg">{t.roadmapsDesc}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {MOCK_ROADMAPS.map(roadmap => {
          const progress = calculateProgress(roadmap);
          return (
            <div 
              key={roadmap.id}
              onClick={() => setSelectedRoadmap(roadmap)}
              className="group glass rounded-[3rem] p-10 border-white/5 hover:border-cyan-500/30 transition-all duration-500 cursor-pointer relative overflow-hidden flex flex-col h-full hover:-translate-y-2 shadow-xl hover:shadow-cyan-500/10"
            >
              <div className="absolute top-0 right-0 p-10 text-6xl opacity-5 group-hover:opacity-10 transition-opacity">{roadmap.icon}</div>
              <div className="flex items-center space-x-4 space-x-reverse mb-6">
                <div className="w-16 h-16 rounded-[1.5rem] bg-cyan-500/10 flex items-center justify-center text-3xl shadow-inner">
                  {roadmap.icon}
                </div>
                <div>
                   <span className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-500">{roadmap.category}</span>
                   <h3 className="text-2xl font-bold font-orbitron group-hover:text-cyan-400 transition-colors">{roadmap.title}</h3>
                </div>
              </div>
              <p className="text-slate-500 dark:text-slate-400 mb-8 flex-1 leading-relaxed">{roadmap.description}</p>
              
              <div className="space-y-3">
                 <div className="flex justify-between items-end">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{t.stepsCompleted}</span>
                    <span className="text-xs font-black text-cyan-500">{Math.round(progress)}%</span>
                 </div>
                 <div className="w-full h-2 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full cyber-gradient transition-all duration-1000" style={{ width: `${progress}%` }} />
                 </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Roadmaps;

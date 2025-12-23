
import React, { useState } from 'react';
import { Icons } from '../constants';
import { ProjectIdea, User } from '../types';

interface CoordinationProps {
  projects: ProjectIdea[];
  currentUser: User;
  onJoinToggle: (id: string) => void;
  onAddProject: (p: ProjectIdea) => void;
  t: any;
}

const Coordination: React.FC<CoordinationProps> = ({ projects, currentUser, onJoinToggle, onAddProject, t }) => {
  const [activeSubTab, setActiveSubTab] = useState<'projects' | 'events'>('projects');
  const [showAddModal, setShowAddModal] = useState(false);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');

  const canPropose = currentUser.role !== 'Student';

  const handleSubmit = () => {
    if (!title || !desc) return;
    onAddProject({
      id: `p-${Date.now()}`, title, description: desc, proposerName: currentUser.name, proposerId: currentUser.id, proposerRole: currentUser.role,
      requiredSkills: ['Engineering'], slots: 3, filledSlots: 0, category: 'Side Project', status: 'Open'
    });
    setShowAddModal(false);
    setTitle('');
    setDesc('');
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-10 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div><h2 className="text-4xl font-bold font-orbitron">{t.coordination}</h2><p className="text-slate-500 mt-2">Academic collaboration and industrial project pipeline.</p></div>
        <div className="flex bg-white dark:bg-white/5 p-1 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm">
          <button onClick={() => setActiveSubTab('projects')} className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeSubTab === 'projects' ? 'bg-cyan-500 text-white shadow-lg' : 'text-slate-500'}`}>Project Center</button>
          <button onClick={() => setActiveSubTab('events')} className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeSubTab === 'events' ? 'bg-cyan-500 text-white shadow-lg' : 'text-slate-500'}`}>Events Hub</button>
        </div>
      </div>

      {activeSubTab === 'projects' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.map(p => (
                <ProjectCard key={p.id} project={p} onToggle={() => onJoinToggle(p.id)} isJoined={currentUser.joinedProjects?.includes(p.id)} t={t} />
              ))}
            </div>
          </div>
          <div className="space-y-6">
             <div className="glass p-8 rounded-[2.5rem] border-cyan-500/20 shadow-xl sticky top-8">
                <h3 className="font-orbitron font-bold text-lg mb-4 text-cyan-500">Innovation Hub</h3>
                <p className="text-sm text-slate-500 mb-6 leading-relaxed">Collaborative projects proposed for engineering excellence.</p>
                {canPropose ? (
                  <button onClick={() => setShowAddModal(true)} className="w-full cyber-gradient py-3.5 rounded-2xl font-bold text-white shadow-xl hover:scale-105 transition-all">{t.proposeIdea}</button>
                ) : (
                  <div className="bg-slate-900/50 p-4 rounded-2xl border border-white/5 text-[10px] text-slate-500 font-bold uppercase tracking-widest text-center">Only Experts/Faculty can propose new projects</div>
                )}
             </div>
          </div>
        </div>
      )}

      {activeSubTab === 'events' && (
        <div className="glass p-10 rounded-[3rem] border-white/5 bg-gradient-to-br from-white/5 to-transparent relative overflow-hidden">
           <h3 className="text-2xl font-bold font-orbitron mb-6">{t.upcomingEvents}</h3>
           <div className="space-y-6">
              <TimelineItem date="Nov 24" title="Cyber War Games - CTF Finals" type="Competition" />
              <TimelineItem date="Dec 10" title="AI Ethics Research Symposium" type="Academic Summit" />
              <TimelineItem date="Dec 15" title="Industry Networking Mixer" type="Career Event" />
           </div>
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
           <div className="glass w-full max-w-xl p-8 rounded-[3rem] border-cyan-500/30 shadow-2xl space-y-6 animate-in zoom-in duration-300">
              <h2 className="text-2xl font-bold font-orbitron">{t.proposeIdea}</h2>
              <div className="space-y-4">
                 <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Project Title" className="w-full bg-slate-900 border border-white/10 rounded-2xl px-6 py-4 text-white" />
                 <textarea value={desc} onChange={e => setDesc(e.target.value)} placeholder="Describe goals and requirements..." rows={4} className="w-full bg-slate-900 border border-white/10 rounded-2xl px-6 py-4 text-white resize-none" />
              </div>
              <div className="flex space-x-4">
                <button onClick={handleSubmit} className="flex-1 cyber-gradient py-4 rounded-2xl font-bold text-white shadow-lg">Post Project</button>
                <button onClick={() => setShowAddModal(false)} className="px-8 py-4 rounded-2xl border border-white/10 font-bold">Cancel</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

const ProjectCard: React.FC<{ project: ProjectIdea, onToggle: () => void, isJoined: boolean | undefined, t: any }> = ({ project, onToggle, isJoined, t }) => {
  const progress = (project.filledSlots / project.slots) * 100;
  return (
    <div className="glass p-6 rounded-[2.5rem] border-white/10 hover:border-cyan-500/50 transition-all group relative overflow-hidden h-full flex flex-col">
       <div className="flex justify-between items-start mb-4">
          <div><h4 className="font-bold text-lg group-hover:text-cyan-400 transition-colors">{project.title}</h4><p className="text-[10px] text-slate-500">By <span className="text-cyan-500 font-bold">{project.proposerName}</span> <span className="text-[8px] bg-white/5 px-1.5 py-0.5 rounded ml-1 uppercase">{project.proposerRole}</span></p></div>
          <div className={`w-3 h-3 rounded-full ${project.status === 'Open' ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
       </div>
       <p className="text-sm text-slate-400 mb-6 leading-relaxed line-clamp-3 flex-1">{project.description}</p>
       <div className="mb-6 space-y-3">
          <div className="flex justify-between items-end"><span className="text-[10px] font-bold text-slate-500 uppercase">{t.teamSlots}</span><span className="text-xs font-black text-cyan-500">{project.filledSlots} / {project.slots}</span></div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden"><div className="h-full cyber-gradient transition-all duration-1000" style={{ width: `${progress}%` }} /></div>
       </div>
       <button onClick={onToggle} className={`w-full py-3 rounded-2xl text-[10px] font-black uppercase transition-all ${isJoined ? 'bg-red-500 text-white' : 'bg-white/10 text-white border border-white/10 hover:bg-cyan-500'}`}>{isJoined ? t.leaveTeam : t.joinTeam}</button>
    </div>
  );
};

const TimelineItem: React.FC<{ date: string, title: string, type: string }> = ({ date, title, type }) => (
  <div className="flex items-center space-x-6 p-6 rounded-[2rem] hover:bg-white/5 transition-colors border border-transparent hover:border-white/10 group cursor-default">
    <div className="w-16 h-16 rounded-2xl bg-white/5 flex flex-col items-center justify-center border border-white/10 group-hover:scale-105 transition-transform shrink-0"><span className="text-[8px] font-bold text-slate-500 uppercase">{date.split(' ')[0]}</span><span className="text-xl font-black text-cyan-500">{date.split(' ')[1]}</span></div>
    <div className="flex-1">
      <h4 className="font-bold text-slate-200 text-base group-hover:text-cyan-400 transition-colors">{title}</h4>
      <span className="text-[9px] bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20 text-cyan-500 uppercase font-black tracking-widest">{type}</span>
    </div>
  </div>
);

export default Coordination;

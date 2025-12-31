
import React, { useState } from 'react';
import { Icons } from '../constants';
import { ProjectIdea, User } from '../types';

interface EventDetail {
  title: string;
  date: string;
  type: string;
  description: string;
  location: string;
  time: string;
}

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
  const [selectedEvent, setSelectedEvent] = useState<EventDetail | null>(null);
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

  const upcomingEvents: EventDetail[] = [
    { title: "Cyber War Games - CTF Finals", date: "Nov 24", type: "Competition", location: "Main Lab A", time: "10:00 AM", description: "The final showdown of the semester. Top 10 teams compete in a capture-the-flag marathon with live scoring and rewards." },
    { title: "AI Ethics Research Symposium", date: "Dec 10", type: "Academic Summit", location: "Conference Hall", time: "02:00 PM", description: "Keynote speeches from industry experts about the future of safety in Large Language Models and engineering responsibility." },
    { title: "Industry Networking Mixer", date: "Dec 15", type: "Career Event", location: "Grand Plaza", time: "05:00 PM", description: "Meet recruiters from leading cybersecurity and AI firms in the region to discuss internships and full-time roles." }
  ];

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
        <div className="space-y-6">
          {upcomingEvents.map((event, idx) => (
            <div 
              key={idx} 
              onClick={() => setSelectedEvent(event)}
              className="glass p-8 rounded-[2.5rem] border border-white/5 hover:border-cyan-500/30 transition-all cursor-pointer flex flex-col md:flex-row justify-between items-center group gap-6"
            >
              <div className="flex items-center gap-8">
                <div className="w-20 h-20 rounded-[1.5rem] bg-slate-900 flex flex-col items-center justify-center border border-white/10 group-hover:border-cyan-500/30 transition-all">
                  <span className="text-[10px] font-black text-cyan-500 uppercase tracking-widest">{event.date.split(' ')[0]}</span>
                  <span className="text-2xl font-black">{event.date.split(' ')[1]}</span>
                </div>
                <div>
                  <h4 className="font-bold text-xl group-hover:text-cyan-400 transition-colors">{event.title}</h4>
                  <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mt-1">{event.type} • {event.location}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                 <span className="text-[10px] font-bold text-slate-400 group-hover:text-cyan-500 transition-colors uppercase tracking-widest">View Transmission</span>
                 <Icons.ChevronRight className="w-6 h-6 text-slate-700 group-hover:text-cyan-500 transition-colors" />
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedEvent && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-8 bg-slate-950/90 backdrop-blur-xl">
          <div className="glass w-full max-w-2xl p-12 rounded-[4rem] border-cyan-500/50 shadow-2xl space-y-8 animate-in zoom-in duration-300">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <span className="px-4 py-1 bg-cyan-500/10 text-cyan-500 rounded-full text-[10px] font-black uppercase tracking-widest border border-cyan-500/20">{selectedEvent.type}</span>
                <h2 className="text-3xl font-bold font-orbitron text-white mt-4">{selectedEvent.title}</h2>
              </div>
              <button onClick={() => setSelectedEvent(null)} className="w-12 h-12 rounded-2xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all">✕</button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-900/50 p-6 rounded-[1.5rem] border border-white/5 shadow-inner">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Location</p>
                <p className="font-bold text-white">{selectedEvent.location}</p>
              </div>
              <div className="bg-slate-900/50 p-6 rounded-[1.5rem] border border-white/5 shadow-inner">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Time Schedule</p>
                <p className="font-bold text-white">{selectedEvent.time}</p>
              </div>
            </div>
            <div className="bg-white/5 p-8 rounded-[2rem] border border-white/5">
               <p className="text-slate-400 leading-relaxed text-sm italic">"{selectedEvent.description}"</p>
            </div>
            <button onClick={() => setSelectedEvent(null)} className="w-full cyber-gradient py-5 rounded-[2rem] text-white font-black text-xs uppercase tracking-[0.3em] shadow-2xl">Close Transmission</button>
          </div>
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
           <div className="glass w-full max-w-lg p-8 rounded-[2.5rem] border-cyan-500/30 shadow-2xl space-y-6">
              <h2 className="text-2xl font-bold font-orbitron">Propose Idea</h2>
              <div className="space-y-4">
                 <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Project Title" className="w-full bg-slate-900 border border-white/10 rounded-xl px-5 py-3 text-white" />
                 <textarea value={desc} onChange={e => setDesc(e.target.value)} placeholder="Project Description & Required Skills" className="w-full bg-slate-900 border border-white/10 rounded-xl px-5 py-3 text-white h-32 resize-none" />
              </div>
              <div className="flex gap-4"><button onClick={handleSubmit} className="flex-1 cyber-gradient py-3 rounded-xl font-bold text-white shadow-lg">{t.submit}</button><button onClick={() => setShowAddModal(false)} className="px-6 py-3 rounded-xl border border-white/10 font-bold">{t.cancel}</button></div>
           </div>
        </div>
      )}
    </div>
  );
};

const ProjectCard: React.FC<{ project: ProjectIdea, onToggle: () => void, isJoined: boolean | undefined, t: any }> = ({ project, onToggle, isJoined, t }) => (
  <div className="glass p-8 rounded-[2.5rem] border-white/5 hover:border-cyan-500/30 transition-all flex flex-col h-full group">
    <div className="flex justify-between items-start mb-6">
       <span className="px-3 py-1 bg-cyan-500/10 text-cyan-500 rounded-full text-[9px] font-black uppercase tracking-widest border border-cyan-500/20">{project.category}</span>
       <div className="flex items-center text-slate-500 text-[10px] font-bold"><Icons.Community className="w-4 h-4 mr-1" /> {project.filledSlots}/{project.slots}</div>
    </div>
    <h4 className="text-xl font-bold mb-3 group-hover:text-cyan-400 transition-colors">{project.title}</h4>
    <p className="text-slate-500 text-sm mb-6 flex-1 line-clamp-3 leading-relaxed">{project.description}</p>
    <div className="flex flex-wrap gap-2 mb-6">
       {project.requiredSkills.map(s => <span key={s} className="px-2 py-0.5 bg-slate-100 dark:bg-white/5 rounded text-[10px] text-slate-500 uppercase font-black">{s}</span>)}
    </div>
    <button onClick={onToggle} className={`w-full py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${isJoined ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-cyan-500/10 text-cyan-500 border border-cyan-500/20 hover:bg-cyan-500 hover:text-white'}`}>
       {isJoined ? t.leaveTeam : t.joinTeam}
    </button>
  </div>
);

export default Coordination;

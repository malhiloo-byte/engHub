
import React, { useState } from 'react';
import { Icons } from '../constants';
import { User as UserType, UserRole } from '../types';
import RadarChart from './RadarChart';
import { jsPDF } from "https://esm.sh/jspdf";

interface ProfileProps {
  user: UserType; // The user whose profile is being viewed
  currentUser: UserType; // The person currently logged in
  allUsers: UserType[];
  handleUpdateRole: (id: string, role: UserRole) => void;
  onUpdateUser: (u: UserType) => void;
  onActivityClick: (linkId?: string, type?: string) => void;
  onViewUser?: (id: string) => void;
  isSelf?: boolean;
  t: any;
}

const Profile: React.FC<ProfileProps> = ({ user, currentUser, allUsers, handleUpdateRole, onUpdateUser, onActivityClick, onViewUser, isSelf = true, t }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editName, setEditName] = useState(user.name);
  const [editMajor, setEditMajor] = useState(user.major);
  const [editAvatar, setEditAvatar] = useState(user.avatar);
  const [visibleUsersCount, setVisibleUsersCount] = useState(6);

  // Authorization Checks
  const isOwner = currentUser.role === 'Owner';
  const isFaculty = currentUser.role === 'Faculty';
  const isExpert = currentUser.role === 'Expert';
  const hasDirectoryAccess = isOwner || isFaculty || isExpert;

  const handleExportPortfolio = async () => {
    setIsExporting(true);
    try {
      const doc = new jsPDF();
      doc.setFontSize(22);
      doc.text("CyberHub Academic Portfolio", 20, 30);
      doc.setFontSize(14);
      doc.text(`Name: ${user.name}`, 20, 50);
      doc.text(`Academic Level: ${user.role}`, 20, 60);
      doc.text(`Major: ${user.major}`, 20, 70);
      doc.text(`Prestige Points (Karma): ${user.karma}`, 20, 80);
      doc.save(`${user.name.replace(/\s/g, '_')}_Academic_Record.pdf`);
    } catch (e) { console.error(e); } finally { setIsExporting(false); }
  };

  const handleSaveEdit = () => {
    onUpdateUser({ ...user, name: editName, major: editMajor, avatar: editAvatar });
    setShowEditModal(false);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 max-w-6xl mx-auto space-y-10 pb-40">
      {/* Profile Header */}
      <div className="relative glass rounded-[3rem] border-white/5 overflow-hidden shadow-2xl">
        <div className="h-40 bg-gradient-to-r from-cyan-600/10 via-blue-600/10 to-transparent w-full" />
        <div className="px-12 pb-12 flex flex-col md:flex-row items-end gap-8 -mt-16">
          <div className="relative group">
            <img src={user.avatar} className="w-40 h-40 rounded-[2.5rem] object-cover border-4 border-slate-900 shadow-2xl transition-all group-hover:scale-105" />
            {isSelf && (
              <button 
                onClick={() => setShowEditModal(true)}
                className="absolute inset-0 bg-black/50 rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm"
              >
                <Icons.Check className="w-10 h-10 text-white" />
              </button>
            )}
          </div>
          <div className="flex-1 pb-2">
            <div className="flex items-center gap-4">
              <h2 className="text-4xl font-bold font-orbitron tracking-tight">{user.name}</h2>
              <span className={`px-4 py-1 rounded-xl text-[10px] font-black uppercase border tracking-widest ${
                user.role === 'Owner' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 
                user.role === 'Faculty' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 
                'bg-cyan-500/10 text-cyan-500 border-cyan-500/20'
              }`}>{user.role}</span>
            </div>
            <p className="text-slate-500 font-semibold text-lg mt-2">{user.major}</p>
          </div>
          
          <div className="flex flex-wrap gap-4 mb-2">
             {/* Hierarchical Promotion Controls */}
             {!isSelf && (
               <div className="flex gap-2 p-2 bg-slate-900/50 rounded-2xl border border-white/10 shadow-lg backdrop-blur-xl">
                  {/* Owner can promote/demote anyone */}
                  {isOwner && (
                    <>
                      <button onClick={() => handleUpdateRole(user.id, 'Faculty')} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-[9px] font-black uppercase tracking-tighter rounded-xl transition-all">Make Faculty</button>
                      <button onClick={() => handleUpdateRole(user.id, 'Expert')} className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-[9px] font-black uppercase tracking-tighter rounded-xl transition-all">Make Expert</button>
                      <button onClick={() => handleUpdateRole(user.id, 'Student')} className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white text-[9px] font-black uppercase tracking-tighter rounded-xl transition-all">Make Student</button>
                    </>
                  )}
                  {/* Faculty can promote to Expert or demote to Student */}
                  {isFaculty && user.role !== 'Owner' && user.role !== 'Faculty' && (
                    <>
                      <button onClick={() => handleUpdateRole(user.id, 'Expert')} className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-[9px] font-black uppercase tracking-tighter rounded-xl transition-all">Make Expert</button>
                      <button onClick={() => handleUpdateRole(user.id, 'Student')} className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white text-[9px] font-black uppercase tracking-tighter rounded-xl transition-all">Make Student</button>
                    </>
                  )}
               </div>
             )}
             
             {isSelf && (
               <button onClick={() => setShowEditModal(true)} className="px-8 py-4 rounded-2xl border border-white/10 font-black text-xs uppercase tracking-widest bg-white/5 hover:bg-white/10 transition-all">
                 {t.editProfile}
               </button>
             )}
             <button onClick={handleExportPortfolio} disabled={isExporting} className="cyber-gradient px-10 py-4 rounded-2xl text-white font-black text-xs uppercase tracking-widest shadow-2xl hover:scale-105 transition-all">
               {isExporting ? 'Generating...' : t.exportPortfolio}
             </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-4 space-y-10">
          <div className="glass p-10 rounded-[3rem] border-white/5 shadow-xl">
             <h4 className="text-[12px] font-black uppercase tracking-[0.3em] text-slate-500 mb-8 flex items-center gap-3">
               <Icons.Shield className="w-5 h-5 text-cyan-500" /> Competency Radar
             </h4>
             <div className="flex justify-center -my-6 scale-110">
                {user.skillScores && <RadarChart scores={user.skillScores} t={t} />}
             </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="glass p-8 rounded-[2.5rem] border-white/5 text-center shadow-lg group hover:border-yellow-500/30 transition-colors">
              <span className="block text-4xl font-black text-yellow-500 mb-2 group-hover:scale-110 transition-transform">{user.karma}</span>
              <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Karma Points</span>
            </div>
            <div className="glass p-8 rounded-[2.5rem] border-white/5 text-center shadow-lg group hover:border-cyan-500/30 transition-colors">
              <span className="block text-4xl font-black text-cyan-400 mb-2 group-hover:scale-110 transition-transform">{user.activity?.length || 0}</span>
              <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Global Activity</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-8">
           <div className="glass p-10 rounded-[3rem] border-white/5 h-full shadow-2xl">
              <h4 className="text-base font-bold font-orbitron flex items-center gap-4 uppercase tracking-[0.25em] mb-10 text-cyan-500">
                <Icons.Robot className="w-6 h-6" /> Academic History
              </h4>
              <div className="space-y-5">
                 {user.activity && user.activity.length ? user.activity.map(item => (
                    <div 
                      key={item.id} 
                      onClick={() => onActivityClick(item.linkId, item.type)} 
                      className="flex items-center justify-between p-6 rounded-[2rem] bg-white/5 border border-white/5 hover:border-cyan-500/40 transition-all cursor-pointer group shadow-sm hover:shadow-cyan-500/10"
                    >
                       <div className="flex items-center space-x-6">
                          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border border-white/5 shadow-inner ${
                            item.type === 'Answer' ? 'bg-purple-500/10 text-purple-400' : 
                            item.type === 'Question' ? 'bg-cyan-500/10 text-cyan-400' : 
                            'bg-amber-500/10 text-amber-400'
                          }`}>
                             <Icons.Check className="w-6 h-6" />
                          </div>
                          <div>
                             <h5 className="text-lg font-bold group-hover:text-cyan-400 transition-colors">{item.title}</h5>
                             <p className="text-[11px] text-slate-500 uppercase font-black tracking-[0.15em] mt-2 opacity-60">
                               {item.type} • {new Date(item.timestamp).toLocaleDateString()}
                             </p>
                          </div>
                       </div>
                       <Icons.ChevronRight className="w-6 h-6 text-slate-800 group-hover:text-cyan-500 transition-all transform group-hover:translate-x-1" />
                    </div>
                 )) : (
                   <div className="flex flex-col items-center justify-center py-32 opacity-20 grayscale">
                      <Icons.Folder className="w-24 h-24 mb-6" />
                      <p className="text-sm font-black uppercase tracking-[0.4em]">No Logs Available</p>
                   </div>
                 )}
              </div>
           </div>
        </div>
      </div>

      {/* Authority Feature: Academic Network Directory */}
      {hasDirectoryAccess && (
        <div className="glass p-12 rounded-[4rem] border-white/5 shadow-2xl space-y-12 animate-in slide-in-from-bottom-12 duration-1000">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-white/5 pb-8">
             <div>
                <h3 className="text-3xl font-bold font-orbitron tracking-tight mb-2">Academic Network <span className="text-cyan-500">Directory</span></h3>
                <p className="text-slate-500 text-sm font-bold uppercase tracking-[0.2em]">Live Registry • Central Management Interface</p>
             </div>
             <div className="flex items-center gap-4 bg-slate-900/50 p-3 rounded-2xl border border-white/5">
                <Icons.Community className="w-6 h-6 text-cyan-500" />
                <span className="text-xl font-black">{allUsers.length} <span className="text-xs text-slate-500 uppercase tracking-widest font-bold">Verified Members</span></span>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {allUsers.slice(0, visibleUsersCount).map((member) => (
              <div 
                key={member.id} 
                onClick={() => onViewUser?.(member.id)}
                className={`group p-8 rounded-[2.5rem] bg-white/5 border border-white/5 hover:border-cyan-500/40 transition-all cursor-pointer relative overflow-hidden flex items-center space-x-6 shadow-sm hover:shadow-cyan-500/10 ${member.id === user.id ? 'ring-2 ring-cyan-500/50' : ''}`}
              >
                <div className="relative shrink-0">
                   <img src={member.avatar} className="w-16 h-16 rounded-2xl object-cover border border-white/10 group-hover:scale-110 transition-transform shadow-lg" />
                   <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-slate-950 ${
                      member.role === 'Owner' ? 'bg-red-500 shadow-[0_0_8px_#ef4444]' :
                      member.role === 'Faculty' ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' :
                      member.role === 'Expert' ? 'bg-cyan-500 shadow-[0_0_8px_#06b6d4]' : 'bg-slate-500'
                   }`} />
                </div>
                <div className="overflow-hidden">
                   <h5 className="text-lg font-bold truncate group-hover:text-cyan-400 transition-colors">{member.name}</h5>
                   <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${
                      member.role === 'Owner' ? 'text-red-400' :
                      member.role === 'Faculty' ? 'text-emerald-400' :
                      member.role === 'Expert' ? 'text-cyan-400' : 'text-slate-500'
                   }`}>{member.role}</p>
                   <p className="text-[11px] text-slate-500 truncate">{member.major}</p>
                </div>
                {member.id === user.id && (
                  <div className="absolute top-2 right-4 text-[8px] font-bold text-cyan-500 uppercase">Current View</div>
                )}
              </div>
            ))}
          </div>

          {visibleUsersCount < allUsers.length && (
             <div className="flex justify-center pt-8">
                <button 
                  onClick={() => setVisibleUsersCount(prev => prev + 6)}
                  className="px-12 py-5 rounded-[2rem] border border-cyan-500/20 text-cyan-500 font-black text-xs uppercase tracking-[0.3em] hover:bg-cyan-500/10 hover:border-cyan-500/40 transition-all shadow-xl"
                >
                   Expand Directory ({allUsers.length - visibleUsersCount})
                </button>
             </div>
          )}
        </div>
      )}

      {showEditModal && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-8 bg-slate-950/95 backdrop-blur-xl">
           <div className="glass w-full max-w-xl p-12 rounded-[3.5rem] border-cyan-500/50 shadow-2xl space-y-10 animate-in zoom-in slide-in-from-top-10 duration-500">
              <div className="text-center space-y-3">
                 <div className="w-16 h-16 bg-cyan-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4"><Icons.Shield className="w-8 h-8 text-cyan-500" /></div>
                 <h2 className="text-3xl font-bold font-orbitron uppercase tracking-widest">{t.editProfile}</h2>
              </div>
              
              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="text-[11px] font-black uppercase text-slate-500 tracking-[0.2em] ml-2">Full Legal Name</label>
                  <input value={editName} onChange={e => setEditName(e.target.value)} className="w-full bg-slate-900 border border-white/10 rounded-[1.5rem] px-6 py-5 text-lg text-white focus:ring-4 ring-cyan-500/20 outline-none transition-all" />
                </div>
                <div className="space-y-3">
                  <label className="text-[11px] font-black uppercase text-slate-500 tracking-[0.2em] ml-2">Specialization</label>
                  <input value={editMajor} onChange={e => setEditMajor(e.target.value)} className="w-full bg-slate-900 border border-white/10 rounded-[1.5rem] px-6 py-5 text-lg text-white focus:ring-4 ring-cyan-500/20 outline-none transition-all" />
                </div>
                <div className="space-y-3">
                  <label className="text-[11px] font-black uppercase text-slate-500 tracking-[0.2em] ml-2">Secure Avatar URL</label>
                  <input value={editAvatar} onChange={e => setEditAvatar(e.target.value)} className="w-full bg-slate-900 border border-white/10 rounded-[1.5rem] px-6 py-5 text-lg text-white focus:ring-4 ring-cyan-500/20 outline-none transition-all" />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-5 pt-6">
                <button onClick={handleSaveEdit} className="flex-1 cyber-gradient py-5 rounded-[1.5rem] font-black text-white text-xs uppercase tracking-[0.2em] shadow-2xl hover:scale-105 active:scale-95 transition-all">Sync Credentials</button>
                <button onClick={() => setShowEditModal(false)} className="px-12 py-5 rounded-[1.5rem] border border-white/10 font-black text-xs uppercase tracking-[0.2em] hover:bg-white/5 transition-all">Dismiss</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Profile;

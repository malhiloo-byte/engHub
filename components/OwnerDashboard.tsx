
import React, { useState } from 'react';
import { Icons } from '../constants';
import { User, Report, UserRole } from '../types';

interface OwnerDashboardProps {
  reports: Report[];
  onResolveReport?: (id: string, action: 'Dismiss' | 'Take Down') => void;
  students: User[];
  onUpdateRole: (userId: string, role: UserRole) => void;
  onBroadcast: (msg: string) => void;
  t: any;
}

const OwnerDashboard: React.FC<OwnerDashboardProps> = ({ reports, onResolveReport, students, onUpdateRole, onBroadcast, t }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'reports'>('overview');
  const [broadcastMsg, setBroadcastMsg] = useState('');

  const subjectsHeatmap = [
    { subject: 'Network Security', count: 45, color: 'bg-cyan-500' },
    { subject: 'Deep Learning', count: 32, color: 'bg-blue-500' },
    { subject: 'Web Exploitation', count: 28, color: 'bg-purple-500' },
    { subject: 'AI Ethics', count: 12, color: 'bg-indigo-500' },
  ];

  const handleBroadcast = () => {
    if (!broadcastMsg.trim()) return;
    onBroadcast(broadcastMsg);
    setBroadcastMsg('');
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <h2 className="text-4xl font-bold font-orbitron">Control Center</h2>
        <div className="flex bg-slate-900/50 p-1 rounded-2xl border border-white/5">
          <button onClick={() => setActiveTab('overview')} className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'overview' ? 'bg-cyan-500 text-white shadow-lg' : 'text-slate-500'}`}>Overview</button>
          <button onClick={() => setActiveTab('users')} className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'users' ? 'bg-cyan-500 text-white shadow-lg' : 'text-slate-500'}`}>User Management</button>
          <button onClick={() => setActiveTab('reports')} className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'reports' ? 'bg-cyan-500 text-white shadow-lg' : 'text-slate-500'}`}>Reports ({reports.length})</button>
        </div>
      </div>

      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-8">
             <div className="glass p-8 rounded-[2.5rem] border-cyan-500/10">
                <h3 className="text-xl font-bold font-orbitron mb-8">{t.heatmapTitle}</h3>
                <div className="space-y-6">
                  {subjectsHeatmap.map(item => (
                    <div key={item.subject} className="space-y-2">
                      <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-slate-500">
                        <span>{item.subject}</span>
                        <span>{item.count} Questions</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                        <div className={`h-full ${item.color} shadow-lg shadow-cyan-500/20 transition-all duration-1000`} style={{ width: `${(item.count / 50) * 100}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
             </div>
             
             <div className="glass p-8 rounded-[2.5rem] border-white/5">
                <h3 className="text-xl font-bold font-orbitron mb-6">Global Broadcast</h3>
                <div className="flex gap-4">
                   <input 
                      value={broadcastMsg}
                      onChange={e => setBroadcastMsg(e.target.value)}
                      placeholder="Send a site-wide alert..."
                      className="flex-1 bg-slate-900 border border-white/10 rounded-xl px-5 py-3 text-white text-xs"
                   />
                   <button onClick={handleBroadcast} className="cyber-gradient px-6 py-3 rounded-xl text-white font-black text-[10px] uppercase tracking-widest">Blast</button>
                </div>
             </div>
          </div>

          <div className="glass p-8 rounded-[2.5rem] border-slate-500/10">
             <h3 className="text-xl font-bold font-orbitron mb-8">{t.activityLog}</h3>
             <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/5">
                   <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 rounded-full bg-cyan-500" />
                      <span className="text-sm font-bold">System Admin</span>
                      <span className="text-xs text-slate-500">Initialized Security Protocol</span>
                   </div>
                   <span className="text-[10px] text-slate-600 font-mono">Just now</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/5">
                   <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 rounded-full bg-purple-500" />
                      <span className="text-sm font-bold">Node 74</span>
                      <span className="text-xs text-slate-500">Library Sync Complete</span>
                   </div>
                   <span className="text-[10px] text-slate-600 font-mono">15m ago</span>
                </div>
             </div>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="glass p-10 rounded-[3rem] border-white/5 shadow-2xl overflow-hidden overflow-x-auto">
          <table className="w-full text-left min-w-[600px]">
            <thead>
              <tr className="text-[10px] font-black uppercase text-slate-500 tracking-widest border-b border-white/5">
                <th className="pb-6">Academic Profile</th>
                <th className="pb-6">Email</th>
                <th className="pb-6">Role</th>
                <th className="pb-6 text-right">Promote/Demote</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {students.map(u => (
                <tr key={u.id} className="group">
                  <td className="py-6">
                    <div className="flex items-center space-x-4">
                      <img src={u.avatar} className="w-10 h-10 rounded-xl object-cover" />
                      <div><p className="text-sm font-bold text-white">{u.name}</p><p className="text-[10px] text-slate-500">{u.major}</p></div>
                    </div>
                  </td>
                  <td className="py-6 text-xs text-slate-400 font-mono">{u.email}</td>
                  <td className="py-6">
                    <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${u.role === 'Student' ? 'bg-white/5 text-slate-500' : u.role === 'Faculty' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-cyan-500/10 text-cyan-400'}`}>{u.role}</span>
                  </td>
                  <td className="py-6 text-right space-x-2">
                    {u.role !== 'Owner' && (
                      <>
                        <button onClick={() => onUpdateRole(u.id, 'Faculty')} className="text-[9px] font-black uppercase px-3 py-1.5 rounded-lg border border-emerald-500/20 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all">Faculty</button>
                        <button onClick={() => onUpdateRole(u.id, 'Expert')} className="text-[9px] font-black uppercase px-3 py-1.5 rounded-lg border border-cyan-500/20 text-cyan-500 hover:bg-cyan-500 hover:text-white transition-all">Expert</button>
                        <button onClick={() => onUpdateRole(u.id, 'Student')} className="text-[9px] font-black uppercase px-3 py-1.5 rounded-lg border border-white/10 text-slate-500 hover:bg-white/10 transition-all">Student</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'reports' && (
        <div className="space-y-6">
          {reports.length > 0 ? reports.map(report => (
            <div key={report.id} className="flex flex-col md:flex-row items-center justify-between p-8 bg-red-500/5 rounded-3xl border border-red-500/10 shadow-xl group gap-6">
              <div className="flex items-center space-x-6">
                <div className="bg-red-500 text-white w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg"><Icons.Flag /></div>
                <div><h4 className="font-bold text-lg">Subject: {report.targetTitle}</h4><p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1 text-start">Reported by {report.reporterName} • Reason: {report.reason}</p></div>
              </div>
              <div className="flex space-x-3 w-full md:w-auto">
                <button onClick={() => onResolveReport?.(report.id, 'Dismiss')} className="flex-1 md:flex-none px-6 py-3 bg-emerald-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-transform active:scale-90 shadow-lg">Dismiss</button>
                <button onClick={() => onResolveReport?.(report.id, 'Take Down')} className="flex-1 md:flex-none px-6 py-3 bg-red-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-transform active:scale-90 shadow-lg">Take Down</button>
              </div>
            </div>
          )) : (
            <div className="text-center py-40 glass rounded-[4rem] border-white/5 opacity-50"><p className="font-orbitron font-bold text-slate-500 uppercase tracking-widest">Reports Queue Clear</p></div>
          )}
        </div>
      )}
    </div>
  );
};

export default OwnerDashboard;

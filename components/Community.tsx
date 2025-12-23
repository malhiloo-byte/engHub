
import React, { useState } from 'react';
import { Question, User, Report, WeeklyChallenge } from '../types';
import { MOCK_STUDENTS, Icons } from '../constants';

interface CommunityProps {
  currentUser: User;
  questions: Question[];
  onAddQuestion: (q: Question) => void;
  onReport: (report: Omit<Report, 'id' | 'timestamp' | 'status'>) => void;
  onViewUser: (id: string) => void;
  onFeatureQuestion: (id: string) => void;
  onReplyQuestion: (id: string, text: string) => void;
  challenge: WeeklyChallenge;
  onJoinMeeting: () => void;
  onMeetingPermission: (userId: string, action: 'Accept' | 'Reject') => void;
  t: any;
}

const Community: React.FC<CommunityProps> = ({ currentUser, questions, onAddQuestion, onReport, onViewUser, onFeatureQuestion, onReplyQuestion, challenge, onJoinMeeting, onMeetingPermission, t }) => {
  const [filter, setFilter] = useState<'Answered' | 'Unanswered'>('Answered');
  const [showAskModal, setShowAskModal] = useState(false);
  const [showReplyModal, setShowReplyModal] = useState<{id: string, title: string} | null>(null);
  const [showMeeting, setShowMeeting] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newText, setNewText] = useState('');
  const [replyText, setReplyText] = useState('');
  const [showAllAnswered, setShowAllAnswered] = useState(false);

  // Authority Check: Only Owner, Faculty, or Expert can provide primary answers to unanswered technical topics
  const canReplyTechnical = currentUser.role === 'Owner' || currentUser.role === 'Faculty' || currentUser.role === 'Expert';
  const canModerate = currentUser.role === 'Faculty' || currentUser.role === 'Owner';
  
  const isClosed = new Date() > challenge.expiresAt;
  const myJoinRequest = challenge.joinRequests.find(r => r.userId === currentUser.id);

  const allAnswered = questions.filter(q => q.status === 'Answered');
  const featuredQuestions = allAnswered.filter(q => q.isFeatured);
  const otherAnswered = allAnswered.filter(q => !q.isFeatured);
  
  const unansweredQuestions = questions.filter(q => q.status === 'Unanswered');

  const handleAskQuestion = () => {
    if (!newTitle || !newText) return;
    onAddQuestion({
      id: `q-${Date.now()}`, authorId: currentUser.id, authorName: currentUser.name, title: newTitle, text: newText,
      category: 'General', isExpertRequired: true, isFeatured: false, status: 'Unanswered', timestamp: new Date(), answers: []
    });
    setShowAskModal(false);
    setNewTitle(''); setNewText('');
  };

  const handleReplySubmit = () => {
    if (!showReplyModal || !replyText) return;
    onReplyQuestion(showReplyModal.id, replyText);
    setShowReplyModal(null);
    setReplyText('');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 animate-in fade-in duration-700">
      <div className="lg:col-span-3 space-y-12">
        
        {/* Weekly Technical Challenge */}
        <div className={`cyber-gradient p-12 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden group transition-all ${isClosed ? 'grayscale opacity-70' : ''}`}>
           <div className="absolute -right-20 -bottom-20 opacity-10 transition-transform group-hover:scale-125 duration-1000 rotate-12"><Icons.Robot className="w-96 h-96" /></div>
           <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-10">
              <div className="max-w-2xl space-y-4">
                 <div className="flex items-center space-x-3 mb-2">
                   <span className="bg-white/20 backdrop-blur-md px-5 py-1.5 rounded-full text-[11px] font-black uppercase tracking-[0.3em] border border-white/20">{t.weeklyChallenge}</span>
                   <span className="text-[11px] font-black uppercase tracking-widest text-white/60">Live Interactive Lab</span>
                 </div>
                 <h3 className="text-4xl font-bold font-orbitron tracking-tight">{challenge.title}</h3>
                 <p className="text-white/80 text-lg font-medium leading-relaxed">{challenge.description}</p>
              </div>
              <button 
                onClick={() => (myJoinRequest?.status === 'Accepted' || canReplyTechnical) ? setShowMeeting(true) : onJoinMeeting()}
                className="bg-white text-blue-600 px-10 py-5 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:scale-105 active:scale-95 transition-all">
                  {myJoinRequest?.status === 'Pending' ? t.waitingModerator : t.joinMeeting}
              </button>
           </div>
        </div>

        {/* Forum Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="flex items-center gap-10">
            <h2 className="text-5xl font-bold font-orbitron tracking-tighter">{t.community}</h2>
            <div className="flex bg-slate-200/50 dark:bg-white/5 p-2 rounded-2xl border border-white/5 backdrop-blur-sm shadow-inner">
               <button onClick={() => setFilter('Answered')} className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === 'Answered' ? 'bg-cyan-500 text-white shadow-xl' : 'text-slate-500 hover:text-cyan-500'}`}>{t.answered}</button>
               <button onClick={() => setFilter('Unanswered')} className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === 'Unanswered' ? 'bg-cyan-500 text-white shadow-xl' : 'text-slate-500 hover:text-cyan-500'}`}>{t.unanswered}</button>
            </div>
          </div>
          <button onClick={() => setShowAskModal(true)} className="cyber-gradient px-10 py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest text-white shadow-2xl hover:scale-105 active:scale-95 transition-all">{t.askQuestion}</button>
        </div>

        {/* Forum Feed */}
        <div className="space-y-10 pb-40">
          {filter === 'Answered' ? (
            <>
              {featuredQuestions.map(q => <QuestionCard key={q.id} question={q} canModerate={canModerate} canReplyTechnical={canReplyTechnical} onFeature={onFeatureQuestion} onReport={onReport} t={t} currentUser={currentUser} onReply={() => setShowReplyModal({id: q.id, title: q.title})} />)}
              
              {featuredQuestions.length > 0 && <div className="h-[1px] bg-slate-200 dark:bg-white/10 w-full opacity-50" />}
              
              {(showAllAnswered ? otherAnswered : otherAnswered.slice(0, 5)).map(q => (
                <QuestionCard key={q.id} question={q} canModerate={canModerate} canReplyTechnical={canReplyTechnical} onFeature={onFeatureQuestion} onReport={onReport} t={t} currentUser={currentUser} onReply={() => setShowReplyModal({id: q.id, title: q.title})} />
              ))}
              {!showAllAnswered && otherAnswered.length > 5 && (
                <button onClick={() => setShowAllAnswered(true)} className="w-full py-8 rounded-[3rem] border-2 border-dashed border-slate-300 dark:border-white/10 text-slate-500 font-black hover:bg-slate-100 dark:hover:bg-white/5 transition-all uppercase text-xs tracking-[0.3em]">{t.showMore}</button>
              )}
            </>
          ) : (
            unansweredQuestions.length > 0 ? (
              unansweredQuestions.map(q => (
                <QuestionCard key={q.id} question={q} canModerate={canModerate} canReplyTechnical={canReplyTechnical} onFeature={onFeatureQuestion} onReport={onReport} t={t} currentUser={currentUser} onReply={() => setShowReplyModal({id: q.id, title: q.title})} />
              ))
            ) : (
              <div className="text-center py-40 glass rounded-[4rem] border-white/5 opacity-50">
                 <p className="font-orbitron font-bold text-slate-500 uppercase tracking-widest">Global Queue Clear - All queries answered by experts</p>
              </div>
            )
          )}
        </div>
      </div>

      {/* Authority Leaderboard */}
      <div className="lg:col-span-1">
        <div className="glass p-10 rounded-[3.5rem] border-white/5 sticky top-8 shadow-2xl">
          <h3 className="text-[12px] font-black uppercase tracking-[0.3em] text-cyan-500 mb-10 border-b border-white/5 pb-5">Academic Vanguard</h3>
          <div className="space-y-8">
            {MOCK_STUDENTS.map((student) => (
              <div key={student.id} className="flex items-center justify-between group cursor-pointer" onClick={() => onViewUser(student.id)}>
                <div className="flex items-center space-x-5">
                  <div className="relative">
                    <img src={student.avatar} className="w-14 h-14 rounded-2xl object-cover border border-white/10 transition-transform group-hover:scale-110 shadow-lg" />
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-slate-900 flex items-center justify-center"><Icons.Check className="w-3 h-3 text-white" /></div>
                  </div>
                  <div className="text-left">
                    <p className="text-base font-bold group-hover:text-cyan-500 transition-colors leading-tight">{student.name}</p>
                    <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mt-1 opacity-60">{student.role}</p>
                  </div>
                </div>
                <span className="text-sm font-black text-cyan-500">{student.karma}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Expert Reply Panel */}
      {showReplyModal && (
        <div className="fixed inset-0 z-[400] flex items-center justify-center p-8 bg-slate-950/98 backdrop-blur-2xl">
           <div className="glass w-full max-w-3xl p-12 rounded-[4rem] border-cyan-500/50 space-y-10 animate-in zoom-in slide-in-from-bottom-20 duration-500 shadow-[0_0_100px_rgba(6,182,212,0.1)]">
              <div className="flex items-center space-x-6">
                 <div className="w-16 h-16 rounded-[1.5rem] bg-cyan-500/10 flex items-center justify-center text-cyan-500 shadow-inner"><Icons.Shield className="w-8 h-8" /></div>
                 <div>
                   <h2 className="text-3xl font-bold font-orbitron tracking-tight">Verified Academic Response</h2>
                   <p className="text-slate-500 text-[11px] font-black uppercase tracking-[0.3em] mt-2">Authorized Engineering Oversight Mode</p>
                 </div>
              </div>
              <div className="bg-slate-900/80 p-6 rounded-[2rem] border border-white/5">
                 <p className="text-slate-400 text-base italic leading-relaxed">Query: "{showReplyModal.title}"</p>
              </div>
              <textarea 
                value={replyText} 
                onChange={e => setReplyText(e.target.value)} 
                placeholder="Formulate your verified solution here. Provide architectural insights, code remediation, or mathematical proofs..." 
                rows={10} 
                className="w-full bg-slate-950 border border-white/10 rounded-[2rem] px-8 py-6 text-lg text-white focus:ring-4 ring-cyan-500/20 outline-none resize-none transition-all" 
              />
              <div className="flex flex-col sm:flex-row gap-5">
                 <button onClick={handleReplySubmit} className="flex-1 cyber-gradient py-5 rounded-[2rem] font-black text-white text-xs uppercase tracking-[0.25em] shadow-2xl hover:scale-105 active:scale-95 transition-all">Authenticate & Commit</button>
                 <button onClick={() => setShowReplyModal(null)} className="px-12 py-5 rounded-[2rem] border border-white/10 font-black text-xs uppercase tracking-[0.25em] hover:bg-white/5 transition-all">Discard</button>
              </div>
           </div>
        </div>
      )}

      {/* Universal Ask Modal */}
      {showAskModal && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-8 bg-slate-950/90 backdrop-blur-md">
           <div className="glass w-full max-w-2xl p-12 rounded-[4rem] border-cyan-500/30 shadow-[0_0_60px_rgba(6,182,212,0.1)] space-y-10">
              <div className="text-center space-y-2">
                 <h2 className="text-3xl font-bold font-orbitron tracking-tighter">Submit Engineering Query</h2>
                 <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">Broadcast to Global Academic Cluster</p>
              </div>
              <div className="space-y-6">
                 <input value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="Succinct Query Header (e.g., JWT Revocation Logic)" className="w-full bg-slate-950 border border-white/10 rounded-[1.5rem] px-8 py-5 text-white text-lg focus:ring-4 ring-cyan-500/20 outline-none" />
                 <textarea value={newText} onChange={e => setNewText(e.target.value)} placeholder="Provide specific technical parameters, constraints, and current obstacles..." rows={6} className="w-full bg-slate-950 border border-white/10 rounded-[1.5rem] px-8 py-5 text-white text-lg resize-none focus:ring-4 ring-cyan-500/20 outline-none" />
              </div>
              <div className="flex flex-col sm:flex-row gap-5">
                 <button onClick={handleAskQuestion} className="flex-1 cyber-gradient py-5 rounded-[2rem] font-black text-white text-xs uppercase tracking-[0.25em] shadow-2xl hover:scale-105 active:scale-95">Initiate Discussion</button>
                 <button onClick={() => setShowAskModal(false)} className="px-12 py-5 rounded-[2rem] border border-white/10 font-black text-xs uppercase tracking-[0.25em] hover:bg-white/5 transition-all">Cancel</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

const QuestionCard: React.FC<{ question: Question, canModerate: boolean, canReplyTechnical: boolean, onFeature: (id: string) => void, onReport: any, t: any, currentUser: User, onReply: any }> = ({ question, canModerate, canReplyTechnical, onFeature, onReport, t, currentUser, onReply }) => (
  <div className={`p-10 rounded-[3.5rem] border transition-all shadow-xl group ${question.isFeatured ? 'border-cyan-500/50 bg-cyan-500/10 shadow-[0_0_40px_rgba(6,182,212,0.05)]' : 'glass border-white/5 hover:border-white/10'}`}>
    <div className="flex justify-between items-start mb-8">
      <div className="flex items-center space-x-6">
        <div className="w-16 h-16 rounded-[1.5rem] bg-white/5 border border-white/10 flex items-center justify-center font-black text-cyan-500 text-2xl shadow-inner group-hover:scale-110 transition-transform">{question.authorName[0]}</div>
        <div>
          <h4 className="font-bold text-2xl group-hover:text-cyan-400 transition-colors mb-2 tracking-tight">{question.title}</h4>
          <p className="text-[11px] text-slate-500 font-black uppercase tracking-[0.2em] opacity-60">Engineering Cluster • {question.timestamp.toLocaleDateString()}</p>
        </div>
      </div>
      <div className="flex items-center space-x-4">
         {canModerate && (
           <button onClick={() => onFeature(question.id)} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${question.isFeatured ? 'bg-cyan-500 text-white border-cyan-500' : 'border-cyan-500/30 text-cyan-500 hover:bg-cyan-500/10'}`}>
              {question.isFeatured ? 'Pinned' : 'Pin Topic'}
           </button>
         )}
         <button onClick={() => onReport({ reporterId: currentUser.id, reporterName: currentUser.name, targetId: question.id, targetTitle: question.title, targetType: 'Question', reason: 'Technical Content Flag' })} className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-slate-500 hover:text-red-500 transition-all border border-transparent hover:border-red-500/20"><Icons.Flag className="w-5 h-5" /></button>
      </div>
    </div>
    <p className="text-slate-400 text-lg leading-relaxed mb-10 pl-2 opacity-90">{question.text}</p>
    
    <div className="flex items-center justify-between pt-10 border-t border-white/5">
       <div className="flex items-center space-x-5">
          <div className="flex -space-x-4">
            {question.answers.length > 0 ? (
              question.answers.map((ans, i) => <img key={i} src={`https://i.pravatar.cc/150?u=${ans.authorId}`} className="w-10 h-10 rounded-full border-2 border-slate-900 object-cover shadow-lg" />)
            ) : (
              <div className="w-10 h-10 rounded-full bg-slate-800 border-2 border-slate-900 flex items-center justify-center text-slate-600"><Icons.Robot className="w-5 h-5" /></div>
            )}
          </div>
          <span className="text-xs font-black text-slate-500 uppercase tracking-widest">{question.answers.length} Academic Insights</span>
       </div>
       
       {/* Strict Authority Only Button for unanswered technical queries */}
       {question.status === 'Unanswered' ? (
         canReplyTechnical ? (
           <button onClick={onReply} className="cyber-gradient px-10 py-4 rounded-[1.5rem] text-white text-[11px] font-black uppercase tracking-[0.2em] shadow-2xl hover:scale-105 active:scale-95 transition-all">Submit Professional Audit</button>
         ) : (
           <div className="px-6 py-3 rounded-xl bg-slate-900/50 border border-white/5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Awaiting Expert Verification</div>
         )
       ) : (
          <button onClick={onReply} className="px-8 py-3 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-white/10 transition-all">Contribute Insight</button>
       )}
    </div>

    {question.answers.length > 0 && (
      <div className="mt-10 space-y-6">
        {question.answers.map(ans => (
          <div key={ans.id} className="p-8 bg-white/5 rounded-[2.5rem] border border-white/5 relative overflow-hidden group">
             {ans.authorRole !== 'Student' && (
               <div className="absolute top-0 right-0 px-6 py-2 bg-cyan-500 rounded-bl-3xl text-[10px] font-black text-white uppercase tracking-[0.3em] shadow-xl">Faculty Validated</div>
             )}
             <div className="flex items-center space-x-4 mb-5">
                <img src={`https://i.pravatar.cc/150?u=${ans.authorId}`} className="w-10 h-10 rounded-xl object-cover border border-white/10" />
                <div>
                  <span className="text-base font-black text-cyan-400 uppercase tracking-tight block">{ans.authorName}</span>
                  <span className="text-[10px] text-slate-600 font-black uppercase tracking-widest">{ans.authorRole} • Verified Contributor</span>
                </div>
                {ans.isVerified && <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500"><Icons.Check className="w-4 h-4" /></div>}
             </div>
             <p className="text-base text-slate-300 leading-relaxed font-medium pl-2">{ans.text}</p>
          </div>
        ))}
      </div>
    )}
  </div>
);

export default Community;

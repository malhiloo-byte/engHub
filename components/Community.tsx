
import React, { useState, useRef, useEffect } from 'react';
import { Question, User, Report, WeeklyChallenge } from '../types';
import { MOCK_STUDENTS, Icons } from '../constants';

interface ChatMsg {
  sender: string;
  text: string;
  isSelf: boolean;
}

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
  
  // Meeting Features
  const [isMuted, setIsMuted] = useState(true);
  const [isCamOff, setIsCamOff] = useState(true);
  const [meetingChat, setMeetingChat] = useState<ChatMsg[]>([
    { sender: 'System', text: 'Encrypted tunnel established.', isSelf: false }
  ]);
  const [chatInput, setChatInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatEndRef.current) chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [meetingChat]);

  const canReplyTechnical = currentUser.role === 'Owner' || currentUser.role === 'Faculty' || currentUser.role === 'Expert';
  const canModerate = currentUser.role === 'Faculty' || currentUser.role === 'Owner';
  
  const isClosed = new Date() > challenge.expiresAt;
  const myJoinRequest = challenge.joinRequests.find(r => r.userId === currentUser.id);

  const handleSendChat = () => {
    if (!chatInput.trim()) return;
    setMeetingChat(prev => [...prev, { sender: currentUser.name, text: chatInput, isSelf: true }]);
    setChatInput('');
  };

  const allAnswered = questions.filter(q => q.status === 'Answered');
  const featuredQuestions = allAnswered.filter(q => q.isFeatured);
  const otherAnswered = allAnswered.filter(q => !q.isFeatured);
  const unansweredQuestions = questions.filter(q => q.status === 'Unanswered');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 animate-in fade-in duration-700">
      <div className="lg:col-span-3 space-y-12">
        
        {/* Weekly Technical Challenge Card */}
        <div className={`cyber-gradient p-12 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden group transition-all ${isClosed ? 'grayscale opacity-70' : ''}`}>
           <div className="absolute -right-20 -bottom-20 opacity-10 transition-transform group-hover:scale-125 duration-1000 rotate-12"><Icons.Robot className="w-96 h-96" /></div>
           <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-10">
              <div className="max-w-2xl space-y-4 text-start">
                 <div className="flex items-center space-x-3 space-x-reverse mb-2">
                   <span className="bg-white/20 backdrop-blur-md px-5 py-1.5 rounded-full text-[11px] font-black uppercase tracking-[0.3em] border border-white/20">{t.weeklyChallenge}</span>
                   <span className="text-[11px] font-black uppercase tracking-widest text-white/60">Live Interactive Lab</span>
                 </div>
                 <h3 className="text-4xl font-bold font-orbitron tracking-tight">{challenge.title}</h3>
                 <p className="text-white/80 text-lg font-medium leading-relaxed">{challenge.description}</p>
              </div>
              <div className="flex flex-col items-center gap-3">
                 <button 
                  onClick={() => (myJoinRequest?.status === 'Accepted' || canModerate) ? setShowMeeting(true) : onJoinMeeting()}
                  className="bg-white text-blue-600 px-12 py-5 rounded-[2.5rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:scale-105 active:scale-95 transition-all">
                    {canModerate ? t.startMeeting : (myJoinRequest?.status === 'Pending' ? t.waitingModerator : (myJoinRequest?.status === 'Accepted' ? t.joinMeeting : t.joinMeeting))}
                 </button>
                 {myJoinRequest?.status === 'Rejected' && <span className="text-xs text-red-200 font-bold bg-red-500/20 px-4 py-1 rounded-full border border-red-500/30">{t.meetingDenied}</span>}
              </div>
           </div>
        </div>

        {/* Meeting Room UI */}
        {showMeeting && (
          <div className="fixed inset-0 z-[500] bg-slate-950 flex flex-col md:flex-row p-6 gap-6 overflow-hidden">
             {/* Main Video Area */}
             <div className="flex-1 flex flex-col gap-6">
                <div className="flex-1 relative glass rounded-[3.5rem] border-white/10 overflow-hidden shadow-[0_0_100px_rgba(6,182,212,0.1)]">
                   <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center space-y-6 animate-pulse">
                         <div className="w-32 h-32 rounded-full bg-cyan-500/10 flex items-center justify-center border-2 border-cyan-500/30 mx-auto">
                            <Icons.Robot className="w-16 h-16 text-cyan-500" />
                         </div>
                         <p className="font-orbitron font-bold text-slate-500 uppercase tracking-[0.5em]">{t.waitingModerator}</p>
                      </div>
                   </div>
                   {/* Bottom Controls */}
                   <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-6 bg-slate-900/80 backdrop-blur-3xl px-10 py-5 rounded-[2.5rem] border border-white/10 shadow-2xl">
                      <button onClick={() => setIsMuted(!isMuted)} className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${isMuted ? 'bg-red-500/20 text-red-500 border-red-500/20' : 'bg-white/5 text-white'}`}>
                        {isMuted ? <Icons.MicOff className="w-6 h-6" /> : <Icons.Mic className="w-6 h-6" />}
                      </button>
                      <button onClick={() => setIsCamOff(!isCamOff)} className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${isCamOff ? 'bg-red-500/20 text-red-500 border-red-500/20' : 'bg-white/5 text-white'}`}>
                        {isCamOff ? <Icons.VideoOff className="w-6 h-6" /> : <Icons.Video className="w-6 h-6" />}
                      </button>
                      <div className="w-[1px] h-10 bg-white/10 mx-2" />
                      <button onClick={() => setShowMeeting(false)} className="px-10 py-4 bg-red-600 hover:bg-red-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl">End Session</button>
                   </div>
                </div>
             </div>

             {/* Sidebar (Chat & Participants) */}
             <div className="w-full md:w-[26rem] glass rounded-[3.5rem] border-white/10 p-8 flex flex-col gap-6">
                <div className="flex bg-white/5 p-1 rounded-2xl border border-white/5">
                   <div className="flex-1 py-2 text-center text-[10px] font-black uppercase text-cyan-500">{t.liveChat}</div>
                </div>
                
                {/* Chat Feed */}
                <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                   {meetingChat.map((msg, i) => (
                      <div key={i} className={`flex flex-col ${msg.isSelf ? 'items-end' : 'items-start'}`}>
                         <span className="text-[8px] font-black uppercase text-slate-500 mb-1">{msg.sender}</span>
                         <div className={`px-4 py-2 rounded-2xl text-xs ${msg.isSelf ? 'bg-cyan-500 text-white rounded-tr-none' : 'bg-white/5 text-slate-300 rounded-tl-none border border-white/5'}`}>
                            {msg.text}
                         </div>
                      </div>
                   ))}
                   <div ref={chatEndRef} />
                </div>

                {/* Chat Input */}
                <div className="relative">
                   <input 
                      value={chatInput} 
                      onChange={e => setChatInput(e.target.value)} 
                      onKeyDown={e => e.key === 'Enter' && handleSendChat()}
                      placeholder={t.typeMessage}
                      className="w-full bg-slate-900 border border-white/10 rounded-2xl px-6 py-4 text-xs text-white pr-14"
                   />
                   <button onClick={handleSendChat} className="absolute right-2 top-2 w-10 h-10 cyber-gradient rounded-xl flex items-center justify-center">
                      <Icons.Send className="w-4 h-4 text-white" />
                   </button>
                </div>
             </div>
          </div>
        )}

        {/* Forum Feed Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="flex items-center gap-10">
            <h2 className="text-5xl font-bold font-orbitron tracking-tighter">{t.community}</h2>
            <div className="flex bg-slate-200/50 dark:bg-white/5 p-2 rounded-2xl border border-white/5 backdrop-blur-sm">
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
            </>
          ) : (
            unansweredQuestions.map(q => (
              <QuestionCard key={q.id} question={q} canModerate={canModerate} canReplyTechnical={canReplyTechnical} onFeature={onFeatureQuestion} onReport={onReport} t={t} currentUser={currentUser} onReply={() => setShowReplyModal({id: q.id, title: q.title})} />
            ))
          )}
        </div>
      </div>

      <div className="lg:col-span-1">
        <div className="glass p-10 rounded-[3.5rem] border-white/5 sticky top-8 shadow-2xl">
          <h3 className="text-[12px] font-black uppercase tracking-[0.3em] text-cyan-500 mb-10 border-b border-white/5 pb-5">{t.leaderboard}</h3>
          <div className="space-y-8">
            {MOCK_STUDENTS.map((student) => (
              <div key={student.id} className="flex items-center justify-between group cursor-pointer" onClick={() => onViewUser(student.id)}>
                <div className="flex items-center space-x-5 space-x-reverse">
                  <div className="relative">
                    <img src={student.avatar} className="w-14 h-14 rounded-2xl object-cover border border-white/10 transition-transform group-hover:scale-110 shadow-lg" />
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-slate-900 flex items-center justify-center"><Icons.Check className="w-3 h-3 text-white" /></div>
                  </div>
                  <div className="text-start">
                    <p className="text-base font-bold group-hover:text-cyan-500 transition-colors leading-tight">{student.name}</p>
                    <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mt-1 opacity-60">{student.role === 'Faculty' ? t.faculty : student.role}</p>
                  </div>
                </div>
                <span className="text-sm font-black text-cyan-500">{student.karma}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const QuestionCard: React.FC<{ question: Question, canModerate: boolean, canReplyTechnical: boolean, onFeature: (id: string) => void, onReport: any, t: any, currentUser: User, onReply: any }> = ({ question, canModerate, canReplyTechnical, onFeature, onReport, t, currentUser, onReply }) => (
  <div className={`p-10 rounded-[3.5rem] border transition-all shadow-xl group ${question.isFeatured ? 'border-cyan-500/50 bg-cyan-500/10' : 'glass border-white/5 hover:border-white/10'}`}>
    <div className="flex justify-between items-start mb-8">
      <div className="flex items-center space-x-6 space-x-reverse">
        <div className="w-16 h-16 rounded-[1.5rem] bg-white/5 border border-white/10 flex items-center justify-center font-black text-cyan-500 text-2xl group-hover:scale-110 transition-transform">{question.authorName[0]}</div>
        <div className="text-start">
          <h4 className="font-bold text-2xl group-hover:text-cyan-400 transition-colors mb-2 tracking-tight">{question.title}</h4>
          <p className="text-[11px] text-slate-500 font-black uppercase tracking-[0.2em] opacity-60">Engineering Cluster • {question.timestamp.toLocaleDateString()}</p>
        </div>
      </div>
      <div className="flex items-center space-x-4 space-x-reverse">
         {canModerate && (
           <button onClick={() => onFeature(question.id)} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${question.isFeatured ? 'bg-cyan-500 text-white border-cyan-500' : 'border-cyan-500/30 text-cyan-500 hover:bg-cyan-500/10'}`}>
              {question.isFeatured ? t.featureQuestion : t.featureQuestion}
           </button>
         )}
         <button onClick={() => onReport({ reporterId: currentUser.id, reporterName: currentUser.name, targetId: question.id, targetTitle: question.title, targetType: 'Question', reason: 'Technical Content Flag' })} className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-slate-500 hover:text-red-500 transition-all border border-transparent hover:border-red-500/20"><Icons.Flag className="w-5 h-5" /></button>
      </div>
    </div>
    <p className="text-slate-400 text-lg leading-relaxed mb-10 pl-2 opacity-90 text-start">{question.text}</p>
    
    <div className="flex items-center justify-between pt-10 border-t border-white/5">
       <div className="flex items-center space-x-5 space-x-reverse">
          <div className="flex -space-x-4 rtl:space-x-reverse">
            {question.answers.length > 0 ? (
              question.answers.map((ans, i) => <img key={i} src={`https://i.pravatar.cc/150?u=${ans.authorId}`} className="w-10 h-10 rounded-full border-2 border-slate-900 object-cover" />)
            ) : (
              <div className="w-10 h-10 rounded-full bg-slate-800 border-2 border-slate-900 flex items-center justify-center text-slate-600"><Icons.Robot className="w-5 h-5" /></div>
            )}
          </div>
          <span className="text-xs font-black text-slate-500 uppercase tracking-widest">{question.answers.length} {t.answered}</span>
       </div>
       <button onClick={onReply} className="cyber-gradient px-10 py-4 rounded-[1.5rem] text-white text-[11px] font-black uppercase tracking-[0.2em] shadow-2xl">{t.submit}</button>
    </div>
  </div>
);

export default Community;

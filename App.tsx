
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ChatAssistant from './components/ChatAssistant';
import Community from './components/Community';
import Library from './components/Library';
import Coordination from './components/Coordination';
import Profile from './components/Profile';
import Roadmaps from './components/Roadmaps';
import Auth from './components/Auth';
import OwnerDashboard from './components/OwnerDashboard';
import Pathfinder from './components/Pathfinder';
import { Icons, MOCK_STUDENTS, TRANSLATIONS, MOCK_REPORTS, MOCK_PROJECTS, MOCK_QUESTIONS, MOCK_COURSES, MOCK_CHALLENGE } from './constants';
import { User, UserRole, Report, ProjectIdea, Question, Course, CourseResource, WeeklyChallenge } from './types';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('cyberhub_users');
    return saved ? JSON.parse(saved) : MOCK_STUDENTS;
  });

  const [activeTab, setActiveTab] = useState('home');
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [lang, setLang] = useState<'en' | 'ar'>('en');
  const [toasts, setToasts] = useState<Toast[]>([]);
  
  const [projects, setProjects] = useState<ProjectIdea[]>(MOCK_PROJECTS);
  const [questions, setQuestions] = useState<Question[]>(MOCK_QUESTIONS);
  const [courses, setCourses] = useState<Course[]>(MOCK_COURSES);
  const [challenge, setChallenge] = useState<WeeklyChallenge>(MOCK_CHALLENGE);
  const [reports, setReports] = useState<Report[]>(MOCK_REPORTS);
  
  const [viewingUser, setViewingUser] = useState<User | null>(null);
  
  const t = TRANSLATIONS[lang];

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [theme, lang]);

  useEffect(() => {
    localStorage.setItem('cyberhub_users', JSON.stringify(allUsers));
  }, [allUsers]);

  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const handleLogin = (user: User) => {
    const dbUser = allUsers.find(u => u.email === user.email);
    const finalUser = dbUser || user;
    setCurrentUser(finalUser);
    setIsLoggedIn(true);
    addToast(lang === 'ar' ? `مرحباً بك مجدداً، ${finalUser.name}` : `Welcome back, ${finalUser.name}`, 'success');
  };

  const handleRegister = (user: User) => {
    setAllUsers(prev => [...prev, user]);
    addToast(lang === 'ar' ? 'تم إنشاء الحساب بنجاح' : 'Account created successfully', 'success');
  };

  const handleUpdateRole = (userId: string, newRole: UserRole) => {
    const updatedUsers = allUsers.map(u => u.id === userId ? { ...u, role: newRole } : u);
    setAllUsers(updatedUsers);
    addToast(lang === 'ar' ? 'تم تحديث صلاحيات المستخدم' : 'User permissions updated', 'info');
    
    if (currentUser?.id === userId) {
      handleLogout();
    } else if (viewingUser?.id === userId) {
      setViewingUser(prev => prev ? { ...prev, role: newRole } : null);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setViewingUser(null);
    setActiveTab('home');
    addToast(lang === 'ar' ? 'تم تسجيل الخروج بأمان' : 'Log out successful');
  };

  const handleUpdateRoadmap = (stepId: string) => {
    if (!currentUser) return;
    const isDone = currentUser.completedRoadmapSteps?.includes(stepId);
    const updated = {
      ...currentUser,
      completedRoadmapSteps: isDone 
        ? currentUser.completedRoadmapSteps?.filter(id => id !== stepId)
        : [...(currentUser.completedRoadmapSteps || []), stepId],
      karma: isDone ? Math.max(0, currentUser.karma - 10) : currentUser.karma + 50
    };
    setCurrentUser(updated);
    setAllUsers(prev => prev.map(u => u.id === updated.id ? updated : u));
    addToast(isDone ? '-10 Karma' : '+50 Karma Points!', isDone ? 'info' : 'success');
  };

  const handleJoinProject = (projectId: string) => {
    if (!currentUser) return;
    const isJoined = currentUser.joinedProjects?.includes(projectId);
    const updated = {
      ...currentUser,
      joinedProjects: isJoined
        ? currentUser.joinedProjects?.filter(id => id !== projectId)
        : [...(currentUser.joinedProjects || []), projectId],
    };
    setCurrentUser(updated);
    setAllUsers(prev => prev.map(u => u.id === updated.id ? updated : u));
    setProjects(prev => prev.map(p => p.id === projectId ? { ...p, filledSlots: p.filledSlots + (isJoined ? -1 : 1) } : p));
    addToast(isJoined ? (lang === 'ar' ? 'غادرت المشروع' : 'Left Project') : (lang === 'ar' ? 'انضممت للمشروع' : 'Joined Team!'), 'info');
  };

  const handleAddQuestion = (q: Question) => {
    setQuestions(prev => [q, ...prev]);
    addToast(lang === 'ar' ? 'تم نشر موضوعك' : 'Topic Published', 'success');
  };

  // Fix: Added handleFeatureQuestion
  const handleFeatureQuestion = (qId: string) => {
    setQuestions(prev => prev.map(q => q.id === qId ? { ...q, isFeatured: !q.isFeatured } : q));
    addToast(lang === 'ar' ? 'تم تحديث حالة التمييز' : 'Featured status updated', 'info');
  };

  const handleReplyQuestion = (qId: string, text: string) => {
    if (!currentUser) return;
    setQuestions(prev => prev.map(q => q.id === qId ? {
      ...q,
      status: 'Answered',
      answers: [...q.answers, {
        id: `ans-${Date.now()}`, authorId: currentUser.id, authorName: currentUser.name, authorRole: currentUser.role,
        text, timestamp: new Date(), isVerified: currentUser.role !== 'Student', upvotes: 0
      }]
    } : q));
    addToast(lang === 'ar' ? 'تمت إضافة ردك' : 'Reply added', 'success');
  };

  // Fix: Added handleJoinMeetingRequest
  const handleJoinMeetingRequest = () => {
    if (!currentUser) return;
    setChallenge(prev => ({
      ...prev,
      joinRequests: [
        ...prev.joinRequests.filter(r => r.userId !== currentUser.id),
        { userId: currentUser.id, userName: currentUser.name, status: 'Pending' }
      ]
    }));
    addToast(lang === 'ar' ? 'تم إرسال طلب الانضمام' : 'Join request sent', 'info');
  };

  // Fix: Added handleMeetingPermission
  const handleMeetingPermission = (userId: string, action: 'Accept' | 'Reject') => {
    setChallenge(prev => ({
      ...prev,
      joinRequests: prev.joinRequests.map(r => r.userId === userId ? { ...r, status: action === 'Accept' ? 'Accepted' : 'Rejected' } : r)
    }));
    addToast(action === 'Accept' ? 'User accepted' : 'User rejected', 'info');
  };

  // Fix: Added handleAddResource
  const handleAddResource = (courseId: string, resource: Partial<CourseResource>) => {
    if (!currentUser) return;
    const newRes: CourseResource = {
      id: `res-${Date.now()}`,
      name: resource.name || 'Untitled',
      type: (resource.type as any) || 'Explanation',
      url: resource.url || '',
      status: (currentUser.role === 'Faculty' || currentUser.role === 'Owner') ? 'Approved' : 'Pending',
      origin: (resource.origin as any) || 'Practical',
      authorName: currentUser.name,
      authorRole: currentUser.role,
      authorId: currentUser.id,
      timestamp: new Date(),
    };

    setCourses(prev => prev.map(c => c.id === courseId ? { ...c, resources: [...c.resources, newRes] } : c));
    addToast(newRes.status === 'Approved' ? 'Resource added' : 'Resource submitted for review', 'success');
  };

  // Fix: Added handleApproveResource
  const handleApproveResource = (courseId: string, resourceId: string, action: 'Approve' | 'Reject') => {
    setCourses(prev => prev.map(c => c.id === courseId ? {
      ...c,
      resources: c.resources.map(r => r.id === resourceId ? { ...r, status: action === 'Approve' ? 'Approved' : 'Rejected' } : r)
    } : c));
    addToast(action === 'Approve' ? 'Resource Approved' : 'Resource Rejected', 'info');
  };

  // Fix: Added onViewUser
  const onViewUser = (userId: string) => {
    const user = allUsers.find(u => u.id === userId);
    if (user) {
      setViewingUser(user);
      setActiveTab('profile');
    }
  };

  const handleBroadcast = (msg: string) => {
    addToast(msg, 'info');
  };

  if (!isLoggedIn || !currentUser) {
    return (
      <>
        <Auth onLogin={handleLogin} existingUsers={allUsers} onRegister={handleRegister} lang={lang} />
        <ToastContainer toasts={toasts} />
      </>
    );
  }

  return (
    <div className={`min-h-screen ${lang === 'ar' ? 'pr-20' : 'pl-20'} bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 transition-colors duration-300`} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={(tab) => { setActiveTab(tab); setViewingUser(null); }} 
        theme={theme} 
        setTheme={setTheme} 
        lang={lang}
        toggleLang={() => setLang(lang === 'ar' ? 'en' : 'ar')}
        t={t} 
        userRole={currentUser.role}
      />

      <main className="max-w-7xl mx-auto px-8 py-10">
        <header className="flex justify-between items-center mb-12">
          <div className="flex items-center space-x-4 space-x-reverse">
            <h1 className="text-2xl font-orbitron font-bold cyber-text-gradient">{t.title}</h1>
            <span className="h-6 w-[1px] bg-slate-200 dark:bg-white/10" />
            <p className="text-slate-500 text-sm font-medium">{t.academicExcellence}</p>
          </div>
          <div onClick={() => { setViewingUser(null); setActiveTab('profile'); }} className="flex items-center space-x-3 space-x-reverse bg-white dark:bg-white/5 p-1.5 pr-5 pl-1.5 rounded-full border border-slate-200 dark:border-white/5 cursor-pointer hover:border-cyan-500/50 transition-all">
            <img src={currentUser.avatar} className="w-10 h-10 rounded-full border border-white/10 object-cover" />
            <div className="flex flex-col">
              <span className="text-xs font-bold">{currentUser.name}</span>
              <span className="text-[9px] font-bold text-cyan-500 uppercase">{currentUser.role === 'Faculty' ? t.faculty : currentUser.role}</span>
            </div>
          </div>
        </header>

        {activeTab === 'home' && (
          <div className="animate-in fade-in duration-700 space-y-16">
             <Roadmaps currentUser={currentUser} onUpdateProgress={handleUpdateRoadmap} t={t} />
             
             <section className="space-y-8">
               <h3 className="text-2xl font-bold font-orbitron flex items-center gap-4">
                 <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
                 {t.recentActivity}
               </h3>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 {questions.slice(0, 3).map(q => (
                   <div key={q.id} className="glass p-6 rounded-[2rem] border-white/5 hover:border-cyan-500/20 transition-all cursor-pointer" onClick={() => setActiveTab('community')}>
                      <p className="text-[10px] font-black uppercase text-cyan-500 mb-2">FORUM TRANSMISSION</p>
                      <h4 className="font-bold text-sm mb-2 line-clamp-1">{q.title}</h4>
                      <p className="text-xs text-slate-500 mb-4 line-clamp-2">{q.text}</p>
                      <button className="text-[10px] font-bold text-slate-400 hover:text-white uppercase">Interrogate Node →</button>
                   </div>
                 ))}
               </div>
             </section>
          </div>
        )}

        {activeTab === 'community' && (
          <Community 
            currentUser={currentUser} 
            questions={questions} 
            onAddQuestion={handleAddQuestion} 
            onReport={(rep) => { setReports(prev => [{...rep, id: Date.now().toString(), timestamp: new Date(), status: 'Pending'}, ...prev]); addToast(lang === 'ar' ? 'تم إرسال البلاغ للمراجعة' : 'Report submitted for audit', 'info'); }} 
            onViewUser={onViewUser} 
            onFeatureQuestion={handleFeatureQuestion} 
            onReplyQuestion={handleReplyQuestion} 
            challenge={challenge} 
            onJoinMeeting={handleJoinMeetingRequest} 
            onMeetingPermission={handleMeetingPermission} 
            t={t} 
          />
        )}

        {activeTab === 'library' && (
          <Library 
            courses={courses} 
            onAddResource={handleAddResource} 
            onViewUser={onViewUser} 
            onApproveResource={handleApproveResource} 
            user={currentUser} 
            t={t} 
          />
        )}

        {activeTab === 'coordination' && (
          <Coordination 
            projects={projects} 
            currentUser={currentUser} 
            onJoinToggle={handleJoinProject} 
            onAddProject={(p) => setProjects(prev => [p, ...prev])} 
            t={t} 
          />
        )}

        {activeTab === 'ai' && <ChatAssistant t={t} currentUser={currentUser} onReport={(rep) => { setReports(prev => [{...rep, id: Date.now().toString(), timestamp: new Date(), status: 'Pending'}, ...prev]); addToast(lang === 'ar' ? 'تم إرسال البلاغ للمراجعة' : 'Report submitted for audit', 'info'); }} />}

        {activeTab === 'pathfinder' && <Pathfinder t={t} />}

        {activeTab === 'profile' && (
          <Profile 
            user={viewingUser || currentUser} 
            currentUser={currentUser} 
            allUsers={allUsers} 
            handleUpdateRole={handleUpdateRole} 
            onUpdateUser={(u) => { setCurrentUser(u); setAllUsers(prev => prev.map(user => user.id === u.id ? u : user)); }} 
            onActivityClick={() => {}} 
            onViewUser={onViewUser} 
            isSelf={!viewingUser || viewingUser.id === currentUser.id} 
            t={t} 
          />
        )}

        {activeTab === 'dashboard' && currentUser.role === 'Owner' && (
          <OwnerDashboard 
            reports={reports} 
            students={allUsers} 
            onUpdateRole={handleUpdateRole} 
            onBroadcast={handleBroadcast}
            onResolveReport={(id, action) => { setReports(prev => prev.filter(r => r.id !== id)); addToast(action === 'Dismiss' ? 'Report Dismissed' : 'Content Removed', 'info'); }}
            t={t} 
          />
        )}
      </main>

      <div className={`fixed bottom-10 ${lang === 'ar' ? 'left-10' : 'right-10'} flex flex-col items-end space-y-4 z-50`}>
        <button onClick={handleLogout} className="bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/20 w-12 h-12 rounded-xl flex items-center justify-center transition-all shadow-lg">
           <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
        </button>
        <button onClick={() => setIsChatOpen(!isChatOpen)} className="w-16 h-16 rounded-2xl cyber-gradient flex items-center justify-center shadow-2xl hover:scale-110 transition-all">
          <Icons.Robot className="w-8 h-8 text-white" />
        </button>
      </div>

      {isChatOpen && (
        <div className={`fixed bottom-32 ${lang === 'ar' ? 'left-10' : 'right-10'} w-[24rem] z-[60] animate-in slide-in-from-bottom-10 duration-300`}>
           <ChatAssistant t={t} currentUser={currentUser} onReport={(rep) => { setReports(prev => [{...rep, id: Date.now().toString(), timestamp: new Date(), status: 'Pending'}, ...prev]); addToast(lang === 'ar' ? 'تم إرسال البلاغ للمراجعة' : 'Report submitted for audit', 'info'); }} />
        </div>
      )}

      <ToastContainer toasts={toasts} />
    </div>
  );
};

const ToastContainer: React.FC<{ toasts: Toast[] }> = ({ toasts }) => (
  <div className="fixed top-10 right-10 z-[1000] flex flex-col gap-4 pointer-events-none">
    {toasts.map(toast => (
      <div key={toast.id} className={`p-6 rounded-2xl border backdrop-blur-3xl shadow-2xl animate-in slide-in-from-right-10 duration-300 pointer-events-auto ${
        toast.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' :
        toast.type === 'error' ? 'bg-red-500/10 border-red-500/30 text-red-400' :
        'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
      }`}>
        <p className="text-xs font-black uppercase tracking-widest">{toast.message}</p>
      </div>
    ))}
  </div>
);

export default App;

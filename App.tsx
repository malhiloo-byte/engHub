
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ChatAssistant from './components/ChatAssistant';
import Community from './components/Community';
import Library from './components/Library';
import Coordination from './components/Coordination';
import Profile from './components/Profile';
import OwnerDashboard from './components/OwnerDashboard';
import Roadmaps from './components/Roadmaps';
import Auth from './components/Auth';
import { Icons, CURRENT_USER, MOCK_STUDENTS, TRANSLATIONS, MOCK_REPORTS, MOCK_PROJECTS, MOCK_QUESTIONS, MOCK_COURSES, MOCK_CHALLENGE } from './constants';
import { User, UserRole, Report, ProjectIdea, Question, Course, CourseResource, WeeklyChallenge } from './types';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('cyberhub_users');
    return saved ? JSON.parse(saved) : MOCK_STUDENTS;
  });

  const [activeTab, setActiveTab] = useState('home');
  const [prevTab, setPrevTab] = useState('home');
  const [isStarActive, setIsStarActive] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [isChatOpen, setIsChatOpen] = useState(false);
  
  const [reports, setReports] = useState<Report[]>(MOCK_REPORTS);
  const [projects, setProjects] = useState<ProjectIdea[]>(MOCK_PROJECTS);
  const [questions, setQuestions] = useState<Question[]>(MOCK_QUESTIONS);
  const [courses, setCourses] = useState<Course[]>(MOCK_COURSES);
  const [challenge, setChallenge] = useState<WeeklyChallenge>(MOCK_CHALLENGE);
  
  const [viewingUser, setViewingUser] = useState<User | null>(null);
  const t = TRANSLATIONS.en;

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.documentElement.lang = 'en';
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('cyberhub_users', JSON.stringify(allUsers));
  }, [allUsers]);

  const handleLogin = (user: User) => {
    // Re-check role from "allUsers" to ensure we have the latest promotion status
    const dbUser = allUsers.find(u => u.email === user.email);
    setCurrentUser(dbUser || user);
    setIsLoggedIn(true);
  };

  const handleRegister = (user: User) => {
    setAllUsers(prev => [...prev, user]);
  };

  const handleUpdateRole = (userId: string, newRole: UserRole) => {
    // 1. Update the Global User Database
    const updatedUsers = allUsers.map(u => u.id === userId ? { ...u, role: newRole } : u);
    setAllUsers(updatedUsers);
    localStorage.setItem('cyberhub_users', JSON.stringify(updatedUsers));

    // 2. If the user being promoted is currently viewing themselves, or if Owner promotes them
    // Logic: If the session user ID matches the updated ID, force re-login to apply permissions
    if (currentUser?.id === userId) {
      alert(`Security Protocol: Your role has been updated to ${newRole}. Please re-authenticate to apply new clearance levels.`);
      handleLogout();
    } else {
      // If we are viewing the person we just promoted, update the viewing state
      if (viewingUser?.id === userId) {
        setViewingUser(prev => prev ? { ...prev, role: newRole } : null);
      }
      // Note: In a multi-user environment, User B would be logged out via a socket or token check.
      // In this simulation, if the user logs in as the promoted person next, they will see the changes.
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setViewingUser(null);
    setActiveTab('home');
  };

  const onActivityClick = (linkId?: string, type?: string) => {
    if (!linkId) return;
    if (type === 'Question' || type === 'Answer') setActiveTab('community');
    if (type === 'Contribution') setActiveTab('library');
    if (type === 'Project') setActiveTab('coordination');
  };

  const handleStarToggle = () => {
    if (!isStarActive) {
      setPrevTab(activeTab);
      setActiveTab('achievements');
    } else {
      setActiveTab(prevTab);
    }
    setIsStarActive(!isStarActive);
  };

  const handleJoinToggle = (id: string) => {
    if (!currentUser) return;
    const isJoined = currentUser.joinedProjects?.includes(id);
    setCurrentUser(prev => {
      if (!prev) return null;
      return {
        ...prev,
        joinedProjects: isJoined ? prev.joinedProjects?.filter(p => p !== id) : [...(prev.joinedProjects || []), id],
        karma: isJoined ? Math.max(0, prev.karma - 10) : prev.karma + 50,
      }
    });
    setProjects(prev => prev.map(p => {
      if (p.id === id) {
        return { ...p, filledSlots: p.filledSlots + (isJoined ? -1 : 1) };
      }
      return p;
    }));
  };

  const handleFeatureQuestion = (id: string) => {
    setQuestions(prev => prev.map(q => q.id === id ? { ...q, isFeatured: !q.isFeatured } : q));
  };

  const handleReplyQuestion = (questionId: string, replyText: string) => {
    if (!currentUser) return;
    setQuestions(prev => prev.map(q => {
      if (q.id === questionId) {
        return {
          ...q,
          status: 'Answered',
          answers: [...q.answers, {
            id: `ans-${Date.now()}`,
            authorId: currentUser.id,
            authorName: currentUser.name,
            authorRole: currentUser.role,
            text: replyText,
            timestamp: new Date(),
            isVerified: currentUser.role === 'Faculty' || currentUser.role === 'Expert',
            upvotes: 0
          }]
        };
      }
      return q;
    }));
  };

  const onApproveResource = (courseId: string, resourceId: string, action: 'Approve' | 'Reject') => {
    setCourses(prev => prev.map(c => {
      if (c.id === courseId) {
        return { ...c, resources: c.resources.map(r => r.id === resourceId ? { ...r, status: action === 'Approve' ? 'Approved' : 'Rejected' } : r) };
      }
      return c;
    }));
  };

  const handleMeetingPermission = (userId: string, action: 'Accept' | 'Reject') => {
    setChallenge(prev => ({
      ...prev,
      joinRequests: prev.joinRequests.map(r => r.userId === userId ? { ...r, status: action === 'Accept' ? 'Accepted' : 'Rejected' } : r)
    }));
  };

  const handleJoinMeetingRequest = () => {
    if (!currentUser) return;
    setChallenge(prev => ({
      ...prev,
      joinRequests: [...prev.joinRequests, { userId: currentUser.id, userName: currentUser.name, status: 'Pending' }]
    }));
  };

  const handleAddQuestion = (q: Question) => {
    if (!currentUser) return;
    setQuestions(prev => [q, ...prev]);
    setCurrentUser(prev => {
      if (!prev) return null;
      return { 
        ...prev, 
        karma: prev.karma + 10,
        stats: prev.stats ? { ...prev.stats, questionsAsked: prev.stats.questionsAsked + 1 } : prev.stats,
      }
    });
  };

  const handleAddResource = (courseId: string, res: any) => {
    if (!currentUser) return;
    const isAutoApproved = currentUser.role === 'Faculty' || currentUser.role === 'Owner';
    const newRes: CourseResource = { 
      ...res, 
      id: `r-${Date.now()}`, 
      timestamp: new Date(), 
      status: isAutoApproved ? 'Approved' : 'Pending' 
    };
    setCourses(prev => prev.map(c => c.id === courseId ? { ...c, resources: [newRes, ...c.resources] } : c));
  };

  const handleAddProject = (p: ProjectIdea) => {
    if (!currentUser) return;
    setProjects(prev => [p, ...prev]);
  };

  const handleUpdateUser = (updatedUser: User) => {
    setCurrentUser(updatedUser);
    setAllUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
  };

  const onViewUser = (id: string) => {
    // Refresh user data from allUsers to see latest promotion
    const found = allUsers.find(s => s.id === id);
    if (found) { 
      setViewingUser(found); 
      setActiveTab('profile'); 
    }
  };

  if (!isLoggedIn || !currentUser) {
    return <Auth onLogin={handleLogin} existingUsers={allUsers} onRegister={handleRegister} />;
  }

  return (
    <div className="min-h-screen pl-20 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 transition-colors duration-300">
      <Sidebar activeTab={activeTab} setActiveTab={(tab) => { setActiveTab(tab); setViewingUser(null); setIsStarActive(false); }} theme={theme} setTheme={setTheme} t={t} />

      <main className="max-w-7xl mx-auto px-8 py-10 min-h-screen">
        <header className="flex justify-between items-center mb-12">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-orbitron font-bold cyber-text-gradient">{t.title}</h1>
            <span className="h-6 w-[1px] bg-slate-200 dark:bg-white/10" />
            <p className="text-slate-500 text-sm font-medium">{t.academicExcellence}</p>
          </div>
          <div className="flex items-center space-x-4">
            <button 
              onClick={handleStarToggle} 
              className={`p-3 rounded-xl border transition-all duration-500 ${isStarActive ? 'bg-yellow-500 text-white shadow-lg' : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-400 hover:text-yellow-500'}`}
              title={t.achievementsHall}
            >
              <Icons.Star className="w-7 h-7" />
            </button>
            
            {currentUser.role === 'Owner' && (
              <button 
                onClick={() => setActiveTab('owner-dashboard')} 
                className={`p-3 rounded-xl border transition-all ${activeTab === 'owner-dashboard' ? 'bg-cyan-500 text-white shadow-lg' : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-400 hover:text-cyan-500'}`}
              >
                <Icons.Trophy className="w-6 h-6" />
              </button>
            )}

            <div onClick={() => { setViewingUser(null); setActiveTab('profile'); }} className="flex items-center space-x-3 bg-white dark:bg-white/5 p-1.5 pr-5 pl-1.5 rounded-full border border-slate-200 dark:border-white/5 hover:border-cyan-500/50 transition-colors cursor-pointer group shadow-sm">
              <img src={currentUser.avatar} className="w-10 h-10 rounded-full border border-slate-200 dark:border-white/20 object-cover" />
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{currentUser.name}</span>
                <span className={`text-[9px] font-bold uppercase ${currentUser.role === 'Owner' ? 'text-red-500' : 'text-cyan-500'}`}>{currentUser.role}</span>
              </div>
            </div>
          </div>
        </header>

        {activeTab === 'home' && (
          <div className="space-y-24 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
            <section className="relative overflow-hidden rounded-[3rem] bg-white dark:bg-gradient-to-br dark:from-slate-900 dark:to-slate-950 border border-slate-200 dark:border-white/5 p-12 lg:p-16 shadow-xl dark:shadow-2xl">
              <div className="absolute -top-24 -right-24 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px]" />
              <div className="relative z-10 max-w-2xl">
                <h2 className="text-5xl lg:text-7xl font-orbitron font-bold leading-tight mb-6">{t.heroTitle} <br/><span className="cyber-text-gradient">{t.heroAccent}</span></h2>
                <p className="text-slate-500 dark:text-slate-400 text-lg mb-8 leading-relaxed max-w-lg">{t.heroDesc}</p>
                <div className="flex space-x-4">
                  <button onClick={() => setActiveTab('library')} className="cyber-gradient px-8 py-4 rounded-2xl font-bold text-white shadow-xl shadow-cyan-500/20 hover:scale-105 transition-all">{t.browseLibrary}</button>
                  <button onClick={() => setActiveTab('community')} className="bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 px-8 py-4 rounded-2xl font-bold text-slate-600 dark:text-white hover:bg-slate-200 dark:hover:bg-white/10 transition-all">{t.joinCommunity}</button>
                </div>
              </div>
            </section>
            <Roadmaps currentUser={currentUser} onUpdateProgress={(sid) => {
              const alreadyDone = currentUser.completedRoadmapSteps?.includes(sid);
              setCurrentUser(prev => {
                if (!prev) return null;
                return { 
                  ...prev, 
                  completedRoadmapSteps: alreadyDone ? prev.completedRoadmapSteps?.filter(id => id !== sid) : [...(prev.completedRoadmapSteps || []), sid],
                  karma: alreadyDone ? Math.max(0, prev.karma - 10) : prev.karma + 100 
                }
              });
            }} t={t} />
          </div>
        )}

        {activeTab === 'community' && <Community currentUser={currentUser} questions={questions} onAddQuestion={handleAddQuestion} onReport={(r) => setReports(prev => [{ ...r, id: `rep-${Date.now()}`, timestamp: new Date(), status: 'Pending' } as Report, ...prev])} onViewUser={onViewUser} onFeatureQuestion={handleFeatureQuestion} onReplyQuestion={handleReplyQuestion} challenge={challenge} onJoinMeeting={handleJoinMeetingRequest} onMeetingPermission={handleMeetingPermission} t={t} />}
        {activeTab === 'library' && <Library courses={courses} onAddResource={handleAddResource} onViewUser={onViewUser} onApproveResource={onApproveResource} user={currentUser} t={t} />}
        {activeTab === 'coordination' && <Coordination projects={projects} onJoinToggle={handleJoinToggle} onAddProject={handleAddProject} currentUser={currentUser} t={t} />}
        {activeTab === 'ai' && <ChatAssistant onReport={(r) => setReports(prev => [{ ...r, id: `rep-chat-${Date.now()}`, timestamp: new Date(), status: 'Pending' } as Report, ...prev])} currentUser={currentUser} t={t} />}
        {activeTab === 'profile' && (
          <Profile 
            user={viewingUser || currentUser} 
            currentUser={currentUser}
            allUsers={allUsers}
            handleUpdateRole={handleUpdateRole} 
            onUpdateUser={handleUpdateUser} 
            isSelf={!viewingUser || viewingUser.id === currentUser.id} 
            onActivityClick={onActivityClick} 
            onViewUser={onViewUser} 
            t={t} 
          />
        )}
        {activeTab === 'owner-dashboard' && currentUser.role === 'Owner' && <OwnerDashboard reports={reports} students={allUsers} onUpdateRole={handleUpdateRole} t={t} />}
        
        {activeTab === 'achievements' && (
          <div className="space-y-12 animate-in slide-in-from-top-10 duration-700 max-w-4xl mx-auto pb-20">
             <div className="text-center space-y-4">
                <div className="w-20 h-20 rounded-full bg-yellow-500/20 flex items-center justify-center mx-auto border border-yellow-500/50 shadow-lg"><Icons.Star className="w-10 h-10 text-yellow-500" /></div>
                <h2 className="text-3xl font-bold font-orbitron">{t.achievementsHall}</h2>
                <p className="text-slate-500">Track your academic progress and engineering prestige.</p>
             </div>
             <div className="glass p-10 rounded-[2rem] text-center border-white/10">
                <h3 className="text-2xl font-bold mb-4 font-orbitron">Academic Karma: <span className="text-cyan-500">{currentUser.karma}</span></h3>
                <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden border border-white/5">
                   <div className="h-full cyber-gradient shadow-[0_0_15px_rgba(6,182,212,0.5)] transition-all duration-1000" style={{ width: `${Math.min(100, (currentUser.karma / 1000) * 100)}%` }} />
                </div>
                <p className="text-slate-500 text-[10px] mt-4 uppercase font-bold tracking-widest">Candidate for Expert Verification</p>
             </div>
          </div>
        )}
      </main>

      <div className="fixed bottom-10 right-10 flex flex-col items-end space-y-4 z-50">
        <button onClick={handleLogout} className="bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/20 w-12 h-12 rounded-xl flex items-center justify-center transition-all shadow-lg group">
           <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
        </button>
        <button onClick={() => setIsChatOpen(!isChatOpen)} className="w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-2xl hover:scale-110 active:scale-95 group cyber-gradient"><Icons.Robot className={`w-8 h-8 ${isChatOpen ? 'text-slate-100' : 'text-white'}`} /></button>
      </div>

      {isChatOpen && <div className="fixed bottom-32 right-10 w-[24rem] z-[60] animate-in slide-in-from-bottom-10 fade-in duration-300"><ChatAssistant onReport={(r) => setReports(prev => [{ ...r, id: `rep-chat-${Date.now()}`, timestamp: new Date(), status: 'Pending' } as Report, ...prev])} currentUser={currentUser} t={t} /></div>}
    </div>
  );
};

export default App;

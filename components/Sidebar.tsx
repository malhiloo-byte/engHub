
import React from 'react';
import { Icons } from '../constants';
import { UserRole } from '../types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  theme: 'light' | 'dark';
  setTheme: (t: 'light' | 'dark') => void;
  lang: 'en' | 'ar';
  toggleLang: () => void;
  t: any;
  userRole?: UserRole;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, theme, setTheme, lang, toggleLang, t, userRole }) => {
  const navItems = [
    { id: 'home', icon: <Icons.Home />, label: t.home },
    { id: 'community', icon: <Icons.Community />, label: t.community },
    { id: 'library', icon: <Icons.Library />, label: t.library },
    { id: 'coordination', icon: <Icons.Coordination />, label: t.coordination },
    { id: 'pathfinder', icon: <Icons.Trophy />, label: t.pathfinder },
    { id: 'ai', icon: <Icons.AI />, label: t.aiAssistant },
    { id: 'profile', icon: <Icons.Profile />, label: t.profile },
  ];

  if (userRole === 'Owner') {
    navItems.splice(6, 0, { id: 'dashboard', icon: <Icons.Shield />, label: t.dashboard });
  }

  return (
    <div className={`fixed ${lang === 'ar' ? 'right-0' : 'left-0'} top-0 h-full w-20 flex flex-col items-center py-8 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-r border-slate-200 dark:border-white/5 z-50 transition-colors duration-300`}>
      <div className="mb-12 group cursor-pointer relative" onClick={() => setActiveTab('home')}>
        <div className="w-12 h-12 cyber-gradient rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-500/20 transition-all duration-500 group-hover:rotate-[360deg] group-hover:scale-110 group-hover:shadow-cyan-500/50 group-hover:rounded-[50%]">
          <span className="font-orbitron font-bold text-white text-2xl group-hover:scale-125 transition-transform">C</span>
        </div>
        <div className="absolute inset-0 w-12 h-12 bg-cyan-400 rounded-2xl blur-xl opacity-0 group-hover:opacity-40 transition-opacity animate-pulse pointer-events-none" />
      </div>

      <nav className="flex flex-col space-y-4 flex-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`p-3 rounded-xl transition-all duration-300 group relative ${
              activeTab === item.id 
                ? 'cyber-gradient text-white shadow-lg shadow-blue-500/30 scale-110' 
                : 'text-slate-400 hover:text-cyan-500 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
            }`}
          >
            {item.icon}
            <span className={`absolute ${lang === 'ar' ? 'right-full mr-4' : 'left-full ml-4'} px-2 py-1 bg-slate-900 text-xs text-white rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-white/10`}>
              {item.label}
            </span>
          </button>
        ))}
      </nav>

      <div className="mt-auto flex flex-col items-center space-y-4">
        <button 
          onClick={toggleLang}
          className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-white/5 group relative"
        >
          <Icons.Globe />
          <span className={`absolute ${lang === 'ar' ? 'right-full mr-4' : 'left-full ml-4'} px-2 py-1 bg-slate-900 text-xs text-white rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-white/10`}>
            {t.langToggle}
          </span>
        </button>
        <button 
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-white/5"
        >
          {theme === 'dark' ? <Icons.Sun /> : <Icons.Moon />}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;

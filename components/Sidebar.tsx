
import React from 'react';
import { Icons } from '../constants';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  theme: 'light' | 'dark';
  setTheme: (t: 'light' | 'dark') => void;
  t: any;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, theme, setTheme, t }) => {
  const navItems = [
    { id: 'home', icon: <Icons.Home />, label: t.home },
    { id: 'community', icon: <Icons.Community />, label: t.community },
    { id: 'library', icon: <Icons.Library />, label: t.library },
    { id: 'coordination', icon: <Icons.Coordination />, label: t.coordination },
    { id: 'ai', icon: <Icons.AI />, label: t.aiAssistant },
    { id: 'profile', icon: <Icons.Profile />, label: t.profile },
  ];

  return (
    <div className="fixed left-0 top-0 h-full w-20 flex flex-col items-center py-8 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-r border-slate-200 dark:border-white/5 z-50 transition-colors duration-300">
      <div className="mb-12 group cursor-pointer relative" onClick={() => setActiveTab('home')}>
        <div className="w-12 h-12 cyber-gradient rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-500/20 transition-all duration-500 group-hover:rotate-[360deg] group-hover:scale-110 group-hover:rounded-[50%]">
          <span className="font-orbitron font-bold text-white text-2xl">C</span>
        </div>
        <div className="absolute inset-0 w-12 h-12 bg-cyan-400 rounded-2xl blur-xl opacity-0 group-hover:opacity-40 transition-opacity pointer-events-none" />
      </div>

      <nav className="flex flex-col space-y-6 flex-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`p-3 rounded-xl transition-all duration-300 group relative ${
              activeTab === item.id 
                ? 'cyber-gradient text-white shadow-lg scale-110' 
                : 'text-slate-400 hover:text-cyan-500 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
            }`}
          >
            {item.icon}
            <span className="absolute left-full ml-4 px-2 py-1 bg-slate-900 text-[10px] text-white rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-white/10 uppercase font-black">
              {item.label}
            </span>
          </button>
        ))}
      </nav>

      <div className="mt-auto flex flex-col items-center">
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

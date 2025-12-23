
import React, { useState } from 'react';
import { Icons } from '../constants';
import { User, UserRole } from '../types';

interface AuthProps {
  onLogin: (user: User) => void;
  existingUsers: User[];
  onRegister: (user: User) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin, existingUsers, onRegister }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [major, setMajor] = useState('');
  const [error, setError] = useState('');

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isLogin) {
      // Owner Logic
      if (email === 'malhiloo@smail.ucas.edu.ps' && password === 'mahucas') {
        const owner: User = {
          id: 'u-owner',
          email: 'malhiloo@smail.ucas.edu.ps',
          name: 'Chief Administrator',
          role: 'Owner',
          avatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=300&h=300&fit=crop',
          karma: 9999,
          major: 'Cyber Governance',
          activity: [],
          badges: [{id: 'admin', label: 'System Owner', icon: '⚡', color: 'red'}]
        };
        onLogin(owner);
        return;
      }

      // Standard Login
      const user = existingUsers.find(u => u.email === email && u.password === password);
      if (user) {
        onLogin(user);
      } else {
        setError('Invalid credentials. Please verify your email and password.');
      }
    } else {
      // Sign up logic
      if (!email.endsWith('@smail.ucas.edu.ps')) {
        setError('Access restricted: Only @smail.ucas.edu.ps emails are permitted.');
        return;
      }
      if (password.length < 6) {
        setError('Security Protocol: Password must be at least 6 characters.');
        return;
      }
      if (!name || !major) {
        setError('Please complete all academic profile fields.');
        return;
      }

      const newUser: User = {
        id: `u-${Date.now()}`,
        email,
        password,
        name,
        major,
        role: 'Student', // Defaults to student
        avatar: `https://i.pravatar.cc/150?u=${email}`,
        karma: 0,
        activity: [],
        badges: [],
        skillScores: { network: 0, crypto: 0, programming: 0, ai: 0, appSec: 0 },
        stats: { questionsAsked: 0, answersGiven: 0, verificationsReceived: 0, karma: 0 }
      };
      onRegister(newUser);
      setIsLogin(true);
      setError('Registration Successful. Please Login.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decals */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px]" />

      <div className="w-full max-w-lg animate-in zoom-in duration-700">
        <div className="text-center mb-10">
          <div className="w-20 h-20 cyber-gradient rounded-[1.5rem] flex items-center justify-center mx-auto mb-6 shadow-[0_0_40px_rgba(6,182,212,0.3)]">
            <span className="text-white font-orbitron font-bold text-4xl">C</span>
          </div>
          <h1 className="text-4xl font-bold font-orbitron tracking-tight mb-2">CyberHub</h1>
          <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-[10px]">Academic Engineering Gateway</p>
        </div>

        <div className="glass p-12 rounded-[3.5rem] border-white/5 shadow-2xl space-y-8">
          <div className="flex bg-white/5 p-1 rounded-2xl border border-white/5 shadow-inner">
            <button onClick={() => setIsLogin(true)} className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${isLogin ? 'bg-cyan-500 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}>Login</button>
            <button onClick={() => setIsLogin(false)} className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${!isLogin ? 'bg-cyan-500 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}>Sign Up</button>
          </div>

          <form onSubmit={handleAuth} className="space-y-6">
            {error && <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-xs font-bold text-center animate-shake">{error}</div>}
            
            {!isLogin && (
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-2">Full Name</label>
                  <input value={name} onChange={e => setName(e.target.value)} placeholder="Enter full name" className="w-full bg-slate-900 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:ring-2 ring-cyan-500/30 transition-all" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-2">Major</label>
                  <input value={major} onChange={e => setMajor(e.target.value)} placeholder="e.g. AI Engineering" className="w-full bg-slate-900 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:ring-2 ring-cyan-500/30 transition-all" />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-2">University Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="name@smail.ucas.edu.ps" className="w-full bg-slate-900 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:ring-2 ring-cyan-500/30 transition-all" />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-2">Security Key</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className="w-full bg-slate-900 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:ring-2 ring-cyan-500/30 transition-all" />
            </div>

            <button type="submit" className="w-full cyber-gradient py-5 rounded-[2rem] font-black text-white text-xs uppercase tracking-[0.3em] shadow-2xl hover:scale-[1.02] active:scale-95 transition-all mt-4">
              {isLogin ? 'Initialize Session' : 'Create Profile'}
            </button>
          </form>
        </div>

        <p className="text-center mt-10 text-slate-600 text-[10px] font-bold uppercase tracking-widest">
          Secure Academic Network Protocol v4.0.1
        </p>
      </div>
    </div>
  );
};

export default Auth;

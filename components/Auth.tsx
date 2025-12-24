
import React, { useState } from 'react';
import { Icons, TRANSLATIONS } from '../constants';
import { User, UserRole } from '../types';

interface AuthProps {
  onLogin: (user: User) => void;
  existingUsers: User[];
  onRegister: (user: User) => void;
  lang?: 'en' | 'ar';
}

const Auth: React.FC<AuthProps> = ({ onLogin, existingUsers, onRegister, lang = 'en' }) => {
  const [view, setView] = useState<'login' | 'signup' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [major, setMajor] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const t = TRANSLATIONS[lang];

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (view === 'login') {
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
        setError(lang === 'ar' ? 'بيانات الاعتماد غير صالحة. يرجى التحقق من البريد وكلمة السر.' : 'Invalid credentials. Please verify your email and password.');
      }
    } else if (view === 'signup') {
      // Sign up logic
      if (!email.endsWith('@smail.ucas.edu.ps')) {
        setError(lang === 'ar' ? 'الدخول مقيد: مسموح فقط ببريد @smail.ucas.edu.ps.' : 'Access restricted: Only @smail.ucas.edu.ps emails are permitted.');
        return;
      }
      if (password.length < 6) {
        setError(lang === 'ar' ? 'بروتوكول أمني: يجب أن تكون كلمة السر 6 أحرف على الأقل.' : 'Security Protocol: Password must be at least 6 characters.');
        return;
      }
      if (!name || !major) {
        setError(lang === 'ar' ? 'يرجى إكمال جميع حقول الملف الأكاديمي.' : 'Please complete all academic profile fields.');
        return;
      }

      const newUser: User = {
        id: `u-${Date.now()}`,
        email,
        password,
        name,
        major,
        role: 'Student',
        avatar: `https://i.pravatar.cc/150?u=${email}`,
        karma: 0,
        activity: [],
        badges: [],
        skillScores: { network: 0, crypto: 0, programming: 0, ai: 0, appSec: 0 },
        stats: { questionsAsked: 0, answersGiven: 0, verificationsReceived: 0, karma: 0 }
      };
      onRegister(newUser);
      setView('login');
      setSuccess(lang === 'ar' ? 'تم التسجيل بنجاح. يرجى تسجيل الدخول.' : 'Registration Successful. Please Login.');
    } else if (view === 'forgot') {
      // Simulate sending recovery email
      const userExists = existingUsers.some(u => u.email === email) || email === 'malhiloo@smail.ucas.edu.ps';
      
      if (userExists) {
        setSuccess(t.recoveryEmailSent);
        // In a real app, this would call an API
        console.log(`Recovery link sent to: ${email}`);
      } else {
        setError(lang === 'ar' ? 'البريد الإلكتروني غير مسجل في نظامنا.' : 'Email is not registered in our system.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {/* Background Decals */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px]" />

      <div className="w-full max-w-lg animate-in zoom-in duration-700">
        <div className="text-center mb-10">
          <div className="w-20 h-20 cyber-gradient rounded-[1.5rem] flex items-center justify-center mx-auto mb-6 shadow-[0_0_40px_rgba(6,182,212,0.3)]">
            <span className="text-white font-orbitron font-bold text-4xl">C</span>
          </div>
          <h1 className="text-4xl font-bold font-orbitron tracking-tight mb-2">{t.title}</h1>
          <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-[10px]">{t.subtitle}</p>
        </div>

        <div className="glass p-12 rounded-[3.5rem] border-white/5 shadow-2xl space-y-8">
          {view !== 'forgot' && (
            <div className="flex bg-white/5 p-1 rounded-2xl border border-white/5 shadow-inner">
              <button onClick={() => { setView('login'); setError(''); setSuccess(''); }} className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${view === 'login' ? 'bg-cyan-500 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}>{lang === 'ar' ? 'دخول' : 'Login'}</button>
              <button onClick={() => { setView('signup'); setError(''); setSuccess(''); }} className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${view === 'signup' ? 'bg-cyan-500 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}>{lang === 'ar' ? 'تسجيل' : 'Sign Up'}</button>
            </div>
          )}

          {view === 'forgot' && (
            <div className="text-center space-y-4">
               <h2 className="text-2xl font-bold font-orbitron">{t.recoveryTitle}</h2>
               <p className="text-slate-500 text-xs font-medium">{lang === 'ar' ? 'أدخل بريدك الجامعي لاستلام رابط استعادة الحساب' : 'Enter your institutional email to receive a recovery link.'}</p>
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-6">
            {error && <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-xs font-bold text-center animate-shake">{error}</div>}
            {success && <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-400 text-xs font-bold text-center">{success}</div>}
            
            {view === 'signup' && (
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-2">{t.name}</label>
                  <input value={name} onChange={e => setName(e.target.value)} placeholder="..." className="w-full bg-slate-900 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:ring-2 ring-cyan-500/30 transition-all" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-2">{t.major}</label>
                  <input value={major} onChange={e => setMajor(e.target.value)} placeholder="..." className="w-full bg-slate-900 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:ring-2 ring-cyan-500/30 transition-all" />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-2">{lang === 'ar' ? 'البريد الجامعي' : 'University Email'}</label>
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="name@smail.ucas.edu.ps" className="w-full bg-slate-900 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:ring-2 ring-cyan-500/30 transition-all" />
            </div>

            {view !== 'forgot' && (
              <div className="space-y-1">
                <div className="flex justify-between items-center mb-1">
                  <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-2">{lang === 'ar' ? 'مفتاح الأمان' : 'Security Key'}</label>
                  {view === 'login' && (
                    <button type="button" onClick={() => { setView('forgot'); setError(''); setSuccess(''); }} className="text-[9px] font-bold text-cyan-500 uppercase hover:underline">{t.forgotPassword}</button>
                  )}
                </div>
                <input type="password" required={view !== 'forgot'} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className="w-full bg-slate-900 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:ring-2 ring-cyan-500/30 transition-all" />
              </div>
            )}

            <button type="submit" className="w-full cyber-gradient py-5 rounded-[2rem] font-black text-white text-xs uppercase tracking-[0.3em] shadow-2xl hover:scale-[1.02] active:scale-95 transition-all mt-4">
              {view === 'login' ? (lang === 'ar' ? 'تهيئة الجلسة' : 'Initialize Session') : (view === 'signup' ? (lang === 'ar' ? 'إنشاء الملف' : 'Create Profile') : t.sendRecovery)}
            </button>

            {view === 'forgot' && (
              <button type="button" onClick={() => { setView('login'); setError(''); setSuccess(''); }} className="w-full text-center text-[10px] font-black uppercase text-slate-500 hover:text-cyan-500 transition-colors">
                {t.backToLogin}
              </button>
            )}
          </form>
        </div>

        <p className="text-center mt-10 text-slate-600 text-[10px] font-bold uppercase tracking-widest">
          Secure Academic Network Protocol v4.0.2
        </p>
      </div>
    </div>
  );
};

export default Auth;


import React, { useState } from 'react';
import { Icons } from '../constants';
import { Course, CourseResource, User } from '../types';

interface LibraryProps {
  courses: Course[];
  onAddResource: (id: string, res: any) => void;
  onViewUser: (id: string) => void;
  onApproveResource: (courseId: string, resourceId: string, action: 'Approve' | 'Reject') => void;
  user: User;
  t: any;
}

const Library: React.FC<LibraryProps> = ({ courses, onAddResource, onViewUser, onApproveResource, user, t }) => {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [activeView, setActiveView] = useState<'Official' | 'Practical' | 'Review'>('Official');
  const [searchQuery, setSearchQuery] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [activeResource, setActiveResource] = useState<CourseResource | null>(null);

  // Form State
  const [resTitle, setResTitle] = useState('');
  const [resUrl, setResUrl] = useState('');
  const [resType, setResType] = useState<any>('Explanation');
  const [resOrigin, setResOrigin] = useState<any>('Practical');

  const filteredCourses = courses.filter(c => 
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const canReview = user.role === 'Faculty' || user.role === 'Expert' || user.role === 'Owner';

  const handleUpload = () => {
    if (!selectedCourse || !resTitle || !resUrl) return;
    onAddResource(selectedCourse.id, {
      name: resTitle, type: resType, url: resUrl, origin: resOrigin,
      authorName: user.name, authorRole: user.role, authorId: user.id,
    });
    setShowUploadModal(false);
    setResTitle(''); setResUrl('');
  };

  if (selectedCourse) {
    const activeCourse = courses.find(c => c.id === selectedCourse.id)!;
    const courseResources = activeCourse.resources;
    const officialResources = courseResources.filter(r => r.origin === 'Official' && r.status === 'Approved');
    const practicalResources = courseResources.filter(r => r.origin === 'Practical' && r.status === 'Approved');
    const pendingResources = courseResources.filter(r => r.status === 'Pending');

    return (
      <div className="animate-in fade-in slide-in-from-right-4 duration-500">
        <button 
          onClick={() => setSelectedCourse(null)}
          className="flex items-center space-x-2 text-slate-500 hover:text-cyan-500 transition-colors mb-8 font-bold"
        >
          <div className="rtl:rotate-180"><Icons.ChevronRight /></div>
          <span>{t.backToLibrary}</span>
        </button>

        <div className="mb-8 flex items-center justify-between gap-4">
          <div className="flex bg-slate-100 dark:bg-white/5 p-1 rounded-2xl w-fit flex-wrap">
            <button onClick={() => setActiveView('Official')} className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeView === 'Official' ? 'bg-white dark:bg-slate-800 shadow-lg text-cyan-500' : 'text-slate-500'}`}>{t.officialArchive}</button>
            <button onClick={() => setActiveView('Practical')} className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeView === 'Practical' ? 'bg-white dark:bg-slate-800 shadow-lg text-cyan-500' : 'text-slate-500'}`}>{t.practicalLibrary}</button>
            {canReview && (
              <button onClick={() => setActiveView('Review')} className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeView === 'Review' ? 'bg-white dark:bg-slate-800 shadow-lg text-amber-500' : 'text-slate-500'}`}>{t.pendingReview} ({pendingResources.length})</button>
            )}
          </div>
          <button onClick={() => setShowUploadModal(true)} className="cyber-gradient px-5 py-2.5 rounded-xl font-bold text-white text-sm shadow-lg hover:scale-105 transition-all">{t.uploadResource}</button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="glass p-6 rounded-[2rem] border-white/5 space-y-4">
              <img src={activeCourse.image} className="w-full h-32 object-cover rounded-2xl shadow-lg" alt="" />
              <h2 className="text-xl font-bold text-slate-800 dark:text-white">{activeCourse.title}</h2>
              <p className="text-xs text-slate-500 leading-relaxed">{activeCourse.description}</p>
              <div className="pt-4 border-t border-white/5">
                <p className="text-[10px] font-black uppercase text-slate-400 mb-1">{t.faculty}</p>
                <p className="text-sm font-bold text-cyan-500">{activeCourse.instructor}</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3 space-y-10">
            {activeView === 'Official' && <ResourceGrid resources={officialResources} onSelect={setActiveResource} onViewUser={onViewUser} t={t} />}
            {activeView === 'Practical' && <ResourceGrid resources={practicalResources} onSelect={setActiveResource} onViewUser={onViewUser} t={t} variant="Practical" />}
            {activeView === 'Review' && (
              <div className="space-y-4">
                {pendingResources.map(res => (
                  <div key={res.id} className="flex items-center justify-between p-6 bg-amber-500/5 rounded-3xl border border-amber-500/20 shadow-xl group">
                    <div className="flex items-center space-x-4">
                       <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center"><Icons.Folder /></div>
                       <div>
                          <h4 className="font-bold text-sm text-amber-600 dark:text-amber-400">{res.name}</h4>
                          <p className="text-[10px] text-slate-500 uppercase font-black">Submitted by {res.authorName} • {res.type}</p>
                       </div>
                    </div>
                    <div className="flex space-x-2">
                       <button onClick={() => onApproveResource(activeCourse.id, res.id, 'Approve')} className="bg-emerald-500 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase hover:scale-105 active:scale-95 transition-all">{t.approve}</button>
                       <button onClick={() => onApproveResource(activeCourse.id, res.id, 'Reject')} className="bg-red-500 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase hover:scale-105 active:scale-95 transition-all">{t.reject}</button>
                       <button onClick={() => setActiveResource(res)} className="border border-white/10 px-4 py-2 rounded-xl text-[10px] font-black uppercase text-slate-400 hover:text-white">Preview</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {activeResource && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
             <div className="glass w-full max-w-2xl p-10 rounded-[3rem] border-cyan-500/30 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5 text-[200px] pointer-events-none"><Icons.Folder /></div>
                <div className="flex justify-between items-start mb-10">
                   <div>
                      <span className="px-3 py-1 bg-cyan-500/10 text-cyan-500 rounded-full text-[10px] font-black uppercase tracking-widest border border-cyan-500/20">{activeResource.type}</span>
                      <h2 className="text-3xl font-bold font-orbitron text-white mt-4">{activeResource.name}</h2>
                      <p className="text-slate-500 text-sm mt-1">Contributor: <span className="text-cyan-500 font-bold">{activeResource.authorName}</span></p>
                   </div>
                   <button onClick={() => setActiveResource(null)} className="w-12 h-12 rounded-2xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors">✕</button>
                </div>
                <div className="bg-slate-900/50 p-8 rounded-3xl border border-white/10 min-h-[150px] mb-10">
                   <p className="text-slate-400 leading-relaxed italic">"Integrated cybersecurity analysis and engineering resources for advanced study..."</p>
                </div>
                <button onClick={() => window.open(activeResource.url, '_blank')} className="w-full cyber-gradient py-4 rounded-2xl text-white font-black text-sm uppercase shadow-xl hover:scale-[1.02] transition-transform">Access Document</button>
             </div>
          </div>
        )}

        {showUploadModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
             <div className="glass w-full max-w-lg p-8 rounded-[2.5rem] border-cyan-500/30 shadow-2xl space-y-6">
                <h2 className="text-2xl font-bold font-orbitron">{t.uploadResource}</h2>
                <div className="space-y-4">
                  <div className="space-y-1"><label className="text-[10px] font-bold text-slate-500 uppercase px-1">{t.resourceTitle}</label><input value={resTitle} onChange={e => setResTitle(e.target.value)} className="w-full bg-slate-900 border border-white/10 rounded-xl px-5 py-3 text-white" /></div>
                  <div className="space-y-1"><label className="text-[10px] font-bold text-slate-500 uppercase px-1">{t.resourceUrl}</label><input value={resUrl} onChange={e => setResUrl(e.target.value)} className="w-full bg-slate-900 border border-white/10 rounded-xl px-5 py-3 text-white" /></div>
                  <div className="flex gap-4">
                    <div className="flex-1 space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase px-1">{t.resourceType}</label>
                      <select value={resType} onChange={e => setResType(e.target.value)} className="w-full bg-slate-900 border border-white/10 rounded-xl px-5 py-3 text-white appearance-none">
                         <option value="Explanation">{t.summaries}</option><option value="Video">{t.videos}</option><option value="Tool">{t.tools}</option><option value="Cert">{t.certs}</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-4"><button onClick={handleUpload} className="flex-1 cyber-gradient py-3 rounded-xl font-bold text-white shadow-lg">{t.submit}</button><button onClick={() => setShowUploadModal(false)} className="px-6 py-3 rounded-xl border border-white/10 font-bold">{t.cancel}</button></div>
             </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div><h2 className="text-4xl font-bold font-orbitron">{t.library}</h2><p className="text-slate-500 mt-1">Official archives and student-led practical knowledge base.</p></div>
        <input type="text" placeholder={t.searchPlaceholder} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full md:w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl py-3 px-6 text-slate-900 dark:text-white shadow-sm" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredCourses.map(course => (
          <div key={course.id} onClick={() => setSelectedCourse(course)} className="group glass rounded-[2rem] overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-cyan-500/10 cursor-pointer border-white/5">
            <div className="h-48 overflow-hidden relative">
              <img src={course.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent" />
              <div className="absolute top-4 left-4"><span className="px-2 py-1 bg-black/40 backdrop-blur-md border border-white/10 text-[9px] font-bold text-white uppercase rounded">{course.category}</span></div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white group-hover:text-cyan-400 transition-colors mb-2">{course.title}</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-2">{course.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ResourceGrid: React.FC<{ resources: CourseResource[], variant?: string, onSelect: (r: CourseResource) => void, onViewUser: (id: string) => void, t: any }> = ({ resources, variant = 'Official', onSelect, onViewUser, t }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {resources.map(res => (
        <div key={res.id} onClick={() => onSelect(res)} className="flex items-start p-5 bg-white dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10 hover:border-cyan-500/50 transition-all group shadow-sm cursor-pointer">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center mr-4 rtl:ml-4 rtl:mr-0 shrink-0 ${variant === 'Official' ? 'bg-cyan-500/10 text-cyan-500' : 'bg-purple-500/10 text-purple-500'}`}>
            {res.type === 'Video' ? <Icons.Video /> : res.type === 'Tool' ? <Icons.Globe /> : <Icons.Folder />}
          </div>
          <div className="flex-1 overflow-hidden">
            <h4 className="font-bold text-slate-800 dark:text-white group-hover:text-cyan-400 transition-colors truncate">{res.name}</h4>
            <div className="mt-3 flex items-center justify-between">
               <button onClick={(e) => { e.stopPropagation(); onViewUser(res.authorId); }} className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded border border-cyan-500/20 text-cyan-500 bg-cyan-500/5">{res.authorName}</button>
               <span className="text-[9px] font-bold text-slate-500 uppercase">{res.type}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Library;

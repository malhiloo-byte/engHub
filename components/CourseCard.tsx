
import React from 'react';
import { Course } from '../types';

interface CourseCardProps {
  course: Course;
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  return (
    <div className="group relative glass rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-cyan-500/10">
      <div className="h-40 overflow-hidden relative">
        <img 
          src={course.image} 
          alt={course.title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent" />
        <span className="absolute top-4 left-4 px-2 py-1 bg-cyan-500/20 backdrop-blur-md border border-cyan-500/30 text-[10px] font-bold text-cyan-300 uppercase tracking-widest rounded">
          {course.category}
        </span>
      </div>

      <div className="p-5">
        <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors line-clamp-1">
          {course.title}
        </h3>
        <p className="text-slate-400 text-sm mt-2 line-clamp-2 h-10">
          {course.description}
        </p>
        
        <div className="flex items-center mt-4 pt-4 border-t border-white/5 justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-full bg-slate-800" />
            <span className="text-xs text-slate-400">{course.instructor}</span>
          </div>
          <div className="flex items-center text-yellow-500">
            <span className="text-xs font-bold mr-1">★ {course.rating}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;

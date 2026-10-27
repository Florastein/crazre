import React, { useState } from 'react';
import { useAppState } from '../../contexts/StateContext';
import { 
  Calendar, Clock, ClipboardList, CheckCircle, HelpCircle, Book
} from 'lucide-react';

export default function AcademicCalendar() {
  const { courseworks = [], quizzes = [] } = useAppState();
  
  const [currentMonth, setCurrentMonth] = useState('August 2026');
  const [viewMode, setViewMode] = useState('month'); // 'month' | 'agenda'

  // Preloaded Academic events
  const events = [
    { date: '2026-08-15', title: 'CS 402 - Distributed Systems Quiz 1', type: 'quiz', time: '10:00', details: 'Online 30-minute timed evaluation' },
    { date: '2026-08-20', title: 'SE 406 - Software Architecture Spec Submission', type: 'coursework', time: '23:59', details: 'Submit PDF design specification' },
    { date: '2026-08-25', title: 'Mid-Semester Examinations Period', type: 'exam', time: '09:00', details: 'Faculty wide examination schedule' },
    { date: '2026-08-28', title: 'CS 402 - Assignment 2 Problem Set', type: 'coursework', time: '17:00', details: 'Submit algorithmic consensus exercises' },
    ...courseworks.map(cw => ({
      date: cw.dueDate || '2026-08-30',
      title: `${cw.courseCode} - ${cw.title}`,
      type: 'coursework',
      time: '23:59',
      details: `Coursework deadline for ${cw.courseName || cw.courseCode}`
    })),
    ...quizzes.map(q => ({
      date: q.dueDate || '2026-08-30',
      title: `${q.courseCode} - ${q.title}`,
      type: 'quiz',
      time: '12:00',
      details: `Quiz evaluation for ${q.courseCode}`
    }))
  ];

  // Quick Calendar Month representation for August 2026 (35 grid cells)
  // August 2026 starts on Saturday
  const augDays = Array.from({ length: 35 }, (_, i) => {
    const dayName = i - 5; // Align Saturday Aug 1st
    return {
      dayNum: dayName > 0 && dayName <= 31 ? dayName : null,
      dateString: dayName > 0 && dayName <= 31 ? `2026-08-${dayName.toString().padStart(2, '0')}` : null
    };
  });

  return (
    <div className="space-y-6 animate-fade-in text-text-primary text-xs">
      
      {/* 1. HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3 border-b border-border gap-2">
        <div>
          <h1 className="font-serif text-2xl font-bold text-primary-900">
            Academic Calendar
          </h1>
          <p className="text-xs text-text-secondary mt-1 font-sans">
            Track course assignment deadlines, quiz dates, and faculty examination periods.
          </p>
        </div>

        <div className="flex space-x-1 border border-border bg-surface p-1 rounded-lg shrink-0 font-sans font-semibold">
          <button 
            onClick={() => setViewMode('month')}
            className={`px-3 py-1.5 rounded-md transition text-xs cursor-pointer ${
              viewMode === 'month' ? 'bg-primary-900 text-white font-bold' : 'text-text-muted hover:bg-surface-alt'
            }`}
          >
            Month Grid View
          </button>
          <button 
            onClick={() => setViewMode('agenda')}
            className={`px-3 py-1.5 rounded-md transition text-xs cursor-pointer ${
              viewMode === 'agenda' ? 'bg-primary-900 text-white font-bold' : 'text-text-muted hover:bg-surface-alt'
            }`}
          >
            Summary Agenda List
          </button>
        </div>
      </div>

      {/* 2. TABULAR RENDERS */}
      {viewMode === 'month' ? (
        <div className="bg-surface rounded-xl border border-border shadow-xs overflow-hidden">
          
          {/* Calendar Month Header */}
          <div className="p-4 bg-surface-alt flex justify-between items-center border-b border-border">
            <h3 className="font-serif text-sm font-bold flex items-center">
              <Calendar className="w-4 h-4 mr-2 text-primary-500" />
              {currentMonth}
            </h3>
            <div className="flex space-x-1.5 text-xs font-semibold">
              <span className="px-2.5 py-1 bg-surface border border-border rounded-md">Term 2026 / 2027</span>
            </div>
          </div>

          {/* Day of Week headers */}
          <div className="grid grid-cols-7 border-b border-border text-center font-mono text-[9px] uppercase text-text-muted bg-surface-alt py-2 font-bold select-none">
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>

          {/* Day Grid representation */}
          <div className="grid grid-cols-7 divide-x divide-y divide-border min-h-[400px]">
            {augDays.map((day, index) => {
              const matchedEvents = day.dateString ? events.filter(e => e.date === day.dateString) : [];
              return (
                <div 
                  key={index} 
                  className={`p-1.5 min-h-[85px] flex flex-col justify-between transition-colors ${
                    !day.dayNum ? 'bg-surface-alt/40' : 'hover:bg-primary-50/20'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className={`font-mono text-[10px] font-bold ${
                      day.dayNum ? 'text-text-primary' : 'text-text-muted/40'
                    }`}>
                      {day.dayNum || ''}
                    </span>
                    {matchedEvents.length > 0 && (
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
                    )}
                  </div>

                  {/* Event Badges */}
                  <div className="space-y-1 my-1">
                    {matchedEvents.map((evt, idx) => (
                      <div 
                        key={idx}
                        className={`p-1 rounded text-[9px] font-medium leading-tight truncate border ${
                          evt.type === 'quiz'
                            ? 'bg-purple-50 text-purple-800 border-purple-200'
                            : evt.type === 'coursework'
                            ? 'bg-blue-50 text-blue-800 border-blue-200'
                            : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        }`}
                        title={evt.title}
                      >
                        <span className="font-bold">{evt.time}</span> {evt.title}
                      </div>
                    ))}
                  </div>

                  <div />
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Agenda View */
        <div className="bg-surface border border-border rounded-xl p-5 shadow-xs space-y-3">
          <h3 className="font-serif text-sm font-bold text-text-primary pb-2 border-b border-border">
            Upcoming Academic Agenda
          </h3>
          <div className="space-y-2.5">
            {events.map((evt, idx) => (
              <div key={idx} className="p-3 bg-surface-alt border border-border rounded-xl flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-[9px] font-bold px-2 py-0.5 bg-primary-50 text-primary-800 rounded uppercase border border-primary-200">
                      {evt.date} • {evt.time}
                    </span>
                    <span className="font-mono text-[9px] uppercase font-bold text-text-muted">{evt.type}</span>
                  </div>
                  <h4 className="font-serif text-xs font-bold text-text-primary">{evt.title}</h4>
                  <p className="text-[10px] text-text-secondary">{evt.details}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}

import React from 'react';
import { useAppState } from '../../contexts/StateContext';
import { 
  Book, ClipboardList, GraduationCap, CheckCircle, Clock, 
  HelpCircle, ArrowUpRight, Plus, Award
} from 'lucide-react';

export default function SupervisorDashboard({ setActivePage }) {
  const { 
    currentUser, 
    courses = [], 
    courseworks = [], 
    quizzes = [], 
    courseMaterials = []
  } = useAppState();

  // Find courses taught/assigned to this lecturer
  const myCourses = courses.filter(c => 
    c.lecturerId === currentUser?.id || c.dept?.toLowerCase() === currentUser?.dept?.toLowerCase()
  );

  // Courseworks created by lecturer or for their courses
  const myCourseworks = courseworks.filter(cw => 
    cw.creatorId === currentUser?.id || 
    myCourses.some(c => c.code.toLowerCase() === cw.courseCode.toLowerCase())
  );

  // Submissions submitted and waiting for grading
  const pendingSubmissionsCount = myCourseworks.reduce((acc, cw) => {
    const unsubmitted = (cw.submissions || []).filter(s => s.status === 'submitted' && (!s.grade || s.grade === '0')).length;
    return acc + unsubmitted;
  }, 0);

  // Quizzes created by lecturer
  const myQuizzes = quizzes.filter(q => 
    q.creatorId === currentUser?.id || 
    myCourses.some(c => c.id === q.courseId || c.code.toLowerCase() === q.courseCode.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fade-in text-text-primary text-xs">
      
      {/* 1. GREETING SUMMARY */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-4 border-b border-border">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl font-bold tracking-tight text-primary-900">
            Faculty / Lecturer Dashboard
          </h1>
          <p className="text-xs text-text-secondary mt-1 font-sans">
            Welcome back, <span className="font-semibold text-primary-600">{currentUser?.name}</span> ({currentUser?.dept || 'Faculty'}). Managing {myCourses.length} assigned courses.
          </p>
        </div>
        <button 
          onClick={() => setActivePage('coursework')}
          className="mt-3 md:mt-0 px-4 py-2 bg-primary-900 hover:bg-primary-800 text-white rounded-lg font-bold text-xs flex items-center space-x-2 transition cursor-pointer shadow-xs self-start md:self-auto"
        >
          <span>Open Coursework Management</span>
          <ArrowUpRight className="w-4 h-4" />
        </button>
      </div>

      {/* 2. STATS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* STAT 1: Assigned Courses */}
        <div className="bg-surface p-4 rounded-xl border border-border shadow-xs flex items-start space-x-3.5">
          <div className="p-2.5 bg-emerald-100 rounded-lg text-emerald-600">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-mono tracking-wider text-text-muted">Assigned Courses</span>
            <p className="font-serif text-xl font-bold mt-0.5 text-text-primary">
              {myCourses.length}
            </p>
            <p className="text-[10px] text-text-muted mt-0.5">Active Teaching Modules</p>
          </div>
        </div>

        {/* STAT 2: Courseworks Created */}
        <div className="bg-surface p-4 rounded-xl border border-border shadow-xs flex items-start space-x-3.5">
          <div className="p-2.5 bg-blue-100 rounded-lg text-blue-600">
            <ClipboardList className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-mono tracking-wider text-text-muted">Course Assignments</span>
            <p className="font-serif text-xl font-bold mt-0.5 text-text-primary">
              {myCourseworks.length}
            </p>
            <p className="text-[10px] text-text-muted mt-0.5">Published tasks</p>
          </div>
        </div>

        {/* STAT 3: Pending Submissions */}
        <div className="bg-surface p-4 rounded-xl border border-border shadow-xs flex items-start space-x-3.5">
          <div className="p-2.5 bg-amber-100 rounded-lg text-amber-600">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-mono tracking-wider text-text-muted">Pending Grading</span>
            <p className="font-serif text-xl font-bold mt-0.5 text-amber-700">
              {pendingSubmissionsCount}
            </p>
            <p className="text-[10px] text-amber-600 font-medium mt-0.5">Submissions awaiting feedback</p>
          </div>
        </div>

        {/* STAT 4: Quizzes */}
        <div className="bg-surface p-4 rounded-xl border border-border shadow-xs flex items-start space-x-3.5">
          <div className="p-2.5 bg-indigo-100 rounded-lg text-indigo-600">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-mono tracking-wider text-text-muted">Quizzes Published</span>
            <p className="font-serif text-xl font-bold mt-0.5 text-text-primary">
              {myQuizzes.length}
            </p>
            <p className="text-[10px] text-indigo-600 font-medium mt-0.5">Interactive tests</p>
          </div>
        </div>
      </div>

      {/* 3. TAUGHT COURSES TABLE */}
      <div className="bg-surface border border-border rounded-xl p-5 shadow-xs space-y-4">
        <div className="flex justify-between items-center pb-2 border-b border-border">
          <div className="flex items-center space-x-2">
            <Book className="w-4 h-4 text-emerald-600" />
            <h2 className="font-serif text-sm font-bold text-text-primary">Assigned Academic Courses</h2>
          </div>
          <button 
            onClick={() => setActivePage('academic_structure')}
            className="text-[11px] font-bold text-indigo-600 hover:underline cursor-pointer"
          >
            Manage Course Allocations →
          </button>
        </div>

        {myCourses.length === 0 ? (
          <div className="text-center py-8 text-text-muted space-y-1">
            <p className="font-semibold text-xs">No courses assigned yet.</p>
            <p className="text-[10px]">Head of Department can allocate courses in Academic Structure.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {myCourses.map(crs => {
              const courseTasks = myCourseworks.filter(cw => cw.courseCode.toLowerCase() === crs.code.toLowerCase());
              return (
                <div key={crs.id} className="p-4 bg-surface-alt border border-border rounded-xl space-y-3 flex flex-col justify-between hover:border-emerald-400 transition">
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="font-mono text-[10px] font-bold px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded border border-emerald-200">
                        {crs.code}
                      </span>
                      <span className="text-[10px] font-mono text-text-muted">Level {crs.level}</span>
                    </div>
                    <h3 className="font-serif text-xs font-bold text-text-primary">{crs.name}</h3>
                    <p className="text-[10px] text-text-secondary">{crs.dept} • {crs.programme}</p>
                  </div>

                  <div className="pt-2 border-t border-border flex justify-between items-center text-[10px] font-mono">
                    <span className="text-text-muted">{courseTasks.length} Coursework Tasks</span>
                    <span className="font-bold text-indigo-700">{(crs.enrolledStudents || []).length} Students</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 4. RECENT COURSEWORK ASSIGNMENTS & GRADING */}
      <div className="bg-surface border border-border rounded-xl p-5 shadow-xs space-y-4">
        <div className="flex justify-between items-center pb-2 border-b border-border">
          <div className="flex items-center space-x-2">
            <ClipboardList className="w-4 h-4 text-blue-600" />
            <h2 className="font-serif text-sm font-bold text-text-primary">Course Assignments & Grading Queue</h2>
          </div>
          <button 
            onClick={() => setActivePage('coursework')}
            className="text-[11px] font-bold text-indigo-600 hover:underline cursor-pointer"
          >
            View All in Coursework Portal →
          </button>
        </div>

        {myCourseworks.length === 0 ? (
          <div className="text-center py-8 text-text-muted space-y-1">
            <p className="font-semibold text-xs">No coursework tasks created yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {myCourseworks.map(cw => {
              const subsCount = (cw.submissions || []).length;
              return (
                <div key={cw.id} className="p-3.5 bg-surface-alt border border-border rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-[9px] font-bold px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded border border-blue-200 uppercase">
                        {cw.courseCode}
                      </span>
                      <span className="text-[10px] font-mono text-text-muted">Due: {cw.dueDate}</span>
                    </div>
                    <h4 className="font-serif text-xs font-bold text-text-primary">{cw.title}</h4>
                  </div>
                  <div className="flex items-center space-x-3 shrink-0">
                    <span className="font-mono text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-1 rounded border border-indigo-200">
                      {subsCount} Submissions
                    </span>
                    <button
                      onClick={() => setActivePage('coursework')}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded font-bold text-[10px] transition cursor-pointer"
                    >
                      Grade Task
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}

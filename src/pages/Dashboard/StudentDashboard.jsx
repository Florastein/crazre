import React from 'react';
import { useAppState } from '../../contexts/StateContext';
import { 
  GraduationCap, Calendar, Clock, ClipboardList, 
  Book, CheckCircle, HelpCircle, ArrowUpRight, Bell,
  Download, Award
} from 'lucide-react';

export default function StudentDashboard({ setActivePage }) {
  const { 
    currentUser, 
    courses = [], 
    courseworks = [], 
    quizzes = [], 
    courseMaterials = []
  } = useAppState();

  const getDaysDiff = (dateStr) => {
    if (!dateStr) return 0;
    const target = new Date(dateStr);
    const now = new Date("2026-08-12");
    const diffTime = target - now;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Filter student's enrolled courses or courses matching level/prog
  const enrolledCourses = courses.filter(c => 
    c.enrolledStudents?.includes(currentUser?.id) || 
    c.programme?.toLowerCase() === currentUser?.prog?.toLowerCase()
  );

  // Filter student's courseworks
  const studentCourseworks = courseworks.filter(cw => {
    const isEnrolled = enrolledCourses.some(c => c.code.toLowerCase() === cw.courseCode.toLowerCase());
    return isEnrolled || (cw.programme === currentUser?.prog && cw.level === currentUser?.level);
  });

  const pendingCourseworks = studentCourseworks.filter(cw => 
    !cw.submissions?.some(s => s.studentId === currentUser?.id)
  );

  const completedCourseworks = studentCourseworks.filter(cw => 
    cw.submissions?.some(s => s.studentId === currentUser?.id)
  );

  // Filter student's quizzes
  const studentQuizzes = quizzes.filter(q => 
    enrolledCourses.some(c => c.id === q.courseId || c.code.toLowerCase() === q.courseCode.toLowerCase())
  );

  const pendingQuizzes = studentQuizzes.filter(q => 
    !q.submissions?.some(s => s.studentId === currentUser?.id)
  );

  // Upcoming deliverables radar
  const allDeliverables = [
    ...studentCourseworks.map(cw => ({
      id: cw.id,
      title: cw.title,
      courseCode: cw.courseCode,
      dueDate: cw.dueDate,
      hasSubmitted: cw.submissions?.some(s => s.studentId === currentUser?.id),
      daysDiff: getDaysDiff(cw.dueDate),
      type: 'coursework'
    })),
    ...studentQuizzes.map(q => ({
      id: q.id,
      title: q.title,
      courseCode: q.courseCode,
      dueDate: q.dueDate,
      hasSubmitted: q.submissions?.some(s => s.studentId === currentUser?.id),
      daysDiff: getDaysDiff(q.dueDate),
      type: 'quiz'
    }))
  ];

  const missedDeadlines = allDeliverables.filter(item => !item.hasSubmitted && item.daysDiff < 0);
  const upcomingDeadlines = allDeliverables
    .filter(item => !item.hasSubmitted && item.daysDiff >= 0)
    .sort((a, b) => a.daysDiff - b.daysDiff);

  return (
    <div className="space-y-8 animate-fade-in text-text-primary text-xs">
      
      {/* 1. GREETING SECTION */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-4 border-b border-border">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl font-bold tracking-tight text-primary-900 dark:text-text-inverse">
            Good morning, {currentUser?.name?.split(' ')[0] || 'Student'}.
          </h1>
          <p className="text-xs text-text-secondary dark:text-text-muted mt-1.5 font-sans">
            Enrolled in <span className="font-semibold text-primary-600">{currentUser?.prog || 'Degree Programme'}</span> — Level {currentUser?.level || '400'} ({currentUser?.dept || 'Department'}).
          </p>
        </div>
        <div className="mt-4 md:mt-0 bg-surface dark:bg-primary-850 px-4 py-2 rounded-lg border border-border shadow-xs flex items-center space-x-2.5">
          <Calendar className="w-4 h-4 text-primary-500" />
          <span className="font-mono text-xs font-semibold">
            {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
        </div>
      </div>

      {/* 2. STATS CARD GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* STAT 1: Enrolled Courses */}
        <div className="bg-surface dark:bg-primary-900 p-4 rounded-xl border border-border shadow-xs flex items-start space-x-3.5">
          <div className="p-2.5 bg-emerald-100 rounded-lg text-emerald-600">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div className="truncate">
            <span className="text-[10px] uppercase font-mono tracking-wider text-text-muted">Enrolled Courses</span>
            <p className="font-serif text-xl font-bold truncate mt-0.5 text-primary-900 dark:text-text-inverse">{enrolledCourses.length}</p>
            <p className="text-[10px] text-text-muted truncate mt-0.5">Active Academic Term</p>
          </div>
        </div>

        {/* STAT 2: Pending Tasks */}
        <div className="bg-surface dark:bg-primary-900 p-4 rounded-xl border border-border shadow-xs flex items-start space-x-3.5">
          <div className="p-2.5 bg-amber-100 rounded-lg text-amber-600">
            <Clock className="w-5 h-5" />
          </div>
          <div className="truncate">
            <span className="text-[10px] uppercase font-mono tracking-wider text-text-muted">Pending Tasks</span>
            <p className="font-serif text-xl font-bold truncate mt-0.5 text-text-primary">
              {pendingCourseworks.length + pendingQuizzes.length}
            </p>
            <p className="text-[10px] text-amber-600 mt-0.5 font-mono font-semibold">
              {pendingCourseworks.length} assignments, {pendingQuizzes.length} quizzes
            </p>
          </div>
        </div>

        {/* STAT 3: Materials */}
        <div className="bg-surface dark:bg-primary-900 p-4 rounded-xl border border-border shadow-xs flex items-start space-x-3.5">
          <div className="p-2.5 bg-blue-100 rounded-lg text-blue-600">
            <Book className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-mono tracking-wider text-text-muted">Course Materials</span>
            <p className="font-serif text-xl font-bold mt-0.5 text-text-primary">
              {courseMaterials.length}
            </p>
            <p className="text-[10px] text-text-muted mt-0.5">Syllabi & slides available</p>
          </div>
        </div>

        {/* STAT 4: Completed Tasks */}
        <div className="bg-surface dark:bg-primary-900 p-4 rounded-xl border border-border shadow-xs flex items-start space-x-3.5">
          <div className="p-2.5 bg-indigo-100 rounded-lg text-indigo-600">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div className="w-full">
            <span className="text-[10px] uppercase font-mono tracking-wider text-text-muted">Submissions</span>
            <p className="font-serif text-xl font-bold mt-0.5 text-text-primary">
              {completedCourseworks.length} Done
            </p>
            <p className="text-[10px] text-emerald-600 font-medium mt-0.5">Recorded in Gradebook</p>
          </div>
        </div>
      </div>

      {/* 3. COURSEWORK & QUIZZES DEADLINE RADAR */}
      <div id="coursework-deadline-radar" className="bg-surface border border-border rounded-xl shadow-xs p-5 space-y-4 text-left">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif text-sm font-bold text-text-primary">
                Coursework & Quiz Deadline Radar
              </h2>
              <p className="text-[11px] text-text-secondary">
                Monitor upcoming course deadlines and overdue submission alerts.
              </p>
            </div>
          </div>
          
          <button
            onClick={() => setActivePage('coursework')}
            className="bg-primary-900 hover:bg-primary-800 text-white font-bold px-3 py-1.5 rounded-lg text-[11px] flex items-center gap-1.5 transition cursor-pointer self-start sm:self-auto shrink-0"
          >
            <span>Open Coursework Dashboard</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* OVERDUE TASKS */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-bold font-serif text-text-primary flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
              Overdue Tasks ({missedDeadlines.length})
            </h3>

            {missedDeadlines.length === 0 ? (
              <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl flex items-center gap-3 text-left">
                <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-emerald-800">You are all caught up!</p>
                  <p className="text-[10px] text-emerald-700">No overdue coursework assignments or quizzes.</p>
                </div>
              </div>
            ) : (
              <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                {missedDeadlines.map(item => (
                  <div key={item.id} className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center justify-between gap-2">
                    <div className="space-y-0.5">
                      <span className="font-mono text-[9px] font-bold px-1.5 py-0.5 bg-red-100 text-red-700 rounded uppercase">
                        {item.type.toUpperCase()} • {item.courseCode}
                      </span>
                      <p className="font-bold text-xs text-text-primary">{item.title}</p>
                      <p className="text-[10px] text-red-600 font-mono">Due {item.dueDate} ({Math.abs(item.daysDiff)} days overdue)</p>
                    </div>
                    <button
                      onClick={() => setActivePage(item.type === 'quiz' ? 'quizzes' : 'coursework')}
                      className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white font-bold rounded text-[10px] transition cursor-pointer"
                    >
                      Submit
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* UPCOMING DELIVERABLES */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-bold font-serif text-text-primary flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
              Upcoming Deadlines ({upcomingDeadlines.length})
            </h3>

            {upcomingDeadlines.length === 0 ? (
              <div className="bg-surface-alt border border-border p-4 rounded-xl text-center text-text-muted space-y-1">
                <p className="font-semibold text-xs">No pending upcoming deadlines.</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                {upcomingDeadlines.map(item => (
                  <div key={item.id} className="p-3 bg-surface-alt border border-border rounded-xl flex items-center justify-between gap-2">
                    <div className="space-y-0.5">
                      <span className="font-mono text-[9px] font-bold px-1.5 py-0.5 bg-indigo-50 text-indigo-700 rounded uppercase border border-indigo-200">
                        {item.type.toUpperCase()} • {item.courseCode}
                      </span>
                      <p className="font-bold text-xs text-text-primary">{item.title}</p>
                      <p className="text-[10px] text-text-muted font-mono">Due {item.dueDate} ({item.daysDiff} days left)</p>
                    </div>
                    <button
                      onClick={() => setActivePage(item.type === 'quiz' ? 'quizzes' : 'coursework')}
                      className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded text-[10px] transition cursor-pointer"
                    >
                      View
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 4. ENROLLED COURSES OVERVIEW */}
      <div className="bg-surface border border-border rounded-xl p-5 shadow-xs space-y-4">
        <div className="flex justify-between items-center pb-2 border-b border-border">
          <div className="flex items-center space-x-2">
            <GraduationCap className="w-4 h-4 text-emerald-600" />
            <h2 className="font-serif text-sm font-bold text-text-primary">Enrolled Courses</h2>
          </div>
          <button 
            onClick={() => setActivePage('coursework')}
            className="text-[11px] font-bold text-indigo-600 hover:underline cursor-pointer"
          >
            Go to Coursework Portal →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {enrolledCourses.map(crs => (
            <div key={crs.id} className="p-4 bg-surface-alt border border-border rounded-xl space-y-2 flex flex-col justify-between hover:border-emerald-400 transition">
              <div>
                <div className="flex justify-between items-center">
                  <span className="font-mono text-[10px] font-bold px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded border border-emerald-200">
                    {crs.code}
                  </span>
                  <span className="text-[10px] font-mono text-text-muted">L{crs.level}</span>
                </div>
                <h3 className="font-serif text-xs font-bold text-text-primary mt-1.5">{crs.name}</h3>
                <p className="text-[10px] text-text-secondary mt-0.5">Lecturer: {crs.lecturerName || 'Unassigned'}</p>
              </div>

              <div className="pt-2 border-t border-border flex justify-between items-center text-[10px]">
                <span className="text-text-muted">{crs.dept}</span>
                <span className="font-mono font-bold text-indigo-700">{crs.enrolledStudents?.length || 0} enrolled</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

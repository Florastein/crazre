import React from 'react';
import { useAppState } from '../../contexts/StateContext';
import { 
  Users, Award, BookOpen, ClipboardList, GraduationCap, 
  HelpCircle, ArrowUpRight, Plus, Building
} from 'lucide-react';

export default function HodDashboard({ setActivePage }) {
  const { 
    users = [], 
    courses = [], 
    courseworks = [], 
    quizzes = [],
    departments = [],
    programmes = []
  } = useAppState();

  const totalStudents = users.filter(u => u.role === 'student').length;
  const totalLecturers = users.filter(u => u.role === 'supervisor' || u.role === 'admin').length;
  const totalCoursesCount = courses.length;
  const totalAssignmentsCount = courseworks.length + quizzes.length;

  return (
    <div className="space-y-8 animate-fade-in text-text-primary text-xs" id="hod-dashboard-root">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-4 border-b border-border">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl font-bold tracking-tight text-primary-900">
            Head of Department Dashboard
          </h1>
          <p className="text-xs text-text-secondary mt-1 font-sans">
            Departmental administration, academic course allocations, faculty roster, and coursework metrics.
          </p>
        </div>
        <div className="mt-4 md:mt-0 bg-primary-50 px-3.5 py-1.5 rounded-lg border border-primary-200 text-xs font-mono font-bold text-primary-900 flex items-center space-x-2">
          <Award className="w-4 h-4 text-primary-500" />
          <span>Active Departments: {departments.length}</span>
        </div>
      </div>

      {/* STATS SECTION */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* STAT 1: Total Students */}
        <div className="bg-surface p-4 rounded-xl border border-border shadow-xs flex items-start space-x-3.5">
          <div className="p-2.5 bg-primary-100 rounded-lg text-primary-600">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-mono tracking-wider text-text-muted">Enrolled Students</span>
            <p className="font-serif text-xl font-bold mt-0.5 text-text-primary">{totalStudents}</p>
            <p className="text-[10px] text-text-muted mt-0.5">Across all levels</p>
          </div>
        </div>

        {/* STAT 2: Faculty / Lecturers */}
        <div className="bg-surface p-4 rounded-xl border border-border shadow-xs flex items-start space-x-3.5">
          <div className="p-2.5 bg-emerald-100 rounded-lg text-emerald-600">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-mono tracking-wider text-text-muted">Faculty Roster</span>
            <p className="font-serif text-xl font-bold mt-0.5 text-text-primary">{totalLecturers}</p>
            <p className="text-[10px] text-text-muted mt-0.5">Lecturers & Instructors</p>
          </div>
        </div>

        {/* STAT 3: Total Courses */}
        <div className="bg-surface p-4 rounded-xl border border-border shadow-xs flex items-start space-x-3.5">
          <div className="p-2.5 bg-blue-100 rounded-lg text-blue-600">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-mono tracking-wider text-text-muted">Academic Courses</span>
            <p className="font-serif text-xl font-bold mt-0.5 text-text-primary">{totalCoursesCount}</p>
            <p className="text-[10px] text-text-muted mt-0.5">Active catalog modules</p>
          </div>
        </div>

        {/* STAT 4: Courseworks & Quizzes */}
        <div className="bg-surface p-4 rounded-xl border border-border shadow-xs flex items-start space-x-3.5">
          <div className="p-2.5 bg-indigo-100 rounded-lg text-indigo-600">
            <ClipboardList className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-mono tracking-wider text-text-muted">Active Assessments</span>
            <p className="font-serif text-xl font-bold mt-0.5 text-text-primary">{totalAssignmentsCount}</p>
            <p className="text-[10px] text-text-muted mt-0.5">Assignments & Quizzes</p>
          </div>
        </div>
      </div>

      {/* QUICK SHORTCUTS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div 
          onClick={() => setActivePage('academic_structure')}
          className="p-4 bg-surface border border-border hover:border-primary-500 rounded-xl cursor-pointer transition shadow-xs flex items-center justify-between"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-xs text-text-primary">Academic Structure</h3>
              <p className="text-[10px] text-text-secondary">Departments, programmes & course allocations</p>
            </div>
          </div>
          <ArrowUpRight className="w-4 h-4 text-text-muted" />
        </div>

        <div 
          onClick={() => setActivePage('users_management')}
          className="p-4 bg-surface border border-border hover:border-primary-500 rounded-xl cursor-pointer transition shadow-xs flex items-center justify-between"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-xs text-text-primary">User Provisioning</h3>
              <p className="text-[10px] text-text-secondary">Provision students, lecturers & roles</p>
            </div>
          </div>
          <ArrowUpRight className="w-4 h-4 text-text-muted" />
        </div>

        <div 
          onClick={() => setActivePage('coursework')}
          className="p-4 bg-surface border border-border hover:border-primary-500 rounded-xl cursor-pointer transition shadow-xs flex items-center justify-between"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-lg">
              <ClipboardList className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-xs text-text-primary">Coursework Management</h3>
              <p className="text-[10px] text-text-secondary">Review assignments, syllabi & quizzes</p>
            </div>
          </div>
          <ArrowUpRight className="w-4 h-4 text-text-muted" />
        </div>
      </div>

      {/* DEPARTMENTAL COURSES OVERVIEW */}
      <div className="bg-surface border border-border rounded-xl p-5 shadow-xs space-y-4">
        <div className="flex justify-between items-center pb-2 border-b border-border">
          <div className="flex items-center space-x-2">
            <Building className="w-4 h-4 text-primary-600" />
            <h2 className="font-serif text-sm font-bold text-text-primary">Department Course Catalog & Allocation</h2>
          </div>
          <button 
            onClick={() => setActivePage('academic_structure')}
            className="text-[11px] font-bold text-indigo-600 hover:underline cursor-pointer"
          >
            Manage Structure →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map(crs => (
            <div key={crs.id} className="p-3.5 bg-surface-alt border border-border rounded-xl space-y-2 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center">
                  <span className="font-mono text-[10px] font-bold px-2 py-0.5 bg-primary-50 text-primary-800 rounded border border-primary-200">
                    {crs.code}
                  </span>
                  <span className="text-[10px] font-mono text-text-muted">Level {crs.level}</span>
                </div>
                <h3 className="font-serif text-xs font-bold text-text-primary mt-1.5">{crs.name}</h3>
                <p className="text-[10px] text-text-secondary">{crs.dept} • {crs.programme}</p>
              </div>

              <div className="pt-2 border-t border-border flex justify-between items-center text-[10px]">
                <span className="text-text-muted font-medium">Lecturer: {crs.lecturerName || 'Unallocated'}</span>
                <span className="font-mono font-bold text-emerald-700">{(crs.enrolledStudents || []).length} Students</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

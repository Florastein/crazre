import React, { useState } from 'react';
import { useAppState } from '../../contexts/StateContext';
import { 
  Plus, Building2, GraduationCap, User, Clock, Search, BookOpen, AlertCircle,
  Book, UserCheck, UserPlus, CheckCircle
} from 'lucide-react';

export default function AcademicStructure() {
  const { 
    departments, 
    programmes, 
    addDepartment, 
    addProgramme,
    users,
    courses,
    createCourse,
    assignLecturerToCourse,
    enrollStudentInCourse,
    unenrollStudentFromCourse,
    currentRole,
    currentUser
  } = useAppState();

  // Search & Filter state
  const [deptSearch, setDeptSearch] = useState('');
  const [progSearch, setProgSearch] = useState('');
  const [courseSearch, setCourseSearch] = useState('');

  // Form states for new Department
  const [showAddDept, setShowAddDept] = useState(false);
  const [deptName, setDeptName] = useState('');
  const [deptCode, setDeptCode] = useState('');
  const [deptHead, setDeptHead] = useState('');

  // Form states for new Programme
  const [showAddProg, setShowAddProg] = useState(false);
  const [progName, setProgName] = useState('');
  const [progCode, setProgCode] = useState('');
  const [progDuration, setProgDuration] = useState('4');
  const [progDeptId, setProgDeptId] = useState(departments[0]?.id || '');

  // Form states for new Course
  const [showAddCourse, setShowAddCourse] = useState(false);
  const [courseCodeVal, setCourseCodeVal] = useState('');
  const [courseNameVal, setCourseNameVal] = useState('');
  const [courseDeptVal, setCourseDeptVal] = useState(departments[0]?.name || 'Computer Science');
  const [courseProgVal, setCourseProgVal] = useState(programmes[0]?.name || 'BSc. Computer Science');
  const [courseLevelVal, setCourseLevelVal] = useState('400');
  const [courseLecturerVal, setCourseLecturerVal] = useState('');

  // Enrollment modal state
  const [enrollCourseObj, setEnrollCourseObj] = useState(null);
  const [selectedStudentToEnroll, setSelectedStudentToEnroll] = useState('');

  // Assign lecturer modal state
  const [assignCourseObj, setAssignCourseObj] = useState(null);
  const [selectedLecturerToAssign, setSelectedLecturerToAssign] = useState('');

  // Dynamic user counters
  const getDeptHeadCount = (deptName) => {
    return users.filter(u => u.dept?.toLowerCase() === deptName?.toLowerCase()).length;
  };

  const getProgHeadCount = (progName) => {
    return users.filter(u => u.prog?.toLowerCase() === progName?.toLowerCase()).length;
  };

  const handleCreateDept = (e) => {
    e.preventDefault();
    if (!deptName.trim() || !deptCode.trim() || !deptHead.trim()) {
      alert('Please fill in all department specifications.');
      return;
    }

    // Check duplicate code
    const duplicate = departments.find(d => d.code.toLowerCase() === deptCode.trim().toLowerCase());
    if (duplicate) {
      alert(`Department code "${deptCode.trim()}" is already assigned to ${duplicate.name}.`);
      return;
    }

    addDepartment(deptName.trim(), deptCode.trim().toUpperCase(), deptHead.trim());
    
    // Reset Form
    setDeptName('');
    setDeptCode('');
    setDeptHead('');
    setShowAddDept(false);
  };

  const handleCreateProg = (e) => {
    e.preventDefault();
    if (!progName.trim() || !progCode.trim() || !progDeptId) {
      alert('Please complete all programme parameters.');
      return;
    }

    // Check duplicate code
    const duplicate = programmes.find(p => p.code.toLowerCase() === progCode.trim().toLowerCase());
    if (duplicate) {
      alert(`Programme code "${progCode.trim()}" is already assigned to ${duplicate.name}.`);
      return;
    }

    addProgramme(progName.trim(), progCode.trim().toUpperCase(), parseInt(progDuration), progDeptId);

    // Reset Form
    setProgName('');
    setProgCode('');
    setProgDuration('4');
    setShowAddProg(false);
  };

  const handleCreateCourseSubmit = (e) => {
    e.preventDefault();
    if (!courseCodeVal.trim() || !courseNameVal.trim()) {
      alert('Please fill in Course Code and Course Name.');
      return;
    }

    createCourse(
      courseCodeVal.trim().toUpperCase(),
      courseNameVal.trim(),
      courseDeptVal,
      courseProgVal,
      courseLevelVal,
      courseLecturerVal || null
    );

    setCourseCodeVal('');
    setCourseNameVal('');
    setCourseLecturerVal('');
    setShowAddCourse(false);
    alert(`Course ${courseCodeVal.toUpperCase()} created successfully!`);
  };

  const handleAssignLecturerSubmit = (e) => {
    e.preventDefault();
    if (!assignCourseObj) return;
    assignLecturerToCourse(assignCourseObj.id, selectedLecturerToAssign || null);
    setAssignCourseObj(null);
    setSelectedLecturerToAssign('');
    alert('Lecturer assigned to course successfully.');
  };

  const handleEnrollStudentSubmit = (e) => {
    e.preventDefault();
    if (!enrollCourseObj || !selectedStudentToEnroll) {
      alert('Please select a student to enroll.');
      return;
    }
    enrollStudentInCourse(enrollCourseObj.id, selectedStudentToEnroll);
    setSelectedStudentToEnroll('');
    alert('Student enrolled in course successfully!');
  };

  // Filter lists
  const filteredDepts = departments.filter(d => 
    d.name.toLowerCase().includes(deptSearch.toLowerCase()) || 
    d.code.toLowerCase().includes(deptSearch.toLowerCase()) ||
    d.head.toLowerCase().includes(deptSearch.toLowerCase())
  );

  const filteredProgs = programmes.filter(p => 
    p.name.toLowerCase().includes(progSearch.toLowerCase()) || 
    p.code.toLowerCase().includes(progSearch.toLowerCase()) ||
    p.deptName?.toLowerCase().includes(progSearch.toLowerCase())
  );

  const filteredCourses = (courses || []).filter(c => 
    c.name.toLowerCase().includes(courseSearch.toLowerCase()) ||
    c.code.toLowerCase().includes(courseSearch.toLowerCase()) ||
    c.dept.toLowerCase().includes(courseSearch.toLowerCase()) ||
    c.lecturerName?.toLowerCase().includes(courseSearch.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fade-in text-text-primary text-xs">
      
      {/* 1. SECTOR HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-3 border-b border-border gap-3">
        <div>
          <h1 className="font-serif text-2xl font-bold text-primary-900">
            Curriculum & Academic Structure
          </h1>
          <p className="text-sm text-text-secondary mt-1 font-sans">
            Configure dynamic institutional departments and allocate standard accredited degree programmes.
          </p>
        </div>

      {/* ================= 3. COURSES & LECTURER ALLOCATION CATALOG ================= */}
      <div className="bg-white dark:bg-slate-900 border border-border rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border pb-3 gap-3">
          <div className="flex items-center space-x-2">
            <Book className="w-5 h-5 text-primary-900 dark:text-accent" />
            <div>
              <h2 className="font-serif text-base font-bold text-primary-900">Course Catalog & Lecturer Assignments</h2>
              <p className="text-[11px] text-text-secondary">Manage courses, assign course lecturers, and enroll students into courses.</p>
            </div>
          </div>
          {(currentRole === 'admin' || currentRole === 'superadmin') && (
            <button
              onClick={() => {
                if (departments.length === 0) {
                  alert('Please create at least one Department first.');
                  return;
                }
                setCourseDeptVal(departments[0]?.name || 'Computer Science');
                setCourseProgVal(programmes[0]?.name || 'BSc. Computer Science');
                setShowAddCourse(true);
              }}
              className="h-8 px-3 bg-primary-900 hover:bg-primary-800 text-white rounded-lg font-semibold flex items-center space-x-1 cursor-pointer transition shrink-0 self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>New Course</span>
            </button>
          )}
        </div>

        {/* Course Search */}
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-text-muted" />
          <input 
            type="text" 
            placeholder="Search courses by code, title, department, or lecturer..."
            value={courseSearch}
            onChange={(e) => setCourseSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-border bg-surface-alt rounded-lg font-sans text-xs focus:ring-1 focus:ring-primary-400 focus:border-primary-400 outline-none"
          />
        </div>

        {/* Courses Table */}
        <div className="overflow-x-auto">
          {filteredCourses.length === 0 ? (
            <div className="text-center py-10 border border-dashed border-border rounded-xl text-text-muted space-y-1">
              <AlertCircle className="w-8 h-8 mx-auto text-slate-300" />
              <p className="font-semibold text-xs">No courses found</p>
              <p className="text-[10px]">Create a course or clear your search query.</p>
            </div>
          ) : (
            <table className="min-w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border text-text-muted font-mono text-[10px] uppercase bg-surface-alt">
                  <th className="py-2.5 px-3">Course Code</th>
                  <th className="py-2.5 px-3">Course Name</th>
                  <th className="py-2.5 px-3">Dept & Programme</th>
                  <th className="py-2.5 px-3">Level</th>
                  <th className="py-2.5 px-3">Assigned Lecturer</th>
                  <th className="py-2.5 px-3">Enrolled Students</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredCourses.map(c => {
                  const enrolledCount = c.enrolledStudents ? c.enrolledStudents.length : 0;
                  return (
                    <tr key={c.id} className="hover:bg-surface-alt/50 transition">
                      <td className="py-3 px-3 font-mono font-bold text-primary-900">{c.code}</td>
                      <td className="py-3 px-3 font-semibold">{c.name}</td>
                      <td className="py-3 px-3 text-text-secondary">
                        <span className="font-medium">{c.dept}</span>
                        <span className="block text-[10px] text-text-muted">{c.programme}</span>
                      </td>
                      <td className="py-3 px-3 font-mono text-[10px]">L{c.level}</td>
                      <td className="py-3 px-3">
                        <div className="flex items-center space-x-1.5">
                          <UserCheck className={`w-3.5 h-3.5 ${c.lecturerId ? 'text-emerald-600' : 'text-amber-500'}`} />
                          <span className={`font-medium ${c.lecturerId ? 'text-text-primary' : 'text-amber-600 font-mono text-[10px]'}`}>
                            {c.lecturerName || 'Unassigned'}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-3 font-mono text-[11px] font-bold text-indigo-700">
                        {enrolledCount} enrolled
                      </td>
                      <td className="py-3 px-3 text-right space-x-1.5">
                        {(currentRole === 'admin' || currentRole === 'superadmin' || currentRole === 'supervisor') && (
                          <>
                            <button
                              onClick={() => {
                                setAssignCourseObj(c);
                                setSelectedLecturerToAssign(c.lecturerId || '');
                              }}
                              className="px-2 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded font-bold text-[10px] border border-indigo-200 transition"
                            >
                              Assign Lecturer
                            </button>
                            <button
                              onClick={() => {
                                setEnrollCourseObj(c);
                                setSelectedStudentToEnroll('');
                              }}
                              className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded font-bold text-[10px] border border-emerald-200 transition"
                            >
                              Enroll Student
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
      </div>

      {/* 2. GRID PANEL - DEPARTMENTS VS PROGRAMMES */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* ================= LEFT COLUMN: DEPARTMENTS ================= */}
        <div className="bg-white dark:bg-slate-900 duration-200 border border-border rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-border pb-3">
            <div className="flex items-center space-x-2">
              <Building2 className="w-5 h-5 text-primary-900 dark:text-accent" />
              <h2 className="font-serif text-base font-bold text-primary-900">Departments Directory</h2>
            </div>
            <button
              onClick={() => setShowAddDept(true)}
              className="h-8 px-3 bg-primary-900 hover:bg-primary-800 text-white rounded-lg font-semibold flex items-center space-x-1 cursor-pointer transition"
            >
              <Plus className="w-4.5 h-4.5" />
              <span>New Department</span>
            </button>
          </div>

          {/* Dept search bar */}
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-text-muted" />
            <input 
              type="text" 
              placeholder="Search departments (e.g., CS)..."
              value={deptSearch}
              onChange={(e) => setDeptSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-border bg-surface-alt rounded-lg font-sans text-xs focus:ring-1 focus:ring-primary-400 focus:border-primary-400 outline-none"
            />
          </div>

          <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
            {filteredDepts.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-border rounded-xl text-text-muted space-y-1">
                <AlertCircle className="w-8 h-8 mx-auto stroke-1 text-slate-300" />
                <p className="font-semibold">No departments found</p>
                <p className="text-[10px]">Adjust search queries or launch creation flow.</p>
              </div>
            ) : (
              filteredDepts.map(d => {
                const headCount = getDeptHeadCount(d.name);
                return (
                  <div 
                    key={d.id} 
                    className="p-4 bg-surface rounded-xl border border-border shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition space-y-3"
                  >
                    <div className="flex justify-between items-start">
                      <div className="space-y-0.5">
                        <h3 className="font-serif text-sm font-bold text-ink flex items-center gap-1.5">
                          {d.name}
                        </h3>
                        <span className="inline-block font-mono text-[9px] font-bold bg-[#f1f5f9] dark:bg-slate-800 text-[#475569] dark:text-slate-300 px-1.5 py-0.5 rounded uppercase tracking-wider">
                          CODE: {d.code}
                        </span>
                      </div>
                      <span className="font-mono text-[9px] font-bold text-[#8a99ad] uppercase">
                        {headCount} ACTIVE MEMBERS
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border/60 text-[10px] text-text-secondary select-none">
                      <div className="flex items-center space-x-1.5">
                        <User className="w-3.5 h-3.5 text-muted shrink-0" />
                        <div>
                          <p className="font-mono text-[8px] uppercase tracking-wider text-muted">Head of Dept</p>
                          <p className="font-medium text-ink leading-tight">{d.head}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-muted shrink-0" />
                        <div>
                          <p className="font-mono text-[8px] uppercase tracking-wider text-muted font-bold">Programs affiliated</p>
                          <p className="font-bold text-primary-610 mt-0.5">{programmes.filter(p => p.deptId === d.id).length} Programs</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* ================= RIGHT COLUMN: PROGRAMMES ================= */}
        <div className="bg-white dark:bg-slate-900 duration-200 border border-border rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-border pb-3">
            <div className="flex items-center space-x-2">
              <GraduationCap className="w-5 h-5 text-primary-900 dark:text-accent" />
              <h2 className="font-serif text-base font-bold text-primary-900">Degree Programmes</h2>
            </div>
            <button
              onClick={() => {
                if (departments.length === 0) {
                  alert('Please create at least one Department before designing Programmes.');
                  return;
                }
                setProgDeptId(departments[0].id);
                setShowAddProg(true);
              }}
              className="h-8 px-3 bg-primary-900 hover:bg-primary-800 text-white rounded-lg font-semibold flex items-center space-x-1 cursor-pointer transition"
            >
              <Plus className="w-4.5 h-4.5" />
              <span>New Programme</span>
            </button>
          </div>

          {/* Program search bar */}
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-text-muted" />
            <input 
              type="text" 
              placeholder="Search accredited programmes (e.g., Software)..."
              value={progSearch}
              onChange={(e) => setProgSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-border bg-surface-alt rounded-lg font-sans text-xs focus:ring-1 focus:ring-primary-400 focus:border-primary-400 outline-none"
            />
          </div>

          <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
            {filteredProgs.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-border rounded-xl text-text-muted space-y-1">
                <AlertCircle className="w-8 h-8 mx-auto stroke-1 text-slate-300" />
                <p className="font-semibold">No programmes found</p>
                <p className="text-[10px]">Launch the creation dashboard to assemble your curricula.</p>
              </div>
            ) : (
              filteredProgs.map(p => {
                const studentsCount = getProgHeadCount(p.name);
                return (
                  <div 
                    key={p.id} 
                    className="p-4 bg-surface rounded-xl border border-border shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition space-y-3"
                  >
                    <div className="flex justify-between items-start">
                      <div className="space-y-0.5">
                        <span className="text-[8px] tracking-widest text-[#8a99ad] font-mono font-bold uppercase block leading-none">
                          {p.deptName?.toUpperCase() || 'GENERAL ACADEMICS'}
                        </span>
                        <h3 className="font-serif text-sm font-bold text-ink mt-1">
                          {p.name}
                        </h3>
                      </div>
                      <span className="font-mono text-[9px] font-bold text-[#8a99ad] uppercase">
                        {studentsCount} STUDENTS ENROLLED
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border/60 text-[10px] text-text-secondary select-none">
                      <div className="flex items-center space-x-1.5">
                        <Clock className="w-3.5 h-3.5 text-muted shrink-0" />
                        <div>
                          <p className="font-mono text-[8px] uppercase tracking-wider text-muted font-bold">Duration</p>
                          <p className="font-semibold text-ink leading-tight">{p.duration} Academic Years</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1.5">
                        <Building2 className="w-3.5 h-3.5 text-muted shrink-0" />
                        <div>
                          <p className="font-mono text-[8px] uppercase tracking-wider text-muted">ID stamp</p>
                          <p className="font-bold text-primary-500 font-mono text-[9.5px] tracking-wide mt-0.5">{p.code}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>

      {/* ================= 3. COURSES & LECTURER ALLOCATION CATALOG ================= */}
      <div className="bg-white dark:bg-slate-900 border border-border rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border pb-3 gap-3">
          <div className="flex items-center space-x-2">
            <Book className="w-5 h-5 text-primary-900 dark:text-accent" />
            <div>
              <h2 className="font-serif text-base font-bold text-primary-900">Course Catalog & Lecturer Assignments</h2>
              <p className="text-[11px] text-text-secondary">Manage courses, assign course lecturers, and enroll students into courses.</p>
            </div>
          </div>
          {(currentRole === 'admin' || currentRole === 'superadmin') && (
            <button
              onClick={() => {
                if (departments.length === 0) {
                  alert('Please create at least one Department first.');
                  return;
                }
                setCourseDeptVal(departments[0]?.name || 'Computer Science');
                setCourseProgVal(programmes[0]?.name || 'BSc. Computer Science');
                setShowAddCourse(true);
              }}
              className="h-8 px-3 bg-primary-900 hover:bg-primary-800 text-white rounded-lg font-semibold flex items-center space-x-1 cursor-pointer transition shrink-0 self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>New Course</span>
            </button>
          )}
        </div>

        {/* Course Search */}
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-text-muted" />
          <input 
            type="text" 
            placeholder="Search courses by code, title, department, or lecturer..."
            value={courseSearch}
            onChange={(e) => setCourseSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-border bg-surface-alt rounded-lg font-sans text-xs focus:ring-1 focus:ring-primary-400 focus:border-primary-400 outline-none"
          />
        </div>

        {/* Courses Table */}
        <div className="overflow-x-auto">
          {filteredCourses.length === 0 ? (
            <div className="text-center py-10 border border-dashed border-border rounded-xl text-text-muted space-y-1">
              <AlertCircle className="w-8 h-8 mx-auto text-slate-300" />
              <p className="font-semibold text-xs">No courses found</p>
              <p className="text-[10px]">Create a course or clear your search query.</p>
            </div>
          ) : (
            <table className="min-w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border text-text-muted font-mono text-[10px] uppercase bg-surface-alt">
                  <th className="py-2.5 px-3">Course Code</th>
                  <th className="py-2.5 px-3">Course Name</th>
                  <th className="py-2.5 px-3">Dept & Programme</th>
                  <th className="py-2.5 px-3">Level</th>
                  <th className="py-2.5 px-3">Assigned Lecturer</th>
                  <th className="py-2.5 px-3">Enrolled Students</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredCourses.map(c => {
                  const enrolledCount = c.enrolledStudents ? c.enrolledStudents.length : 0;
                  return (
                    <tr key={c.id} className="hover:bg-surface-alt/50 transition">
                      <td className="py-3 px-3 font-mono font-bold text-primary-900">{c.code}</td>
                      <td className="py-3 px-3 font-semibold">{c.name}</td>
                      <td className="py-3 px-3 text-text-secondary">
                        <span className="font-medium">{c.dept}</span>
                        <span className="block text-[10px] text-text-muted">{c.programme}</span>
                      </td>
                      <td className="py-3 px-3 font-mono text-[10px]">L{c.level}</td>
                      <td className="py-3 px-3">
                        <div className="flex items-center space-x-1.5">
                          <UserCheck className={`w-3.5 h-3.5 ${c.lecturerId ? 'text-emerald-600' : 'text-amber-500'}`} />
                          <span className={`font-medium ${c.lecturerId ? 'text-text-primary' : 'text-amber-600 font-mono text-[10px]'}`}>
                            {c.lecturerName || 'Unassigned'}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-3 font-mono text-[11px] font-bold text-indigo-700">
                        {enrolledCount} enrolled
                      </td>
                      <td className="py-3 px-3 text-right space-x-1.5">
                        {(currentRole === 'admin' || currentRole === 'superadmin' || currentRole === 'supervisor') && (
                          <>
                            <button
                              onClick={() => {
                                setAssignCourseObj(c);
                                setSelectedLecturerToAssign(c.lecturerId || '');
                              }}
                              className="px-2 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded font-bold text-[10px] border border-indigo-200 transition cursor-pointer"
                            >
                              Assign Lecturer
                            </button>
                            <button
                              onClick={() => {
                                setEnrollCourseObj(c);
                                setSelectedStudentToEnroll('');
                              }}
                              className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded font-bold text-[10px] border border-emerald-200 transition cursor-pointer"
                            >
                              Enroll Student
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* ================= MODAL DIALOG: NEW DEPARTMENT ================= */}
      {showAddDept && (
        <div className="fixed inset-0 bg-primary-950/40 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 border border-border rounded-xl p-6 shadow-modal w-full max-w-md space-y-4 animate-scale-up text-text-primary text-xs">
            <div className="flex items-center space-x-2 text-primary-900 dark:text-accent border-b border-border pb-3">
              <Building2 className="w-5 h-5 flex-shrink-0" />
              <h3 className="font-serif text-base font-bold">Establish New Academic Department</h3>
            </div>

            <form onSubmit={handleCreateDept} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-text-secondary uppercase">
                  Department Name
                </label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g., Computer Science & Artificial Intel"
                  value={deptName}
                  onChange={(e) => setDeptName(e.target.value)}
                  className="w-full p-2.5 border border-border bg-surface-alt rounded-lg font-sans outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-text-secondary uppercase">
                    Dept Code Stamp
                  </label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g., CS"
                    value={deptCode}
                    onChange={(e) => setDeptCode(e.target.value)}
                    className="w-full p-2.5 border border-border bg-surface-alt rounded-lg font-sans outline-none focus:ring-1 focus:ring-primary-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-text-secondary uppercase">
                    Head of Department (HOD)
                  </label>
                  <select 
                    required
                    value={deptHead}
                    onChange={(e) => setDeptHead(e.target.value)}
                    className="w-full p-2.5 border border-border bg-surface-alt rounded-lg font-sans outline-none focus:ring-1 focus:ring-primary-500 text-text-primary text-xs"
                  >
                    <option value="">-- Choose HOD --</option>
                    {(users || [])
                      .filter(u => u.role === 'admin' || u.role === 'superadmin')
                      .map(u => (
                        <option key={u.id} value={u.name}>
                          {u.name} ({u.role})
                        </option>
                      ))
                    }
                  </select>
                </div>
              </div>

              <div className="flex space-x-2 pt-3">
                <button 
                  type="button" 
                  onClick={() => setShowAddDept(false)}
                  className="flex-1 py-2.5 bg-surface border border-border rounded-lg font-bold text-text-secondary hover:bg-surface-alt transition cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-2.5 bg-primary-900 hover:bg-primary-800 text-white rounded-lg font-bold shadow-sm transition cursor-pointer"
                >
                  create dept
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL DIALOG: NEW PROGRAMME ================= */}
      {showAddProg && (
        <div className="fixed inset-0 bg-primary-950/40 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 border border-border rounded-xl p-6 shadow-modal w-full max-w-md space-y-4 animate-scale-up text-text-primary text-xs">
            <div className="flex items-center space-x-2 text-primary-900 dark:text-accent border-b border-border pb-3">
              <GraduationCap className="w-5 h-5 flex-shrink-0" />
              <h3 className="font-serif text-base font-bold">Enlist Accredited Degree Scheme</h3>
            </div>

            <form onSubmit={handleCreateProg} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-text-secondary uppercase">
                  Associated Department Division
                </label>
                <select 
                  value={progDeptId}
                  onChange={(e) => setProgDeptId(e.target.value)}
                  className="w-full p-2.5 border border-border bg-surface rounded-lg font-sans outline-none focus:ring-1 focus:ring-primary-500 text-xs"
                >
                  {departments.map(d => (
                    <option key={d.id} value={d.id}>{d.name} ({d.code})</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-text-secondary uppercase">
                  Degree Programme Name
                </label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g., BSc. Software Engineering"
                  value={progName}
                  onChange={(e) => setProgName(e.target.value)}
                  className="w-full p-2.5 border border-border bg-surface-alt rounded-lg font-sans outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-text-secondary uppercase">
                    Shorthand Code
                  </label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g., BSc. SE"
                    value={progCode}
                    onChange={(e) => setProgCode(e.target.value)}
                    className="w-full p-2.5 border border-border bg-surface-alt rounded-lg font-sans outline-none focus:ring-1 focus:ring-primary-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-text-secondary uppercase">
                    Duration (academic Years)
                  </label>
                  <select 
                    value={progDuration}
                    onChange={(e) => setProgDuration(e.target.value)}
                    className="w-full p-2.5 border border-border bg-surface rounded-lg font-sans outline-none focus:ring-1 focus:ring-primary-500"
                  >
                    <option value="1">1 Year (MSc./MPhil)</option>
                    <option value="2">2 Years (Diploma)</option>
                    <option value="3">3 Years (HND)</option>
                    <option value="4">4 Years (BSc. Standard)</option>
                  </select>
                </div>
              </div>

              <div className="flex space-x-2 pt-3">
                <button 
                  type="button" 
                  onClick={() => setShowAddProg(false)}
                  className="flex-1 py-2.5 bg-surface border border-border rounded-lg font-bold text-text-secondary hover:bg-surface-alt transition cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-2.5 bg-primary-900 hover:bg-primary-800 text-white rounded-lg font-bold shadow-sm transition cursor-pointer"
                >
                  Accredit Programme
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL DIALOG: NEW COURSE ================= */}
      {showAddCourse && (
        <div className="fixed inset-0 bg-primary-950/40 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 border border-border rounded-xl p-6 shadow-modal w-full max-w-md space-y-4 animate-scale-up text-text-primary text-xs">
            <div className="flex items-center space-x-2 text-primary-900 dark:text-accent border-b border-border pb-3">
              <Book className="w-5 h-5 flex-shrink-0" />
              <h3 className="font-serif text-base font-bold">Create New Course</h3>
            </div>

            <form onSubmit={handleCreateCourseSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-text-secondary uppercase">
                    Course Code *
                  </label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. CS 401"
                    value={courseCodeVal}
                    onChange={(e) => setCourseCodeVal(e.target.value)}
                    className="w-full p-2.5 border border-border bg-surface-alt rounded-lg font-sans font-mono outline-none focus:ring-1 focus:ring-primary-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-text-secondary uppercase">
                    Academic Level
                  </label>
                  <select 
                    value={courseLevelVal}
                    onChange={(e) => setCourseLevelVal(e.target.value)}
                    className="w-full p-2.5 border border-border bg-surface rounded-lg font-sans outline-none focus:ring-1 focus:ring-primary-500 text-xs"
                  >
                    <option value="100">Level 100</option>
                    <option value="200">Level 200</option>
                    <option value="300">Level 300</option>
                    <option value="400">Level 400</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-text-secondary uppercase">
                  Course Name *
                </label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Software Architecture & Engineering"
                  value={courseNameVal}
                  onChange={(e) => setCourseNameVal(e.target.value)}
                  className="w-full p-2.5 border border-border bg-surface-alt rounded-lg font-sans outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-text-secondary uppercase">
                    Department
                  </label>
                  <select 
                    value={courseDeptVal}
                    onChange={(e) => setCourseDeptVal(e.target.value)}
                    className="w-full p-2.5 border border-border bg-surface rounded-lg font-sans outline-none focus:ring-1 focus:ring-primary-500 text-xs"
                  >
                    {departments.map(d => (
                      <option key={d.id} value={d.name}>{d.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-text-secondary uppercase">
                    Programme
                  </label>
                  <select 
                    value={courseProgVal}
                    onChange={(e) => setCourseProgVal(e.target.value)}
                    className="w-full p-2.5 border border-border bg-surface rounded-lg font-sans outline-none focus:ring-1 focus:ring-primary-500 text-xs"
                  >
                    {programmes.map(p => (
                      <option key={p.id} value={p.name}>{p.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-text-secondary uppercase">
                  Assign Lecturer (Optional)
                </label>
                <select 
                  value={courseLecturerVal}
                  onChange={(e) => setCourseLecturerVal(e.target.value)}
                  className="w-full p-2.5 border border-border bg-surface rounded-lg font-sans outline-none focus:ring-1 focus:ring-primary-500 text-xs"
                >
                  <option value="">-- No Lecturer Assigned Yet --</option>
                  {users.filter(u => u.role === 'supervisor' || u.role === 'admin' || u.role === 'superadmin').map(l => (
                    <option key={l.id} value={l.id}>{l.name} ({l.role}) - {l.dept || 'CS'}</option>
                  ))}
                </select>
              </div>

              <div className="flex space-x-2 pt-3">
                <button 
                  type="button" 
                  onClick={() => setShowAddCourse(false)}
                  className="flex-1 py-2.5 bg-surface border border-border rounded-lg font-bold text-text-secondary hover:bg-surface-alt transition cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-2.5 bg-primary-900 hover:bg-primary-800 text-white rounded-lg font-bold shadow-sm transition cursor-pointer"
                >
                  Create Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL DIALOG: ASSIGN LECTURER ================= */}
      {assignCourseObj && (
        <div className="fixed inset-0 bg-primary-950/40 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 border border-border rounded-xl p-6 shadow-modal w-full max-w-md space-y-4 animate-scale-up text-text-primary text-xs">
            <div className="flex items-center space-x-2 text-primary-900 dark:text-accent border-b border-border pb-3">
              <UserCheck className="w-5 h-5 flex-shrink-0" />
              <div>
                <h3 className="font-serif text-base font-bold">Assign Lecturer to Course</h3>
                <p className="text-[10px] text-text-muted">{assignCourseObj.code}: {assignCourseObj.name}</p>
              </div>
            </div>

            <form onSubmit={handleAssignLecturerSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-text-secondary uppercase">
                  Select Lecturer / Faculty Member
                </label>
                <select 
                  value={selectedLecturerToAssign}
                  onChange={(e) => setSelectedLecturerToAssign(e.target.value)}
                  className="w-full p-2.5 border border-border bg-surface rounded-lg font-sans outline-none focus:ring-1 focus:ring-primary-500 text-xs"
                >
                  <option value="">-- Remove Assigned Lecturer --</option>
                  {users.filter(u => u.role === 'supervisor' || u.role === 'admin' || u.role === 'superadmin').map(l => (
                    <option key={l.id} value={l.id}>
                      {l.name} ({l.role}) — {l.dept || 'CS'}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex space-x-2 pt-3">
                <button 
                  type="button" 
                  onClick={() => setAssignCourseObj(null)}
                  className="flex-1 py-2.5 bg-surface border border-border rounded-lg font-bold text-text-secondary hover:bg-surface-alt transition cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold shadow-sm transition cursor-pointer"
                >
                  Save Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL DIALOG: ENROLL STUDENT ================= */}
      {enrollCourseObj && (
        <div className="fixed inset-0 bg-primary-950/40 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 border border-border rounded-xl p-6 shadow-modal w-full max-w-md space-y-4 animate-scale-up text-text-primary text-xs">
            <div className="flex items-center space-x-2 text-primary-900 dark:text-accent border-b border-border pb-3">
              <UserPlus className="w-5 h-5 flex-shrink-0" />
              <div>
                <h3 className="font-serif text-base font-bold">Enroll Student into Course</h3>
                <p className="text-[10px] text-text-muted">{enrollCourseObj.code}: {enrollCourseObj.name}</p>
              </div>
            </div>

            <form onSubmit={handleEnrollStudentSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-text-secondary uppercase">
                  Select Student to Enroll
                </label>
                <select 
                  required
                  value={selectedStudentToEnroll}
                  onChange={(e) => setSelectedStudentToEnroll(e.target.value)}
                  className="w-full p-2.5 border border-border bg-surface rounded-lg font-sans outline-none focus:ring-1 focus:ring-primary-500 text-xs"
                >
                  <option value="">-- Choose Student --</option>
                  {users.filter(u => u.role === 'student' && !enrollCourseObj.enrolledStudents.includes(u.id)).map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.indexNum || s.id}) — {s.prog || s.dept} L{s.level || '400'}
                    </option>
                  ))}
                </select>
                {users.filter(u => u.role === 'student' && !enrollCourseObj.enrolledStudents.includes(u.id)).length === 0 && (
                  <p className="text-[10px] text-amber-600 font-medium mt-1">All registered students are already enrolled in this course.</p>
                )}
              </div>

              {/* List currently enrolled students */}
              <div className="border border-border rounded-lg p-3 bg-surface-alt space-y-2">
                <p className="font-bold text-[10px] text-text-muted uppercase tracking-wider">
                  Currently Enrolled ({enrollCourseObj.enrolledStudents.length}):
                </p>
                <div className="max-h-28 overflow-y-auto space-y-1 text-[11px]">
                  {enrollCourseObj.enrolledStudents.length === 0 ? (
                    <p className="text-text-muted text-[10px] italic">No students enrolled yet.</p>
                  ) : (
                    enrollCourseObj.enrolledStudents.map(sId => {
                      const st = users.find(u => u.id === sId);
                      return (
                        <div key={sId} className="flex items-center justify-between bg-surface p-1.5 rounded border border-border">
                          <span>{st ? st.name : sId}</span>
                          <button
                            type="button"
                            onClick={() => unenrollStudentFromCourse(enrollCourseObj.id, sId)}
                            className="text-[9px] text-red-600 font-bold hover:underline cursor-pointer"
                          >
                            Remove
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              <div className="flex space-x-2 pt-2">
                <button 
                  type="button" 
                  onClick={() => setEnrollCourseObj(null)}
                  className="flex-1 py-2.5 bg-surface border border-border rounded-lg font-bold text-text-secondary hover:bg-surface-alt transition cursor-pointer"
                >
                  Done
                </button>
                <button 
                  type="submit"
                  disabled={!selectedStudentToEnroll}
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-lg font-bold shadow-sm transition cursor-pointer"
                >
                  Enroll Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

import React, { useState, useMemo, useRef } from 'react';
import { useAppState } from '../../contexts/StateContext';
import { 
  BookOpen, Plus, Search, FileText, Users, GraduationCap, Upload, 
  Trash2, Edit, Download, CheckCircle, AlertCircle, X, ChevronRight, 
  Filter, Check, ExternalLink, Layers, UserCheck, FolderPlus, Book,
  Clock, ShieldAlert, Award, FileSpreadsheet, ArrowRight, Presentation,
  FileCode, Paperclip
} from 'lucide-react';

export const DOC_FORMATS = {
  pptx: {
    id: 'pptx',
    name: 'PowerPoint Presentation',
    short: 'PPTX',
    ext: '.pptx',
    icon: Presentation,
    badgeStyle: 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200 border-amber-300 dark:border-amber-800',
    iconBg: 'bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400',
    cardBorder: 'hover:border-amber-300 dark:hover:border-amber-700',
    accept: '.pptx,.ppt',
    defaultExt: 'pptx',
    desc: 'PowerPoint slide deck (.pptx, .ppt)'
  },
  docx: {
    id: 'docx',
    name: 'Word Document',
    short: 'DOCX',
    ext: '.docx',
    icon: FileText,
    badgeStyle: 'bg-blue-100 text-blue-900 dark:bg-blue-950 dark:text-blue-200 border-blue-300 dark:border-blue-800',
    iconBg: 'bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400',
    cardBorder: 'hover:border-blue-300 dark:hover:border-blue-700',
    accept: '.docx,.doc',
    defaultExt: 'docx',
    desc: 'Word document or syllabus (.docx, .doc)'
  },
  pdf: {
    id: 'pdf',
    name: 'PDF Document',
    short: 'PDF',
    ext: '.pdf',
    icon: FileText,
    badgeStyle: 'bg-rose-100 text-rose-900 dark:bg-rose-950 dark:text-rose-200 border-rose-300 dark:border-rose-800',
    iconBg: 'bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400',
    cardBorder: 'hover:border-rose-300 dark:hover:border-rose-700',
    accept: '.pdf',
    defaultExt: 'pdf',
    desc: 'Portable Document Format (.pdf)'
  },
  txt: {
    id: 'txt',
    name: 'Text Document',
    short: 'TXT',
    ext: '.txt',
    icon: FileCode,
    badgeStyle: 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200 border-emerald-300 dark:border-emerald-800',
    iconBg: 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400',
    cardBorder: 'hover:border-emerald-300 dark:hover:border-emerald-700',
    accept: '.txt,.rtf,.md',
    defaultExt: 'txt',
    desc: 'Plaintext, markdown or code outline (.txt, .md)'
  }
};

export const getMaterialFormatInfo = (mat) => {
  let type = mat?.fileType;
  if (!type) {
    const fn = (mat?.fileName || '').toLowerCase();
    if (fn.endsWith('.pptx') || fn.endsWith('.ppt') || fn.includes('slide') || fn.includes('powerpoint')) type = 'pptx';
    else if (fn.endsWith('.docx') || fn.endsWith('.doc') || fn.includes('word') || fn.includes('syllabus')) type = 'docx';
    else if (fn.endsWith('.txt') || fn.endsWith('.rtf') || fn.endsWith('.md') || fn.includes('text') || fn.includes('setup')) type = 'txt';
    else type = 'pdf';
  }
  return DOC_FORMATS[type] || DOC_FORMATS.pdf;
};

export default function CourseManagement({ setActivePage }) {
  const { 
    currentUser, 
    currentRole, 
    courses = [], 
    courseMaterials = [], 
    users = [], 
    departments = [], 
    programmes = [],
    createCourse,
    assignLecturerToCourse,
    enrollStudentInCourse,
    unenrollStudentFromCourse,
    uploadCourseMaterial,
    deleteCourseMaterial,
    addNotification
  } = useAppState();

  const isHod = currentRole === 'admin' || currentRole === 'superadmin';
  const isLecturer = currentRole === 'supervisor';

  // Active Tab: 'courses' | 'materials' | 'enrollments'
  const [activeTab, setActiveTab] = useState('courses');

  // Search & Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('all');
  const [selectedCourseFilter, setSelectedCourseFilter] = useState('all');
  const [materialCategoryFilter, setMaterialCategoryFilter] = useState('all');
  const [materialFormatFilter, setMaterialFormatFilter] = useState('all');

  // Modal States
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showCreateCourseModal, setShowCreateCourseModal] = useState(false);
  const [showRosterModal, setShowRosterModal] = useState(false);
  const [selectedCourseForRoster, setSelectedCourseForRoster] = useState(null);

  // Form States - Upload Material
  const [matCourseId, setMatCourseId] = useState('');
  const [matTitle, setMatTitle] = useState('');
  const [matCategory, setMatCategory] = useState('Lecture Notes');
  const [selectedDocType, setSelectedDocType] = useState('pptx'); // 'pptx' | 'docx' | 'pdf' | 'txt'
  const [matFileName, setMatFileName] = useState('');
  const [matFileSize, setMatFileSize] = useState('2.5 MB');
  const [matDescription, setMatDescription] = useState('');
  const fileInputRef = useRef(null);

  // Form States - Create Course
  const [newCourseCode, setNewCourseCode] = useState('');
  const [newCourseName, setNewCourseName] = useState('');
  const [newCourseDept, setNewCourseDept] = useState(currentUser?.dept || 'Computer Science');
  const [newCourseProg, setNewCourseProg] = useState('BSc. Computer Science');
  const [newCourseLevel, setNewCourseLevel] = useState('400');
  const [newCourseLecturerId, setNewCourseLecturerId] = useState('');

  // Toast Notification State
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Filter supervisors/lecturers
  const supervisorList = useMemo(() => {
    return users.filter(u => u.role === 'supervisor' || u.role === 'admin' || u.role === 'superadmin');
  }, [users]);

  // Filter students
  const studentList = useMemo(() => {
    return users.filter(u => u.role === 'student');
  }, [users]);

  // Role scoped visible courses
  const scopedCourses = useMemo(() => {
    if (isLecturer) {
      // Courses assigned to lecturer OR in their department
      return courses.filter(c => 
        c.lecturerId === currentUser?.id || 
        c.dept?.toLowerCase() === currentUser?.dept?.toLowerCase()
      );
    }
    return courses;
  }, [courses, isLecturer, currentUser]);

  // Filtered courses based on search & dept
  const filteredCourses = useMemo(() => {
    return scopedCourses.filter(c => {
      const matchesSearch = c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            (c.lecturerName && c.lecturerName.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesDept = selectedDept === 'all' || c.dept?.toLowerCase() === selectedDept.toLowerCase();
      return matchesSearch && matchesDept;
    });
  }, [scopedCourses, searchQuery, selectedDept]);

  // Filtered course materials
  const filteredMaterials = useMemo(() => {
    return courseMaterials.filter(m => {
      const matchesSearch = m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            (m.description && m.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
                            m.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            m.courseCode.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCourse = selectedCourseFilter === 'all' || 
                            m.courseId === selectedCourseFilter || 
                            m.courseCode.toLowerCase() === selectedCourseFilter.toLowerCase();
      
      const matchesCat = materialCategoryFilter === 'all' || 
                         (m.title && m.title.toLowerCase().includes(materialCategoryFilter.toLowerCase())) ||
                         (m.category && m.category.toLowerCase().includes(materialCategoryFilter.toLowerCase()));

      const fmtInfo = getMaterialFormatInfo(m);
      const matchesFormat = materialFormatFilter === 'all' || fmtInfo.id === materialFormatFilter;

      return matchesSearch && matchesCourse && matchesCat && matchesFormat;
    });
  }, [courseMaterials, searchQuery, selectedCourseFilter, materialCategoryFilter, materialFormatFilter]);

  // Handle format tile selection
  const handleSelectFormatTile = (typeKey) => {
    setSelectedDocType(typeKey);
    const fmtObj = DOC_FORMATS[typeKey];
    if (matFileName) {
      const dotIndex = matFileName.lastIndexOf('.');
      const baseName = dotIndex > 0 ? matFileName.substring(0, dotIndex) : matFileName;
      setMatFileName(`${baseName}${fmtObj.ext}`);
    } else {
      const courseObj = courses.find(c => c.id === matCourseId || c.code === matCourseId);
      const codeClean = (courseObj?.code || 'Course').replace(/\s+/g, '_');
      setMatFileName(`${codeClean}_${matCategory.replace(/\s+/g, '_')}${fmtObj.ext}`);
    }
  };

  // Handle file input upload
  const handleFileInputChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setMatFileName(file.name);

    // Format file size
    const sizeInMB = file.size / (1024 * 1024);
    if (sizeInMB >= 1) {
      setMatFileSize(`${sizeInMB.toFixed(1)} MB`);
    } else {
      setMatFileSize(`${Math.max(1, Math.round(file.size / 1024))} KB`);
    }

    // Auto-detect extension
    const ext = file.name.split('.').pop().toLowerCase();
    if (['pptx', 'ppt'].includes(ext)) {
      setSelectedDocType('pptx');
    } else if (['docx', 'doc'].includes(ext)) {
      setSelectedDocType('docx');
    } else if (['txt', 'text', 'rtf', 'md'].includes(ext)) {
      setSelectedDocType('txt');
    } else if (ext === 'pdf') {
      setSelectedDocType('pdf');
    }

    showToast(`📎 File attached: ${file.name}`);
  };

  // Summary Metrics
  const myAssignedCount = useMemo(() => {
    return courses.filter(c => c.lecturerId === currentUser?.id).length;
  }, [courses, currentUser]);

  const totalMaterialsCount = courseMaterials.length;

  const totalEnrolledStudents = useMemo(() => {
    const allEnrolledSet = new Set();
    courses.forEach(c => {
      if (Array.isArray(c.enrolledStudents)) {
        c.enrolledStudents.forEach(id => allEnrolledSet.add(id));
      }
    });
    return allEnrolledSet.size;
  }, [courses]);

  // Handlers
  const handleUploadSubmit = (e) => {
    e.preventDefault();
    if (!matCourseId || !matTitle) {
      showToast('⚠️ Please select a target course and enter a title for the material.');
      return;
    }

    const fmtObj = DOC_FORMATS[selectedDocType] || DOC_FORMATS.pdf;
    const matchedCourse = courses.find(c => c.id === matCourseId || c.code === matCourseId);
    const defaultName = `${(matchedCourse?.code || 'Course').replace(/\s+/g,'_')}_${matCategory.replace(/\s+/g,'_')}${fmtObj.ext}`;
    const finalFileName = matFileName.trim() || defaultName;

    uploadCourseMaterial(
      matCourseId,
      matTitle,
      matDescription,
      finalFileName,
      matFileSize,
      { fileType: selectedDocType, category: matCategory }
    );

    showToast(`✅ ${fmtObj.name} "${matTitle}" published successfully for ${matchedCourse?.code || 'Course'}!`);
    setShowUploadModal(false);
    
    // Reset form
    setMatTitle('');
    setMatFileName('');
    setMatDescription('');
  };

  const handleCreateCourseSubmit = (e) => {
    e.preventDefault();
    if (!newCourseCode || !newCourseName) {
      showToast('⚠️ Please provide both Course Code and Course Name.');
      return;
    }

    try {
      const created = createCourse(
        newCourseCode.trim().toUpperCase(),
        newCourseName.trim(),
        newCourseDept,
        newCourseProg,
        newCourseLevel,
        newCourseLecturerId || null,
        []
      );

      showToast(`🎉 Course "${created.code}: ${created.name}" created successfully!`);
      setShowCreateCourseModal(false);

      // Reset
      setNewCourseCode('');
      setNewCourseName('');
      setNewCourseLecturerId('');
    } catch (err) {
      showToast(`❌ Error: ${err.message}`);
    }
  };

  const handleLecturerReassign = (courseId, lecturerId) => {
    assignLecturerToCourse(courseId, lecturerId);
    const matchedLecturer = users.find(u => u.id === lecturerId);
    showToast(`🔄 Reassigned course lecturer to ${matchedLecturer ? matchedLecturer.name : 'Unassigned'}.`);
  };

  const handleSimulatedDownload = (material) => {
    showToast(`📥 Downloading "${material.fileName}" (${material.fileSize || '2.0 MB'})...`);
  };

  const handleDeleteMaterial = (materialId, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      deleteCourseMaterial(materialId);
      showToast(`🗑️ Course material deleted.`);
    }
  };

  const handleOpenUploadForCourse = (course) => {
    setMatCourseId(course.id);
    setShowUploadModal(true);
  };

  const handleOpenRosterForCourse = (course) => {
    setSelectedCourseForRoster(course);
    setShowRosterModal(true);
  };

  return (
    <div className="space-y-6 animate-fade-in text-text-primary text-xs pb-12">
      
      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700 flex items-center space-x-3 text-xs font-medium animate-slide-up">
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 1. HEADER BANNER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
              {isHod ? 'HOD / Faculty Portal' : 'Lecturer / Teaching Hub'}
            </span>
            <span className="text-[10px] text-text-muted font-mono">
              Academic Year 2025/2026
            </span>
          </div>
          <h1 className="font-serif text-2xl md:text-3xl font-bold tracking-tight text-primary-900 dark:text-slate-100 mt-1">
            Course & Learning Materials
          </h1>
          <p className="text-xs text-text-secondary mt-1 max-w-2xl">
            {isHod 
              ? 'Manage departmental teaching allocations, upload course syllabi and lecture files, and monitor student class enrollments across degree programmes.' 
              : 'Access your assigned courses, publish lecture notes and lab guides for students, and review class roster assignments.'
            }
          </p>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setShowUploadModal(true)}
            className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs flex items-center space-x-2 shadow-xs transition cursor-pointer"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Course Material</span>
          </button>

          {isHod && (
            <button
              onClick={() => setShowCreateCourseModal(true)}
              className="px-3.5 py-2 bg-primary-900 hover:bg-primary-800 text-white font-bold rounded-xl text-xs flex items-center space-x-2 shadow-xs transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Course</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. SUMMARY METRICS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-surface p-4 rounded-xl border border-border shadow-xs flex items-center space-x-3.5">
          <div className="p-3 bg-indigo-100 dark:bg-indigo-900/40 rounded-xl text-indigo-600 dark:text-indigo-400 shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-mono tracking-wider text-text-muted font-bold">
              {isLecturer ? 'My Assigned Courses' : 'Department Courses'}
            </span>
            <p className="font-serif text-2xl font-bold text-text-primary mt-0.5">
              {isLecturer ? myAssignedCount : scopedCourses.length}
            </p>
            <p className="text-[10px] text-text-muted mt-0.5">
              {isLecturer ? `Out of ${courses.length} total modules` : 'Active departmental curriculum'}
            </p>
          </div>
        </div>

        <div className="bg-surface p-4 rounded-xl border border-border shadow-xs flex items-center space-x-3.5">
          <div className="p-3 bg-emerald-100 dark:bg-emerald-900/40 rounded-xl text-emerald-600 dark:text-emerald-400 shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-mono tracking-wider text-text-muted font-bold">
              Course Materials
            </span>
            <p className="font-serif text-2xl font-bold text-text-primary mt-0.5">
              {totalMaterialsCount}
            </p>
            <p className="text-[10px] text-text-muted mt-0.5">
              Notes, Syllabi & Lab Guides
            </p>
          </div>
        </div>

        <div className="bg-surface p-4 rounded-xl border border-border shadow-xs flex items-center space-x-3.5">
          <div className="p-3 bg-blue-100 dark:bg-blue-900/40 rounded-xl text-blue-600 dark:text-blue-400 shrink-0">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-mono tracking-wider text-text-muted font-bold">
              Enrolled Students
            </span>
            <p className="font-serif text-2xl font-bold text-text-primary mt-0.5">
              {totalEnrolledStudents}
            </p>
            <p className="text-[10px] text-text-muted mt-0.5">
              Across all course rosters
            </p>
          </div>
        </div>

        <div className="bg-surface p-4 rounded-xl border border-border shadow-xs flex items-center space-x-3.5">
          <div className="p-3 bg-amber-100 dark:bg-amber-900/40 rounded-xl text-amber-600 dark:text-amber-400 shrink-0">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-mono tracking-wider text-text-muted font-bold">
              Faculty Lecturers
            </span>
            <p className="font-serif text-2xl font-bold text-text-primary mt-0.5">
              {supervisorList.length}
            </p>
            <p className="text-[10px] text-text-muted mt-0.5">
              Teaching Staff & Supervisors
            </p>
          </div>
        </div>
      </div>

      {/* 3. NAVIGATION TABS */}
      <div className="flex border-b border-border space-x-6 text-xs font-bold text-text-secondary">
        <button
          onClick={() => setActiveTab('courses')}
          className={`pb-3 flex items-center space-x-2 border-b-2 transition cursor-pointer ${
            activeTab === 'courses' 
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400' 
              : 'border-transparent hover:text-text-primary'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Courses ({filteredCourses.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('materials')}
          className={`pb-3 flex items-center space-x-2 border-b-2 transition cursor-pointer ${
            activeTab === 'materials' 
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400' 
              : 'border-transparent hover:text-text-primary'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Course Materials ({filteredMaterials.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('enrollments')}
          className={`pb-3 flex items-center space-x-2 border-b-2 transition cursor-pointer ${
            activeTab === 'enrollments' 
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400' 
              : 'border-transparent hover:text-text-primary'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Student Enrollment Rosters</span>
        </button>
      </div>

      {/* SEARCH AND FILTER BAR */}
      <div className="bg-surface p-3.5 rounded-xl border border-border shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder={
              activeTab === 'courses' ? 'Search course code, name, lecturer...' :
              activeTab === 'materials' ? 'Search material title, filename...' : 'Search student rosters...'
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-paper border border-border rounded-lg outline-none text-xs text-text-primary focus:ring-1 focus:ring-indigo-600"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {activeTab === 'courses' && (
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="px-3 py-2 bg-paper border border-border rounded-lg text-xs outline-none focus:ring-1 focus:ring-indigo-600 font-medium"
            >
              <option value="all">All Departments</option>
              {departments.map(d => (
                <option key={d.id} value={d.name}>{d.name} ({d.code})</option>
              ))}
            </select>
          )}

          {activeTab === 'materials' && (
            <>
              <select
                value={selectedCourseFilter}
                onChange={(e) => setSelectedCourseFilter(e.target.value)}
                className="px-3 py-2 bg-paper border border-border rounded-lg text-xs outline-none focus:ring-1 focus:ring-indigo-600 font-medium"
              >
                <option value="all">All Courses ({courses.length})</option>
                {courses.map(c => (
                  <option key={c.id} value={c.id}>{c.code} — {c.name}</option>
                ))}
              </select>

              <select
                value={materialCategoryFilter}
                onChange={(e) => setMaterialCategoryFilter(e.target.value)}
                className="px-3 py-2 bg-paper border border-border rounded-lg text-xs outline-none focus:ring-1 focus:ring-indigo-600 font-medium"
              >
                <option value="all">All Categories</option>
                <option value="Lecture Notes">Lecture Notes</option>
                <option value="Syllabus">Syllabus</option>
                <option value="Lab">Lab Guides</option>
                <option value="Reference">Reference Material</option>
              </select>

              <select
                value={materialFormatFilter}
                onChange={(e) => setMaterialFormatFilter(e.target.value)}
                className="px-3 py-2 bg-paper border border-border rounded-lg text-xs outline-none focus:ring-1 focus:ring-indigo-600 font-medium font-mono"
              >
                <option value="all">All File Formats</option>
                <option value="pptx">📊 PowerPoint (.pptx)</option>
                <option value="docx">📝 Word (.docx)</option>
                <option value="pdf">📄 PDF (.pdf)</option>
                <option value="txt">📃 Text (.txt)</option>
              </select>
            </>
          )}
        </div>
      </div>

      {/* TAB 1: COURSES & TEACHING MODULES */}
      {activeTab === 'courses' && (
        <div className="space-y-4">
          {filteredCourses.length === 0 ? (
            <div className="bg-surface p-12 text-center rounded-xl border border-border space-y-3">
              <BookOpen className="w-8 h-8 text-text-muted mx-auto" />
              <p className="font-serif text-base font-bold text-text-primary">No Courses Found</p>
              <p className="text-xs text-text-secondary max-w-sm mx-auto">
                No courses match your search or department filters. You can create a new course or adjust your filter.
              </p>
              {isHod && (
                <button
                  onClick={() => setShowCreateCourseModal(true)}
                  className="px-4 py-2 bg-indigo-600 text-white font-bold rounded-lg text-xs inline-flex items-center space-x-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create New Course</span>
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredCourses.map(course => {
                const assignedLecturer = users.find(u => u.id === course.lecturerId);
                const courseMatCount = courseMaterials.filter(m => m.courseId === course.id || m.courseCode.toLowerCase() === course.code.toLowerCase()).length;
                const enrolledCount = Array.isArray(course.enrolledStudents) ? course.enrolledStudents.length : 0;
                const isAssignedToMe = course.lecturerId === currentUser?.id;

                return (
                  <div key={course.id} className="bg-surface border border-border rounded-2xl p-5 space-y-4 shadow-xs hover:border-indigo-300 dark:hover:border-indigo-700 transition flex flex-col justify-between">
                    <div className="space-y-3">
                      {/* COURSE BADGE */}
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 px-2.5 py-1 rounded-lg">
                          {course.code}
                        </span>
                        <div className="flex items-center space-x-1">
                          {isAssignedToMe && (
                            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-mono text-[9px] font-bold rounded uppercase">
                              My Course
                            </span>
                          )}
                          <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-text-secondary font-mono text-[9px] rounded font-bold">
                            L{course.level || '400'}
                          </span>
                        </div>
                      </div>

                      {/* TITLE */}
                      <div>
                        <h3 className="font-serif text-base font-bold text-slate-900 dark:text-slate-100">
                          {course.name}
                        </h3>
                        <p className="text-[11px] text-text-muted mt-0.5">
                          {course.programme} ({course.dept})
                        </p>
                      </div>

                      {/* LECTURER INFORMATION */}
                      <div className="p-3 bg-paper border border-border rounded-xl space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase text-text-muted">
                            Assigned Lecturer
                          </span>
                          {isHod && (
                            <span className="text-[10px] font-mono text-indigo-600 font-bold">
                              HOD Controls
                            </span>
                          )}
                        </div>

                        {isHod ? (
                          <select
                            value={course.lecturerId || ''}
                            onChange={(e) => handleLecturerReassign(course.id, e.target.value)}
                            className="w-full text-xs p-1.5 bg-white dark:bg-slate-800 border border-border rounded-lg outline-none font-semibold text-slate-800 dark:text-slate-200"
                          >
                            <option value="">-- Assign Lecturer --</option>
                            {supervisorList.map(sup => (
                              <option key={sup.id} value={sup.id}>
                                {sup.name} ({sup.dept})
                              </option>
                            ))}
                          </select>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <div className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 font-bold flex items-center justify-center text-[10px]">
                              {(assignedLecturer?.name || course.lecturerName || 'U').charAt(0)}
                            </div>
                            <span className="text-xs font-semibold text-text-primary">
                              {assignedLecturer?.name || course.lecturerName || 'Unassigned'}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* STATS STRIP */}
                      <div className="grid grid-cols-2 gap-2 text-center pt-1">
                        <div className="p-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-border">
                          <span className="text-[10px] text-text-muted font-mono block uppercase">Materials</span>
                          <span className="font-bold text-xs text-indigo-600 dark:text-indigo-400">{courseMatCount} Files</span>
                        </div>
                        <div className="p-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-border">
                          <span className="text-[10px] text-text-muted font-mono block uppercase">Enrolled</span>
                          <span className="font-bold text-xs text-emerald-600 dark:text-emerald-400">{enrolledCount} Students</span>
                        </div>
                      </div>
                    </div>

                    {/* ACTIONS */}
                    <div className="pt-3 border-t border-border flex flex-col sm:flex-row items-center gap-2">
                      <button
                        onClick={() => handleOpenUploadForCourse(course)}
                        className="w-full py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/80 dark:text-indigo-300 font-bold rounded-lg text-xs flex items-center justify-center space-x-1.5 transition cursor-pointer"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload Notes</span>
                      </button>

                      <button
                        onClick={() => handleOpenRosterForCourse(course)}
                        className="w-full py-2 bg-paper border border-border hover:bg-slate-100 dark:hover:bg-slate-800 text-text-primary font-bold rounded-lg text-xs flex items-center justify-center space-x-1.5 transition cursor-pointer"
                      >
                        <Users className="w-3.5 h-3.5" />
                        <span>Manage Roster</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: COURSE MATERIALS LIBRARY */}
      {activeTab === 'materials' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-xs text-text-secondary font-medium">
              Showing {filteredMaterials.length} of {courseMaterials.length} course material files
            </p>
            <button
              onClick={() => setShowUploadModal(true)}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-xs flex items-center space-x-1.5 transition cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Publish New Material</span>
            </button>
          </div>

          {filteredMaterials.length === 0 ? (
            <div className="bg-surface p-12 text-center rounded-xl border border-border space-y-3">
              <FileText className="w-8 h-8 text-text-muted mx-auto" />
              <p className="font-serif text-base font-bold text-text-primary">No Course Materials Found</p>
              <p className="text-xs text-text-secondary max-w-sm mx-auto">
                No lecture notes or course resources match the selected filters.
              </p>
              <button
                onClick={() => setShowUploadModal(true)}
                className="px-4 py-2 bg-indigo-600 text-white font-bold rounded-lg text-xs inline-flex items-center space-x-1.5"
              >
                <Upload className="w-4 h-4" />
                <span>Upload First Material</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredMaterials.map(mat => {
                const uploader = users.find(u => u.id === mat.uploadedBy);
                const courseObj = courses.find(c => c.id === mat.courseId || c.code === mat.courseCode);

                return (
                  <div key={mat.id} className="bg-surface border border-border rounded-xl p-4 space-y-3 shadow-2xs hover:border-indigo-200 transition text-left flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="p-2 bg-indigo-50 dark:bg-indigo-950/60 rounded-lg text-indigo-600 dark:text-indigo-400">
                            <FileText className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="font-mono text-[10px] font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded border border-indigo-200 dark:border-indigo-800">
                              {mat.courseCode}
                            </span>
                            <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100 mt-1">
                              {mat.title}
                            </h4>
                          </div>
                        </div>
                        <span className="text-[10px] font-mono text-text-muted bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded font-bold">
                          {mat.fileSize || '2.0 MB'}
                        </span>
                      </div>

                      {mat.description && (
                        <p className="text-[11px] text-text-secondary leading-relaxed">
                          {mat.description}
                        </p>
                      )}

                      <div className="flex items-center justify-between text-[10px] text-text-muted font-mono pt-1">
                        <span>📄 {mat.fileName}</span>
                        <span>By {uploader?.name || 'Faculty Member'}</span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-border/80 flex items-center justify-between">
                      <button
                        onClick={() => handleSimulatedDownload(mat)}
                        className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 font-bold rounded-lg text-xs flex items-center space-x-1.5 transition cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download Material</span>
                      </button>

                      {(isHod || mat.uploadedBy === currentUser?.id) && (
                        <button
                          onClick={() => handleDeleteMaterial(mat.id, mat.title)}
                          className="px-2.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-950/60 dark:text-red-400 font-bold rounded-lg text-xs flex items-center space-x-1 transition cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: STUDENT ENROLLMENT ROSTERS */}
      {activeTab === 'enrollments' && (
        <div className="space-y-4">
          <div className="bg-surface border border-border rounded-xl p-5 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-serif text-base font-bold text-slate-900 dark:text-slate-100">
                  Course Enrollment Directory
                </h3>
                <p className="text-xs text-text-muted">
                  Select a course to manage enrolled students or add students from the department directory.
                </p>
              </div>

              <select
                value={selectedCourseFilter === 'all' ? (courses[0]?.id || '') : selectedCourseFilter}
                onChange={(e) => setSelectedCourseFilter(e.target.value)}
                className="p-2 bg-paper border border-border rounded-lg text-xs font-bold outline-none focus:ring-1 focus:ring-indigo-600"
              >
                {courses.map(c => (
                  <option key={c.id} value={c.id}>{c.code} — {c.name}</option>
                ))}
              </select>
            </div>

            {/* ENROLLED STUDENTS LIST */}
            {(() => {
              const currentCourseId = selectedCourseFilter === 'all' ? (courses[0]?.id || '') : selectedCourseFilter;
              const currentCourse = courses.find(c => c.id === currentCourseId);
              if (!currentCourse) return <p className="text-xs text-text-muted">No course selected.</p>;

              const enrolledStudentIds = currentCourse.enrolledStudents || [];
              const enrolledStudentObjs = studentList.filter(s => enrolledStudentIds.includes(s.id));
              const availableToEnroll = studentList.filter(s => !enrolledStudentIds.includes(s.id));

              return (
                <div className="space-y-4 pt-2 border-t border-border">
                  <div className="flex items-center justify-between bg-indigo-50/50 dark:bg-slate-800 p-3 rounded-lg border border-indigo-100 dark:border-indigo-900">
                    <div className="flex items-center space-x-2">
                      <BookOpen className="w-4 h-4 text-indigo-600" />
                      <span className="font-bold text-xs text-indigo-950 dark:text-indigo-200">
                        {currentCourse.code}: {currentCourse.name}
                      </span>
                    </div>
                    <span className="font-mono text-xs font-bold text-indigo-700 dark:text-indigo-300">
                      {enrolledStudentObjs.length} Students Enrolled
                    </span>
                  </div>

                  {/* QUICK ENROLL DROP-DOWN */}
                  <div className="flex flex-col sm:flex-row items-center gap-2 p-3 bg-paper rounded-xl border border-border">
                    <span className="text-xs font-bold text-text-secondary whitespace-nowrap">
                      Quick Enroll Student:
                    </span>
                    <select
                      id="quick-enroll-select"
                      className="w-full sm:w-auto flex-1 p-2 bg-surface border border-border rounded-lg text-xs outline-none"
                      onChange={(e) => {
                        const studId = e.target.value;
                        if (studId) {
                          enrollStudentInCourse(currentCourse.id, studId);
                          showToast(`✅ Student enrolled in ${currentCourse.code}.`);
                          e.target.value = '';
                        }
                      }}
                    >
                      <option value="">-- Choose Student to Enroll --</option>
                      {availableToEnroll.map(s => (
                        <option key={s.id} value={s.id}>
                          {s.name} ({s.indexNum || 'Student'}) — {s.prog}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* ROSTER TABLE */}
                  {enrolledStudentObjs.length === 0 ? (
                    <p className="text-xs text-text-muted italic p-4 text-center">
                      No students enrolled in this course yet. Use the dropdown above to enroll students.
                    </p>
                  ) : (
                    <div className="overflow-x-auto border border-border rounded-xl">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-paper border-b border-border uppercase font-mono text-[10px] text-text-muted">
                          <tr>
                            <th className="p-3">Student Name</th>
                            <th className="p-3">Index Number</th>
                            <th className="p-3">Programme</th>
                            <th className="p-3">Level</th>
                            <th className="p-3 text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          {enrolledStudentObjs.map(st => (
                            <tr key={st.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                              <td className="p-3 font-bold text-slate-900 dark:text-slate-100">
                                {st.name}
                              </td>
                              <td className="p-3 font-mono text-indigo-600 font-bold">
                                {st.indexNum || 'N/A'}
                              </td>
                              <td className="p-3 text-text-secondary">
                                {st.prog}
                              </td>
                              <td className="p-3 font-mono">
                                L{st.level || '400'}
                              </td>
                              <td className="p-3 text-right">
                                <button
                                  onClick={() => {
                                    unenrollStudentFromCourse(currentCourse.id, st.id);
                                    showToast(`Unenrolled ${st.name} from ${currentCourse.code}`);
                                  }}
                                  className="px-2.5 py-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-950 font-bold rounded text-[10px] transition"
                                >
                                  Unenroll
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* MODAL 1: UPLOAD COURSE MATERIAL */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface border border-border rounded-2xl w-full max-w-lg p-6 space-y-5 shadow-2xl animate-scale-in text-left">
            <div className="flex justify-between items-center pb-3 border-b border-border">
              <div className="flex items-center space-x-2">
                <Upload className="w-5 h-5 text-indigo-600" />
                <h2 className="font-serif text-lg font-bold text-slate-900 dark:text-slate-100">
                  Publish Course Material
                </h2>
              </div>
              <button 
                onClick={() => setShowUploadModal(false)}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-text-muted"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              {/* TARGET COURSE */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Target Course *
                </label>
                <select
                  value={matCourseId}
                  onChange={(e) => setMatCourseId(e.target.value)}
                  className="w-full text-xs p-2.5 border border-border rounded-lg bg-paper font-semibold outline-none focus:ring-1 focus:ring-indigo-600"
                  required
                >
                  <option value="">-- Choose Target Course --</option>
                  {courses.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.code} — {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* MATERIAL TITLE */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Material Title *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Lecture 4: Consensus Protocols & Raft Architecture"
                  value={matTitle}
                  onChange={(e) => setMatTitle(e.target.value)}
                  className="w-full text-xs p-2.5 border border-border rounded-lg bg-paper outline-none focus:ring-1 focus:ring-indigo-600"
                  required
                />
              </div>

              {/* CATEGORY & FILE SIZE */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Material Type
                  </label>
                  <select
                    value={matCategory}
                    onChange={(e) => setMatCategory(e.target.value)}
                    className="w-full text-xs p-2.5 border border-border rounded-lg bg-paper outline-none"
                  >
                    <option value="Lecture Notes">Lecture Notes</option>
                    <option value="Syllabus">Course Syllabus</option>
                    <option value="Lab Manual">Lab Handout / Guide</option>
                    <option value="Reference Reading">Reference Reading</option>
                    <option value="Assignment Outline">Assignment Outline</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    File Size Display
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 2.8 MB"
                    value={matFileSize}
                    onChange={(e) => setMatFileSize(e.target.value)}
                    className="w-full text-xs p-2.5 border border-border rounded-lg bg-paper outline-none"
                  />
                </div>
              </div>

              {/* FILE NAME / DROPZONE */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Document Filename
                </label>
                <input
                  type="text"
                  placeholder="e.g. CS402_Lecture_04_Notes.pdf"
                  value={matFileName}
                  onChange={(e) => setMatFileName(e.target.value)}
                  className="w-full text-xs p-2.5 border border-border rounded-lg bg-paper outline-none font-mono"
                />
              </div>

              {/* DESCRIPTION */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Description / Study Instructions
                </label>
                <textarea
                  rows={3}
                  placeholder="Briefly explain key topics covered in this material..."
                  value={matDescription}
                  onChange={(e) => setMatDescription(e.target.value)}
                  className="w-full text-xs p-2.5 border border-border rounded-lg bg-paper outline-none"
                />
              </div>

              <div className="pt-3 border-t border-border flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 bg-paper hover:bg-slate-100 text-text-primary rounded-lg text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold flex items-center space-x-1.5 shadow-xs"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Publish Material</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: CREATE COURSE (FOR HOD/ADMIN) */}
      {showCreateCourseModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface border border-border rounded-2xl w-full max-w-lg p-6 space-y-5 shadow-2xl animate-scale-in text-left">
            <div className="flex justify-between items-center pb-3 border-b border-border">
              <div className="flex items-center space-x-2">
                <BookOpen className="w-5 h-5 text-indigo-600" />
                <h2 className="font-serif text-lg font-bold text-slate-900 dark:text-slate-100">
                  Create New Course Module
                </h2>
              </div>
              <button 
                onClick={() => setShowCreateCourseModal(false)}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-text-muted"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCourseSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Course Code *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. CS 405"
                    value={newCourseCode}
                    onChange={(e) => setNewCourseCode(e.target.value)}
                    className="w-full text-xs p-2.5 border border-border rounded-lg bg-paper font-mono uppercase font-bold outline-none"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Academic Level
                  </label>
                  <select
                    value={newCourseLevel}
                    onChange={(e) => setNewCourseLevel(e.target.value)}
                    className="w-full text-xs p-2.5 border border-border rounded-lg bg-paper outline-none font-bold"
                  >
                    <option value="100">Level 100</option>
                    <option value="200">Level 200</option>
                    <option value="300">Level 300</option>
                    <option value="400">Level 400</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Course Title *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Cloud Native Security & Distributed Systems"
                  value={newCourseName}
                  onChange={(e) => setNewCourseName(e.target.value)}
                  className="w-full text-xs p-2.5 border border-border rounded-lg bg-paper outline-none font-semibold"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Department
                  </label>
                  <select
                    value={newCourseDept}
                    onChange={(e) => setNewCourseDept(e.target.value)}
                    className="w-full text-xs p-2.5 border border-border rounded-lg bg-paper outline-none"
                  >
                    {departments.map(d => (
                      <option key={d.id} value={d.name}>{d.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Programme
                  </label>
                  <select
                    value={newCourseProg}
                    onChange={(e) => setNewCourseProg(e.target.value)}
                    className="w-full text-xs p-2.5 border border-border rounded-lg bg-paper outline-none"
                  >
                    {programmes.map(p => (
                      <option key={p.id} value={p.name}>{p.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Assign Lecturer
                </label>
                <select
                  value={newCourseLecturerId}
                  onChange={(e) => setNewCourseLecturerId(e.target.value)}
                  className="w-full text-xs p-2.5 border border-border rounded-lg bg-paper outline-none font-semibold"
                >
                  <option value="">-- Assign Lecturer Later --</option>
                  {supervisorList.map(sup => (
                    <option key={sup.id} value={sup.id}>
                      {sup.name} ({sup.dept})
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-3 border-t border-border flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowCreateCourseModal(false)}
                  className="px-4 py-2 bg-paper hover:bg-slate-100 text-text-primary rounded-lg text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-900 hover:bg-primary-800 text-white rounded-lg text-xs font-bold flex items-center space-x-1.5 shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create Course</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: ROSTER MANAGEMENT */}
      {showRosterModal && selectedCourseForRoster && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface border border-border rounded-2xl w-full max-w-xl p-6 space-y-5 shadow-2xl animate-scale-in text-left">
            <div className="flex justify-between items-center pb-3 border-b border-border">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-indigo-600" />
                <div>
                  <h2 className="font-serif text-lg font-bold text-slate-900 dark:text-slate-100">
                    Course Roster: {selectedCourseForRoster.code}
                  </h2>
                  <p className="text-[11px] text-text-muted">
                    {selectedCourseForRoster.name}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setShowRosterModal(false)}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-text-muted"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* ENROLL NEW STUDENT SELECTOR */}
              <div className="p-3 bg-indigo-50/50 dark:bg-slate-800/80 rounded-xl border border-indigo-100 dark:border-indigo-900 space-y-2">
                <label className="block text-xs font-bold text-indigo-950 dark:text-indigo-200">
                  Enroll Student to {selectedCourseForRoster.code}:
                </label>
                <select
                  className="w-full p-2 bg-white dark:bg-slate-900 border border-border rounded-lg text-xs outline-none font-semibold"
                  onChange={(e) => {
                    const studId = e.target.value;
                    if (studId) {
                      enrollStudentInCourse(selectedCourseForRoster.id, studId);
                      showToast(`Enrolled student into ${selectedCourseForRoster.code}`);
                      e.target.value = '';
                    }
                  }}
                >
                  <option value="">-- Choose Student --</option>
                  {studentList.filter(s => !(selectedCourseForRoster.enrolledStudents || []).includes(s.id)).map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.indexNum || 'Student'}) — {s.prog}
                    </option>
                  ))}
                </select>
              </div>

              {/* CURRENTLY ENROLLED */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-text-secondary uppercase text-[10.5px]">
                  Currently Enrolled Students ({(selectedCourseForRoster.enrolledStudents || []).length})
                </span>

                <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
                  {studentList.filter(s => (selectedCourseForRoster.enrolledStudents || []).includes(s.id)).map(st => (
                    <div key={st.id} className="p-3 bg-paper border border-border rounded-xl flex items-center justify-between">
                      <div>
                        <p className="font-bold text-xs text-slate-900 dark:text-slate-100">{st.name}</p>
                        <p className="text-[10.5px] font-mono text-text-muted">{st.indexNum || 'N/A'} · {st.prog}</p>
                      </div>
                      <button
                        onClick={() => {
                          unenrollStudentFromCourse(selectedCourseForRoster.id, st.id);
                          showToast(`Unenrolled ${st.name}`);
                        }}
                        className="px-2.5 py-1 text-red-600 hover:bg-red-50 font-bold rounded text-[11px] transition"
                      >
                        Unenroll
                      </button>
                    </div>
                  ))}

                  {(selectedCourseForRoster.enrolledStudents || []).length === 0 && (
                    <p className="text-xs text-text-muted italic py-4 text-center">
                      No students enrolled yet.
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-border flex justify-end">
              <button
                onClick={() => setShowRosterModal(false)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

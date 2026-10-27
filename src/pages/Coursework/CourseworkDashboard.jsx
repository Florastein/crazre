import React, { useState, useEffect } from 'react';
import { useAppState } from '../../contexts/StateContext';
import { 
  ClipboardList, Plus, FileText, CheckCircle, Clock, Calendar, 
  Upload, Users, Award, BookOpen, Search, Filter, AlertCircle, Eye,
  Book, ChevronRight, ChevronLeft, Download, BarChart2, CheckSquare, Inbox, HelpCircle,
  X, Trash2, ArrowLeft, User, GraduationCap
} from 'lucide-react';

const MOODLE_TOPICS = [
  {
    id: 'topic1',
    name: 'Topic 1: Architectural Modeling & Proposal Formulation',
    description: 'Academic directives on mapping course architectures, literature maps definition, and formal UML specifications.',
    resources: [
      { id: 'res1', title: 'acaDEX Coursework Architecture Guidelines.pdf', size: '1.4 MB' },
      { id: 'res2', title: 'Paxos/Raft Scope Formulation & Budget Template.docx', size: '520 KB' }
    ]
  },
  {
    id: 'topic2',
    name: 'Topic 2: Sandboxed Isolation Boundaries & Escape Assessments',
    description: 'Engineering practices for validating WebAssembly runtime benchmarks, fault thresholds, and escaping pathways.',
    resources: [
      { id: 'res3', title: 'Lecture Notes: Secure Isolation over Virtual Environments.pdf', size: '3.1 MB' },
      { id: 'res4', title: 'UML Sandbox Components Interaction Scheme.pdf', size: '1.1 MB' }
    ]
  },
  {
    id: 'topic3',
    name: 'Topic 3: Byzantines Injections & Performance Matrix Analytics',
    description: 'System tests modeling communication overheads under massive packet packet drops and partitions.',
    resources: [
      { id: 'res5', title: 'Docker Simulation Benchmarking Environment Script.zip', size: '4.8 MB' }
    ]
  }
];

export default function CourseworkDashboard() {
  const { 
    currentUser, 
    currentRole, 
    courseworks, 
    createCoursework, 
    submitCoursework, 
    requestResubmissionCoursework,
    gradeCoursework,
    users,
    groups,
    documents,
    milestones,
    programmes,
    risks,
    departments,
    createGroup,
    courses,
    courseMaterials,
    quizzes,
    uploadCourseMaterial,
    deleteCourseMaterial,
    createQuiz,
    submitQuiz,
    gradeQuiz
  } = useAppState();

  // Moodle-specific tab routing: 
  // 'syllabus', 'assignments', 'my_submissions', 'review_queue', 'gradebook', 'new'
  const [moodleTab, setMoodleTab] = useState('syllabus');
  const [facultyTab, setFacultyTab] = useState('courseworks'); // 'courseworks' | 'course_groups' | 'grades'
  const [showCreateForm, setShowCreateForm] = useState(false);
  
  // Filtering and searching state
  const [filterProgramme, setFilterProgramme] = useState('all');
  const [filterClass, setFilterClass] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopicId, setSelectedTopicId] = useState('all');

  // Currently focused assignment for submission view details
  const [activeMoodleCwId, setActiveMoodleCwId] = useState(null);

  // New Coursework Creation Form Parameters
  const [title, setTitle] = useState('');
  const [courseCode, setCourseCode] = useState('');
  const [courseName, setCourseName] = useState('');
  const [programme, setProgramme] = useState(programmes[0]?.name || 'BSc. Computer Science');
  const [level, setLevel] = useState('400');
  const [description, setDescription] = useState('');
  const [points, setPoints] = useState('100');
  const [isGroupSubmission, setIsGroupSubmission] = useState(true);
  const [linkedMilestone, setLinkedMilestone] = useState('Milestone 1');

  // New Dynamic Preset Due Date State
  const [dueDateType, setDueDateType] = useState('custom'); // 'custom' | 'preset'
  const [presetScale, setPresetScale] = useState('weekly'); // 'daily' | 'weekly' | 'monthly'
  const [presetValue, setPresetValue] = useState(1);
  const [customDueDate, setCustomDueDate] = useState('');
  const [computedDueDate, setComputedDueDate] = useState('');

  // Student submission form parameters & multi-attachment state
  const [submissionNotes, setSubmissionNotes] = useState('');
  const [simulatedFileName, setSimulatedFileName] = useState('');
  const [uploadedAttachments, setUploadedAttachments] = useState([]);
  const [receiptModalData, setReceiptModalData] = useState(null);

  // Evaluator grade/feedback form parameters & Rubric breakdown
  const [focusGradingSub, setFocusGradingSub] = useState(null); // { cwId, submission }
  const [scoreInput, setScoreInput] = useState('');
  const [feedbackInput, setFeedbackInput] = useState('');
  const [rubricScores, setRubricScores] = useState({
    architecture: 30,
    implementation: 40,
    documentation: 30
  });
  const [gradingMode, setGradingMode] = useState('grade'); // 'grade' | 'resubmit'
  const [resubmissionReason, setResubmissionReason] = useState('');

  // Group creation form parameters
  const [showCreateGroupForm, setShowCreateGroupForm] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupCourseId, setNewGroupCourseId] = useState('');
  const [newGroupCourseCode, setNewGroupCourseCode] = useState('');
  const [newGroupCourseName, setNewGroupCourseName] = useState('');
  const [newGroupDept, setNewGroupDept] = useState('Computer Science');
  const [newGroupProg, setNewGroupProg] = useState('');
  const [newGroupLevel, setNewGroupLevel] = useState('400');
  const [newGroupCapacity, setNewGroupCapacity] = useState('4');
  const [newGroupSupervisorId, setNewGroupSupervisorId] = useState('');
  const [newGroupMembers, setNewGroupMembers] = useState([]);
  const [newGroupLeadId, setNewGroupLeadId] = useState('');
  const [groupCourseFilter, setGroupCourseFilter] = useState('all');

  // Course Materials State
  const [showUploadMaterialModal, setShowUploadMaterialModal] = useState(false);
  const [materialTitle, setMaterialTitle] = useState('');
  const [materialCourseId, setMaterialCourseId] = useState('');
  const [materialDescription, setMaterialDescription] = useState('');
  const [materialFileName, setMaterialFileName] = useState('');
  const [materialFileSize, setMaterialFileSize] = useState('2.4 MB');

  // Quizzes State
  const [showCreateQuizModal, setShowCreateQuizModal] = useState(false);
  const [quizCourseId, setQuizCourseId] = useState('');
  const [quizTitle, setQuizTitle] = useState('');
  const [quizDescription, setQuizDescription] = useState('');
  const [quizDueDate, setQuizDueDate] = useState('');
  const [quizTimeLimit, setQuizTimeLimit] = useState('15');
  const [quizPoints, setQuizPoints] = useState('20');
  const [quizQuestions, setQuizQuestions] = useState([
    {
      id: 1,
      question: 'What is the primary objective of software architecture design?',
      options: [
        'To write maximum lines of code',
        'To define high-level structure, components, and non-functional requirements',
        'To design graphic logos',
        'To test database hardware cables'
      ],
      correctAnswer: 1,
      points: 5
    },
    {
      id: 2,
      question: 'Which protocol is commonly used for secure web API communications?',
      options: ['HTTP', 'FTP', 'HTTPS', 'Telnet'],
      correctAnswer: 2,
      points: 5
    }
  ]);

  // Active Quiz Taking State
  const [activeQuizToTake, setActiveQuizToTake] = useState(null);
  const [quizSelectedAnswers, setQuizSelectedAnswers] = useState({}); // questionIndex -> optionIndex
  const [quizResultScore, setQuizResultScore] = useState(null);

  // Multi-stage Coursework wizard state definitions
  const [showCourseworkWizard, setShowCourseworkWizard] = useState(false);
  const [wizardCwStep, setWizardCwStep] = useState(1);
  const [wizardCourseCode, setWizardCourseCode] = useState('');
  const [wizardCourseName, setWizardCourseName] = useState('');
  const [wizardProgramme, setWizardProgramme] = useState((programmesRef => programmesRef && programmesRef[0] ? programmesRef[0].name : 'BSc. Computer Science')(programmes));
  const [wizardLevel, setWizardLevel] = useState('400');
  const [wizardExtraMaterial, setWizardExtraMaterial] = useState('');
  const [wizardAttachedFile, setWizardAttachedFile] = useState(null);
  const [wizardMilestones, setWizardMilestones] = useState([]);

  // Active milestone formulation inputs (Stage 2)
  const [msTopic, setMsTopic] = useState('');
  const [msSubmissionType, setMsSubmissionType] = useState('file'); // 'file' | 'text' | 'any'
  const [msStartDate, setMsStartDate] = useState('');
  const [msDueDate, setMsDueDate] = useState('');

  const handleCloseWizard = () => {
    setWizardCwStep(1);
    setWizardCourseCode('');
    setWizardCourseName('');
    setWizardExtraMaterial('');
    setWizardAttachedFile(null);
    setWizardMilestones([]);
    setShowCourseworkWizard(false);
  };

  // Synchronize department & programme presets in group form if needed
  useEffect(() => {
    if (departments && departments.length > 0) {
      setNewGroupDept(departments[0].name);
    }
    if (programmes && programmes.length > 0) {
      setNewGroupProg(programmes[0].name);
    }
  }, [departments, programmes]);

  const resetGroupForm = () => {
    setNewGroupName('');
    setNewGroupCourseId(courses && courses.length > 0 ? courses[0].id : '');
    setNewGroupCourseCode(courses && courses.length > 0 ? courses[0].code : '');
    setNewGroupCourseName(courses && courses.length > 0 ? courses[0].name : '');
    setNewGroupDept(departments && departments.length > 0 ? departments[0].name : 'Computer Science');
    setNewGroupProg(programmes && programmes.length > 0 ? programmes[0].name : 'BSc. Computer Science');
    setNewGroupLevel('400');
    setNewGroupCapacity('4');
    setNewGroupSupervisorId('');
    setNewGroupMembers([]);
    setNewGroupLeadId('');
  };

  const handleCreateGroupSubmit = (e) => {
    e.preventDefault();
    if (!newGroupName.trim()) {
      alert('Please fill out all required group details.');
      return;
    }
    if (newGroupMembers.length === 0) {
      alert('Please select at least one student member for this group.');
      return;
    }
    
    const matchedCourse = courses.find(c => c.id === newGroupCourseId) || courses.find(c => c.code.toLowerCase() === newGroupCourseCode.toLowerCase());
    const finalCourseId = matchedCourse ? matchedCourse.id : newGroupCourseId;
    const finalCourseCode = matchedCourse ? matchedCourse.code : (newGroupCourseCode || 'CS 402');
    const finalCourseName = matchedCourse ? matchedCourse.name : (newGroupCourseName || 'Coursework Module');

    // Call state context function
    createGroup(
      newGroupName.trim(),
      newGroupDept,
      newGroupProg,
      newGroupLevel,
      parseInt(newGroupCapacity) || 4,
      newGroupSupervisorId || (currentUser ? currentUser.id : ''),
      newGroupMembers,
      newGroupLeadId || newGroupMembers[0],
      finalCourseId,
      finalCourseCode,
      finalCourseName
    );

    // Show success message and reset form
    alert(`Success: Course group "${newGroupName}" for ${finalCourseCode} has been successfully created!`);
    setShowCreateGroupForm(false);
    resetGroupForm();
  };

  const handleUploadMaterialSubmit = (e) => {
    e.preventDefault();
    if (!materialTitle.trim() || !materialCourseId) {
      alert('Please fill out the material title and select a course.');
      return;
    }
    const targetCourse = courses.find(c => c.id === materialCourseId);
    uploadCourseMaterial({
      title: materialTitle.trim(),
      courseId: materialCourseId,
      courseCode: targetCourse ? targetCourse.code : 'CS 401',
      courseName: targetCourse ? targetCourse.name : 'Software Engineering',
      description: materialDescription.trim(),
      fileName: materialFileName.trim() || `${materialTitle.replace(/\s+/g, '_')}.pdf`,
      fileSize: materialFileSize || '2.5 MB'
    });

    setMaterialTitle('');
    setMaterialDescription('');
    setMaterialFileName('');
    setShowUploadMaterialModal(false);
    alert('Course material uploaded successfully!');
  };

  const handleCreateQuizSubmit = (e) => {
    e.preventDefault();
    if (!quizTitle.trim() || !quizCourseId) {
      alert('Please enter a quiz title and select a course.');
      return;
    }
    const targetCourse = courses.find(c => c.id === quizCourseId);
    createQuiz({
      title: quizTitle.trim(),
      courseId: quizCourseId,
      courseCode: targetCourse ? targetCourse.code : 'CS 401',
      courseName: targetCourse ? targetCourse.name : 'Software Engineering',
      description: quizDescription.trim(),
      dueDate: quizDueDate || '2026-09-30',
      timeLimit: parseInt(quizTimeLimit) || 15,
      totalPoints: parseInt(quizPoints) || 20,
      questions: quizQuestions
    });

    setQuizTitle('');
    setQuizDescription('');
    setShowCreateQuizModal(false);
    alert('Quiz created successfully!');
  };

  const handleStartQuiz = (quiz) => {
    setActiveQuizToTake(quiz);
    setQuizSelectedAnswers({});
    setQuizResultScore(null);
  };

  const handleSubmitQuizAnswers = (e) => {
    e.preventDefault();
    if (!activeQuizToTake) return;

    let totalScore = 0;
    const questions = activeQuizToTake.questions || [];
    questions.forEach((q, idx) => {
      const selected = quizSelectedAnswers[idx];
      if (selected !== undefined && selected === q.correctAnswer) {
        totalScore += (q.points || 5);
      }
    });

    submitQuiz(activeQuizToTake.id, totalScore, quizSelectedAnswers);
    setQuizResultScore(totalScore);
  };

  const isStudent = currentRole === 'student';
  const isSupervisor = currentRole === 'supervisor';
  const isAdmin = currentRole === 'admin' || currentRole === 'superadmin';
  const isFaculty = isSupervisor || isAdmin;

  // Student group details
  const studentGroupObj = isStudent && currentUser?.groupId 
    ? groups.find(g => g.id === currentUser.groupId) 
    : null;

  // Track computed preset due date in real-time
  useEffect(() => {
    if (dueDateType === 'preset') {
      const offsetDays = {
        daily: presetValue,
        weekly: presetValue * 7,
        monthly: presetValue * 30
      }[presetScale] || 7;

      const dateObj = new Date();
      dateObj.setDate(dateObj.getDate() + offsetDays);
      setComputedDueDate(dateObj.toISOString().split('T')[0]);
    } else {
      setComputedDueDate(customDueDate);
    }
  }, [dueDateType, presetScale, presetValue, customDueDate]);

  // Handler to register new courseworks from Faculty/Moodle Architect
  const handleLaunchMoodleTask = (e) => {
    e.preventDefault();
    if (!title.trim() || !courseCode.trim() || !courseName.trim() || !description.trim()) {
      alert('Fill standard assignment parameters first.');
      return;
    }

    const finalDeadline = dueDateType === 'preset' ? computedDueDate : customDueDate;
    if (!finalDeadline) {
      alert('Please specify a due date first or select a preset schedule.');
      return;
    }

    createCoursework(
      title.trim(),
      courseCode.trim().toUpperCase(),
      courseName.trim(),
      programme,
      level,
      description.trim(),
      finalDeadline,
      parseInt(points) || 100,
      isGroupSubmission,
      isGroupSubmission ? linkedMilestone : ''
    );

    // Reset create coursework form
    setTitle('');
    setCourseCode('');
    setCourseName('');
    setDescription('');
    setCustomDueDate('');
    setPoints('100');
    setMoodleTab('syllabus');
    setFacultyTab('courseworks');
    setShowCreateForm(false);
    alert('Task launched onto Moodle. Directives successfully synced with student pipelines.');
  };

  // Submit handler
  const handlePerformSubmit = (cw) => {
    if (!submissionNotes.trim()) {
      alert('Type compilation notes or key synthesis first.');
      return;
    }

    const resolvedFileName = simulatedFileName.trim() || `${cw.courseCode.replace(/\s+/g,'')}_Milestone_Submission.pdf`;
    
    // Prepare final attachments list
    const finalAttachments = uploadedAttachments.length > 0 
      ? uploadedAttachments 
      : [{ name: resolvedFileName, size: '2.2 MB', type: (resolvedFileName.split('.').pop() || 'pdf') }];

    const studentCourseGroup = groups.find(g => 
      ((g.courseId && g.courseId === cw.courseId) || 
       (g.courseCode && cw.courseCode && g.courseCode.toLowerCase() === cw.courseCode.toLowerCase())) &&
      g.members.includes(currentUser?.id)
    ) || groups.find(g => g.id === currentUser?.groupId);

    const targetGroupId = studentCourseGroup ? studentCourseGroup.id : currentUser?.groupId;

    submitCoursework(
      cw.id,
      currentUser.id,
      submissionNotes.trim(),
      finalAttachments[0].name,
      finalAttachments[0].size,
      targetGroupId,
      finalAttachments
    );

    // Show receipt modal
    const receiptCode = `CZ-SUB-2026-${Math.floor(100000 + Math.random() * 900000)}`;
    setReceiptModalData({
      receiptCode,
      courseCode: cw.courseCode,
      courseName: cw.courseName,
      title: cw.title,
      submittedAt: new Date().toISOString(),
      studentName: currentUser?.name || 'Student',
      groupName: studentCourseGroup ? studentCourseGroup.name : (studentGroupObj ? studentGroupObj.name : null),
      notes: submissionNotes.trim(),
      attachments: finalAttachments
    });

    // Reset submission form
    setSubmissionNotes('');
    setSimulatedFileName('');
    setUploadedAttachments([]);
    setActiveMoodleCwId(null);
  };

  const handlePerformGrading = (e) => {
    e.preventDefault();

    if (gradingMode === 'resubmit') {
      if (!resubmissionReason.trim()) {
        alert('Provide a clear reason for requesting revision.');
        return;
      }

      requestResubmissionCoursework(
        focusGradingSub.cwId,
        focusGradingSub.isGroup ? focusGradingSub.sub.groupId : focusGradingSub.sub.studentId,
        resubmissionReason.trim(),
        focusGradingSub.isGroup
      );

      setResubmissionReason('');
      setFocusGradingSub(null);
      alert('Revision request sent! The student or group can now upload an updated draft.');
      return;
    }

    if (!scoreInput || !feedbackInput.trim()) {
      alert('Specify scores and feedback text.');
      return;
    }

    gradeCoursework(
      focusGradingSub.cwId,
      focusGradingSub.isGroup ? focusGradingSub.sub.groupId : focusGradingSub.sub.studentId,
      scoreInput,
      feedbackInput.trim(),
      focusGradingSub.isGroup,
      rubricScores
    );

    // Reset grading form
    setScoreInput('');
    setFeedbackInput('');
    setFocusGradingSub(null);
    alert('Grades and rubric breakdown dispatched to student registry.');
  };

  // Helper date duration estimator
  const getTimeRemainingText = (dueString) => {
    const due = new Date(dueString);
    const today = new Date();
    const diff = due - today;
    if (diff < 0) {
      return 'Assignment is overdue';
    }
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    if (days === 1) return 'Due tomorrow';
    return `Due in ${days} days`;
  };

  return (
    <div className="space-y-6 text-text-primary text-xs font-sans">
      


      {/* STUDENT REGISTRY PROFILE STRIP */}
      {isStudent && currentUser && (
        <div className="bg-[#f8fafc] dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
            <h3 className="font-serif text-xs font-bold text-slate-800 dark:text-slate-200">
              Assigned Pathway: <span className="text-primary-750 dark:text-[#38bdf8] font-bold">{currentUser.prog}</span>
            </h3>
            <p className="text-[10.5px] text-text-secondary">
              Index: <span className="font-mono font-semibold">{currentUser.indexNum}</span> • Group: <span className="font-semibold">{studentGroupObj?.name || 'Unassigned team'}</span> • Academic Year Level: <span className="font-semibold">{currentUser.level}</span>
            </p>
          </div>
          {studentGroupObj && (
            <div className="text-[10px] bg-indigo-50 border border-indigo-150 px-3 py-1.5 rounded-lg text-indigo-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-600" />
              <span>Coursework submits as <span className="font-bold">Group Milestones</span> for <span className="font-semibold">{studentGroupObj.name}</span></span>
            </div>
          )}
        </div>
      )}

      {/* MOODLE-STYLE INNER NAVIGATION BAR */}
      <div className="flex flex-wrap border-b border-border space-x-1">
        <button 
          id="moodle-tab-materials"
          onClick={() => { setMoodleTab('materials'); setActiveMoodleCwId(null); }}
          className={`px-4.5 py-3 text-xs font-semibold border-b-2 transition ${
            moodleTab === 'materials' 
              ? 'border-primary-550 text-primary-900 dark:text-[#38bdf8] font-bold' 
              : 'border-transparent text-text-muted hover:text-text-primary'
          }`}
        >
          <Book className="w-3.5 h-3.5 inline mr-1.5 text-blue-600" />
          Course Materials ({courseMaterials ? courseMaterials.length : 0})
        </button>

        <button 
          id="moodle-tab-assignments"
          onClick={() => { setMoodleTab('assignments'); }}
          className={`px-4.5 py-3 text-xs font-semibold border-b-2 transition relative ${
            moodleTab === 'assignments' 
              ? 'border-primary-550 text-primary-900 dark:text-[#38bdf8] font-bold' 
              : 'border-transparent text-text-muted hover:text-text-primary'
          }`}
        >
          <ClipboardList className="w-3.5 h-3.5 inline mr-1.5" />
          {isFaculty ? "Course Works & Assignments" : "Syllabus Milestones & Tasks"}
          {isStudent && courseworks.filter(cw => !cw.submissions.some(s => s.studentId === currentUser?.id || (s.groupId && s.groupId === currentUser?.groupId))).length > 0 && (
            <span className="ml-1.5 bg-red-500 text-white font-bold rounded-full text-[8px] px-1.5 py-0.5">
              {courseworks.filter(cw => !cw.submissions.some(s => s.studentId === currentUser?.id || (s.groupId && s.groupId === currentUser?.groupId))).length}
            </span>
          )}
        </button>

        <button 
          id="moodle-tab-quizzes"
          onClick={() => { setMoodleTab('quizzes'); setActiveMoodleCwId(null); }}
          className={`px-4.5 py-3 text-xs font-semibold border-b-2 transition relative ${
            moodleTab === 'quizzes' 
              ? 'border-primary-550 text-primary-900 dark:text-[#38bdf8] font-bold' 
              : 'border-transparent text-text-muted hover:text-text-primary'
          }`}
        >
          <HelpCircle className="w-3.5 h-3.5 inline mr-1.5 text-indigo-600" />
          Quizzes & Assessments ({quizzes ? quizzes.length : 0})
        </button>

        <button 
          id="moodle-tab-courses"
          onClick={() => { setMoodleTab('courses'); setActiveMoodleCwId(null); }}
          className={`px-4.5 py-3 text-xs font-semibold border-b-2 transition ${
            moodleTab === 'courses' 
              ? 'border-primary-550 text-primary-900 dark:text-[#38bdf8] font-bold' 
              : 'border-transparent text-text-muted hover:text-text-primary'
          }`}
        >
          <GraduationCap className="w-3.5 h-3.5 inline mr-1.5 text-emerald-600" />
          {isFaculty ? "Assigned Courses" : "My Enrolled Courses"}
        </button>

        <button 
          id="moodle-tab-syllabus"
          onClick={() => { setMoodleTab('syllabus'); setActiveMoodleCwId(null); }}
          className={`px-4.5 py-3 text-xs font-semibold border-b-2 transition ${
            moodleTab === 'syllabus' 
              ? 'border-primary-550 text-primary-900 dark:text-[#38bdf8] font-bold' 
              : 'border-transparent text-text-muted hover:text-text-primary'
          }`}
        >
          <Users className="w-3.5 h-3.5 inline mr-1.5 text-indigo-650" />
          Class Groups
        </button>

        {isStudent && (
          <button 
            id="moodle-tab-my-submissions"
            onClick={() => { setMoodleTab('my_submissions'); setActiveMoodleCwId(null); }}
            className={`px-4.5 py-3 text-xs font-semibold border-b-2 transition relative ${
              moodleTab === 'my_submissions' 
                ? 'border-primary-550 text-primary-900 dark:text-[#38bdf8] font-bold' 
                : 'border-transparent text-text-muted hover:text-text-primary'
            }`}
          >
            <Inbox className="w-3.5 h-3.5 inline mr-1.5" />
            My Submissions & Receipts
          </button>
        )}

        {isFaculty && (
          <button 
            id="moodle-tab-review-queue"
            onClick={() => { setMoodleTab('review_queue'); setActiveMoodleCwId(null); }}
            className={`px-4.5 py-3 text-xs font-semibold border-b-2 transition relative ${
              moodleTab === 'review_queue' 
                ? 'border-primary-550 text-primary-900 dark:text-[#38bdf8] font-bold' 
                : 'border-transparent text-text-muted hover:text-text-primary'
            }`}
          >
            <Inbox className="w-3.5 h-3.5 inline mr-1.5 text-amber-500" />
            Evaluation Queue & Grading Inbox
            {courseworks.reduce((acc, cw) => acc + cw.submissions.filter(s => s.status === 'submitted').length, 0) > 0 && (
              <span className="ml-1.5 bg-amber-500 text-white font-bold rounded-full text-[8px] px-1.5 py-0.5">
                {courseworks.reduce((acc, cw) => acc + cw.submissions.filter(s => s.status === 'submitted').length, 0)}
              </span>
            )}
          </button>
        )}

        <button 
          id="moodle-tab-gradebook"
          onClick={() => { setMoodleTab('gradebook'); setActiveMoodleCwId(null); }}
          className={`px-4.5 py-3 text-xs font-semibold border-b-2 transition ${
            moodleTab === 'gradebook' 
              ? 'border-primary-550 text-primary-900 dark:text-[#38bdf8] font-bold' 
              : 'border-transparent text-text-muted hover:text-text-primary'
          }`}
        >
          <Award className="w-3.5 h-3.5 inline mr-1.5" />
          {isFaculty ? "Grades" : "Gradebook"}
        </button>

      </div>

      {/* 1. COURSE MATERIALS TAB */}
      {moodleTab === 'materials' && (
        <div className="space-y-6 animate-fade-in text-left">
          <div className="bg-surface p-5 rounded-xl border border-border shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="font-serif text-sm font-bold text-text-primary flex items-center gap-2">
                <Book className="w-4 h-4 text-blue-600" />
                Course Materials & Academic Resources
              </h2>
              <p className="text-xs text-text-secondary mt-1">
                Access lecture slides, reading materials, syllabi, and reference guidelines uploaded by course lecturers.
              </p>
            </div>
            {(isFaculty || isAdmin) && (
              <button
                onClick={() => {
                  if (courses.length > 0) setMaterialCourseId(courses[0].id);
                  setShowUploadMaterialModal(true);
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-xs flex items-center space-x-1.5 transition shrink-0 cursor-pointer shadow-xs"
              >
                <Upload className="w-4 h-4" />
                <span>Upload Course Material</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(!courseMaterials || courseMaterials.length === 0) ? (
              <div className="col-span-full text-center py-12 border border-dashed border-border rounded-xl text-text-muted space-y-2">
                <Book className="w-10 h-10 mx-auto text-slate-300" />
                <p className="font-bold text-xs">No Course Materials Uploaded Yet</p>
                <p className="text-[11px]">Lecturers will upload course syllabus, slides, and notes here.</p>
              </div>
            ) : (
              courseMaterials.map(mat => (
                <div key={mat.id} className="bg-surface p-4 rounded-xl border border-border shadow-xs hover:border-blue-400 transition space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex justify-between items-start gap-2">
                      <span className="font-mono text-[10px] font-bold px-2 py-0.5 bg-blue-50 text-blue-700 rounded border border-blue-200 uppercase">
                        {mat.courseCode}
                      </span>
                      <span className="text-[9px] text-text-muted font-mono">{mat.fileSize}</span>
                    </div>
                    <h3 className="font-serif text-sm font-bold text-text-primary leading-snug">{mat.title}</h3>
                    <p className="text-xs text-text-secondary line-clamp-2">{mat.description || 'Lecture resources and study notes.'}</p>
                  </div>
                  <div className="pt-3 border-t border-border flex items-center justify-between">
                    <div className="text-[10px] text-text-muted">
                      <span>Uploaded by {mat.uploadedBy}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => alert(`Downloading "${mat.fileName}" (${mat.fileSize})...`)}
                        className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded font-bold text-[10px] flex items-center space-x-1 transition cursor-pointer"
                      >
                        <Download className="w-3 h-3" />
                        <span>Download</span>
                      </button>
                      {(isFaculty || isAdmin) && (
                        <button
                          onClick={() => {
                            if (confirm('Delete this course material?')) deleteCourseMaterial(mat.id);
                          }}
                          className="p-1 text-red-500 hover:bg-red-50 rounded transition cursor-pointer"
                          title="Delete Material"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* 2. QUIZZES & ASSESSMENTS TAB - REDIRECT BANNER */}
      {moodleTab === 'quizzes' && (
        <div className="space-y-6 animate-fade-in text-left">
          <div className="bg-indigo-50 border border-indigo-200 p-6 rounded-xl shadow-xs text-indigo-950 space-y-4">
            <div className="flex items-start space-x-3">
              <div className="p-2.5 bg-indigo-600 text-white rounded-lg">
                <HelpCircle className="w-6 h-6" />
              </div>
              <div>
                <h2 className="font-serif text-base font-bold text-indigo-900">
                  Dedicated Quizzes & Assessments Page
                </h2>
                <p className="text-xs text-indigo-800 mt-1 leading-relaxed">
                  Quizzes and timed knowledge tests have been separated into a dedicated page with automated timers, interactive question builders, and immediate test score breakdowns.
                </p>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => {
                  const evt = new CustomEvent('navigate-page', { detail: 'quizzes' });
                  window.dispatchEvent(evt);
                }}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold text-xs flex items-center space-x-2 transition cursor-pointer shadow-xs"
              >
                <span>Go to Quizzes & Tests Page</span>
                <ChevronRight className="w-4 h-4" />
              </button>
              
              <span className="text-[11px] text-indigo-700 font-mono">
                {quizzes ? quizzes.length : 0} Active Quizzes Available
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 3. ENROLLED COURSES TAB */}
      {moodleTab === 'courses' && (
        <div className="space-y-6 animate-fade-in text-left">
          <div className="bg-surface p-5 rounded-xl border border-border shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="font-serif text-sm font-bold text-text-primary flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-emerald-600" />
                {isFaculty ? "Assigned Academic Courses" : "Enrolled Course List"}
              </h2>
              <p className="text-xs text-text-secondary mt-1">
                {isFaculty 
                  ? "Courses assigned to you for lecturing, coursework management, and student grading."
                  : "Courses you are officially registered into for the current academic session."
                }
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(!courses || courses.length === 0) ? (
              <div className="col-span-full text-center py-12 border border-dashed border-border rounded-xl text-text-muted space-y-2">
                <GraduationCap className="w-10 h-10 mx-auto text-slate-300" />
                <p className="font-bold text-xs">No Enrolled Courses Found</p>
                <p className="text-[11px]">Contact your Head of Department (HOD) for course enrollment.</p>
              </div>
            ) : (
              courses.map(crs => (
                <div key={crs.id} className="bg-surface p-5 rounded-xl border border-border shadow-xs hover:border-emerald-400 transition space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-mono text-[10px] font-bold px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded border border-emerald-200 uppercase">
                        {crs.code}
                      </span>
                      <span className="font-mono text-[10px] font-bold text-text-muted">LEVEL {crs.level}</span>
                    </div>
                    <h3 className="font-serif text-sm font-bold text-text-primary">{crs.name}</h3>
                    <p className="text-[11px] text-text-secondary">{crs.dept} — {crs.programme}</p>
                  </div>

                  <div className="pt-3 border-t border-border space-y-2 text-xs">
                    <div className="flex items-center justify-between text-text-muted">
                      <span>Lecturer:</span>
                      <span className="font-bold text-text-primary">{crs.lecturerName || 'Unassigned'}</span>
                    </div>
                    <div className="flex items-center justify-between text-text-muted">
                      <span>Enrolled Students:</span>
                      <span className="font-mono font-bold text-indigo-700">{(crs.enrolledStudents || []).length}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* SYLLABUS HOMEPAGE BLOCK (MOODLE TOPIC CHANNELS) */}
      {moodleTab === 'syllabus' && !activeMoodleCwId && (
        isFaculty ? (
          /* COURSE GROUPS LEDGER FOR FACULTY (tab: Course Groups) */
          <div className="space-y-6">
            <div className="bg-[#f8fafc] dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 text-left">
              <div className="space-y-2">
                <h2 id="ledger-title" className="font-serif text-sm font-bold text-primary-950 dark:text-slate-100">
                  Course Groups Ledger
                </h2>
                <p className="text-text-secondary leading-relaxed text-xs">
                  Observe registration bounds, assigned course lecturers, coursework definitions, and submission progress across active student cohorts.
                </p>
              </div>
              <button
                id="btn-trigger-new-group"
                onClick={() => setShowCreateGroupForm(!showCreateGroupForm)}
                className="self-start md:self-center bg-[#4f46e5] hover:bg-[#4338ca] text-white text-xs font-semibold px-4 py-2.5 rounded-lg shadow-sm transition-all inline-flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-[#4f46e5]"
              >
                <Plus className="w-4 h-4" />
                {showCreateGroupForm ? 'Close Group Form' : 'New Group'}
              </button>
            </div>

            {showCreateGroupForm && (
              <div id="new-group-creation-panel" className="bg-white dark:bg-slate-900 border border-[#e2e8f0] dark:border-slate-800 rounded-xl p-6 shadow-md text-left transition-all duration-300">
                <h3 className="text-sm font-bold font-serif text-slate-800 dark:text-slate-100 pb-3 border-b border-border/80 mb-5 flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#4f46e5]" />
                  Create New Class Study Group
                </h3>

                <form onSubmit={handleCreateGroupSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Target Course dropdown */}
                    <div className="space-y-1.5 md:col-span-2">
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                        <span>Target Course for Group *</span>
                        <span className="text-[10px] text-indigo-600 font-mono font-bold">Lecturer Course Association</span>
                      </label>
                      <select
                        id="new-group-course-select"
                        value={newGroupCourseId}
                        onChange={(e) => {
                          const selectedId = e.target.value;
                          setNewGroupCourseId(selectedId);
                          const matched = courses.find(c => c.id === selectedId);
                          if (matched) {
                            setNewGroupCourseCode(matched.code);
                            setNewGroupCourseName(matched.name);
                            if (matched.programme) setNewGroupProg(matched.programme);
                            if (matched.level) setNewGroupLevel(matched.level);
                            if (matched.dept) setNewGroupDept(matched.dept);
                          }
                        }}
                        className="w-full text-xs p-2.5 border border-indigo-200 dark:border-indigo-800 rounded-lg bg-indigo-50/50 dark:bg-slate-800 font-medium focus:bg-white focus:ring-1 focus:ring-indigo-600 outline-none"
                      >
                        <option value="">-- Select Target Course --</option>
                        {courses.map(c => (
                          <option key={c.id} value={c.id}>
                            {c.code} — {c.name} ({c.programme})
                          </option>
                        ))}
                      </select>
                      <p className="text-[10.5px] text-text-muted">
                        Groups created here are associated specifically with <strong>{newGroupCourseCode || 'the selected course'}</strong>. During setting of coursework, group assignments for this course will use these groups.
                      </p>
                    </div>

                    {/* Group Name input */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Group Name
                      </label>
                      <input
                        id="new-group-name"
                        type="text"
                        required
                        value={newGroupName}
                        onChange={(e) => setNewGroupName(e.target.value)}
                        placeholder="e.g. Team Gamma, Group 4"
                        className="w-full text-xs p-2.5 border border-border rounded-lg bg-slate-50 dark:bg-slate-800 focus:bg-white focus:ring-1 focus:ring-[#4f46e5] focus:border-[#4f46e5] outline-none"
                      />
                    </div>

                    {/* Department drop down */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Department
                      </label>
                      <select
                        id="new-group-dept"
                        value={newGroupDept}
                        onChange={(e) => {
                          setNewGroupDept(e.target.value);
                          // select first programme in that dept if possible
                          const matchedProg = programmes.find(p => p.deptName === e.target.value || p.deptId === e.target.value);
                          if (matchedProg) {
                            setNewGroupProg(matchedProg.name);
                          }
                        }}
                        className="w-full text-xs p-2.5 border border-border rounded-lg bg-slate-50 dark:bg-slate-805 focus:bg-white focus:ring-1 focus:ring-[#4f46e5] focus:border-[#4f46e5] outline-none"
                      >
                        {departments.map(dept => (
                          <option key={dept.id} value={dept.name}>{dept.name}</option>
                        ))}
                      </select>
                    </div>

                    {/* Programme select */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Academic Programme
                      </label>
                      <select
                        id="new-group-prog"
                        value={newGroupProg}
                        onChange={(e) => setNewGroupProg(e.target.value)}
                        className="w-full text-xs p-2.5 border border-border rounded-lg bg-slate-50 dark:bg-slate-806 focus:bg-white focus:ring-1 focus:ring-[#4f46e5] focus:border-[#4f46e5] outline-none"
                      >
                        {programmes.map(prog => (
                          <option key={prog.id} value={prog.name}>{prog.name}</option>
                        ))}
                      </select>
                    </div>

                    {/* Class level select */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Academic Level
                      </label>
                      <select
                        id="new-group-level"
                        value={newGroupLevel}
                        onChange={(e) => setNewGroupLevel(e.target.value)}
                        className="w-full text-xs p-2.5 border border-border rounded-lg bg-slate-50 dark:bg-slate-807 focus:bg-white focus:ring-1 focus:ring-[#4f46e5] focus:border-[#4f46e5] outline-none"
                      >
                        <option value="100">Level 100</option>
                        <option value="200">Level 200</option>
                        <option value="300">Level 300</option>
                        <option value="400">Level 400</option>
                      </select>
                    </div>

                    {/* Capacity and Supervisor Selection */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Maximum Capacity
                      </label>
                      <input
                        id="new-group-capacity"
                        type="number"
                        min="1"
                        max="10"
                        required
                        value={newGroupCapacity}
                        onChange={(e) => setNewGroupCapacity(e.target.value)}
                        className="w-full text-xs p-2.5 border border-border rounded-lg bg-slate-50 dark:bg-slate-808 focus:bg-white focus:ring-1 focus:ring-[#4f46e5] focus:border-[#4f46e5] outline-none"
                      />
                    </div>


                  </div>

                  {/* Student Members Checklist */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="block text-[11px] font-semibold text-slate-750 dark:text-slate-305">
                        Select Group Members (Students)
                      </label>
                      <span className="font-mono text-[10px] text-text-muted">
                        Unassigned students are shown. Selected: {newGroupMembers.length}
                      </span>
                    </div>

                    <div className="max-h-48 overflow-y-auto border border-border rounded-lg bg-slate-50/50 dark:bg-slate-800/20 p-3 divide-y divide-border/60">
                      {users.filter(u => u.role === 'student' && (!u.groupId || u.groupId === '')).length > 0 ? (
                        users.filter(u => u.role === 'student' && (!u.groupId || u.groupId === '')).map(student => (
                          <label key={student.id} className="flex items-center py-2 hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer text-xs select-none">
                            <input
                              type="checkbox"
                              checked={newGroupMembers.includes(student.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setNewGroupMembers([...newGroupMembers, student.id]);
                                } else {
                                  setNewGroupMembers(newGroupMembers.filter(id => id !== student.id));
                                  if (newGroupLeadId === student.id) {
                                    setNewGroupLeadId('');
                                  }
                                }
                              }}
                              className="mr-3 rounded border-gray-300 text-[#4f46e5] focus:ring-[#4f46e5] h-4 w-4"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-slate-900 dark:text-slate-100 truncate">{student.name}</p>
                              <p className="font-mono text-[10px] text-text-muted">Index {student.indexNum} — {student.prog}</p>
                            </div>
                          </label>
                        ))
                      ) : (
                        <div className="py-4 text-center text-text-muted italic text-[11px]">
                          All registered students are already assigned to existing groups.
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Group Lead selection */}
                  {newGroupMembers.length > 0 && (
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-305">
                        Designate Group Leader
                      </label>
                      <select
                        id="new-group-lead"
                        required
                        value={newGroupLeadId}
                        onChange={(e) => setNewGroupLeadId(e.target.value)}
                        className="w-full text-xs p-2.5 border border-border rounded-lg bg-slate-50 dark:bg-slate-810 focus:bg-white focus:ring-1 focus:ring-[#4f46e5] focus:border-[#4f46e5] outline-none"
                      >
                        <option value="">-- Choose Leader --</option>
                        {newGroupMembers.map(id => {
                          const student = users.find(u => u.id === id);
                          return (
                            <option key={id} value={id}>
                              {student ? student.name : id}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  )}

                  <div className="pt-3 border-t border-border flex justify-end gap-3">
                    <button
                      id="btn-cancel-group"
                      type="button"
                      onClick={() => {
                        setShowCreateGroupForm(false);
                        resetGroupForm();
                      }}
                      className="px-4 py-2 border border-border rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-50 hover:dark:bg-slate-700/60 transition"
                    >
                      Cancel
                    </button>
                    <button
                      id="btn-save-group"
                      type="submit"
                      className="px-4 py-2 rounded-lg bg-[#4f46e5] hover:bg-[#4338ca] text-white text-xs font-semibold shadow-xs transition"
                    >
                      Create Group
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Filter by Course Toolbar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-xl border border-border/80 text-left">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="font-bold text-text-secondary uppercase text-[10.5px]">Filter Groups by Course:</span>
                <select
                  value={groupCourseFilter}
                  onChange={(e) => setGroupCourseFilter(e.target.value)}
                  className="p-1.5 bg-white dark:bg-slate-800 border border-border rounded-lg text-xs font-semibold outline-none focus:ring-1 focus:ring-indigo-600"
                >
                  <option value="all">All Courses ({groups.length} Groups)</option>
                  {courses.map(c => (
                    <option key={c.id} value={c.code}>
                      {c.code} — {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <span className="text-[11px] font-mono text-text-muted">
                Showing {groups.filter(g => groupCourseFilter === 'all' || (g.courseCode && g.courseCode.toLowerCase() === groupCourseFilter.toLowerCase()) || (g.courseId && g.courseId === groupCourseFilter)).length} of {groups.length} Groups
              </span>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 text-left">
              {groups.filter(g => groupCourseFilter === 'all' || (g.courseCode && g.courseCode.toLowerCase() === groupCourseFilter.toLowerCase()) || (g.courseId && g.courseId === groupCourseFilter)).map(group => {
                // Find supervisor
                const supervisor = users.find(u => u.id === group.supervisorId);
                // Find members
                const groupMembers = users.filter(u => group.members.includes(u.id));
                // Find milestones
                const groupMilestones = milestones.filter(m => m.groupId === group.id);

                return (
                  <div key={group.id} className="bg-white dark:bg-slate-900 border border-border rounded-xl p-5 shadow-sm space-y-5 flex flex-col justify-between">
                    <div className="space-y-4">
                      {/* Header */}
                      <div className="flex justify-between items-start pb-3 border-b border-border/80">
                        <div className="space-y-1.5">
                          <div className="flex flex-wrap gap-1.5 items-center">
                            <span className="font-mono text-[9px] font-bold text-[#4338ca] bg-indigo-50 border border-indigo-150 px-2 py-0.5 rounded uppercase">
                              {group.name} — {group.programme}
                            </span>
                            {group.courseCode && (
                              <span className="font-mono text-[9px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded uppercase">
                                📚 Course: {group.courseCode}
                              </span>
                            )}
                          </div>
                          <h3 className="font-serif text-sm font-bold text-slate-900 dark:text-slate-100 mt-2">
                            {group.project}
                          </h3>
                        </div>
                        <span className="bg-emerald-50 text-emerald-805 text-[9px] font-mono font-bold px-2 py-0.5 border border-emerald-150 rounded uppercase pb-1">
                          {group.status}
                        </span>
                      </div>

                      {/* Members & Supervisor details */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                        <div className="space-y-2">
                          <h5 className="font-bold text-text-muted text-[10px] uppercase tracking-wider">Group Cohort:</h5>
                          <div className="space-y-2">
                            {groupMembers.map(m => (
                              <div key={m.id} className="flex items-center space-x-2 bg-[#f8fafc] dark:bg-slate-800 p-2 border border-border rounded-lg">
                                <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-[10px] shrink-0">
                                  {m.name.charAt(0)}
                                </div>
                                <div className="truncate">
                                  <div className="font-semibold text-slate-800 dark:text-slate-200 truncate">{m.name}</div>
                                  <div className="font-mono text-[9.5px] text-text-muted text-left truncate">
                                    {m.indexNum} {m.isLead && <span className="text-[#a21caf] font-bold">(Lead)</span>}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <h5 className="font-bold text-text-muted text-[10px] uppercase tracking-wider">Academic Supervisor:</h5>
                          {supervisor ? (
                            <div className="bg-[#f8fafc] dark:bg-slate-800 p-3 border border-border rounded-xl space-y-1 text-[10.5px]">
                              <div className="font-semibold text-slate-900 dark:text-slate-100 text-left">{supervisor.name}</div>
                              <div className="text-[10px] text-text-secondary text-left">{supervisor.dept} Department</div>
                              <div className="font-mono text-[9.5px] text-text-muted text-left">{supervisor.email}</div>
                            </div>
                          ) : (
                            <div className="bg-amber-50 text-amber-850 p-3 border border-amber-150 rounded-xl italic">
                              No academic supervisor assigned.
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Milestones progression */}
                    <div className="space-y-2.5 pt-3.5 border-t border-border/60 mt-4">
                      <h5 className="font-bold text-text-muted text-[10px] uppercase tracking-wider">Milestone Status:</h5>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {groupMilestones.map(m => (
                          <div key={m.id} className="bg-slate-50 dark:bg-slate-805 p-2.5 border border-border rounded-lg flex flex-col justify-between h-14">
                            <span className="truncate font-serif font-bold text-[10px] text-slate-850 dark:text-slate-200 text-left" title={m.title}>{m.title}</span>
                            <span className={`self-start text-[8.5px] font-mono font-bold px-1.5 py-0.2 rounded uppercase ${
                              m.status === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                              m.status === 'review' ? 'bg-indigo-50 text-indigo-850 animate-pulse' :
                              'bg-slate-200 text-slate-650'
                            }`}>
                              {m.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            
            {/* COURSE LEFT DIRECTIVE BAR */}
            <div className="lg:col-span-1 space-y-4">
              <div className="bg-white dark:bg-slate-900 border border-border rounded-xl p-4 shadow-xs">
                <h4 className="font-serif font-bold text-xs text-primary-900 dark:text-slate-100 pb-2 border-b border-border">
                  Course Administration
                </h4>
                <ul className="mt-3 space-y-2.5 text-text-secondary">
                  <li className="flex items-center gap-2 hover:text-primary-850 cursor-pointer">
                    <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                    <span>Syllabus Overview</span>
                  </li>
                  <li className="flex items-center gap-2 hover:text-primary-850 cursor-pointer">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    <span>List Participants</span>
                  </li>
                  <li className="flex items-center gap-2 hover:text-primary-850 cursor-pointer">
                    <CheckSquare className="w-3.5 h-3.5 text-slate-400" />
                    <span>Competencies</span>
                  </li>
                  <li className="flex items-center gap-2 hover:text-primary-850 cursor-pointer">
                    <BarChart2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>Course Metrics Report</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white dark:bg-slate-900 border border-border rounded-xl p-4 shadow-xs space-y-3">
                <h4 className="font-serif font-bold text-xs text-primary-900 dark:text-slate-100 pb-1.5 border-b border-border">
                  Coursework Assessment Schedule
                </h4>
                <p className="text-[10.5px] text-text-muted leading-relaxed">
                  Lecturers assign coursework tasks directly onto academic course modules. Submitting tasks auto-logs records under your student gradebook.
                </p>
                {isStudent && studentGroupObj && (
                  <div className="space-y-2 pt-1 font-mono text-[10px]">
                    {milestones.filter(m => m.groupId === studentGroupObj.id).map(m => (
                      <div key={m.id} className="flex justify-between items-center text-[10.5px]">
                        <span className="truncate max-w-[120px] text-text-secondary">{m.title}</span>
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${
                          m.status === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                          m.status === 'review' ? 'bg-indigo-150 text-indigo-805' :
                          'bg-amber-105 text-amber-800'
                        }`}>
                          {m.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* SYLLABUS TOPIC STREAM */}
            <div className="lg:col-span-3 space-y-6">
              
              <div className="bg-[#f0f9ff] text-[#0369a1] border border-[#bae6fd] rounded-xl p-4 text-[11px] leading-relaxed flex gap-3">
                <HelpCircle className="w-6 h-6 stroke-2 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Instructor Directives</p>
                  <p className="mt-1">
                    Welcome to the course evaluation workspace. Here, you can access course materials, submit assignment solutions, and complete interactive quizzes. Ensure all submitted files follow instructor formatting guidelines.
                  </p>
                </div>
              </div>

              {/* LIST OF WEEKLY / TOPICAL BLOCKS */}
              {MOODLE_TOPICS.map(topic => {
                // Find courseworks linked to this level or programme
                const topicAssignments = courseworks.filter(cw => {
                  if (isStudent) {
                    return cw.programme === currentUser?.prog && String(cw.level) === String(currentUser?.level);
                  }
                  return true; // Faculty sees all
                });

                return (
                  <div key={topic.id} className="bg-white dark:bg-slate-900 border border-border rounded-xl p-5 space-y-4 shadow-sm animate-fade-in">
                    <div className="pb-2 border-b border-border/80 text-left">
                      <h3 className="text-sm font-serif font-bold text-slate-900 dark:text-slate-100">
                        {topic.name}
                      </h3>
                      <p className="text-[11px] text-text-secondary mt-1 leading-relaxed font-sans">
                        {topic.description}
                      </p>
                    </div>

                    {/* TOPIC READING MATERIALS */}
                    <div className="space-y-2 text-left">
                      <h5 className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
                        Reading Materials & Reference Manuals:
                      </h5>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {topic.resources.map(res => (
                          <div key={res.id} className="flex justify-between items-center bg-[#f8fafc] dark:bg-slate-800 hover:bg-[#f1f5f9] border border-border/70 p-2.5 rounded-lg text-[10.5px] transition duration-150">
                            <span className="flex items-center gap-2 truncate text-slate-700 dark:text-slate-350 font-semibold">
                              <FileText className="w-3.5 h-3.5 text-red-500 shrink-0" />
                              <span className="truncate">{res.title}</span>
                            </span>
                            <span className="text-[9.5px] text-text-muted shrink-0 flex items-center gap-1 font-mono">
                              {res.size}
                              <Download className="w-3 h-3 text-slate-400" />
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* ACTIVE HOMEWORKS OR TASKS INSIDE THIS TOPIC */}
                    <div className="space-y-2 pt-2 text-left">
                      <h5 className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
                        Assessments & Assigned Milestones:
                      </h5>
                      {topicAssignments.length === 0 ? (
                        <p className="text-[11px] text-text-muted italic">No active milestones assigned at your degree level.</p>
                      ) : (
                        <div className="space-y-2.5">
                          {topicAssignments.map(cw => {
                            const hasGroupSubmitted = cw.isGroupSubmission && studentGroupObj && cw.submissions.some(s => s.groupId === studentGroupObj.id);
                            const hasUserSubmitted = cw.submissions.some(s => s.studentId === currentUser?.id);
                            const isSubmitted = hasGroupSubmitted || hasUserSubmitted;

                            const matchingSub = cw.submissions.find(s => 
                              cw.isGroupSubmission && studentGroupObj ? s.groupId === studentGroupObj.id : s.studentId === currentUser?.id
                            );
                            const isGraded = matchingSub && matchingSub.status === 'graded';

                            return (
                              <div 
                                key={cw.id} 
                                onClick={() => { setActiveMoodleCwId(cw.id); setMoodleTab('assignments'); }}
                                className="group border border-slate-150 hover:bg-slate-50/50 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 p-3.5 rounded-xl cursor-pointer transition flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3"
                              >
                                <div className="space-y-1">
                                  <div className="flex items-center space-x-2">
                                    <span className="bg-primary-50 text-primary-750 font-mono text-[9px] font-bold px-1.5 py-0.5 rounded border border-primary-100 uppercase">
                                      {cw.courseCode}
                                    </span>
                                    <h4 className="font-serif font-bold text-slate-900 group-hover:text-primary-850 dark:text-slate-100 text-xs text-left">
                                      {cw.title}
                                    </h4>
                                  </div>
                                  <p className="text-[10.5px] text-text-secondary line-clamp-1 text-left">
                                    {cw.description}
                                  </p>
                                </div>

                                <div className="flex items-center space-x-2 shrink-0">
                                  {isSubmitted ? (
                                    isGraded ? (
                                      <span className="bg-emerald-50 text-emerald-805 font-semibold text-[10px] px-2.5 py-1 rounded-lg border border-emerald-150 flex items-center gap-1.5">
                                        <CheckCircle className="w-3.5 h-3.5" />
                                        Graded: {matchingSub.grade}/{cw.points}
                                      </span>
                                    ) : (
                                      <span className="bg-indigo-50 text-indigo-705 font-semibold text-[10px] px-2.5 py-1 rounded-lg border border-indigo-150 flex items-center gap-1.5">
                                        <Clock className="w-3.5 h-3.5" />
                                        Under Review
                                      </span>
                                    )
                                  ) : (
                                    <span className="bg-amber-50 text-amber-805 font-semibold text-[10px] px-2.5 py-1 rounded-lg border border-amber-150 flex items-center gap-1.5 animate-pulse">
                                      <AlertCircle className="w-3.5 h-3.5" />
                                      Submit
                                    </span>
                                  )}
                                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition" />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )
      )}

      {/* ALL ASSIGNMENTS TAB / DIRECT DETAILED VIEWS */}
      {moodleTab === 'assignments' && (
        <div className="space-y-6">
          
          {!activeMoodleCwId && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
              <div className="space-y-1 text-left">
                <h2 className="font-serif text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <ClipboardList className="w-5 h-5 text-indigo-650" />
                  Course Works Registry
                </h2>
                <p className="text-text-secondary text-[11px]">
                  Review syllabus coursework assignments, customize research milestones, and track student response pipelines.
                </p>
              </div>
              {isFaculty && (
                <button
                  id="btn-trigger-coursework-wizard"
                  onClick={() => {
                    setWizardCwStep(1);
                    setWizardCourseCode('');
                    setWizardCourseName('');
                    setWizardExtraMaterial('');
                    setWizardMilestones([]);
                    setMsTopic('');
                    setMsSubmissionType('file');
                    setMsStartDate('');
                    setMsDueDate('');
                    setShowCourseworkWizard(true);
                  }}
                  className="bg-black hover:bg-slate-900 text-white text-xs font-semibold px-4 py-2.5 rounded-lg shadow-sm transition-all inline-flex items-center gap-1.5 shrink-0 focus:outline-none focus:ring-2 focus:ring-black"
                >
                  <Plus className="w-4 h-4" />
                  New course Work
                </button>
              )}
            </div>
          )}

          {/* SEARCH FILTERS SECTION */}
          {!activeMoodleCwId && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white dark:bg-slate-900 border border-border rounded-xl p-4 shadow-sm">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-text-muted" />
                <input 
                  type="text" 
                  placeholder="Search syllabus tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 h-9 bg-surface border border-border rounded-lg outline-none text-xs text-text-primary"
                />
              </div>

              <div>
                <select 
                  value={filterProgramme}
                  onChange={(e) => setFilterProgramme(e.target.value)}
                  className="w-full h-9 bg-surface border border-border rounded-lg outline-none text-xs text-text-primary px-2 font-sans"
                >
                  <option value="all">Syllabus: All Programmes</option>
                  <option value="BSc. Computer Science">BSc. Computer Science</option>
                  <option value="BSc. Software Engineering">BSc. Software Engineering</option>
                  <option value="BSc. Cyber Mathematics">BSc. Cyber Mathematics</option>
                </select>
              </div>

              <div>
                <select 
                  value={filterClass}
                  onChange={(e) => setFilterClass(e.target.value)}
                  className="w-full h-9 bg-surface border border-border rounded-lg outline-none text-xs text-[#1e293b] px-2 font-sans"
                >
                  <option value="all">Syllabus: All Accords</option>
                  <option value="assigned">Assigned Tasks Only</option>
                  <option value="graded">Graded / Feedback Ready</option>
                </select>
              </div>
            </div>
          )}

          {/* MAIN DYNAMIC LISTING */}
          {!activeMoodleCwId ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {courseworks
                .filter(cw => {
                  if (filterProgramme !== 'all' && cw.programme !== filterProgramme) return false;
                  
                  if (searchQuery) {
                    const match = cw.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                  cw.courseCode.toLowerCase().includes(searchQuery.toLowerCase());
                    if (!match) return false;
                  }

                  if (isStudent && filterClass === 'assigned') {
                    const submitted = cw.submissions.some(s => s.studentId === currentUser?.id || (s.groupId && s.groupId === currentUser?.groupId));
                    if (submitted) return false;
                  }

                  if (isStudent && filterClass === 'graded') {
                    const sub = cw.submissions.find(s => s.studentId === currentUser?.id || (s.groupId && s.groupId === currentUser?.groupId));
                    if (!sub || sub.status !== 'graded') return false;
                  }

                  return true;
                })
                .map(cw => {
                  const hasSub = cw.submissions.some(s => s.studentId === currentUser?.id || (s.groupId && s.groupId === currentUser?.groupId));
                  const isOverdue = new Date(cw.dueDate) < new Date() && !hasSub;

                  return (
                    <div 
                      key={cw.id}
                      onClick={() => setActiveMoodleCwId(cw.id)}
                      className="bg-white dark:bg-slate-900 border border-border hover:border-slate-350 dark:hover:border-slate-755 hover:shadow-xs transition duration-150 rounded-xl p-5 cursor-pointer flex flex-col justify-between space-y-4"
                    >
                      <div className="space-y-2">
                        <div className="flex justify-between items-start gap-2">
                          <span className="font-mono text-[9px] font-bold text-indigo-705 px-2 py-0.5 rounded bg-[#f1f5f9] dark:bg-slate-800 uppercase border border-slate-200 dark:border-slate-700">
                            {cw.courseCode} • {cw.courseName}
                          </span>
                          <span className="font-mono text-slate-400 font-bold text-[10px] shrink-0">
                            {cw.points} PTS
                          </span>
                        </div>
                        <h3 className="font-serif text-[13.5px] font-bold text-slate-800 dark:text-slate-105 leading-tight">
                          {cw.title}
                        </h3>
                        <p className="text-text-secondary text-[11px] leading-relaxed line-clamp-3">
                          {cw.description}
                        </p>
                      </div>

                      <div className="border-t border-border pt-3.5 space-y-2">
                        <div className="flex flex-wrap gap-2 text-[9.5px] font-mono">
                          {cw.isGroupSubmission ? (
                            <span className="bg-indigo-50 border border-indigo-150 text-indigo-750 px-2 py-0.5 rounded-md flex items-center gap-1 font-semibold">
                              <Users className="w-3 h-3 text-indigo-600" />
                              Group Milestone
                            </span>
                          ) : (
                            <span className="bg-[#f1f5f9] border border-border text-slate-600 px-2 py-0.5 rounded-md flex items-center gap-1 font-semibold">
                              Individual Submit
                            </span>
                          )}
                          <span className="bg-surface border border-border text-text-secondary px-2 py-0.5 rounded-md">
                            {cw.programme} ({cw.level} Level)
                          </span>
                        </div>

                        <div className="flex justify-between items-center pt-1.5">
                          <span className={`text-[10px] font-mono flex items-center gap-1 font-semibold ${isOverdue ? 'text-red-600' : 'text-text-muted'}`}>
                            <Calendar className="w-3.5 h-3.5 shrink-0" />
                            Due: {cw.dueDate} {isOverdue && '(OVERDUE)'}
                          </span>
                          <span className="text-[10px] font-bold text-primary-610 flex items-center gap-0.5">
                            Details & Submission
                            <ChevronRight className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          ) : (
            /* DETAILED SINGLE MOODLE SUBMISSION PAGE SYSTEM */
            (() => {
              const cw = courseworks.find(c => c.id === activeMoodleCwId);
              if (!cw) return <p>Task not found.</p>;

              if (isFaculty) {
                const isGroupTask = cw.isGroupSubmission;
                
                // Fetch eligible students or groups belonging to the selected cw's programme and level
                const eligibleEntities = isGroupTask 
                  ? groups.filter(g => g.prog === cw.programme && g.level === cw.level)
                  : users.filter(u => u.role === 'student' && u.prog === cw.programme && u.level === cw.level);

                // Stats calculations
                const totalEligible = eligibleEntities.length;
                const submittedList = eligibleEntities.filter(entity => 
                  cw.submissions.some(s => isGroupTask ? s.groupId === entity.id : s.studentId === entity.id)
                );
                const totalSubmitted = submittedList.length;
                const gradedList = eligibleEntities.filter(entity => {
                  const sub = cw.submissions.find(s => isGroupTask ? s.groupId === entity.id : s.studentId === entity.id);
                  return sub && sub.status === 'graded';
                });
                const totalGraded = gradedList.length;
                const totalPending = totalSubmitted - totalGraded;

                return (
                  <div className="space-y-6 max-w-4xl mx-auto text-left animate-fade-in">
                    {/* Header Controls */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <button 
                        onClick={() => setActiveMoodleCwId(null)}
                        className="flex items-center gap-1.5 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 px-4 py-2 rounded-xl font-bold transition duration-150 inline-flex"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        Back to course works
                      </button>

                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[9.5px] uppercase font-bold tracking-tight bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-lg text-slate-650 dark:text-slate-300">
                          {cw.courseCode} — {cw.courseName}
                        </span>
                        <span className="font-mono text-[9.5px] font-bold text-indigo-750 bg-indigo-50 border border-indigo-150 px-3 py-1.5 rounded-lg dark:bg-indigo-950/20 dark:border-indigo-900/50">
                          {cw.programme} ({cw.level} Level)
                        </span>
                      </div>
                    </div>

                    {/* Coursework Details Header */}
                    <div className="bg-white dark:bg-slate-900 border border-border rounded-xl p-5 shadow-sm space-y-4">
                      <div className="flex justify-between items-start gap-4 pb-3.5 border-b border-border">
                        <div className="space-y-1">
                          <span className="text-[10px] uppercase font-mono tracking-wider font-bold text-text-muted block">
                            {isGroupTask ? 'Group Milestone Coursework' : 'Individual Coursework Task'}
                          </span>
                          <h2 className="font-serif text-base font-bold text-slate-950 dark:text-slate-50 mt-1">
                            {cw.title}
                          </h2>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="block font-mono text-xs font-bold bg-[#f1f5f9] dark:bg-slate-800 text-slate-705 dark:text-slate-300 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
                            {cw.points} PTS MAX
                          </span>
                          <span className="block text-[9.5px] font-mono text-text-muted mt-1">
                            Due: {cw.dueDate}
                          </span>
                        </div>
                      </div>

                      <div className="text-text-secondary text-xs leading-relaxed space-y-1">
                        <p className="font-bold text-slate-800 dark:text-slate-205">Syllabus Task Directives:</p>
                        <p className="text-[11.5px] bg-[#f8fafc] dark:bg-slate-800/30 p-3.5 border border-border rounded-xl italic leading-relaxed text-text-primary whitespace-pre-wrap font-sans">
                          {cw.description}
                        </p>
                      </div>

                      {/* Header Statistics Dashboard Row */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                        <div className="bg-slate-50/50 dark:bg-slate-800/30 border border-border p-3 rounded-xl text-center space-y-0.5">
                          <span className="text-[10px] text-text-muted uppercase font-bold tracking-wider">Assigned Classes</span>
                          <p className="font-serif text-lg font-bold text-slate-850 dark:text-slate-100">{totalEligible} {isGroupTask ? 'Groups' : 'Students'}</p>
                        </div>
                        <div className="bg-slate-50/50 dark:bg-slate-800/30 border border-border p-3 rounded-xl text-center space-y-0.5">
                          <span className="text-[10px] text-text-muted uppercase font-bold tracking-wider">Submissions</span>
                          <p className="font-serif text-lg font-bold text-indigo-750 dark:text-indigo-400">{totalSubmitted}</p>
                        </div>
                        <div className="bg-slate-50/50 dark:bg-slate-800/30 border border-border p-3 rounded-xl text-center space-y-0.5">
                          <span className="text-[10px] text-text-muted uppercase font-bold tracking-wider">Graded Complete</span>
                          <p className="font-serif text-lg font-bold text-emerald-700 dark:text-emerald-400">{totalGraded}</p>
                        </div>
                        <div className="bg-slate-50/50 dark:bg-slate-800/30 border border-border p-3 rounded-xl text-center space-y-0.5">
                          <span className="text-[10px] text-text-muted uppercase font-bold tracking-wider">Pending Review</span>
                          <p className="font-serif text-lg font-bold text-amber-650 dark:text-amber-400">{totalPending}</p>
                        </div>
                      </div>
                    </div>

                    {/* Submissions List Pipe */}
                    <div className="space-y-4">
                      <h3 className="font-serif font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2 border-b border-border pb-2">
                        <ClipboardList className="w-5 h-5 text-indigo-650" />
                        Awaiting Assessment Pipe — {cw.programme}
                      </h3>

                      {totalEligible === 0 ? (
                        <div className="bg-white dark:bg-slate-900 border border-solid border-border rounded-xl p-8 text-center space-y-2">
                          <p className="text-text-muted italic text-xs">No active {isGroupTask ? 'groups' : 'students'} match the "{cw.programme}" programme at {cw.level} level.</p>
                          <p className="text-[10.5px] text-text-secondary">Please check coursework configurations or register matching classes.</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {eligibleEntities.map(entity => {
                            // Find matching submission block
                            const sub = cw.submissions.find(s => 
                              isGroupTask ? s.groupId === entity.id : s.studentId === entity.id
                            );
                            const hasSub = !!sub;
                            const isSubGraded = hasSub && sub.status === 'graded';

                            return (
                              <div 
                                key={entity.id}
                                className="bg-white dark:bg-slate-900 border border-border rounded-xl p-5 shadow-xs transition duration-150 hover:shadow-sm space-y-4 text-left"
                              >
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800/60 pb-3">
                                  <div className="space-y-1">
                                    <h4 className="font-serif font-bold text-slate-900 dark:text-slate-100 text-sm flex items-center gap-1.5">
                                      {isGroupTask ? (
                                        <Users className="w-4 h-4 text-indigo-600 shrink-0" />
                                      ) : (
                                        <User className="w-4 h-4 text-indigo-600 shrink-0" />
                                      )}
                                      {entity.name}
                                    </h4>
                                    <div className="flex items-center gap-2 text-[10px] font-mono text-text-muted">
                                      <span>ID/Index: {isGroupTask ? `Group ID: ${entity.id}` : entity.indexNum}</span>
                                      {isGroupTask && entity.members && (
                                        <>
                                          <span>•</span>
                                          <span>{entity.members.length} member(s)</span>
                                        </>
                                      )}
                                    </div>
                                  </div>

                                  <div className="shrink-0 flex items-center gap-2">
                                    {isSubGraded ? (
                                      <div className="flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-150 dark:border-emerald-900/40 px-3 py-1 rounded-lg">
                                        <CheckCircle className="w-4.5 h-4.5 text-emerald-650" />
                                        <span className="font-mono font-bold text-[11px] text-emerald-805 dark:text-emerald-300">
                                          GRADED: {sub.grade} / {cw.points} PTS
                                        </span>
                                      </div>
                                    ) : hasSub ? (
                                      <div className="flex items-center gap-1.5 bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-150 dark:border-indigo-900/40 px-3 py-1 rounded-lg">
                                        <Clock className="w-4.5 h-4.5 text-indigo-600" />
                                        <span className="font-mono font-bold text-[11px] text-indigo-750 dark:text-indigo-300">
                                          PENDING ASSESSMENT
                                        </span>
                                      </div>
                                    ) : (
                                      <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-1 rounded-lg">
                                        <AlertCircle className="w-4.5 h-4.5 text-slate-400" />
                                        <span className="font-mono font-bold text-[11px] text-slate-600 dark:text-slate-400">
                                          AWAITING RESPONSE
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </div>

                                {hasSub ? (
                                  <div className="space-y-3.5 pb-1">
                                    {/* Submitted artifact data */}
                                    <div className="space-y-1.5 text-left">
                                      <span className="text-[10px] uppercase font-mono font-bold text-text-muted tracking-wide block">Submitted Student Abstract & Findings:</span>
                                      <p className="bg-[#f8fafc] dark:bg-slate-800/40 p-3.5 border border-border rounded-xl text-[11.5px] text-text-primary leading-relaxed italic whitespace-pre-wrap font-sans">
                                        "{sub.text || 'No comments entered with submission.'}"
                                      </p>
                                    </div>

                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-800/20 p-3 border border-border rounded-xl text-left">
                                      <div className="flex items-center gap-2.5 min-w-0">
                                        <FileText className="w-5 h-5 text-indigo-650 shrink-0" />
                                        <div className="truncate text-left min-w-0">
                                          <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{sub.fileName}</p>
                                          <p className="text-[10px] text-text-muted font-mono">{sub.fileSize} • Submitted: {new Date(sub.submittedAt).toLocaleDateString()} {new Date(sub.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                        </div>
                                      </div>
                                      
                                      <button 
                                        type="button"
                                        onClick={() => alert(`Downloading student submitted resource: "${sub.fileName}"...`)}
                                        className="bg-white hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 border border-border text-slate-755 dark:text-slate-202 font-bold px-3 py-1.5 rounded-lg text-[10.5px] flex items-center gap-1.5 shrink-0 transition"
                                      >
                                        <Download className="w-3.5 h-3.5" />
                                        Download Artifact
                                      </button>
                                    </div>

                                    {isSubGraded && sub.feedback && (
                                      <div className="bg-emerald-50/30 dark:bg-emerald-950/10 border border-emerald-150/45 dark:border-emerald-900/30 p-3.5 rounded-xl space-y-1 text-left">
                                        <span className="text-[9.5px] uppercase font-mono font-bold text-emerald-805 dark:text-emerald-400 tracking-wider block">Assessor Review Feedback comments:</span>
                                        <p className="text-[11.5px] text-emerald-950 dark:text-emerald-250 font-sans italic">"{sub.feedback}"</p>
                                      </div>
                                    )}

                                    <div className="pt-1 text-right">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setFocusGradingSub({
                                            cwId: cw.id,
                                            sub: sub,
                                            studentName: entity.name,
                                            maxPoints: cw.points,
                                            isGroup: isGroupTask,
                                            groupName: isGroupTask ? entity.name : ''
                                          });
                                          setScoreInput(sub.grade !== null ? String(sub.grade) : '');
                                          setFeedbackInput(sub.feedback || '');
                                        }}
                                        className="bg-black hover:bg-slate-900 border border-transparent text-white text-[11px] font-bold px-4 py-2 rounded-lg shadow-xs transition inline-flex items-center gap-1 cursor-pointer"
                                      >
                                        <Award className="w-3.5 h-3.5" />
                                        {isSubGraded ? 'Edit Evaluation Scores' : 'Evaluate & Grade Submission'}
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/40 dark:bg-slate-800/10 p-4 border border-dashed border-border rounded-xl text-left">
                                    <div className="space-y-0.5 text-left">
                                      <p className="text-[11px] text-text-secondary">Student has not locked in any transmittal submission draft into the database review pipeline yet.</p>
                                      <p className="text-[10px] text-text-muted">You can grade or input a placeholder stub submission on behalf of this student/group to dispatch a zero mark.</p>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const confirmCreate = window.confirm(`No submission registered for "${entity.name}". Would you like to create a stub submission to allow grading?`);
                                        if (confirmCreate) {
                                          // Perform sub creation
                                          submitCoursework(
                                            cw.id,
                                            isGroupTask ? 'stud1' : entity.id, // stud1 as placeholder lead if group
                                            'Offline / unsubmitted evaluation stub recorded by supervisor.',
                                            'Unsubmitted_Stub.pdf',
                                            '0.0 KB',
                                            isGroupTask ? entity.id : null
                                          );
                                          alert('Stub submission generated successfully. You can now grade this entry!');
                                        }
                                      }}
                                      className="border border-border hover:bg-slate-100 bg-white dark:bg-slate-850 text-slate-800 dark:text-slate-205 text-[10.5px] font-bold px-3.5 py-2 rounded-lg transition inline-flex shrink-0 cursor-pointer"
                                    >
                                      Input Evaluation Stub
                                    </button>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                );
              }

              const isGroupTask = cw.isGroupSubmission;
              const matchingSub = cw.submissions.find(s => 
                isGroupTask && studentGroupObj ? s.groupId === studentGroupObj.id : s.studentId === currentUser?.id
              );
              const isSubmitted = !!matchingSub;
              const isGraded = matchingSub && matchingSub.status === 'graded';
              const isOverdue = new Date(cw.dueDate) < new Date() && !isSubmitted;

              return (
                <div className="space-y-6 max-w-4xl mx-auto">
                  <button 
                    onClick={() => setActiveMoodleCwId(null)}
                    className="flex items-center gap-1 text-primary-900 border border-border hover:bg-slate-50 px-3.5 py-1.5 rounded-lg font-bold"
                  >
                    ← Back to assignments list
                  </button>

                  <div className="bg-white dark:bg-slate-900 border border-border rounded-xl p-6 shadow-sm space-y-4">
                    <div className="flex justify-between items-start gap-4 pb-3 border-b border-border">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="bg-indigo-50 border border-indigo-150 text-indigo-750 px-2 py-0.5 rounded text-[9.5px] font-mono font-bold uppercase">
                            {cw.courseCode} — {cw.courseName}
                          </span>
                          {isGroupTask && (
                            <span className="bg-amber-50 border border-amber-150 text-amber-750 px-2 py-0.5 rounded text-[9.5px] font-mono font-bold flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              Group Mission
                            </span>
                          )}
                        </div>
                        <h2 className="font-serif text-base font-bold text-slate-900 mt-2">
                          {cw.title}
                        </h2>
                      </div>
                      <span className="font-mono text-xs font-bold bg-[#f1f5f9] dark:bg-slate-800 text-slate-705 px-3 py-1 rounded">
                        Max points: {cw.points} Points
                      </span>
                    </div>

                    <div className="text-text-secondary text-xs leading-relaxed space-y-2">
                      <p className="font-semibold text-slate-800">Task Directives & Rubrics Guidelines:</p>
                      <p className="bg-[#f8fafc] dark:bg-slate-800 p-4 border border-border rounded-lg leading-relaxed text-[11.5px] italic font-sans text-text-primary whitespace-pre-wrap">
                        {cw.description}
                      </p>
                    </div>

                    {cw.milestonesList && cw.milestonesList.length > 0 && (
                      <div className="space-y-3 pt-4 text-left">
                        <h4 className="font-serif font-bold text-xs text-slate-900 dark:text-slate-100 border-b border-border pb-1.5 flex items-center gap-2">
                          <ClipboardList className="w-4 h-4 text-indigo-650" />
                          Staged Milestone Schedule
                        </h4>
                        <div className="grid grid-cols-1 gap-3">
                          {cw.milestonesList.map((ms, index) => (
                            <div key={ms.id || index} className="p-3.5 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2">
                              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800/80 pb-2">
                                <span className="font-bold text-slate-805 dark:text-slate-200 text-[11.5px]">
                                  Milestone {index + 1}: {ms.topic}
                                </span>
                                <span className="text-[9px] uppercase font-mono px-2 py-0.5 rounded bg-indigo-50 dark:bg-slate-800 text-indigo-750 dark:text-indigo-300 font-bold border border-indigo-100 dark:border-slate-800">
                                  Type: {ms.submissionType === 'file' ? 'File (PDF, Docx, Image, Zip < 500MB)' : ms.submissionType === 'text' ? 'Online Text Input' : 'Any Attachment'}
                                </span>
                              </div>
                              <div className="grid grid-cols-2 gap-4 text-[10.5px]">
                                <div className="flex items-center gap-1.5 text-text-secondary">
                                  <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                  <span>Start Date: <strong className="font-semibold text-slate-700 dark:text-slate-300">{ms.startDate}</strong></span>
                                </div>
                                <div className="flex items-center gap-1.5 text-text-secondary">
                                  <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                  <span>Due Date: <strong className="font-semibold text-slate-700 dark:text-slate-300">{ms.dueDate}</strong></span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {cw.extraMaterial && (
                      <div className="space-y-2 pt-3 text-left">
                        <h4 className="font-serif font-bold text-xs text-slate-900 dark:text-slate-100 flex items-center gap-1.5 border-b border-border pb-1.5">
                          <FileText className="w-4 h-4 text-emerald-650" />
                          Extra Material / Course Directives
                        </h4>
                        <div className="bg-[#f0fdf4] dark:bg-slate-800/20 text-emerald-950 dark:text-emerald-250 p-4 border border-[#bbf7d0] dark:border-emerald-900/40 rounded-xl text-[11.5px] leading-relaxed whitespace-pre-wrap">
                          {cw.extraMaterial}
                        </div>
                      </div>
                    )}

                    {cw.attachedFile && (
                      <div className="space-y-2 pt-3 text-left">
                        <h4 className="font-serif font-bold text-xs text-slate-900 dark:text-slate-100 flex items-center gap-1.5 border-b border-border pb-1.5">
                          <FileText className="w-4 h-4 text-indigo-650" />
                          Attached Syllabus Resource
                        </h4>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 dark:bg-slate-800/40 p-4 border border-border rounded-xl">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <FileText className="w-5 h-5 text-indigo-600 shrink-0" />
                            <div className="truncate text-left min-w-0">
                              <p className="text-xs font-bold text-slate-850 dark:text-slate-200 truncate">{cw.attachedFile.name}</p>
                              <p className="text-[10px] text-text-muted font-mono">{cw.attachedFile.size} • {cw.attachedFile.type?.toUpperCase()}</p>
                            </div>
                          </div>
                          <button 
                            onClick={() => alert(`Downloading active material resource: "${cw.attachedFile.name}" (${cw.attachedFile.size})...`)}
                            className="bg-indigo-50 hover:bg-indigo-100 dark:bg-slate-800 text-indigo-750 dark:text-indigo-300 font-bold px-3 py-1.5 rounded-lg text-[10.5px] flex items-center gap-1 inline-flex shrink-0 border border-indigo-200/40 transition"
                          >
                            <Download className="w-3.5 h-3.5" />
                            Download Extra Material
                          </button>
                        </div>
                      </div>
                    )}

                    {/* MOODLE SUBMISSION STATUS TABLE LAYOUT */}
                    <div className="space-y-3 pt-4">
                      <h3 className="font-serif font-bold text-xs text-slate-900 pb-1.5 border-b border-border">
                        Moodle Submission Log Matrix
                      </h3>

                      <table className="w-full text-xs text-left border-collapse border border-border rounded-xl overflow-hidden">
                        <tbody>
                          <tr className="border-b border-border/80 bg-slate-50/50">
                            <td className="p-3 font-semibold text-text-secondary w-1/3">Submission Status</td>
                            <td className="p-3">
                              {isSubmitted ? (
                                <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-1 rounded text-[10px] uppercase">
                                  Submitted for grading
                                </span>
                              ) : (
                                <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${isOverdue ? 'bg-red-100 text-red-800' : 'bg-slate-150 text-slate-700'}`}>
                                  No attempt recorded
                                </span>
                              )}
                            </td>
                          </tr>

                          <tr className="border-b border-border/80">
                            <td className="p-3 font-semibold text-text-secondary">Grading Status</td>
                            <td className="p-3">
                              {isGraded ? (
                                <span className="font-semibold text-emerald-805">Graded Evaluation Complete</span>
                              ) : isSubmitted ? (
                                <span className="font-semibold text-indigo-705">Awaiting Point Allocation</span>
                              ) : (
                                <span className="text-text-muted">Not graded</span>
                              )}
                            </td>
                          </tr>

                          <tr className="border-b border-border/80 bg-slate-50/50">
                            <td className="p-3 font-semibold text-text-secondary">Due date</td>
                            <td className="p-3 font-mono">{new Date(cw.dueDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</td>
                          </tr>

                          <tr className="border-b border-border/80">
                            <td className="p-3 font-semibold text-text-secondary">Time remaining</td>
                            <td className={`p-3 font-semibold ${isOverdue ? 'text-red-600' : 'text-slate-700'}`}>{getTimeRemainingText(cw.dueDate)}</td>
                          </tr>

                          {isSubmitted && (
                            <>
                              <tr className="border-b border-border/80 bg-slate-50/50">
                                <td className="p-3 font-semibold text-text-secondary">Last modified</td>
                                <td className="p-3 font-mono">{new Date(matchingSub.submittedAt).toLocaleString()}</td>
                              </tr>
                              <tr className="border-b border-border/80">
                                <td className="p-3 font-semibold text-text-secondary">Online Notes Uploaded</td>
                                <td className="p-3 bg-slate-100/50 italic text-[11px] text-text-secondary p-3">"{matchingSub.text}"</td>
                              </tr>
                              <tr className="border-b border-border/80 bg-slate-50/50">
                                <td className="p-3 font-semibold text-text-secondary">File submission</td>
                                <td className="p-3">
                                  <span className="flex items-center gap-1.5 font-mono text-[10.5px] text-primary-750 font-bold">
                                    <FileText className="w-4 h-4 text-slate-400 shrink-0" />
                                    {matchingSub.fileName} ({matchingSub.fileSize})
                                  </span>
                                </td>
                              </tr>
                            </>
                          )}
                        </tbody>
                      </table>

                      {/* DISPLAY FEEDBACK FROM LECTURER */}
                      {isGraded && (
                        <div className="bg-emerald-50/35 border border-emerald-150 rounded-xl p-4.5 space-y-3 mt-4">
                          <div className="flex justify-between items-center text-xs">
                            <h4 className="font-serif font-bold text-emerald-950 flex items-center gap-1.5 uppercase tracking-wide">
                              <CheckCircle className="w-4 h-4 text-emerald-600" />
                              Assessor Marks Dispatch
                            </h4>
                            <span className="font-mono font-bold bg-emerald-100 text-emerald-805 px-3 py-1 rounded text-sm">
                              Grade: {matchingSub.grade} / {cw.points}
                            </span>
                          </div>
                          <div className="text-[11px] font-sans text-emerald-950 italic whitespace-pre-wrap leading-relaxed">
                            "{matchingSub.feedback}"
                          </div>
                        </div>
                      )}

                      {/* REVISION REQUESTED WARNING BANNER */}
                      {isStudent && matchingSub && matchingSub.status === 'resubmit_requested' && (
                        <div className="bg-amber-50 dark:bg-slate-800/80 border-2 border-amber-300 dark:border-amber-700/60 rounded-xl p-4.5 space-y-2 text-left">
                          <div className="flex items-center gap-2 text-amber-900 dark:text-amber-200 font-bold text-xs uppercase tracking-wide">
                            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                            <span>Resubmission & Revision Requested by Supervisor</span>
                          </div>
                          <p className="text-xs text-amber-950 dark:text-amber-200 italic leading-relaxed bg-white/70 dark:bg-slate-900/60 p-3 rounded-lg border border-amber-200 dark:border-amber-800">
                            "{matchingSub.feedback}"
                          </p>
                          <p className="text-[10.5px] text-amber-800 dark:text-amber-300">
                            Please upload an updated draft (Version {(matchingSub.version || 1) + 1}) addressing the supervisor feedback above.
                          </p>
                        </div>
                      )}

                      {/* COURSE-SPECIFIC GROUP SUBMISSION INFO BANNER */}
                      {isStudent && cw.isGroupSubmission && (
                        (() => {
                          const studentCourseGroup = groups.find(g => 
                            ((g.courseId && g.courseId === cw.courseId) || 
                             (g.courseCode && cw.courseCode && g.courseCode.toLowerCase() === cw.courseCode.toLowerCase())) &&
                            g.members.includes(currentUser?.id)
                          ) || groups.find(g => g.id === currentUser?.groupId);

                          const groupMembers = studentCourseGroup ? users.filter(u => studentCourseGroup.members.includes(u.id)) : [];

                          if (studentCourseGroup) {
                            return (
                              <div className="bg-indigo-50/80 dark:bg-slate-800 border border-indigo-200 dark:border-indigo-800 rounded-xl p-4 space-y-2 text-left mt-4">
                                <div className="flex items-center space-x-2 font-bold text-indigo-900 dark:text-indigo-200 text-xs">
                                  <Users className="w-4 h-4 text-indigo-600 shrink-0" />
                                  <span>Group Submission for {cw.courseCode} — {studentCourseGroup.name}</span>
                                </div>
                                <p className="text-[11px] text-indigo-800 dark:text-indigo-300 leading-relaxed">
                                  This coursework is set to <strong>Group Submission</strong> by the lecturer. Submitting will submit for all assigned members of <strong>{studentCourseGroup.name}</strong>.
                                </p>
                                <div className="flex flex-wrap gap-1.5 pt-1">
                                  {groupMembers.map(m => (
                                    <span key={m.id} className="px-2 py-0.5 bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-700 text-indigo-900 dark:text-indigo-200 rounded text-[10px] font-mono">
                                      {m.name} {m.id === studentCourseGroup.leadId ? '(Lead)' : ''}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            );
                          } else {
                            return (
                              <div className="bg-amber-50 dark:bg-slate-800 border border-amber-200 dark:border-amber-800 rounded-xl p-4 space-y-1.5 text-left mt-4">
                                <div className="flex items-center space-x-2 font-bold text-amber-900 dark:text-amber-200 text-xs">
                                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                                  <span>Unassigned Group Status for {cw.courseCode}</span>
                                </div>
                                <p className="text-[11px] text-amber-800 dark:text-amber-300 leading-relaxed">
                                  This is a group-based coursework, but you have not been assigned to a course group for {cw.courseCode} yet. Please notify your course lecturer to assign you to a group.
                                </p>
                              </div>
                            );
                          }
                        })()
                      )}

                      {/* SUBMIT DIRECT FORM FOR STUDENTS (NEW OR RESUBMISSION) */}
                      {isStudent && (!isSubmitted || matchingSub?.status === 'resubmit_requested') && (
                        <div className="bg-[#f8fafc] dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-xl space-y-4 shadow-inner mt-4 text-left">
                          <div className="flex items-center justify-between pb-2 border-b border-border">
                            <div className="flex items-center gap-2 text-primary-900 dark:text-slate-100">
                              <Upload className="w-4 h-4 text-indigo-600" />
                              <h4 className="font-serif font-bold text-xs uppercase tracking-wide">
                                {matchingSub?.status === 'resubmit_requested' 
                                  ? `Submit Revised Draft (Version ${(matchingSub.version || 1) + 1})` 
                                  : 'Add Student Coursework Submission Artifacts'}
                              </h4>
                            </div>
                            <span className="text-[10px] font-mono font-bold bg-indigo-50 dark:bg-slate-800 text-indigo-700 dark:text-indigo-300 px-2.5 py-1 rounded-md border border-indigo-100 dark:border-slate-700">
                              Draft Version {(matchingSub?.version || 0) + 1}.0
                            </span>
                          </div>

                          <div className="space-y-4">
                            <div className="space-y-1.5">
                              <label className="block text-[10px] font-bold text-text-secondary uppercase">
                                Executive Summary & Key Synthesis Notes *
                              </label>
                              <textarea 
                                required
                                rows={4}
                                value={submissionNotes}
                                onChange={(e) => setSubmissionNotes(e.target.value)}
                                placeholder="Provide key findings, architectural details, runtime environment benchmarks, and compiler build instructions..."
                                className="w-full text-xs p-3.5 border border-border bg-white dark:bg-slate-800 dark:text-slate-100 rounded-lg outline-none font-sans"
                              />
                            </div>

                            {/* MULTI-FILE ATTACHMENT ZONE */}
                            <div className="space-y-2">
                              <label className="block text-[10px] font-bold text-text-secondary uppercase">
                                Attached Submission Artifacts (PDF, ZIP, DOCX, Code)
                              </label>

                              {/* Live Attachments List */}
                              {uploadedAttachments.length > 0 && (
                                <div className="space-y-2 mb-3">
                                  {uploadedAttachments.map((att, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg">
                                      <div className="flex items-center gap-2.5 min-w-0">
                                        <FileText className="w-4 h-4 text-indigo-600 shrink-0" />
                                        <div className="truncate min-w-0 text-left">
                                          <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{att.name}</p>
                                          <p className="text-[10px] text-text-muted font-mono">{att.size} • {att.type?.toUpperCase()}</p>
                                        </div>
                                      </div>
                                      <button
                                        type="button"
                                        onClick={() => setUploadedAttachments(prev => prev.filter((_, i) => i !== idx))}
                                        className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 transition"
                                      >
                                        <X className="w-4 h-4" />
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              )}

                              {/* Interactive Drag & Add Buttons */}
                              <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-4 text-center bg-white dark:bg-slate-800/60 space-y-2">
                                <Upload className="w-6 h-6 text-indigo-500 mx-auto" />
                                <p className="text-xs font-bold text-slate-700 dark:text-slate-200">
                                  Drag & drop coursework artifacts here, or select quick templates
                                </p>
                                <p className="text-[10px] text-text-muted">
                                  Supported formats: .pdf, .docx, .zip (code repository), .pptx, .png (up to 25MB)
                                </p>
                                <div className="flex flex-wrap justify-center gap-2 pt-1">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const defaultName = `${cw.courseCode.replace(/\s+/g,'')}_Project_Draft_v${(matchingSub?.version || 0) + 1}.pdf`;
                                      setUploadedAttachments(prev => [...prev, { name: defaultName, size: '2.4 MB', type: 'pdf' }]);
                                    }}
                                    className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-750 dark:bg-slate-700 dark:text-indigo-300 text-[10.5px] font-bold rounded-lg transition inline-flex items-center gap-1"
                                  >
                                    + Add Primary Project PDF (2.4 MB)
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const zipName = `${cw.courseCode.replace(/\s+/g,'')}_SourceCode_Artifacts.zip`;
                                      setUploadedAttachments(prev => [...prev, { name: zipName, size: '4.8 MB', type: 'zip' }]);
                                    }}
                                    className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 dark:bg-slate-700 dark:text-emerald-300 text-[10.5px] font-bold rounded-lg transition inline-flex items-center gap-1"
                                  >
                                    + Add Source Code Bundle (.zip)
                                  </button>
                                </div>
                              </div>
                            </div>

                            <button 
                              onClick={() => handlePerformSubmit(cw)}
                              className="w-full py-3 bg-[#4f46e5] hover:bg-[#4338ca] text-white rounded-xl font-bold shadow-sm transition flex items-center justify-center gap-2 text-xs"
                            >
                              <CheckCircle className="w-4 h-4" />
                              Submit Transmittal Homework & Generate Digital Receipt
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })()
          )}
        </div>
      )}

      {/* MY SUBMISSIONS & RECEIPTS HUB FOR STUDENTS */}
      {moodleTab === 'my_submissions' && isStudent && (
        <div className="space-y-6 text-left">
          <div className="bg-[#f8fafc] dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="space-y-1">
              <h2 className="font-serif text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Inbox className="w-4 h-4 text-indigo-600" />
                My Submissions Registry & Verification Receipts
              </h2>
              <p className="text-xs text-text-secondary">
                Track coursework version histories, assessor grades, and digital transmittal verification codes across all enrolled modules.
              </p>
            </div>
          </div>

          {/* Submissions List / Cards */}
          <div className="space-y-4">
            {courseworks.map((cw) => {
              const matchingSub = cw.submissions.find(
                s => s.studentId === currentUser?.id || (s.groupId && s.groupId === currentUser?.groupId)
              );

              return (
                <div key={cw.id} className="bg-white dark:bg-slate-900 border border-border rounded-xl p-5 shadow-sm space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
                    <div>
                      <span className="font-mono text-[10px] text-indigo-600 dark:text-indigo-400 font-bold uppercase">{cw.courseCode} — {cw.courseName}</span>
                      <h3 className="font-serif font-bold text-sm text-slate-900 dark:text-slate-100">{cw.title}</h3>
                    </div>
                    <div>
                      {matchingSub ? (
                        matchingSub.status === 'graded' ? (
                          <span className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200 font-bold px-3 py-1 rounded-full text-[10.5px]">
                            Graded: {matchingSub.grade} / {cw.points} Pts
                          </span>
                        ) : matchingSub.status === 'resubmit_requested' ? (
                          <span className="bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200 font-bold px-3 py-1 rounded-full text-[10.5px] animate-pulse">
                            Revision Requested
                          </span>
                        ) : (
                          <span className="bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-200 font-bold px-3 py-1 rounded-full text-[10.5px]">
                            Submitted • Pending Assessor Review
                          </span>
                        )
                      ) : (
                        <span className="bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 font-bold px-3 py-1 rounded-full text-[10.5px]">
                          No Submission Yet
                        </span>
                      )}
                    </div>
                  </div>

                  {matchingSub ? (
                    <div className="space-y-3 bg-[#f8fafc] dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700/80 text-xs">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-[11px]">
                        <div>
                          <span className="text-text-muted block text-[9.5px] uppercase">Receipt Code:</span>
                          <span className="font-bold text-indigo-600 dark:text-indigo-300">{matchingSub.receiptCode || 'CZ-SUB-2026-REG'}</span>
                        </div>
                        <div>
                          <span className="text-text-muted block text-[9.5px] uppercase">Submission Version:</span>
                          <span className="font-bold text-slate-800 dark:text-slate-200">Version {(matchingSub.version || 1)}.0</span>
                        </div>
                        <div>
                          <span className="text-text-muted block text-[9.5px] uppercase">Timestamp:</span>
                          <span className="font-semibold text-slate-700 dark:text-slate-300">{new Date(matchingSub.submittedAt).toLocaleString()}</span>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <span className="text-text-muted text-[10px] font-bold uppercase">Executive Notes:</span>
                        <p className="italic text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-border">
                          "{matchingSub.text}"
                        </p>
                      </div>

                      {/* Attachments */}
                      <div className="space-y-1">
                        <span className="text-text-muted text-[10px] font-bold uppercase">Submitted Files:</span>
                        <div className="flex flex-wrap gap-2">
                          {(matchingSub.attachments && matchingSub.attachments.length > 0 
                            ? matchingSub.attachments 
                            : [{ name: matchingSub.fileName, size: matchingSub.fileSize || '2.2 MB' }]
                          ).map((att, idx) => (
                            <span key={idx} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-lg text-[10.5px] font-mono flex items-center gap-1.5 font-semibold text-slate-800 dark:text-slate-200">
                              <FileText className="w-3.5 h-3.5 text-indigo-600" />
                              {att.name} <span className="text-text-muted">({att.size})</span>
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Version History Table if available */}
                      {matchingSub.history && matchingSub.history.length > 0 && (
                        <div className="pt-2 border-t border-slate-200 dark:border-slate-700 space-y-1">
                          <span className="text-[10px] font-bold uppercase text-text-muted">Previous Version Logs:</span>
                          <div className="space-y-1 text-[10.5px]">
                            {matchingSub.history.map((prev, idx) => (
                              <div key={idx} className="flex justify-between p-2 bg-white/60 dark:bg-slate-900/60 rounded border border-slate-200 dark:border-slate-800 text-text-secondary">
                                <span>Version {prev.version || (idx + 1)}.0 ({prev.fileName})</span>
                                <span>{new Date(prev.submittedAt).toLocaleDateString()}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Assessor Feedback */}
                      {matchingSub.status === 'graded' && (
                        <div className="bg-emerald-50 dark:bg-slate-900/90 border border-emerald-200 dark:border-emerald-800/80 p-3.5 rounded-lg space-y-1.5">
                          <span className="text-emerald-900 dark:text-emerald-200 font-bold text-xs uppercase flex items-center gap-1.5">
                            <CheckCircle className="w-4 h-4 text-emerald-600" /> Assessor Feedback & Feedback Comments
                          </span>
                          <p className="text-emerald-950 dark:text-emerald-200 italic leading-relaxed text-xs">
                            "{matchingSub.feedback}"
                          </p>
                        </div>
                      )}

                      {/* Resubmission Action Trigger */}
                      {matchingSub.status === 'resubmit_requested' && (
                        <button
                          onClick={() => setActiveMoodleCwId(cw.id)}
                          className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold transition text-xs flex items-center justify-center gap-2"
                        >
                          <Upload className="w-4 h-4" />
                          Upload Revised Version {(matchingSub.version || 1) + 1}.0 Draft
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl text-center space-y-2 border border-dashed border-slate-300 dark:border-slate-700">
                      <p className="text-text-muted text-xs">No submission recorded for this coursework requirement yet.</p>
                      <button
                        onClick={() => setActiveMoodleCwId(cw.id)}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold text-xs transition"
                      >
                        Open Coursework & Submit
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* EVALUATION QUEUE & GRADING INBOX FOR FACULTY */}
      {moodleTab === 'review_queue' && isFaculty && (
        <div className="space-y-6 text-left">
          <div className="bg-[#f8fafc] dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="space-y-1">
              <h2 className="font-serif text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Inbox className="w-4 h-4 text-amber-500" />
                Evaluation Queue & Grading Inbox
              </h2>
              <p className="text-xs text-text-secondary">
                Review submitted student coursework, grade with rubric breakdowns, or send resubmission revision requests.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {courseworks.map((cw) => {
              if (!cw.submissions || cw.submissions.length === 0) return null;

              return (
                <div key={cw.id} className="bg-white dark:bg-slate-900 border border-border rounded-xl p-5 shadow-sm space-y-4">
                  <div className="border-b border-border pb-3">
                    <span className="font-mono text-[10px] text-indigo-600 dark:text-indigo-400 font-bold uppercase">{cw.courseCode} — {cw.courseName}</span>
                    <h3 className="font-serif font-bold text-sm text-slate-900 dark:text-slate-100">{cw.title}</h3>
                    <p className="text-[10.5px] text-text-muted">Total Submissions: {cw.submissions.length} • Max Points: {cw.points} Pts</p>
                  </div>

                  <div className="space-y-3">
                    {cw.submissions.map((sub) => {
                      const studentObj = users.find(u => u.id === sub.studentId);
                      const groupObj = groups.find(g => g.id === sub.groupId);
                      const authorName = groupObj ? groupObj.name : (studentObj?.name || 'Student');

                      return (
                        <div key={sub.id || sub.studentId || sub.groupId} className="p-4 bg-[#f8fafc] dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl space-y-3">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-700 pb-2">
                            <div>
                              <span className="font-bold text-xs text-slate-800 dark:text-slate-200">{authorName}</span>
                              {groupObj && <span className="ml-2 bg-indigo-50 dark:bg-slate-700 text-indigo-700 dark:text-indigo-300 font-mono text-[9.5px] px-2 py-0.5 rounded font-bold">Group</span>}
                              <span className="ml-2 text-text-muted font-mono text-[10px]">Version {(sub.version || 1)}.0</span>
                            </div>
                            <div>
                              {sub.status === 'graded' ? (
                                <span className="bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded text-[10px]">
                                  Graded: {sub.grade} / {cw.points}
                                </span>
                              ) : sub.status === 'resubmit_requested' ? (
                                <span className="bg-amber-100 text-amber-800 font-bold px-2.5 py-1 rounded text-[10px]">
                                  Revision Pending
                                </span>
                              ) : (
                                <span className="bg-indigo-100 text-indigo-800 font-bold px-2.5 py-1 rounded text-[10px] animate-pulse">
                                  Awaiting Evaluation
                                </span>
                              )}
                            </div>
                          </div>

                          <p className="italic text-xs text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 p-3 rounded-lg border border-border">
                            "{sub.text}"
                          </p>

                          <div className="flex flex-wrap justify-between items-center gap-2 pt-1">
                            <div className="text-[10px] font-mono text-text-muted">
                              File: {sub.fileName} ({sub.fileSize || '2.2 MB'})
                            </div>
                            <button
                              onClick={() => {
                                setFocusGradingSub({
                                  cwId: cw.id,
                                  sub,
                                  isGroup: !!sub.groupId,
                                  groupName: groupObj?.name,
                                  studentName: authorName,
                                  maxPoints: cw.points
                                });
                                setScoreInput(sub.grade ? String(sub.grade) : '');
                                setFeedbackInput(sub.feedback || '');
                              }}
                              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold text-xs transition flex items-center gap-1.5"
                            >
                              <Award className="w-3.5 h-3.5" />
                              {sub.status === 'graded' ? 'Re-evaluate & Update Grade' : 'Assess & Grade Submission'}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* MOODLE GRADEBOOK MATRIX */}
      {moodleTab === 'gradebook' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-border rounded-xl p-5 shadow-sm space-y-2">
            <h2 className="font-serif text-sm font-bold text-primary-900">
              Gradebook Matrix
            </h2>
            <p className="text-text-secondary">
              Trace chronological coursework point dispatches, average thresholds, and peer milestones submitted inside the Moodle network database.
            </p>
          </div>

          {!isStudent ? (
            <>
              /* FACULTY GRADEBOOK OVERVIEW */
              <div className="bg-white dark:bg-slate-900 border border-border rounded-xl overflow-hidden shadow-xs">
              <div className="p-4 bg-slate-50/50 border-b border-border flex justify-between items-center">
                <h3 className="font-serif font-bold text-xs">Lecturer point allocation books</h3>
                <span className="font-mono text-[#475569] text-[10.5px]">Total active tasks: {courseworks.length}</span>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-[11px] text-left border-collapse">
                  <thead>
                    <tr className="border-b border-border bg-slate-100/50 font-mono text-[9px] uppercase tracking-wide text-text-secondary">
                      <th className="p-3">Course / Assessment Title</th>
                      <th className="p-3">Degree & Level</th>
                      <th className="p-3">Type</th>
                      <th className="p-3 text-center">Submissions received</th>
                      <th className="p-3 text-center">Awaiting assessment</th>
                      <th className="p-3 text-center">Average Marks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {courseworks.map(cw => {
                      const subsCount = cw.submissions.length;
                      const pendingCount = cw.submissions.filter(s => s.status === 'submitted').length;
                      const gradedSubs = cw.submissions.filter(s => s.status === 'graded');
                      const avgScore = gradedSubs.length > 0 
                        ? (gradedSubs.reduce((sum, s) => sum + s.grade, 0) / gradedSubs.length).toFixed(1)
                        : 'N/A';

                      return (
                        <tr key={cw.id} className="hover:bg-[#f8fafc]/50">
                          <td className="p-3">
                            <div className="font-semibold text-slate-800 truncate max-w-[240px]">{cw.title}</div>
                            <div className="font-mono text-[9.5px] text-text-muted">{cw.courseCode} — {cw.courseName}</div>
                          </td>
                          <td className="p-3 text-text-secondary">{cw.programme} ({cw.level})</td>
                          <td className="p-3">
                            {cw.isGroupSubmission ? (
                              <span className="font-mono text-[9.5px] px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-750 font-semibold border border-indigo-150">Group</span>
                            ) : (
                              <span className="font-mono text-[9.5px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-650 border">Individual</span>
                            )}
                          </td>
                          <td className="p-3 text-center font-bold text-slate-700">{subsCount}</td>
                          <td className="p-3 text-center">
                            {pendingCount > 0 ? (
                              <span className="bg-amber-100 text-[#7c2d12] font-semibold px-2 py-0.5 rounded font-mono text-[10px] animate-pulse">
                                {pendingCount} Pending
                              </span>
                            ) : (
                              <span className="text-text-muted">0</span>
                            )}
                          </td>
                          <td className="p-3 text-center font-semibold text-emerald-805">
                            {avgScore} / {cw.points}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* CLASS COHORT SCOREBOOK MATRIX */}
            <div className="bg-white dark:bg-slate-900 border border-border rounded-xl overflow-hidden shadow-xs">
              <div className="p-4 bg-[#f8fafc] dark:bg-slate-800 border-b border-border flex justify-between items-center">
                <h3 className="font-serif font-bold text-xs text-primary-955 dark:text-slate-100">Student Coursework Matrix (Cohort Grade Book)</h3>
                <span className="font-mono text-text-muted text-[10px]">Indexed across active project groups</span>
              </div>
              <div className="overflow-x-auto text-left">
                <table className="w-full text-[11px] text-left border-collapse">
                  <thead>
                    <tr className="border-b border-border bg-slate-100/50 font-mono text-[9px] uppercase tracking-wide text-text-secondary">
                      <th className="p-3">Student / Index Number</th>
                      <th className="p-3">Programme</th>
                      {courseworks.map(cw => (
                        <th key={cw.id} className="p-3 text-center truncate max-w-[150px]" title={cw.title}>
                          {cw.courseCode} ({cw.points} pts)
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {users.filter(u => u.role === 'student').map(student => {
                      const studentGroup = student.groupId ? groups.find(g => g.id === student.groupId) : null;

                      return (
                        <tr key={student.id} className="hover:bg-[#f8fafc]/50">
                          <td className="p-3 font-sans">
                            <div className="font-semibold text-slate-800 dark:text-slate-200">{student.name}</div>
                            <div className="font-mono text-[9.5px] text-text-muted">{student.indexNum}</div>
                          </td>
                          <td className="p-3 text-text-secondary font-sans">{student.prog || student.programme || 'BSc. Computer Science'} (L{student.level})</td>
                          {courseworks.map(cw => {
                            const sub = cw.submissions.find(s => 
                              cw.isGroupSubmission && studentGroup ? s.groupId === studentGroup.id : s.studentId === student.id
                            );

                            return (
                              <td key={cw.id} className="p-3 text-center font-mono font-bold">
                                {sub ? (
                                  sub.status === 'graded' ? (
                                    <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-150">
                                      {sub.grade}
                                    </span>
                                  ) : (
                                    <span className="text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-150 animate-pulse" title="Submitted, un-graded">
                                      Pending
                                    </span>
                                  )
                                ) : (
                                  <span className="text-slate-350 font-normal italic">-</span>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
            /* STUDENT GRADEBOOK OVERVIEW */
            <div className="bg-white dark:bg-slate-900 border border-border rounded-xl shadow-xs overflow-hidden">
              <div className="p-4 bg-slate-50/55 border-b border-border flex justify-between items-center">
                <h3 className="font-serif font-bold text-xs text-slate-900">Points & Feedbacks Ledger</h3>
                <span className="font-mono text-text-muted text-[10.5px]">Student index: {currentUser.indexNum}</span>
              </div>

              <div className="overflow-x-auto font-sans">
                <table className="w-full text-[11px] text-left border-collapse">
                  <thead>
                    <tr className="border-b border-border bg-slate-100/50 font-mono text-[9px] uppercase tracking-wide text-text-secondary">
                      <th className="p-3">Course Code & Assignment Topic</th>
                      <th className="p-3">Submission Type</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-center">Allocated Marks</th>
                      <th className="p-3">Supervisor Evaluation Comment / Feedback</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {courseworks
                      .filter(cw => cw.programme === currentUser?.prog && String(cw.level) === String(currentUser?.level))
                      .map(cw => {
                        const matchingSub = cw.submissions.find(s => 
                          cw.isGroupSubmission && studentGroupObj ? s.groupId === studentGroupObj.id : s.studentId === currentUser?.id
                        );

                        return (
                          <tr key={cw.id} className="hover:bg-slate-50/40">
                            <td className="p-3">
                              <div className="font-semibold text-slate-800">{cw.title}</div>
                              <div className="font-mono text-[9px] text-[#475569]">{cw.courseCode}</div>
                            </td>
                            <td className="p-3">
                              {cw.isGroupSubmission ? (
                                <span className="bg-indigo-50 border border-indigo-150 text-indigo-750 px-1.5 py-0.5 rounded text-[9.5px] font-mono">Group Milestone</span>
                              ) : (
                                <span className="bg-slate-100 border border-border text-slate-600 px-1.5 py-0.5 rounded text-[9.5px] font-mono">Individual</span>
                              )}
                            </td>
                            <td className="p-3">
                              {matchingSub ? (
                                matchingSub.status === 'graded' ? (
                                  <span className="text-emerald-700 font-bold">Graded</span>
                                ) : (
                                  <span className="text-indigo-600 font-semibold">Under Evaluation</span>
                                )
                              ) : (
                                <span className="text-text-muted italic">No attempt recorded</span>
                              )}
                            </td>
                            <td className="p-3 text-center">
                              {matchingSub && matchingSub.status === 'graded' ? (
                                <span className="font-mono font-bold bg-emerald-100 text-emerald-805 px-2.5 py-1 rounded text-[11px]">
                                  {matchingSub.grade} / {cw.points}
                                </span>
                              ) : (
                                <span className="text-text-muted font-mono">-</span>
                              )}
                            </td>
                            <td className="p-3 text-text-secondary text-[10.5px]">
                              {matchingSub && matchingSub.feedback ? (
                                <span className="italic block max-w-sm font-sans">"{matchingSub.feedback}"</span>
                              ) : matchingSub ? (
                                <span className="text-text-muted italic">Directives review pending</span>
                              ) : (
                                <span className="text-text-muted">-</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* FACULTY REVIEW/GRADING ASSIGNMENT queue */}
          {isFaculty && (
            <div className="space-y-4 pt-4">
              <h3 className="font-serif font-bold text-xs text-slate-900 border-b border-border pb-1.5">
                Evaluation Queue — Review Student submissions
              </h3>

              <div className="space-y-4">
                {courseworks.map(cw => {
                  const submittedSubs = cw.submissions.filter(s => s.status === 'submitted');
                  if (submittedSubs.length === 0) return null;

                  return (
                    <div key={cw.id} className="bg-white dark:bg-slate-900 border border-border rounded-xl p-5 space-y-4 shadow-xs">
                      <div className="flex justify-between items-center pb-2 border-b border-border/80 text-xs">
                        <div>
                          <span className="font-mono text-[9px] text-text-muted uppercase">{cw.courseCode}</span>
                          <h4 className="font-serif font-bold text-[#1e293b]">{cw.title}</h4>
                        </div>
                        <span className="bg-amber-100 text-[#7c2d12] px-2 py-0.5 rounded font-mono text-[9.5px] uppercase font-bold">
                          {submittedSubs.length} Awaiting points
                        </span>
                      </div>

                      <div className="divide-y divide-border/60">
                        {submittedSubs.map(sub => {
                          const studentInfo = users.find(u => u.id === sub.studentId) || { name: 'Enrolled Peer', indexNum: 'PENDING' };
                          const submitGroup = sub.groupId ? groups.find(g => g.id === sub.groupId) : null;

                          return (
                            <div key={sub.studentId} className="py-4.5 first:pt-2 last:pb-2 flex flex-col md:flex-row justify-between items-start gap-4 text-xs font-sans">
                              <div className="space-y-2 flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-slate-800 text-xs">{studentInfo.name}</span>
                                  {submitGroup && (
                                    <span className="text-[#4338ca] bg-indigo-50 border border-indigo-150 px-1.5 py-0.5 rounded font-mono font-bold text-[9px]">
                                      {submitGroup.name} Milestone Submission
                                    </span>
                                  )}
                                  <span className="text-text-muted font-mono text-[9.5px]">Uploaded file: {sub.fileName} ({sub.fileSize})</span>
                                </div>
                                <p className="bg-[#f8fafc] p-3 text-text-secondary rounded-lg italic border border-border">
                                  "{sub.text}"
                                </p>
                                <p className="text-[9.5px] font-mono text-text-muted">
                                  Logged timestamp: {new Date(sub.submittedAt).toLocaleString()}
                                </p>
                              </div>

                              <button 
                                onClick={() => setFocusGradingSub({ 
                                  cwId: cw.id, 
                                  sub, 
                                  isGroup: cw.isGroupSubmission, 
                                  groupName: submitGroup ? submitGroup.name : '',
                                  studentName: studentInfo.name,
                                  maxPoints: cw.points
                                })}
                                className="bg-primary-900 hover:bg-primary-800 text-white font-bold rounded-lg px-4 py-2 cursor-pointer transition shrink-0"
                              >
                                Review & Grade
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}

                {courseworks.reduce((acc, cw) => acc + cw.submissions.filter(s => s.status === 'submitted').length, 0) === 0 && (
                  <div className="text-center py-16 bg-white dark:bg-slate-900 border border-dashed border-border rounded-xl text-text-muted space-y-2">
                    <Inbox className="w-10 h-10 mx-auto stroke-1" />
                    <p className="font-semibold text-xs mt-2">Evaluation queue is empty</p>
                    <p className="text-[11px]">All student submissions have been graded and logged inside indices registries.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* LECTURER VIEW: NEW ASSIGNMENT CREATION */}
      {moodleTab === 'new' && isFaculty && (
        <div className="max-w-2xl mx-auto bg-white dark:bg-slate-900 border border-border rounded-xl p-6 shadow-sm space-y-4">
          <div className="flex items-center space-x-2 text-primary-900 border-b border-border pb-3">
            <ClipboardList className="w-5 h-5 text-indigo-600" />
            <h3 className="font-serif text-sm font-bold text-[#1e293b]">Set Moodle Assessment Task</h3>
          </div>

          <form onSubmit={handleLaunchMoodleTask} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-text-secondary uppercase">
                Assessment Title / Project Phase
              </label>
              <input 
                type="text" 
                required
                placeholder="e.g., Cryptographic Key Encapsulation & Byzantine Injections"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full h-10 px-3 bg-slate-50 border border-border rounded-lg outline-none font-sans"
              />
            </div>

            {/* Quick Course Selector */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-text-secondary uppercase flex justify-between">
                <span>Quick Course Selection</span>
                <span className="text-indigo-600 font-mono font-bold">Auto-fills Course Fields</span>
              </label>
              <select
                onChange={(e) => {
                  const selectedId = e.target.value;
                  const matched = courses.find(c => c.id === selectedId);
                  if (matched) {
                    setCourseCode(matched.code);
                    setCourseName(matched.name);
                    if (matched.programme) setProgramme(matched.programme);
                    if (matched.level) setLevel(matched.level);
                  }
                }}
                className="w-full h-10 px-3 bg-indigo-50/50 border border-indigo-200 rounded-lg outline-none text-xs font-semibold text-slate-800"
              >
                <option value="">-- Choose Course from My List --</option>
                {courses.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.code} — {c.name} ({c.programme})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-text-secondary uppercase">
                  Class Code Matcher *
                </label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g., CS 402"
                  value={courseCode}
                  onChange={(e) => setCourseCode(e.target.value)}
                  className="w-full h-10 px-3 bg-slate-50 border border-border rounded-lg outline-none font-mono text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-text-secondary uppercase">
                  Course Descriptor Title *
                </label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g., Advanced Fault-Tolerant Networks"
                  value={courseName}
                  onChange={(e) => setCourseName(e.target.value)}
                  className="w-full h-10 px-3 bg-slate-50 border border-border rounded-lg outline-none text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-text-secondary uppercase">
                  Associated Programme
                </label>
                <select 
                  value={programme}
                  onChange={(e) => setProgramme(e.target.value)}
                  className="w-full h-10 bg-slate-50 border border-border px-2 rounded-lg outline-none text-text-primary text-xs"
                >
                  <option value="BSc. Computer Science">BSc. Computer Science</option>
                  <option value="BSc. Software Engineering">BSc. Software Engineering</option>
                  <option value="BSc. Cyber Mathematics">BSc. Cyber Mathematics</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-text-secondary uppercase">
                  Academic Level
                </label>
                <select 
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  className="w-full h-10 bg-slate-50 border border-border px-2 rounded-lg outline-none text-text-primary text-xs"
                >
                  <option value="100">Level 100</option>
                  <option value="200">Level 200</option>
                  <option value="300">Level 300</option>
                  <option value="400">Level 400</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-text-secondary uppercase">
                  Marks Allocation Limit
                </label>
                <input 
                  type="number" 
                  required
                  max="100"
                  min="10"
                  placeholder="100"
                  value={points}
                  onChange={(e) => setPoints(e.target.value)}
                  className="w-full h-10 px-3 bg-slate-50 border border-border rounded-lg outline-none text-xs"
                />
              </div>
            </div>

            <div className="p-4 bg-slate-50 border border-border rounded-xl space-y-3">
              <label className="block text-[10px] font-bold text-indigo-755 uppercase">
                Assessment Submission Scope:
              </label>
              
              <div className="flex gap-4 items-center">
                <label className="flex items-center gap-2 font-bold text-text-secondary">
                  <input 
                    type="radio" 
                    checked={isGroupSubmission} 
                    onChange={() => setIsGroupSubmission(true)} 
                    className="text-primary-600 focus:ring-primary-500"
                  />
                  <span>Group Milestone Submissions</span>
                </label>
                
                <label className="flex items-center gap-2 font-bold text-text-secondary">
                  <input 
                    type="radio" 
                    checked={!isGroupSubmission} 
                    onChange={() => setIsGroupSubmission(false)} 
                    className="text-primary-600 focus:ring-primary-500"
                  />
                  <span>Individual Coursework Block</span>
                </label>
              </div>

              {isGroupSubmission && (
                <div className="space-y-3 pt-2 border-t border-border/80">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold text-indigo-900 uppercase">
                      Course Module Assessment Category:
                    </label>
                    <select 
                      value={linkedMilestone}
                      onChange={(e) => setLinkedMilestone(e.target.value)}
                      className="w-full h-9 bg-white border border-border px-2 rounded-lg outline-none text-text-primary text-xs font-mono"
                    >
                      <option value="Assessment 1">Assessment 1: Course Problem Set & Foundations</option>
                      <option value="Assessment 2">Assessment 2: Mid-Term Laboratory Report</option>
                      <option value="Assessment 3">Assessment 3: Group Case Study Specification</option>
                      <option value="Assessment 4">Assessment 4: Applied Practical Implementation</option>
                      <option value="Assessment 5">Assessment 5: Final Coursework Deliverable</option>
                    </select>
                  </div>

                  {/* IDENTIFIED COURSE GROUPS DISPLAY */}
                  {(() => {
                    const activeCourseGroups = groups.filter(g => 
                      (g.courseCode && courseCode && g.courseCode.toLowerCase() === courseCode.trim().toLowerCase()) ||
                      (g.courseName && courseName && g.courseName.toLowerCase() === courseName.trim().toLowerCase())
                    );

                    if (activeCourseGroups.length > 0) {
                      return (
                        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1.5 text-left">
                          <div className="flex items-center space-x-2 font-bold text-emerald-950 text-xs">
                            <Users className="w-4 h-4 text-emerald-600 shrink-0" />
                            <span>{activeCourseGroups.length} Course Groups Identified for {courseCode.toUpperCase() || 'this Course'}</span>
                          </div>
                          <p className="text-[11px] text-emerald-850 leading-relaxed">
                            Students in these groups will collaborate and submit together for <strong>{courseCode.toUpperCase() || 'this course'}</strong>:
                          </p>
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {activeCourseGroups.map(cg => (
                              <span key={cg.id} className="px-2.5 py-1 bg-white border border-emerald-300 text-emerald-900 rounded-lg text-[10px] font-mono font-bold shadow-2xs">
                                {cg.name} ({cg.members.length} members)
                              </span>
                            ))}
                          </div>
                        </div>
                      );
                    } else {
                      return (
                        <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl space-y-2 text-left">
                          <div className="flex items-center space-x-2 font-bold text-amber-900 text-xs">
                            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                            <span>No Course Groups Created for {courseCode.toUpperCase() || 'this Course'} Yet</span>
                          </div>
                          <p className="text-[11px] text-amber-800 leading-relaxed">
                            You chose <strong>Group Submission</strong> for this coursework, but no groups have been created for {courseCode.toUpperCase() || 'this course'} yet. Lecturers need to create course groups first.
                          </p>
                          <button
                            type="button"
                            onClick={() => {
                              setMoodleTab('syllabus');
                              setShowCreateGroupForm(true);
                              setNewGroupCourseCode(courseCode.toUpperCase());
                              setNewGroupCourseName(courseName);
                            }}
                            className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg text-[11px] inline-flex items-center space-x-1.5 transition cursor-pointer shadow-xs"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Create Course Groups for {courseCode.toUpperCase() || 'Course'} Now</span>
                          </button>
                        </div>
                      );
                    }
                  })()}
                </div>
              )}
            </div>

            {/* DUE DATE SELECTOR (CUSTOM OR PRESET DAILY, WEEKLY, MONTHLY) */}
            <div className="p-4 bg-slate-50 border border-border rounded-xl space-y-3">
              <label className="block text-[10px] font-bold text-indigo-755 uppercase">
                Academic Due Date Scheme:
              </label>

              <div className="flex gap-4 items-center">
                <label className="flex items-center gap-2 font-bold text-text-secondary">
                  <input 
                    type="radio" 
                    checked={dueDateType === 'custom'} 
                    onChange={() => setDueDateType('custom')} 
                    className="text-primary-600 focus:ring-primary-500"
                  />
                  <span>Custom Calendar Date</span>
                </label>

                <label className="flex items-center gap-2 font-bold text-text-secondary">
                  <input 
                    type="radio" 
                    checked={dueDateType === 'preset'} 
                    onChange={() => setDueDateType('preset')} 
                    className="text-primary-600 focus:ring-primary-500"
                  />
                  <span>Preset Durations (Daily, Weekly, Monthly)</span>
                </label>
              </div>

              {dueDateType === 'custom' ? (
                <div className="space-y-1.5 pt-2 border-t border-border">
                  <label className="block text-[10px] font-mono text-text-muted">SELECT DATE:</label>
                  <input 
                    type="date"
                    required={dueDateType === 'custom'}
                    value={customDueDate}
                    onChange={(e) => setCustomDueDate(e.target.value)}
                    className="w-full h-9 px-3 bg-white border border-border rounded-lg outline-none text-xs"
                  />
                </div>
              ) : (
                <div className="space-y-2 pt-2 border-t border-border flex flex-wrap gap-4 items-center">
                  <div className="space-y-1">
                    <label className="block text-[9px] font-mono text-text-muted uppercase">Offset Frame Scale:</label>
                    <select 
                      value={presetScale}
                      onChange={(e) => setPresetScale(e.target.value)}
                      className="h-9 px-2 bg-white border border-border rounded-lg outline-none text-xs font-semibold text-slate-705"
                    >
                      <option value="daily">Daily Intervals</option>
                      <option value="weekly">Weekly Intervals</option>
                      <option value="monthly">Monthly Intervals</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[9px] font-mono text-text-muted uppercase">Interval Offset Multiply:</label>
                    <div className="flex items-center space-x-2">
                      <input 
                        type="number"
                        min="1"
                        max="30"
                        value={presetValue}
                        onChange={(e) => setPresetValue(parseInt(e.target.value) || 1)}
                        className="w-16 h-9 px-2 text-center bg-white border border-border rounded-lg text-xs font-mono font-bold"
                      />
                      <span className="font-mono text-[10px] text-text-muted">
                        {presetScale === 'daily' ? 'day(s)' : presetScale === 'weekly' ? 'week(s)' : 'month(s)'}
                      </span>
                    </div>
                  </div>

                  <div className="flex-1 bg-white p-2.5 border border-slate-205 rounded-lg shrink-0">
                    <div className="text-[9.5px] font-mono text-text-muted uppercase">Computed Deadline:</div>
                    <div className="font-bold text-slate-800 text-[11px] mt-0.5">
                      {computedDueDate ? new Date(computedDueDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'Calculating...'}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-[#64748b] uppercase">
                Directives directives guidelines & Point criteria
              </label>
              <textarea 
                required
                rows={4}
                placeholder="Specify paxos replication steps, code docker setup models guidelines, evaluations checklist..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full text-xs p-3.5 bg-slate-50 border border-border rounded-lg outline-none font-sans"
              />
            </div>

            <div className="flex space-x-2 pt-3 border-t border-border mt-6">
              <button 
                type="button" 
                onClick={() => setMoodleTab('syllabus')}
                className="flex-1 py-2.5 bg-white border border-border rounded-lg font-bold text-text-secondary hover:bg-slate-50 transition cursor-pointer"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="flex-1 py-2.5 bg-primary-900 hover:bg-primary-850 text-white rounded-lg font-bold shadow-sm transition"
              >
                Publish Class Homework
              </button>
            </div>
          </form>
        </div>
      )}

      {/* SUPERVISOR / LECTURER EVALUATION OVERLAY */}
      {focusGradingSub && (
        <div className="fixed inset-0 bg-[#0f172a]/50 backdrop-blur-md flex items-center justify-center p-4 z-50 text-left">
          <div className="bg-white dark:bg-slate-900 border border-border rounded-xl p-6 shadow-2xl w-full max-w-xl space-y-4 text-text-primary text-xs animate-scale-up max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border pb-3.5">
              <div className="flex items-center space-x-2 text-primary-900 dark:text-slate-100">
                <Award className="w-5 h-5 flex-shrink-0 text-amber-500" />
                <h3 className="font-serif text-sm font-bold">Academic Assessment & Grading Workspace</h3>
              </div>
              <button 
                onClick={() => setFocusGradingSub(null)}
                className="text-text-muted hover:text-slate-800 p-1 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-[#f8fafc] dark:bg-slate-800/60 p-4 border border-border rounded-xl text-[10.5px] font-sans space-y-2.5">
              <div className="flex justify-between font-bold text-slate-850 dark:text-slate-200 text-xs">
                <span>Student / Author: {focusGradingSub.studentName}</span>
                <span className="font-mono bg-indigo-50 dark:bg-slate-700 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded">
                  Max: {focusGradingSub.maxPoints} Pts
                </span>
              </div>

              {focusGradingSub.isGroup && (
                <div className="text-[10.5px] font-mono text-[#4338ca] dark:text-indigo-300 font-bold flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" />
                  Group Context: Evaluates {focusGradingSub.groupName}
                </div>
              )}

              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase text-text-muted">Submission Executive Notes:</span>
                <p className="italic text-text-secondary dark:text-slate-300 bg-white dark:bg-slate-900 p-3 border border-border rounded-lg leading-relaxed whitespace-pre-wrap">
                  "{focusGradingSub.sub.text}"
                </p>
              </div>

              {/* Submitted Attachments */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase text-text-muted">Uploaded Submission Artifacts:</span>
                <div className="space-y-1.5">
                  {(focusGradingSub.sub.attachments && focusGradingSub.sub.attachments.length > 0 
                    ? focusGradingSub.sub.attachments 
                    : [{ name: focusGradingSub.sub.fileName, size: focusGradingSub.sub.fileSize || '1.2 MB' }]
                  ).map((att, i) => (
                    <div key={i} className="flex items-center justify-between p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-indigo-600 shrink-0" />
                        <span className="font-bold text-slate-800 dark:text-slate-200 text-xs">{att.name}</span>
                        <span className="text-[9.5px] text-text-muted font-mono">({att.size})</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => alert(`Opening preview or download for file artifact: "${att.name}" (${att.size})...`)}
                        className="text-xs font-bold text-indigo-600 hover:text-indigo-800 dark:text-indigo-300 flex items-center gap-1"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Download
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {focusGradingSub.sub.receiptCode && (
                <div className="text-[10px] font-mono text-text-muted pt-1 flex justify-between">
                  <span>Digital Receipt: <strong className="text-slate-700 dark:text-slate-300">{focusGradingSub.sub.receiptCode}</strong></span>
                  <span>Version {(focusGradingSub.sub.version || 1)}.0</span>
                </div>
              )}
            </div>

            {/* Mode Selector */}
            <div className="flex border-b border-border space-x-2 pb-2">
              <button
                type="button"
                onClick={() => setGradingMode('grade')}
                className={`flex-1 py-2 rounded-lg font-bold text-xs transition ${
                  gradingMode === 'grade'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                Grade & Award Marks
              </button>
              <button
                type="button"
                onClick={() => setGradingMode('resubmit')}
                className={`flex-1 py-2 rounded-lg font-bold text-xs transition ${
                  gradingMode === 'resubmit'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                Request Resubmission / Revision
              </button>
            </div>

            <form onSubmit={handlePerformGrading} className="space-y-4">
              {gradingMode === 'grade' ? (
                <>
                  {/* Rubric Breakdown */}
                  <div className="space-y-3 p-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl">
                    <div className="flex justify-between items-center border-b border-border/80 pb-2">
                      <h4 className="font-bold text-slate-800 dark:text-slate-200 text-xs">Structured Rubric Evaluation Breakdown</h4>
                      <span className="font-mono font-bold text-xs bg-indigo-100 dark:bg-slate-700 text-indigo-800 dark:text-indigo-200 px-2 py-0.5 rounded">
                        Calculated Total: {scoreInput || (rubricScores.architecture + rubricScores.implementation + rubricScores.documentation)} / {focusGradingSub.maxPoints}
                      </span>
                    </div>

                    <div className="space-y-2 text-[11px]">
                      <div>
                        <div className="flex justify-between text-text-secondary font-semibold mb-1">
                          <span>1. System Architecture & Formulation (Max 30)</span>
                          <span className="font-mono">{rubricScores.architecture} pts</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="30"
                          value={rubricScores.architecture}
                          onChange={(e) => {
                            const val = parseInt(e.target.value) || 0;
                            const newRubric = { ...rubricScores, architecture: val };
                            setRubricScores(newRubric);
                            setScoreInput(String(newRubric.architecture + newRubric.implementation + newRubric.documentation));
                          }}
                          className="w-full accent-indigo-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between text-text-secondary font-semibold mb-1">
                          <span>2. Code Execution & Technical Artifacts (Max 40)</span>
                          <span className="font-mono">{rubricScores.implementation} pts</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="40"
                          value={rubricScores.implementation}
                          onChange={(e) => {
                            const val = parseInt(e.target.value) || 0;
                            const newRubric = { ...rubricScores, implementation: val };
                            setRubricScores(newRubric);
                            setScoreInput(String(newRubric.architecture + newRubric.implementation + newRubric.documentation));
                          }}
                          className="w-full accent-indigo-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between text-text-secondary font-semibold mb-1">
                          <span>3. Analysis, Synthesis & Documentation (Max 30)</span>
                          <span className="font-mono">{rubricScores.documentation} pts</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="30"
                          value={rubricScores.documentation}
                          onChange={(e) => {
                            const val = parseInt(e.target.value) || 0;
                            const newRubric = { ...rubricScores, documentation: val };
                            setRubricScores(newRubric);
                            setScoreInput(String(newRubric.architecture + newRubric.implementation + newRubric.documentation));
                          }}
                          className="w-full accent-indigo-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold text-text-secondary uppercase">
                      Final Points Override *
                    </label>
                    <input 
                      type="number" 
                      required
                      min="0"
                      max={focusGradingSub.maxPoints}
                      placeholder={`0 - ${focusGradingSub.maxPoints}`}
                      value={scoreInput || String(rubricScores.architecture + rubricScores.implementation + rubricScores.documentation)}
                      onChange={(e) => setScoreInput(e.target.value)}
                      className="w-full h-10 px-3 bg-slate-50 dark:bg-slate-800 border border-border rounded-lg outline-none font-mono text-xs font-bold"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold text-text-secondary uppercase">
                      Formal Feedback & Evaluator Comments *
                    </label>
                    <textarea 
                      required
                      rows={4}
                      placeholder="Explain rubric allocations, code performance, and research synthesis guidelines..."
                      value={feedbackInput}
                      onChange={(e) => setFeedbackInput(e.target.value)}
                      className="w-full text-xs p-3.5 bg-slate-50 dark:bg-slate-800 border border-border rounded-lg outline-none font-sans"
                    />
                  </div>
                </>
              ) : (
                /* RESUBMISSION MODE */
                <div className="space-y-3">
                  <div className="p-3 bg-amber-50 dark:bg-slate-800 border border-amber-200 dark:border-amber-800 rounded-xl space-y-1 text-amber-900 dark:text-amber-200">
                    <h4 className="font-bold text-xs flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4 text-amber-600" />
                      Request Revision / Resubmission
                    </h4>
                    <p className="text-[11px] leading-relaxed">
                      Sending a revision request will notify the student/group to address your notes and upload Version {(focusGradingSub.sub.version || 1) + 1}. No grade will be recorded yet.
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold text-text-secondary uppercase">
                      Revision Instructions & Feedback for Student *
                    </label>
                    <textarea 
                      required
                      rows={4}
                      placeholder="Specify what needs to be improved in the submission (e.g. missing benchmark graphs, re-run docker tests, expand literature review section)..."
                      value={resubmissionReason}
                      onChange={(e) => setResubmissionReason(e.target.value)}
                      className="w-full text-xs p-3.5 bg-slate-50 dark:bg-slate-800 border border-border rounded-lg outline-none font-sans"
                    />
                  </div>
                </div>
              )}

              {focusGradingSub.isGroup && (
                <div className="text-[9.5px] text-indigo-755 font-mono italic leading-relaxed bg-indigo-50/50 p-2 border rounded border-indigo-100">
                  * Action replicates this evaluation score, notifications, and project report approvals across all members of {focusGradingSub.groupName}.
                </div>
              )}

              <div className="flex space-x-2 pt-3 border-t border-border">
                <button 
                  type="button" 
                  onClick={() => { setFocusGradingSub(null); setScoreInput(''); setFeedbackInput(''); setResubmissionReason(''); }}
                  className="flex-1 py-2.5 bg-white dark:bg-slate-800 border border-border rounded-lg font-bold text-text-secondary hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className={`flex-1 py-2.5 text-white rounded-lg font-bold transition shadow-sm ${
                    gradingMode === 'resubmit' ? 'bg-amber-600 hover:bg-amber-700' : 'bg-[#4f46e5] hover:bg-[#4338ca]'
                  }`}
                >
                  {gradingMode === 'resubmit' ? 'Send Revision Request' : 'Transmit Academic Grade'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DIGITAL TRANSMITTAL RECEIPT MODAL */}
      {receiptModalData && (
        <div className="fixed inset-0 bg-[#0f172a]/60 backdrop-blur-md flex items-center justify-center p-4 z-50 text-left">
          <div className="bg-white dark:bg-slate-900 border-2 border-indigo-200 dark:border-slate-700 rounded-2xl p-6 shadow-2xl w-full max-w-lg space-y-4 text-text-primary text-xs animate-scale-up">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-6 h-6 text-emerald-600 shrink-0" />
                <div>
                  <h3 className="font-serif text-sm font-bold text-slate-900 dark:text-slate-100">
                    Digital Coursework Transmittal Receipt
                  </h3>
                  <p className="text-[10.5px] font-mono text-indigo-600 dark:text-indigo-300">
                    Official Academic Verification Slip
                  </p>
                </div>
              </div>
              <button
                onClick={() => setReceiptModalData(null)}
                className="text-text-muted hover:text-slate-800 dark:hover:text-slate-200 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-[#f8fafc] dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl p-4 space-y-3 font-mono text-[11px]">
              <div className="flex justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                <span className="text-text-muted">RECEIPT CODE:</span>
                <span className="font-bold text-indigo-700 dark:text-indigo-300">{receiptModalData.receiptCode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">COURSE:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{receiptModalData.courseCode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">TASK TITLE:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 truncate max-w-[200px]">{receiptModalData.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">SUBMITTED BY:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{receiptModalData.groupName ? `Group ${receiptModalData.groupName}` : receiptModalData.studentName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">TIMESTAMP:</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">{new Date(receiptModalData.submittedAt).toLocaleString()}</span>
              </div>

              <div className="pt-2 border-t border-slate-200 dark:border-slate-700 space-y-1">
                <span className="text-text-muted uppercase text-[9.5px]">REGISTERED ARTIFACTS ({receiptModalData.attachments?.length || 1}):</span>
                {receiptModalData.attachments?.map((att, i) => (
                  <div key={i} className="flex justify-between text-[10.5px] bg-white dark:bg-slate-900 p-2 rounded border border-slate-200 dark:border-slate-700">
                    <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">{att.name}</span>
                    <span className="text-text-muted shrink-0 ml-2">{att.size}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  const txt = `OFFICIAL DIGITAL COURSEWORK RECEIPT\nReference Code: ${receiptModalData.receiptCode}\nCourse: ${receiptModalData.courseCode} - ${receiptModalData.courseName}\nTask: ${receiptModalData.title}\nAuthor: ${receiptModalData.groupName ? `Group ${receiptModalData.groupName}` : receiptModalData.studentName}\nTimestamp: ${receiptModalData.submittedAt}\nAttachments:\n${receiptModalData.attachments?.map(a => `- ${a.name} (${a.size})`).join('\n')}`;
                  const element = document.createElement("a");
                  const file = new Blob([txt], {type: 'text/plain'});
                  element.href = URL.createObjectURL(file);
                  element.download = `${receiptModalData.receiptCode}.txt`;
                  document.body.appendChild(element);
                  element.click();
                  document.body.removeChild(element);
                }}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl font-bold flex items-center justify-center gap-1.5 transition text-xs"
              >
                <Download className="w-4 h-4 text-indigo-600" />
                Download Receipt Slip (.txt)
              </button>
              <button
                type="button"
                onClick={() => setReceiptModalData(null)}
                className="px-5 py-2.5 bg-[#4f46e5] hover:bg-[#4338ca] text-white rounded-xl font-bold transition text-xs"
              >
                Close Slip
              </button>
            </div>
          </div>
        </div>
      )}

      {/* NEW COURSEWORK POPUP WIZARD COMPONENT */}
      {showCourseworkWizard && (
        <div className="fixed inset-0 bg-[#0f172a]/50 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 border border-slate-250 dark:border-slate-800 rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col text-text-primary text-xs animate-scale-up overflow-hidden">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-border flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
              <div className="flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-indigo-650" />
                <div className="text-left">
                  <h3 className="font-serif text-sm font-bold text-slate-900 dark:text-slate-100">
                    Create Course Work Wizard
                  </h3>
                  <p className="text-[10px] text-text-muted mt-0.5">
                    Stage {wizardCwStep} of 3: {
                      wizardCwStep === 1 ? "Course details & context" :
                      wizardCwStep === 2 ? "Configure milestones plan" :
                      "Overview & publishing checklist"
                    }
                  </p>
                </div>
              </div>
              <button 
                onClick={handleCloseWizard}
                className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700/80 rounded-lg text-slate-400 hover:text-slate-650 transition"
                title="Dismiss wizard"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Stepper Progress Bar */}
            <div className="bg-slate-100 dark:bg-slate-800/20 px-5 py-2.5 flex items-center justify-between text-[10px] font-mono border-b border-border/60">
              <div className="flex items-center gap-1.5">
                <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold ${
                  wizardCwStep >= 1 ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-550'
                }`}>1</span>
                <span className={wizardCwStep >= 1 ? 'text-indigo-650 font-bold' : 'text-slate-500'}>Course Info</span>
              </div>
              <div className="h-px bg-slate-250 dark:bg-slate-800 flex-1 mx-3" />
              <div className="flex items-center gap-1.5">
                <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold ${
                  wizardCwStep >= 2 ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-550'
                }`}>2</span>
                <span className={wizardCwStep >= 2 ? 'text-indigo-650 font-bold' : 'text-slate-500'}>Milestones</span>
              </div>
              <div className="h-px bg-slate-250 dark:bg-slate-800 flex-1 mx-3" />
              <div className="flex items-center gap-1.5">
                <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold ${
                  wizardCwStep >= 3 ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-550'
                }`}>3</span>
                <span className={wizardCwStep >= 3 ? 'text-indigo-650 font-bold' : 'text-slate-500'}>Review & Launch</span>
              </div>
            </div>

            {/* Modal Body */}
            <div className="flex-1 p-6 overflow-y-auto space-y-5 text-left">
              
              {/* STAGE 1: COURSE CONTEXT */}
              {wizardCwStep === 1 && (
                <div className="space-y-4 animate-fade-in text-left">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5 text-left">
                      <label className="block text-[10.5px] font-bold text-slate-700 dark:text-slate-300">
                        Course Code *
                      </label>
                      <input 
                        type="text"
                        required
                        placeholder="e.g. CS 402"
                        value={wizardCourseCode}
                        onChange={(e) => setWizardCourseCode(e.target.value)}
                        className="w-full text-xs p-2.5 border border-border dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 rounded-lg outline-none focus:bg-white focus:ring-1 focus:ring-indigo-500 text-slate-900"
                      />
                    </div>
                    <div className="space-y-1.5 text-left">
                      <label className="block text-[10.5px] font-bold text-slate-700 dark:text-slate-300">
                        Course Name / Title *
                      </label>
                      <input 
                        type="text"
                        required
                        placeholder="e.g. Distributed Ledger Systems"
                        value={wizardCourseName}
                        onChange={(e) => setWizardCourseName(e.target.value)}
                        className="w-full text-xs p-2.5 border border-border dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 rounded-lg outline-none focus:bg-white focus:ring-1 focus:ring-indigo-500 text-slate-900"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                    <div className="space-y-1.5">
                      <label className="block text-[10.5px] font-bold text-slate-700 dark:text-slate-300">
                        Target Academic Programme *
                      </label>
                      <select 
                        value={wizardProgramme}
                        onChange={(e) => setWizardProgramme(e.target.value)}
                        className="w-full text-xs p-2.5 border border-border dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 rounded-lg outline-none focus:bg-white focus:ring-1 focus:ring-indigo-500 text-slate-900"
                      >
                        {programmes.map(prog => (
                          <option key={prog.id} value={prog.name}>{prog.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-[10.5px] font-bold text-slate-700 dark:text-slate-300">
                        Academic Level *
                      </label>
                      <select 
                        value={wizardLevel}
                        onChange={(e) => setWizardLevel(e.target.value)}
                        className="w-full text-xs p-2.5 border border-border dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 rounded-lg outline-none focus:bg-white focus:ring-1 focus:ring-indigo-500 text-slate-900"
                      >
                        <option value="100">Level 100</option>
                        <option value="200">Level 200</option>
                        <option value="300">Level 300</option>
                        <option value="400">Level 400</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-left">
                    <label className="block text-[10.5px] font-bold text-slate-700 dark:text-slate-300">
                      Extra Material & Accompanying Instructions
                    </label>
                    <textarea 
                      rows={4}
                      placeholder="Add hyperlinks, reference guidelines, literature materials parameters..."
                      value={wizardExtraMaterial}
                      onChange={(e) => setWizardExtraMaterial(e.target.value)}
                      className="w-full text-xs p-3.5 border border-border dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 rounded-lg outline-none focus:bg-white focus:ring-1 focus:ring-indigo-500 text-slate-900"
                    />
                  </div>

                  {/* Drag-and-drop / Click file upload block */}
                  <div className="space-y-2 text-left">
                    <label className="block text-[10.5px] font-bold text-slate-700 dark:text-slate-300">
                      Upload Extra Material File (Optional)
                    </label>
                    
                    {!wizardAttachedFile ? (
                      <div 
                        onDragOver={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                        onDrop={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                            const file = e.dataTransfer.files[0];
                            const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
                            setWizardAttachedFile({
                              name: file.name,
                              size: sizeMb + ' MB',
                              type: file.name.split('.').pop()
                            });
                          }
                        }}
                        onClick={() => {
                          const input = document.getElementById('wizard-file-input');
                          if (input) input.click();
                        }}
                        className="border-2 border-dashed border-slate-250 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-500 bg-slate-50/50 dark:bg-slate-800/30 hover:bg-slate-50 dark:hover:bg-slate-800/50 p-6 rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer transition text-center group"
                      >
                        <input 
                          type="file"
                          id="wizard-file-input"
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              const file = e.target.files[0];
                              const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
                              setWizardAttachedFile({
                                name: file.name,
                                size: sizeMb + ' MB',
                                type: file.name.split('.').pop()
                              });
                            }
                          }}
                        />
                        <Upload className="w-6 h-6 text-slate-400 group-hover:text-indigo-500 transition" />
                        <div>
                          <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                            Drag & drop or <span className="text-indigo-650 dark:text-indigo-400">browse file</span>
                          </p>
                          <p className="text-[10px] text-text-muted mt-0.5">
                            PDF, Word Docx, Images, or ZIP up to 500MB
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between p-3.5 bg-indigo-50/40 dark:bg-indigo-950/20 border border-indigo-150 dark:border-indigo-900/30 rounded-xl">
                        <div className="flex items-center gap-3 min-w-0 pr-4">
                          <FileText className="w-5 h-5 text-indigo-650 shrink-0" />
                          <div className="truncate text-left">
                            <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{wizardAttachedFile.name}</p>
                            <p className="text-[10px] text-text-muted font-mono">{wizardAttachedFile.size} • {wizardAttachedFile.type?.toUpperCase()}</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setWizardAttachedFile(null)}
                          className="p-1.5 hover:bg-red-50 dark:hover:bg-red-950/20 text-slate-400 hover:text-red-650 rounded-lg transition shrink-0"
                          title="Remove attached file"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* STAGE 2: MILESTONES BUILDER */}
              {wizardCwStep === 2 && (
                <div className="space-y-5 animate-fade-in text-left">
                  <div className="p-3.5 bg-indigo-50/55 dark:bg-slate-800/30 border border-indigo-100 dark:border-indigo-900/40 rounded-xl">
                    <p className="font-bold text-slate-800 dark:text-indigo-200">Milestones Configurator</p>
                    <p className="text-[10.5px] text-text-secondary mt-0.5">
                      Add chronological sub-tasks representing course evaluation blocks. Students will track and fulfill each milestone in their active dashboards.
                    </p>
                  </div>

                  {/* Milestone input form */}
                  <div className="bg-slate-100/50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 p-4 rounded-xl space-y-4 text-left">
                    <h4 className="font-semibold text-slate-850 dark:text-slate-205 flex items-center gap-1.5 pb-2 border-b border-slate-200 dark:border-slate-800 text-xs">
                      <Plus className="w-4 h-4 text-indigo-650" />
                      Add Milestone Task
                    </h4>

                    <div className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        <div className="space-y-1.5 text-left">
                          <label className="block text-[10px] font-bold text-slate-650 uppercase">Milestone Topic *</label>
                          <input 
                            type="text"
                            placeholder="e.g. Project proposal, Sandbox Analysis"
                            value={msTopic}
                            onChange={(e) => setMsTopic(e.target.value)}
                            className="w-full p-2 border border-border dark:border-slate-850 bg-white dark:bg-slate-800 rounded-lg outline-none text-slate-900"
                          />
                        </div>
                        <div className="space-y-1.5 text-left">
                          <label className="block text-[10px] font-bold text-slate-650 uppercase">Submission Type *</label>
                          <select 
                            value={msSubmissionType}
                            onChange={(e) => setMsSubmissionType(e.target.value)}
                            className="w-full p-2 border border-border dark:border-slate-850 bg-white dark:bg-slate-800 rounded-lg outline-none text-slate-900"
                          >
                            <option value="file">File (PDF, Word Docx, Images, Zip &lt; 500MB)</option>
                            <option value="text">Online Text Input Only</option>
                            <option value="any">Any (Attachments, Text description, etc.)</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        <div className="space-y-1.5 text-left">
                          <label className="block text-[10px] font-bold text-slate-655 uppercase">Start Date *</label>
                          <input 
                            type="date"
                            value={msStartDate}
                            onChange={(e) => setMsStartDate(e.target.value)}
                            className="w-full p-2 border border-border dark:border-slate-850 bg-white dark:bg-slate-800 rounded-lg outline-none text-slate-900"
                          />
                        </div>
                        <div className="space-y-1.5 text-left">
                          <label className="block text-[10px] font-bold text-slate-655 uppercase">Due Date *</label>
                          <input 
                            type="date"
                            value={msDueDate}
                            onChange={(e) => setMsDueDate(e.target.value)}
                            className="w-full p-2 border border-border dark:border-slate-850 bg-white dark:bg-slate-800 rounded-lg outline-none text-slate-900"
                          />
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          if (!msTopic.trim()) {
                            alert('Milestone Topic is required.');
                            return;
                          }
                          if (!msStartDate || !msDueDate) {
                            alert('Both start and due dates are corresponding bounds.');
                            return;
                          }
                          if (new Date(msStartDate) > new Date(msDueDate)) {
                            alert('Start date cannot fall after the milestone due date.');
                            return;
                          }
                          const newMs = {
                            id: 'ms_' + Date.now() + Math.random().toString(36).substr(2, 4),
                            topic: msTopic.trim(),
                            submissionType: msSubmissionType,
                            startDate: msStartDate,
                            dueDate: msDueDate
                          };
                          setWizardMilestones([...wizardMilestones, newMs]);
                          // Reset milestone entry inputs
                          setMsTopic('');
                          setMsSubmissionType('file');
                          setMsStartDate('');
                          setMsDueDate('');
                        }}
                        className="w-full py-2 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/20 text-indigo-750 font-bold border border-indigo-200 dark:border-slate-800 rounded-lg flex items-center justify-center gap-1.5 transition"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Save & Add Milestone
                      </button>
                    </div>
                  </div>

                  {/* Milestones dynamic list section */}
                  <div className="space-y-3 text-left">
                    <h5 className="font-bold text-slate-750 dark:text-slate-350 text-[10.5px] uppercase tracking-wide">
                      Assigned Milestones Queue ({wizardMilestones.length})
                    </h5>

                    {wizardMilestones.length === 0 ? (
                      <div className="text-center p-6 border border-dashed border-slate-205 dark:border-slate-800 rounded-xl text-text-muted italic bg-slate-50/50">
                        No active milestones configured. Formulate a milestone above to start building the syllabus.
                      </div>
                    ) : (
                      <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                        {wizardMilestones.map((ms, index) => (
                          <div key={ms.id || index} className="flex justify-between items-center bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 p-3 rounded-xl shadow-xs transition hover:bg-slate-50/50">
                            <div className="space-y-1 truncate text-left pr-4">
                              <div className="font-bold text-slate-850 dark:text-slate-100 text-xs flex items-center gap-1.5">
                                <span className="bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-mono text-[9.5px] w-5 h-5 rounded-md flex items-center justify-center font-bold">
                                  {index + 1}
                                </span>
                                <span className="truncate">{ms.topic}</span>
                              </div>
                              <div className="flex flex-wrap gap-x-3.5 text-[10px] text-text-secondary font-mono">
                                <span>Type: <strong className="font-semibold text-slate-600 dark:text-slate-300">{ms.submissionType}</strong></span>
                                <span>Timeline: <strong>{ms.startDate}</strong> to <strong>{ms.dueDate}</strong></span>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setWizardMilestones(wizardMilestones.filter(item => item.id !== ms.id));
                              }}
                              className="p-1.5 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg text-slate-400 hover:text-red-650 transition shrink-0"
                              title="Delete milestone option"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* STAGE 3: OVERVIEW AND CONFIRMATION */}
              {wizardCwStep === 3 && (
                <div className="space-y-5 animate-fade-in text-left">
                  <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/15 border border-emerald-150 dark:border-emerald-900/40 rounded-xl text-emerald-950 dark:text-emerald-250">
                    <p className="font-bold">Verify Course Work Parameters</p>
                    <p className="text-[10px] opacity-90 mt-0.5">Please review the syllabus structure and configured milestones prior to publishing to Moodle.</p>
                  </div>

                  <div className="border border-slate-200 dark:border-slate-850 rounded-xl divide-y divide-slate-150 dark:divide-slate-800 overflow-hidden text-left">
                    <div className="p-4 bg-slate-50 dark:bg-slate-800/20 space-y-2.5 text-left">
                      <h4 className="font-bold font-serif text-slate-900 dark:text-slate-100 text-xs">Course Details</h4>
                      <div className="grid grid-cols-2 gap-2 text-[11px] text-text-secondary font-sans leading-relaxed">
                        <div>
                          <span className="text-text-muted">Course Code: </span>
                          <span className="text-slate-808 dark:text-slate-200 font-bold font-mono">{wizardCourseCode || 'N/A'}</span>
                        </div>
                        <div>
                          <span className="text-text-muted">Course Name: </span>
                          <span className="text-slate-808 dark:text-slate-200 font-bold">{wizardCourseName}</span>
                        </div>
                        <div>
                          <span className="text-text-muted">Programme: </span>
                          <span className="text-slate-808 dark:text-slate-200">{wizardProgramme}</span>
                        </div>
                        <div>
                          <span className="text-text-muted">Degree Level: </span>
                          <span className="text-slate-808 dark:text-slate-200">{wizardLevel} Level</span>
                        </div>
                      </div>
                    </div>

                    {wizardExtraMaterial && (
                      <div className="p-4 space-y-1.5 text-left bg-white dark:bg-slate-900">
                        <h4 className="font-bold text-slate-850 dark:text-slate-200 text-xs">Extra Material Guidelines:</h4>
                        <p className="text-[11px] text-text-secondary italic whitespace-pre-wrap leading-relaxed">{wizardExtraMaterial}</p>
                      </div>
                    )}

                    {wizardAttachedFile && (
                      <div className="p-4 space-y-1.5 text-left bg-white dark:bg-slate-900 border-t border-slate-150 dark:border-slate-800">
                        <h4 className="font-bold text-slate-850 dark:text-slate-200 text-xs">Attached File Reference:</h4>
                        <div className="inline-flex items-center gap-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 p-3 rounded-xl w-full max-w-md">
                          <FileText className="w-5 h-5 text-indigo-650 shrink-0" />
                          <div className="truncate text-left flex-1 min-w-0">
                            <p className="text-xs font-bold text-slate-850 dark:text-slate-205 truncate">{wizardAttachedFile.name}</p>
                            <p className="text-[10px] text-text-muted font-mono">{wizardAttachedFile.size}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="p-4 space-y-3 text-left bg-white dark:bg-slate-900">
                      <h4 className="font-bold text-slate-850 dark:text-slate-200 text-xs">Configured Milestones Timeline:</h4>
                      {wizardMilestones.length === 0 ? (
                        <p className="text-text-muted italic text-[11px]">No milestones configured.</p>
                      ) : (
                        <div className="space-y-2">
                          {wizardMilestones.map((ms, index) => (
                            <div key={ms.id || index} className="p-3 bg-slate-50 dark:bg-slate-800/30 rounded-lg flex items-center justify-between text-[11px] border border-slate-150 dark:border-slate-800 font-sans">
                              <div className="space-y-0.5 text-left pr-3">
                                <span className="font-bold text-slate-800 dark:text-slate-200">
                                  {index + 1}. M-Topic: {ms.topic}
                                </span>
                                <div className="text-[10px] text-text-muted">
                                  Submission Type: <span className="font-semibold text-slate-600 dark:text-slate-350">{ms.submissionType}</span>
                                </div>
                              </div>
                              <div className="text-right text-[10px] text-text-secondary font-mono shrink-0">
                                <div>Start Date: {ms.startDate}</div>
                                <div>Due Date: {ms.dueDate}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Modal Footer Controls */}
            <div className="p-5 border-t border-border bg-slate-50 dark:bg-slate-800/50 flex justify-between items-center shrink-0">
              <div>
                {wizardCwStep > 1 && (
                  <button
                    type="button"
                    onClick={() => setWizardCwStep(wizardCwStep - 1)}
                    className="px-4 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-lg hover:bg-slate-50 flex items-center gap-1 transition"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    Back
                  </button>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleCloseWizard}
                  className="px-4 py-2 text-text-secondary dark:text-slate-300 font-bold border border-transparent hover:bg-slate-200 dark:hover:bg-slate-750 rounded-lg transition"
                >
                  Cancel
                </button>

                {wizardCwStep < 3 ? (
                  <button
                    type="button"
                    onClick={() => {
                      if (wizardCwStep === 1) {
                        if (!wizardCourseName.trim() || !wizardCourseCode.trim()) {
                          alert('Fill out both the Course Code and Course Name to proceed.');
                          return;
                        }
                        setWizardCwStep(2);
                      } else if (wizardCwStep === 2) {
                        if (wizardMilestones.length === 0) {
                          alert('Please add at least 1 milestone to build the syllabus plan.');
                          return;
                        }
                        setWizardCwStep(3);
                      }
                    }}
                    className="px-5 py-2 bg-[#4f46e5] hover:bg-[#4338ca] text-white font-bold rounded-lg flex items-center gap-1 shadow-sm transition"
                  >
                    Next
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      // Final Submit
                      const finalDueDate = wizardMilestones.length > 0 
                        ? wizardMilestones[wizardMilestones.length - 1].dueDate 
                        : new Date().toISOString().split('T')[0];

                      const computedDesc = `Coursework for "${wizardCourseName}" containing the following milestone roadmap:
` + wizardMilestones.map((ms, index) => {
                        return `${index + 1}. Milestone: ${ms.topic}\n   - Start Date: ${ms.startDate}\n   - Due Date: ${ms.dueDate}\n   - Submission Type: ${ms.submissionType}`;
                      }).join('\n\n') + (wizardExtraMaterial ? `\n\nExtra Material Instructions:\n${wizardExtraMaterial}` : '');

                      // Register Coursework assignment in context
                      const finalCw = createCoursework(
                        wizardCourseName, // Title
                        wizardCourseCode.trim().toUpperCase(),
                        wizardCourseName,
                        wizardProgramme,
                        wizardLevel,
                        computedDesc,
                        finalDueDate,
                        100, // Default Points
                        true, // Is group assignment
                        'Milestone 1' // Default linked milestone
                      );

                      // Store structured metadata properties
                      finalCw.milestonesList = wizardMilestones;
                      finalCw.extraMaterial = wizardExtraMaterial;
                      finalCw.attachedFile = wizardAttachedFile;

                      // Reset wizard
                      setWizardCwStep(1);
                      setWizardCourseCode('');
                      setWizardCourseName('');
                      setWizardExtraMaterial('');
                      setWizardAttachedFile(null);
                      setWizardMilestones([]);
                      setShowCourseworkWizard(false);
                      // Show success response
                      alert(`Successfully published "${wizardCourseName}" course work syllabus with ${wizardMilestones.length} milestone phases.`);
                    }}
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg flex items-center gap-1 shadow-sm transition"
                  >
                    Confirm & Publish Course Work
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ================= MODAL: UPLOAD COURSE MATERIAL ================= */}
      {showUploadMaterialModal && (
        <div className="fixed inset-0 bg-primary-950/40 backdrop-blur-md flex items-center justify-center p-4 z-50 text-xs">
          <div className="bg-white dark:bg-slate-900 border border-border rounded-xl p-6 shadow-modal w-full max-w-md space-y-4 animate-scale-up text-text-primary">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center space-x-2">
                <Upload className="w-5 h-5 text-blue-600" />
                <h3 className="font-serif text-base font-bold">Upload Course Material</h3>
              </div>
              <button onClick={() => setShowUploadMaterialModal(false)} className="text-text-muted hover:text-text-primary">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUploadMaterialSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-text-secondary uppercase">
                  Associated Course *
                </label>
                <select 
                  required
                  value={materialCourseId}
                  onChange={(e) => setMaterialCourseId(e.target.value)}
                  className="w-full p-2.5 border border-border bg-surface rounded-lg font-sans outline-none focus:ring-1 focus:ring-blue-500 text-xs"
                >
                  <option value="">-- Choose Course --</option>
                  {courses.map(c => (
                    <option key={c.id} value={c.id}>{c.code}: {c.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-text-secondary uppercase">
                  Resource Title *
                </label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Lecture 04: Software Quality & Metrics.pdf"
                  value={materialTitle}
                  onChange={(e) => setMaterialTitle(e.target.value)}
                  className="w-full p-2.5 border border-border bg-surface-alt rounded-lg font-sans outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-text-secondary uppercase">
                  Resource Description
                </label>
                <textarea 
                  rows={3}
                  placeholder="Summary of lecture contents, key chapters, and instructions..."
                  value={materialDescription}
                  onChange={(e) => setMaterialDescription(e.target.value)}
                  className="w-full p-2.5 border border-border bg-surface-alt rounded-lg font-sans outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-text-secondary uppercase">
                  File Attachment
                </label>
                <input 
                  type="file" 
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setMaterialFileName(e.target.files[0].name);
                      setMaterialFileSize(`${(e.target.files[0].size / (1024 * 1024)).toFixed(1)} MB`);
                    }
                  }}
                  className="w-full text-xs text-text-secondary file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                />
              </div>

              <div className="flex space-x-2 pt-3">
                <button 
                  type="button" 
                  onClick={() => setShowUploadMaterialModal(false)}
                  className="flex-1 py-2.5 bg-surface border border-border rounded-lg font-bold text-text-secondary hover:bg-surface-alt transition cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-sm transition cursor-pointer"
                >
                  Upload Resource
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: CREATE QUIZ ================= */}
      {showCreateQuizModal && (
        <div className="fixed inset-0 bg-primary-950/40 backdrop-blur-md flex items-center justify-center p-4 z-50 text-xs">
          <div className="bg-white dark:bg-slate-900 border border-border rounded-xl p-6 shadow-modal w-full max-w-lg space-y-4 animate-scale-up text-text-primary max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center space-x-2">
                <HelpCircle className="w-5 h-5 text-indigo-600" />
                <h3 className="font-serif text-base font-bold">Create New Quiz</h3>
              </div>
              <button onClick={() => setShowCreateQuizModal(false)} className="text-text-muted hover:text-text-primary">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateQuizSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-text-secondary uppercase">
                  Target Course *
                </label>
                <select 
                  required
                  value={quizCourseId}
                  onChange={(e) => setQuizCourseId(e.target.value)}
                  className="w-full p-2.5 border border-border bg-surface rounded-lg font-sans outline-none focus:ring-1 focus:ring-indigo-500 text-xs"
                >
                  <option value="">-- Choose Course --</option>
                  {courses.map(c => (
                    <option key={c.id} value={c.id}>{c.code}: {c.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-text-secondary uppercase">
                  Quiz Title *
                </label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Mid-Term Architectural Quiz"
                  value={quizTitle}
                  onChange={(e) => setQuizTitle(e.target.value)}
                  className="w-full p-2.5 border border-border bg-surface-alt rounded-lg font-sans outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-text-secondary uppercase">
                    Due Date
                  </label>
                  <input 
                    type="date"
                    value={quizDueDate}
                    onChange={(e) => setQuizDueDate(e.target.value)}
                    className="w-full p-2.5 border border-border bg-surface-alt rounded-lg font-sans outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-text-secondary uppercase">
                    Time Limit (Mins)
                  </label>
                  <input 
                    type="number"
                    min="1"
                    value={quizTimeLimit}
                    onChange={(e) => setQuizTimeLimit(e.target.value)}
                    className="w-full p-2.5 border border-border bg-surface-alt rounded-lg font-sans outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-text-secondary uppercase">
                    Total Points
                  </label>
                  <input 
                    type="number"
                    min="1"
                    value={quizPoints}
                    onChange={(e) => setQuizPoints(e.target.value)}
                    className="w-full p-2.5 border border-border bg-surface-alt rounded-lg font-sans outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-text-secondary uppercase">
                  Instructions / Description
                </label>
                <textarea 
                  rows={2}
                  placeholder="Instructions for students taking this quiz..."
                  value={quizDescription}
                  onChange={(e) => setQuizDescription(e.target.value)}
                  className="w-full p-2.5 border border-border bg-surface-alt rounded-lg font-sans outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              {/* Quiz Questions List */}
              <div className="border border-border rounded-lg p-3 bg-surface-alt space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-[10px] uppercase text-text-muted">Questions ({quizQuestions.length})</span>
                  <button
                    type="button"
                    onClick={() => {
                      setQuizQuestions([
                        ...quizQuestions,
                        {
                          id: quizQuestions.length + 1,
                          question: `Sample Question #${quizQuestions.length + 1}`,
                          options: ['Option A', 'Option B', 'Option C', 'Option D'],
                          correctAnswer: 0,
                          points: 5
                        }
                      ]);
                    }}
                    className="text-[10px] font-bold text-indigo-600 hover:underline cursor-pointer"
                  >
                    + Add Question
                  </button>
                </div>

                <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                  {quizQuestions.map((q, idx) => (
                    <div key={idx} className="p-2 bg-surface rounded border border-border space-y-1 text-[11px]">
                      <div className="flex justify-between font-bold">
                        <span>Q{idx + 1}: {q.question}</span>
                        <span className="text-indigo-600 font-mono">{q.points} pts</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex space-x-2 pt-3">
                <button 
                  type="button" 
                  onClick={() => setShowCreateQuizModal(false)}
                  className="flex-1 py-2.5 bg-surface border border-border rounded-lg font-bold text-text-secondary hover:bg-surface-alt transition cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold shadow-sm transition cursor-pointer"
                >
                  Publish Quiz
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: TAKE QUIZ INTERFACE ================= */}
      {activeQuizToTake && (
        <div className="fixed inset-0 bg-primary-950/60 backdrop-blur-md flex items-center justify-center p-4 z-50 text-xs">
          <div className="bg-white dark:bg-slate-900 border border-border rounded-2xl p-6 shadow-2xl w-full max-w-xl space-y-5 animate-scale-up text-text-primary max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <span className="font-mono text-[10px] font-bold px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded border border-indigo-200 uppercase">
                  {activeQuizToTake.courseCode}
                </span>
                <h3 className="font-serif text-lg font-bold text-text-primary mt-1">{activeQuizToTake.title}</h3>
              </div>
              <button 
                onClick={() => {
                  setActiveQuizToTake(null);
                  setQuizResultScore(null);
                }} 
                className="text-text-muted hover:text-text-primary cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {quizResultScore !== null ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle className="w-10 h-10" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-serif text-xl font-bold text-text-primary">Quiz Complete!</h4>
                  <p className="text-text-secondary text-xs">Your answers have been submitted and evaluated.</p>
                </div>
                <div className="inline-block bg-surface-alt px-6 py-3 rounded-xl border border-border font-mono">
                  <span className="text-text-muted text-[10px] uppercase block font-bold">Your Total Score:</span>
                  <span className="text-2xl font-bold text-emerald-600">{quizResultScore} / {activeQuizToTake.totalPoints} PTS</span>
                </div>
                <div>
                  <button
                    onClick={() => {
                      setActiveQuizToTake(null);
                      setQuizResultScore(null);
                    }}
                    className="px-6 py-2.5 bg-primary-900 hover:bg-primary-800 text-white font-bold rounded-lg transition cursor-pointer"
                  >
                    Close Quiz
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmitQuizAnswers} className="space-y-6">
                <div className="bg-indigo-50 border border-indigo-150 rounded-xl p-3 flex items-center justify-between text-indigo-900">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-indigo-600" />
                    <span className="font-mono font-bold">Timer: {activeQuizToTake.timeLimit} Minutes Remaining</span>
                  </div>
                  <span className="font-mono text-[10px] font-bold uppercase">{activeQuizToTake.questions?.length || 0} Questions</span>
                </div>

                <div className="space-y-5">
                  {(activeQuizToTake.questions || []).map((q, qIdx) => (
                    <div key={qIdx} className="p-4 bg-surface-alt rounded-xl border border-border space-y-3">
                      <p className="font-bold text-sm text-text-primary">
                        Question {qIdx + 1}: <span className="font-normal">{q.question}</span>
                      </p>
                      <div className="space-y-2 pl-2">
                        {q.options.map((opt, optIdx) => (
                          <label key={optIdx} className="flex items-center space-x-2.5 p-2 bg-surface rounded-lg border border-border hover:border-indigo-300 transition cursor-pointer">
                            <input 
                              type="radio" 
                              name={`question_${qIdx}`}
                              checked={quizSelectedAnswers[qIdx] === optIdx}
                              onChange={() => {
                                setQuizSelectedAnswers({
                                  ...quizSelectedAnswers,
                                  [qIdx]: optIdx
                                });
                              }}
                              className="text-indigo-600 focus:ring-indigo-500"
                            />
                            <span className="text-xs text-text-primary font-medium">{opt}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end space-x-2 pt-3 border-t border-border">
                  <button 
                    type="button" 
                    onClick={() => setActiveQuizToTake(null)}
                    className="px-4 py-2 bg-surface border border-border rounded-lg font-bold text-text-secondary hover:bg-surface-alt transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-sm transition cursor-pointer flex items-center space-x-1"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Submit Answers</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}

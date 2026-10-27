import React, { useState, useEffect } from 'react';
import { useAppState } from '../../contexts/StateContext';
import { 
  HelpCircle, CheckSquare, Clock, Award, Plus, Search, Filter, 
  CheckCircle, AlertCircle, Play, FileText, ArrowRight, X, ChevronRight,
  RotateCcw, Sparkles, BookOpen, Users, BarChart2, Eye
} from 'lucide-react';

export default function QuizDashboard({ setActivePage }) {
  const { 
    quizzes = [], 
    courses = [], 
    currentUser, 
    createQuiz, 
    submitQuiz, 
    gradeQuiz 
  } = useAppState();

  const isStudent = currentUser?.role === 'student';
  const isLecturer = currentUser?.role === 'supervisor';
  const isAdmin = currentUser?.role === 'admin' || currentUser?.role === 'superadmin';

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourseFilter, setSelectedCourseFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL'); // 'ALL', 'PENDING', 'COMPLETED'
  const [activeTab, setActiveTab] = useState('quizzes'); // 'quizzes' | 'history' | 'manage'

  // Modal States
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeQuizToTake, setActiveQuizToTake] = useState(null);
  const [viewSubmissionsQuiz, setViewSubmissionsQuiz] = useState(null);

  // Taking Quiz State
  const [quizSelectedAnswers, setQuizSelectedAnswers] = useState({}); // questionId -> selectedOptionIndex
  const [quizResult, setQuizResult] = useState(null); // { score, totalPoints, percentage, breakdown }
  const [secondsRemaining, setSecondsRemaining] = useState(0);

  // New Quiz Form State
  const [formCourseId, setFormCourseId] = useState('');
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formDueDate, setFormDueDate] = useState('2026-09-15');
  const [formTimeLimit, setFormTimeLimit] = useState('15');
  const [formQuestions, setFormQuestions] = useState([
    {
      id: 'q1',
      question: 'Which of the following best defines distributed consensus in server topologies?',
      options: [
        'Centralized database locking on primary instance',
        'State machine replication agreement across independent nodes',
        'Asynchronous client-side local storage synchronization',
        'Stateless DNS load balancing round-robin distribution'
      ],
      correctAnswer: 1,
      points: 10
    },
    {
      id: 'q2',
      question: 'In Raft consensus protocol, what happens when a follower node misses heartbeats from the leader?',
      options: [
        'The follower immediately shuts down to avoid split brain',
        'The follower transitions to candidate state and initiates an election',
        'The leader node automatically revokes client access keys',
        'The follower delegates request routing to external proxies'
      ],
      correctAnswer: 1,
      points: 10
    }
  ]);

  // Handle Quiz Timer when activeQuizToTake is set
  useEffect(() => {
    let timer = null;
    if (activeQuizToTake && !quizResult && secondsRemaining > 0) {
      timer = setInterval(() => {
        setSecondsRemaining(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            handleAutoSubmitQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [activeQuizToTake, quizResult, secondsRemaining]);

  const handleStartQuiz = (quiz) => {
    setActiveQuizToTake(quiz);
    setQuizSelectedAnswers({});
    setQuizResult(null);
    const totalSecs = (parseInt(quiz.timeLimit) || 15) * 60;
    setSecondsRemaining(totalSecs);
  };

  const handleAutoSubmitQuiz = () => {
    if (!activeQuizToTake) return;
    processQuizSubmission();
  };

  const handleSubmitQuizAnswers = (e) => {
    if (e) e.preventDefault();
    processQuizSubmission();
  };

  const processQuizSubmission = () => {
    if (!activeQuizToTake) return;
    const questions = activeQuizToTake.questions || [];
    let calcScore = 0;
    let maxScore = activeQuizToTake.totalPoints || 20;

    questions.forEach(q => {
      const selected = quizSelectedAnswers[q.id];
      if (selected === q.correctAnswer) {
        calcScore += (q.points || 10);
      }
    });

    submitQuiz(activeQuizToTake.id, quizSelectedAnswers);

    setQuizResult({
      score: calcScore,
      totalPoints: maxScore,
      percentage: Math.round((calcScore / (maxScore || 1)) * 100)
    });
  };

  // Add question to new quiz builder
  const handleAddQuestion = () => {
    const qIndex = formQuestions.length + 1;
    setFormQuestions([
      ...formQuestions,
      {
        id: `q${Date.now()}_${qIndex}`,
        question: `Question #${qIndex}: Enter problem description...`,
        options: [
          'Option A description',
          'Option B description',
          'Option C description',
          'Option D description'
        ],
        correctAnswer: 0,
        points: 10
      }
    ]);
  };

  const handleCreateQuizSubmit = (e) => {
    e.preventDefault();
    if (!formTitle.trim() || !formCourseId) {
      alert('Please select a course and enter a quiz title.');
      return;
    }

    const calcTotalPts = formQuestions.reduce((acc, q) => acc + (parseInt(q.points) || 10), 0);

    createQuiz(
      formCourseId,
      formTitle.trim(),
      formDescription.trim(),
      formDueDate || '2026-09-30',
      parseInt(formTimeLimit) || 15,
      calcTotalPts || 20,
      formQuestions
    );

    setShowCreateModal(false);
    setFormTitle('');
    setFormDescription('');
    alert('New quiz created and published successfully!');
  };

  // Filtered Quiz List
  const filteredQuizzes = quizzes.filter(q => {
    const matchesSearch = q.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          q.courseCode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCourse = selectedCourseFilter === 'ALL' || q.courseCode === selectedCourseFilter;
    
    const mySub = (q.submissions || []).find(s => s.studentId === currentUser?.id);
    const matchesStatus = statusFilter === 'ALL' ? true :
                          statusFilter === 'PENDING' ? !mySub :
                          statusFilter === 'COMPLETED' ? !!mySub : true;

    return matchesSearch && matchesCourse && matchesStatus;
  });

  // Calculate student performance stats
  const completedCount = quizzes.filter(q => (q.submissions || []).some(s => s.studentId === currentUser?.id)).length;
  const pendingCount = quizzes.length - completedCount;
  const totalScoreEarned = quizzes.reduce((acc, q) => {
    const sub = (q.submissions || []).find(s => s.studentId === currentUser?.id);
    return acc + (sub?.score || 0);
  }, 0);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6 animate-fade-in text-text-primary text-xs">
      
      {/* 1. PAGE HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-4 border-b border-border gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-indigo-100 text-indigo-700 rounded-lg">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-serif text-2xl md:text-3xl font-bold text-primary-900">
                Interactive Quizzes & Assessments
              </h1>
              <p className="text-xs text-text-secondary mt-0.5">
                Timed knowledge evaluations, automated scoring, instant feedback, and academic test history.
              </p>
            </div>
          </div>
        </div>

        {(!isStudent || isAdmin) && (
          <button 
            onClick={() => {
              if (courses.length > 0) setFormCourseId(courses[0].id);
              setShowCreateModal(true);
            }}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold text-xs flex items-center space-x-2 shadow-xs transition cursor-pointer self-start md:self-auto shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Quiz</span>
          </button>
        )}
      </div>

      {/* 2. STATS OVERVIEW CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-surface p-4 rounded-xl border border-border shadow-xs flex items-center space-x-3.5">
          <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-lg">
            <CheckSquare className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-mono tracking-wider text-text-muted">Available Quizzes</span>
            <p className="font-serif text-xl font-bold mt-0.5 text-text-primary">{quizzes.length}</p>
            <p className="text-[10px] text-text-muted mt-0.5">Active Academic Tests</p>
          </div>
        </div>

        <div className="bg-surface p-4 rounded-xl border border-border shadow-xs flex items-center space-x-3.5">
          <div className="p-2.5 bg-amber-50 text-amber-600 rounded-lg">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-mono tracking-wider text-text-muted">Pending Attempt</span>
            <p className="font-serif text-xl font-bold mt-0.5 text-amber-700">{pendingCount}</p>
            <p className="text-[10px] text-amber-600 font-medium mt-0.5">Awaiting evaluation</p>
          </div>
        </div>

        <div className="bg-surface p-4 rounded-xl border border-border shadow-xs flex items-center space-x-3.5">
          <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-mono tracking-wider text-text-muted">Completed Tests</span>
            <p className="font-serif text-xl font-bold mt-0.5 text-emerald-700">{completedCount}</p>
            <p className="text-[10px] text-emerald-600 font-medium mt-0.5">Submissions recorded</p>
          </div>
        </div>

        <div className="bg-surface p-4 rounded-xl border border-border shadow-xs flex items-center space-x-3.5">
          <div className="p-2.5 bg-purple-50 text-purple-600 rounded-lg">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-mono tracking-wider text-text-muted">Total Score Earned</span>
            <p className="font-serif text-xl font-bold mt-0.5 text-purple-800">{totalScoreEarned} PTS</p>
            <p className="text-[10px] text-purple-600 font-medium mt-0.5">Cumulative Points</p>
          </div>
        </div>
      </div>

      {/* 3. TABS & FILTER BAR */}
      <div className="bg-surface border border-border rounded-xl p-4 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-border">
          
          {/* Sub-tabs */}
          <div className="flex space-x-1 bg-surface-alt p-1 rounded-lg border border-border font-semibold text-xs shrink-0">
            <button
              onClick={() => setActiveTab('quizzes')}
              className={`px-3.5 py-1.5 rounded-md transition cursor-pointer flex items-center space-x-1.5 ${
                activeTab === 'quizzes' ? 'bg-primary-900 text-white shadow-xs font-bold' : 'text-text-secondary hover:bg-surface'
              }`}
            >
              <CheckSquare className="w-3.5 h-3.5" />
              <span>All Quizzes ({filteredQuizzes.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-3.5 py-1.5 rounded-md transition cursor-pointer flex items-center space-x-1.5 ${
                activeTab === 'history' ? 'bg-primary-900 text-white shadow-xs font-bold' : 'text-text-secondary hover:bg-surface'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>My Submissions & Scores</span>
            </button>
          </div>

          {/* Search Input & Course Filter */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-text-muted" />
              <input 
                type="text" 
                placeholder="Search quiz title or code..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-surface-alt border border-border rounded-lg text-xs outline-none focus:border-indigo-500 font-sans"
              />
            </div>

            <select
              value={selectedCourseFilter}
              onChange={(e) => setSelectedCourseFilter(e.target.value)}
              className="px-3 py-1.5 bg-surface-alt border border-border rounded-lg text-xs font-mono outline-none cursor-pointer"
            >
              <option value="ALL">All Courses</option>
              {courses.map(c => (
                <option key={c.id} value={c.code}>{c.code} — {c.name}</option>
              ))}
            </select>

            {isStudent && (
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-1.5 bg-surface-alt border border-border rounded-lg text-xs font-sans outline-none cursor-pointer"
              >
                <option value="ALL">Status: All</option>
                <option value="PENDING">Pending Attempt</option>
                <option value="COMPLETED">Completed</option>
              </select>
            )}
          </div>
        </div>

        {/* 4. MAIN TAB CONTENT */}
        {activeTab === 'quizzes' && (
          <div>
            {filteredQuizzes.length === 0 ? (
              <div className="py-12 text-center text-text-muted space-y-2">
                <HelpCircle className="w-10 h-10 mx-auto opacity-30 text-indigo-500" />
                <p className="font-bold text-sm text-text-primary">No Quizzes Found</p>
                <p className="text-xs max-w-sm mx-auto">
                  No active quizzes match your search criteria. Instructors can publish timed quizzes for enrolled students.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredQuizzes.map(quiz => {
                  const mySub = (quiz.submissions || []).find(s => s.studentId === currentUser?.id);
                  const subCount = (quiz.submissions || []).length;

                  return (
                    <div 
                      key={quiz.id} 
                      className={`p-5 bg-surface border rounded-xl shadow-xs transition space-y-4 flex flex-col justify-between hover:border-indigo-400 ${
                        mySub ? 'border-emerald-300 bg-emerald-50/10' : 'border-border'
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-mono text-[10px] font-bold px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded border border-indigo-200">
                            {quiz.courseCode}
                          </span>
                          <span className="font-mono text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                            {quiz.totalPoints} PTS
                          </span>
                        </div>

                        <h3 className="font-serif text-sm font-bold text-text-primary mt-1 leading-snug">
                          {quiz.title}
                        </h3>

                        <p className="text-xs text-text-secondary line-clamp-2">
                          {quiz.description || 'Interactive course evaluation quiz.'}
                        </p>
                      </div>

                      <div className="space-y-3 pt-3 border-t border-border">
                        <div className="flex justify-between text-[11px] font-mono text-text-muted">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-indigo-500" />
                            {quiz.timeLimit} Mins Limit
                          </span>
                          <span>Due: {quiz.dueDate}</span>
                        </div>

                        {mySub ? (
                          <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between text-xs">
                            <div className="flex items-center space-x-2 text-emerald-800 font-bold">
                              <CheckCircle className="w-4 h-4 text-emerald-600" />
                              <span>Attempt Score:</span>
                            </div>
                            <span className="font-mono font-bold text-emerald-900 text-sm">
                              {mySub.score} / {quiz.totalPoints} PTS
                            </span>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleStartQuiz(quiz)}
                            className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-xs flex items-center justify-center space-x-2 transition cursor-pointer shadow-xs"
                          >
                            <Play className="w-3.5 h-3.5 fill-current" />
                            <span>Attempt Quiz Now</span>
                          </button>
                        )}

                        {(!isStudent || isAdmin) && (
                          <div className="pt-2 flex justify-between items-center text-[10px] font-mono text-text-muted border-t border-border/60">
                            <span>{subCount} Student Submissions</span>
                            <button
                              onClick={() => setViewSubmissionsQuiz(quiz)}
                              className="text-indigo-600 hover:underline font-bold flex items-center gap-1 cursor-pointer"
                            >
                              <Eye className="w-3 h-3" />
                              <span>Audit Results</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* 5. HISTORY / MY SUBMISSIONS TAB */}
        {activeTab === 'history' && (
          <div className="space-y-4">
            <h3 className="font-serif text-sm font-bold text-text-primary pb-2 border-b border-border">
              Completed Quiz History & Automated Feedback
            </h3>

            {quizzes.filter(q => (q.submissions || []).some(s => s.studentId === currentUser?.id)).length === 0 ? (
              <div className="py-10 text-center text-text-muted space-y-1">
                <p className="font-bold text-xs">No Completed Quizzes Recorded</p>
                <p className="text-[11px]">When you complete a quiz attempt, your score breakdown and feedback will appear here.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {quizzes.map(q => {
                  const sub = (q.submissions || []).find(s => s.studentId === currentUser?.id);
                  if (!sub) return null;

                  const pct = Math.round((sub.score / (q.totalPoints || 1)) * 100);

                  return (
                    <div key={q.id} className="p-4 bg-surface-alt border border-border rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-mono text-[9px] font-bold px-1.5 py-0.5 bg-indigo-50 text-indigo-700 rounded border border-indigo-200 uppercase">
                            {q.courseCode}
                          </span>
                          <span className="text-[10px] text-text-muted font-mono">Completed on {new Date(sub.submittedAt || Date.now()).toLocaleDateString()}</span>
                        </div>
                        <h4 className="font-serif text-xs font-bold text-text-primary">{q.title}</h4>
                        <p className="text-[11px] text-emerald-700 font-medium">{sub.feedback}</p>
                      </div>

                      <div className="flex items-center space-x-4 shrink-0">
                        <div className="text-right">
                          <span className="font-serif text-lg font-bold text-text-primary">{sub.score} / {q.totalPoints}</span>
                          <span className="block text-[10px] font-mono text-indigo-600 font-bold">{pct}% Grade</span>
                        </div>
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-xs ${
                          pct >= 70 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {pct >= 70 ? 'PASS' : 'REV'}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ================= MODAL 1: TAKE QUIZ INTERFACE ================= */}
      {activeQuizToTake && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface border border-border rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-scale-up">
            
            {/* Modal Header with Live Countdown */}
            <div className="p-4 bg-primary-900 text-white flex justify-between items-center shrink-0">
              <div className="space-y-0.5">
                <span className="font-mono text-[10px] font-bold px-2 py-0.5 bg-indigo-500/30 text-indigo-200 rounded uppercase">
                  {activeQuizToTake.courseCode} Quiz Attempt
                </span>
                <h3 className="font-serif text-base font-bold text-white">{activeQuizToTake.title}</h3>
              </div>

              {!quizResult && (
                <div className="flex items-center space-x-2 bg-white/10 px-3 py-1.5 rounded-lg border border-white/20 font-mono font-bold text-amber-300 text-xs">
                  <Clock className="w-4 h-4 text-amber-300 animate-pulse" />
                  <span>{formatTime(secondsRemaining)}</span>
                </div>
              )}
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              
              {quizResult ? (
                /* RESULT SCREEN */
                <div className="py-8 text-center space-y-4">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                    <CheckCircle className="w-10 h-10" />
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-serif text-2xl font-bold text-text-primary">Quiz Submission Complete!</h3>
                    <p className="text-xs text-text-secondary">Your evaluation answers have been processed and recorded.</p>
                  </div>

                  <div className="p-4 bg-surface-alt border border-border rounded-xl max-w-sm mx-auto space-y-1">
                    <span className="text-[10px] uppercase font-mono tracking-wider text-text-muted">Final Automated Score</span>
                    <p className="font-serif text-3xl font-bold text-emerald-600">
                      {quizResult.score} / {quizResult.totalPoints} PTS
                    </p>
                    <p className="text-xs font-mono font-bold text-indigo-700">
                      Score Percentage: {quizResult.percentage}%
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setActiveQuizToTake(null);
                      setQuizResult(null);
                    }}
                    className="px-6 py-2.5 bg-primary-900 hover:bg-primary-800 text-white font-bold rounded-lg text-xs transition cursor-pointer shadow-xs"
                  >
                    Return to Quiz Dashboard
                  </button>
                </div>
              ) : (
                /* QUESTION LIST FORM */
                <form onSubmit={handleSubmitQuizAnswers} className="space-y-6">
                  {(activeQuizToTake.questions || []).map((q, idx) => (
                    <div key={q.id || idx} className="p-4 bg-surface-alt border border-border rounded-xl space-y-3">
                      <div className="flex justify-between items-start">
                        <span className="font-mono text-[10px] font-bold text-indigo-600 uppercase">
                          Question {idx + 1} of {activeQuizToTake.questions.length}
                        </span>
                        <span className="font-mono text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                          {q.points || 10} PTS
                        </span>
                      </div>

                      <p className="font-serif text-sm font-bold text-text-primary leading-relaxed">
                        {q.question}
                      </p>

                      <div className="space-y-2 pt-1">
                        {(q.options || []).map((opt, optIdx) => (
                          <label 
                            key={optIdx}
                            className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition text-xs ${
                              quizSelectedAnswers[q.id] === optIdx 
                                ? 'bg-indigo-50 border-indigo-500 font-semibold text-indigo-900' 
                                : 'bg-surface border-border hover:bg-surface-alt text-text-primary'
                            }`}
                          >
                            <input 
                              type="radio" 
                              name={`question_${q.id}`}
                              checked={quizSelectedAnswers[q.id] === optIdx}
                              onChange={() => setQuizSelectedAnswers({
                                ...quizSelectedAnswers,
                                [q.id]: optIdx
                              })}
                              className="text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                            />
                            <span>{opt}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}

                  <div className="pt-4 border-t border-border flex justify-between items-center">
                    <button
                      type="button"
                      onClick={() => setActiveQuizToTake(null)}
                      className="px-4 py-2 border border-border hover:bg-surface-alt text-text-secondary rounded-lg font-bold text-xs transition cursor-pointer"
                    >
                      Cancel Attempt
                    </button>

                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs transition cursor-pointer shadow-xs"
                    >
                      Submit Quiz Answers Now
                    </button>
                  </div>
                </form>
              )}

            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL 2: CREATE QUIZ (LECTURER/ADMIN) ================= */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface border border-border rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-scale-up">
            
            <div className="p-4 bg-indigo-900 text-white flex justify-between items-center shrink-0">
              <h3 className="font-serif text-base font-bold flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Create & Publish New Quiz
              </h3>
              <button onClick={() => setShowCreateModal(false)} className="text-white/70 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateQuizSubmit} className="p-6 overflow-y-auto flex-1 space-y-5 text-xs">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-text-muted uppercase">Target Course *</label>
                  <select
                    required
                    value={formCourseId}
                    onChange={(e) => setFormCourseId(e.target.value)}
                    className="w-full h-9 px-3 bg-surface-alt border border-border rounded-lg text-xs outline-none focus:border-indigo-500 font-mono"
                  >
                    {courses.map(c => (
                      <option key={c.id} value={c.id}>{c.code} — {c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-text-muted uppercase">Quiz Title *</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Mid-Term Architectural Quiz" 
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="w-full h-9 px-3 bg-surface-alt border border-border rounded-lg text-xs outline-none focus:border-indigo-500 font-sans"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-text-muted uppercase">Due Date</label>
                  <input 
                    type="date" 
                    value={formDueDate}
                    onChange={(e) => setFormDueDate(e.target.value)}
                    className="w-full h-9 px-3 bg-surface-alt border border-border rounded-lg text-xs outline-none font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-text-muted uppercase">Time Limit (Minutes)</label>
                  <input 
                    type="number" 
                    value={formTimeLimit}
                    onChange={(e) => setFormTimeLimit(e.target.value)}
                    className="w-full h-9 px-3 bg-surface-alt border border-border rounded-lg text-xs outline-none font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-text-muted uppercase">Quiz Description / Directives</label>
                <textarea 
                  rows={2}
                  placeholder="Instructions for students taking this evaluation..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full p-2.5 bg-surface-alt border border-border rounded-lg text-xs outline-none font-sans"
                />
              </div>

              {/* Questions Builder */}
              <div className="space-y-3 pt-3 border-t border-border">
                <div className="flex justify-between items-center">
                  <h4 className="font-serif font-bold text-xs text-text-primary">
                    Quiz Questions ({formQuestions.length})
                  </h4>
                  <button 
                    type="button"
                    onClick={handleAddQuestion}
                    className="px-2.5 py-1 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 rounded font-bold text-[10px] flex items-center space-x-1 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Question</span>
                  </button>
                </div>

                <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                  {formQuestions.map((q, idx) => (
                    <div key={q.id || idx} className="p-3 bg-surface-alt border border-border rounded-xl space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-mono text-[10px] font-bold text-indigo-700">Question #{idx + 1}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-[10px] text-text-muted">Points:</span>
                          <input 
                            type="number"
                            value={q.points}
                            onChange={(e) => {
                              const updated = [...formQuestions];
                              updated[idx].points = parseInt(e.target.value) || 10;
                              setFormQuestions(updated);
                            }}
                            className="w-14 h-6 px-1.5 bg-surface border border-border rounded text-[10px] font-mono text-center"
                          />
                        </div>
                      </div>

                      <input 
                        type="text"
                        value={q.question}
                        onChange={(e) => {
                          const updated = [...formQuestions];
                          updated[idx].question = e.target.value;
                          setFormQuestions(updated);
                        }}
                        className="w-full h-8 px-2 bg-surface border border-border rounded text-xs font-semibold"
                      />

                      <div className="grid grid-cols-2 gap-2 pt-1">
                        {q.options.map((opt, optIdx) => (
                          <div key={optIdx} className="flex items-center space-x-1.5">
                            <input 
                              type="radio" 
                              name={`correct_${q.id}`}
                              checked={q.correctAnswer === optIdx}
                              onChange={() => {
                                const updated = [...formQuestions];
                                updated[idx].correctAnswer = optIdx;
                                setFormQuestions(updated);
                              }}
                              className="text-indigo-600"
                              title="Set as correct answer"
                            />
                            <input 
                              type="text"
                              value={opt}
                              onChange={(e) => {
                                const updated = [...formQuestions];
                                updated[idx].options[optIdx] = e.target.value;
                                setFormQuestions(updated);
                              }}
                              className="flex-1 h-7 px-2 bg-surface border border-border rounded text-[11px]"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-border flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border border-border text-text-secondary rounded-lg font-bold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold text-xs cursor-pointer shadow-xs"
                >
                  Publish Quiz
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL 3: AUDIT RESULTS ================= */}
      {viewSubmissionsQuiz && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface border border-border rounded-2xl w-full max-w-xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-scale-up">
            <div className="p-4 bg-primary-900 text-white flex justify-between items-center shrink-0">
              <div>
                <span className="font-mono text-[10px] font-bold px-2 py-0.5 bg-white/20 text-white rounded uppercase">
                  {viewSubmissionsQuiz.courseCode}
                </span>
                <h3 className="font-serif text-sm font-bold text-white mt-1">{viewSubmissionsQuiz.title}</h3>
              </div>
              <button onClick={() => setViewSubmissionsQuiz(null)} className="text-white/70 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto flex-1 space-y-3 text-xs">
              <h4 className="font-serif font-bold text-text-primary pb-2 border-b border-border">
                Student Submissions ({viewSubmissionsQuiz.submissions?.length || 0})
              </h4>

              {(!viewSubmissionsQuiz.submissions || viewSubmissionsQuiz.submissions.length === 0) ? (
                <p className="text-center py-6 text-text-muted">No student submissions recorded for this quiz yet.</p>
              ) : (
                <div className="space-y-2">
                  {viewSubmissionsQuiz.submissions.map((sub, idx) => (
                    <div key={idx} className="p-3 bg-surface-alt border border-border rounded-lg flex justify-between items-center">
                      <div>
                        <p className="font-bold text-text-primary">Student ID: {sub.studentId}</p>
                        <p className="text-[10px] text-text-muted font-mono">{new Date(sub.submittedAt).toLocaleString()}</p>
                      </div>
                      <div className="text-right">
                        <span className="font-mono font-bold text-emerald-700 text-sm">
                          {sub.score} / {viewSubmissionsQuiz.totalPoints} PTS
                        </span>
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
  );
}

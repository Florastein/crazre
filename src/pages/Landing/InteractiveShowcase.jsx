import React, { useState } from 'react';
import { 
  BookOpen, Presentation, FileText, FileCode, CheckCircle, Clock, 
  ChevronRight, Award, Download, Check, AlertCircle, RefreshCw
} from 'lucide-react';

export default function InteractiveShowcase() {
  const [activeTab, setActiveTab] = useState('materials'); // 'materials' | 'milestones' | 'quiz'

  // Tab 1 state: Course Materials filter
  const [formatFilter, setFormatFilter] = useState('all');
  const [downloadedItem, setDownloadedItem] = useState(null);

  const sampleMaterials = [
    {
      id: 'm1',
      title: 'Lecture Slides: Paxos & Raft Consensus Protocols',
      course: 'CS 402 • Advanced Distributed Systems',
      category: 'Lecture Notes',
      format: 'pptx',
      formatLabel: 'PowerPoint (.pptx)',
      size: '4.8 MB',
      icon: Presentation,
      color: 'text-amber-700 bg-amber-50 border-amber-200'
    },
    {
      id: 'm2',
      title: 'Runtime Sandbox Architecture Specifications',
      course: 'SE 406 • Secure Software Engineering',
      category: 'Lab Manual',
      format: 'docx',
      formatLabel: 'Word Document (.docx)',
      size: '1.8 MB',
      icon: FileText,
      color: 'text-blue-700 bg-blue-50 border-blue-200'
    },
    {
      id: 'm3',
      title: 'Component Routing & Architecture Blueprints',
      course: 'CS 410 • Advanced Program Architecture',
      category: 'Reference Reading',
      format: 'pdf',
      formatLabel: 'PDF Document (.pdf)',
      size: '3.1 MB',
      icon: FileText,
      color: 'text-rose-700 bg-rose-50 border-rose-200'
    },
    {
      id: 'm4',
      title: 'Lab 1 Setup Commands & Environment Variables',
      course: 'CS 402 • Advanced Distributed Systems',
      category: 'Setup Guide',
      format: 'txt',
      formatLabel: 'Text Document (.txt)',
      size: '120 KB',
      icon: FileCode,
      color: 'text-emerald-700 bg-emerald-50 border-emerald-200'
    }
  ];

  const filteredMaterials = sampleMaterials.filter(item => 
    formatFilter === 'all' ? true : item.format === formatFilter
  );

  const handleSimulatedDownload = (title) => {
    setDownloadedItem(title);
    setTimeout(() => setDownloadedItem(null), 3000);
  };

  // Tab 2 state: Milestones selection
  const [selectedMilestone, setSelectedMilestone] = useState(3);
  const sampleMilestones = [
    {
      id: 1,
      title: 'Project Proposal & Scope Definition',
      status: 'Approved',
      date: 'Feb 20, 2026',
      notes: 'Clear formal objectives, supervisor-signed commitment, approved scope.'
    },
    {
      id: 2,
      title: 'Literature Review & Architecture Design',
      status: 'Approved',
      date: 'Mar 15, 2026',
      notes: '15 peer-reviewed references included. Clean UML specifications.'
    },
    {
      id: 3,
      title: 'System Engineering & Baseline Implementation',
      status: 'Approved',
      date: 'Apr 22, 2026',
      notes: 'Benchmark results verify performance under network partition simulations.'
    },
    {
      id: 4,
      title: 'Evaluation, Testing & Draft Chapters 1-4',
      status: 'In Review',
      date: 'May 25, 2026',
      notes: 'Draft uploaded by Sarah Al-Zaid. Awaiting supervisor remarks.'
    },
    {
      id: 5,
      title: 'Final Defense Presentation & Report Manuscript',
      status: 'Upcoming',
      date: 'Jun 15, 2026',
      notes: 'Final hard copy deposit and faculty committee defense.'
    }
  ];

  // Tab 3 state: Live Quiz
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [submittedQuiz, setSubmittedQuiz] = useState(false);

  const quizOptions = [
    'Receiving vote confirmation from a majority quorum of nodes',
    'Timing out during heartbeat interval without an active candidate',
    'Manual override trigger from the department server admin',
    'Executing a memory RPC lock call directly on the client'
  ];
  const correctAnswerIndex = 0;

  const handleResetQuiz = () => {
    setSelectedAnswer(null);
    setSubmittedQuiz(false);
  };

  return (
    <section id="showcase" className="relative overflow-hidden py-16 lg:py-24 bg-white border-b border-slate-200">
      {/* Subtle fine dot texture overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}
      />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h2 className="font-outfit text-3xl sm:text-4xl font-light text-slate-900 tracking-tight">
            Experience how acaDEX functions in real time.
          </h2>
          <p className="mt-3 text-sm text-slate-600 font-sans">
            Click through the tabs below to test live components without needing to log in first.
          </p>
        </div>

        {/* Tab Selection Navigation */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          <button
            onClick={() => setActiveTab('materials')}
            className={`px-5 py-2.5 text-xs font-semibold transition cursor-pointer border ${
              activeTab === 'materials'
                ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
            }`}
          >
            Course Materials & Formats
          </button>
          <button
            onClick={() => setActiveTab('milestones')}
            className={`px-5 py-2.5 text-xs font-semibold transition cursor-pointer border ${
              activeTab === 'milestones'
                ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
            }`}
          >
            Project Milestones Supervision
          </button>
          <button
            onClick={() => setActiveTab('quiz')}
            className={`px-5 py-2.5 text-xs font-semibold transition cursor-pointer border ${
              activeTab === 'quiz'
                ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
            }`}
          >
            Sample Interactive Quiz
          </button>
        </div>

        {/* Tab Content Display Container */}
        <div className="bg-white border border-slate-300 shadow-sm p-6 sm:p-8 max-w-5xl mx-auto">
          
          {/* 1. COURSE MATERIALS SHOWCASE */}
          {activeTab === 'materials' && (
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 mb-6">
                <div>
                  <h3 className="font-serif italic text-xl font-bold text-slate-900">
                    Course Learning Documents
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Lecturers upload slides in PowerPoint, guides in Word, readings in PDF, and instructions in Text.
                  </p>
                </div>

                {/* Format Filter Buttons */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                  <span className="text-[11px] font-mono text-slate-400 mr-1 hidden sm:inline">Filter:</span>
                  {[
                    { id: 'all', label: 'All Formats' },
                    { id: 'pptx', label: 'PowerPoint' },
                    { id: 'docx', label: 'Word' },
                    { id: 'pdf', label: 'PDF' },
                    { id: 'txt', label: 'Text' }
                  ].map(f => (
                    <button
                      key={f.id}
                      onClick={() => setFormatFilter(f.id)}
                      className={`px-2.5 py-1 text-[11px] font-medium transition cursor-pointer border ${
                        formatFilter === f.id
                          ? 'bg-slate-800 text-white border-slate-800'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              {downloadedItem && (
                <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center space-x-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Download simulated successfully: <strong>{downloadedItem}</strong></span>
                </div>
              )}

              {/* Material List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredMaterials.map(mat => {
                  const Icon = mat.icon;
                  return (
                    <div 
                      key={mat.id}
                      className="p-4 bg-slate-50 border border-slate-200 hover:border-slate-300 transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 border ${mat.color}`}>
                            {mat.formatLabel}
                          </span>
                          <span className="text-[11px] text-slate-400 font-mono">{mat.size}</span>
                        </div>
                        <h4 className="text-sm font-semibold text-slate-900 leading-snug">
                          {mat.title}
                        </h4>
                        <p className="text-xs text-slate-500 mt-1 font-sans">
                          {mat.course}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-center justify-between">
                        <span className="text-[11px] text-slate-500 font-medium">{mat.category}</span>
                        <button
                          onClick={() => handleSimulatedDownload(mat.title)}
                          className="px-3 py-1 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 text-xs font-medium flex items-center space-x-1.5 transition cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 pt-4 border-t border-slate-200 text-center">
                <span className="text-xs text-slate-500">
                  Showing {filteredMaterials.length} of {sampleMaterials.length} materials. In the full portal, instructors can upload custom files directly from their desktop.
                </span>
              </div>
            </div>
          )}

          {/* 2. PROJECT MILESTONES SHOWCASE */}
          {activeTab === 'milestones' && (
            <div>
              <div className="pb-6 border-b border-slate-200 mb-6">
                <h3 className="font-serif italic text-xl font-bold text-slate-900">
                  Research Project Milestone Tracking
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Students complete projects stage-by-stage. Each milestone requires supervisor sign-off before advancing.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Milestone Stepper */}
                <div className="lg:col-span-1 space-y-2">
                  <span className="text-[11px] font-mono uppercase text-slate-400 font-semibold block mb-2">
                    Project Stage List
                  </span>
                  {sampleMilestones.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setSelectedMilestone(m.id)}
                      className={`w-full text-left p-3 text-xs border transition cursor-pointer flex items-center justify-between ${
                        selectedMilestone === m.id
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <div className="truncate mr-2">
                        <span className="font-mono text-[10px] block opacity-75">Stage {m.id}</span>
                        <span className="font-medium truncate block">{m.title}</span>
                      </div>
                      <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 border shrink-0 ${
                        m.status === 'Approved'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                          : m.status === 'In Review'
                          ? 'bg-amber-50 text-amber-700 border-amber-300'
                          : 'bg-slate-100 text-slate-500 border-slate-300'
                      }`}>
                        {m.status}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Milestone Details Card */}
                <div className="lg:col-span-2 p-6 bg-slate-50 border border-slate-200 flex flex-col justify-between">
                  <div>
                    {(() => {
                      const curr = sampleMilestones.find(m => m.id === selectedMilestone);
                      return (
                        <>
                          <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                            <div>
                              <span className="text-[10px] font-mono uppercase text-slate-500 font-bold">
                                Stage {curr.id} Details
                              </span>
                              <h4 className="text-base font-bold text-slate-900 mt-0.5 font-sans">
                                {curr.title}
                              </h4>
                            </div>
                            <span className="text-xs font-mono text-slate-500">
                              Target Due: {curr.date}
                            </span>
                          </div>

                          <div className="mt-4 space-y-4">
                            <div>
                              <span className="text-xs font-bold text-slate-700 uppercase font-mono tracking-wider block mb-1">
                                Evaluation Criteria & Notes:
                              </span>
                              <p className="text-xs text-slate-600 bg-white p-3 border border-slate-200 leading-relaxed">
                                {curr.notes}
                              </p>
                            </div>

                            <div className="p-3 bg-white border border-slate-200 text-xs">
                              <span className="font-bold text-slate-800 block mb-1">Supervisor Sign-Off:</span>
                              <p className="text-slate-600">
                                Dr. Arthur Sterling (Lead Faculty Supervisor). All submissions undergo automatic document version logging.
                              </p>
                            </div>
                          </div>
                        </>
                      );
                    })()}
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between">
                    <span>Group: <strong>Team Alpha</strong> (Sarah Al-Zaid & Liam Henderson)</span>
                    <span className="text-emerald-700 font-medium">Active Supervision Cycle</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 3. INTERACTIVE QUIZ SHOWCASE */}
          {activeTab === 'quiz' && (
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-slate-200 mb-6">
                <div>
                  <h3 className="font-serif italic text-xl font-bold text-slate-900">
                    Interactive Knowledge Assessment
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Try answering the sample quiz question below to see live automatic grading.
                  </p>
                </div>

                <div className="flex items-center space-x-2 text-xs font-mono text-slate-600 bg-slate-100 px-3 py-1.5 border border-slate-200">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  <span>Time Limit: 15 min</span>
                </div>
              </div>

              <div className="p-6 bg-slate-50 border border-slate-200">
                <div className="mb-4">
                  <span className="text-[10px] font-mono uppercase font-bold text-slate-400">
                    Question 1 of 1 • 10 Points
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 mt-1">
                    In distributed systems, what condition ensures that a leader election can be safely concluded in Raft consensus?
                  </h4>
                </div>

                {/* Option selections */}
                <div className="space-y-2 mb-6">
                  {quizOptions.map((opt, idx) => {
                    const isSelected = selectedAnswer === idx;
                    const isCorrect = idx === correctAnswerIndex;
                    let optionStyle = 'bg-white border-slate-300 text-slate-700 hover:border-slate-400';

                    if (submittedQuiz) {
                      if (isCorrect) {
                        optionStyle = 'bg-emerald-50 border-emerald-500 text-emerald-900 font-semibold';
                      } else if (isSelected && !isCorrect) {
                        optionStyle = 'bg-rose-50 border-rose-500 text-rose-900';
                      } else {
                        optionStyle = 'bg-white border-slate-200 text-slate-400';
                      }
                    } else if (isSelected) {
                      optionStyle = 'bg-slate-900 border-slate-900 text-white font-medium';
                    }

                    return (
                      <button
                        key={idx}
                        disabled={submittedQuiz}
                        onClick={() => setSelectedAnswer(idx)}
                        className={`w-full text-left p-3.5 text-xs border transition cursor-pointer flex items-center justify-between ${optionStyle}`}
                      >
                        <span className="leading-snug">{opt}</span>
                        {submittedQuiz && isCorrect && (
                          <Check className="w-4 h-4 text-emerald-600 shrink-0 ml-2" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Submit / Reset Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                  {!submittedQuiz ? (
                    <button
                      disabled={selectedAnswer === null}
                      onClick={() => setSubmittedQuiz(true)}
                      className={`px-5 py-2.5 text-xs font-semibold transition cursor-pointer ${
                        selectedAnswer !== null
                          ? 'bg-slate-900 hover:bg-slate-800 text-white shadow-xs'
                          : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      Check Answer
                    </button>
                  ) : (
                    <div className="flex items-center space-x-4">
                      <span className={`text-xs font-bold ${
                        selectedAnswer === correctAnswerIndex ? 'text-emerald-700' : 'text-rose-700'
                      }`}>
                        {selectedAnswer === correctAnswerIndex
                          ? 'Correct! Score: 10 / 10'
                          : 'Incorrect. The correct answer requires majority quorum consensus.'}
                      </span>
                      <button
                        onClick={handleResetQuiz}
                        className="px-3 py-1.5 text-xs border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 flex items-center space-x-1.5 transition cursor-pointer"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>Try Again</span>
                      </button>
                    </div>
                  )}

                  <span className="text-[11px] text-slate-400 font-mono">
                    Instant Auto-Grading Engine
                  </span>
                </div>
              </div>

            </div>
          )}

        </div>

      </div>
    </section>
  );
}

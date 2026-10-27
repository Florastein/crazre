import React, { useState } from 'react';
import { useAppState } from '../../contexts/StateContext';
import { 
  X, Highlighter, MessageSquare, Check, Trash2, Plus, CheckCircle, 
  HelpCircle, ChevronRight, FileText, Send, CornerDownRight, 
  CheckSquare, Square, AlertTriangle, ShieldCheck, Tag, Info,
  BookOpen, TrendingUp, Cpu, PenTool, Award, AlertCircle, Bookmark, ThumbsUp
} from 'lucide-react';

// Mock technical document chapters based on document name
const getDocumentMockContent = (docName) => {
  const normName = docName ? docName.toLowerCase() : '';
  if (normName.includes('proposal')) {
    return {
      title: "Project Proposal & Scope Definition Outline",
      subtitle: "High-Performance Consensus Protocols and Sandbox Environments",
      chapters: [
        {
          id: "p1",
          section: "Section I — Abstract & Academic Hypothesis",
          text: "This project outlines standard architectural frameworks for distributed data synchronization. With the growth of modern edge topologies, maintaining atomic latency boundaries remains an open computer science problem. We propose a decentralized consensus protocol running sandbox-hardened code execution engines to minimize consensus drift under strict memory footprint caps."
        },
        {
          id: "p2",
          section: "Section II — Systemic Problem Statement",
          text: "Contemporary data platforms suffer from high latency penalties during physical network partition failures. Traditional algorithms (such as Paxos or Raft) require stable low-latency round trips to coordinate leader validation. When running over shared public internet nodes, random jitter and 30% packet drops degrade performance by order of magnitude, causing split-brain execution loops."
        },
        {
          id: "p3",
          section: "Section III — Core Technical Deliverables",
          text: "Our research targets three primary execution metrics: First, develop a high-concurrency event loop designed for WebAssembly-native consensus. Second, provide secure memory-mapped heap sandboxes guaranteeing module integrity. Third, achieve less than 50ms election overhead during 35% packet drops to prevent system degradation."
        },
        {
          id: "p4",
          section: "Section IV — Roadmap & Structural Milestones",
          text: "The implementation will be modularized into three execution layers. First, a multiplexed transport module managing TCP state pools. Second, a deterministic host runtime invoking compiled WASM modules. Third, a validation benchmark suite asserting data replication invariants over simulated network partitions."
        }
      ]
    };
  } else if (normName.includes('architecture')) {
    return {
      title: "Decentralized Topology & Memory Architecture Specification",
      subtitle: "gRPC Communication Protocols and Sandboxing Boundaries",
      chapters: [
        {
          id: "p1",
          section: "Section I — Topographic Consensus Layout",
          text: "Our physical topology comprises standard coordinator nodes running compiled sandboxed engines. Communication is driven exclusively via protocol-buffer-encoded gRPC channels with asynchronous heartbeats. To survive Byzantine failures, we implement a memory-isolated replica log backed by a ring of memory-mapped flash registers."
        },
        {
          id: "p2",
          section: "Section II — Sandboxed Memory Security Guarantees",
          text: "To run untrusted third-party contracts, nodes leverage WebAssembly linear heaps bounded strictly to 128MB. Any attempt to write outside the page boundaries triggers an automatic out-of-bounds trap, freezing the offending execution thread and initiating coordinator election without compromising adjacent modules."
        },
        {
          id: "p3",
          section: "Section III — Heartbeat Protocols & RPC Specifications",
          text: "System communication vectors are modeled using protobuf schemas where AppendEntries is called concurrently. Heartbeats are configured to broadcast at a jitter-fortified interval of 150ms. Election timeouts dynamically scale from 300ms to 600ms utilizing a seed-based pseudorandom distribution to mitigate concurrent election collisions."
        },
        {
          id: "p4",
          section: "Section IV — Consensus Log Replication State Machine",
          text: "The state machine manages state transitions through a monotonic index. Replicas buffer uncommitted entries until a majority of live network nodes acknowledge write receipts. Under high partition scenarios, the quorum calculation dynamically disables non-verifiable telemetry feedback loops."
        }
      ]
    };
  } else {
    // Default evaluation, bibliography, or draft text
    return {
      title: "Experimental Evaluation & Performance Chapter Review",
      subtitle: "Stress Benchmarking under Partition-Loss Injector Scenarios",
      chapters: [
        {
          id: "p1",
          section: "Section I — Experimental Evaluation Design",
          text: "Testing was conducted on virtual clusters simulating variable packet delay (10ms - 250ms) and loss coefficients (0% to 45%). We compared our event-driven sandbox host against standard system execution runtimes to evaluate runtime container context-switch costs."
        },
        {
          id: "p2",
          section: "Section II — Latency Metrics under Packet Loss",
          text: "Under nominal network states (0% packet drop), consensus convergence was achieved in 12ms. When packet drop was elevated to 35%, our adaptive round-trip tracking model maintained active quorum transitions at 62ms, which represents a 4.1x performance increase compared to baseline Raft libraries."
        },
        {
          id: "p3",
          section: "Section III — WebAssembly Performance Overhead",
          text: "Compiled C++ WASM benchmarks demonstrate that modular virtualization introduces only 4.8% CPU cycle penalties compared to native execution. This acceptable overhead is heavily offset by the 100% thread isolation security guarantees achieved during runtime boundary tests."
        },
        {
          id: "p4",
          section: "Section IV — Project Report Concluding Graph Analyses",
          text: "Future research will expand the network loss emulator matrix to model high-density satellite constellation paths. High-orbit delay distributions show unique spikes that may require advanced sliding-window heartbeats to protect cluster stability."
        }
      ]
    };
  }
};

const COLOR_MAPS = {
  yellow: {
    bg: 'bg-yellow-105 bg-yellow-100 dark:bg-yellow-950/40 text-yellow-900 dark:text-yellow-100',
    border: 'border-yellow-200 dark:border-yellow-800',
    marker: 'bg-yellow-400 dark:bg-yellow-500'
  },
  green: {
    bg: 'bg-emerald-55 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-100',
    border: 'border-emerald-200 dark:border-emerald-800',
    marker: 'bg-emerald-400 dark:bg-emerald-500'
  },
  blue: {
    bg: 'bg-indigo-55 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-100',
    border: 'border-indigo-200 dark:border-indigo-800',
    marker: 'bg-indigo-400 dark:bg-indigo-500'
  },
  orange: {
    bg: 'bg-amber-55 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-100',
    border: 'border-amber-200 dark:border-amber-800',
    marker: 'bg-amber-400 dark:bg-amber-500'
  }
};

export default function DocReviewStudio({ doc, onClose }) {
  const { currentRole, currentUser, updateDocumentAnnotations, reviewSubmission } = useAppState();
  
  // Local Copy of active document annotations
  const [annotations, setAnnotations] = useState(() => doc.annotations || []);
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'pending' | 'resolved'
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('all'); // 'all' | 'critical' | 'formatting' | 'suggestion' | 'praise'
  const [selectedParagraphId, setSelectedParagraphId] = useState(null);
  const [selectionCoords, setSelectionCoords] = useState(null);
  
  // Form variables for adding annotations
  const [newComment, setNewComment] = useState('');
  const [selectedText, setSelectedText] = useState('');
  const [highlightColor, setHighlightColor] = useState('yellow');
  const [severity, setSeverity] = useState('suggestion'); // 'critical' | 'formatting' | 'suggestion' | 'praise'
  const [showAddForm, setShowAddForm] = useState(false);
  const [annotationType, setAnnotationType] = useState('comment'); // 'comment' | 'highlight'

  // Pre-saved academic templates for super fast high-accuracy supervisor annotations
  const SUGGESTION_TEMPLATES = [
    { label: 'Cite Literature', icon: 'BookOpen', text: 'This academic assertion requires formal replication citations or primary source analysis.', severity: 'suggestion' },
    { label: 'Unsubstantiated Assertion', icon: 'AlertCircle', text: 'Avoid declarations unsupported by physical quantitative graphs or laboratory tests.', severity: 'critical' },
    { label: 'Inconsistent Projections', icon: 'TrendingUp', text: 'Ensure methodology models are fully outlined with standard mathematical proof formulas.', severity: 'critical' },
    { label: 'Explain Layout', icon: 'Cpu', text: 'Please detail physical node layout boundaries or gRPC buffer specs explicitly in this paragraph.', severity: 'suggestion' },
    { label: 'Grammar Flaw', icon: 'PenTool', text: 'Contains voice shifts or phrasing flaws. Refactor to formal objective science format.', severity: 'formatting' },
    { label: 'Perfect Formulation', icon: 'Award', text: 'Excellent logic. The analysis perfectly outlines network replication safety bounds.', severity: 'praise' }
  ];

  const renderTemplateIcon = (iconName) => {
    switch (iconName) {
      case 'BookOpen':
        return <BookOpen className="w-3.5 h-3.5 text-indigo-550 text-indigo-500 shrink-0" />;
      case 'AlertCircle':
        return <AlertCircle className="w-3.5 h-3.5 text-red-500 shrink-0" />;
      case 'TrendingUp':
        return <TrendingUp className="w-3.5 h-3.5 text-amber-500 shrink-0" />;
      case 'Cpu':
        return <Cpu className="w-3.5 h-3.5 text-purple-600 dark:text-orange-300 shrink-0" />;
      case 'PenTool':
        return <PenTool className="w-3.5 h-3.5 text-blue-500 shrink-0" />;
      case 'Award':
        return <Award className="w-3.5 h-3.5 text-emerald-500 shrink-0" />;
      default:
        return <FileText className="w-3.5 h-3.5 shrink-0" />;
    }
  };

  // Input for thread replies
  const [replyInputs, setReplyInputs] = useState({});

  const isSupervisor = currentRole === 'supervisor';
  const docContent = getDocumentMockContent(doc.name);

  // Sync back to context on update
  const handleSaveAnnotations = (updated) => {
    setAnnotations(updated);
    updateDocumentAnnotations(doc.id, updated);
  };

  // Create highlighters / notes
  const handleAddAnnotation = (e) => {
    e.preventDefault();
    if (!newComment.trim()) {
      alert('Review commentary cannot be empty.');
      return;
    }

    const newAnno = {
      id: 'anno_' + Date.now(),
      paragraphId: selectedParagraphId || 'p1',
      type: annotationType,
      severity: severity,
      textSelection: annotationType === 'highlight' ? (selectedText || 'Selected snippet') : null,
      color: annotationType === 'highlight' ? highlightColor : null,
      comment: newComment,
      authorName: currentUser?.name || 'Supervisor Reviewer',
      authorId: currentUser?.id || 'sup1',
      createdAt: new Date().toISOString(),
      resolved: false,
      replies: []
    };

    const updated = [...annotations, newAnno];
    handleSaveAnnotations(updated);
    
    // Reset forms
    setNewComment('');
    setSelectedText('');
    setSelectedParagraphId(null);
    setShowAddForm(false);
  };

  const handleDeleteAnnotation = (annoId) => {
    const updated = annotations.filter(a => a.id !== annoId);
    handleSaveAnnotations(updated);
  };

  const handleToggleResolve = (annoId) => {
    const updated = annotations.map(a => 
      a.id === annoId ? { ...a, resolved: !a.resolved } : a
    );
    handleSaveAnnotations(updated);
  };

  const handlePostReply = (e, annoId) => {
    e.preventDefault();
    const replyText = replyInputs[annoId];
    if (!replyText || !replyText.trim()) return;

    const newReply = {
      id: 'rep_' + Date.now(),
      authorName: currentUser?.name || 'Student Author',
      comment: replyText,
      createdAt: new Date().toISOString()
    };

    const updated = annotations.map(a => {
      if (a.id === annoId) {
        return {
          ...a,
          replies: [...(a.replies || []), newReply]
        };
      }
      return a;
    });

    handleSaveAnnotations(updated);
    setReplyInputs(prev => ({ ...prev, [annoId]: '' }));
  };

  // Pre-configured phrases in chapter paragraphs that supervisors can quickly highlight
  const handleQuickHighlight = (paraId, phrase, color) => {
    if (!isSupervisor) return;
    
    // Setup form directly
    setAnnotationType('highlight');
    setSelectedParagraphId(paraId);
    setSelectedText(phrase);
    setHighlightColor(color || 'yellow');
    setShowAddForm(true);
    
    // Focus in textarea
    setTimeout(() => {
      const textarea = document.getElementById('new-anno-comment-box');
      if (textarea) textarea.focus();
    }, 100);
  };

  const handleSelectionChange = () => {
    if (!isSupervisor) return;
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed || selection.rangeCount === 0) {
      setSelectionCoords(null);
      return;
    }
    const text = selection.toString().trim();
    if (text.length < 2) {
      setSelectionCoords(null);
      return;
    }

    const range = selection.getRangeAt(0);
    const containerElement = document.getElementById('academic-manuscript-container');
    if (!containerElement) return;

    const containerRect = containerElement.getBoundingClientRect();
    const rangeRect = range.getBoundingClientRect();

    // Calculate absolute position inside the relative manuscript container
    const top = rangeRect.top - containerRect.top - 44;
    const left = Math.max(10, Math.min(containerRect.width - 200, rangeRect.left - containerRect.left + (rangeRect.width / 2) - 80));

    // Try to auto-detect paragraph
    let detectedParaId = null;
    for (const ch of docContent.chapters) {
      if (ch.text.includes(text)) {
        detectedParaId = ch.id;
        break;
      }
    }

    setSelectionCoords({
      top,
      left,
      text,
      paragraphId: detectedParaId || 'p1'
    });
  };

  const handleSelectionProcess = (paraId) => {
    if (!isSupervisor) return;
    const selected = window.getSelection();
    if (!selected) return;
    const rangeText = selected.toString().trim();
    if (rangeText && rangeText.length > 2) {
      setAnnotationType('highlight');
      setSelectedParagraphId(paraId);
      setSelectedText(rangeText);
      setShowAddForm(true);
    }
  };

  // Helper to format text with active, non-overlapping highlights
  const renderParagraphWithHighlights = (para) => {
    const paraAnnotations = annotations.filter(
      a => a.paragraphId === para.id && a.type === 'highlight' && !a.resolved
    );

    if (paraAnnotations.length === 0) {
      return <p className="text-[13px] leading-relaxed text-slate-800 dark:text-slate-200">{para.text}</p>;
    }

    const paraText = para.text;
    const matches = [];

    paraAnnotations.forEach(anno => {
      const phrase = anno.textSelection;
      if (!phrase) return;
      
      let idx = paraText.indexOf(phrase);
      while (idx !== -1) {
        matches.push({
          start: idx,
          end: idx + phrase.length,
          phrase: phrase,
          anno: anno
        });
        idx = paraText.indexOf(phrase, idx + 1);
      }
    });

    // Sort matches by start position index. Longest matches prioritized first for nested selection
    matches.sort((a, b) => {
      if (a.start !== b.start) {
        return a.start - b.start;
      }
      return (b.end - b.start) - (a.end - a.start);
    });

    // Filter out intersecting/overlapping matches for safety
    const nonOverlappingMatches = [];
    let lastEnd = 0;
    for (const match of matches) {
      if (match.start >= lastEnd) {
        nonOverlappingMatches.push(match);
        lastEnd = match.end;
      }
    }

    // Build the segments list
    const segments = [];
    let currentIndex = 0;
    for (const match of nonOverlappingMatches) {
      if (match.start > currentIndex) {
        segments.push({
          id: `seg_plain_${currentIndex}`,
          text: paraText.substring(currentIndex, match.start),
          highlighted: false
        });
      }
      segments.push({
        id: `seg_high_${match.anno.id}_${match.start}`,
        text: paraText.substring(match.start, match.end),
        highlighted: true,
        anno: match.anno
      });
      currentIndex = match.end;
    }
    if (currentIndex < paraText.length) {
      segments.push({
        id: `seg_plain_${currentIndex}`,
        text: paraText.substring(currentIndex),
        highlighted: false
      });
    }

    return (
      <p className="text-[13px] leading-relaxed text-slate-800 dark:text-slate-200">
        {segments.map((seg) => {
          if (!seg.highlighted) {
            return <span key={seg.id}>{seg.text}</span>;
          }

          const anno = seg.anno;
          const colorStyles = COLOR_MAPS[anno.color || 'yellow'] || COLOR_MAPS.yellow;

          return (
            <span 
              key={seg.id}
              onClick={(e) => {
                e.stopPropagation();
                // Select active annotation of interest
                // Scroll the matching annotation card into view
                const element = document.getElementById(`anno-card-${anno.id}`);
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  element.classList.add('ring-2', 'ring-indigo-500', 'dark:ring-orange-400', 'scale-[1.02]');
                  setTimeout(() => {
                    element.classList.remove('ring-2', 'ring-indigo-500', 'dark:ring-orange-400', 'scale-[1.02]');
                  }, 1800);
                }
              }}
              className={`px-1 py-0.5 rounded-sm font-semibold border-b-2 cursor-pointer transition-all ${colorStyles.bg} ${colorStyles.border} relative group inline`}
              title={`Review: ${anno.comment} (Click to see thread)`}
            >
              {seg.text}
              <span className="absolute bottom-full left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] py-1 px-2 rounded shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 transition duration-150 z-30 w-48 mb-1 leading-normal font-sans">
                <strong>{anno.authorName}:</strong> {anno.comment} (Click to see thread)
              </span>
            </span>
          );
        })}
      </p>
    );
  };

  const filteredAnnotations = annotations.filter(a => {
    if (activeTab === 'pending' && a.resolved) return false;
    if (activeTab === 'resolved' && !a.resolved) return false;
    if (activeCategoryFilter !== 'all') {
      const itemSev = a.severity || 'suggestion';
      if (itemSev !== activeCategoryFilter) return false;
    }
    return true;
  });

  // Supervisor fast-decision trigger inside the Reviewer Studio
  const handleReviewAction = (action) => {
    const feedbackMsg = prompt(`Please specify formal academic feedback details for this assessment limit (${action.toUpperCase()}):`, `Document annotated review process completed. See inline corrections markups.`);
    if (feedbackMsg === null) return; // user cancelled
    if (!feedbackMsg.trim()) {
      alert("Feedback text is required.");
      return;
    }
    reviewSubmission(doc.id, feedbackMsg, action);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-md z-[100] flex items-center justify-center p-2 sm:p-4 md:p-6 animate-fade-in">
      
      {/* CENTRAL STUDIO WINDOW */}
      <div className="w-full h-full max-w-7xl bg-white dark:bg-slate-900 shadow-2xl rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col animate-scale-up">
        
        {/* TOPBAR */}
        <header className="bg-slate-50 dark:bg-slate-950 px-4 py-3 border-b border-slate-200 dark:border-slate-850 flex items-center justify-between">
          <div className="flex items-center space-x-3 MIN-W-0">
            <div className="h-9 w-9 bg-primary-100 dark:bg-primary-950/40 rounded-lg flex items-center justify-center text-primary-600 dark:text-orange-300">
              <FileText className="w-5 h-5 text-accent" />
            </div>
            <div className="truncate">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-semibold text-slate-500 mr-1 font-mono">DOC REVIEWER STUDIO</span>
                <span className={`text-[9px] font-mono px-2 py-0.5 rounded border ${
                  doc.status === 'approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : doc.status === 'review' ? 'bg-purple-50 text-purple-700 border-purple-200' : 'bg-red-50 text-red-700 border-red-200'
                }`}>
                  {doc.status.toUpperCase()}
                </span>
              </div>
              <h1 className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate max-w-md sm:max-w-xl">
                {doc.name} (v{doc.version}.0) - Academic Vetting Module
              </h1>
            </div>
          </div>
          
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-805 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </header>

        {/* WORKSPACE AREA (SPLIT SCREEN LAYOUT) */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-0 bg-slate-100/40 dark:bg-slate-950/20">
          
          {/* LEFT COLUMN: ACTIVE DRAFT READER (lg:grid-cols-7) */}
          <section className="lg:col-span-7 flex flex-col border-r border-slate-200 dark:border-slate-850 overflow-hidden h-full bg-slate-50/50 dark:bg-slate-900/30">
            
            {/* INLINE INSTRUCTION NOTE */}
            <div className="bg-amber-50/50 dark:bg-amber-950/10 border-b border-amber-100/40 dark:border-amber-900/10 p-3 flex items-start gap-2.5">
              <Info className="w-4 h-4 text-emerald-600 dark:text-amber-500 mt-0.5 flex-shrink-0" />
              <div className="text-[11px] text-slate-600 dark:text-slate-300 leading-normal">
                {isSupervisor ? (
                  <span>
                    <strong>Supervisor Sandbox Tools:</strong> To review, hover over any paragraph section below. Click <strong>Comment</strong> to attach parent logs, or hover key phrases below to easily <strong>Highlight & Annotate</strong>.
                  </span>
                ) : (
                  <span>
                    <strong>Student View Mode:</strong> Review Dr. Sterling's flagged highlights and inline commentary notes below. Use the right column to view checklists, reply to comment threads, or request feedback verification.
                  </span>
                )}
              </div>
            </div>

            {/* MANUSCRIPT CORE PAGE BODY */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 space-y-6 max-w-3xl mx-auto w-full">
              
              {/* PAGE SIMULATION CONTAINER */}
              <div 
                id="academic-manuscript-container"
                className="bg-white dark:bg-slate-900 p-6 sm:p-8 md:p-12 shadow-md border border-slate-200 dark:border-slate-800 rounded-lg space-y-8 font-serif select-text relative"
                onMouseUp={handleSelectionChange}
              >
                
                {/* FLOATING ACTION PILL ON ACTIVE TEXT SELECTION */}
                {selectionCoords && (
                  <div 
                    style={{ top: `${selectionCoords.top}px`, left: `${selectionCoords.left}px` }}
                    className="absolute z-[55] bg-slate-950 text-white font-sans text-xs py-1.5 px-3 rounded-full shadow-2xl flex items-center space-x-2 border border-slate-800 hover:bg-black transition-all cursor-pointer select-none animate-bounce whitespace-nowrap"
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      setAnnotationType('highlight');
                      setSelectedParagraphId(selectionCoords.paragraphId);
                      setSelectedText(selectionCoords.text);
                      setShowAddForm(true);
                      setSelectionCoords(null);
                      
                      // Highlight matching paragraph in review
                      setTimeout(() => {
                        const textarea = document.getElementById('new-anno-comment-box');
                        if (textarea) textarea.focus();
                      }, 100);
                    }}
                  >
                    <Highlighter className="w-3.5 h-3.5 text-yellow-300 shrink-0" />
                    <span className="font-semibold text-[11px]">Annotate Selection ({selectionCoords.text.length > 15 ? `"${selectionCoords.text.substring(0, 15)}..."` : `"${selectionCoords.text}"`})</span>
                  </div>
                )}
                
                {/* ACADEMIC COVER EMBLEM LOGO */}
                <div className="text-center pb-6 border-b border-slate-100 dark:border-slate-800 space-y-2">
                  <span className="text-[10px] font-mono tracking-widest text-slate-400 dark:text-slate-500 uppercase">
                    UNIVERSITY RESEARCH REPOSITORY • PROJECT DRAFT
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold font-serif text-slate-900 dark:text-slate-100 tracking-tight leading-snug">
                    {docContent.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 italic">
                    {docContent.subtitle}
                  </p>
                </div>

                {/* PROJECT PARAGRAPHS MAP */}
                {docContent.chapters.map((chapter) => {
                  const hasParagraphAnnos = annotations.some(a => a.paragraphId === chapter.id);
                  const activeParagraphAnnos = annotations.filter(a => a.paragraphId === chapter.id && !a.resolved);
                  
                  return (
                    <div 
                      key={chapter.id} 
                      onMouseUp={() => handleSelectionProcess(chapter.id)}
                      className={`group/para relative p-3 -mx-3 rounded-lg border border-transparent transition-all duration-200 ${
                        selectedParagraphId === chapter.id 
                          ? 'bg-primary-50/40 dark:bg-primary-950/20 border-primary-100 dark:border-primary-900' 
                          : 'hover:bg-slate-50/80 dark:hover:bg-slate-850/60'
                      }`}
                    >
                      {/* Section Title */}
                      <h4 className="text-[11px] font-mono tracking-wider font-bold text-primary-900 dark:text-orange-300 uppercase mb-2">
                        {chapter.section}
                      </h4>

                      {/* Content with active highlights and tooltips */}
                      <div className="relative font-serif">
                        {renderParagraphWithHighlights(chapter)}
                      </div>

                      {/* Hover Actions Controls - Only for Supervisors */}
                      <div className="opacity-0 group-hover/para:opacity-100 absolute -top-3.5 right-2 flex items-center space-x-1.5 transition-opacity duration-150 z-20 bg-white dark:bg-slate-800 border border-slate-205 border-slate-200 dark:border-slate-700 shadow-sm px-1.5 py-1 rounded-md text-[10px] font-sans">
                        
                        {isSupervisor ? (
                          <>
                            <button 
                              onClick={() => {
                                setAnnotationType('comment');
                                setSelectedParagraphId(chapter.id);
                                setShowAddForm(true);
                                setTimeout(() => {
                                  const textarea = document.getElementById('new-anno-comment-box');
                                  if (textarea) textarea.focus();
                                }, 100);
                              }}
                              className="px-2 py-0.5 rounded text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 font-semibold cursor-pointer flex items-center gap-1"
                            >
                              <MessageSquare className="w-3 h-3 text-primary-600" />
                              <span>Comment</span>
                            </button>

                            <span className="w-px h-3 bg-slate-200 dark:bg-slate-705" />

                            <span className="text-slate-400 font-semibold mr-0.5 px-1 font-mono">Highlight Key:</span>
                            
                            {/* Fast Highlight Chips */}
                            <button 
                              onClick={() => handleQuickHighlight(chapter.id, chapter.text.split(' ').slice(0, 3).join(' '), 'yellow')}
                              className="w-3 h-3 rounded-full bg-yellow-400 border border-yellow-500 hover:scale-110 transition cursor-pointer" 
                              title="Highlight Start (Yellow)"
                            />
                            <button 
                              onClick={() => handleQuickHighlight(chapter.id, chapter.text.split(' ').slice(2, 6).join(' '), 'green')}
                              className="w-3 h-3 rounded-full bg-emerald-400 border border-emerald-500 hover:scale-110 transition cursor-pointer" 
                              title="Highlight Phrase (Green)"
                            />
                            <button 
                              onClick={() => handleQuickHighlight(chapter.id, chapter.text.split(' ').slice(5, 9).join(' '), 'blue')}
                              className="w-3 h-3 rounded-full bg-indigo-400 border border-indigo-500 hover:scale-110 transition cursor-pointer" 
                              title="Highlight Code/Spec (Blue)"
                            />
                          </>
                        ) : (
                          <span className="px-2 py-0.5 text-slate-500 flex items-center gap-1">
                            <Tag className="w-3 h-3 text-primary-600" />
                            <span>ID: {chapter.id.toUpperCase()}</span>
                          </span>
                        )}

                        {activeParagraphAnnos.length > 0 && (
                          <>
                            <span className="w-px h-3 bg-slate-200 dark:bg-slate-705" />
                            <span className="px-1.5 py-0.5 bg-orange-100 dark:bg-orange-950/40 text-orange-850 dark:text-orange-300 rounded font-semibold text-[9px] font-mono flex items-center gap-1">
                              <span>{activeParagraphAnnos.length} MARKERS</span>
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}

              </div>

            </div>
          </section>

          {/* RIGHT COLUMN: REVIEWS FEED & ACTIONS (lg:col-span-5) */}
          <section className="lg:col-span-5 flex flex-col overflow-hidden h-full bg-white dark:bg-slate-900 border-t lg:border-t-0 border-slate-200 dark:border-slate-800">
            
            {/* ANNOTATIONS TABS */}
            <div className="px-4 py-3 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-850 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center space-x-2">
                <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase font-mono">
                  Annotations Feedback ({annotations.length})
                </h3>
              </div>

              {/* TABS SELECTOR */}
              <div className="flex bg-slate-200/60 dark:bg-slate-850 p-0.5 rounded-lg text-[10px]">
                <button 
                  onClick={() => setActiveTab('all')}
                  className={`px-2.5 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
                    activeTab === 'all' 
                      ? 'bg-white dark:bg-slate-700 text-slate-950 dark:text-white shadow-xs' 
                      : 'text-slate-500 dark:text-slate-300 hover:text-slate-800'
                  }`}
                >
                  All
                </button>
                <button 
                  onClick={() => setActiveTab('pending')}
                  className={`px-2.5 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
                    activeTab === 'pending' 
                      ? 'bg-white dark:bg-slate-700 text-slate-950 dark:text-white shadow-xs' 
                      : 'text-slate-500 dark:text-slate-300 hover:text-slate-800'
                  }`}
                >
                  Open ({annotations.filter(a => !a.resolved).length})
                </button>
                <button 
                  onClick={() => setActiveTab('resolved')}
                  className={`px-2.5 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
                    activeTab === 'resolved' 
                      ? 'bg-white dark:bg-slate-700 text-slate-950 dark:text-white shadow-xs' 
                      : 'text-slate-500 dark:text-slate-300 hover:text-slate-800'
                  }`}
                >
                  Resolved ({annotations.filter(a => a.resolved).length})
                </button>
              </div>
            </div>

            {/* ANNOTATIONS CATEGORIES FILTER BAR */}
            <div className="px-4 py-2 bg-slate-100/60 dark:bg-slate-950/40 border-b border-slate-200 dark:border-slate-850 flex items-center space-x-1.5 overflow-x-auto flex-shrink-0">
              <span className="text-[9px] font-mono text-slate-400 uppercase font-bold mr-1 shrink-0">Filter Severity:</span>
              {[
                { id: 'all', label: 'All Severity' },
                { id: 'critical', label: 'Critical', color: 'bg-red-500' },
                { id: 'formatting', label: 'Style', color: 'bg-amber-500' },
                { id: 'suggestion', label: 'Advice', color: 'bg-indigo-500' },
                { id: 'praise', label: 'Praise', color: 'bg-emerald-500' }
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategoryFilter(cat.id)}
                  className={`px-2 py-0.5 rounded text-[9.5px] font-semibold transition cursor-pointer shrink-0 flex items-center space-x-1 ${
                    activeCategoryFilter === cat.id
                      ? 'bg-slate-800 text-white dark:bg-slate-700 dark:text-slate-100 shadow-xs'
                      : 'text-slate-500 hover:text-slate-800 hover:bg-slate-205/50 hover:bg-slate-200/50 dark:hover:bg-slate-800/40'
                  }`}
                >
                  {cat.color && <span className={`w-1.5 h-1.5 rounded-full ${cat.color} shrink-0`} />}
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>

            {/* POPUP: ADD ANNOTATION FORM PANEL */}
            {showAddForm && (
              <div className="bg-primary-50/40 dark:bg-primary-950/15 p-4 border-b border-primary-100 dark:border-primary-900 animate-slide-in flex-shrink-0 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold flex items-center gap-1.5 text-primary-900 dark:text-orange-300 font-mono">
                    <Plus className="w-4 h-4 text-emerald-600" />
                    <span>ADD REVIEW MARK ON {selectedParagraphId?.toUpperCase()}</span>
                  </span>
                  <button 
                    onClick={() => { setShowAddForm(false); setSelectedParagraphId(null); }}
                    className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-md cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5 text-slate-500" />
                  </button>
                </div>

                <form onSubmit={handleAddAnnotation} className="space-y-3">
                  
                  {/* Select Annotation Type */}
                  <div className="grid grid-cols-2 gap-2 text-xs font-sans">
                    <button
                      type="button"
                      onClick={() => setAnnotationType('comment')}
                      className={`py-1.5 px-3 rounded-lg border font-semibold flex items-center justify-center gap-2 transition cursor-pointer ${
                        annotationType === 'comment'
                          ? 'bg-white dark:bg-slate-800 text-slate-900 border-primary-200 dark:border-primary-850 shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-850/50 text-slate-500 border-transparent hover:bg-slate-150'
                      }`}
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-primary-600" />
                      <span>Paragraph Comment</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setAnnotationType('highlight')}
                      className={`py-1.5 px-3 rounded-lg border font-semibold flex items-center justify-center gap-2 transition cursor-pointer ${
                        annotationType === 'highlight'
                          ? 'bg-white dark:bg-slate-800 text-slate-900 border-primary-200 dark:border-primary-850 shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-850/50 text-slate-500 border-transparent hover:bg-slate-150'
                      }`}
                    >
                      <Highlighter className="w-3.5 h-3.5 text-amber-500" />
                      <span>Text Highlight</span>
                    </button>
                  </div>

                  {/* Highlights Special Fields */}
                  {annotationType === 'highlight' && (
                    <div className="space-y-2 bg-white dark:bg-slate-950 p-2.5 rounded-lg border border-slate-100 dark:border-slate-850 text-xs">
                      
                      {/* Interactive Selection snippet input */}
                      <div>
                        <label className="block text-[10px] uppercase font-mono text-slate-400 mb-1">Passage Snippet Text</label>
                        <input 
                          type="text"
                          required
                          value={selectedText}
                          onChange={(e) => setSelectedText(e.target.value)}
                          placeholder="Type or copy the precise phrase to color-code highlight..."
                          className="w-full p-2 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 rounded-md text-xs outline-none focus:ring-1 focus:ring-accent"
                        />
                      </div>

                      {/* Highlight color selection */}
                      <div>
                        <span className="block text-[10px] uppercase font-mono text-slate-400 mb-1">Color Marker Marker</span>
                        <div className="flex items-center space-x-3.5 pt-0.5">
                          {['yellow', 'green', 'blue', 'orange'].map(col => {
                            const isSel = highlightColor === col;
                            return (
                              <button
                                key={col}
                                type="button"
                                onClick={() => setHighlightColor(col)}
                                className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition ${
                                  col === 'yellow' ? 'bg-yellow-400 border-yellow-500' :
                                  col === 'green' ? 'bg-emerald-400 border-emerald-500' :
                                  col === 'blue' ? 'bg-indigo-400 border-indigo-550 border-indigo-500' :
                                  'bg-amber-400 border-amber-500'
                                } ${isSel ? 'scale-125 shadow-md ring-2 ring-primary-500/30' : 'hover:scale-110'}`}
                              >
                                {isSel && <Check className="w-3 h-3 text-slate-900 font-bold" />}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Select Severity Type */}
                  <div>
                    <span className="block text-[10px] uppercase font-mono text-slate-400 mb-1">Severity Category</span>
                    <div className="grid grid-cols-4 gap-1.5 text-[10px] font-sans">
                      {[
                        { id: 'critical', label: 'Critical', color: 'bg-red-500' },
                        { id: 'formatting', label: 'Style', color: 'bg-amber-500' },
                        { id: 'suggestion', label: 'Advice', color: 'bg-indigo-500' },
                        { id: 'praise', label: 'Praise', color: 'bg-emerald-500' }
                      ].map(sev => (
                        <button
                          key={sev.id}
                          type="button"
                          onClick={() => setSeverity(sev.id)}
                          className={`py-1 px-1 rounded border font-semibold transition-colors cursor-pointer text-center flex items-center justify-center space-x-1 ${
                            severity === sev.id 
                              ? 'bg-slate-900 text-white border-slate-900 dark:bg-slate-700' 
                              : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-350'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${sev.color} shrink-0`} />
                          <span>{sev.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Pre-saved Academic Templates */}
                  <div className="bg-slate-50 dark:bg-slate-950 p-2.5 border border-slate-100 dark:border-slate-850 rounded-lg space-y-1.5 text-xs">
                    <span className="block text-[9px] uppercase font-mono text-slate-400 font-bold">Quick Pre-set Academic Feed:</span>
                    <div className="grid grid-cols-2 gap-1">
                      {SUGGESTION_TEMPLATES.map((tmpl, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setNewComment(tmpl.text);
                            setSeverity(tmpl.severity);
                          }}
                          className="px-1.5 py-1 text-[8.5px] bg-white hover:bg-slate-100 border border-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 dark:border-slate-700 text-slate-700 dark:text-slate-350 rounded cursor-pointer transition text-left truncate flex items-center space-x-1.5"
                          title={tmpl.text}
                        >
                          {renderTemplateIcon(tmpl.icon)}
                          <span>{tmpl.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Comment Details Input */}
                  <div>
                    <label className="block text-[10px] uppercase font-mono text-slate-400 mb-1">Comment & Correction Guidance</label>
                    <textarea 
                      id="new-anno-comment-box"
                      required
                      rows={2.5}
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder={annotationType === 'highlight' ? "Provide corrective feedback regarding this highlighted passage..." : "Type review comment details regarding this chapter section..."}
                      className="w-full text-xs p-2 border border-slate-200 dark:border-slate-800 rounded-lg outline-none focus:ring-1 focus:ring-primary-500 bg-white dark:bg-slate-950 font-sans"
                    />
                  </div>

                  {/* Confirm Submission */}
                  <div className="flex space-x-2 justify-end text-[11px] font-sans">
                    <button 
                      type="button"
                      onClick={() => { setShowAddForm(false); setSelectedParagraphId(null); }}
                      className="px-3.5 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-lg font-semibold text-slate-500 dark:text-slate-300 transition cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      className="px-4 py-1.5 bg-primary-900 hover:bg-accent text-white font-semibold rounded-lg shadow-sm transition cursor-pointer flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Save Annotation</span>
                    </button>
                  </div>

                </form>
              </div>
            )}

            {/* MAIN COMMENTS FEED CONTAINER */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              
              {filteredAnnotations.length === 0 ? (
                <div className="py-16 text-center text-slate-400 px-6 flex flex-col items-center justify-center space-y-3">
                  <div className="h-11 w-11 rounded-full bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-300">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h5 className="text-xs font-bold text-slate-700 dark:text-slate-300">No Annotations Logged</h5>
                    <p className="text-[10px] leading-normal text-slate-500 max-w-[280px]">
                      {isSupervisor 
                        ? 'Hover over paragraph drafts inside the manuscript page to highlight details or add notes for student review.'
                        : 'Congratulations! No active feedback warnings or corrections are pending for this submission draft.'}
                    </p>
                  </div>
                </div>
              ) : (
                filteredAnnotations.map((anno) => {
                  const colorStyles = COLOR_MAPS[anno.color || 'yellow'];
                  const isAnnotatorSelf = currentUser?.id === anno.authorId;
                  
                  return (
                    <div 
                      key={anno.id}
                      id={`anno-card-${anno.id}`}
                      className={`p-4 border rounded-xl shadow-xs space-y-3.5 transition-all text-xs scroll-mt-6 ${
                        anno.resolved 
                          ? 'bg-slate-50/70 border-slate-200 dark:bg-slate-950/20 dark:border-slate-850 filter opacity-65' 
                          : 'bg-white border-slate-200 dark:bg-slate-900 dark:border-slate-800'
                      }`}
                    >
                      {/* HEADER CARD: Metadata & delete */}
                      <div className="flex justify-between items-start gap-2.5">
                        <div className="flex items-center space-x-2 text-[10px] font-mono">
                          <span className="font-bold text-primary-900 dark:text-orange-300">
                            {anno.authorName}
                          </span>
                          <span className="text-slate-400">•</span>
                          <span className="text-slate-400 capitalize bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-[9px] font-semibold font-sans">
                            {anno.paragraphId.toUpperCase()}
                          </span>
                          {anno.severity && (
                            <>
                              <span className="text-slate-400">•</span>
                              <span className={`px-1.5 py-0.5 rounded text-[8.5px] font-mono uppercase font-bold border flex items-center space-x-1 ${
                                anno.severity === 'critical' ? 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900' :
                                anno.severity === 'formatting' ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900' :
                                anno.severity === 'praise' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900' :
                                'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/20 dark:text-indigo-400'
                              }`}>
                                <span className={`w-1 h-1 rounded-full ${
                                  anno.severity === 'critical' ? 'bg-red-500' :
                                  anno.severity === 'formatting' ? 'bg-amber-500' :
                                  anno.severity === 'praise' ? 'bg-emerald-500' :
                                  'bg-indigo-505 bg-indigo-500'
                                } shrink-0`} />
                                <span>
                                  {anno.severity === 'critical' ? 'Critical' :
                                   anno.severity === 'formatting' ? 'Style' :
                                   anno.severity === 'praise' ? 'Praise' :
                                   'Advice'}
                                </span>
                              </span>
                            </>
                          )}
                        </div>

                        <div className="flex items-center space-x-1">
                          
                          {/* Resolve checkbox (Supervisor or Student lead can toggle) */}
                          <button
                            onClick={() => handleToggleResolve(anno.id)}
                            className={`p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer flex items-center gap-1 ${
                              anno.resolved ? 'text-emerald-600' : 'text-slate-400 hover:text-emerald-600'
                            }`}
                            title={anno.resolved ? 'Mark unresolved' : 'Mark resolved / addressed'}
                          >
                            {anno.resolved ? (
                              <CheckCircle className="w-4 h-4" />
                            ) : (
                              <div className="w-4 h-4 rounded-full border-2 border-slate-300 flex items-center justify-center hover:border-emerald-500" />
                            )}
                          </button>

                          {/* Delete only for author supervisor */}
                          {isSupervisor && (
                            <button
                              onClick={() => handleDeleteAnnotation(anno.id)}
                              className="p-1 text-slate-400 hover:text-red-500 rounded hover:bg-slate-100 dark:hover:bg-slate-805 transition cursor-pointer"
                              title="Delete annotations marker"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* SNIPPETS & COMMENT CONTENT */}
                      <div className="space-y-2">
                        {/* Highlight text snippet bubble */}
                        {anno.type === 'highlight' && anno.textSelection && (
                          <div className={`p-2 rounded-lg border text-[11px] font-serif italic ${colorStyles.bg} ${colorStyles.border}`}>
                            <span className="block font-mono text-[8px] uppercase tracking-wider text-slate-400 mb-0.5 font-bold">
                              PASSAGE SELECTION HIGHLIGHTED:
                            </span>
                            "{anno.textSelection}"
                          </div>
                        )}

                        {/* Supervisor commentary */}
                        <p className="text-[12px] leading-relaxed text-slate-800 dark:text-slate-200 font-sans">
                          {anno.comment}
                        </p>
                      </div>

                      {/* REPLY SUB-THREADS */}
                      {anno.replies && anno.replies.length > 0 && (
                        <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-850">
                          {anno.replies.map(rep => (
                            <div key={rep.id} className="flex items-start space-x-2 pl-3 pb-1 border-l-2 border-slate-100 dark:border-slate-800 bg-slate-50/40 p-1.5 rounded-r">
                              <CornerDownRight className="w-3.5 h-3.5 text-slate-400 mt-1 flex-shrink-0" />
                              <div className="text-[10.5px] leading-normal flex-1">
                                <span className="font-bold text-slate-700 dark:text-slate-300 font-mono text-[9px] mr-1.5">
                                  {rep.authorName}:
                                </span>
                                <span className="text-slate-600 dark:text-slate-300">{rep.comment}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* REPLY FORM INPUT FOOTER */}
                      <form 
                        onSubmit={(e) => handlePostReply(e, anno.id)}
                        className="flex items-center space-x-2 pt-1.5 border-t border-slate-100 dark:border-slate-850/60"
                      >
                        <input 
                          type="text"
                          required
                          value={replyInputs[anno.id] || ''}
                          onChange={(e) => setReplyInputs(prev => ({ ...prev, [anno.id]: e.target.value }))}
                          placeholder="Post thread reply or correction update..."
                          className="flex-1 bg-slate-55 bg-slate-50 dark:bg-slate-950 p-2 rounded-lg text-[10px] border border-slate-100 dark:border-slate-850 focus:outline-none focus:ring-1 focus:ring-primary-500 text-slate-800 dark:text-white"
                        />
                        <button
                          type="submit"
                          className="p-1.5 bg-primary-100 hover:bg-primary-900 text-primary-900 hover:text-white rounded-lg transition-all cursor-pointer"
                        >
                          <Send className="w-3 h-3" />
                        </button>
                      </form>

                    </div>
                  );
                })
              )}

            </div>

            {/* SUPERVISOR FINAL CONTROL BLOCK BAR (Only shown when doc is under review and active role is supervisor) */}
            {isSupervisor && doc.status === 'review' && (
              <div className="p-4 bg-slate-55 dark:bg-slate-950 border-t border-slate-205 border-slate-200 dark:border-slate-800 space-y-3 flex-shrink-0">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span className="text-[10px] font-mono uppercase text-slate-400 font-bold">Assess Board Final Decision</span>
                </div>
                
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => handleReviewAction('approve')}
                    className="py-2.5 bg-emerald-700 hover:bg-emerald-600 font-sans font-semibold text-white rounded-xl text-xs flex flex-col items-center justify-center space-y-1 shadow-sm transition-all cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    <span>Approve Draft</span>
                  </button>

                  <button
                    onClick={() => handleReviewAction('revision')}
                    className="py-2.5 bg-amber-600 hover:bg-amber-500 font-sans font-semibold text-white rounded-xl text-xs flex flex-col items-center justify-center space-y-1 shadow-sm transition-all cursor-pointer"
                  >
                    <AlertTriangle className="w-4 h-4" />
                    <span>Request Revision</span>
                  </button>

                  <button
                    onClick={() => handleReviewAction('reject')}
                    className="py-2.5 bg-red-650 hover:bg-red-600 font-sans font-semibold text-white rounded-xl text-xs flex flex-col items-center justify-center space-y-1 shadow-sm transition-all cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                    <span>Reject Paper</span>
                  </button>
                </div>
              </div>
            )}

          </section>

        </div>

        {/* BOTTOM STATUS FOOTER */}
        <footer className="bg-slate-50 dark:bg-slate-950 px-4 py-2 border-t border-slate-200 dark:border-slate-850 flex items-center justify-between text-[9px] font-mono text-slate-400 flex-shrink-0">
          <span>Active Registry Node: ANNOTATED-DOC-{doc.id.toUpperCase()}</span>
          <span>Draft Version Track: {doc.version}.0</span>
        </footer>

      </div>

    </div>
  );
}

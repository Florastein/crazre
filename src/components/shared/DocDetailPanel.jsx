import React, { useState } from 'react';
import { useAppState } from '../../contexts/StateContext';
import { X, FileText, Download, CheckCircle, RotateCcw, AlertOctagon, User, Calendar, MessageSquare, ShieldCheck, Highlighter } from 'lucide-react';
import DocReviewStudio from './DocReviewStudio';

export default function DocDetailPanel({ doc, onClose }) {
  const { currentRole, reviewSubmission, users, milestones } = useAppState();
  const [feedback, setFeedback] = useState('');
  const [reviewAction, setReviewAction] = useState(null); // 'approve' | 'revision' | 'reject'
  const [showConfirm, setShowConfirm] = useState(false);
  const [showStudio, setShowStudio] = useState(false);

  if (!doc) return null;

  const uploader = users.find(u => u.id === doc.uploadedBy) || { name: 'Student' };
  const milestone = milestones.find(m => m.id === doc.milestoneId);

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!feedback.trim()) {
      alert('Feedback details are required for formal academic records.');
      return;
    }
    reviewSubmission(doc.id, feedback, reviewAction);
    setShowConfirm(false);
    setReviewAction(null);
    setFeedback('');
    onClose();
  };

  const triggerReviewAction = (action) => {
    setReviewAction(action);
    setShowConfirm(true);
  };

  return (
    <div id="document-slide-sheet" className="fixed inset-y-0 right-0 w-full md:w-[480px] bg-paper border-l border-ink/10 shadow-premium z-50 flex flex-col h-full animate-slide-in-right text-ink">
      
      {/* PANEL HEADER */}
      <div className="p-5 border-b border-ink/10 bg-slate-50 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-slate-100 p-2.5 rounded-none border border-ink/10 text-ink">
            <FileText className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h3 className="font-serif text-sm font-bold truncate max-w-[280px] text-ink">{doc.name}</h3>
            <p className="text-[10px] font-mono text-muted mt-0.5">SIZE: {doc.size} • FORMAT: {doc.type.toUpperCase()}</p>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="p-1.5 hover:bg-slate-200 text-muted hover:text-ink cursor-pointer transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* PANEL CONTENT */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        
        {/* STATUS METADATA CARD */}
        <div className="p-4 bg-slate-50 rounded-none border border-ink/10 flex justify-between items-center text-xs">
          <div>
            <span className="text-muted block text-[10px] uppercase font-mono tracking-wider mb-1 font-semibold">State Registry</span>
            <span className={`inline-block font-mono font-bold text-[9px] px-1.5 py-0.5 border ${
              doc.status === 'approved' ? 'bg-emerald-55 bg-emerald-50 text-accent border-accent/20' : doc.status === 'review' ? 'bg-purple-50 text-purple-705 text-purple-700 border-purple-500/20' : 'bg-red-50 text-red-700 border-red-500/20'
            }`}>
              {doc.status.toUpperCase()}
            </span>
          </div>
          <div className="text-right">
            <span className="text-muted block text-[10px] uppercase font-mono tracking-wider mb-1 font-semibold">Version</span>
            <span className="font-mono text-xs font-bold text-ink bg-slate-100 px-2.5 py-0.5 border border-ink/5">
              v{doc.version}.0
            </span>
          </div>
        </div>

        {/* METADATA TIMELINE LIST */}
        <div className="space-y-3 pb-3 border-b border-ink/10 text-xs">
          <div className="flex justify-between">
            <span className="text-muted flex items-center"><User className="w-3.5 h-3.5 mr-1.5 text-muted hover:text-ink" /> Submitted by:</span>
            <span className="font-semibold text-ink">{uploader.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted flex items-center"><Calendar className="w-3.5 h-3.5 mr-1.5 text-muted hover:text-ink" /> Upload Stamp:</span>
            <span className="font-mono text-[11px] text-ink">{new Date(doc.uploadedAt).toLocaleDateString()} {new Date(doc.uploadedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
          {milestone && (
            <div className="flex justify-between">
              <span className="text-muted flex items-center"><MessageSquare className="w-3.5 h-3.5 mr-1.5 text-muted hover:text-ink" /> Target Milestone:</span>
              <span className="font-semibold text-accent truncate max-w-[200px]">{milestone.title}</span>
            </div>
          )}
        </div>

        {/* STUDENT NOTES */}
        {doc.notes && (
          <div className="p-4 bg-slate-50 rounded-none border border-ink/10 text-xs space-y-2">
            <span className="block font-bold text-[10px] uppercase text-muted tracking-wider font-mono">Academics Vetting Notes</span>
            <p className="text-ink leading-relaxed italic">"{doc.notes}"</p>
          </div>
        )}

        {/* CURRENT AUDITED FEEDBACK */}
        {doc.feedback && (
          <div className="p-4 bg-emerald-50/45 rounded-none border border-accent/20 text-xs space-y-2">
            <span className="block font-bold text-[10px] uppercase text-accent tracking-wider flex items-center font-mono">
              <CheckCircle className="w-3.5 h-3.5 mr-1.5" /> Checked Supervision Feedback
            </span>
            <p className="text-ink leading-relaxed font-semibold">"{doc.feedback}"</p>
          </div>
        )}

        {/* MONOSPACE ACCORDION ITERATION LIST */}
        <div className="space-y-2">
          <h4 className="text-[10px] font-bold text-muted uppercase tracking-wider font-mono">Document Record Matrices</h4>
          <div className="border border-ink/10 rounded-none divide-y divide-ink/10 overflow-hidden text-xs font-mono">
            <div className="p-2.5 bg-slate-50 flex justify-between font-bold text-[10px] text-muted uppercase">
              <span>Version Track</span>
              <span>Audit State</span>
            </div>
            <div className="p-3 flex justify-between items-center bg-emerald-50/10">
              <span className="flex items-center text-[11px] text-ink font-semibold">
                <FileText className="w-3.5 h-3.5 mr-1.5 text-accent" />
                {doc.name} (v{doc.version}.0)
              </span>
              <span className="text-[10px] uppercase font-bold text-accent">Active Node</span>
            </div>
            {doc.version > 1 && (
              <div className="p-3 flex justify-between items-center hover:bg-slate-100 text-muted">
                <span className="flex items-center text-[11px]">
                  <FileText className="w-3.5 h-3.5 mr-1.5 text-muted" />
                  {doc.name.replace(`_v${doc.version}`, `_v${doc.version - 1}`)} (v{doc.version - 1}.0)
                </span>
                <span className="text-[10px] uppercase font-bold text-muted">Superseded</span>
              </div>
            )}
          </div>
        </div>

        {/* SUPERVISOR PANEL CONTROLS */}
        {currentRole === 'supervisor' && doc.status === 'review' && (
          <div className="border-t border-ink/10 pt-6 space-y-4">
            <h4 className="text-xs font-bold text-ink uppercase tracking-wider flex items-center font-mono">
              <ShieldCheck className="w-4 h-4 text-accent mr-1.5" /> Supervisor Assessment Board
            </h4>
            <div className="grid grid-cols-3 gap-2">
              <button 
                onClick={() => triggerReviewAction('approve')}
                className="py-2.5 bg-ink hover:bg-accent text-white rounded-none text-xs font-semibold shadow-premium transition flex flex-col items-center justify-center space-y-1 cursor-pointer"
              >
                <CheckCircle className="w-4 h-4 text-accent" />
                <span>Approve</span>
              </button>
              <button 
                onClick={() => triggerReviewAction('revision')}
                className="py-2.5 bg-slate-100 hover:bg-slate-200 text-ink border border-ink/10 rounded-none text-xs font-semibold shadow-xs transition flex flex-col items-center justify-center space-y-1 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4 text-amber-600" />
                <span>Revision</span>
              </button>
              <button 
                onClick={() => triggerReviewAction('reject')}
                className="py-2.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-none text-xs font-semibold shadow-xs transition flex flex-col items-center justify-center space-y-1 cursor-pointer"
              >
                <AlertOctagon className="w-4 h-4 text-red-600" />
                <span>Reject</span>
              </button>
            </div>
          </div>
        )}

      </div>

      {/* FOOTER ACTIONS - DOWNLOAD & ANNOTATE */}
      <div className="p-4 border-t border-ink/10 bg-slate-50 flex flex-col space-y-2">
        <button 
          onClick={() => setShowStudio(true)}
          className="w-full h-11 bg-primary-900 border border-primary-800 text-white hover:bg-accent hover:border-accent font-sans font-semibold rounded-none text-xs flex items-center justify-center space-x-2 shadow-premium transition-all cursor-pointer"
        >
          <Highlighter className="w-4 h-4 text-orange-300 animate-pulse" />
          <span>{currentRole === 'supervisor' ? 'Open Annotation & Review Studio' : 'Open Supervisor Comments & Highlights'}</span>
        </button>

        <a 
          href="#" 
          onClick={(e) => { e.preventDefault(); alert(`Downloading coursework resource artifact: ${doc.name} (${doc.size})`); }}
          className="w-full h-9 bg-slate-100 hover:bg-slate-200 text-slate-700 font-sans font-semibold rounded-none text-[11px] flex items-center justify-center space-x-2 border border-slate-200 transition-all cursor-pointer"
        >
          <Download className="w-3.5 h-3.5 text-slate-500" />
          <span>Download Draft Artifact</span>
        </a>
      </div>

      {/* DESTRUCTIVE / QUALITY ASSURANCE INTERACTIVE CONFIRM CONSOLE OVERLAY */}
      {showConfirm && (
        <div className="absolute inset-0 bg-ink/75 backdrop-blur-xs flex items-center justify-center p-6 z-50">
          <div className="bg-paper border border-ink/20 p-5 rounded-none shadow-premium w-full max-w-sm space-y-4 text-ink text-xs">
            <div className="flex items-center space-x-2 text-ink">
              <ShieldCheck className="w-5 h-5 text-accent" />
              <h4 className="font-serif text-sm font-bold capitalize">Confirm Assessment ({reviewAction})</h4>
            </div>
            <p className="text-muted leading-relaxed font-sans">
              Provide formal quality audit feedback as record for the academic supervision archives. Students will receive this feedback instantaneously.
            </p>
            <form onSubmit={handleSubmitReview} className="space-y-3">
              <textarea 
                required
                rows={3}
                placeholder="Write detailed assessment feedback..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="w-full p-2.5 border border-ink/15 rounded-none bg-slate-50 text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-accent"
              />
              <div className="flex space-x-2">
                <button 
                  type="button" 
                  onClick={() => setShowConfirm(false)}
                  className="flex-1 py-2 bg-white border border-ink/15 rounded-none font-semibold text-muted hover:bg-slate-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className={`flex-1 py-2 rounded-none font-semibold text-white transition cursor-pointer ${
                    reviewAction === 'approve' ? 'bg-accent hover:bg-ink' : reviewAction === 'revision' ? 'bg-amber-600 hover:bg-amber-500' : 'bg-red-600 hover:bg-red-500'
                  }`}
                >
                  Confirm Assessment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showStudio && (
        <DocReviewStudio doc={doc} onClose={() => setShowStudio(false)} />
      )}

    </div>
  );
}

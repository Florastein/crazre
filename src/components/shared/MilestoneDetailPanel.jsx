import React from 'react';
import { useAppState } from '../../contexts/StateContext';
import { X, Milestone, Calendar, BookOpen, Clock, FileText, Upload } from 'lucide-react';

export default function MilestoneDetailPanel({ milestone, onClose, onUploadClick }) {
  const { currentRole, documents, users } = useAppState();

  if (!milestone) return null;

  // Filter documents submitted for this milestone
  const associatedDocs = documents.filter(d => d.milestoneId === milestone.id);
  
  // Is Overdue check
  const isOverdue = new Date(milestone.dueDate) < new Date() && milestone.status !== 'approved';

  return (
    <div id="milestone-slide-sheet" className="fixed inset-y-0 right-0 w-full md:w-[480px] bg-paper border-l border-ink/10 shadow-premium z-50 flex flex-col h-full animate-slide-in-right text-ink">
      
      {/* HEADER */}
      <div className="p-5 border-b border-ink/10 bg-slate-50 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-slate-100 p-2.5 rounded-none border border-ink/10 text-ink">
            <Milestone className="w-5 h-5 text-accent" />
          </div>
          <div>
            <span className="text-[10px] font-bold font-mono text-accent block bg-emerald-50 border border-accent/20 px-2 py-0.5 rounded-none w-max">
              MILESTONE #{milestone.order}
            </span>
            <h3 className="font-serif text-sm font-bold truncate max-w-[280px] mt-1 text-ink">{milestone.title}</h3>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="p-1.5 hover:bg-slate-200 text-muted hover:text-ink cursor-pointer transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* BODY */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6 text-xs">
        
        {/* STATS AREA */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3.5 bg-slate-50 rounded-none border border-ink/10 flex flex-col justify-between">
            <span className="text-muted block text-[10px] uppercase font-mono tracking-wider">Due Date Limit</span>
            <span className={`font-mono font-bold mt-1.5 flex items-center ${isOverdue ? 'text-red-700' : 'text-ink'}`}>
              <Clock className="w-3.5 h-3.5 mr-1" />
              {new Date(milestone.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
            {isOverdue && (
              <span className="text-[9px] text-red-700 font-mono font-bold mt-1 uppercase">Overdue Track</span>
            )}
          </div>

          <div className="p-3.5 bg-slate-50 rounded-none border border-ink/10 flex flex-col justify-between">
            <span className="text-muted block text-[10px] uppercase font-mono tracking-wider">Evaluation State</span>
            <span className={`inline-block font-mono font-bold text-[9px] px-2 py-0.5 border mt-2 w-max text-center ${
              milestone.status === 'approved' ? 'bg-emerald-50 text-accent border-accent/20' : milestone.status === 'review' ? 'bg-purple-50 text-purple-700 border-purple-500/20' : 'bg-amber-50 text-amber-700 border-amber-500/20'
            }`}>
              {milestone.status.toUpperCase()}
            </span>
          </div>
        </div>

        {/* DESCRIPTION SUMMARY */}
        <div className="space-y-1.5">
          <span className="block font-bold text-[10px] uppercase text-muted tracking-wider flex items-center font-mono">
            <BookOpen className="w-3.5 h-3.5 mr-1 text-accent" /> Core Milestone Directives
          </span>
          <p className="text-ink leading-relaxed bg-slate-50 p-3.5 rounded-none border border-ink/10">
            {milestone.desc}
          </p>
        </div>

        {/* QUALITY ACCEPTANCE CRITERIA */}
        <div className="space-y-1.5">
          <span className="block font-bold text-[10px] uppercase text-muted tracking-wider flex items-center font-mono">
            🔒 Audit Criteria & Requirements
          </span>
          <div className="p-3.5 bg-emerald-50/10 rounded-none border border-accent/15 text-ink font-sans italic">
            "{milestone.criteria}"
          </div>
        </div>

        {/* SUBMITTED ARTIFACT HISTORY */}
        <div className="space-y-2.5">
          <span className="block font-bold text-[10px] uppercase text-muted tracking-wider font-mono">Submitted Project Version Matrix</span>
          {associatedDocs.length === 0 ? (
            <div className="p-6 border border-dashed border-ink/10 rounded-none text-center text-muted font-serif italic">
              No electronic uploads logged for review yet.
            </div>
          ) : (
            <div className="space-y-2">
              {associatedDocs.map(d => {
                const docUploaderObj = users.find(u => u.id === d.uploadedBy) || { name: 'Student' };
                return (
                  <div key={d.id} className="p-3 bg-white border border-ink/10 rounded-none hover:border-accent transition flex items-center justify-between">
                    <div className="flex items-center space-x-2.5 truncate">
                      <FileText className="w-4 h-4 text-accent flex-shrink-0" />
                      <div className="truncate">
                        <p className="font-bold truncate text-ink text-[11px]">{d.name}</p>
                        <p className="text-[10px] text-muted font-mono mt-0.5">
                          v{d.version}.0 • {docUploaderObj.name}
                        </p>
                      </div>
                    </div>
                    <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 border ${
                      d.status === 'approved' ? 'bg-emerald-50 text-accent border-accent/20' : d.status === 'review' ? 'bg-purple-50 text-purple-700 border-purple-500/20' : 'bg-red-50 text-red-700 border-red-500/20'
                    }`}>
                      {d.status.toUpperCase()}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>

      {/* FOOTER ACTION CONTROLS */}
      <div className="p-4 border-t border-ink/10 bg-slate-50 flex">
        {currentRole === 'student' && milestone.status !== 'approved' && (
          <button 
            onClick={() => { onClose(); onUploadClick(milestone); }}
            className="flex-1 h-11 bg-ink hover:bg-accent text-white font-sans font-semibold rounded-none text-xs flex items-center justify-center space-x-2 shadow-premium transition-all cursor-pointer"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Solution Artifact</span>
          </button>
        )}
        {milestone.status === 'approved' && (
          <div className="flex-1 text-center py-2.5 text-accent border border-accent/20 bg-emerald-50/20 font-bold uppercase tracking-wider font-mono text-[9px]">
            ✓ Approved Node — Milestone finalized and archived.
          </div>
        )}
      </div>

    </div>
  );
}

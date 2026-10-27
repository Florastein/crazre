import React from 'react';
import { ArrowUp, BookOpen, ShieldCheck } from 'lucide-react';

export default function LandingFooter({ onGoToLogin }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-900 text-white border-t border-slate-800 py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-slate-800">
          
          {/* Brand Column */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-emerald-600 text-white flex items-center justify-center font-serif text-base font-bold">
                A
              </div>
              <span className="font-serif italic font-bold text-xl text-white">
                acaDEX
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed font-sans">
              Higher education academic workspace for coursework management, research project supervision, multi-format learning materials, and online quizzes.
            </p>
            <div className="mt-4 text-[11px] text-slate-500 font-mono">
              Academic Term 2026–2027 • Standard Institutional Release
            </div>
          </div>

          {/* Core Modules Links */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-300 font-bold mb-3">
              Platform Features
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>Course Materials Library (PPTX, DOCX, PDF, TXT)</li>
              <li>Milestone Supervision & Defense</li>
              <li>Coursework Submissions & Receipts</li>
              <li>Interactive Timed Assessments</li>
              <li>Early Warning Risk Checks</li>
            </ul>
          </div>

          {/* Access & Portals */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-300 font-bold mb-3">
              Direct Access
            </h4>
            <div className="space-y-3">
              <button
                onClick={() => onGoToLogin('login')}
                className="w-full text-left px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 transition cursor-pointer flex items-center justify-between"
              >
                <span>Portal Login</span>
                <span>→</span>
              </button>
              <button
                onClick={scrollToTop}
                className="w-full text-left px-3 py-2 bg-transparent hover:bg-slate-800 text-slate-400 hover:text-white text-xs font-medium border border-slate-800 transition cursor-pointer flex items-center justify-between"
              >
                <span>Back to Top</span>
                <ArrowUp className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>

        {/* Quiet Copyright Row */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-sans">
          <p>© 2026 acaDEX Higher Education Systems. All rights reserved.</p>
          <div className="flex items-center space-x-6 text-slate-400">
            <span>Academic Integrity Guidelines</span>
            <span>·</span>
            <span>Institutional Security</span>
            <span>·</span>
            <span>Accessibility Compliant</span>
          </div>
        </div>

      </div>
    </footer>
  );
}

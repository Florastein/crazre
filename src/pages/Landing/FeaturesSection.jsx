import React from 'react';
import { 
  BookOpen, Users, ClipboardCheck, Award, AlertTriangle, 
  Layers, CheckCircle, Clock, ShieldCheck, ArrowRight 
} from 'lucide-react';

export default function FeaturesSection({ onGoToLogin }) {
  const features = [
    {
      icon: BookOpen,
      title: 'Course Materials in 4 Formats',
      description: 'Upload and organize PowerPoint slide decks, Word documents, PDF readings, and plaintext guides with one-click downloads for students.',
      tag: 'Teaching Resources'
    },
    {
      icon: Users,
      title: 'Guided Project Supervision',
      description: 'Break capstone projects into structured milestones. Record supervisor meeting notes, track attendance, and assign follow-up action items.',
      tag: 'Research & Mentorship'
    },
    {
      icon: ClipboardCheck,
      title: 'Coursework with Digital Receipts',
      description: 'When students submit assignments, the system issues a unique verification receipt code, eliminating confusion about who submitted what and when.',
      tag: 'Submissions & Grading'
    },
    {
      icon: Award,
      title: 'Built-in Interactive Quizzes',
      description: 'Create timed multiple-choice assessments that automatically grade responses and immediately record student scores in the course gradebook.',
      tag: 'Knowledge Testing'
    },
    {
      icon: AlertTriangle,
      title: 'Early Warning Safety Checks',
      description: 'Automatic flags highlight inactive student groups or missed milestones early, giving mentors time to help students before they fall behind.',
      tag: 'Student Retention'
    },
    {
      icon: Layers,
      title: 'Department Curriculum Structure',
      description: 'Organize academic degree programmes, course allocations, semester calendar deadlines, and complete audit histories with clarity.',
      tag: 'Academic Governance'
    }
  ];

  return (
    <section id="features" className="relative overflow-hidden py-16 lg:py-24 bg-white border-b border-slate-200">
      {/* Subtle fine dot texture overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}
      />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-14">
          <h2 className="font-outfit text-3xl sm:text-4xl font-light text-slate-900 tracking-tight">
            Designed to solve the real everyday friction in academic departments.
          </h2>
          <p className="mt-3 text-sm text-slate-600 font-sans leading-relaxed">
            Every feature is built around the actual academic workflow between students, lecturers, and department leadership.
          </p>
        </div>

        {/* Feature Grid with Architectural Hairline Styling */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feat, index) => {
            const Icon = feat.icon;
            return (
              <div 
                key={index}
                className="p-6 bg-slate-50 border border-slate-200 hover:border-slate-400 transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 bg-slate-900 text-white flex items-center justify-center">
                      <Icon className="w-5 h-5 text-emerald-400" />
                    </div>
                    <span className="text-[10px] font-mono uppercase font-bold text-slate-500">
                      {feat.tag}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mb-2 font-sans">
                    {feat.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed font-sans">
                    {feat.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-500">
                  <span className="font-mono text-[10px]">Standard System Workflow</span>
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Banner */}
        <div className="mt-14 p-8 bg-slate-900 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h3 className="font-serif italic text-2xl font-bold text-white">
              Ready to explore the workspace?
            </h3>
            <p className="text-xs text-slate-300 mt-1 max-w-xl">
              Sign in with your campus account or launch one of our preloaded demo profiles to see how it operates.
            </p>
          </div>
          <button
            onClick={() => onGoToLogin('login')}
            className="px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs tracking-wide flex items-center space-x-2 transition cursor-pointer shrink-0"
          >
            <span>Access Portal Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
}

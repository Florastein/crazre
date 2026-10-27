import React from 'react';
import { ArrowRight, ChevronDown, CheckCircle, FileText } from 'lucide-react';

export default function HeroSection({ onGoToLogin, onScrollToSection }) {
  return (
    <section className="relative overflow-hidden bg-white border-b border-slate-200 pt-10 pb-16 lg:pt-16 lg:pb-20">
      {/* Subtle fine dot texture overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          
          {/* Left Column: Editorial Headline & Actions */}
          <div className="lg:col-span-7">

            {/* Main Headline */}
            <h1 className="font-outfit text-4xl sm:text-5xl lg:text-5xl xl:text-6xl font-normal text-slate-900 tracking-tight leading-[1.15]">
              Manage courses, supervise projects, and evaluate student work in one unified space.
            </h1>

            {/* Supporting description in simple English */}
            <p className="mt-5 text-base sm:text-lg text-slate-600 font-sans leading-relaxed">
              Say goodbye to lost emails and disorganized spreadsheets. acaDEX brings course materials in PowerPoint, Word, PDF, and Text together with milestone supervision, online quizzes, and digital submission receipts.
            </p>

            {/* Primary Action Buttons */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                onClick={() => onGoToLogin('login')}
                className="px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs tracking-wide flex items-center space-x-2 transition cursor-pointer shadow-sm"
              >
                <span>Sign In to Portal</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onScrollToSection('showcase')}
                className="px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-semibold text-xs tracking-wide flex items-center space-x-2 transition cursor-pointer"
              >
                <span>Explore Interactive Preview</span>
                <ChevronDown className="w-4 h-4 text-slate-500" />
              </button>
            </div>

            {/* Supported Document Formats Mini Strip */}
            <div className="mt-8 pt-6 border-t border-slate-200/80 flex flex-wrap items-center gap-3 text-xs text-slate-500 font-sans">
              <span className="font-semibold text-slate-700 flex items-center space-x-1.5">
                <FileText className="w-4 h-4 text-emerald-600" />
                <span>Uploads Accepted:</span>
              </span>
              <div className="flex items-center space-x-2 font-mono text-[11px]">
                <span className="px-2 py-0.5 bg-slate-100 text-slate-700 border border-slate-200">PowerPoint (.pptx)</span>
                <span className="px-2 py-0.5 bg-slate-100 text-slate-700 border border-slate-200">Word (.docx)</span>
                <span className="px-2 py-0.5 bg-slate-100 text-slate-700 border border-slate-200">PDF (.pdf)</span>
                <span className="px-2 py-0.5 bg-slate-100 text-slate-700 border border-slate-200">Text (.txt)</span>
              </div>
            </div>
          </div>

          {/* Right Column: Academic Person in Context */}
          <div className="lg:col-span-5">
            <div className="relative">
              {/* Background accent layer */}
              <div className="absolute -inset-2 bg-slate-100 border border-slate-200 -rotate-1 hidden sm:block" />
              
              {/* Main image container */}
              <div className="relative bg-white p-2.5 sm:p-3 border border-slate-300 shadow-sm">
                <div className="overflow-hidden bg-slate-100">
                  <img
                    src="/src/assets/images/academic_student_hero_1793098757898.jpg"
                    alt="University student focused on coursework and academic project research"
                    className="w-full h-auto object-cover aspect-[4/3] block transition duration-500 hover:scale-[1.02]"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Editorial caption bar */}
                <div className="mt-3 px-1.5 pb-0.5 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="font-mono text-slate-700 text-[11px] font-medium">Digital Course Portal • Active Session</span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">Academic Year 2026</span>
                </div>
              </div>

              {/* Floating verified badge */}
              <div className="absolute -bottom-4 -left-3 sm:-bottom-5 sm:-left-5 bg-white border border-slate-200 p-3 shadow-md flex items-center space-x-3 max-w-[260px] sm:max-w-xs">
                <div className="w-8 h-8 sm:w-9 sm:h-9 bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 leading-tight">Verified Submissions</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Instant timestamp receipts for all assignments</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

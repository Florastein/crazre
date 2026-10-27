import React from 'react';
import { BookOpen, ArrowRight, ShieldCheck, User } from 'lucide-react';

export default function LandingNav({ onGoToLogin, onScrollToSection }) {
  return (
    <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand identity */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="w-9 h-9 bg-slate-900 text-white flex items-center justify-center font-serif text-lg font-bold">
            A
          </div>
          <div>
            <span className="font-serif italic font-bold text-lg text-slate-900 tracking-tight block leading-none">
              acaDEX
            </span>
            <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500 font-semibold leading-none mt-1 block">
              Academic Platform
            </span>
          </div>
        </div>

        {/* Section Navigation Links */}
        <div className="hidden md:flex items-center space-x-8 text-xs font-medium text-slate-600">
          <button 
            onClick={() => onScrollToSection('showcase')}
            className="hover:text-slate-900 transition-colors cursor-pointer"
          >
            Live Preview
          </button>
          <button 
            onClick={() => onScrollToSection('features')}
            className="hover:text-slate-900 transition-colors cursor-pointer"
          >
            Features
          </button>
          <button 
            onClick={() => onScrollToSection('formats')}
            className="hover:text-slate-900 transition-colors cursor-pointer"
          >
            Document Formats
          </button>
          <button 
            onClick={() => onScrollToSection('roles')}
            className="hover:text-slate-900 transition-colors cursor-pointer"
          >
            For Campus Roles
          </button>
          <button 
            onClick={() => onScrollToSection('faq')}
            className="hover:text-slate-900 transition-colors cursor-pointer"
          >
            FAQ
          </button>
        </div>

        {/* Action Button */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => onGoToLogin('login')}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center space-x-2 transition cursor-pointer"
          >
            <span>Sign In to Portal</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </nav>
  );
}

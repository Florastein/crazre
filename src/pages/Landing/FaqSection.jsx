import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      q: 'What types of course material files can instructors upload?',
      a: 'Instructors can upload four main document formats: PowerPoint presentations (.pptx, .ppt) for lecture slide decks, Word documents (.docx, .doc) for syllabus files and assignment prompts, PDFs (.pdf) for reading lists and textbooks, and plain text files (.txt, .md) for setup guides or code outlines. The system auto-detects the format upon upload.'
    },
    {
      q: 'How do students know their coursework was safely received?',
      a: 'As soon as a student uploads an assignment deliverable, acaDEX issues a unique verification receipt code (for example, ADX-SUB-2026-849201). This code serves as permanent confirmation of on-time submission and includes the exact timestamp and file details.'
    },
    {
      q: 'How do interactive online quizzes work?',
      a: 'Instructors create quizzes with multiple-choice questions, set time limits (such as 15 or 30 minutes), and assign point values. Students take the quiz with a clean countdown timer, and scores are calculated automatically as soon as the quiz is submitted.'
    },
    {
      q: 'How does the platform help prevent students from falling behind?',
      a: 'The platform features an early warning system. If a student project team has had no activity, has missed a milestone deadline, or has a document awaiting review for an extended period, the system flags the issue so supervisors and department heads can intervene early.'
    },
    {
      q: 'Can I test out different roles without setting up new accounts?',
      a: 'Yes! You can use the Quick Demo buttons on this page or the login screen to sign in with one click as Sarah Al-Zaid (Student), Dr. Arthur Sterling (Lecturer & Supervisor), Dr. Marcus Vance (Head of Department), or Chancellor Alistair Grey (Super Administrator).'
    }
  ];

  return (
    <section id="faq" className="relative overflow-hidden py-16 lg:py-24 bg-white border-b border-slate-200">
      {/* Subtle fine dot texture overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}
      />
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="font-outfit text-3xl sm:text-4xl font-light text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="mt-3 text-sm text-slate-600 font-sans">
            Simple, straightforward answers about how the platform works.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div 
                key={idx}
                className="bg-white border border-slate-200 transition-colors"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between cursor-pointer focus:outline-hidden"
                >
                  <span className="text-sm font-bold text-slate-900 font-sans pr-4">
                    {faq.q}
                  </span>
                  <div className="shrink-0 text-slate-400">
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-slate-700" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-4 pb-5 sm:px-5 sm:pb-5 text-xs text-slate-600 leading-relaxed font-sans border-t border-slate-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

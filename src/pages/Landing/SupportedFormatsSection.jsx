import React from 'react';
import { Presentation, FileText, FileCode, Check, Upload, Download, ArrowRight } from 'lucide-react';

export default function SupportedFormatsSection({ onGoToLogin }) {
  const formats = [
    {
      format: 'PowerPoint',
      extensions: '.pptx, .ppt',
      icon: Presentation,
      category: 'Lecture Decks & Slides',
      description: 'Ideal for weekly classroom lectures, symposium slides, and visual project defenses.',
      badgeStyle: 'bg-amber-50 text-amber-900 border-amber-300',
      iconBg: 'bg-amber-100 text-amber-700',
      example: 'CS402_Lecture1_Consensus.pptx'
    },
    {
      format: 'Word Document',
      extensions: '.docx, .doc',
      icon: FileText,
      category: 'Syllabus & Assignment Prompts',
      description: 'Used for course outlines, detailed project specifications, and grading rubrics.',
      badgeStyle: 'bg-blue-50 text-blue-900 border-blue-300',
      iconBg: 'bg-blue-100 text-blue-700',
      example: 'SE406_WASM_Sandbox_Guide.docx'
    },
    {
      format: 'PDF Document',
      extensions: '.pdf',
      icon: FileText,
      category: 'Reference Reading & Blueprints',
      description: 'Standard format for academic journal publications, textbook chapters, and formal blueprints.',
      badgeStyle: 'bg-rose-50 text-rose-900 border-rose-300',
      iconBg: 'bg-rose-100 text-rose-700',
      example: 'CS410_UML_Architecture_Blueprints.pdf'
    },
    {
      format: 'Text Document',
      extensions: '.txt, .md',
      icon: FileCode,
      category: 'Code Outlines & Lab Guides',
      description: 'Lightweight format for terminal setup instructions, configuration notes, and code snippets.',
      badgeStyle: 'bg-emerald-50 text-emerald-900 border-emerald-300',
      iconBg: 'bg-emerald-100 text-emerald-700',
      example: 'CS402_Lab1_Setup_Instructions.txt'
    }
  ];

  return (
    <section id="formats" className="relative overflow-hidden py-16 lg:py-24 bg-white border-b border-slate-200">
      {/* Subtle fine dot texture overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}
      />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-3xl mb-12">
          <h2 className="font-outfit text-3xl sm:text-4xl font-light text-slate-900 tracking-tight">
            Distribute course materials in the file formats your faculty prefers.
          </h2>
          <p className="mt-3 text-sm text-slate-600 font-sans leading-relaxed">
            Instructors can upload files directly from their computers. The platform auto-detects the document type and formats it for student access with instant downloads.
          </p>
        </div>

        {/* 4 Format Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {formats.map((fmt, i) => {
            const Icon = fmt.icon;
            return (
              <div
                key={i}
                className="bg-white p-6 border border-slate-200 hover:border-slate-400 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-10 h-10 ${fmt.iconBg} flex items-center justify-center`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 border ${fmt.badgeStyle}`}>
                      {fmt.extensions}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mb-1 font-sans">
                    {fmt.format}
                  </h3>

                  <p className="text-[11px] font-medium text-emerald-800 uppercase font-mono mb-3">
                    {fmt.category}
                  </p>

                  <p className="text-xs text-slate-600 leading-relaxed font-sans">
                    {fmt.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100">
                  <span className="text-[10px] font-mono text-slate-400 block mb-1">Sample File:</span>
                  <div className="text-xs font-mono text-slate-800 bg-slate-50 p-2 border border-slate-200 truncate">
                    {fmt.example}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Note on upload workflow */}
        <div className="mt-8 p-4 bg-white border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <Upload className="w-5 h-5 text-slate-500 shrink-0" />
            <p className="text-xs text-slate-700">
              <strong>Drag-and-Drop Auto-Detection:</strong> File extension, formatted size in MB or KB, and appropriate document icons are configured automatically upon upload.
            </p>
          </div>
          <button
            onClick={() => onGoToLogin('login')}
            className="text-xs font-semibold text-slate-900 hover:text-emerald-700 flex items-center space-x-1.5 shrink-0 transition cursor-pointer"
          >
            <span>Try uploading in portal</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </section>
  );
}

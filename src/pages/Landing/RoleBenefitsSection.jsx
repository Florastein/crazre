import React, { useState } from 'react';
import { GraduationCap, Users, Shield, Check, ArrowRight, BookOpen, Clock, Award } from 'lucide-react';

export default function RoleBenefitsSection({ onDirectDemoLogin }) {
  const [selectedRole, setSelectedRole] = useState('student');

  const roleData = {
    student: {
      title: 'For Students',
      badge: 'Learner Experience',
      icon: GraduationCap,
      headline: 'A calm, clear path from first-year lectures to your final project defense.',
      demoUser: 'sarah@zaid.edu',
      demoName: 'Sarah Al-Zaid',
      benefits: [
        'Access all course materials (slides in PPTX, syllabus in DOCX, readings in PDF, guides in TXT) in one clean directory.',
        'Never worry about whether an assignment was received: receive a tamper-proof digital receipt code for every upload.',
        'Take timed, interactive quizzes and see your score and explanations as soon as you finish.',
        'Collaborate with project teammates, track required milestones, and review notes from supervisor meetings.'
      ],
      previewStats: [
        { label: 'Upcoming Deliverables', value: 'Live Radar' },
        { label: 'Receipt Codes', value: 'Instant' },
        { label: 'Quiz Feedback', value: 'Immediate' }
      ]
    },
    supervisor: {
      title: 'For Lecturers & Project Supervisors',
      badge: 'Teaching & Mentorship',
      icon: Users,
      headline: 'Less administrative overhead, more meaningful mentorship for your students.',
      demoUser: 'a.sterling@zaid.edu',
      demoName: 'Dr. Arthur Sterling',
      benefits: [
        'Upload lecture presentations, syllabus guidelines, and laboratory guides with automatic format recognition.',
        'Grade student coursework efficiently with custom feedback notes and scoring rubrics.',
        'Build timed multiple-choice quizzes that evaluate comprehension without tedious manual grading.',
        'Log formal project supervision meetings with attendance lists and actionable next steps.'
      ],
      previewStats: [
        { label: 'Auto-Graded Quizzes', value: 'Built-in' },
        { label: 'Meeting Action Logs', value: 'Structured' },
        { label: 'Submission Versioning', value: 'Automatic' }
      ]
    },
    admin: {
      title: 'For Department Heads & Leadership',
      badge: 'Academic Governance',
      icon: Shield,
      headline: 'Clear departmental oversight and early intervention before students fall behind.',
      demoUser: 'm.vance@zaid.edu',
      demoName: 'Dr. Marcus Vance',
      benefits: [
        'Oversee course allocations, degree programmes, and student enrollment across academic levels 100 to 400.',
        'Early warning safety flags automatically notify you when project groups are inactive or overdue.',
        'Central academic calendar synchronizes exam periods, project drafts, and mock defenses.',
        'Complete system audit logs record user actions, timestamped events, and system security.'
      ],
      previewStats: [
        { label: 'Risk Monitoring', value: 'Automated' },
        { label: 'Audit Trail', value: 'Complete' },
        { label: 'Curriculum Hierarchy', value: 'Flexible' }
      ]
    }
  };

  const current = roleData[selectedRole];
  const Icon = current.icon;

  return (
    <section id="roles" className="relative overflow-hidden py-16 lg:py-24 bg-white border-b border-slate-200">
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
        <div className="max-w-3xl mb-10">
          <h2 className="font-outfit text-3xl sm:text-4xl font-light text-slate-900 tracking-tight">
            Built specifically for each role in your academic community.
          </h2>
          <p className="mt-3 text-sm text-slate-600 font-sans leading-relaxed">
            Select a role below to explore how acaDEX streamlines daily work for students, faculty, and administrators.
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div className="flex items-center space-x-2 border-b border-slate-200 pb-px mb-8 overflow-x-auto">
          {[
            { id: 'student', label: 'Students', icon: GraduationCap },
            { id: 'supervisor', label: 'Lecturers & Supervisors', icon: Users },
            { id: 'admin', label: 'Department Heads & Admins', icon: Shield }
          ].map((r) => {
            const TabIcon = r.icon;
            const isSelected = selectedRole === r.id;
            return (
              <button
                key={r.id}
                onClick={() => setSelectedRole(r.id)}
                className={`pb-3 px-4 text-xs font-semibold flex items-center space-x-2 border-b-2 transition cursor-pointer whitespace-nowrap ${
                  isSelected
                    ? 'border-slate-900 text-slate-900'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <TabIcon className="w-4 h-4" />
                <span>{r.label}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Role Card */}
        <div className="bg-slate-50 border border-slate-200 p-6 sm:p-10">
          <div className="max-w-4xl">
            <h3 className="font-outfit text-2xl sm:text-3xl font-light text-slate-900 leading-tight mb-4">
              {current.headline}
            </h3>

            <div className="space-y-3.5 mt-6">
              {current.benefits.map((benefit, i) => (
                <div key={i} className="flex items-start space-x-3 text-xs text-slate-700">
                  <div className="w-4 h-4 rounded-none bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-emerald-700" />
                  </div>
                  <span className="leading-relaxed font-sans">{benefit}</span>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-slate-200 flex items-center gap-4">
              <button
                onClick={() => onDirectDemoLogin(current.demoUser)}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center space-x-2 transition cursor-pointer"
              >
                <span>Test Experience as {current.demoName}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

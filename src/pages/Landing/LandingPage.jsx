import React from 'react';
import { useAppState } from '../../contexts/StateContext';
import LandingNav from './LandingNav';
import HeroSection from './HeroSection';
import InteractiveShowcase from './InteractiveShowcase';
import FeaturesSection from './FeaturesSection';
import SupportedFormatsSection from './SupportedFormatsSection';
import RoleBenefitsSection from './RoleBenefitsSection';
import FaqSection from './FaqSection';
import LandingFooter from './LandingFooter';

export default function LandingPage({ onGoToLogin }) {
  const { login } = useAppState();

  const handleDirectDemoLogin = (email) => {
    try {
      login(email, 'password123');
    } catch (err) {
      // If login error occurs, fall back to login page
      onGoToLogin('login');
    }
  };

  const handleScrollToSection = (sectionId) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full min-h-screen bg-white text-slate-900 font-sans selection:bg-emerald-100 selection:text-emerald-900 overflow-x-hidden">
      {/* Top Sticky Navigation */}
      <LandingNav 
        onGoToLogin={onGoToLogin} 
        onScrollToSection={handleScrollToSection} 
      />

      {/* Hero Presentation */}
      <HeroSection 
        onGoToLogin={onGoToLogin}
        onDirectDemoLogin={handleDirectDemoLogin}
        onScrollToSection={handleScrollToSection}
      />

      {/* Live Interactive Preview Showcase */}
      <InteractiveShowcase />

      {/* Comprehensive Features Section */}
      <FeaturesSection onGoToLogin={onGoToLogin} />

      {/* Multi-Format Course Materials Highlight (.pptx, .docx, .pdf, .txt) */}
      <SupportedFormatsSection onGoToLogin={onGoToLogin} />

      {/* Campus Roles & Direct Perspectives */}
      <RoleBenefitsSection onDirectDemoLogin={handleDirectDemoLogin} />

      {/* Plain English FAQ Section */}
      <FaqSection />

      {/* Quiet Institutional Footer */}
      <LandingFooter onGoToLogin={onGoToLogin} />
    </div>
  );
}

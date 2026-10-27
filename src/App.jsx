import React, { useState, useEffect } from 'react';
import { StateProvider, useAppState } from './contexts/StateContext';
import AppShell from './components/layout/AppShell';
import LoginPage from './pages/Auth/LoginPage';
import LandingPage from './pages/Landing/LandingPage';
import StudentDashboard from './pages/Dashboard/StudentDashboard';
import SupervisorDashboard from './pages/Dashboard/SupervisorDashboard';
import HodDashboard from './pages/Dashboard/HodDashboard';
import SuperAdminDashboard from './pages/Dashboard/SuperAdminDashboard';
import UserProvisioning from './pages/UserProvisioning/UserProvisioning';
import AcademicStructure from './pages/AcademicStructure/AcademicStructure';
import SettingsAndNotifications from './pages/SettingsAndNotifications/SettingsAndNotifications';
import AcademicCalendar from './pages/AcademicCalendar/AcademicCalendar';
import AuditLogsViewer from './pages/AuditLogs/AuditLogsViewer';
import CourseworkDashboard from './pages/Coursework/CourseworkDashboard';
import QuizDashboard from './pages/Quizzes/QuizDashboard';
import CourseManagement from './pages/Courses/CourseManagement';

function AppContent() {
  const { currentUser, currentRole } = useAppState();
  const [activePage, setActivePage] = useState('dashboard');
  const [authView, setAuthView] = useState('landing'); // 'landing' | 'login'

  // Reset active page when switching roles to avoid loading an inaccessible tab
  useEffect(() => {
    setActivePage('dashboard');
  }, [currentRole]);

  // Auth Guard checking: Before the login page, show the landing page
  if (!currentUser) {
    if (authView === 'login') {
      return <LoginPage onBackToLanding={() => setAuthView('landing')} />;
    }
    return <LandingPage onGoToLogin={() => setAuthView('login')} />;
  }

  // Multi-choice role routers mapping
  const renderRolePage = () => {
    switch (activePage) {
      case 'dashboard':
        if (currentRole === 'student') return <StudentDashboard setActivePage={setActivePage} />;
        if (currentRole === 'supervisor') return <SupervisorDashboard setActivePage={setActivePage} />;
        if (currentRole === 'admin') return <HodDashboard setActivePage={setActivePage} />;
        if (currentRole === 'superadmin') return <SuperAdminDashboard setActivePage={setActivePage} />;
        return <StudentDashboard setActivePage={setActivePage} />;

      case 'workspace':
      case 'review_queue':
      case 'groups_management':
      case 'risk_monitoring':
        return <CourseworkDashboard />;

      case 'users_management':
        if (currentRole === 'admin' || currentRole === 'superadmin') return <UserProvisioning />;
        return <StudentDashboard setActivePage={setActivePage} />;

      case 'academic_structure':
        if (currentRole === 'admin' || currentRole === 'superadmin') return <AcademicStructure />;
        return <StudentDashboard setActivePage={setActivePage} />;

      case 'audit_logs':
        if (currentRole === 'superadmin') return <AuditLogsViewer />;
        return <StudentDashboard setActivePage={setActivePage} />;

      case 'calendar':
        return <AcademicCalendar />;

      case 'coursework':
        return <CourseworkDashboard />;

      case 'courses':
        return <CourseManagement setActivePage={setActivePage} />;

      case 'quizzes':
        return <QuizDashboard setActivePage={setActivePage} />;

      case 'notifications':
        return <SettingsAndNotifications initialMode="notifications" />;

      case 'settings':
        return <SettingsAndNotifications initialMode="profile" />;

      default:
        return <StudentDashboard setActivePage={setActivePage} />;
    }
  };

  return (
    <AppShell activePage={activePage} setActivePage={setActivePage}>
      <div className="transition-all duration-300">
        {renderRolePage()}
      </div>
    </AppShell>
  );
}

export default function App() {
  return (
    <StateProvider>
      <AppContent />
    </StateProvider>
  );
}

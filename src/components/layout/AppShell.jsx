import React, { useState, useEffect, useRef } from 'react';
import { useAppState } from '../../contexts/StateContext';
import { 
  Menu, X, Search, Bell, Shield, ChevronDown, ChevronRight, User, LogOut, Settings, 
  BookOpen, Folder, Calendar, Milestone, FileText, ClipboardList, 
  BarChart2, Users, AlertTriangle, Database, Sun, Moon, HelpCircle
} from 'lucide-react';

export default function AppShell({ children, activePage, setActivePage }) {
  const { 
    currentUser, 
    currentRole, 
    switchRole, 
    logout, 
    notifications, 
    markNotificationRead, 
    markAllNotificationsRead,
    theme, 
    setTheme,
    searchOpen,
    setSearchOpen,
    users,
    groups,
    documents,
    milestones,
    courseworks,
    quizzes = []
  } = useAppState();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState({ users: [], groups: [], documents: [], milestones: [] });
  
  const searchInputRef = useRef(null);

  // Listen for custom navigation events
  useEffect(() => {
    const handleCustomNavigate = (e) => {
      if (e.detail) setActivePage(e.detail);
    };
    window.addEventListener('navigate-page', handleCustomNavigate);
    return () => window.removeEventListener('navigate-page', handleCustomNavigate);
  }, [setActivePage]);
  const userNotifications = notifications.filter(n => n.userId === currentUser?.id);
  const unreadCount = userNotifications.filter(n => !n.read).length;

  // Handle Search Execution
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults({ users: [], groups: [], documents: [], milestones: [] });
      return;
    }

    const q = searchQuery.toLowerCase();
    
    const matchedUsers = users.filter(u => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || (u.indexNum && u.indexNum.toLowerCase().includes(q)));
    const matchedGroups = groups.filter(g => g.name.toLowerCase().includes(q) || (g.project && g.project.toLowerCase().includes(q)));
    const matchedDocs = documents.filter(d => d.name.toLowerCase().includes(q) || (d.notes && d.notes.toLowerCase().includes(q)));
    const matchedMilestones = milestones.filter(m => m.title.toLowerCase().includes(q) || m.desc.toLowerCase().includes(q));

    setSearchResults({
      users: matchedUsers.slice(0, 5),
      groups: matchedGroups.slice(0, 5),
      documents: matchedDocs.slice(0, 5),
      milestones: matchedMilestones.slice(0, 5)
    });
  }, [searchQuery, users, groups, documents, milestones]);

  // Focus search input on open
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current.focus(), 100);
    }
  }, [searchOpen]);

  // Close dropdowns on click outside
  const bellRef = useRef(null);
  const avatarRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (bellRef.current && !bellRef.current.contains(event.target)) {
        setNotifDropdownOpen(false);
      }
      if (avatarRef.current && !avatarRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Determine standard role based routes
  const navigationItems = {
    student: [
      { id: 'dashboard', label: 'Dashboard', icon: BarChart2 },
      { id: 'courses', label: 'Course Materials', icon: BookOpen },
      { id: 'coursework', label: 'Coursework', icon: ClipboardList, badge: (courseworks || []).filter(cw => !cw.submissions.some(s => s.studentId === currentUser?.id)).length },
      { id: 'quizzes', label: 'Quizzes & Tests', icon: HelpCircle, badge: (quizzes || []).filter(q => !(q.submissions || []).some(s => s.studentId === currentUser?.id)).length },
      { id: 'calendar', label: 'Academic Calendar', icon: Calendar },
      { id: 'settings', label: 'System Settings', icon: Settings }
    ],
    supervisor: [
      { id: 'dashboard', label: 'Dashboard', icon: BarChart2 },
      { id: 'courses', label: 'Course', icon: BookOpen },
      { id: 'coursework', label: 'Course Assignments', icon: ClipboardList, badge: (courseworks || []).reduce((acc, cw) => acc + cw.submissions.filter(s => s.status === 'submitted').length, 0) },
      { id: 'quizzes', label: 'Quizzes & Assessments', icon: HelpCircle },
      { id: 'calendar', label: 'Academic Calendar', icon: Calendar },
      { id: 'settings', label: 'System Settings', icon: Settings }
    ],
    admin: [
      { id: 'dashboard', label: 'Dashboard', icon: BarChart2 },
      { id: 'courses', label: 'Course', icon: BookOpen },
      { id: 'users_management', label: 'User Provisioning', icon: Users },
      { id: 'coursework', label: 'Coursework Portal', icon: ClipboardList },
      { id: 'quizzes', label: 'Quizzes & Tests', icon: HelpCircle },
      { id: 'academic_structure', label: 'Academic Structure', icon: Folder },
      { id: 'settings', label: 'System Settings', icon: Settings }
    ],
    superadmin: [
      { id: 'dashboard', label: 'System Dashboard', icon: BarChart2 },
      { id: 'courses', label: 'Course', icon: BookOpen },
      { id: 'users_management', label: 'Role Provisioning', icon: Users },
      { id: 'coursework', label: 'Coursework Portal', icon: ClipboardList },
      { id: 'quizzes', label: 'Quizzes & Tests', icon: HelpCircle },
      { id: 'academic_structure', label: 'Academic Structure', icon: Folder },
      { id: 'audit_logs', label: 'Immutable Audit Logs', icon: Database },
      { id: 'settings', label: 'Global Settings', icon: Settings }
    ]
  };

  const navs = navigationItems[currentRole] || navigationItems.student;

  const handleNavClick = (id) => {
    setActivePage(id);
    setMobileMenuOpen(false);
  };

  const handleResultClick = (targetPage, groupFocusId) => {
    setActivePage(targetPage);
    setSearchOpen(false);
    setSearchQuery('');
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-paper font-sans antialiased text-ink overflow-hidden transition-colors duration-200">
      
      {/* 1. TOPBAR */}
      <header className={`h-16 fixed top-0 left-0 right-0 z-40 bg-white border-b border-ink/5 text-ink px-4 md:px-6 flex items-center justify-between shadow-xs transition-all duration-250 ease-in-out ${sidebarOpen ? 'md:left-64' : 'md:left-[72px]'}`}>
        <div className="flex items-center space-x-3">
          {/* Mobile Hamburger toggle */}
          <button 
            id="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-md text-muted hover:text-ink hover:bg-ink/5 focus:outline-none"
            aria-label="Toggle Navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Institutional logo mark - Mobile Only */}
          <div className="flex items-center space-x-2.5 md:hidden">
            <span className="w-8 h-8 rounded-xs bg-ink flex items-center justify-center font-serif italic text-white text-lg font-bold shadow-sm">
              A
            </span>
            <span className="serif-display text-2xl tracking-normal font-bold text-ink hover:text-accent transition-colors">
              acaDEX
            </span>
          </div>

          {/* Action-relative Breadcrumbs */}
          <span className="hidden md:inline-flex items-center space-x-2 text-xs font-mono text-muted select-none">
            <span className="uppercase text-[10px] tracking-widest font-bold text-muted/80 hover:text-ink transition-colors cursor-pointer" onClick={() => setActivePage('dashboard')}>
              PORTAL
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-ink/20 shrink-0" />
            <span className="uppercase text-[10px] tracking-wider font-bold text-slate-500">
              {currentRole}
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-ink/20 shrink-0" />
            <span className="text-ink font-sans font-semibold tracking-wide uppercase text-[11px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-sm">
              {activePage.split('_').join(' ')}
            </span>
          </span>
        </div>

        {/* Topbar Actions Area */}
        <div className="flex items-center space-x-3 md:space-x-4">
          
          {/* Global Multi-Role Developer Matrix Switcher */}
          <div className="hidden sm:flex items-center bg-paper rounded-md px-3 py-1 border border-ink/10">
            <Shield className="w-3.5 h-3.5 text-accent mr-1.5" />
            <select 
              id="dev-role-switcher"
              value={currentRole}
              onChange={(e) => switchRole(e.target.value)}
              className="text-xs font-sans bg-transparent text-ink border-none outline-none focus:ring-0 cursor-pointer font-semibold"
            >
              <option value="student" className="bg-white text-ink">Student View</option>
              <option value="supervisor" className="bg-white text-ink">Lecturer / Supervisor View</option>
              <option value="admin" className="bg-white text-ink">Admin HOD View</option>
              <option value="superadmin" className="bg-white text-ink">Super Admin View</option>
            </select>
          </div>

          {/* Trigger System Search */}
          <button 
            id="global-search-btn"
            onClick={() => setSearchOpen(true)}
            className="p-1.5 hover:bg-ink/5 rounded-md cursor-pointer text-muted hover:text-ink transition-colors duration-150"
            aria-label="Universal Search Overlays"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Dynamic Theme Toggle Action */}
          <button 
            id="global-theme-toggle-btn"
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            className="p-1.5 hover:bg-ink/5 rounded-md cursor-pointer text-muted hover:text-ink transition-colors duration-150"
            aria-label="Toggle Theme Mode"
            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5 text-status-pending" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>

          {/* Notification dropdown trigger */}
          <div className="relative" ref={bellRef}>
            <button 
              id="bell-notif-btn"
              onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
              className="p-1.5 hover:bg-ink/5 rounded-md relative cursor-pointer text-muted hover:text-ink transition-colors duration-150"
              aria-label="Notifications Panel"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 rounded-[9999px] bg-accent text-[9px] font-bold text-white flex items-center justify-center px-1 animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* In-app Notification Dropdown Widget */}
            {notifDropdownOpen && (
              <div id="notif-dropdown" className="absolute right-0 mt-3 w-80 bg-white border border-ink/10 rounded-md shadow-premium z-50 overflow-hidden text-ink animate-fade-in">
                <div className="px-4 py-3 bg-paper text-ink font-sans font-semibold text-sm flex items-center justify-between border-b border-ink/10">
                  <span>Audit notifications</span>
                  {unreadCount > 0 && (
                    <button 
                      onClick={() => markAllNotificationsRead(currentUser?.id)}
                      className="text-xs text-accent hover:underline font-normal cursor-pointer"
                    >
                      Mark all read
                    </button>
                  )}
                </div>
                <div className="max-h-72 overflow-y-auto divide-y divide-ink/5">
                  {userNotifications.length === 0 ? (
                    <div className="p-6 text-center text-muted text-xs">
                      No new notifications inside log archives.
                    </div>
                  ) : (
                    userNotifications.map(n => (
                      <div 
                        key={n.id} 
                        onClick={() => {
                          markNotificationRead(n.id);
                          setNotifDropdownOpen(false);
                          handleNavClick('notifications');
                        }}
                        className={`p-3.5 hover:bg-paper transition-colors duration-150 cursor-pointer flex space-x-3 text-xs ${!n.read ? 'bg-paper border-l-2 border-accent' : ''}`}
                      >
                        <div className="flex-1">
                          <p className="font-semibold text-ink">{n.title}</p>
                          <p className="text-muted mt-1">{n.message}</p>
                          <span className="text-[10px] text-muted mt-2 block font-mono">
                            {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <div className="px-4 py-2 border-t border-ink/10 text-center bg-paper">
                  <button 
                    onClick={() => {
                      setNotifDropdownOpen(false);
                      handleNavClick('notifications');
                    }}
                    className="text-xs text-ink font-medium hover:text-accent cursor-pointer"
                  >
                    View all alerts
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User profile with contextual switch options */}
          <div className="relative" ref={avatarRef}>
            <button 
              id="user-profile-menu-btn"
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="flex items-center space-x-2 text-ink hover:text-accent focus:outline-none cursor-pointer text-sm"
            >
              <div className="w-8 h-8 rounded-full bg-ink flex items-center justify-center font-bold text-xs text-white">
                {currentUser?.name ? currentUser.name.split(' ').map(n=>n[0]).join('') : 'U'}
              </div>
              <ChevronDown className="w-4 h-4 text-muted" />
            </button>

            {profileDropdownOpen && (
              <div id="user-profile-dropdown" className="absolute right-0 mt-3 w-64 bg-white border border-ink/10 text-ink rounded-md shadow-premium z-50 overflow-hidden py-1">
                <div className="px-4 py-3 border-b border-ink/10 bg-paper">
                  <p className="font-semibold text-ink text-sm">{currentUser?.name}</p>
                  <p className="text-xs text-muted font-mono truncate">{currentUser?.email}</p>
                  <span className="inline-block mt-2 bg-paper border border-ink/10 text-ink text-[10px] py-0.5 px-2 rounded-full font-bold">
                    {currentUser?.indexNum || currentRole.toUpperCase()}
                  </span>
                </div>

                <div className="py-1">
                  <button 
                    onClick={() => { setProfileDropdownOpen(false); handleNavClick('settings'); }} 
                    className="w-full text-left px-4 py-2 text-xs hover:bg-paper text-muted hover:text-ink flex items-center space-x-2.5 cursor-pointer"
                  >
                    <User className="w-4 h-4 text-muted" />
                    <span>My Profile & Hours</span>
                  </button>
                  <button 
                    onClick={() => { setProfileDropdownOpen(false); handleNavClick('settings'); }}
                    className="w-full text-left px-4 py-2 text-xs hover:bg-paper text-muted hover:text-ink flex items-center space-x-2.5 cursor-pointer"
                  >
                    <Settings className="w-4 h-4 text-muted" />
                    <span>System Sync Settings</span>
                  </button>
                  
                  {/* Small dark mode toggle inside user settings */}
                  <button 
                    onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} 
                    className="w-full text-left px-4 py-2 text-xs hover:bg-paper text-muted hover:text-ink flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center space-x-2.5">
                      <Settings className="w-4 h-4 text-muted" />
                      <span>Dark Theme Focus</span>
                    </div>
                    <span className="text-[10px] font-bold text-accent uppercase">
                      {theme}
                    </span>
                  </button>
                </div>

                <div className="border-t border-ink/10 py-1">
                  <button 
                    onClick={logout} 
                    className="w-full text-left px-4 py-2 text-xs hover:bg-status-rejected/15 text-status-rejected flex items-center space-x-2.5 cursor-pointer font-bold"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Terminate Session</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* 2. BODY CONTAINER */}
      <div className="flex-1 flex pt-16 relative overflow-hidden">
        
        {/* DESKTOP COLLAPSIBLE SIDEBAR WITH FOLIO STYLE BORDER */}
        <aside 
          id="sidebar"
          className={`hidden md:block fixed left-0 top-0 bottom-0 z-30 bg-white border-r border-[#cbd5e1] dark:border-slate-800 transition-all duration-250 ease-in-out ${sidebarOpen ? 'w-64' : 'w-[72px]'}`}
        >
          <div className="flex flex-col h-full justify-between">
            <div>
              {/* BRAND HEADER METAPHOR */}
              <div className={`h-16 flex items-center border-b border-ink/5 bg-white ${sidebarOpen ? 'px-6' : 'justify-center'}`}>
                <div className="flex items-center space-x-2.5">
                  <span className="w-8 h-8 rounded-xs bg-ink flex items-center justify-center font-serif italic text-white text-lg font-bold shadow-sm shrink-0">
                    A
                  </span>
                  {sidebarOpen && (
                    <div className="flex flex-col">
                      <span className="serif-display text-base tracking-normal font-bold text-ink leading-none">
                        acaDEX
                      </span>
                      <span className="text-[8px] tracking-widest text-[#8a99ad] font-mono uppercase font-bold mt-1 leading-none">
                        SUPERVISION & ARCV
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <nav className="p-3 space-y-1">
                <div className="py-2.5 px-3 mb-1 text-[10px] tracking-wider font-mono text-muted uppercase font-bold">
                  {sidebarOpen ? 'Navigation Portal' : 'NAV'}
                </div>
                {navs.map(item => {
                  const Icon = item.icon;
                  const isActive = activePage === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className={`w-full flex items-center p-2.5 text-xs rounded-lg transition-all duration-200 relative group cursor-pointer ${
                        isActive 
                          ? 'bg-ink text-white font-medium border-l-4 border-accent rounded-l-none shadow-premium' 
                          : 'text-muted hover:bg-ink/5 hover:text-ink'
                      }`}
                    >
                      <Icon className={`w-4 h-4 flex-shrink-0 transition-colors duration-200 ${isActive ? 'text-accent' : 'text-muted group-hover:text-ink'}`} />
                      {sidebarOpen && <span className="ml-3 font-medium">{item.label}</span>}
                      
                      {/* Badge support on icons */}
                      {item.badge > 0 && (
                        <span className={`absolute flex items-center justify-center min-w-4 h-4 rounded-full text-[9px] font-bold px-1 ${
                          sidebarOpen ? 'right-2.5' : 'top-1 right-1'
                        } ${item.id === 'risk_monitoring' ? 'bg-status-risk text-white' : 'bg-accent text-white'}`}>
                          {item.badge}
                        </span>
                      )}

                      {/* Collapsed view tooltip */}
                      {!sidebarOpen && (
                        <span className="absolute left-16 bg-ink text-white text-xs rounded-md px-2 py-1.5 opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-150 z-50 whitespace-nowrap">
                          {item.label}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Sidebar toggle control */}
            <div className="p-3 border-t border-ink/5">
              <button 
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="w-full flex items-center p-2 text-xs text-muted hover:text-ink hover:bg-ink/5 rounded-lg cursor-pointer transition-colors duration-200"
              >
                <div className="w-5 h-5 flex items-center justify-center font-bold">
                  {sidebarOpen ? '◀' : '▶'}
                </div>
                {sidebarOpen && <span className="ml-3 font-mono">Collapse bar</span>}
              </button>
            </div>
          </div>
        </aside>

        {/* MOBILE SLIDE-OUT ASIDE DRAWER */}
        {mobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-50 flex">
            {/* Backdrop overlay */}
            <div 
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-ink/30 backdrop-blur-xs"
            ></div>
            
            <aside className="relative flex flex-col w-72 max-w-xs h-full bg-white border-r border-ink/10 p-4 text-ink z-50">
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-ink/10">
                <span className="font-serif italic font-bold text-2xl tracking-normal text-ink">acaDEX</span>
                <button 
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded-full text-muted hover:text-ink"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile dev switcher */}
              <div className="mb-6 bg-paper p-3 rounded-lg border border-ink/5 flex items-center justify-between">
                <span className="text-xs text-muted">Preview Role:</span>
                <select 
                  value={currentRole}
                  onChange={(e) => switchRole(e.target.value)}
                  className="bg-transparent text-xs text-ink border-none outline-none font-bold"
                >
                  <option value="student" className="bg-white text-ink">Student</option>
                  <option value="supervisor" className="bg-white text-ink">Supervisor</option>
                  <option value="admin" className="bg-white text-ink">Admin HOD</option>
                  <option value="superadmin" className="bg-white text-ink">Super Admin</option>
                </select>
              </div>

              <nav className="space-y-1.5 flex-1">
                {navs.map(item => {
                  const Icon = item.icon;
                  const isActive = activePage === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className={`w-full flex items-center p-3 text-xs rounded-lg transition-colors cursor-pointer ${
                        isActive 
                          ? 'bg-ink text-white border-l-4 border-accent shadow-premium' 
                          : 'text-muted hover:bg-ink/5 hover:text-ink'
                      }`}
                    >
                      <Icon className={`w-5 h-5 mr-3 transition-colors duration-150 ${isActive ? 'text-accent' : 'text-muted group-hover:text-ink'}`} />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  );
                })}
              </nav>

              <div className="pt-4 border-t border-ink/10 mt-auto">
                <button 
                  onClick={logout}
                  className="w-full flex items-center p-3 text-xs text-status-rejected hover:bg-status-rejected/10 rounded-lg cursor-pointer font-bold"
                >
                  <LogOut className="w-5 h-5 mr-3" />
                  Terminate Session
                </button>
              </div>
            </aside>
          </div>
        )}

        {/* MAIN WORKSPACE CONTENT CONTAINER - LOCKED HEIGHT, SCROLLABLE */}
        <main 
          id="main-viewport"
          className={`flex-1 h-[calc(100vh-64px)] overflow-y-auto transition-all duration-250 ease-in-out bg-paper ${
            sidebarOpen ? 'md:pl-64' : 'md:pl-[72px]'
          }`}
        >
          <div className="p-4 md:p-8 max-w-7xl mx-auto min-h-full pb-16">
            {children}
          </div>
        </main>
      </div>

      {/* 3. UNIVERSAL BLAZING FAST SEARCH OVERLAY */}
      {searchOpen && (
        <div id="search-overlay" className="fixed inset-0 bg-ink/40 backdrop-blur-md flex items-start justify-center pt-20 z-50 px-4">
          <div className="bg-white border-2 border-ink rounded-lg shadow-premium w-full max-w-2xl overflow-hidden text-ink animate-scale-up">
            <div className="flex items-center p-4 border-b border-ink/10 bg-paper">
              <Search className="w-5 h-5 text-accent" />
              <input 
                ref={searchInputRef}
                type="text" 
                placeholder="Search database (students, lecturers, courses, courseworks...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="ml-3 flex-1 bg-transparent border-none outline-none text-sm text-ink placeholder-muted font-sans"
              />
              <button 
                onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
                className="p-1 rounded-full text-muted hover:text-ink hover:bg-ink/5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Results container */}
            <div className="max-h-96 overflow-y-auto p-4 space-y-4">
              {!searchQuery.trim() ? (
                <div className="text-center py-8 text-muted space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-wider font-mono">Institutional Database Search</p>
                  <p className="text-sm text-muted">Type any query to search active departments and files.</p>
                </div>
              ) : (
                <>
                  {/* Category: Users Matched */}
                  {searchResults.users.length > 0 && (
                    <div>
                      <h4 className="text-[10px] font-bold text-accent uppercase tracking-wider font-mono mb-2">Academic Users Found</h4>
                      <div className="space-y-1.5">
                        {searchResults.users.map(u => (
                          <div 
                              key={u.id}
                              onClick={() => handleResultClick(u.role === 'student' ? 'workspace' : 'users_management')}
                              className="p-2.5 rounded border border-ink/10 hover:border-accent hover:bg-paper cursor-pointer flex justify-between items-center text-xs"
                            >
                            <div>
                              <p className="font-semibold">{u.name}</p>
                              <p className="text-muted text-[11px] font-mono">{u.email}</p>
                            </div>
                            <span className="bg-paper border border-ink/10 text-ink px-2 py-0.5 rounded-full uppercase text-[9px] font-bold">
                              {u.role}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Category: Groups Matched */}
                  {searchResults.groups.length > 0 && (
                    <div>
                      <h4 className="text-[10px] font-bold text-accent uppercase tracking-wider font-mono mb-2">Research collectives</h4>
                      <div className="space-y-1.5">
                        {searchResults.groups.map(g => (
                          <div 
                            key={g.id}
                            onClick={() => handleResultClick('workspace')}
                            className="p-2.5 rounded border border-ink/10 hover:border-accent hover:bg-paper cursor-pointer text-xs"
                          >
                            <p className="font-bold">{g.name} — Level {g.level}</p>
                            <p className="text-muted text-[11px] truncate">{g.project}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Category: Documents/Theses Matched */}
                  {searchResults.documents.length > 0 && (
                    <div>
                      <h4 className="text-[10px] font-bold text-accent uppercase tracking-wider font-mono mb-2">Associated project artifacts</h4>
                      <div className="space-y-1.5">
                        {searchResults.documents.map(d => (
                          <div 
                            key={d.id}
                            onClick={() => handleResultClick('workspace')}
                            className="p-2.5 rounded border border-ink/10 hover:border-accent hover:bg-paper cursor-pointer text-xs flex justify-between items-center"
                          >
                            <div>
                              <p className="font-semibold text-ink">{d.name}</p>
                              <p className="text-muted text-[11px] font-mono">v{d.version} — Size: {d.size}</p>
                            </div>
                            <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                              d.status === 'approved' ? 'bg-accent/15 text-accent' : d.status === 'review' ? 'bg-indigo-100 text-indigo-805' : 'bg-amber-100 text-amber-805'
                            }`}>
                              {d.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Complete Empty Results Check */}
                  {searchResults.users.length === 0 && searchResults.groups.length === 0 && searchResults.documents.length === 0 && searchResults.milestones.length === 0 && (
                    <div className="text-center py-10 text-muted">
                      No matching records located in the institutional database.
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="p-3 bg-paper border-t border-ink/10 text-center text-[10px] text-muted font-mono">
              Press Escape to terminate search. Standard IndexedDB searching is fully active.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

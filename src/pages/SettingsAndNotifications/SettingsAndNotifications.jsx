import React, { useState } from 'react';
import { useAppState } from '../../contexts/StateContext';
import { 
  Bell, Settings, ShieldAlert, Check, User, Save, Lock, 
  Trash2, Monitor, Inbox, Trash
} from 'lucide-react';

export default function SettingsAndNotifications({ initialMode }) {
  const { 
    currentUser, 
    currentRole, 
    notifications, 
    markNotificationRead, 
    markAllNotificationsRead,
    theme, 
    setTheme 
  } = useAppState();

  const [activeTab, setActiveTab] = useState(initialMode || 'notifications'); // 'notifications' | 'profile' | 'security'
  const [notifFilter, setNotifFilter] = useState('all'); // 'all' | 'unread' | 'feedback' | 'deadline'

  // Input states for settings
  const [fullName, setFullName] = useState(currentUser?.name || '');
  const [profilePhone, setProfilePhone] = useState('+234 (0) 803 123 4567');
  const [bioState, setBioState] = useState(currentUser?.bio || 'Authorized academic researcher in cs/se fields.');
  const [passOld, setPassOld] = useState('');
  const [passNew, setPassNew] = useState('');

  const userNotifications = notifications.filter(n => n.userId === currentUser?.id);
  const filteredNotifications = userNotifications.filter(n => {
    if (notifFilter === 'all') return true;
    if (notifFilter === 'unread') return !n.read;
    return n.type === notifFilter;
  });

  const handleProfileSave = (e) => {
    e.preventDefault();
    alert('Academic profile updates synchronized with institutional Active Directory.');
  };

  const handlePasswordSave = (e) => {
    e.preventDefault();
    if (!passOld || !passNew) return;
    alert('Accredited security credentials modified successfully. Session remains active.');
    setPassOld('');
    setPassNew('');
  };

  return (
    <div className="space-y-6 animate-fade-in text-text-primary text-xs">
      
      {/* 1. COMPACT SWITCH TAB HEADER */}
      <div className="flex border-b border-border pl-1 space-x-1 overflow-x-auto">
        <button 
          onClick={() => setActiveTab('notifications')}
          className={`px-4.5 py-3 text-xs font-semibold border-b-2 hover:bg-border/20 cursor-pointer transition ${
            activeTab === 'notifications' ? 'border-primary-500 text-primary-900 font-bold' : 'border-transparent text-text-muted'
          }`}
        >
          <Bell className="w-4 h-4 inline mr-1.5" /> Notifications Archive ({userNotifications.filter(n=>!n.read).length} unread)
        </button>
        <button 
          onClick={() => setActiveTab('profile')}
          className={`px-4.5 py-3 text-xs font-semibold border-b-2 hover:bg-border/20 cursor-pointer transition ${
            activeTab === 'profile' ? 'border-primary-500 text-primary-900 font-bold' : 'border-transparent text-text-muted'
          }`}
        >
          <User className="w-4 h-4 inline mr-1.5" /> Profile & Available Hours
        </button>
        <button 
          onClick={() => setActiveTab('security')}
          className={`px-4.5 py-3 text-xs font-semibold border-b-2 hover:bg-border/20 cursor-pointer transition ${
            activeTab === 'security' ? 'border-primary-500 text-primary-900 font-bold' : 'border-transparent text-text-muted'
          }`}
        >
          <Lock className="w-4 h-4 inline mr-1.5" /> Security & Passwords
        </button>
      </div>

      {/* 2. TABBED RENDERING VIEWPORTS */}
      <div className="animate-fade-in">
        
        {/* VIEW 1: NOTIFICATIONS LIST */}
        {activeTab === 'notifications' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center bg-surface p-4 rounded-xl border border-border flex-col sm:flex-row gap-3">
              <div className="flex space-x-1 w-full sm:w-auto overflow-x-auto">
                {['all', 'unread', 'feedback', 'deadline'].map(f => (
                  <button 
                    key={f}
                    onClick={() => setNotifFilter(f)}
                    className={`px-3 py-1 bg-surface-alt hover:bg-border/40 border border-border text-[10px] rounded-full uppercase font-mono font-semibold cursor-pointer ${
                      notifFilter === f ? 'bg-primary-900 text-white border-transparent' : 'text-text-muted'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>

              {userNotifications.filter(n=>!n.read).length > 0 && (
                <button 
                  onClick={() => markAllNotificationsRead(currentUser?.id)}
                  className="text-xs text-primary-605 text-primary-600 font-semibold hover:underline"
                >
                  Mark all read
                </button>
              )}
            </div>

            {/* Notification items */}
            {filteredNotifications.length === 0 ? (
              <div className="p-12 text-center text-text-muted space-y-2 border border-dashed rounded-xl bg-surface">
                <Inbox className="w-10 h-10 mx-auto text-text-muted animate-pulse" />
                <p className="font-semibold text-xs mt-2">No notifications found</p>
                <p className="text-[11px]">All system logs are caught up.</p>
              </div>
            ) : (
              <div className="bg-surface rounded-xl border border-border shadow-card divide-y divide-border overflow-hidden">
                {filteredNotifications.map(n => (
                  <div 
                    key={n.id}
                    onClick={() => markNotificationRead(n.id)}
                    className={`p-4 flex items-start space-x-3.5 hover:bg-primary-50/10 cursor-pointer transition ${
                      !n.read ? 'bg-primary-50/15 border-l-3 border-primary-500' : ''
                    }`}
                  >
                    <div className="flex-1 space-y-1">
                      <div className="flex justify-between items-center">
                        <h4 className="font-serif text-[13px] font-bold text-text-primary">{n.title}</h4>
                        <span className="text-[10px] text-text-muted font-mono shrink-0">
                          {new Date(n.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-text-secondary text-xs leading-relaxed font-sans">{n.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* VIEW 2: PROFILE MANAGEMENT */}
        {activeTab === 'profile' && (
          <div className="bg-surface p-6 rounded-xl border border-border shadow-card max-w-xl space-y-4">
            <div>
              <h3 className="font-serif text-sm font-bold text-primary-900">Institutional Profile Detail</h3>
              <p className="text-[10px] font-mono text-text-muted">MANAGE BIOMETRICS STAMPS</p>
            </div>

            <form onSubmit={handleProfileSave} className="space-y-4 font-sans text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-text-secondary uppercase">Full Name</label>
                  <input 
                    type="text" 
                    required 
                    value={fullName} 
                    onChange={(e) => setFullName(e.target.value)} 
                    className="w-full h-10 px-3 border border-border rounded-lg bg-surface-alt"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-text-secondary uppercase">Phone Number</label>
                  <input 
                    type="text" 
                    value={profilePhone} 
                    onChange={(e) => setProfilePhone(e.target.value)} 
                    className="w-full h-10 px-3 border border-border rounded-lg bg-surface-alt"
                  />
                </div>
              </div>

              {currentRole === 'supervisor' && (
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-text-secondary uppercase">Brief Vetting Research Bio</label>
                  <textarea 
                    rows={4} 
                    value={bioState} 
                    onChange={(e) => setBioState(e.target.value)} 
                    className="w-full p-2.5 border border-border rounded-lg bg-surface-alt outline-none"
                  />
                </div>
              )}

              <div className="flex justify-end pt-2 border-t border-border mt-2">
                <button 
                  type="submit"
                  className="h-10 px-5 bg-primary-900 hover:bg-primary-800 text-white rounded-lg font-bold flex items-center space-x-1.5 cursor-pointer shadow-sm"
                >
                  <Save className="w-4 h-4" />
                  <span>Update Profile Info</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* VIEW 3: SECURITY CONTROLS */}
        {activeTab === 'security' && (
          <div className="bg-surface p-6 rounded-xl border border-border shadow-card max-w-md space-y-4">
            <div>
              <h3 className="font-serif text-sm font-bold text-primary-900">Modify Security clearance Credentials</h3>
              <p className="text-[10px] font-mono text-text-muted font-bold text-primary-610">PASSWORD MANAGEMENT INDEX</p>
            </div>

            <form onSubmit={handlePasswordSave} className="space-y-4 text-xs font-sans">
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-text-secondary uppercase">Current Old Password *</label>
                <input 
                  type="password" 
                  required 
                  value={passOld} 
                  onChange={(e) => setPassOld(e.target.value)} 
                  className="w-full h-10 px-3 border border-border bg-surface-alt rounded-lg"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-text-secondary uppercase">Proposed New Password *</label>
                <input 
                  type="password" 
                  required 
                  value={passNew} 
                  onChange={(e) => setPassNew(e.target.value)} 
                  className="w-full h-10 px-3 border border-border bg-surface-alt rounded-lg"
                />
              </div>

              {/* Password strength indicators */}
              <div className="p-3 bg-primary-50/20 border border-primary-100 rounded-lg flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="font-mono text-[10px] text-text-secondary">Password strength index rating: <span className="font-bold text-emerald-805">EXCELLENT</span></span>
              </div>

              <div className="flex justify-end pt-2 border-t border-border mt-2">
                <button 
                  type="submit"
                  className="h-10 px-5 bg-primary-900 hover:bg-primary-800 text-white rounded-lg font-bold flex items-center justify-center space-x-1.5 cursor-pointer shadow-sm"
                >
                  <Lock className="w-4 h-4" />
                  <span>Configure Credentials</span>
                </button>
              </div>
            </form>
          </div>
        )}

      </div>

    </div>
  );
}

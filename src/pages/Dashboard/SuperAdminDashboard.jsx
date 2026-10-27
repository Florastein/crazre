import React, { useState } from 'react';
import { useAppState } from '../../contexts/StateContext';
import { 
  Users, ShieldCheck, Database, FileText, ArrowRight, CheckCircle, 
  Send, Eye, RefreshCw, BarChart2, Server, Key
} from 'lucide-react';

export default function SuperAdminDashboard({ setActivePage }) {
  const { 
    users, 
    groups, 
    documents, 
    auditLogs,
    departments,
    programmes
  } = useAppState();

  const [filterAction, setFilterAction] = useState('ALL');
  const [dbBackupStatus, setDbBackupStatus] = useState('READY'); // READY, BACKING_UP, SUCCESS

  const backupDatabase = () => {
    setDbBackupStatus('BACKING_UP');
    setTimeout(() => {
      setDbBackupStatus('SUCCESS');
      setTimeout(() => setDbBackupStatus('READY'), 3000);
    }, 1500);
  };

  // Compute stats
  const totalStudents = users.filter(u => u.role === 'student').length;
  const totalSupervisors = users.filter(u => u.role === 'supervisor').length;
  const totalHods = users.filter(u => u.role === 'admin').length;
  const totalSuperAdmins = users.filter(u => u.role === 'superadmin').length;

  const filteredLogs = filterAction === 'ALL' 
    ? auditLogs 
    : auditLogs.filter(log => log.action === filterAction);

  const uniqueActions = ['ALL', ...new Set(auditLogs.map(log => log.action))];

  return (
    <div className="space-y-8 animate-fade-in text-text-primary" id="superadmin-dashboard-root">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-4 border-b border-border">
        <div>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-primary-900">
            SuperAdmin Command Center
          </h1>
          <p className="text-sm text-text-secondary mt-1 font-sans">
            Global system overrides, institutional telemetry audits, and immutable security transaction logging.
          </p>
        </div>
        <div className="mt-4 md:mt-0 bg-emerald-50 px-3.5 py-1.5 rounded-lg border border-emerald-200 text-xs font-mono font-bold text-emerald-800 flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 animate-pulse" />
          <span>System Status: Fully Operational</span>
        </div>
      </div>

      {/* STATS TELEMETRY GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* STAT 1: Global Registered Accounts */}
        <div className="bg-surface p-5 rounded-xl border border-border shadow-card hover:border-primary-400 transition flex items-start space-x-4">
          <div className="p-3 bg-primary-100 rounded-lg text-primary-500">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-mono tracking-wider text-text-muted">Total Accounts</span>
            <p className="font-serif text-2xl font-bold mt-1 text-text-primary">{users.length}</p>
          </div>
        </div>

        {/* STAT 2: Active Academic Groups */}
        <div className="bg-surface p-5 rounded-xl border border-border shadow-card hover:border-primary-400 transition flex items-start space-x-4">
          <div className="p-3 bg-purple-100 rounded-lg text-purple-600">
            <Server className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-mono tracking-wider text-text-muted">Active Node Groups</span>
            <p className="font-serif text-2xl font-bold mt-1 text-text-primary">{groups.length}</p>
          </div>
        </div>

        {/* STAT 3: Total Audits Recorded */}
        <div className="bg-surface p-5 rounded-xl border border-border shadow-card hover:border-primary-400 transition flex items-start space-x-4">
          <div className="p-3 bg-amber-100 rounded-lg text-amber-600">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-mono tracking-wider text-text-muted">Transactions Audits</span>
            <p className="font-serif text-2xl font-bold mt-1 text-text-primary">{auditLogs.length}</p>
          </div>
        </div>

        {/* STAT 4: Courses & Assessments */}
        <div className="bg-surface p-5 rounded-xl border border-border shadow-card hover:border-primary-400 transition flex items-start space-x-4">
          <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-mono tracking-wider text-text-muted">Academic Structure</span>
            <p className="font-serif text-2xl font-bold mt-1 text-text-primary">{departments.length} Depts</p>
          </div>
        </div>
      </div>

      {/* CORE INTERACTIVE PANELS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LOG FILTERING ACTIONS TABLE */}
        <div className="lg:col-span-2 bg-surface p-5 rounded-xl border border-border shadow-card space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-border pb-3.5 gap-2">
            <h3 className="font-serif text-sm font-bold flex items-center">
              <Database className="w-4.5 h-4.5 mr-2 text-primary-500" />
              Institutional Immutable Security Ledger
            </h3>
            
            {/* Action filter */}
            <div className="flex items-center space-x-2">
              <span className="text-[9px] font-mono uppercase font-bold text-text-secondary">Type:</span>
              <select 
                value={filterAction} 
                onChange={(e) => setFilterAction(e.target.value)}
                className="text-[10px] font-mono font-bold bg-surface border border-border rounded px-2 py-1 outline-none max-w-[150px]"
              >
                {uniqueActions.map(act => (
                  <option key={act} value={act}>{act}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto space-y-3.5 pr-1 font-mono text-[10px] leading-relaxed">
            {filteredLogs.length === 0 ? (
              <p className="text-center py-10 text-text-muted">No audit transactions found for selection.</p>
            ) : (
              filteredLogs.map(lg => (
                <div key={lg.id} className="p-3 bg-surface-alt border border-border rounded-lg space-y-1 hover:border-primary-300 transition-colors">
                  <div className="flex justify-between items-center text-text-muted font-bold">
                    <span className="text-primary-900 font-sans">@{lg.user}</span>
                    <span>{new Date(lg.timestamp).toLocaleString()}</span>
                  </div>
                  <div className="text-text-primary text-[11px] font-sans font-medium">
                    {lg.details}
                  </div>
                  <div className="flex justify-between text-[9px] text-text-muted pt-1 border-t border-border/40 mt-1">
                    <span className="bg-primary-50 text-primary-800 px-1.5 py-0.2 rounded font-bold uppercase">{lg.action}</span>
                    <span className="bg-slate-100 text-slate-700 px-1 py-0.2 rounded">Resource: {lg.resourceType}</span>
                    <span>IP Address: {lg.ip}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* OPERATIONS WIDGET */}
        <div className="bg-surface p-5 rounded-xl border border-border shadow-card space-y-6">
          <div className="border-b border-border pb-3">
            <h3 className="font-serif text-sm font-bold flex items-center">
              <Key className="w-4.5 h-4.5 mr-2 text-primary-500" />
              Platform Diagnostics &amp; Overwatch
            </h3>
          </div>

          {/* Account levels breakout */}
          <div className="space-y-3 text-xs">
            <p className="font-mono text-[10px] uppercase font-bold text-text-muted tracking-wider">
              Profile Breakdown By Duty
            </p>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-surface-alt border border-border rounded-lg p-2.5">
                <p className="text-[10px] text-text-secondary font-mono">Students</p>
                <p className="text-lg font-serif font-bold text-text-primary mt-0.5">{totalStudents}</p>
              </div>
              <div className="bg-surface-alt border border-border rounded-lg p-2.5">
                <p className="text-[10px] text-text-secondary font-mono">Lecturers / Supervisors</p>
                <p className="text-lg font-serif font-bold text-text-primary mt-0.5">{totalSupervisors}</p>
              </div>
              <div className="bg-surface-alt border border-border rounded-lg p-2.5">
                <p className="text-[10px] text-text-secondary font-mono">Admin HODs</p>
                <p className="text-lg font-serif font-bold text-text-primary mt-0.5">{totalHods}</p>
              </div>
              <div className="bg-surface-alt border border-border rounded-lg p-2.5">
                <p className="text-[10px] text-text-secondary font-mono">SuperAdmins</p>
                <p className="text-lg font-serif font-bold text-text-primary mt-0.5">{totalSuperAdmins}</p>
              </div>
            </div>
          </div>

          {/* Core Database Backup button */}
          <div className="bg-slate-50 dark:bg-slate-800/25 border border-border rounded-lg p-4 space-y-3 text-xs">
            <div>
              <p className="font-bold text-text-primary">Database Synchronization &amp; Snapshot</p>
              <p className="text-[10px] text-text-secondary mt-0.5 leading-normal">
                Persist physical collections state to local device memory. Highly recommended during structural updates.
              </p>
            </div>
            
            <button 
              onClick={backupDatabase}
              disabled={dbBackupStatus === 'BACKING_UP'}
              className={`w-full py-2 px-3 rounded-lg font-bold text-[11px] flex items-center justify-center space-x-2 transition cursor-pointer ${
                dbBackupStatus === 'BACKING_UP' 
                  ? 'bg-slate-300 text-slate-600' 
                  : dbBackupStatus === 'SUCCESS'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-primary-900 hover:bg-primary-800 text-white'
              }`}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${dbBackupStatus === 'BACKING_UP' ? 'animate-spin' : ''}`} />
              <span>
                {dbBackupStatus === 'READY' && 'Trigger State Synchronization'}
                {dbBackupStatus === 'BACKING_UP' && 'Synchronizing Collections...'}
                {dbBackupStatus === 'SUCCESS' && 'State Synced Successfully!'}
              </span>
            </button>
          </div>
        </div>

      </div>

      {/* QUICK ADMIN ASSIGNMENT PATH PANEL */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* ACTION: Users management route */}
        <div className="bg-primary-900 text-white p-5 rounded-xl shadow-md border border-primary-800 flex items-center justify-between">
          <div className="space-y-1">
            <h4 className="font-serif text-sm font-bold text-white">Full Role Account Architect</h4>
            <p className="text-[11px] text-primary-200">Register administrative, supervisory, HOD or student identities.</p>
          </div>
          <button 
            onClick={() => setActivePage('users_management')}
            className="w-9 h-9 bg-primary-800 hover:bg-primary-750 text-white rounded-full flex items-center justify-center cursor-pointer transition-all"
          >
            →
          </button>
        </div>

        {/* ACTION: Academic structure route */}
        <div className="bg-primary-900 text-white p-5 rounded-xl shadow-md border border-primary-800 flex items-center justify-between">
          <div className="space-y-1">
            <h4 className="font-serif text-sm font-bold text-white">Academic Structure & Course Allocations</h4>
            <p className="text-[11px] text-primary-200">Configure departments, programmes, courses and lecturer assignments.</p>
          </div>
          <button 
            onClick={() => setActivePage('academic_structure')}
            className="w-9 h-9 bg-primary-800 hover:bg-primary-750 text-white rounded-full flex items-center justify-center cursor-pointer transition-all"
          >
            →
          </button>
        </div>
      </div>

    </div>
  );
}

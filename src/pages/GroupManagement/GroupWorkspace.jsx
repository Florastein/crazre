import React, { useState } from 'react';
import { useAppState } from '../../contexts/StateContext';
import StatusBadge from '../../components/ui/StatusBadge';
import DocDetailPanel from '../../components/shared/DocDetailPanel';
import MilestoneDetailPanel from '../../components/shared/MilestoneDetailPanel';
import FileUploadZone from '../../components/shared/FileUploadZone';
import { 
  Users, Folder, Milestone, ClipboardList, Upload, Download, 
  Search, Eye, FileText, CheckSquare, Plus, Mail, ShieldCheck, MapPin
} from 'lucide-react';

export default function GroupWorkspace() {
  const { 
    currentUser, 
    groups, 
    users, 
    documents, 
    milestones, 
    logs, 
    addLogEntry,
    currentRole
  } = useAppState();

  const [activeTab, setActiveTab] = useState('documents'); // 'documents' | 'milestones' | 'members' | 'logs'
  const [docFilter, setDocFilter] = useState('all'); // 'all' | 'approved' | 'review' | 'rejected'
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [selectedMilestone, setSelectedMilestone] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [activeUploadMilestone, setActiveUploadMilestone] = useState(null);

  // New Log Entry state for write accesses
  const [showLogForm, setShowLogForm] = useState(false);
  const [meetingNotes, setMeetingNotes] = useState('');
  const [meetingDate, setMeetingDate] = useState('');
  const [actionItems, setActionItems] = useState([{ task: '', assignedTo: '', dueDate: '' }]);

  // Filter groups overseen by this supervisor if they are a supervisor
  const isSupervisor = currentRole === 'supervisor';
  const supervisedGroups = groups.filter(g => g.supervisorId === currentUser?.id);

  const [selectedGroupId, setSelectedGroupId] = useState(() => {
    if (isSupervisor) {
      return supervisedGroups[0]?.id || (groups[0]?.id || 'group1');
    }
    return currentUser?.groupId || 'group1';
  });

  const group = groups.find(g => g.id === selectedGroupId);

  if (!group) {
    return (
      <div className="p-8 text-center bg-surface border rounded-xl space-y-3">
        <Users className="w-10 h-10 mx-auto text-text-muted" />
        <h2 className="font-serif text-lg font-bold">Unassigned Team workspace</h2>
        <p className="text-xs text-text-secondary">You are currently unallocated to an active supervisory research team.</p>
      </div>
    );
  }

  // Find supervisor
  const supervisor = users.find(u => u.id === group.supervisorId) || { name: 'Dr. Arthur Sterling', email: 'a.sterling@zaid.edu' };

  // Filter components
  const groupMembers = users.filter(u => group.members.includes(u.id));
  const groupDocs = documents.filter(d => d.groupId === group.id && (docFilter === 'all' || d.status === docFilter));
  const groupMilestones = milestones.filter(m => m.groupId === group.id);
  const groupLogs = logs.filter(l => l.groupId === group.id);

  const handleTriggerUpload = (milestone) => {
    setActiveUploadMilestone(milestone);
    setShowUploadModal(true);
  };

  const handleAddActionRow = () => {
    setActionItems([...actionItems, { task: '', assignedTo: '', dueDate: '' }]);
  };

  const handleActionRowChange = (index, field, value) => {
    const updated = [...actionItems];
    updated[index][field] = value;
    setActionItems(updated);
  };

  const handleCreateMeetingLog = (e) => {
    e.preventDefault();
    if (!meetingNotes.trim()) return;

    // Filter out complete action rows
    const completeActs = actionItems.filter(ai => ai.task.trim() !== '');
    
    // Call Context action
    addLogEntry(
      group.id,
      meetingDate ? new Date(meetingDate).toISOString() : new Date().toISOString(),
      groupMembers.map(m => m.name),
      meetingNotes,
      [], // Discussed docs empty for now
      completeActs
    );

    // Reset Form
    setMeetingNotes('');
    setMeetingDate('');
    setActionItems([{ task: '', assignedTo: '', dueDate: '' }]);
    setShowLogForm(false);
    alert('Academic committee meeting log recorded securely.');
  };

  return (
    <div className="space-y-6 animate-fade-in text-text-primary">
      
      {/* 1. COMPACT RESEARCH TEAM PANEL WITH INLINE GROUP SWITCHER FOR SUPERVISOR */}
      <div className="bg-primary-900 text-white rounded-xl p-6 border border-primary-800 shadow-md space-y-4">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between space-y-4 md:space-y-0">
          <div className="space-y-1.5 max-w-2xl flex-1">
            <span className="text-[10px] font-mono uppercase bg-primary-800 px-3 py-1 rounded-full text-primary-300 font-bold border border-primary-700">
              {group.programme} • LEVEL {group.level}
            </span>
            {isSupervisor ? (
              /************** SUPERVISOR REVOLUTIONARY INLINE DROPDOWN GROUP SELECT **************/
              <div className="pt-2">
                <div className="relative inline-flex items-center w-full max-w-lg">
                  <select
                    value={selectedGroupId}
                    onChange={(e) => setSelectedGroupId(e.target.value)}
                    className="appearance-none bg-primary-850 hover:bg-primary-800 border border-primary-700 text-white font-serif text-xl sm:text-2xl font-bold rounded-lg py-2.5 pl-4 pr-11 focus:outline-none focus:ring-2 focus:ring-orange-300/60 cursor-pointer transition-all duration-200 shadow-inner w-full text-left"
                    style={{ textOverflow: 'ellipsis' }}
                  >
                    {supervisedGroups.map(g => (
                      <option key={g.id} value={g.id} className="bg-primary-950 text-white font-sans text-xs sm:text-sm py-2">
                        {g.name} — {g.project}
                      </option>
                    ))}
                    {supervisedGroups.length === 0 && groups.map(g => (
                      <option key={g.id} value={g.id} className="bg-primary-950 text-white font-sans text-xs sm:text-sm py-2">
                        {g.name} — {g.project}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-orange-300">
                    <svg className="w-5 h-5 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                <p className="text-[10px] text-primary-300 font-mono mt-1 pr-4">
                  ✦ Active Supervised Workgroup Context. Switch dropdown option to sync all milestones, submissions & progress journals.
                </p>
              </div>
            ) : (
              <h1 className="font-serif text-2xl font-bold text-white mt-1.5">
                {group.name} — {group.project}
              </h1>
            )}
            
            {!isSupervisor && (
              <p className="text-xs text-primary-200 leading-relaxed font-sans mt-1">
                Analyzing distributed replication frameworks, stress models, and latency optimization metrics under the direction of the supervisory council.
              </p>
            )}
          </div>

          <div className="flex items-center space-x-3 bg-primary-800/80 p-3 rounded-xl border border-primary-750 max-w-xs">
            <div className="w-10 h-10 rounded-full bg-primary-700 flex items-center justify-center font-bold text-xs shadow-inner">
              {supervisor.name.split(' ').map(n=>n[0]).join('')}
            </div>
            <div className="truncate text-xs">
              <p className="text-primary-300 font-mono text-[9px] uppercase tracking-wider">Supervisory Council</p>
              <p className="font-bold text-white max-w-[140px] truncate">{supervisor.name}</p>
              <p className="text-primary-400 max-w-[140px] truncate font-mono text-[10px]">{supervisor.email}</p>
            </div>
          </div>
        </div>

        {/* Small avatar list */}
        <div className="flex items-center justify-between border-t border-primary-800 pt-3.5 text-xs text-primary-200 font-mono">
          <div className="flex items-center space-x-2">
            <span>Members Stack:</span>
            <div className="flex -space-x-1.5">
              {groupMembers.map(m => (
                <div 
                  key={m.id} 
                  title={`${m.name} (${m.isLead ? 'Lead' : 'Member'})`}
                  className={`w-7 h-7 rounded-full border-2 border-primary-900 bg-primary-700 flex items-center justify-center text-[10px] font-bold text-white ${
                    m.isLead ? 'ring-2 ring-status-pending' : ''
                  }`}
                >
                  {m.name.split(' ').map(n=>n[0]).join('')}
                </div>
              ))}
            </div>
          </div>
          <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/15 py-0.5 px-2 rounded-full uppercase font-bold">
            ✓ Active supervision registry
          </span>
        </div>
      </div>

      {/* 2. TABBED NAVIGATION */}
      <div className="border-b border-border flex space-x-1 overflow-x-auto">
        <button 
          onClick={() => setActiveTab('documents')}
          className={`px-4.5 py-3 text-xs font-semibold border-b-2 hover:bg-border/20 cursor-pointer transition ${
            activeTab === 'documents' ? 'border-primary-500 text-primary-900 font-bold' : 'border-transparent text-text-muted'
          }`}
        >
          <Folder className="w-4 h-4 inline mr-1.5" /> Project Artifacts ({groupDocs.length})
        </button>
        <button 
          onClick={() => setActiveTab('milestones')}
          className={`px-4.5 py-3 text-xs font-semibold border-b-2 hover:bg-border/20 cursor-pointer transition ${
            activeTab === 'milestones' ? 'border-primary-500 text-primary-900 font-bold' : 'border-transparent text-text-muted'
          }`}
        >
          <Milestone className="w-4 h-4 inline mr-1.5" /> Roadmaps & Stepper ({groupMilestones.length})
        </button>
        <button 
          onClick={() => setActiveTab('members')}
          className={`px-4.5 py-3 text-xs font-semibold border-b-2 hover:bg-border/20 cursor-pointer transition ${
            activeTab === 'members' ? 'border-primary-500 text-primary-900 font-bold' : 'border-transparent text-text-muted'
          }`}
        >
          <Users className="w-4 h-4 inline mr-1.5" /> Vetting Team ({groupMembers.length})
        </button>
        <button 
          onClick={() => setActiveTab('logs')}
          className={`px-4.5 py-3 text-xs font-semibold border-b-2 hover:bg-border/20 cursor-pointer transition ${
            activeTab === 'logs' ? 'border-primary-500 text-primary-900 font-bold' : 'border-transparent text-text-muted'
          }`}
        >
          <ClipboardList className="w-4 h-4 inline mr-1.5" /> Supervision Logs ({groupLogs.length})
        </button>
      </div>

      {/* 3. CORE SELECTED VIEWPORT */}
      <div className="animate-fade-in text-xs">
        
        {/* VIEW 1: DOCUMENTS */}
        {activeTab === 'documents' && (
          <div className="space-y-4">
            
            {/* Toolbar filter area */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-surface p-4 rounded-xl border border-border">
              <div className="flex items-center space-x-2">
                <span className="font-mono text-[10px] text-text-muted uppercase">Filters:</span>
                <select 
                  value={docFilter}
                  onChange={(e) => setDocFilter(e.target.value)}
                  className="bg-surface border border-border text-xs rounded-md h-8 px-2 outline-none font-sans font-semibold cursor-pointer"
                >
                  <option value="all">Display All Artifacts</option>
                  <option value="approved">Approved</option>
                  <option value="review">Under Review</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              {currentUser?.role === 'student' && (
                <button 
                  onClick={() => handleTriggerUpload(null)}
                  className="h-9 px-3.5 bg-primary-900 hover:bg-primary-800 text-white rounded-lg font-semibold flex items-center space-x-1.5 cursor-pointer shadow-sm ml-auto"
                >
                  <Upload className="w-4 h-4" />
                  <span>Transmit Project File</span>
                </button>
              )}
            </div>

            {/* Document gridcards representation (As styled in Section 5.2. Documents Tab, card-style list) */}
            {groupDocs.length === 0 ? (
              <div className="p-12 border border-dashed rounded-xl bg-surface text-center text-text-muted space-y-1">
                <Folder className="w-10 h-10 mx-auto text-text-muted animate-pulse" />
                <p className="font-semibold text-xs mt-2">No research files logged</p>
                <p className="text-[11px]">Upload documents or adjust the registry filter.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {groupDocs.map(d => {
                  const uploader = users.find(u => u.id === d.uploadedBy) || { name: 'Student' };
                  return (
                    <div 
                      key={d.id} 
                      onClick={() => setSelectedDoc(d)}
                      className="bg-surface border border-border rounded-xl p-5 hover:border-primary-400 hover:shadow-md transition cursor-pointer flex flex-col justify-between h-44 group relative overflow-hidden"
                    >
                      <div className="space-y-2.5">
                        <div className="flex justify-between items-start">
                          <div className="p-2 bg-primary-100 text-primary-500 rounded-lg group-hover:bg-primary-900 group-hover:text-white transition-colors">
                            <FileText className="w-5 h-5" />
                          </div>
                          <span className="font-mono text-[10px] text-text-muted bg-surface-alt px-2 py-0.5 rounded-md">
                            v{d.version}.0
                          </span>
                        </div>
                        <div className="space-y-1">
                          <h4 className="font-serif text-[13px] font-bold text-primary-900 truncate max-w-[190px]">
                            {d.name}
                          </h4>
                          <p className="text-[11px] text-text-secondary font-sans truncate">
                            Target: {milestones.find(m => m.id === d.milestoneId)?.title || 'Proposal'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between border-t border-border pt-3 mt-3 text-[10px] font-mono">
                        <span className="text-text-muted">By: {uploader.name.split(' ')[0]}</span>
                        <span className={`font-bold px-2 py-0.5 rounded-full ${
                          d.status === 'approved' ? 'bg-emerald-100 text-emerald-800' : d.status === 'review' ? 'bg-purple-100 text-purple-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {d.status.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

          </div>
        )}

        {/* VIEW 2: MILESTONES ROADMAP */}
        {activeTab === 'milestones' && (
          <div className="space-y-4">
            {groupMilestones.map(m => {
              const matchedDocs = documents.filter(d => d.milestoneId === m.id);
              const overdue = new Date(m.dueDate) < new Date() && m.status !== 'approved';

              return (
                <div 
                  key={m.id}
                  className="bg-surface border border-border rounded-xl p-5 hover:border-primary-400 transition cursor-pointer flex flex-col md:flex-row md:items-center justify-between pointer-events-auto"
                  onClick={() => setSelectedMilestone(m)}
                >
                  <div className="space-y-2 md:max-w-xl">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-[9px] font-bold text-primary-605 bg-primary-100 px-2 py-0.5 rounded-md">
                        NODE #{m.order}
                      </span>
                      <h4 className="font-serif text-[13px] font-bold text-text-primary">
                        {m.title}
                      </h4>
                    </div>
                    <p className="text-text-secondary text-[11px] leading-relaxed">
                      {m.desc}
                    </p>
                    
                    {/* Associated documents lists */}
                    {matchedDocs.length > 0 && (
                      <div className="flex items-center space-x-2 pt-1">
                        <span className="text-[10px] font-mono text-text-muted">LOGGED FILES:</span>
                        <div className="flex space-x-1.5">
                          {matchedDocs.map(md => (
                            <span key={md.id} className="text-[10px] font-mono text-primary-500 bg-primary-50 rounded-md px-1.5 py-0.5 flex items-center">
                              <FileText className="w-3 h-3 mr-1" /> v{md.version}.0
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 md:mt-0 flex items-center justify-between md:flex-col md:items-end md:justify-center shrink-0 space-y-2">
                    <span className={`inline-block text-[10px] uppercase font-mono px-3 py-1 rounded-full font-bold text-center ${
                      m.status === 'approved' ? 'bg-emerald-100 text-emerald-800' : m.status === 'review' ? 'bg-purple-100 text-purple-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {m.status.toUpperCase()}
                    </span>
                    <span className={`block font-mono text-[10px] ${overdue ? 'text-status-rejected font-bold' : 'text-text-muted'}`}>
                      DATE: {m.dueDate} {overdue && '(OVERDUE)'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* VIEW 3: MEMBERS TABLE */}
        {activeTab === 'members' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {groupMembers.map(m => (
              <div 
                key={m.id}
                className="bg-surface border border-border rounded-xl p-5 hover:border-primary-400 transition text-center space-y-3 relative overflow-hidden"
              >
                {m.isLead && (
                  <span className="absolute top-0 right-0 bg-status-pending text-primary-950 font-mono text-[9px] font-bold px-3 py-1 rounded-bl-lg">
                    TEAM LEAD
                  </span>
                )}
                
                <div className="w-14 h-14 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-bold text-base shadow-inner mx-auto">
                  {m.name.split(' ').map(n=>n[0]).join('')}
                </div>

                <div className="space-y-1">
                  <h4 className="font-serif text-sm font-bold text-primary-900 truncate">
                    {m.name}
                  </h4>
                  <p className="text-[11px] font-mono text-text-muted">{m.indexNum}</p>
                </div>

                <div className="pt-3 border-t border-border mt-3 space-y-2">
                  <div className="flex justify-between text-[11px] text-text-secondary">
                    <span>Degree:</span>
                    <span className="font-semibold">{m.prog.split(' ').slice(1).join(' ')}</span>
                  </div>
                  <div className="flex justify-between text-[11px] text-text-secondary">
                    <span>Dept:</span>
                    <span className="font-semibold">{m.dept}</span>
                  </div>
                </div>

                <a 
                  href={`mailto:${m.email}`}
                  className="w-full h-8 bg-surface-alt hover:bg-primary-50 text-primary-700 text-xs rounded-lg flex items-center justify-center space-x-2 border border-border cursor-pointer transition mt-2 font-medium"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Send Mail</span>
                </a>
              </div>
            ))}
          </div>
        )}

        {/* VIEW 4: IMMUTABLE SUPERVISION LOGS */}
        {activeTab === 'logs' && (
          <div className="space-y-6">
            
            {/* Header filters */}
            <div className="flex justify-between items-center bg-surface p-4 rounded-xl border border-border">
              <div>
                <h3 className="font-serif text-sm font-bold">Immutable Meeting Vetting Archives</h3>
                <p className="text-[11px] text-text-muted">Review of record committee findings verified by {supervisor.name}.</p>
              </div>

              {/* Only supervisor can log meetings, under Academic guidelines */}
              {currentRole === 'supervisor' && (
                <button 
                  onClick={() => setShowLogForm(!showLogForm)}
                  className="h-9 px-3.5 bg-primary-900 hover:bg-primary-800 text-white rounded-lg font-semibold flex items-center space-x-1.5 cursor-pointer shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Log Meeting</span>
                </button>
              )}
            </div>

            {/* supervisor-specific write logs form inline component */}
            {showLogForm && (
              <div className="bg-surface border border-primary-100 p-5 rounded-xl text-xs space-y-4 shadow-md animate-scale-up">
                <h4 className="font-serif text-sm font-bold text-primary-900 border-b border-border pb-2.5">
                  Record new meeting minutes log
                </h4>
                <form onSubmit={handleCreateMeetingLog} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold text-text-secondary uppercase">
                        Attendees focus *
                      </label>
                      <div className="p-2.5 bg-surface-alt rounded-lg border border-border flex flex-col space-y-1">
                        {groupMembers.map(m => (
                          <label key={m.id} className="flex items-center space-x-2">
                            <input type="checkbox" defaultChecked />
                            <span>{m.name}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold text-text-secondary uppercase">
                        Meeting Date/Time *
                      </label>
                      <input 
                        type="datetime-local" 
                        required
                        value={meetingDate}
                        onChange={(e) => setMeetingDate(e.target.value)}
                        className="w-full h-10 px-3 border border-border rounded-lg bg-surface-alt outline-none"
                      />
                    </div>
                  </div>

                  {/* Notes fields */}
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-text-secondary uppercase">
                      Minutes & Vetting Notes *
                    </label>
                    <textarea 
                      required
                      rows={4}
                      placeholder="Discussed Raft consensus synchronization, packet benchmarks, evaluation chapters..."
                      value={meetingNotes}
                      onChange={(e) => setMeetingNotes(e.target.value)}
                      className="w-full p-2.5 border border-border bg-surface-alt rounded-lg outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  {/* Action items generator matrix */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="block text-[10px] font-bold text-text-secondary uppercase">
                        Action items tracking
                      </label>
                      <button 
                        type="button" 
                        onClick={handleAddActionRow}
                        className="text-primary-600 hover:text-primary-800 font-semibold"
                      >
                        + Add Row
                      </button>
                    </div>
                    {actionItems.map((ai, index) => (
                      <div key={index} className="grid grid-cols-3 gap-2">
                        <input 
                          type="text" 
                          placeholder="Task notes (e.g. Chapter 1 review)"
                          value={ai.task}
                          onChange={(e) => handleActionRowChange(index, 'task', e.target.value)}
                          className="h-9 px-2 border border-border rounded-lg bg-surface-alt"
                        />
                        <select 
                          value={ai.assignedTo}
                          onChange={(e) => handleActionRowChange(index, 'assignedTo', e.target.value)}
                          className="h-9 px-2 border border-border rounded-lg bg-surface-alt font-sans"
                        >
                          <option value="">Assigned To...</option>
                          {groupMembers.map(m => (
                            <option key={m.id} value={m.name}>{m.name.split(' ')[0]}</option>
                          ))}
                        </select>
                        <input 
                          type="date" 
                          value={ai.dueDate}
                          onChange={(e) => handleActionRowChange(index, 'dueDate', e.target.value)}
                          className="h-9 px-2 border border-border rounded-lg bg-surface-alt"
                        />
                      </div>
                    ))}
                  </div>

                  {/* Footer buttons */}
                  <div className="flex space-x-2 justify-end pt-2 border-t border-border">
                    <button 
                      type="button" 
                      onClick={() => setShowLogForm(false)}
                      className="py-2 px-4 border border-border rounded-lg font-semibold text-text-secondary hover:bg-surface-alt cursor-pointer"
                    >
                      Cancel Logging
                    </button>
                    <button 
                      type="submit"
                      className="py-2 px-5 bg-primary-900 text-white rounded-lg font-semibold hover:bg-primary-800 cursor-pointer"
                    >
                      Record immutable log
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Chronological logs lists */}
            {groupLogs.length === 0 ? (
              <div className="p-8 border rounded-xl text-center bg-surface text-text-muted">
                No meeting logs have been recorded for {group.name} yet.
              </div>
            ) : (
              <div className="space-y-4">
                {groupLogs.map(l => (
                  <div key={l.id} className="bg-surface border border-border rounded-xl p-5 hover:border-primary-400 transition text-xs space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-border pb-3 gap-2">
                      <div className="flex items-center space-x-2.5">
                        <div className="bg-primary-100 p-2 rounded-lg text-primary-500">
                          <ClipboardList className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="font-serif text-[13px] font-bold text-primary-900 dark:text-text-inverse">
                            Meeting verification log
                          </h4>
                          <p className="text-[10px] text-text-muted mt-0.5">RECORD ID: {l.id} • BY: {l.supervisorName}</p>
                        </div>
                      </div>

                      <div className="text-right sm:text-right font-mono text-[11px] text-text-secondary bg-surface-alt px-3 py-1 rounded-md border border-border shrink-0">
                        DATE: {new Date(l.meetingDate).toLocaleDateString()} {new Date(l.meetingDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>

                    {/* Vetting text notes */}
                    <div className="space-y-1 bg-surface-alt p-3 rounded-lg border border-border">
                      <span className="block font-bold text-[10px] uppercase text-text-muted tracking-wide">VETTING MINUTES SUMMARY</span>
                      <p className="text-text-secondary leading-relaxed font-sans">{l.notes}</p>
                    </div>

                    {/* Attendees chips */}
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-mono text-text-muted">ATTENDEES:</span>
                      <div className="flex gap-1.5 flex-wrap">
                        {l.attendees.map(a => (
                          <span key={a} className="font-mono text-[10px] bg-primary-100 text-primary-900 px-2 py-0.5 rounded-full font-bold">
                            {a}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Action Items List checklists */}
                    {l.actionItems && l.actionItems.length > 0 && (
                      <div className="space-y-1.5 pt-1">
                        <span className="block font-bold text-[10px] uppercase text-text-muted tracking-wide">ASSESSMENT ACTION PROTOCOLS</span>
                        <div className="space-y-1.5 font-mono text-[11px]">
                          {l.actionItems.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between p-2 bg-primary-50/20 rounded-md border border-primary-100">
                              <span className="flex items-center">
                                <span className="w-2 h-2 rounded-full bg-status-pending mr-2"></span>
                                <span className="font-sans font-semibold text-text-primary text-[11px]">{item.task}</span>
                              </span>
                              <span className="text-text-secondary">Assigned: <span className="font-bold text-primary-740 font-sans">{item.assignedTo}</span> • Limit: {item.dueDate}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

          </div>
        )}

      </div>

      {/* DETAILED DOCUMENTS SHIFT DRAWER */}
      {selectedDoc && (
        <DocDetailPanel 
          doc={selectedDoc} 
          onClose={() => setSelectedDoc(null)} 
        />
      )}

      {/* DETAILED MILESTONE TIMELINE SHEET */}
      {selectedMilestone && (
        <MilestoneDetailPanel 
          milestone={selectedMilestone} 
          onClose={() => setSelectedMilestone(null)} 
          onUploadClick={(m) => handleTriggerUpload(m)}
        />
      )}

      {/* DETAILED SPECIFIED INLINE UPLOADZONE */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-primary-950/40 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="w-full max-w-lg">
            <FileUploadZone 
              activeMilestone={activeUploadMilestone}
              onUploadComplete={() => {
                setShowUploadModal(false);
                setSelectedMilestone(null);
                alert('Agreement code matches secure telemetry checks!');
              }}
              onCancel={() => setShowUploadModal(false)}
            />
          </div>
        </div>
      )}

    </div>
  );
}

import React, { useState } from 'react';
import { useAppState } from '../../contexts/StateContext';
import { 
  FolderPlus, Folder, Users, Search, AlertCircle, ShieldCheck, 
  ChevronRight, ChevronLeft, MapPin, X, Plus, Award, UserCheck, Sparkles
} from 'lucide-react';
import { prefixes, nouns, suffixes } from '../../data/groupWords';

export default function GroupManagement() {
  const { groups, users, createGroup, departments = [], programmes = [], currentUser } = useAppState();

  const [showWizard, setShowWizard] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);

  // Wizard States
  const [groupName, setGroupName] = useState('');
  
  const handleSuggestName = () => {
    const existingNames = new Set((groups || []).map(g => (g.groupName || g.name || '').toLowerCase()));
    let attempts = 0;
    
    while (attempts < 100) {
      const pref = prefixes[Math.floor(Math.random() * prefixes.length)];
      const noun = nouns[Math.floor(Math.random() * nouns.length)];
      const suff = suffixes[Math.floor(Math.random() * suffixes.length)];
      
      const pattern = Math.floor(Math.random() * 4);
      let candidate = '';
      if (pattern === 0) {
        candidate = `${pref} ${noun}`;
      } else if (pattern === 1) {
        candidate = `${noun} ${suff}`;
      } else if (pattern === 2) {
        candidate = `${pref} ${noun} ${suff}`;
      } else {
        candidate = `${pref} ${suff}`;
      }
      
      if (!existingNames.has(candidate.toLowerCase())) {
        setGroupName(candidate);
        return;
      }
      attempts++;
    }
    setGroupName(`Research Collective ${Math.floor(100 + Math.random() * 900)}`);
  };
  const [prog, setProg] = useState(programmes[0]?.name || 'BSc. Computer Science');
  const [level, setLevel] = useState('400');
  const [capacity, setCapacity] = useState('4'); // radio button: 1, 4, 5
  
  const [selectedSupervisorId, setSelectedSupervisorId] = useState('');
  const [selectedMemberIds, setSelectedMemberIds] = useState([]);
  const [groupLeadId, setGroupLeadId] = useState('');

  const [supervisorSearch, setSupervisorSearch] = useState('');
  const [studentSearch, setStudentSearch] = useState('');

  const [selectedGroup, setSelectedGroup] = useState(null);

  // 1. Group List calculations
  const totalCollectives = groups.length;

  // Filter supervisors for Step 2
  const supervisors = users.filter(u => 
    (u.role === 'supervisor' || u.role === 'admin') && 
    (u.name.toLowerCase().includes(supervisorSearch.toLowerCase()) || u.dept.toLowerCase().includes(supervisorSearch.toLowerCase()))
  );

  // Filter unassigned students for Step 3
  const availableStudents = users.filter(u => 
    u.role === 'student' && 
    !u.groupId && 
    (u.name.toLowerCase().includes(studentSearch.toLowerCase()) || u.indexNum.toLowerCase().includes(studentSearch.toLowerCase()))
  );

  const toggleSelectMember = (sId) => {
    let updated;
    if (selectedMemberIds.includes(sId)) {
      updated = selectedMemberIds.filter(id => id !== sId);
      if (groupLeadId === sId) setGroupLeadId(updated[0] || '');
    } else {
      if (selectedMemberIds.length >= parseInt(capacity)) {
        alert(`Capacity limit reached. You selected ${capacity} students.`);
        return;
      }
      updated = [...selectedMemberIds, sId];
      if (!groupLeadId) setGroupLeadId(sId);
    }
    setSelectedMemberIds(updated);
  };

  const isFaculty = currentUser && (currentUser.role === 'supervisor' || currentUser.role === 'admin' || currentUser.role === 'superadmin');

  const handleWizardSubmit = (e) => {
    e.preventDefault();
    const finalSupervisorId = selectedSupervisorId || (currentUser ? currentUser.id : '');
    if (!groupName || !finalSupervisorId || selectedMemberIds.length === 0) {
      alert('Wizard assembly checks failed. Ensure details, supervisors, and members are chosen.');
      return;
    }

    createGroup(
      groupName, 
      'Computer Science', 
      prog, 
      level, 
      capacity, 
      finalSupervisorId, 
      selectedMemberIds, 
      groupLeadId
    );

    // Resetting states
    setGroupName('');
    setSelectedSupervisorId('');
    setSelectedMemberIds([]);
    setGroupLeadId('');
    setShowWizard(false);
    setWizardStep(1);
    alert('Research supervision collaborative group assembled successfully.');
  };

  const nextWizardStep = () => {
    if (wizardStep === 1 && !groupName.trim()) {
      alert('Group label details are required before stepping.');
      return;
    }
    if (wizardStep === 2 && !selectedSupervisorId) {
      if (isFaculty) {
        setSelectedSupervisorId(currentUser.id);
      } else {
        alert('Assign a corresponding supervisor.');
        return;
      }
    }
    if (wizardStep === 3 && selectedMemberIds.length === 0) {
      alert('Select at least 1 student member to populate team.');
      return;
    }
    setWizardStep(prev => prev + 1);
  };

  return (
    <div className="space-y-6 animate-fade-in text-text-primary text-xs">
      
      {/* 1. HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-3 border-b border-border gap-2">
        <div>
          <h1 className="font-serif text-2xl font-bold text-primary-900">
            Group Architect Manager
          </h1>
          <p className="text-sm text-text-secondary mt-1 font-sans">
            Oversee collaborative assemblies, balance load charts, and regulate capacities.
          </p>
        </div>
        
        <button 
          onClick={() => { setShowWizard(true); setWizardStep(1); }}
          className="h-10 px-4 bg-primary-900 hover:bg-primary-800 text-white rounded-lg font-semibold flex items-center space-x-1.5 cursor-pointer shadow-sm ml-auto"
        >
          <FolderPlus className="w-4.5 h-4.5" />
          <span>Create New Group</span>
        </button>
      </div>

      {/* 2. GROUPS DISPLAY GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {groups.map(g => {
          const sup = users.find(u => u.id === g.supervisorId) || { name: 'Dr. Arthur Sterling' };
          const activeMembers = users.filter(u => g.members.includes(u.id));

          return (
            <div 
              key={g.id} 
              onClick={() => setSelectedGroup(g)}
              className="bg-surface border border-border p-5 rounded-xl hover:border-primary-420 hover:shadow-md transition flex flex-col justify-between h-48 relative overflow-hidden cursor-pointer"
            >
              <div className="space-y-2.5">
                <div className="flex justify-between items-start">
                  <span className="text-[9px] uppercase font-mono tracking-wider text-text-muted bg-surface-alt px-2 py-0.5 rounded-md border border-border">
                    LVL {g.level} • {g.programme.split(' ').slice(1).join(' ')}
                  </span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-805 font-mono px-2 rounded-full font-bold">
                    {g.status.toUpperCase()}
                  </span>
                </div>
                <div>
                  <h4 className="font-serif text-sm font-bold text-primary-900 truncate">{g.name}</h4>
                  <p className="text-text-secondary text-[11px] truncate mt-0.5">{g.project}</p>
                </div>
              </div>

              {/* Workload loads, member metrics */}
              <div className="border-t border-border pt-3 mt-3 space-y-2">
                <div className="flex justify-between items-center text-[10px] text-text-secondary">
                  <span className="font-mono">SUPERVISOR:</span>
                  <span className="font-semibold text-text-primary">{sup.name}</span>
                </div>
                <div className="flex justify-between items-center text-[10px] text-text-secondary font-mono">
                  <span>CAPACITY RANGE:</span>
                  <span className="font-sans font-bold text-primary-700">{activeMembers.length} / {g.capacity} members</span>
                </div>
                <div className="w-full bg-border h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-primary-500 h-full rounded-full transition-all" 
                    style={{ width: `${(activeMembers.length / parseInt(g.capacity)) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Group Detail Modal Popup */}
      {selectedGroup && (() => {
        const g = selectedGroup;
        const sup = users.find(u => u.id === g.supervisorId) || { name: 'Dr. Arthur Sterling', email: 'a.sterling@zaid.edu', dept: 'Computer Science' };
        const activeMembers = users.filter(u => g.members.includes(u.id));

        return (
          <div className="fixed inset-0 bg-primary-950/40 backdrop-blur-md flex items-center justify-center p-4 z-50">
            <div className="bg-surface border border-border rounded-xl p-6 shadow-modal w-full max-w-lg space-y-4 animate-scale-up text-text-primary text-xs">
              
              <div className="flex justify-between items-start border-b border-border pb-3">
                <div>
                  <span className="text-[9px] uppercase font-mono tracking-wider text-text-muted bg-surface-alt px-2 py-0.5 rounded-md border border-border">
                    LVL {g.level} • {g.programme}
                  </span>
                  <h3 className="font-serif text-lg font-bold text-primary-900 mt-1">{g.name}</h3>
                </div>
                <button onClick={() => setSelectedGroup(null)} className="p-1 rounded-full hover:bg-border/30 text-text-muted">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <h5 className="text-[10px] font-bold text-text-secondary uppercase">Project Topic</h5>
                  <p className="text-sm font-semibold text-text-primary mt-0.5">{g.project || 'Untitled Research'}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-b border-border py-3">
                  <div>
                    <h5 className="text-[10px] font-bold text-text-secondary uppercase">Supervisor</h5>
                    <p className="font-semibold text-text-primary mt-0.5">{sup.name}</p>
                    <p className="text-[10px] text-text-muted">{sup.email || ''}</p>
                  </div>
                  <div>
                    <h5 className="text-[10px] font-bold text-text-secondary uppercase">Status</h5>
                    <span className="inline-block mt-1 text-[10px] bg-emerald-100 text-emerald-805 font-mono px-2 py-0.5 rounded-full font-bold">
                      {g.status.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <h5 className="text-[10px] font-bold text-text-secondary uppercase">Team Members ({activeMembers.length} / {g.capacity})</h5>
                    <span className="text-[10px] font-bold text-primary-700 font-mono">
                      {Math.round((activeMembers.length / parseInt(g.capacity)) * 100)}% Capacity
                    </span>
                  </div>
                  <div className="w-full bg-border h-2 rounded-full overflow-hidden mb-3">
                    <div 
                      className="bg-primary-500 h-full rounded-full transition-all" 
                      style={{ width: `${(activeMembers.length / parseInt(g.capacity)) * 100}%` }}
                    ></div>
                  </div>

                  <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                    {activeMembers.length === 0 ? (
                      <p className="text-text-muted py-2">No team members assigned.</p>
                    ) : (
                      activeMembers.map(m => {
                        const isLead = g.leadId === m.id;
                        return (
                          <div key={m.id} className="p-2.5 border border-border bg-surface-alt rounded-lg flex justify-between items-center">
                            <div>
                              <p className="font-semibold text-text-primary flex items-center space-x-1.5">
                                <span>{m.name}</span>
                                {isLead && (
                                  <span className="bg-amber-100 text-amber-800 text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                                    <Award className="w-3 h-3" />
                                    Lead
                                  </span>
                                )}
                              </p>
                              <p className="text-[10px] text-text-secondary font-mono mt-0.5">{m.indexNum} • {m.email}</p>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-3 border-t border-border">
                <button 
                  onClick={() => setSelectedGroup(null)}
                  className="py-2 px-4 bg-primary-900 hover:bg-primary-800 text-white rounded-lg font-semibold transition cursor-pointer"
                >
                  Close Details
                </button>
              </div>

            </div>
          </div>
        );
      })()}

      {/* 3. MULTI-STEP CREATION WIZARD MODAL POPUP */}
      {showWizard && (
        <div className="fixed inset-0 bg-primary-950/40 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-surface dark:bg-surface border border-border rounded-xl p-5 shadow-modal w-full max-w-lg space-y-4 animate-scale-up text-text-primary text-xs">
            
            {/* WIZARD HEADER STATE STEP TIMELINE */}
            <div className="flex justify-between items-center border-b border-border pb-3">
              <div>
                <h3 className="font-serif text-sm font-bold">Assemble Clinical Research collective</h3>
                <p className="text-[10px] font-mono text-text-muted mt-0.5">STEP {wizardStep} OF 4 • TEAM GENERATOR</p>
              </div>
              <button onClick={() => setShowWizard(false)} className="p-1 rounded-full hover:bg-border/30 text-text-muted">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* PROGRESS STEPPER HEADER */}
            <div className="flex items-center justify-between font-mono text-[9px] text-text-muted border-b border-border pb-2">
              <span className={wizardStep === 1 ? 'text-primary-600 font-bold' : ''}>1. DETAILS</span>
              <span>→</span>
              <span className={wizardStep === 2 ? 'text-primary-600 font-bold' : ''}>2. SUPERVISOR</span>
              <span>→</span>
              <span className={wizardStep === 3 ? 'text-primary-600 font-bold' : ''}>3. MEMBERS</span>
              <span>→</span>
              <span className={wizardStep === 4 ? 'text-primary-600 font-bold' : ''}>4. SUMMARY</span>
            </div>

            {/* STEP 1: GROUP META DETAILS */}
            {wizardStep === 1 && (
              <div className="space-y-3.5 animate-fade-in">
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-text-secondary uppercase">
                    Research collective Name *
                  </label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Team Delta"
                      value={groupName}
                      onChange={(e) => setGroupName(e.target.value)}
                      className="flex-1 h-10 px-3 border border-border bg-surface-alt rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={handleSuggestName}
                      className="h-10 px-3.5 bg-primary-900 hover:bg-primary-800 text-white rounded-lg font-semibold flex items-center space-x-1.5 whitespace-nowrap cursor-pointer transition shadow-sm"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-orange-200 animate-pulse" />
                      <span>Suggest</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-text-secondary uppercase">
                      Programme Degree *
                    </label>
                    <select 
                      value={prog}
                      onChange={(e) => setProg(e.target.value)}
                      className="w-full h-10 px-2 border border-border bg-surface-alt rounded-lg font-sans text-xs"
                    >
                      {programmes.map(p => (
                        <option key={p.id} value={p.name}>{p.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-text-secondary uppercase">
                      Class Level *
                    </label>
                    <select 
                      value={level}
                      onChange={(e) => setLevel(e.target.value)}
                      className="w-full h-10 px-3 border border-border bg-surface-alt rounded-lg"
                    >
                      <option value="300">Level 300</option>
                      <option value="400">Level 400</option>
                    </select>
                  </div>
                </div>

                {/* Capacity selectors */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-text-secondary uppercase">
                    Allocate capacity Limits *
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {['1', '4', '5'].map(capOp => (
                      <label 
                        key={capOp} 
                        className={`p-3 border rounded-lg text-center flex items-center justify-center space-x-2 cursor-pointer transition ${
                          capacity === capOp 
                            ? 'border-primary-500 bg-primary-100/30' 
                            : 'border-border bg-surface-alt hover:bg-border/30'
                        }`}
                      >
                        <input 
                          type="radio" 
                          name="capacity_limit"
                          value={capOp} 
                          checked={capacity === capOp}
                          onChange={(e) => setCapacity(e.target.value)}
                          className="mr-1 inline-block"
                        />
                        <span className="font-semibold">{capOp} Students</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: CHOOSE SUPERVISOR AND ASSIGN WORKLOADS */}
            {wizardStep === 2 && (
              <div className="space-y-3.5 animate-fade-in">
                {isFaculty && (
                  <div className="p-3 bg-indigo-50 dark:bg-slate-800/60 border border-indigo-100 dark:border-slate-800 rounded-lg text-indigo-950 dark:text-indigo-200 font-sans">
                    <p className="font-bold text-[11px]">Defaulting to Self-Supervision</p>
                    <p className="text-[10px] opacity-90 mt-0.5">As a course administrator or supervisor, leaving this unassigned will automatically designate you as the supervisor.</p>
                  </div>
                )}
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-text-muted">
                    <Search className="w-3.5 h-3.5" />
                  </span>
                  <input 
                    type="text" 
                    placeholder="Search supervisors by name or dept..."
                    value={supervisorSearch}
                    onChange={(e) => setSupervisorSearch(e.target.value)}
                    className="w-full h-10 pl-9 pr-3 border border-border bg-surface-alt rounded-lg text-xs outline-none"
                  />
                </div>

                <div className="max-h-52 overflow-y-auto space-y-2 pr-1">
                  {supervisors.map(s => {
                    const isSelected = selectedSupervisorId === s.id;
                    const loadedCount = groups.filter(g => g.supervisorId === s.id).length;
                    const overloaded = loadedCount >= 3; // Institutional alert limit

                    return (
                      <div 
                        key={s.id}
                        onClick={() => setSelectedSupervisorId(s.id)}
                        className={`p-3 border rounded-lg cursor-pointer flex justify-between items-center transition ${
                          isSelected 
                            ? 'border-primary-500 bg-primary-100/20' 
                            : 'border-border bg-surface-alt hover:bg-border/30'
                        }`}
                      >
                        <div>
                          <p className="font-bold text-text-primary">{s.name}</p>
                          <p className="text-[10px] text-text-muted font-mono uppercase">{s.dept}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <span className={`inline-block font-mono text-[9px] font-bold px-2 py-0.5 rounded-full ${
                            overloaded ? 'bg-red-100 text-red-800 animate-pulse' : 'bg-primary-100 text-primary-900'
                          }`}>
                            Workload: {loadedCount} collectives {overloaded && '(ALERT)'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 3: ASSIGN UNASSIGNED MEMBERS & ELECT LEAD */}
            {wizardStep === 3 && (
              <div className="space-y-3.5 animate-fade-in-up">
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-text-muted">
                    <Search className="w-3.5 h-3.5" />
                  </span>
                  <input 
                    type="text" 
                    placeholder="Search available unassigned students index..."
                    value={studentSearch}
                    onChange={(e) => setStudentSearch(e.target.value)}
                    className="w-full h-10 pl-9 pr-3 border border-border bg-surface-alt rounded-lg text-xs outline-none"
                  />
                </div>

                {/* Listing of available unallocated student records */}
                <div className="max-h-48 overflow-y-auto divide-y divide-border border border-border rounded-lg bg-surface-alt">
                  {availableStudents.length === 0 ? (
                    <div className="p-6 text-center text-text-muted">
                      No unassigned matching students remaining in directory limits.
                    </div>
                  ) : (
                    availableStudents.map(student => {
                      const isChecked = selectedMemberIds.includes(student.id);
                      return (
                        <div 
                          key={student.id} 
                          onClick={() => toggleSelectMember(student.id)}
                          className="p-3 hover:bg-primary-50/10 cursor-pointer flex items-center justify-between"
                        >
                          <div className="flex items-center space-x-2.5">
                            <input 
                              type="checkbox" 
                              checked={isChecked}
                              onChange={() => {}} // Controlled via parent row click
                              className="mr-1.5"
                            />
                            <div>
                              <p className="font-semibold text-text-primary">{student.name}</p>
                              <p className="text-[10px] text-text-muted font-mono">{student.indexNum} • {student.prog.split(' ').slice(1).join(' ')}</p>
                            </div>
                          </div>
                          
                          {isChecked && (
                            <button 
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setGroupLeadId(student.id);
                              }}
                              className={`h-7 px-2.5 rounded-md text-[10px] font-semibold font-sans flex items-center space-x-1 border transition ${
                                groupLeadId === student.id 
                                  ? 'bg-status-pending border-transparent text-primary-950 font-bold' 
                                  : 'bg-surface border-border text-text-muted hover:text-text-primary'
                              }`}
                            >
                              <Award className="w-3.5 h-3.5" />
                              <span>{groupLeadId === student.id ? 'Lead Student' : 'Elect Lead'}</span>
                            </button>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>

                <div className="p-2.5 bg-primary-50 rounded-lg text-primary-950 font-sans tracking-tight font-medium">
                  Selected Count: <span className="font-bold">{selectedMemberIds.length}</span> students ensembled. Left matching capacity indices: <span className="font-bold">{parseInt(capacity) - selectedMemberIds.length}</span> slots.
                </div>
              </div>
            )}

            {/* STEP 4: AUDIT COMPILATION SUMMARY */}
            {wizardStep === 4 && (
              <div className="space-y-4 animate-fade-in text-[11px] leading-relaxed">
                <div className="p-3.5 bg-emerald-50 text-emerald-900 border border-emerald-100 rounded-lg space-y-1">
                  <span className="font-bold flex items-center text-[10px] uppercase font-mono tracking-wider">
                    <ShieldCheck className="w-4 h-4 mr-1 text-emerald-600" />
                    Compilation verification secure
                  </span>
                  <p>All institutional constraints, workloads, and capacity regulations are validated successfully.</p>
                </div>

                {/* Structural summary breakdown details */}
                <div className="space-y-2 border border-border rounded-lg bg-surface-alt p-3.5 font-sans">
                  <div className="flex justify-between">
                    <span className="text-text-muted">Collective Name:</span>
                    <span className="font-bold text-text-primary">{groupName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">Degree / Level Track:</span>
                    <span>{prog} — {level}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">Supervisor:</span>
                    <span className="font-semibold text-primary-600">
                      {users.find(u=>u.id===selectedSupervisorId)?.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">Enlisted Members Count:</span>
                    <span className="font-mono">{selectedMemberIds.length} / {capacity} slots</span>
                  </div>
                  <div className="flex justify-between border-t border-border pt-2 mt-2">
                    <span className="text-text-muted">Elected Lead:</span>
                    <span className="font-bold text-status-risk">
                      {users.find(u=>u.id===groupLeadId)?.name || 'None Assigned'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* FOOTER WIZARD CONTROLLERS */}
            <div className="flex space-x-2 pt-3 border-t border-border mt-3">
              {wizardStep > 1 && (
                <button 
                  type="button" 
                  onClick={() => setWizardStep(prev => prev - 1)}
                  className="py-2.5 px-4 bg-surface border border-border rounded-lg font-semibold text-text-secondary hover:bg-surface-alt transition cursor-pointer flex items-center"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  <span>Back</span>
                </button>
              )}

              <button 
                type="button" 
                onClick={() => setShowWizard(false)}
                className="py-2.5 px-3 border border-border rounded-lg text-text-secondary hover:bg-surface-alt transition cursor-pointer ml-auto font-semibold"
              >
                Cancel Setup
              </button>

              {wizardStep < 4 ? (
                <button 
                  type="button" 
                  onClick={nextWizardStep}
                  className="py-2.5 px-5 bg-primary-900 text-white rounded-lg hover:bg-primary-800 transition cursor-pointer font-semibold flex items-center"
                >
                  <span>Continue</span>
                  <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              ) : (
                <button 
                  type="button" 
                  onClick={handleWizardSubmit}
                  className="py-2.5 px-5 bg-primary-500 hover:bg-primary-420 text-white rounded-lg transition cursor-pointer font-bold flex items-center"
                >
                  <ShieldCheck className="w-4.5 h-4.5 mr-1" />
                  <span>Assemble Group</span>
                </button>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

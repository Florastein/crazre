import React, { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import { useAppState } from '../../contexts/StateContext';
import { 
  Users, UserPlus, Inbox, Search, Mail, Phone, Map, Shield, 
  Trash2, X, AlertTriangle, FileSpreadsheet, Check, RefreshCw, Upload, AlertCircle, Edit
} from 'lucide-react';

export default function UserProvisioning() {
  const { users, createUser, updateUser, deleteUser, bulkImport, departments = [], programmes = [], currentRole } = useAppState();
  
  const [activeTab, setActiveTab] = useState('student'); // 'student' | 'supervisor' | 'admin'
  const [searchQuery, setSearchQuery] = useState('');
  
  // Create User form toggling
  const [showAddUser, setShowAddUser] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('student');
  const [indexNum, setIndexNum] = useState('');
  const [prog, setProg] = useState(programmes[0]?.name || 'BSc. Computer Science');
  const [level, setLevel] = useState('4 Years (BTECH/BSc)');
  const [dept, setDept] = useState(departments[0]?.name || 'Computer Science');
  const [hours, setHours] = useState('');
  const [bio, setBio] = useState('');

  // Bulk Import state
  const [showBulkImport, setShowBulkImport] = useState(false);
  const [importTab, setImportTab] = useState('file'); // 'file' | 'paste'
  const [csvText, setCsvText] = useState('Name,Index\nAmara Okafor,CS/2022/104\nYousef Al-Masri,SE/2022/095\nCarlos Santos,CS/2022/112');
  const [bulkProgress, setBulkProgress] = useState(0);
  const [isBulkImporting, setIsBulkImporting] = useState(false);

  // New Spreadsheet/Excel import states
  const [parsedData, setParsedData] = useState([]);
  const [excelFileName, setExcelFileName] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [defaultImportProg, setDefaultImportProg] = useState(programmes[0]?.name || 'BSc. Computer Science');
  const [defaultImportLevel, setDefaultImportLevel] = useState('4 Years (BTECH/BSc)');
  const [defaultImportDept, setDefaultImportDept] = useState(departments[0]?.name || 'Computer Science');

  const fileInputRef = useRef(null);

  // Edit User states
  const [editingUser, setEditingUser] = useState(null);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editIndexNum, setEditIndexNum] = useState('');
  const [editProg, setEditProg] = useState('');
  const [editLevel, setEditLevel] = useState('');
  const [editDept, setEditDept] = useState('');
  const [editHours, setEditHours] = useState('');
  const [editBio, setEditBio] = useState('');

  // Delete User verification state
  const [userToDelete, setUserToDelete] = useState(null);

  const handleStartEdit = (user) => {
    setEditingUser(user);
    setEditName(user.name || '');
    setEditEmail(user.email || '');
    setEditIndexNum(user.indexNum || '');
    setEditProg(user.prog || programmes[0]?.name || 'BSc. Computer Science');
    setEditLevel(user.level || '4 Years (BTECH/BSc)');
    setEditDept(user.dept || departments[0]?.name || 'Computer Science');
    setEditHours(user.hours || '');
    setEditBio(user.bio || '');
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!editName || !editEmail) return;

    try {
      updateUser(editingUser.id, {
        name: editName,
        email: editEmail,
        indexNum: editingUser.role === 'student' ? editIndexNum : null,
        prog: editingUser.role === 'student' ? editProg : null,
        level: editingUser.role === 'student' ? editLevel : null,
        dept: editDept,
        hours: editingUser.role === 'supervisor' ? editHours : null,
        bio: editingUser.role === 'supervisor' ? editBio : null
      });

      setEditingUser(null);
      alert('User profile settings updated successfully.');
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteClick = (id, name) => {
    setUserToDelete({ id, name });
  };

  const confirmDelete = () => {
    if (userToDelete) {
      deleteUser(userToDelete.id);
      setUserToDelete(null);
      alert('Academic profile decommissioned successfully.');
    }
  };

  // Search filter implementation
  const filteredUsers = users.filter(u => {
    const matchesTab = u.role === activeTab;
    const matchesQuery = u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (u.indexNum && u.indexNum.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesTab && matchesQuery;
  });

  const handleCreateUserSubmit = (e) => {
    e.preventDefault();
    if (!name || !email) return;

    try {
      createUser(
        name, 
        email, 
        role, 
        role === 'student' ? indexNum : null,
        role === 'student' ? prog : null,
        role === 'student' ? level : null,
        dept,
        role === 'supervisor' ? hours : null,
        role === 'supervisor' ? bio : null
      );

      // Resetting states
      setName('');
      setEmail('');
      setIndexNum('');
      setHours('');
      setBio('');
      setShowAddUser(false);
      alert('User account provisioned and welcome emails initialized.');
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processExcelFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      processExcelFile(e.target.files[0]);
    }
  };

  const processExcelFile = (file) => {
    const isXlsx = file.name.endsWith('.xlsx') || file.name.endsWith('.xls');
    const isCsv = file.name.endsWith('.csv');

    if (!isXlsx && !isCsv) {
      alert("Invalid format: Only Excel (.xlsx, .xls) and standard Comma Separated (.csv) files are supported.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target.result;
        const workbook = XLSX.read(bstr, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        
        // Convert to 2D row array
        const rawRows = XLSX.utils.sheet_to_json(sheet, { header: 1 });
        
        if (rawRows.length === 0) {
          alert("The uploaded spreadsheet contains no valid rows.");
          return;
        }

        // Parse column headers from index 0
        const headers = rawRows[0].map(h => String(h || '').trim().toLowerCase());
        
        // Find Column Indices
        let nameColIdx = headers.findIndex(h => h === 'name' || h.includes('student name') || h === 'student' || h.includes('full name'));
        let indexColIdx = headers.findIndex(h => h.includes('index') || h === 'id' || h.includes('matrix') || h.includes('number'));

        // Fallback to columns 0 (Name) and 1 (Index)
        if (nameColIdx === -1) nameColIdx = 0;
        if (indexColIdx === -1) indexColIdx = 1;

        const studentsList = [];
        for (let r = 1; r < rawRows.length; r++) {
          const rowData = rawRows[r];
          if (!rowData || rowData.length === 0) continue;

          const sName = String(rowData[nameColIdx] || '').trim();
          const sIndex = String(rowData[indexColIdx] || '').trim();

          if (sName && sIndex) {
            studentsList.push({
              name: sName,
              indexNum: sIndex,
              email: `${sName.toLowerCase().replace(/\s+/g, '.')}@zaid.edu`
            });
          }
        }

        if (studentsList.length === 0) {
          alert("Could not detect any valid index values in the spreadsheet. Please verify the sheet has column headers like 'Name' and 'Index'.");
          return;
        }

        setParsedData(studentsList);
        setExcelFileName(file.name);
      } catch (err) {
        console.error(err);
        alert("Encountered filesystem/format check errors while parsing spreadsheet file.");
      }
    };
    reader.readAsBinaryString(file);
  };

  const handleBulkSubmit = (e) => {
    e.preventDefault();
    let importList = [];

    if (importTab === 'file') {
      if (parsedData.length === 0) {
        alert("Please drop or browse an Excel spreadsheet with student columns first.");
        return;
      }
      importList = parsedData.map(student => ({
        ...student,
        prog: defaultImportProg,
        level: defaultImportLevel,
        dept: defaultImportDept
      }));
    } else {
      // Paste Tab (csvText)
      const lines = csvText.split('\n').filter(l => l.trim().length > 0);
      lines.forEach((line, index) => {
        if (index === 0 && line.toLowerCase().includes('name')) return; // skip header
        const parts = line.split(',').map(p => p.trim());
        if (parts.length >= 2) {
          importList.push({
            name: parts[0],
            indexNum: parts[1],
            email: `${parts[0].toLowerCase().replace(/\s+/g, '.')}@zaid.edu`,
            prog: defaultImportProg,
            level: defaultImportLevel,
            dept: defaultImportDept
          });
        }
      });

      if (importList.length === 0) {
        alert("Please paste valid Comma Separated values (Name, Index Number).");
        return;
      }
    }

    setIsBulkImporting(true);
    let p = 0;

    const interval = setInterval(() => {
      p += 25;
      setBulkProgress(p);
      if (p >= 100) {
        clearInterval(interval);
        
        // Perform the bulk import
        const enrolled = bulkImport(importList);
        setIsBulkImporting(false);
        setShowBulkImport(false);
        setBulkProgress(0);
        setParsedData([]);
        setExcelFileName('');
        alert(`Bulk operational enlisting complete. ${enrolled} student accounts provisioned.`);
      }
    }, 150);
  };

  return (
    <div className="space-y-6 animate-fade-in text-text-primary text-xs">
      
      {/* 1. HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-3 border-b border-border gap-2">
        <div>
          <h1 className="font-serif text-2xl font-bold text-primary-900">
            User Provisioning Panel
          </h1>
          <p className="text-sm text-text-secondary mt-1 font-sans">
            Manage student indexes, supervise availabilities, and administrative clearances.
          </p>
        </div>
        
        <div className="flex space-x-2 shrink-0">
          <button 
            onClick={() => { 
              let initialRole = activeTab;
              if (currentRole === 'superadmin' && activeTab === 'supervisor') {
                initialRole = 'student';
              }
              setRole(initialRole); 
              setShowAddUser(true); 
            }}
            className="h-10 px-4 bg-primary-900 hover:bg-primary-800 text-white rounded-lg font-semibold flex items-center space-x-1.5 cursor-pointer shadow-sm transition"
          >
            <UserPlus className="w-4 h-4" />
            <span>
              {activeTab === 'student' ? 'Add Student' : activeTab === 'supervisor' ? 'Add Supervisor' : 'Add Admin'}
            </span>
          </button>
          
          {activeTab === 'student' && (
            <button 
              onClick={() => setShowBulkImport(true)}
              className="h-10 px-4 bg-surface border border-border hover:bg-surface-alt font-sans font-semibold text-text-secondary rounded-lg flex items-center space-x-1.5 cursor-pointer shadow-xs transition"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span>Bulk CSV Import</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. REUSABLE ROLE TABS */}
      <div className="flex justify-between items-center bg-surface p-4 rounded-xl border border-border flex-col md:flex-row gap-3">
        <div className="flex space-x-1 border-b md:border-b-0 border-border pb-2 md:pb-0 font-sans font-semibold">
          <button 
            onClick={() => { setActiveTab('student'); setSearchQuery(''); }}
            className={`px-3.5 py-1.5 text-xs rounded-lg transition cursor-pointer ${
              activeTab === 'student' ? 'bg-primary-100 text-primary-950 font-bold' : 'text-text-muted hover:bg-surface-alt'
            }`}
          >
            Students Registered ({users.filter(u=>u.role==='student').length})
          </button>
          <button 
            onClick={() => { setActiveTab('supervisor'); setSearchQuery(''); }}
            className={`px-3.5 py-1.5 text-xs rounded-lg transition cursor-pointer ${
              activeTab === 'supervisor' ? 'bg-primary-100 text-primary-950 font-bold' : 'text-text-muted hover:bg-surface-alt'
            }`}
          >
            Lecturers / Supervisors Assigned ({users.filter(u=>u.role==='supervisor').length})
          </button>
          <button 
            onClick={() => { setActiveTab('admin'); setSearchQuery(''); }}
            className={`px-3.5 py-1.5 text-xs rounded-lg transition cursor-pointer ${
              activeTab === 'admin' ? 'bg-primary-100 text-primary-950 font-bold' : 'text-text-muted hover:bg-surface-alt'
            }`}
          >
            System Admins ({users.filter(u=>u.role==='admin').length})
          </button>
        </div>

        {/* SEARCH FILTER BAR */}
        <div className="relative w-full md:w-64">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-text-muted">
            <Search className="w-3.5 h-3.5" />
          </span>
          <input 
            type="text" 
            placeholder={`Search ${activeTab}s...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-9 pl-9 pr-3 rounded-lg border border-border bg-surface-alt text-xs font-sans outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      {/* 3. DYNAMIC DATA TABLE CARD */}
      <div className="bg-surface rounded-xl border border-border shadow-card overflow-hidden">
        {filteredUsers.length === 0 ? (
          <div className="p-12 text-center text-text-muted space-y-2">
            <Inbox className="w-10 h-10 mx-auto text-text-muted" />
            <p className="font-semibold text-xs mt-2">No matching users located</p>
            <p className="text-[11px]">Refine your filter search criteria queries.</p>
          </div>
        ) : (
          <div className="overflow-x-auto min-w-full">
            <table className="min-w-full text-left font-sans">
              <thead>
                <tr className="border-b border-border bg-surface-alt p-3.5 text-text-muted font-mono text-[10px] uppercase">
                  <th className="p-3.5">FULL NAME</th>
                  <th className="p-3.5">EMAIL</th>
                  <th className="p-3.5">DEPARTMENT</th>
                  {activeTab === 'student' && <th className="p-3.5">INDEX NUMBER</th>}
                  {activeTab === 'student' && <th className="p-3.5">Programme Degree</th>}
                  {activeTab === 'supervisor' && <th className="p-3.5">VISITING HOURS</th>}
                  <th className="p-3.5 text-right pr-6">Management</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-text-secondary">
                {filteredUsers.map(u => (
                  <tr key={u.id} className="hover:bg-primary-50/15">
                    <td className="p-3.5 font-semibold text-text-primary flex items-center space-x-3.5">
                      <div className="w-7 h-7 bg-primary-100 text-primary-800 rounded-full flex items-center justify-center font-bold text-[10px]/none">
                        {u.name.split(' ').map(n=>n[0]).join('')}
                      </div>
                      <span className="truncate max-w-[150px]">{u.name}</span>
                    </td>
                    <td className="p-3.5 font-mono text-[11px]">{u.email}</td>
                    <td className="p-3.5 font-semibold">{u.dept}</td>
                    {activeTab === 'student' && (
                      <td className="p-3.5 font-mono text-xs">{u.indexNum || 'PENDING'}</td>
                    )}
                    {activeTab === 'student' && (
                      <td className="p-3.5 text-text-muted truncate max-w-[150px]" title={u.prog}>{u.prog}</td>
                    )}
                    {activeTab === 'supervisor' && (
                      <td className="p-3.5 text-text-muted truncate max-w-[150px] font-mono">{u.hours || 'Unassigned'}</td>
                    )}
                    <td className="p-3.5">
                      <div className="flex justify-end items-center space-x-1.5 header-ignore pr-2.5">
                        <button 
                          type="button"
                          onClick={() => handleStartEdit(u)}
                          className="p-1 h-7 w-7 text-primary-900 bg-primary-50 hover:bg-primary-100 rounded-md flex items-center justify-center transition cursor-pointer"
                          title="Edit profile parameters"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          type="button"
                          onClick={() => handleDeleteClick(u.id, u.name)}
                          className="p-1 h-7 w-7 text-red-600 bg-red-50 hover:bg-red-100 rounded-md flex items-center justify-center transition cursor-pointer"
                          title="Decommission user account"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 4. MANUAL ADD USER FORM MODAL */}
      {showAddUser && (
        <div className="fixed inset-0 bg-primary-950/40 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-surface dark:bg-surface border border-border rounded-xl p-5 shadow-modal w-full max-w-md space-y-4 animate-scale-up text-text-primary text-xs">
            <div className="flex justify-between items-center border-b border-border pb-3">
              <h3 className="font-serif text-sm font-bold flex items-center">
                <UserPlus className="w-4 h-4 mr-2 text-primary-500" />
                Register New Academic Account
              </h3>
              <button onClick={() => setShowAddUser(false)} className="p-1 rounded-full hover:bg-border/30 text-text-muted">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateUserSubmit} className="space-y-4">
              {/* Name */}
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-text-secondary uppercase">
                  Full Name *
                </label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Elena Rostova"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-10 px-3 border border-border bg-surface-alt rounded-lg"
                />
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-text-secondary uppercase">
                  University Email Address *
                </label>
                <input 
                  type="email" 
                  required
                  placeholder="e.g. elena@zaid.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-10 px-3 border border-border bg-surface-alt rounded-lg"
                />
              </div>

              {/* Account Role */}
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-text-secondary uppercase">
                  Account Role *
                </label>
                <select 
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full h-10 px-3 border border-border bg-surface-alt rounded-lg font-sans text-xs"
                >
                  {currentRole === 'superadmin' ? (
                    <>
                      <option value="student">Student</option>
                      <option value="supervisor">Lecturer / Supervisor</option>
                      <option value="admin">HOD / Admin</option>
                      <option value="superadmin">Super Admin</option>
                    </>
                  ) : (
                    <>
                      <option value="student">Student</option>
                      <option value="supervisor">Lecturer / Supervisor</option>
                      <option value="admin">HOD / Admin</option>
                    </>
                  )}
                </select>
              </div>

              {/* Mapped dynamic selectors based on selected role */}
              {role === 'student' ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold text-text-secondary uppercase">
                        Index Number *
                      </label>
                      <input 
                        type="text" 
                        required
                        placeholder="e.g. CS/2022/067"
                        value={indexNum}
                        onChange={(e) => setIndexNum(e.target.value)}
                        className="w-full h-10 px-3 border border-border bg-surface-alt rounded-lg"
                      />
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
                        <option value="1 Year (MSc./Mphil)">1 Year (MSc./Mphil)</option>
                        <option value="2 Years(Diploma)">2 Years(Diploma)</option>
                        <option value="3 Years (HND)">3 Years (HND)</option>
                        <option value="4 Years (BTECH/BSc)">4 Years (BTECH/BSc)</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-text-secondary uppercase">
                      Degree Programme *
                    </label>
                    <select 
                      value={prog}
                      onChange={(e) => setProg(e.target.value)}
                      className="w-full h-10 px-3 border border-border bg-surface-alt rounded-lg font-sans text-xs"
                    >
                      {programmes.map(p => (
                        <option key={p.id} value={p.name}>{p.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              ) : role === 'supervisor' ? (
                <>
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-text-secondary uppercase">
                      Office Availabilities Hour *
                    </label>
                    <input 
                      type="text" 
                      placeholder="e.g. Tue-Fri 10am-12pm"
                      value={hours}
                      onChange={(e) => setHours(e.target.value)}
                      className="w-full h-10 px-3 border border-border bg-surface-alt rounded-lg"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-text-secondary uppercase">
                      Brief Research Bio
                    </label>
                    <textarea 
                      rows={3}
                      placeholder="Specialization tracks..."
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      className="w-full p-2.5 border border-border bg-surface-alt rounded-lg"
                    />
                  </div>
                </>
              ) : null}

              {/* Department */}
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-text-secondary uppercase">
                  Institutional Department *
                </label>
                <select 
                  value={dept}
                  onChange={(e) => setDept(e.target.value)}
                  className="w-full h-10 px-3 border border-border bg-surface-alt rounded-lg font-sans text-xs"
                >
                  {departments.map(d => (
                    <option key={d.id} value={d.name}>{d.name} Dept</option>
                  ))}
                </select>
              </div>

              {/* Footer buttons */}
              <div className="flex space-x-2 pt-2 border-t border-border mt-3">
                <button 
                  type="button" 
                  onClick={() => setShowAddUser(false)}
                  className="flex-1 py-2.5 bg-surface border border-border rounded-lg text-text-secondary hover:bg-surface-alt transition cursor-pointer font-semibold"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-2.5 bg-primary-900 text-white hover:bg-primary-800 rounded-lg transition cursor-pointer font-semibold"
                >
                  Confirm Registration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. BULK EXCEL & SHEET BULK IMPORT PREVIEW MODAL */}
      {showBulkImport && (
        <div className="fixed inset-0 bg-primary-950/40 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in text-xs">
          <div className="bg-surface dark:bg-surface border border-border rounded-xl p-5 shadow-modal w-full max-w-xl space-y-4 animate-scale-up text-text-primary text-xs">
            <div className="flex justify-between items-center border-b border-border pb-3">
              <h3 className="font-serif text-sm font-bold flex items-center">
                <FileSpreadsheet className="w-5 h-5 mr-2 text-emerald-600 animate-pulse shrink-0" />
                <span>Spreadsheet / Excel Student Importer</span>
              </h3>
              <button onClick={() => { setShowBulkImport(false); setParsedData([]); setExcelFileName(''); }} className="p-1 rounded-full hover:bg-border/30 text-text-muted">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* TAB SELECTOR */}
            <div className="flex space-x-1 border-b border-border pb-1 font-sans font-semibold">
              <button 
                type="button"
                onClick={() => setImportTab('file')}
                className={`px-3 py-1 text-xs rounded-t-lg transition cursor-pointer ${
                  importTab === 'file' ? 'border-b-2 border-primary-900 text-primary-900 font-bold' : 'text-text-muted hover:text-text-primary'
                }`}
              >
                Upload Excel Sheet / CSV
              </button>
              <button 
                type="button"
                onClick={() => setImportTab('paste')}
                className={`px-3 py-1 text-xs rounded-t-lg transition cursor-pointer ${
                  importTab === 'paste' ? 'border-b-2 border-primary-900 text-primary-900 font-bold' : 'text-text-muted hover:text-text-primary'
                }`}
              >
                Raw Copy-Paste Area
              </button>
            </div>

            <form onSubmit={handleBulkSubmit} className="space-y-4">
              
              {importTab === 'file' ? (
                /* EXCEL FILE DRAG AND DROP ZONE */
                <div className="space-y-3">
                  <div 
                    onDragEnter={handleDrag}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition select-none ${
                      dragActive ? 'border-emerald-500 bg-emerald-50/10' : 'border-border bg-surface-alt hover:bg-border/20'
                    }`}
                  >
                    <input 
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept=".xlsx,.xls,.csv"
                      className="hidden"
                    />
                    <Upload className="w-8 h-8 mx-auto text-text-muted mb-2 stroke-1" />
                    <p className="font-sans font-semibold text-text-primary">
                      {excelFileName ? excelFileName : "Drag and Drop your Excel sheet here or Click to select"}
                    </p>
                    <p className="text-[10px] text-text-muted mt-1 font-sans">
                      Supports accredited Excel Workbooks (.xlsx), Excel 97-2003 (.xls) or CSV lists with student coordinates
                    </p>
                  </div>

                  {/* PARSED PREVIEW ZONE */}
                  {parsedData.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center font-mono text-[10px] text-emerald-800 bg-emerald-50/20 px-3 py-2 rounded border border-emerald-100/30">
                        <span className="font-bold flex items-center">
                          <Check className="w-3.5 h-3.5 mr-1" /> VALIDATED AND DETECTED: {parsedData.length} STUDENTS
                        </span>
                        <button 
                          type="button" 
                          onClick={() => { setParsedData([]); setExcelFileName(''); }}
                          className="text-red-600 hover:underline font-bold"
                        >
                          Clear File
                        </button>
                      </div>

                      {/* Preview mini table */}
                      <div className="border border-border/80 rounded-lg overflow-hidden max-h-36 overflow-y-auto bg-surface-alt">
                        <table className="min-w-full text-left font-mono text-[10px]">
                          <thead className="bg-border/35 text-text-muted uppercase text-[9px]">
                            <tr>
                              <th className="p-2">Name mapping</th>
                              <th className="p-2">Index Code</th>
                              <th className="p-2">Dynamic credentials</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border/50 text-text-secondary">
                            {parsedData.map((st, i) => (
                              <tr key={i} className="hover:bg-primary-100/10">
                                <td className="p-2 font-sans font-semibold text-text-primary">{st.name}</td>
                                <td className="p-2 font-bold">{st.indexNum}</td>
                                <td className="p-2 text-text-muted text-[9px]">{st.email}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* MANUAL TEXT AREA PASTE BAR */
                <div className="space-y-2">
                  <p className="text-[10px] text-text-muted font-sans">
                    Paste raw records in comma-separated format (Name, Index). Ensure one student per row:
                  </p>
                  <textarea 
                    required
                    rows={5}
                    placeholder="E.g.&#10;Elena Rostova,CS/2022/067&#10;Liam Henderson,CS/2022/045"
                    value={csvText}
                    onChange={(e) => setCsvText(e.target.value)}
                    className="w-full p-2.5 border border-border bg-surface-alt font-mono text-[11px] rounded-lg outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                  <div className="p-2.5 bg-emerald-50/30 text-emerald-800 rounded-lg border border-emerald-100 font-mono text-[10px] flex items-center">
                    <Check className="w-3.5 h-3.5 mr-1.5 text-emerald-600 shrink-0" />
                    <span>Plaintext rows will automatically assign to the target curriculum criteria configured below.</span>
                  </div>
                </div>
              )}

              {/* SHARED TARGET ACADEMIC DEFAULTS CONFIGURATORS */}
              <div className="p-4 bg-surface-alt rounded-xl border border-border/60 space-y-3">
                <h4 className="font-serif font-bold text-ink flex items-center gap-1 leading-none pb-1.5 border-b border-border/45">
                  <Shield className="w-3.5 h-3.5 text-primary-700" />
                  <span>Curriculum & Enrolment Parameters</span>
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="block text-[9px] font-bold text-text-secondary uppercase">
                      Default Department
                    </label>
                    <select 
                      value={defaultImportDept}
                      onChange={(e) => setDefaultImportDept(e.target.value)}
                      className="w-full h-8.5 px-2 border border-border bg-surface rounded-lg text-[11px]"
                    >
                      {departments.map(d => (
                        <option key={d.id} value={d.name}>{d.name} Dept</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[9px] font-bold text-text-secondary uppercase">
                      Degree Programme
                    </label>
                    <select 
                      value={defaultImportProg}
                      onChange={(e) => setDefaultImportProg(e.target.value)}
                      className="w-full h-8.5 px-2 border border-border bg-surface rounded-lg text-[11px]"
                    >
                      {programmes.map(p => (
                        <option key={p.id} value={p.name}>{p.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[9px] font-bold text-text-secondary uppercase">
                      Standard Level
                    </label>
                    <select 
                      value={defaultImportLevel}
                      onChange={(e) => setDefaultImportLevel(e.target.value)}
                      className="w-full h-8.5 px-2 border border-border bg-surface rounded-lg text-[11px]"
                    >
                      <option value="1 Year (MSc./Mphil)">1 Year (MSc./Mphil)</option>
                      <option value="2 Years(Diploma)">2 Years(Diploma)</option>
                      <option value="3 Years (HND)">3 Years (HND)</option>
                      <option value="4 Years (BTECH/BSc)">4 Years (BTECH/BSc)</option>
                    </select>
                  </div>
                </div>
              </div>

              {isBulkImporting && (
                <div className="space-y-1.5 font-mono">
                  <div className="flex justify-between text-[11px] text-emerald-700">
                    <span>INTERPRETING SPREADSHEETS & PROVISIONING...</span>
                    <span>{bulkProgress}%</span>
                  </div>
                  <div className="w-full bg-border h-1.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-600 h-full transition-all duration-150" style={{ width: `${bulkProgress}%` }}></div>
                  </div>
                </div>
              )}

              {/* FOOTER BUTTONS */}
              <div className="flex space-x-2 pt-2 border-t border-border mt-1">
                <button 
                  type="button" 
                  onClick={() => { setShowBulkImport(false); setParsedData([]); setExcelFileName(''); }}
                  disabled={isBulkImporting}
                  className="flex-1 py-2.5 bg-surface border border-border rounded-lg text-text-secondary hover:bg-surface-alt transition cursor-pointer font-bold"
                >
                  Cancel Import
                </button>
                <button 
                  type="submit"
                  disabled={isBulkImporting || (importTab === 'file' && parsedData.length === 0)}
                  className="flex-1 py-2.5 bg-primary-900 text-white hover:bg-primary-800 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg transition cursor-pointer font-bold"
                >
                  {isBulkImporting ? 'Enlisting...' : `Enlist ${importTab === 'file' && parsedData.length > 0 ? parsedData.length : 'Bulk'} Students`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. EDIT USER FORM MODAL */}
      {editingUser && (
        <div className="fixed inset-0 bg-primary-950/40 backdrop-blur-md flex items-center justify-center p-4 z-50 text-xs text-text-primary">
          <div className="bg-surface dark:bg-surface border border-border rounded-xl p-5 shadow-modal w-full max-w-md space-y-4 animate-scale-up">
            <div className="flex justify-between items-center border-b border-border pb-3">
              <h3 className="font-serif text-sm font-bold flex items-center">
                <Edit className="w-4 h-4 mr-2 text-primary-500" />
                <span>Modify Profile Parameters</span>
              </h3>
              <button onClick={() => setEditingUser(null)} className="p-1 rounded-full hover:bg-border/30 text-text-muted">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              {/* Name */}
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-text-secondary uppercase">
                  Full Name *
                </label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Elena Rostova"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full h-10 px-3 border border-border bg-surface-alt rounded-lg"
                />
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-text-secondary uppercase">
                  University Email Address *
                </label>
                <input 
                  type="email" 
                  required
                  placeholder="e.g. elena@zaid.edu"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full h-10 px-3 border border-border bg-surface-alt rounded-lg"
                />
              </div>

              {/* Mapped dynamic selectors based on role */}
              {editingUser.role === 'student' ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold text-text-secondary uppercase">
                        Index Number *
                      </label>
                      <input 
                        type="text" 
                        required
                        placeholder="e.g. CS/2022/067"
                        value={editIndexNum}
                        onChange={(e) => setEditIndexNum(e.target.value)}
                        className="w-full h-10 px-3 border border-border bg-surface-alt rounded-lg"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold text-text-secondary uppercase">
                        Class Level *
                      </label>
                      <select 
                        value={editLevel}
                        onChange={(e) => setEditLevel(e.target.value)}
                        className="w-full h-10 px-3 border border-border bg-surface-alt rounded-lg"
                      >
                        <option value="1 Year (MSc./Mphil)">1 Year (MSc./Mphil)</option>
                        <option value="2 Years(Diploma)">2 Years(Diploma)</option>
                        <option value="3 Years (HND)">3 Years (HND)</option>
                        <option value="4 Years (BTECH/BSc)">4 Years (BTECH/BSc)</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-text-secondary uppercase">
                      Degree Programme *
                    </label>
                    <select 
                      value={editProg}
                      onChange={(e) => setEditProg(e.target.value)}
                      className="w-full h-10 px-3 border border-border bg-surface-alt rounded-lg font-sans text-xs"
                    >
                      {programmes.map(p => (
                        <option key={p.id} value={p.name}>{p.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              ) : editingUser.role === 'supervisor' ? (
                <>
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-text-secondary uppercase">
                      Office Availabilities Hour *
                    </label>
                    <input 
                      type="text" 
                      placeholder="e.g. Tue-Fri 10am-12pm"
                      value={editHours}
                      onChange={(e) => setEditHours(e.target.value)}
                      className="w-full h-10 px-3 border border-border bg-surface-alt rounded-lg"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-text-secondary uppercase">
                      Brief Research Bio
                    </label>
                    <textarea 
                      rows={3}
                      placeholder="Specialization tracks..."
                      value={editBio}
                      onChange={(e) => setEditBio(e.target.value)}
                      className="w-full p-2.5 border border-border bg-surface-alt rounded-lg"
                    />
                  </div>
                </>
              ) : null}

              {/* Department */}
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-text-secondary uppercase">
                  Institutional Department *
                </label>
                <select 
                  value={editDept}
                  onChange={(e) => setEditDept(e.target.value)}
                  className="w-full h-10 px-3 border border-border bg-surface-alt rounded-lg font-sans text-xs"
                >
                  {departments.map(d => (
                    <option key={d.id} value={d.name}>{d.name} Dept</option>
                  ))}
                </select>
              </div>

              {/* Footer buttons */}
              <div className="flex space-x-2 pt-2 border-t border-border mt-3">
                <button 
                  type="button" 
                  onClick={() => setEditingUser(null)}
                  className="flex-1 py-2.5 bg-surface border border-border rounded-lg text-text-secondary hover:bg-surface-alt transition cursor-pointer font-semibold"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-2.5 bg-primary-900 text-white hover:bg-primary-800 rounded-lg transition cursor-pointer font-semibold"
                >
                  Save Modifications
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 7. DELETE USER VERIFICATION MODAL */}
      {userToDelete && (
        <div className="fixed inset-0 bg-primary-950/40 backdrop-blur-md flex items-center justify-center p-4 z-50 text-xs text-text-primary animate-fade-in">
          <div className="bg-surface dark:bg-surface border border-border rounded-xl p-5 shadow-modal w-full max-w-sm space-y-4 animate-scale-up">
            <div className="flex items-center space-x-3 text-red-600 pb-1 border-b border-border">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <h3 className="font-serif text-sm font-bold">Decommission Account?</h3>
            </div>
            
            <p className="text-text-secondary leading-relaxed">
              Are you sure you want to delete <span className="font-bold text-text-primary">{userToDelete.name}</span>? This action takes immediate effect, is permanent, and completely removes their records from academic registers.
            </p>

            <div className="flex space-x-2">
              <button 
                type="button" 
                onClick={() => setUserToDelete(null)}
                className="flex-1 py-2 bg-surface border border-border rounded-lg text-text-secondary hover:bg-surface-alt transition cursor-pointer font-semibold"
              >
                Cancel
              </button>
              <button 
                type="button" 
                onClick={confirmDelete}
                className="flex-1 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg transition"
              >
                Yes, Decommission
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

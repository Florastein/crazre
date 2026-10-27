import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  initialUsers,
  initialGroups,
  initialMilestones,
  initialDocuments,
  initialLogs,
  initialRisks,
  initialNotifications,
  initialAuditLogs,
  initialDepartments,
  initialProgrammes,
  initialCoursework,
  initialCourses,
  initialCourseMaterials,
  initialQuizzes,
  createUser as createUserSchema,
  createGroup as createGroupSchema,
  createMilestone as createMilestoneSchema,
  createDocument as createDocumentSchema,
  createMeetingLog as createMeetingLogSchema,
  createRisk as createRiskSchema,
  createNotification as createNotificationSchema,
  createAuditLog as createAuditLogSchema,
  createDepartment as createDepartmentSchema,
  createProgramme as createProgrammeSchema,
  createCoursework as createCourseworkSchema,
  createSubmission as createSubmissionSchema,
  createCourse as createCourseSchema,
  createCourseMaterial as createCourseMaterialSchema,
  createQuiz as createQuizSchema,
  USER_ROLES,
  STATUS_CODES
} from '../data/dataStructures';

const StateContext = createContext(null);

export function StateProvider({ children }) {
  // Application Data States
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('cz_users');
    return saved ? JSON.parse(saved) : initialUsers;
  });

  const [departments, setDepartments] = useState(() => {
    const saved = localStorage.getItem('cz_departments');
    return saved ? JSON.parse(saved) : initialDepartments;
  });

  const [programmes, setProgrammes] = useState(() => {
    const saved = localStorage.getItem('cz_programmes');
    return saved ? JSON.parse(saved) : initialProgrammes;
  });

  const [courseworks, setCourseworks] = useState(() => {
    const saved = localStorage.getItem('cz_coursework');
    return saved ? JSON.parse(saved) : initialCoursework;
  });

  const [courses, setCourses] = useState(() => {
    const saved = localStorage.getItem('cz_courses');
    return saved ? JSON.parse(saved) : initialCourses;
  });

  const [courseMaterials, setCourseMaterials] = useState(() => {
    const saved = localStorage.getItem('cz_course_materials');
    return saved ? JSON.parse(saved) : initialCourseMaterials;
  });

  const [quizzes, setQuizzes] = useState(() => {
    const saved = localStorage.getItem('cz_quizzes');
    return saved ? JSON.parse(saved) : initialQuizzes;
  });

  const [groups, setGroups] = useState(() => {
    const saved = localStorage.getItem('cz_groups');
    return saved ? JSON.parse(saved) : initialGroups;
  });

  const [milestones, setMilestones] = useState(() => {
    const saved = localStorage.getItem('cz_milestones');
    return saved ? JSON.parse(saved) : initialMilestones;
  });

  const [documents, setDocuments] = useState(() => {
    const saved = localStorage.getItem('cz_documents');
    return saved ? JSON.parse(saved) : initialDocuments;
  });

  const [logs, setLogs] = useState(() => {
    const saved = localStorage.getItem('cz_logs');
    return saved ? JSON.parse(saved) : initialLogs;
  });

  const [risks, setRisks] = useState(() => {
    const saved = localStorage.getItem('cz_risks');
    return saved ? JSON.parse(saved) : initialRisks;
  });

  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('cz_notifications');
    return saved ? JSON.parse(saved) : initialNotifications;
  });

  const [auditLogs, setAuditLogs] = useState(() => {
    const saved = localStorage.getItem('cz_audit_logs');
    return saved ? JSON.parse(saved) : initialAuditLogs;
  });

  // Auth States
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('cz_current_user');
    return saved ? JSON.parse(saved) : null; // Default to null so the login page is the default route
  });

  const [currentRole, setCurrentRole] = useState(() => currentUser ? currentUser.role : 'student');

  // Dark Mode Theme State
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('cz_theme');
    return saved || 'light';
  });

  // Global Search Overlay State
  const [searchOpen, setSearchOpen] = useState(false);

  // Sync to localStorage on change
  useEffect(() => {
    localStorage.setItem('cz_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('cz_groups', JSON.stringify(groups));
  }, [groups]);

  useEffect(() => {
    localStorage.setItem('cz_milestones', JSON.stringify(milestones));
  }, [milestones]);

  useEffect(() => {
    localStorage.setItem('cz_documents', JSON.stringify(documents));
  }, [documents]);

  useEffect(() => {
    localStorage.setItem('cz_logs', JSON.stringify(logs));
  }, [logs]);

  useEffect(() => {
    localStorage.setItem('cz_risks', JSON.stringify(risks));
  }, [risks]);

  useEffect(() => {
    localStorage.setItem('cz_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('cz_departments', JSON.stringify(departments));
  }, [departments]);

  useEffect(() => {
    localStorage.setItem('cz_programmes', JSON.stringify(programmes));
  }, [programmes]);

  useEffect(() => {
    localStorage.setItem('cz_coursework', JSON.stringify(courseworks));
  }, [courseworks]);

  useEffect(() => {
    localStorage.setItem('cz_courses', JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem('cz_course_materials', JSON.stringify(courseMaterials));
  }, [courseMaterials]);

  useEffect(() => {
    localStorage.setItem('cz_quizzes', JSON.stringify(quizzes));
  }, [quizzes]);

  useEffect(() => {
    localStorage.setItem('cz_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('cz_current_user', JSON.stringify(currentUser));
      setCurrentRole(currentUser.role);
    } else {
      localStorage.removeItem('cz_current_user');
    }
  }, [currentUser]);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('cz_theme', theme);
  }, [theme]);

  // Auth Actions
  const login = (email, password, role) => {
    const matched = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (matched) {
      setCurrentUser(matched);
      setCurrentRole(matched.role);
      addAudit('AUTH_LOGIN', 'Auth', matched.id, `${matched.name} authenticated via key identifier.`);
      return matched;
    }
    throw new Error('Verification failed. Invalid academic credentials.');
  };

  const logout = () => {
    addAudit('AUTH_LOGOUT', 'Auth', currentUser?.id, `${currentUser?.name} session terminated.`);
    setCurrentUser(null);
    setCurrentRole('student');
  };

  const switchRole = (newRole) => {
    // Find first user with that role or swap on same profile if possible
    const sameProfileUser = users.find(u => u.id === currentUser?.id);
    
    // If an Admin/HOD wants to view as a supervisor, let them switch currentRole while keeping their profile
    if (currentUser && (currentUser.role === 'admin' || currentUser.role === 'superadmin') && newRole === 'supervisor') {
      setCurrentRole('supervisor');
    } else if (currentUser && currentUser.role === 'admin' && newRole === 'admin') {
      setCurrentRole('admin');
    } else if (currentUser && currentUser.role === 'superadmin' && newRole === 'superadmin') {
      setCurrentRole('superadmin');
    } else if (newRole === 'student') {
      const student = users.find(u => u.role === 'student');
      setCurrentUser(student);
      setCurrentRole('student');
    } else if (newRole === 'supervisor') {
      const supervisor = users.find(u => u.role === 'supervisor');
      setCurrentUser(supervisor);
      setCurrentRole('supervisor');
    } else if (newRole === 'admin') {
      const admin = users.find(u => u.role === 'admin');
      setCurrentUser(admin);
      setCurrentRole('admin');
    } else if (newRole === 'superadmin') {
      const sa = users.find(u => u.role === 'superadmin');
      setCurrentUser(sa);
      setCurrentRole('superadmin');
    }
    addAudit('ROLE_SWITCH', 'Auth', currentUser?.id, `Switched role focus context to ${newRole}`);
  };

  // Helper Audit Logger
  const addAudit = (action, resourceType, resourceId, details) => {
    const newAudit = createAuditLogSchema({
      user: currentUser ? currentUser.name : 'System Lifecycle',
      action,
      resourceType,
      resourceId,
      ip: '197.108.43.21',
      details
    });
    setAuditLogs(prev => [newAudit, ...prev]);
  };

  // Functional Core Academic Actions
  const uploadDocument = (docName, milestoneId, sizeText, notes) => {
    const userGroupId = currentUser.groupId || 'group1';
    
    // Find other versions to build version increments
    const existingSame = documents.filter(d => d.groupId === userGroupId && d.milestoneId === milestoneId);
    const nextVersion = existingSame.length + 1;

    const newDoc = createDocumentSchema({
      name: docName,
      size: sizeText || '2.1 MB',
      type: docName.split('.').pop() || 'pdf',
      version: nextVersion,
      status: STATUS_CODES.REVIEW,
      uploadedBy: currentUser.id,
      uploadedAt: new Date().toISOString(),
      groupId: userGroupId,
      milestoneId: milestoneId,
      notes: notes || '',
      feedback: null
    });

    // Update document registry
    setDocuments(prev => [newDoc, ...prev]);

    // Set Milestone State in group roadmap to 'review'
    setMilestones(prev => 
      prev.map(m => m.id === milestoneId ? { ...m, status: STATUS_CODES.REVIEW } : m)
    );

    // Update Group lastActivity timestamp
    setGroups(prev => 
      prev.map(g => g.id === userGroupId ? { ...g, lastActivity: new Date().toISOString() } : g)
    );

    // Add notification for associated supervisor
    const groupObj = groups.find(g => g.id === userGroupId);
    if (groupObj && groupObj.supervisorId) {
      addNotification(groupObj.supervisorId, 'submission', 'New milestone submission', `${currentUser.name} uploaded ${docName} (v${nextVersion}) for evaluation.`);
    }

    addAudit('DOC_UPLOAD', 'Document', newDoc.id, `Uploaded project artifact version ${nextVersion} (${docName}).`);
    return newDoc;
  };

  const reviewSubmission = (docId, feedbackText, actionType) => {
    // actionType: 'approve' | 'revision' | 'reject'
    let statusMapped = 'review';
    let milestoneStatusMapped = 'review';

    if (actionType === 'approve') {
      statusMapped = 'approved';
      milestoneStatusMapped = 'approved';
    } else if (actionType === 'revision') {
      statusMapped = 'rejected'; // Request revision rejects actual document sub, student resets to pending structure
      milestoneStatusMapped = 'pending';
    } else if (actionType === 'reject') {
      statusMapped = 'rejected';
      milestoneStatusMapped = 'pending';
    }

    const docObj = documents.find(d => d.id === docId);
    if (!docObj) return;

    // Update Document statuses
    setDocuments(prev => 
      prev.map(d => d.id === docId ? { ...d, status: statusMapped, feedback: feedbackText } : d)
    );

    // Update Milestone status
    setMilestones(prev => 
      prev.map(m => m.id === docObj.milestoneId ? { ...m, status: milestoneStatusMapped } : m)
    );

    // Notify uploader and group members
    const groupObj = groups.find(g => g.id === docObj.groupId);
    if (groupObj) {
      groupObj.members.forEach(memberId => {
        addNotification(
          memberId,
          actionType === 'approve' ? 'feedback' : 'deadline',
          `Submission review: ${actionType.toUpperCase()}`,
          `${currentUser.name} reviewed your milestone document and selected ${actionType}.`
        );
      });
    }

    // Resolve any pending overview risk alerts related to PENDING REVIEW
    if (actionType === 'approve' || actionType === 'revision') {
      setRisks(prev => 
        prev.map(r => r.groupId === docObj.groupId && r.type === 'PENDING_REVIEW' ? { ...r, resolved: true, status: 'resolved' } : r)
      );
    }

    addAudit('DOC_REVIEW', 'Document', docId, `Supervising panel performed review action: ${actionType.toUpperCase()}.`);
  };

  const updateDocumentAnnotations = (docId, annotations) => {
    setDocuments(prev => 
      prev.map(d => d.id === docId ? { ...d, annotations } : d)
    );
    addAudit('DOC_ANNOTATE', 'Document', docId, `Updated annotations, highlights and reviewer marks.`);
  };

  const addLogEntry = (groupId, meetingDate, attendees, notes, discussedDocs, actionItems) => {
    const newLog = createMeetingLogSchema({
      groupId,
      meetingDate: meetingDate || new Date().toISOString(),
      supervisorName: currentUser ? currentUser.name : 'Supervisor',
      notes,
      attendees,
      discussedDocs,
      actionItems: actionItems || []
    });

    setLogs(prev => [newLog, ...prev]);

    // Update Group Activity
    setGroups(prev => 
      prev.map(g => g.id === groupId ? { ...g, lastActivity: new Date().toISOString() } : g)
    );

    // If inactivity risk was flagged on this group, resolve it instantly!
    setRisks(prev => 
      prev.map(r => r.groupId === groupId && r.type === 'INACTIVITY' ? { ...r, resolved: true, status: 'resolved' } : r)
    );

    addAudit('MEETING_LOG_CREATE', 'Log', newLog.id, `Created absolute immutable supervision log meeting notes.`);
    return newLog;
  };

  const addMilestone = (groupId, title, desc, dueDate, criteria) => {
    const groupMilestones = milestones.filter(m => m.groupId === groupId);
    const nextOrder = groupMilestones.length + 1;

    const newMilestone = createMilestoneSchema({
      id: 'm' + nextOrder + '_g' + groupId,
      groupId,
      order: nextOrder,
      title,
      desc,
      dueDate,
      status: STATUS_CODES.PENDING,
      criteria: criteria || 'Criteria specified by Supervisor.'
    });

    setMilestones(prev => [...prev, newMilestone]);
    addAudit('MILESTONE_CREATE', 'Milestone', newMilestone.id, `Created additional structured milestone track in Roadmap.`);
    return newMilestone;
  };

  const createGroup = (nameOrData, dept, prog, level, capacity, supervisorId, membersList, leadId, courseId = '', courseCode = '', courseName = '') => {
    let groupData = {};
    if (typeof nameOrData === 'object' && nameOrData !== null) {
      groupData = nameOrData;
    } else {
      groupData = {
        name: nameOrData,
        dept,
        programme: prog,
        level,
        capacity: parseInt(capacity) || 4,
        supervisorId,
        members: membersList || [],
        leadId: leadId || (membersList && membersList[0]),
        courseId,
        courseCode,
        courseName
      };
    }

    const newGroupId = groupData.id || ('group' + (Date.now() + Math.random().toString(36).substr(2, 3)));
    const resolvedSupervisorId = groupData.supervisorId || (currentUser ? currentUser.id : '');
    const actualMembers = groupData.members || [];
    const actualLeadId = groupData.leadId || actualMembers[0];
    
    const newGroup = createGroupSchema({
      id: newGroupId,
      name: groupData.name || 'New Class Group',
      project: groupData.project || (groupData.courseCode ? `Group Assignment for ${groupData.courseCode}` : 'Awaiting scope upload definition.'),
      dept: groupData.dept || 'Computer Science',
      programme: groupData.programme || prog || 'BSc. Computer Science',
      level: groupData.level || level || '400',
      capacity: parseInt(groupData.capacity) || 4,
      supervisorId: resolvedSupervisorId,
      members: actualMembers,
      leadId: actualLeadId,
      courseId: groupData.courseId || '',
      courseCode: groupData.courseCode || '',
      courseName: groupData.courseName || '',
      status: STATUS_CODES.ACTIVE,
      lastActivity: new Date().toISOString(),
      creatorId: currentUser ? currentUser.id : resolvedSupervisorId
    });

    setGroups(prev => [...prev, newGroup]);

    // Inject base milestones 1-3 for this new group as default tracks
    const baseMilestones = [
      createMilestoneSchema({ id: 'm1_' + newGroupId, groupId: newGroupId, order: 1, title: 'Project Proposal & Scope Definition', desc: 'Identify core engineering challenges, perform initial risk review and outline methodology', dueDate: '2026-06-10', status: STATUS_CODES.PENDING, criteria: 'Clear formal objectives, supervisor approval.' }),
      createMilestoneSchema({ id: 'm2_' + newGroupId, groupId: newGroupId, order: 2, title: 'Literature Review & Architecture Design', desc: 'Review relevant publications and compile dynamic architectural diagrams', dueDate: '2026-07-15', status: STATUS_CODES.PENDING, criteria: 'Comprehensive source vetting and finalized architectural plans.' }),
      createMilestoneSchema({ id: 'm3_' + newGroupId, groupId: newGroupId, order: 3, title: 'System Engineering & Draft Implementation', desc: 'Build prototype modules showcasing execution pathways', dueDate: '2026-08-30', status: STATUS_CODES.PENDING, criteria: 'Working code repository checks.' })
    ];

    setMilestones(prev => [...prev, ...baseMilestones]);

    // Associate students to this newly created group ID
    setUsers(prev => 
      prev.map(u => actualMembers.includes(u.id) ? { ...u, groupId: newGroupId, isLead: u.id === actualLeadId } : u)
    );

    // Notify Supervisor
    if (resolvedSupervisorId) {
      addNotification(resolvedSupervisorId, 'submission', 'New Group assigned', `You have been assigned to supervise group "${newGroup.name}" for ${groupData.courseCode || 'coursework'}.`);
    }

    // Notify Students
    actualMembers.forEach(studId => {
      addNotification(studId, 'feedback', 'Group assignment ready', `You have been compiled into group "${name}" supervised by Dr. Sterling or Evelyn.`);
    });

    addAudit('GROUP_CREATE', 'Group', newGroupId, `Created active academic supervision collective group: ${name}.`);
    return newGroup;
  };

  const createUser = (name, email, role, indexNum, prog, level, dept, hours, bio) => {
    if (role === 'admin') {
      const existingAdmin = users.find(u => u.role === 'admin' && u.dept?.toLowerCase() === dept?.toLowerCase());
      if (existingAdmin) {
        throw new Error(`The department "${dept}" already has a senior Admin/HOD assigned: ${existingAdmin.name}. Each department is constrained to exactly one Admin or HOD.`);
      }
    }

    const newUserId = 'user' + (Date.now() + Math.random().toString(36).substr(2, 4));
    
    const newUser = createUserSchema({
      id: newUserId,
      name,
      email,
      role,
      indexNum: indexNum || null,
      prog: prog || null,
      level: level || null,
      dept: dept || null,
      groupId: null,
      isLead: false,
      hours: hours || null,
      bio: bio || null
    });

    setUsers(prev => [...prev, newUser]);
    addAudit('USER_CREATE', 'User', newUserId, `Admin added ${role.toUpperCase()} account into active hierarchy.`);
    return newUser;
  };

  const bulkImport = (data) => {
    let count = 0;
    const addedUsers = [];

    if (Array.isArray(data)) {
      data.forEach((student, index) => {
        const newUid = 'bulk' + index + Math.random().toString(36).substr(2, 3);
        const name = student.name || 'Unknown Student';
        const indexNum = student.indexNum || 'PENDING';
        const email = student.email || `${name.replace(/\s+/g, '.').toLowerCase()}@zaid.edu`;
        const prog = student.prog || 'BSc. Computer Science';
        const level = student.level || '400';
        const dept = student.dept || 'Computer Science';

        const newUserObj = createUserSchema({
          id: newUid,
          name,
          email,
          role: USER_ROLES.STUDENT,
          indexNum,
          prog,
          level,
          dept,
          groupId: null,
          isLead: false
        });
        addedUsers.push(newUserObj);
        count++;
      });
    } else if (typeof data === 'string') {
      // Basic comma splitter simulation for standard CSV structure: Name,Email,Index,Programme,Level
      const lines = data.split('\n').filter(l => l.trim().length > 0);
      lines.forEach((line, index) => {
        if (index === 0 && line.toLowerCase().includes('name')) return; // skip headers
        const parts = line.split(',').map(p => p.trim());
        if (parts.length >= 3) {
          const newUid = 'bulk' + index + Math.random().toString(36).substr(2, 3);
          const newUserObj = createUserSchema({
            id: newUid,
            name: parts[0],
            email: parts[1] || `${parts[0].replace(/\s+/g, '.').toLowerCase()}@zaid.edu`,
            role: USER_ROLES.STUDENT,
            indexNum: parts[2],
            prog: parts[3] || 'BSc. Computer Science',
            level: parts[4] || '400',
            dept: 'Computer Science',
            groupId: null,
            isLead: false
          });
          addedUsers.push(newUserObj);
          count++;
        }
      });
    }

    setUsers(prev => [...prev, ...addedUsers]);
    addAudit('USER_BULK_IMPORT', 'User', 'bulk_session', `Parsed spreadsheet/CSV and registered ${count} new student profiles.`);
    return count;
  };

  const escalateRisk = (riskId) => {
    // Escalate risk alert sends prompt notices to supervising team and logs audit
    const rObj = risks.find(r => r.id === riskId);
    if (!rObj) return;

    if (rObj.supervisorId) {
      addNotification(
        rObj.supervisorId,
        'risk',
        'CRITICAL ESCALATION: Audit Alert',
        `Department office has escalated critical performance warnings on ${rObj.groupName}. Immediate advisory sessions required.`
      );
    }

    addAudit('RISK_ESCALATION', 'Risk', riskId, `HOD triggered structural administrative escalation warnings on ${rObj.groupName}.`);
  };

  const addDepartment = (name, code, head) => {
    const newDept = createDepartmentSchema({
      name,
      code,
      head: head || 'To be specified'
    });
    setDepartments(prev => [...prev, newDept]);
    addAudit('ACADEMIC_DEPT_CREATE', 'Department', newDept.id, `Created new academic department: ${name} (${code}).`);
    return newDept;
  };

  const addProgramme = (name, code, duration, deptId) => {
    const deptObj = departments.find(d => d.id === deptId);
    const newProg = createProgrammeSchema({
      name,
      code,
      duration: parseInt(duration) || 4,
      deptId,
      deptName: deptObj ? deptObj.name : 'Unknown Department'
    });
    setProgrammes(prev => [...prev, newProg]);
    addAudit('ACADEMIC_PROG_CREATE', 'Programme', newProg.id, `Created new degree programme: ${name} under ${deptObj ? deptObj.name : 'unassigned'}.`);
    return newProg;
  };

  const deleteUser = (userId) => {
    const uObj = users.find(u => u.id === userId);
    setUsers(prev => prev.filter(u => u.id !== userId));
    if (uObj) {
      addAudit('USER_DELETE', 'User', userId, `Admin deleted ${uObj.role.toUpperCase()} account: ${uObj.name}.`);
    }
  };

  const updateUser = (userId, updatedFields) => {
    const uObj = users.find(u => u.id === userId);
    if (!uObj) return;

    const targetRole = updatedFields.role !== undefined ? updatedFields.role : uObj.role;
    const targetDept = updatedFields.dept !== undefined ? updatedFields.dept : uObj.dept;

    if (targetRole === 'admin') {
      const existingAdmin = users.find(u => u.role === 'admin' && u.dept?.toLowerCase() === targetDept?.toLowerCase() && u.id !== userId);
      if (existingAdmin) {
        throw new Error(`The department "${targetDept}" already has a senior Admin/HOD assigned: ${existingAdmin.name}. Each department is constrained to exactly one Admin or HOD.`);
      }
    }

    setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...updatedFields } : u));
    if (uObj) {
      addAudit('USER_UPDATE', 'User', userId, `Admin updated user profile for ${uObj.name}.`);
    }
  };

  const addNotification = (userId, type, title, message) => {
    const newNotif = createNotificationSchema({
      userId,
      type, // 'feedback' | 'submission' | 'deadline' | 'risk' | 'audit'
      title,
      message,
      timestamp: new Date().toISOString(),
      read: false
    });
    setNotifications(prev => [newNotif, ...prev]);
  };

  const markNotificationRead = (notifId) => {
    setNotifications(prev => 
      prev.map(n => n.id === notifId ? { ...n, read: true } : n)
    );
  };

  const markAllNotificationsRead = (userId) => {
    setNotifications(prev => 
      prev.map(n => n.userId === userId ? { ...n, read: true } : n)
    );
  };

  const createCoursework = (title, courseCode, courseName, programme, level, description, dueDate, points, isGroupSubmission = false, milestoneType = '') => {
    const newCw = createCourseworkSchema({
      title,
      courseCode,
      courseName,
      programme,
      level,
      description,
      dueDate,
      points: parseInt(points) || 100,
      isGroupSubmission,
      milestoneType, // e.g. "Milestone 1", "Milestone 2", "Milestone 3", "Milestone 4", "Milestone 5"
      submissions: [],
      creatorId: currentUser ? currentUser.id : null
    });
    setCourseworks(prev => [...prev, newCw]);
    addAudit('COURSEWORK_CREATE', 'Coursework', newCw.id, `Created Moodle assignment: ${title} (${courseCode}).`);
    return newCw;
  };

  const submitCoursework = (cwId, studentId, textNotes, fileName, fileSize, groupId = null, attachments = null) => {
    const receiptCode = `CZ-SUB-2026-${Math.floor(100000 + Math.random() * 900000)}`;
    const newSubmissionAt = new Date().toISOString();

    setCourseworks(prev => prev.map(cw => {
      if (cw.id === cwId) {
        // Find existing submission if any (for version history)
        const existingSub = cw.submissions.find(s => {
          if (cw.isGroupSubmission && groupId) return s.groupId === groupId;
          return s.studentId === studentId;
        });

        const history = existingSub?.history || [];
        if (existingSub) {
          history.push({
            submittedAt: existingSub.submittedAt,
            fileName: existingSub.fileName,
            fileSize: existingSub.fileSize,
            text: existingSub.text,
            grade: existingSub.grade,
            feedback: existingSub.feedback,
            receiptCode: existingSub.receiptCode || 'HIST-REC',
            version: existingSub.version || 1
          });
        }

        const newVersion = (existingSub?.version || 0) + 1;

        const newSubmission = createSubmissionSchema({
          studentId,
          groupId,
          submittedAt: newSubmissionAt,
          text: textNotes || '',
          fileName: fileName || (attachments && attachments[0]?.name) || 'Submission_Attachment.pdf',
          fileSize: fileSize || (attachments && attachments[0]?.size) || '1.1 MB',
          attachments: attachments && attachments.length > 0 ? attachments : [
            { name: fileName || 'Submission_Attachment.pdf', size: fileSize || '1.1 MB', type: 'pdf' }
          ],
          status: STATUS_CODES.SUBMITTED,
          version: newVersion,
          receiptCode,
          history,
          grade: null,
          rubricScores: null,
          feedback: null
        });

        const remainingSubs = cw.submissions.filter(s => {
          if (cw.isGroupSubmission && groupId) return s.groupId !== groupId;
          return s.studentId !== studentId;
        });

        return {
          ...cw,
          submissions: [...remainingSubs, newSubmission]
        };
      }
      return cw;
    }));

    addAudit('COURSEWORK_SUBMIT', 'Coursework', cwId, `Student submitted artifact (Receipt: ${receiptCode}).`);

    const studObj = users.find(u => u.id === studentId);
    const resolvedGroupId = groupId || (studObj ? studObj.groupId : null);

    // Dynamic tie-in with Group Milestone Roadmaps
    const cwObj = courseworks.find(c => c.id === cwId);
    if (cwObj && cwObj.isGroupSubmission && resolvedGroupId) {
      let orderMatch = 1;
      if (cwObj.milestoneType && cwObj.milestoneType.includes('2')) orderMatch = 2;
      else if (cwObj.milestoneType && cwObj.milestoneType.includes('3')) orderMatch = 3;
      else if (cwObj.milestoneType && cwObj.milestoneType.includes('4')) orderMatch = 4;
      else if (cwObj.milestoneType && cwObj.milestoneType.includes('5')) orderMatch = 5;

      const matchedMilestone = milestones.find(m => m.groupId === resolvedGroupId && m.order === orderMatch);
      if (matchedMilestone) {
        // Auto upload document under this group and milestone to sync workspace!
        const nextVersion = documents.filter(d => d.groupId === resolvedGroupId && d.milestoneId === matchedMilestone.id).length + 1;
        const newDoc = createDocumentSchema({
          name: fileName || `${cwObj.courseCode.replace(/\s+/g,'')}_Milestone_Submission.pdf`,
          size: fileSize || '1.4 MB',
          type: (fileName || 'pdf').split('.').pop() || 'pdf',
          version: nextVersion,
          status: STATUS_CODES.REVIEW,
          uploadedBy: studentId,
          uploadedAt: new Date().toISOString(),
          groupId: resolvedGroupId,
          milestoneId: matchedMilestone.id,
          notes: textNotes || '',
          feedback: null
        });
        
        setDocuments(prev => [newDoc, ...prev]);
        setMilestones(prev => 
          prev.map(m => m.id === matchedMilestone.id ? { ...m, status: STATUS_CODES.REVIEW } : m)
        );
      }
    }

    if (studObj && resolvedGroupId) {
      const gp = groups.find(g => g.id === resolvedGroupId);
      if (gp && gp.supervisorId) {
        addNotification(
          gp.supervisorId,
          'submission',
          'Coursework submission logged',
          `${studObj.name} submitted a group milestone draft for "${cwObj?.title || 'Coursework'}" (Receipt: ${receiptCode}).`
        );
      }
    }
  };

  const requestResubmissionCoursework = (cwId, targetId, feedbackText, isGroup = false) => {
    setCourseworks(prev => prev.map(cw => {
      if (cw.id === cwId) {
        return {
          ...cw,
          submissions: cw.submissions.map(sub => {
            const matches = isGroup ? sub.groupId === targetId : sub.studentId === targetId;
            if (matches) {
              return {
                ...sub,
                status: 'resubmit_requested',
                feedback: feedbackText
              };
            }
            return sub;
          })
        };
      }
      return cw;
    }));

    addAudit('COURSEWORK_REVISION_REQUESTED', 'Coursework', cwId, `Requested resubmission for coursework.`);

    if (isGroup) {
      const groupObj = groups.find(g => g.id === targetId);
      if (groupObj) {
        groupObj.members.forEach(memberId => {
          addNotification(
            memberId,
            'feedback',
            'Revision Requested for Coursework',
            `Supervisor requested revisions on your group coursework submission: "${feedbackText}"`
          );
        });
      }
    } else {
      addNotification(
        targetId,
        'feedback',
        'Revision Requested for Coursework',
        `Supervisor requested revisions on your submission: "${feedbackText}"`
      );
    }
  };

  const gradeCoursework = (cwId, targetId, gradeVal, feedbackText, isGroup = false, rubricScores = null) => {
    setCourseworks(prev => prev.map(cw => {
      if (cw.id === cwId) {
        return {
          ...cw,
          submissions: cw.submissions.map(sub => {
            const matches = isGroup ? sub.groupId === targetId : sub.studentId === targetId;
            if (matches) {
              return {
                ...sub,
                status: 'graded',
                grade: parseFloat(gradeVal),
                rubricScores: rubricScores || null,
                feedback: feedbackText
              };
            }
            return sub;
          })
        };
      }
      return cw;
    }));

    addAudit('COURSEWORK_GRADE', 'Coursework', cwId, `Graded coursework submission.`);

    if (isGroup) {
      const groupObj = groups.find(g => g.id === targetId);
      if (groupObj) {
        groupObj.members.forEach(memberId => {
          addNotification(
            memberId,
            'feedback',
            'Group coursework graded',
            `Your group's milestone coursework submission has been evaluated. Mark: ${gradeVal}.`
          );
        });

        // Also check if this is linked to a group milestone and automatically mark that group milestone as approved in our database!
        const cwObj = courseworks.find(c => c.id === cwId);
        if (cwObj && cwObj.milestoneType) {
          let orderMatch = 1;
          if (cwObj.milestoneType.includes('2')) orderMatch = 2;
          else if (cwObj.milestoneType.includes('3')) orderMatch = 3;
          else if (cwObj.milestoneType.includes('4')) orderMatch = 4;
          else if (cwObj.milestoneType.includes('5')) orderMatch = 5;

          const matchedMilestone = milestones.find(m => m.groupId === targetId && m.order === orderMatch);
          if (matchedMilestone) {
            setMilestones(prev => 
              prev.map(m => m.id === matchedMilestone.id ? { ...m, status: 'approved' } : m)
            );
            
            // Also approve the uploaded document
            setDocuments(prev => 
              prev.map(d => d.groupId === targetId && d.milestoneId === matchedMilestone.id ? { ...d, status: 'approved', feedback: feedbackText } : d)
            );
          }
        }
      }
    } else {
      addNotification(
        targetId,
        'feedback',
        'Coursework task graded',
        `Your submission for the coursework assignment has been graded. Mark: ${gradeVal}.`
      );
    }
  };

  // Course Management Actions
  const createCourse = (code, name, dept, programme, level, lecturerId = null, enrolledStudents = []) => {
    const matchedLecturer = users.find(u => u.id === lecturerId);
    const newCourse = createCourseSchema({
      code,
      name,
      dept,
      programme,
      level,
      lecturerId,
      lecturerName: matchedLecturer ? matchedLecturer.name : 'Unassigned Lecturer',
      enrolledStudents
    });
    setCourses(prev => [...prev, newCourse]);
    addAudit('COURSE_CREATE', 'Course', newCourse.id, `Created course ${code}: ${name} (${dept}).`);
    return newCourse;
  };

  const assignLecturerToCourse = (courseId, lecturerId) => {
    const matchedLecturer = users.find(u => u.id === lecturerId);
    setCourses(prev => prev.map(c => {
      if (c.id === courseId) {
        return {
          ...c,
          lecturerId,
          lecturerName: matchedLecturer ? matchedLecturer.name : 'Unassigned Lecturer'
        };
      }
      return c;
    }));
    addAudit('COURSE_ASSIGN_LECTURER', 'Course', courseId, `Assigned lecturer ${matchedLecturer ? matchedLecturer.name : 'Unassigned'} to course.`);
  };

  const enrollStudentInCourse = (courseId, studentId) => {
    setCourses(prev => prev.map(c => {
      if (c.id === courseId) {
        if (!c.enrolledStudents.includes(studentId)) {
          return { ...c, enrolledStudents: [...c.enrolledStudents, studentId] };
        }
      }
      return c;
    }));
    const stud = users.find(u => u.id === studentId);
    const crs = courses.find(c => c.id === courseId);
    if (stud && crs) {
      addNotification(studentId, 'system', 'Enrolled in Course', `You have been enrolled into ${crs.code}: ${crs.name}.`);
    }
    addAudit('COURSE_ENROLL_STUDENT', 'Course', courseId, `Enrolled student ${studentId} into course ${courseId}.`);
  };

  const unenrollStudentFromCourse = (courseId, studentId) => {
    setCourses(prev => prev.map(c => {
      if (c.id === courseId) {
        return { ...c, enrolledStudents: c.enrolledStudents.filter(id => id !== studentId) };
      }
      return c;
    }));
    addAudit('COURSE_UNENROLL_STUDENT', 'Course', courseId, `Unenrolled student ${studentId} from course ${courseId}.`);
  };

  // Course Material Actions
  const uploadCourseMaterial = (courseId, title, description, fileName, fileSize = '2.5 MB', extraOpts = {}) => {
    const matchedCourse = courses.find(c => c.id === courseId || c.code === courseId);
    const fileTypeVal = typeof extraOpts === 'string' ? extraOpts : extraOpts?.fileType;
    const categoryVal = extraOpts?.category || 'Lecture Notes';

    const newMaterial = createCourseMaterialSchema({
      courseId: matchedCourse ? matchedCourse.id : courseId,
      courseCode: matchedCourse ? matchedCourse.code : courseId,
      title,
      description,
      fileName,
      fileSize,
      fileType: fileTypeVal,
      category: categoryVal,
      uploadedBy: currentUser?.id || 'admin',
      uploadedAt: new Date().toISOString()
    });
    setCourseMaterials(prev => [...prev, newMaterial]);
    addAudit('MATERIAL_UPLOAD', 'CourseMaterial', newMaterial.id, `Uploaded material "${title}" for course ${matchedCourse ? matchedCourse.code : courseId}.`);
    return newMaterial;
  };

  const deleteCourseMaterial = (materialId) => {
    setCourseMaterials(prev => prev.filter(m => m.id !== materialId));
    addAudit('MATERIAL_DELETE', 'CourseMaterial', materialId, `Deleted course material ${materialId}.`);
  };

  // Quiz Actions
  const createQuiz = (courseId, title, description, dueDate, timeLimit = 15, totalPoints = 20, questions = []) => {
    const matchedCourse = courses.find(c => c.id === courseId || c.code === courseId);
    const newQuiz = createQuizSchema({
      courseId: matchedCourse ? matchedCourse.id : courseId,
      courseCode: matchedCourse ? matchedCourse.code : courseId,
      title,
      description,
      dueDate,
      timeLimit,
      totalPoints,
      creatorId: currentUser?.id || 'admin',
      questions
    });
    setQuizzes(prev => [...prev, newQuiz]);
    addAudit('QUIZ_CREATE', 'Quiz', newQuiz.id, `Created quiz "${title}" for course ${matchedCourse ? matchedCourse.code : courseId}.`);
    return newQuiz;
  };

  const submitQuiz = (quizId, answers) => {
    const qz = quizzes.find(q => q.id === quizId);
    if (!qz) return;

    let score = 0;
    qz.questions.forEach(q => {
      if (answers[q.id] === q.correctAnswer) {
        score += q.points || 10;
      }
    });

    const newSub = {
      studentId: currentUser?.id || 'stud1',
      submittedAt: new Date().toISOString(),
      answers,
      score,
      maxScore: qz.totalPoints,
      status: 'completed',
      feedback: score === qz.totalPoints ? 'Perfect score!' : `Scored ${score}/${qz.totalPoints}. Review course materials for further insights.`
    };

    setQuizzes(prev => prev.map(q => {
      if (q.id === quizId) {
        const existingSubs = q.submissions.filter(s => s.studentId !== currentUser?.id);
        return { ...q, submissions: [...existingSubs, newSub] };
      }
      return q;
    }));

    addNotification(currentUser?.id || 'stud1', 'feedback', 'Quiz Completed', `You completed "${qz.title}" with score ${score}/${qz.totalPoints}.`);
    addAudit('QUIZ_SUBMIT', 'Quiz', quizId, `Student ${currentUser?.name} submitted quiz ${quizId}.`);
    return newSub;
  };

  const gradeQuiz = (quizId, studentId, score, feedback) => {
    setQuizzes(prev => prev.map(q => {
      if (q.id === quizId) {
        return {
          ...q,
          submissions: q.submissions.map(s => {
            if (s.studentId === studentId) {
              return { ...s, score, feedback };
            }
            return s;
          })
        };
      }
      return q;
    }));
    addNotification(studentId, 'feedback', 'Quiz Graded', `Your quiz submission score has been updated to ${score}. Feedback: ${feedback}`);
    addAudit('QUIZ_GRADE', 'Quiz', quizId, `Graded student ${studentId} quiz submission.`);
  };

  // ROLE & DEPARTMENT SCOPED VISIBILITY
  const userDept = currentUser?.dept || 'Computer Science';

  const visibleUsers = useMemo(() => {
    if (currentRole === 'superadmin') return users;
    if (currentRole === 'admin') {
      return users.filter(u => u.dept?.toLowerCase() === userDept.toLowerCase());
    }
    if (currentRole === 'supervisor') {
      return users.filter(u => u.dept?.toLowerCase() === userDept.toLowerCase() || u.role === 'student');
    }
    return users.filter(u => u.dept?.toLowerCase() === userDept.toLowerCase());
  }, [users, currentRole, userDept]);

  const visibleCourses = useMemo(() => {
    if (currentRole === 'superadmin') return courses;
    if (currentRole === 'admin') {
      return courses.filter(c => c.dept?.toLowerCase() === userDept.toLowerCase());
    }
    if (currentRole === 'supervisor') {
      return courses.filter(c => c.lecturerId === currentUser?.id || c.dept?.toLowerCase() === userDept.toLowerCase());
    }
    // Student: courses enrolled into OR matching programme
    return courses.filter(c => c.enrolledStudents.includes(currentUser?.id) || c.programme?.toLowerCase() === currentUser?.prog?.toLowerCase());
  }, [courses, currentRole, userDept, currentUser]);

  const visibleGroups = useMemo(() => {
    if (currentRole === 'superadmin') return groups;
    if (currentRole === 'admin') {
      return groups.filter(g => {
        const lead = users.find(u => u.id === g.leadId);
        return g.creatorId === currentUser?.id || (lead && lead.dept?.toLowerCase() === userDept.toLowerCase()) || g.supervisorId === currentUser?.id;
      });
    }
    if (currentRole === 'supervisor') {
      return groups.filter(g => g.supervisorId === currentUser?.id || g.creatorId === currentUser?.id);
    }
    return groups.filter(g => g.members.includes(currentUser?.id) || g.id === currentUser?.groupId);
  }, [groups, users, currentRole, userDept, currentUser]);

  const visibleCourseworks = useMemo(() => {
    if (currentRole === 'superadmin') return courseworks;
    if (currentRole === 'admin') {
      const deptCourseCodes = visibleCourses.map(c => c.code.toLowerCase());
      return courseworks.filter(cw => cw.creatorId === currentUser?.id || deptCourseCodes.includes(cw.courseCode.toLowerCase()));
    }
    if (currentRole === 'supervisor') {
      const taughtCourseCodes = visibleCourses.map(c => c.code.toLowerCase());
      return courseworks.filter(cw => cw.creatorId === currentUser?.id || taughtCourseCodes.includes(cw.courseCode.toLowerCase()));
    }
    // Student: courseworks for enrolled courses or programme/level
    const enrolledCodes = visibleCourses.map(c => c.code.toLowerCase());
    return courseworks.filter(cw => enrolledCodes.includes(cw.courseCode.toLowerCase()) || (cw.programme?.toLowerCase() === currentUser?.prog?.toLowerCase() && cw.level === currentUser?.level));
  }, [courseworks, visibleCourses, currentRole, currentUser]);

  const visibleCourseMaterials = useMemo(() => {
    if (currentRole === 'superadmin') return courseMaterials;
    if (currentRole === 'admin' || currentRole === 'supervisor') {
      const allowedCourseIds = visibleCourses.map(c => c.id);
      const allowedCourseCodes = visibleCourses.map(c => c.code.toLowerCase());
      return courseMaterials.filter(m => m.uploadedBy === currentUser?.id || allowedCourseIds.includes(m.courseId) || allowedCourseCodes.includes(m.courseCode.toLowerCase()));
    }
    // Student: materials for enrolled courses
    const enrolledCourseIds = visibleCourses.map(c => c.id);
    const enrolledCourseCodes = visibleCourses.map(c => c.code.toLowerCase());
    return courseMaterials.filter(m => enrolledCourseIds.includes(m.courseId) || enrolledCourseCodes.includes(m.courseCode.toLowerCase()));
  }, [courseMaterials, visibleCourses, currentRole, currentUser]);

  const visibleQuizzes = useMemo(() => {
    if (currentRole === 'superadmin') return quizzes;
    if (currentRole === 'admin' || currentRole === 'supervisor') {
      const allowedCourseIds = visibleCourses.map(c => c.id);
      const allowedCourseCodes = visibleCourses.map(c => c.code.toLowerCase());
      return quizzes.filter(q => q.creatorId === currentUser?.id || allowedCourseIds.includes(q.courseId) || allowedCourseCodes.includes(q.courseCode.toLowerCase()));
    }
    // Student: quizzes for enrolled courses
    const enrolledCourseIds = visibleCourses.map(c => c.id);
    const enrolledCourseCodes = visibleCourses.map(c => c.code.toLowerCase());
    return quizzes.filter(q => enrolledCourseIds.includes(q.courseId) || enrolledCourseCodes.includes(q.courseCode.toLowerCase()));
  }, [quizzes, visibleCourses, currentRole, currentUser]);

  const visibleMilestones = useMemo(() => {
    if (currentRole === 'superadmin') return milestones;
    return milestones.filter(m => visibleGroups.some(g => g.id === m.groupId));
  }, [milestones, visibleGroups, currentRole]);

  const visibleDocuments = useMemo(() => {
    if (currentRole === 'superadmin') return documents;
    return documents.filter(d => visibleGroups.some(g => g.id === d.groupId));
  }, [documents, visibleGroups, currentRole]);

  const visibleLogs = useMemo(() => {
    if (currentRole === 'superadmin') return logs;
    return logs.filter(l => visibleGroups.some(g => g.id === l.groupId));
  }, [logs, visibleGroups, currentRole]);

  const visibleRisks = useMemo(() => {
    if (currentRole === 'superadmin') return risks;
    return risks.filter(r => visibleGroups.some(g => g.id === r.groupId));
  }, [risks, visibleGroups, currentRole]);

  return (
    <StateContext.Provider value={{
      users: visibleUsers,
      allUsers: users,
      courses: visibleCourses,
      allCourses: courses,
      courseMaterials: visibleCourseMaterials,
      allCourseMaterials: courseMaterials,
      quizzes: visibleQuizzes,
      allQuizzes: quizzes,
      groups: visibleGroups,
      milestones: visibleMilestones,
      documents: visibleDocuments,
      logs: visibleLogs,
      risks: visibleRisks,
      notifications,
      auditLogs,
      departments,
      programmes,
      courseworks: visibleCourseworks,
      addDepartment,
      addProgramme,
      createCourse,
      assignLecturerToCourse,
      enrollStudentInCourse,
      unenrollStudentFromCourse,
      uploadCourseMaterial,
      deleteCourseMaterial,
      createQuiz,
      submitQuiz,
      gradeQuiz,
      createCoursework,
      submitCoursework,
      requestResubmissionCoursework,
      gradeCoursework,
      currentUser,
      currentRole,
      theme,
      searchOpen,
      setSearchOpen,
      setTheme,
      login,
      logout,
      switchRole,
      uploadDocument,
      reviewSubmission,
      updateDocumentAnnotations,
      addLogEntry,
      addMilestone,
      createGroup,
      createUser,
      updateUser,
      deleteUser,
      bulkImport,
      escalateRisk,
      addNotification,
      markNotificationRead,
      markAllNotificationsRead
    }}>
      {children}
    </StateContext.Provider>
  );
}

export const useAppState = () => useContext(StateContext);

/**
 * CENTRALIZED DATA STRUCTURE SPECIFICATION & SCHEMAS
 * 
 * This file serves as the single source of truth for all data structures,
 * schemas, factory creators, status constants, and initial datasets
 * used across the entire system.
 */

// ==========================================
// 1. CONSTANTS & ENUMS
// ==========================================

export const USER_ROLES = {
  STUDENT: 'student',
  SUPERVISOR: 'supervisor',
  ADMIN: 'admin',
  SUPERADMIN: 'superadmin'
};

export const ACADEMIC_LEVELS = ['100', '200', '300', '400'];

export const STATUS_CODES = {
  PENDING: 'pending',
  REVIEW: 'review',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  ACTIVE: 'active',
  ARCHIVED: 'archived',
  SUBMITTED: 'submitted',
  GRADED: 'graded',
  RESOLVED: 'resolved'
};

export const RISK_TYPES = {
  INACTIVITY: 'INACTIVITY',
  OVERDUE_MILESTONE: 'OVERDUE MILESTONE',
  PENDING_REVIEW: 'PENDING REVIEW',
  UNASSIGNED_SUPERVISOR: 'UNASSIGNED SUPERVISOR'
};

export const RISK_SEVERITY = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  WARNING: 'Warning',
  CRITICAL: 'Critical'
};

export const NOTIFICATION_TYPES = {
  FEEDBACK: 'feedback',
  SUBMISSION: 'submission',
  DEADLINE: 'deadline',
  RISK: 'risk',
  AUDIT: 'audit',
  SYSTEM: 'system'
};

// ==========================================
// 2. DATA STRUCTURE DEFINITIONS (SCHEMAS)
// ==========================================

/**
 * Entity Schema Definitions specifying field types, descriptions, and default values.
 */
export const DATA_SCHEMAS = {
  User: {
    id: { type: 'string', required: true, description: 'Unique user identifier' },
    name: { type: 'string', required: true, description: 'Full name' },
    email: { type: 'string', required: true, description: 'Academic email address' },
    role: { type: 'string', enum: Object.values(USER_ROLES), required: true, description: 'User system role' },
    dept: { type: 'string', required: false, description: 'Department name' },
    indexNum: { type: 'string', required: false, description: 'Student index/registration number' },
    prog: { type: 'string', required: false, description: 'Degree programme name' },
    level: { type: 'string', enum: ACADEMIC_LEVELS, required: false, description: 'Academic level' },
    groupId: { type: 'string', required: false, description: 'Assigned group ID (students)' },
    isLead: { type: 'boolean', default: false, description: 'Group leadership flag (students)' },
    hours: { type: 'string', required: false, description: 'Office hours (supervisors)' },
    bio: { type: 'string', required: false, description: 'Academic biography (supervisors)' },
    groupsCount: { type: 'number', default: 0, description: 'Active supervised groups count' }
  },

  Group: {
    id: { type: 'string', required: true, description: 'Unique group identifier' },
    name: { type: 'string', required: true, description: 'Group / Team name' },
    project: { type: 'string', required: true, description: 'Project title or scope definition' },
    programme: { type: 'string', required: true, description: 'Associated degree programme' },
    level: { type: 'string', enum: ACADEMIC_LEVELS, required: true, description: 'Academic level' },
    capacity: { type: 'number', default: 4, description: 'Maximum team capacity' },
    supervisorId: { type: 'string', required: false, description: 'Assigned supervisor user ID' },
    members: { type: 'Array<string>', default: [], description: 'Array of student user IDs' },
    leadId: { type: 'string', required: false, description: 'Group lead student user ID' },
    status: { type: 'string', default: STATUS_CODES.ACTIVE, description: 'Group operational status' },
    lastActivity: { type: 'string', required: true, description: 'ISO timestamp of last group activity' },
    creatorId: { type: 'string', required: false, description: 'User ID of creator' }
  },

  Milestone: {
    id: { type: 'string', required: true, description: 'Unique milestone identifier' },
    groupId: { type: 'string', required: true, description: 'Parent group ID' },
    order: { type: 'number', required: true, description: 'Sequence order number (1..N)' },
    title: { type: 'string', required: true, description: 'Milestone title' },
    desc: { type: 'string', required: true, description: 'Milestone scope and instructions' },
    dueDate: { type: 'string', required: true, description: 'Due date in YYYY-MM-DD format' },
    status: { type: 'string', default: STATUS_CODES.PENDING, description: 'Approval status' },
    criteria: { type: 'string', required: false, description: 'Acceptance criteria and evaluation notes' }
  },

  Document: {
    id: { type: 'string', required: true, description: 'Unique document artifact ID' },
    name: { type: 'string', required: true, description: 'File name' },
    size: { type: 'string', default: '1.0 MB', description: 'Formatted file size string' },
    type: { type: 'string', default: 'pdf', description: 'File extension / mime category' },
    version: { type: 'number', default: 1, description: 'Artifact revision version' },
    status: { type: 'string', default: STATUS_CODES.REVIEW, description: 'Review status' },
    uploadedBy: { type: 'string', required: true, description: 'Uploader user ID' },
    uploadedAt: { type: 'string', required: true, description: 'ISO upload timestamp' },
    groupId: { type: 'string', required: true, description: 'Associated group ID' },
    milestoneId: { type: 'string', required: true, description: 'Associated milestone ID' },
    notes: { type: 'string', default: '', description: 'Student submission notes' },
    feedback: { type: 'string', default: null, description: 'Supervisor evaluation feedback' },
    annotations: { type: 'Array<object>', default: [], description: 'Document annotations and highlights' }
  },

  MeetingLog: {
    id: { type: 'string', required: true, description: 'Unique supervision meeting log ID' },
    groupId: { type: 'string', required: true, description: 'Supervised group ID' },
    meetingDate: { type: 'string', required: true, description: 'ISO meeting date timestamp' },
    supervisorName: { type: 'string', required: true, description: 'Supervisor name' },
    notes: { type: 'string', required: true, description: 'Meeting summary notes' },
    attendees: { type: 'Array<string>', default: [], description: 'List of attendee names or IDs' },
    discussedDocs: { type: 'Array<string>', default: [], description: 'Document names discussed' },
    actionItems: { type: 'Array<ActionItem>', default: [], description: 'Assigned follow-up action items' }
  },

  ActionItem: {
    task: { type: 'string', required: true, description: 'Action item task description' },
    assignedTo: { type: 'string', required: true, description: 'Assignee student name or ID' },
    dueDate: { type: 'string', required: true, description: 'Task due date (YYYY-MM-DD)' },
    done: { type: 'boolean', default: false, description: 'Task completion status' }
  },

  RiskFlag: {
    id: { type: 'string', required: true, description: 'Unique risk alert identifier' },
    groupId: { type: 'string', required: true, description: 'Flagged group ID' },
    groupName: { type: 'string', required: true, description: 'Flagged group name' },
    type: { type: 'string', required: true, description: 'Risk category' },
    severity: { type: 'string', enum: Object.values(RISK_SEVERITY), default: RISK_SEVERITY.WARNING, description: 'Severity classification' },
    daysSince: { type: 'number', default: 0, description: 'Days since activity breach' },
    supervisor: { type: 'string', required: false, description: 'Assigned supervisor name' },
    supervisorId: { type: 'string', required: false, description: 'Assigned supervisor user ID' },
    details: { type: 'string', required: true, description: 'Risk audit explanation' },
    status: { type: 'string', default: STATUS_CODES.ACTIVE, description: 'Risk status' },
    resolved: { type: 'boolean', default: false, description: 'Resolution status' }
  },

  Notification: {
    id: { type: 'string', required: true, description: 'Unique notification ID' },
    userId: { type: 'string', required: true, description: 'Recipient user ID' },
    type: { type: 'string', enum: Object.values(NOTIFICATION_TYPES), default: NOTIFICATION_TYPES.SYSTEM, description: 'Notification category' },
    title: { type: 'string', required: true, description: 'Short subject title' },
    message: { type: 'string', required: true, description: 'Detailed notification content' },
    timestamp: { type: 'string', required: true, description: 'ISO timestamp' },
    read: { type: 'boolean', default: false, description: 'Read receipt state' }
  },

  AuditLog: {
    id: { type: 'string', required: true, description: 'Unique audit trail ID' },
    timestamp: { type: 'string', required: true, description: 'ISO timestamp' },
    user: { type: 'string', required: true, description: 'User identity executing action' },
    action: { type: 'string', required: true, description: 'Action code identifier' },
    resourceType: { type: 'string', required: true, description: 'Entity type targeted' },
    resourceId: { type: 'string', required: true, description: 'Entity ID targeted' },
    ip: { type: 'string', default: '127.0.0.1', description: 'Origin IP address' },
    details: { type: 'string', required: true, description: 'Human-readable action details' }
  },

  Department: {
    id: { type: 'string', required: true, description: 'Department ID' },
    name: { type: 'string', required: true, description: 'Department name' },
    code: { type: 'string', required: true, description: 'Department short code' },
    head: { type: 'string', default: 'To be assigned', description: 'Head of Department' }
  },

  Programme: {
    id: { type: 'string', required: true, description: 'Programme ID' },
    name: { type: 'string', required: true, description: 'Full degree title' },
    code: { type: 'string', required: true, description: 'Programme code' },
    duration: { type: 'number', default: 4, description: 'Duration in academic years' },
    deptId: { type: 'string', required: true, description: 'Parent department ID' },
    deptName: { type: 'string', required: true, description: 'Parent department name' }
  },

  Coursework: {
    id: { type: 'string', required: true, description: 'Unique coursework ID' },
    title: { type: 'string', required: true, description: 'Assignment title' },
    courseCode: { type: 'string', required: true, description: 'Course code (e.g. CS 402)' },
    courseName: { type: 'string', required: true, description: 'Course title' },
    programme: { type: 'string', required: true, description: 'Target degree programme' },
    level: { type: 'string', enum: ACADEMIC_LEVELS, required: true, description: 'Academic level' },
    description: { type: 'string', required: true, description: 'Assignment details & prompt' },
    dueDate: { type: 'string', required: true, description: 'Due date (YYYY-MM-DD)' },
    points: { type: 'number', default: 100, description: 'Maximum points' },
    isGroupSubmission: { type: 'boolean', default: false, description: 'Team or individual' },
    milestoneType: { type: 'string', default: '', description: 'Linked milestone tag' },
    creatorId: { type: 'string', required: false, description: 'Lecturer / Creator user ID' },
    submissions: { type: 'Array<CourseworkSubmission>', default: [], description: 'Submitted coursework deliverables' }
  },

  CourseworkSubmission: {
    studentId: { type: 'string', required: true, description: 'Student uploader user ID' },
    groupId: { type: 'string', required: false, description: 'Team group ID' },
    submittedAt: { type: 'string', required: true, description: 'ISO timestamp' },
    text: { type: 'string', default: '', description: 'Student submission notes' },
    fileName: { type: 'string', required: true, description: 'Attachment file name' },
    fileSize: { type: 'string', default: '1.0 MB', description: 'Formatted file size' },
    attachments: { type: 'Array<object>', default: [], description: 'Attached files list' },
    status: { type: 'string', default: STATUS_CODES.SUBMITTED, description: 'Submission status' },
    version: { type: 'number', default: 1, description: 'Submission iteration version' },
    receiptCode: { type: 'string', required: true, description: 'Unique verification receipt code' },
    history: { type: 'Array<object>', default: [], description: 'Previous submission versions' },
    grade: { type: 'number', default: null, description: 'Awarded score' },
    rubricScores: { type: 'object', default: null, description: 'Detailed rubric matrix score' },
    feedback: { type: 'string', default: null, description: 'Instructor grading feedback' }
  },

  CalendarEvent: {
    id: { type: 'string', required: true, description: 'Unique event ID' },
    title: { type: 'string', required: true, description: 'Academic event title' },
    date: { type: 'string', required: true, description: 'Event date (YYYY-MM-DD)' },
    type: { type: 'string', required: true, description: 'Event type (milestone, exam, submission, etc.)' },
    scope: { type: 'string', default: 'all', description: 'Target scope (all, department, programme)' },
    description: { type: 'string', default: '', description: 'Event description' }
  }
};

// ==========================================
// 3. FACTORY CREATOR FUNCTIONS
// Enforce consistent entity instantiation
// ==========================================

export function createUser(data = {}) {
  return {
    id: data.id || 'user_' + (Date.now() + Math.random().toString(36).substring(2, 6)),
    name: data.name || 'Unnamed User',
    email: data.email || 'user@zaid.edu',
    role: data.role || USER_ROLES.STUDENT,
    indexNum: data.indexNum || null,
    prog: data.prog || null,
    level: data.level || null,
    dept: data.dept || 'Computer Science',
    groupId: data.groupId || null,
    isLead: Boolean(data.isLead),
    hours: data.hours || null,
    bio: data.bio || null,
    groupsCount: typeof data.groupsCount === 'number' ? data.groupsCount : (data.role === USER_ROLES.SUPERVISOR ? 0 : null)
  };
}

export function createGroup(data = {}) {
  return {
    id: data.id || 'group_' + (Date.now() + Math.random().toString(36).substring(2, 6)),
    name: data.name || 'New Academic Group',
    courseId: data.courseId || '',
    courseCode: data.courseCode || '',
    courseName: data.courseName || '',
    project: data.project || 'Awaiting project title definition.',
    dept: data.dept || 'Computer Science',
    programme: data.programme || 'BSc. Computer Science',
    level: data.level || '400',
    capacity: parseInt(data.capacity) || 4,
    supervisorId: data.supervisorId || null,
    members: Array.isArray(data.members) ? data.members : [],
    leadId: data.leadId || (Array.isArray(data.members) && data.members.length > 0 ? data.members[0] : null),
    status: data.status || STATUS_CODES.ACTIVE,
    lastActivity: data.lastActivity || new Date().toISOString(),
    creatorId: data.creatorId || null
  };
}

export function createMilestone(data = {}) {
  return {
    id: data.id || 'm_' + (Date.now() + Math.random().toString(36).substring(2, 6)),
    groupId: data.groupId || '',
    order: data.order || 1,
    title: data.title || 'Untitled Milestone',
    desc: data.desc || '',
    dueDate: data.dueDate || new Date().toISOString().split('T')[0],
    status: data.status || STATUS_CODES.PENDING,
    criteria: data.criteria || 'Standard supervisor evaluation criteria.'
  };
}

export function createDocument(data = {}) {
  return {
    id: data.id || 'doc_' + (Date.now() + Math.random().toString(36).substring(2, 6)),
    name: data.name || 'Document.pdf',
    size: data.size || '1.5 MB',
    type: data.type || (data.name ? data.name.split('.').pop() : 'pdf'),
    version: data.version || 1,
    status: data.status || STATUS_CODES.REVIEW,
    uploadedBy: data.uploadedBy || '',
    uploadedAt: data.uploadedAt || new Date().toISOString(),
    groupId: data.groupId || '',
    milestoneId: data.milestoneId || '',
    notes: data.notes || '',
    feedback: data.feedback || null,
    annotations: Array.isArray(data.annotations) ? data.annotations : []
  };
}

export function createMeetingLog(data = {}) {
  return {
    id: data.id || 'log_' + (Date.now() + Math.random().toString(36).substring(2, 6)),
    groupId: data.groupId || '',
    meetingDate: data.meetingDate || new Date().toISOString(),
    supervisorName: data.supervisorName || 'Academic Supervisor',
    notes: data.notes || '',
    attendees: Array.isArray(data.attendees) ? data.attendees : [],
    discussedDocs: Array.isArray(data.discussedDocs) ? data.discussedDocs : [],
    actionItems: Array.isArray(data.actionItems) ? data.actionItems.map(createActionItem) : []
  };
}

export function createActionItem(data = {}) {
  return {
    task: data.task || 'Assigned task',
    assignedTo: data.assignedTo || 'Unassigned',
    dueDate: data.dueDate || new Date().toISOString().split('T')[0],
    done: Boolean(data.done)
  };
}

export function createRisk(data = {}) {
  return {
    id: data.id || 'risk_' + (Date.now() + Math.random().toString(36).substring(2, 6)),
    groupId: data.groupId || '',
    groupName: data.groupName || 'Unspecified Team',
    type: data.type || RISK_TYPES.INACTIVITY,
    severity: data.severity || RISK_SEVERITY.WARNING,
    daysSince: typeof data.daysSince === 'number' ? data.daysSince : 0,
    supervisor: data.supervisor || null,
    supervisorId: data.supervisorId || null,
    details: data.details || 'System flagged potential risk factor.',
    status: data.status || STATUS_CODES.ACTIVE,
    resolved: Boolean(data.resolved)
  };
}

export function createNotification(data = {}) {
  return {
    id: data.id || 'notif_' + (Date.now() + Math.random().toString(36).substring(2, 6)),
    userId: data.userId || '',
    type: data.type || NOTIFICATION_TYPES.SYSTEM,
    title: data.title || 'System Alert',
    message: data.message || '',
    timestamp: data.timestamp || new Date().toISOString(),
    read: Boolean(data.read)
  };
}

export function createAuditLog(data = {}) {
  return {
    id: data.id || 'aud_' + (Date.now() + Math.random().toString(36).substring(2, 6)),
    timestamp: data.timestamp || new Date().toISOString(),
    user: data.user || 'System Lifecycle',
    action: data.action || 'SYSTEM_EVENT',
    resourceType: data.resourceType || 'System',
    resourceId: data.resourceId || 'sys',
    ip: data.ip || '127.0.0.1',
    details: data.details || 'Recorded audit event.'
  };
}

export function createDepartment(data = {}) {
  return {
    id: data.id || 'dept-' + (Date.now() + Math.random().toString(36).substring(2, 6)),
    name: data.name || 'New Department',
    code: data.code || 'DEPT',
    head: data.head || 'To be specified'
  };
}

export function createProgramme(data = {}) {
  return {
    id: data.id || 'prog-' + (Date.now() + Math.random().toString(36).substring(2, 6)),
    name: data.name || 'New Degree Programme',
    code: data.code || 'PROG',
    duration: parseInt(data.duration) || 4,
    deptId: data.deptId || '',
    deptName: data.deptName || 'Department'
  };
}

export function createCoursework(data = {}) {
  return {
    id: data.id || 'cw_' + (Date.now() + Math.random().toString(36).substring(2, 6)),
    title: data.title || 'Untitled Coursework',
    courseCode: data.courseCode || 'CS 101',
    courseName: data.courseName || 'General Course',
    programme: data.programme || 'BSc. Computer Science',
    level: data.level || '400',
    description: data.description || '',
    dueDate: data.dueDate || new Date().toISOString().split('T')[0],
    points: parseInt(data.points) || 100,
    isGroupSubmission: Boolean(data.isGroupSubmission),
    milestoneType: data.milestoneType || '',
    creatorId: data.creatorId || null,
    submissions: Array.isArray(data.submissions) ? data.submissions.map(createSubmission) : []
  };
}

export function createSubmission(data = {}) {
  return {
    studentId: data.studentId || '',
    groupId: data.groupId || null,
    submittedAt: data.submittedAt || new Date().toISOString(),
    text: data.text || '',
    fileName: data.fileName || 'Submission_Attachment.pdf',
    fileSize: data.fileSize || '1.0 MB',
    attachments: Array.isArray(data.attachments) ? data.attachments : [
      { name: data.fileName || 'Submission_Attachment.pdf', size: data.fileSize || '1.0 MB', type: 'pdf' }
    ],
    status: data.status || STATUS_CODES.SUBMITTED,
    version: data.version || 1,
    receiptCode: data.receiptCode || `CZ-SUB-2026-${Math.floor(100000 + Math.random() * 900000)}`,
    history: Array.isArray(data.history) ? data.history : [],
    grade: typeof data.grade === 'number' ? data.grade : null,
    rubricScores: data.rubricScores || null,
    feedback: data.feedback || null
  };
}

export function createCalendarEvent(data = {}) {
  return {
    id: data.id || 'evt_' + (Date.now() + Math.random().toString(36).substring(2, 6)),
    title: data.title || 'Academic Event',
    date: data.date || new Date().toISOString().split('T')[0],
    type: data.type || 'milestone',
    scope: data.scope || 'all',
    description: data.description || ''
  };
}

export function createCourse(data = {}) {
  return {
    id: data.id || 'course_' + (Date.now() + Math.random().toString(36).substring(2, 6)),
    code: data.code || 'CS 101',
    name: data.name || 'Introductory Computing',
    dept: data.dept || 'Computer Science',
    programme: data.programme || 'BSc. Computer Science',
    level: data.level || '100',
    lecturerId: data.lecturerId || null,
    lecturerName: data.lecturerName || 'Unassigned Lecturer',
    enrolledStudents: Array.isArray(data.enrolledStudents) ? data.enrolledStudents : []
  };
}

export function createCourseMaterial(data = {}) {
  const fileName = data.fileName || 'Lecture_Notes.pdf';
  let fileType = data.fileType;
  if (!fileType) {
    const ext = fileName.split('.').pop().toLowerCase();
    if (['pptx', 'ppt'].includes(ext)) fileType = 'pptx';
    else if (['docx', 'doc'].includes(ext)) fileType = 'docx';
    else if (['txt', 'text'].includes(ext)) fileType = 'txt';
    else fileType = 'pdf';
  }

  return {
    id: data.id || 'mat_' + (Date.now() + Math.random().toString(36).substring(2, 6)),
    courseId: data.courseId || '',
    courseCode: data.courseCode || '',
    title: data.title || 'Course Material Document',
    description: data.description || '',
    category: data.category || 'Lecture Notes',
    fileName,
    fileType,
    fileSize: data.fileSize || '2.0 MB',
    uploadedBy: data.uploadedBy || '',
    uploadedAt: data.uploadedAt || new Date().toISOString()
  };
}

export function createQuiz(data = {}) {
  return {
    id: data.id || 'quiz_' + (Date.now() + Math.random().toString(36).substring(2, 6)),
    courseId: data.courseId || '',
    courseCode: data.courseCode || '',
    title: data.title || 'Course Assessment Quiz',
    description: data.description || '',
    dueDate: data.dueDate || new Date().toISOString().split('T')[0],
    timeLimit: parseInt(data.timeLimit) || 15,
    totalPoints: parseInt(data.totalPoints) || 20,
    creatorId: data.creatorId || '',
    questions: Array.isArray(data.questions) ? data.questions : [],
    submissions: Array.isArray(data.submissions) ? data.submissions : []
  };
}

// ==========================================
// 4. INITIAL STATIC SEED DATASETS
// ==========================================

export const initialUsers = [
  createUser({ id: 'stud1', name: 'Sarah Al-Zaid', email: 'sarah@zaid.edu', role: 'student', indexNum: 'CS/2022/041', prog: 'BSc. Computer Science', level: '400', dept: 'Computer Science', groupId: 'group1', isLead: true }),
  createUser({ id: 'stud2', name: 'Liam Henderson', email: 'liam@zaid.edu', role: 'student', indexNum: 'CS/2022/045', prog: 'BSc. Computer Science', level: '400', dept: 'Computer Science', groupId: 'group1', isLead: false }),
  createUser({ id: 'stud3', name: 'Maya Lin', email: 'maya@zaid.edu', role: 'student', indexNum: 'SE/2022/012', prog: 'BSc. Software Engineering', level: '400', dept: 'Software Engineering', groupId: 'group2', isLead: true }),
  createUser({ id: 'stud4', name: 'Elena Rostova', email: 'elena@zaid.edu', role: 'student', indexNum: 'CS/2022/067', prog: 'BSc. Computer Science', level: '300', dept: 'Computer Science', groupId: null, isLead: false }),
  
  createUser({ id: 'sup1', name: 'Dr. Arthur Sterling', email: 'a.sterling@zaid.edu', role: 'supervisor', dept: 'Computer Science', hours: 'Mon-Thu 2pm-5pm', bio: 'Associate Professor with 15+ years of academic research in distributed ledger technologies, consensus protocols, and cloud computing security.', groupsCount: 1 }),
  createUser({ id: 'sup2', name: 'Dr. Evelyn Chen', email: 'e.chen@zaid.edu', role: 'supervisor', dept: 'Software Engineering', hours: 'Tue-Fri 10am-12pm', bio: 'Expert in human-computer interaction, modular architectures, and WebAssembly compiler designs development.', groupsCount: 1 }),
  createUser({ id: 'sup3', name: 'Dr. Robert Carter', email: 'r.carter@zaid.edu', role: 'supervisor', dept: 'Computer Science', hours: 'Fri 9am-12pm', bio: 'Assistant researcher in dynamic semantic networks and automated graph optimization methods.', groupsCount: 0 }),
  
  createUser({ id: 'scr1', name: 'System Architect', email: 'admin@scrabble.io', role: 'admin', dept: 'Computer Science' }),
  createUser({ id: 'adm1', name: 'Dr. Marcus Vance', email: 'm.vance@zaid.edu', role: 'admin', dept: 'Computer Science' }),
  createUser({ id: 'sad1', name: 'Chancellor Alistair Grey', email: 'a.grey@zaid.edu', role: 'superadmin', dept: 'Administration' })
];

export const initialGroups = [
  createGroup({
    id: 'group1',
    name: 'Team Alpha',
    courseId: 'c1',
    courseCode: 'CS 402',
    courseName: 'Advanced Distributed Systems',
    project: 'Distributed Consensus in Cloud-Native Databases',
    programme: 'BSc. Computer Science',
    level: '400',
    capacity: 4,
    supervisorId: 'sup1',
    members: ['stud1', 'stud2'],
    leadId: 'stud1',
    status: 'active',
    lastActivity: '2026-05-18T14:30:00Z',
    creatorId: 'sup1'
  }),
  createGroup({
    id: 'group2',
    name: 'Team Beta',
    courseId: 'c2',
    courseCode: 'SE 406',
    courseName: 'Secure Software Engineering',
    project: 'Micro-frontend Isolation over WebAssembly Virtual Runtimes',
    programme: 'BSc. Software Engineering',
    level: '400',
    capacity: 5,
    supervisorId: 'sup2',
    members: ['stud3'],
    leadId: 'stud3',
    status: 'active',
    lastActivity: '2026-05-01T09:12:00Z',
    creatorId: 'sup2'
  })
];

export const initialMilestones = [
  createMilestone({ id: 'm1_g1', groupId: 'group1', order: 1, title: 'Project Proposal & Scope Definition', desc: 'Identify core engineering challenges, perform initial risk review, and outline methodology.', dueDate: '2026-02-20', status: 'approved', criteria: 'Clear formal objectives, supervisor-signed commitment, approved budget framework limit.' }),
  createMilestone({ id: 'm2_g1', groupId: 'group1', order: 2, title: 'Literature Review & Architecture Design', desc: 'Comprehensive analysis of existing consensus solutions and specification of proposed distributed structures.', dueDate: '2026-03-15', status: 'approved', criteria: 'At least 15 peer-reviewed references, robust diagrammed UML specs, modular topology explanation.' }),
  createMilestone({ id: 'm3_g1', groupId: 'group1', order: 3, title: 'System Engineering & Draft Implementation', desc: 'Creation of baseline consensus engine with benchmarks demonstrating raft/paxos compliance.', dueDate: '2026-04-22', status: 'approved', criteria: 'Public code repository, reproducible bench suite test suite running over 3 network mock nodes.' }),
  createMilestone({ id: 'm4_g1', groupId: 'group1', order: 4, title: 'Evaluation, Optimization, & Risk Mitigation', desc: 'Stress tests, Byzantine failure injections, latency tracking, and drafting project report chapters 1-4.', dueDate: '2026-05-25', status: 'review', criteria: 'Formal analytical benchmarks, evidence of partition endurance, standard project report drafts.' }),
  createMilestone({ id: 'm5_g1', groupId: 'group1', order: 5, title: 'Final Project Submission & Presentation', desc: 'Refined bookmarked project report, validated source files deposit, and presentation defense.', dueDate: '2026-06-15', status: 'pending', criteria: 'Completed structural reviews, similarity index under 15%, presentation decks approval.' }),

  createMilestone({ id: 'm1_g2', groupId: 'group2', order: 1, title: 'Project Proposal & Scope Definition', desc: 'Define secure isolation boundaries inside WebAssembly runtimes for client modules.', dueDate: '2026-02-28', status: 'approved', criteria: 'Benchmark of current solutions, module specification, supervisor signup.' }),
  createMilestone({ id: 'm2_g2', groupId: 'group2', order: 2, title: 'Literature Review & Architecture Design', desc: 'Detailed exploration of WASI specifications, sandbox escapes, and React dynamic bindings.', dueDate: '2026-03-25', status: 'pending', criteria: 'Literature mapping document focusing on secure dynamic linkage patterns.' }),
  createMilestone({ id: 'm3_g2', groupId: 'group2', order: 3, title: 'System Engineering & Draft Implementation', desc: 'Core virtual memory binding implementation.', dueDate: '2026-04-30', status: 'pending', criteria: 'Functional proof of isolation with minor overhead (<5%).' })
];

export const initialDocuments = [
  createDocument({ id: 'doc1', name: 'Alpha_Proposal_v1.pdf', size: '2.4 MB', type: 'pdf', version: 1, status: 'approved', uploadedBy: 'stud1', uploadedAt: '2026-02-10T11:00:00Z', groupId: 'group1', milestoneId: 'm1_g1', notes: 'Incorporated Dr. Carters suggestions on distributed clocks.', feedback: 'Excellent formal outline. Very practical scope.' }),
  createDocument({ id: 'doc2', name: 'Alpha_Architecture_v1.pdf', size: '4.1 MB', type: 'pdf', version: 1, status: 'rejected', uploadedBy: 'stud1', uploadedAt: '2026-03-05T09:30:00Z', groupId: 'group1', milestoneId: 'm2_g1', notes: 'Initial design diagram featuring local multi-thread sync.', feedback: 'Need to focus on network boundaries, not just OS thread synchronizations. Please revise UML flow to include RPC limits.' }),
  createDocument({ id: 'doc3', name: 'Alpha_Architecture_v2.pdf', size: '4.3 MB', type: 'pdf', version: 2, status: 'approved', uploadedBy: 'stud1', uploadedAt: '2026-03-12T15:20:00Z', groupId: 'group1', milestoneId: 'm2_g1', notes: 'Revised UML including gRPC nodes communication buffers.', feedback: 'MUCH better. Network overhead models look solid. Approve.' }),
  createDocument({ id: 'doc4', name: 'Alpha_CoreTech_v1.pdf', size: '3.8 MB', type: 'pdf', version: 1, status: 'approved', uploadedBy: 'stud2', uploadedAt: '2026-04-18T10:15:00Z', groupId: 'group1', milestoneId: 'm3_g1', notes: 'Draft implementation repository containing C++ code.', feedback: 'Good performance ratios. Testing is adequate.' }),
  createDocument({ id: 'doc5', name: 'Alpha_Evaluation_v1.pdf', size: '5.2 MB', type: 'pdf', version: 1, status: 'review', uploadedBy: 'stud1', uploadedAt: '2026-05-17T16:45:00Z', groupId: 'group1', milestoneId: 'm4_g1', notes: 'Chapter 1 to 4 draft for feedback. Plagiarism review attached.', feedback: null }),
  createDocument({ id: 'doc6', name: 'Beta_Proposal_v1.pdf', size: '1.9 MB', type: 'pdf', version: 1, status: 'approved', uploadedBy: 'stud3', uploadedAt: '2026-02-25T14:10:00Z', groupId: 'group2', milestoneId: 'm1_g2', notes: 'First outline of raw performance metrics.', feedback: 'Approved. Proceed to architectural blueprint.' })
];

export const initialLogs = [
  createMeetingLog({
    id: 'log1',
    groupId: 'group1',
    meetingDate: '2026-02-15T14:00:00Z',
    supervisorName: 'Dr. Arthur Sterling',
    notes: 'Vetted final project scope. Outlined Byzantine node setup. Formulated requirements under high partition packet drops.',
    attendees: ['Sarah Al-Zaid', 'Liam Henderson'],
    discussedDocs: ['Alpha_Proposal_v1.pdf'],
    actionItems: [
      { task: 'Complete research on Paxos vs Raft boundaries', assignedTo: 'Liam Henderson', dueDate: '2026-03-01', done: true },
      { task: 'Draft initial UML nodes communications flow', assignedTo: 'Sarah Al-Zaid', dueDate: '2026-03-05', done: true }
    ]
  }),
  createMeetingLog({
    id: 'log2',
    groupId: 'group1',
    meetingDate: '2026-03-08T15:00:00Z',
    supervisorName: 'Dr. Arthur Sterling',
    notes: 'Reviewed architecture proposal. Directed students to shift research from simulated memory models to distributed networking pipelines. Instructed Sarah to model gRPC communication latencies.',
    attendees: ['Sarah Al-Zaid', 'Liam Henderson'],
    discussedDocs: ['Alpha_Architecture_v1.pdf'],
    actionItems: [
      { task: 'Update UML architecture to reflect networking protocols', assignedTo: 'Sarah Al-Zaid', dueDate: '2026-03-12', done: true }
    ]
  }),
  createMeetingLog({
    id: 'log3',
    groupId: 'group1',
    meetingDate: '2026-04-20T14:30:00Z',
    supervisorName: 'Dr. Arthur Sterling',
    notes: 'Benchmark review session. Verified nodes reach consensus during simulated 30% random packet drops. The performance looks highly promising under heavy load workloads.',
    attendees: ['Sarah Al-Zaid', 'Liam Henderson'],
    discussedDocs: ['Alpha_CoreTech_v1.pdf'],
    actionItems: [
      { task: 'Begin drafts for chapters 1-4 project report structure', assignedTo: 'Sarah Al-Zaid', dueDate: '2026-05-15', done: true }
    ]
  })
];

export const initialRisks = [
  createRisk({ id: 'risk1', groupId: 'group2', groupName: 'Team Beta', type: 'INACTIVITY', severity: 'Warning', daysSince: 18, supervisor: 'Dr. Evelyn Chen', supervisorId: 'sup2', details: 'Team Beta group registry shows no uploaded documents, logs, or activities for over 15 calendar days.', status: 'active', resolved: false }),
  createRisk({ id: 'risk2', groupId: 'group3', groupName: 'Team Gamma (Mock)', type: 'OVERDUE MILESTONE', severity: 'Critical', daysSince: 24, supervisor: 'Unassigned', supervisorId: null, details: 'Milestone 1 (Project Proposal) is currently 10 days overdue with no submission made.', status: 'active', resolved: false }),
  createRisk({ id: 'risk3', groupId: 'group1', groupName: 'Team Alpha', type: 'PENDING REVIEW', severity: 'Warning', daysSince: 2, supervisor: 'Dr. Arthur Sterling', supervisorId: 'sup1', details: 'A core document submission has remained under review status for Dr. Sterling for 2 days now.', status: 'active', resolved: false })
];

export const initialNotifications = [
  createNotification({ id: 'n1', userId: 'stud1', type: 'feedback', title: 'Feedback received on Chapter 3', message: 'Dr. Sterling approved your architecture specifications in Alpha_Architecture_v2.pdf with comments.', timestamp: '2026-03-12T16:00:00Z', read: true }),
  createNotification({ id: 'n2', userId: 'sup1', type: 'submission', title: 'New submission from Team Alpha', message: 'Sarah Al-Zaid has uploaded Alpha_Evaluation_v1.pdf for Milestone 4 review.', timestamp: '2026-05-17T16:45:00Z', read: false }),
  createNotification({ id: 'n3', userId: 'stud1', type: 'deadline', title: 'Milestone 4 Deadline approaching', message: 'Milestone 4 (Evaluation & Chapters 1-4) is due in 6 days.', timestamp: '2026-05-19T08:00:00Z', read: false }),
  createNotification({ id: 'n4', userId: 'adm1', type: 'risk', title: 'Risk flag triggered on Team Beta', message: 'Academic risk crawler flagged Team Beta for 18-day inactivity periods.', timestamp: '2026-05-18T00:00:00Z', read: false }),
  createNotification({ id: 'n5', userId: 'sad1', type: 'audit', title: 'System Security Log Summary', message: 'HOD Dr. Vance audited 5 security log events from 147.28.11.23.', timestamp: '2026-05-19T10:12:00Z', read: false })
];

export const initialAuditLogs = [
  createAuditLog({ id: 'aud1', timestamp: '2026-05-19T18:32:00Z', user: 'Chancellor Alistair Grey', action: 'ROLE_SWITCH', resourceType: 'Auth', resourceId: 'sad1', ip: '192.168.1.10', details: 'Switched primary role to Admin (HOD) for administrative validation.' }),
  createAuditLog({ id: 'aud2', timestamp: '2026-05-19T15:10:00Z', user: 'Dr. Marcus Vance', action: 'USER_CREATE', resourceType: 'User', resourceId: 'stud4', ip: '192.168.1.5', details: 'Created student account Elena Rostova (CS/2022/067).' }),
  createAuditLog({ id: 'aud3', timestamp: '2026-05-18T14:30:00Z', user: 'Dr. Arthur Sterling', action: 'MEETING_LOG_CREATE', resourceType: 'Log', resourceId: 'log3', ip: '102.89.41.112', details: 'Logged dynamic review session notes for Team Alpha progress.' }),
  createAuditLog({ id: 'aud4', timestamp: '2026-05-17T16:45:00Z', user: 'Sarah Al-Zaid', action: 'DOC_UPLOAD', resourceType: 'Document', resourceId: 'doc5', ip: '197.210.82.9', details: 'Uploaded Chapter 4 project draft (Alpha_Evaluation_v1.pdf) under benchmark guidelines.' }),
  createAuditLog({ id: 'aud5', timestamp: '2026-05-16T11:24:00Z', user: 'Dr. Evelyn Chen', action: 'RISK_ACKNOWLEDGEMENT', resourceType: 'Risk', resourceId: 'risk1', ip: '105.112.35.88', details: 'Acknowledged inactivity notice and emailed Maya Lin regarding research updates.' })
];

export const initialDepartments = [
  createDepartment({ id: 'dept-cs', name: 'Computer Science', code: 'CS', head: 'Dr. Arthur Sterling' }),
  createDepartment({ id: 'dept-se', name: 'Software Engineering', code: 'SE', head: 'Dr. Evelyn Chen' }),
  createDepartment({ id: 'dept-cm', name: 'Cyber Mathematics', code: 'CM', head: 'Dr. Robert Carter' })
];

export const initialProgrammes = [
  createProgramme({ id: 'prog-cs', name: 'BSc. Computer Science', code: 'BSc. CS', duration: 4, deptId: 'dept-cs', deptName: 'Computer Science' }),
  createProgramme({ id: 'prog-se', name: 'BSc. Software Engineering', code: 'BSc. SE', duration: 4, deptId: 'dept-se', deptName: 'Software Engineering' }),
  createProgramme({ id: 'prog-cm', name: 'BSc. Cyber Mathematics', code: 'BSc. CM', duration: 4, deptId: 'dept-cm', deptName: 'Cyber Mathematics' })
];

export const initialCoursework = [
  createCoursework({
    id: 'cw1',
    title: 'Distributed System Consensus Implementation',
    courseCode: 'CS 402',
    courseName: 'Advanced Distributed Systems',
    programme: 'BSc. Computer Science',
    level: '400',
    description: 'Implement a Paxos or Raft simulation demonstrating consensus under network partition packet losses. Include a benchmarks log sheet in your submission.',
    dueDate: '2026-06-25',
    points: 100,
    creatorId: 'sup1',
    submissions: [
      createSubmission({
        studentId: 'stud1',
        submittedAt: '2026-06-12T10:15:00Z',
        text: 'Our team successfully completed the Raft consensus testing. Source code compiled with Docker bindings is mapped in the repo.',
        fileName: 'Raft_Consensus_Implementation.zip',
        fileSize: '1.8 MB',
        status: 'submitted',
        grade: null,
        feedback: null
      })
    ]
  }),
  createCoursework({
    id: 'cw2',
    title: 'Sandboxed Isolation Benchmark Suite',
    courseCode: 'SE 406',
    courseName: 'Secure Software Engineering',
    programme: 'BSc. Software Engineering',
    level: '400',
    description: 'Construct a verification suite evaluating WebAssembly virtual memory sandboxing performance metrics, memory overhead, and escaping risk boundaries.',
    dueDate: '2026-06-28',
    points: 100,
    creatorId: 'sup2',
    submissions: []
  }),
  createCoursework({
    id: 'cw3',
    title: 'UML Topologies & Dynamic Routing Exercises',
    courseCode: 'CS 410',
    courseName: 'Advanced Program Architecture',
    programme: 'BSc. Computer Science',
    level: '400',
    description: 'Design comprehensive UML component diagrams representing redundant micro-frontend service channels routing. Analyze communication latency risks.',
    dueDate: '2026-06-18',
    points: 50,
    creatorId: 'adm1',
    submissions: [
      createSubmission({
        studentId: 'stud2',
        submittedAt: '2026-06-11T14:35:00Z',
        text: 'Attached design exercises maps out redundancy protocols for parallel state engines.',
        fileName: 'CS410_UML_Routing_Exercises.pdf',
        fileSize: '1.2 MB',
        status: 'graded',
        grade: 48,
        feedback: 'Excellent dynamic routing pathways modeled. Exceptional UML notation precision.'
      })
    ]
  })
];

export const initialCalendarEvents = [
  createCalendarEvent({ id: 'evt1', title: 'Milestone 4 Chapters Drafts Submission', date: '2026-05-25', type: 'submission', scope: 'all', description: 'Submission window for project chapters 1-4.' }),
  createCalendarEvent({ id: 'evt2', title: 'Mid-Semester Defense Presentations', date: '2026-06-05', type: 'defense', scope: 'all', description: 'Mock defenses before faculty committee panels.' }),
  createCalendarEvent({ id: 'evt3', title: 'Final Project Hard Copy Deposit', date: '2026-06-15', type: 'milestone', scope: 'all', description: 'Final approved project manuscript submission.' })
];

export const initialCourses = [
  createCourse({
    id: 'c_cs402',
    code: 'CS 402',
    name: 'Advanced Distributed Systems',
    dept: 'Computer Science',
    programme: 'BSc. Computer Science',
    level: '400',
    lecturerId: 'sup1',
    lecturerName: 'Dr. Arthur Sterling',
    enrolledStudents: ['stud1', 'stud2']
  }),
  createCourse({
    id: 'c_se406',
    code: 'SE 406',
    name: 'Secure Software Engineering',
    dept: 'Software Engineering',
    programme: 'BSc. Software Engineering',
    level: '400',
    lecturerId: 'sup2',
    lecturerName: 'Dr. Evelyn Chen',
    enrolledStudents: ['stud3']
  }),
  createCourse({
    id: 'c_cs410',
    code: 'CS 410',
    name: 'Advanced Program Architecture',
    dept: 'Computer Science',
    programme: 'BSc. Computer Science',
    level: '400',
    lecturerId: 'sup1',
    lecturerName: 'Dr. Arthur Sterling',
    enrolledStudents: ['stud1', 'stud2']
  })
];

export const initialCourseMaterials = [
  createCourseMaterial({
    id: 'mat1',
    courseId: 'c_cs402',
    courseCode: 'CS 402',
    title: 'Lecture Slides: Paxos & Raft Distributed Consensus Protocols',
    description: 'Comprehensive presentation deck covering leader election, log replication safety, and partition tolerance.',
    fileName: 'CS402_Lecture1_Consensus.pptx',
    fileType: 'pptx',
    category: 'Lecture Notes',
    fileSize: '4.8 MB',
    uploadedBy: 'sup1',
    uploadedAt: '2026-02-10T10:00:00Z'
  }),
  createCourseMaterial({
    id: 'mat2',
    courseId: 'c_se406',
    courseCode: 'SE 406',
    title: 'WASM Runtime Sandbox Security Architecture Specification',
    description: 'Word document outlining specifications for client-side WebAssembly memory safety & escape analysis.',
    fileName: 'SE406_WASM_Sandbox_Guide.docx',
    fileType: 'docx',
    category: 'Lab Manual',
    fileSize: '1.8 MB',
    uploadedBy: 'sup2',
    uploadedAt: '2026-02-15T11:30:00Z'
  }),
  createCourseMaterial({
    id: 'mat3',
    courseId: 'c_cs410',
    courseCode: 'CS 410',
    title: 'UML Topologies & Micro-Frontend Routing Patterns Reference',
    description: 'Architectural PDF blueprints for high-throughput component routing and state synchronization.',
    fileName: 'CS410_UML_Architecture_Blueprints.pdf',
    fileType: 'pdf',
    category: 'Reference Reading',
    fileSize: '3.1 MB',
    uploadedBy: 'sup1',
    uploadedAt: '2026-02-20T14:00:00Z'
  }),
  createCourseMaterial({
    id: 'mat4',
    courseId: 'c_cs402',
    courseCode: 'CS 402',
    title: 'Lab 1 Environment Setup & RPC Configuration File',
    description: 'Plaintext instructions and configuration variables for local multi-node cluster deployment.',
    fileName: 'CS402_Lab1_Setup_Instructions.txt',
    fileType: 'txt',
    category: 'Lab Manual',
    fileSize: '120 KB',
    uploadedBy: 'sup1',
    uploadedAt: '2026-02-22T09:15:00Z'
  }),
  createCourseMaterial({
    id: 'mat5',
    courseId: 'c_se406',
    courseCode: 'SE 406',
    title: 'Semester Course Syllabus & Grading Rubric Overview',
    description: 'Official course syllabus Word document specifying milestone deadlines and academic integrity guidelines.',
    fileName: 'SE406_Course_Syllabus.docx',
    fileType: 'docx',
    category: 'Syllabus',
    fileSize: '850 KB',
    uploadedBy: 'sup2',
    uploadedAt: '2026-02-05T08:00:00Z'
  })
];

export const initialQuizzes = [
  createQuiz({
    id: 'qz1',
    courseId: 'c_cs402',
    courseCode: 'CS 402',
    title: 'Distributed Consensus & Raft Protocols Quiz',
    description: '15-minute evaluation testing quorum rules, network partitions, and heartbeat intervals.',
    dueDate: '2026-06-30',
    timeLimit: 15,
    totalPoints: 20,
    creatorId: 'sup1',
    questions: [
      {
        id: 'q1',
        prompt: 'In Raft consensus, what triggers a Candidate node to transition to the Leader role?',
        options: [
          'Receiving votes from a majority of servers in the cluster',
          'Timing out during heartbeat interval without candidate state',
          'Manual override by system administrator',
          'Executing an RPC lock call on local memory'
        ],
        correctAnswer: 0,
        points: 10
      },
      {
        id: 'q2',
        prompt: 'What happens when a network partition creates a split-brain scenario in Raft?',
        options: [
          'Both partitions elect a leader and commit log entries independently',
          'Only the partition containing a majority quorum can elect a leader and commit entries',
          'All cluster nodes crash automatically to prevent corruption',
          'No entries can be appended in any partition until reconnected'
        ],
        correctAnswer: 1,
        points: 10
      }
    ],
    submissions: [
      {
        studentId: 'stud1',
        submittedAt: '2026-06-12T11:00:00Z',
        answers: { q1: 0, q2: 1 },
        score: 20,
        maxScore: 20,
        status: 'completed',
        feedback: 'Excellent grasp of quorum logic and Raft log safety!'
      }
    ]
  }),
  createQuiz({
    id: 'qz2',
    courseId: 'c_se406',
    courseCode: 'SE 406',
    title: 'WASM Memory Isolation & Escape Boundary Quiz',
    description: 'Evaluation quiz on virtual memory bounds, linear memory access, and sandbox escape mitigation.',
    dueDate: '2026-07-05',
    timeLimit: 20,
    totalPoints: 20,
    creatorId: 'sup2',
    questions: [
      {
        id: 'q1',
        prompt: 'How does WebAssembly enforce linear memory bounds checks at runtime?',
        options: [
          'Through dynamic guard pages and boundary address validation',
          'By granting direct pointer arithmetic access to host kernel memory',
          'By disabling array indexing completely',
          'Using hardware-level encrypted registers only'
        ],
        correctAnswer: 0,
        points: 10
      },
      {
        id: 'q2',
        prompt: 'Which technique prevents arbitrary function pointer jumps in WASM?',
        options: [
          'Strict Indirect Call Table index matching and type signature checks',
          'Executing all functions in a single linear stack frame',
          'Encrypting bytecodes prior to execution',
          'Disabling indirect calls entirely'
        ],
        correctAnswer: 0,
        points: 10
      }
    ],
    submissions: []
  })
];


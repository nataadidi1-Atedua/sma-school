
export enum ViewType {
  DASHBOARD = 'DASHBOARD',
  SCHOOLS = 'SCHOOLS',
  SCHOOL_DIRECTOR = 'SCHOOL_DIRECTOR',
  PEDAGOGICAL_DIRECTOR = 'PEDAGOGICAL_DIRECTOR',
  STUDENTS = 'STUDENTS',
  STAFF = 'STAFF',
  MANAGERS = 'MANAGERS',
  SECRETARY = 'SECRETARY',
  FINANCE = 'FINANCE',
  ACADEMICS = 'ACADEMICS',
  CLASSES = 'CLASSES',
  GRADES = 'GRADES',
  REPORTS = 'REPORTS',
  AI_ASSISTANT = 'AI_ASSISTANT',
  SETTINGS = 'SETTINGS',
  SECURITY = 'SECURITY',
  MESSAGES = 'MESSAGES'
}

export type UserRole = 'SUPER_ADMIN' | 'MANAGER' | 'SECRETARY' | 'STAFF' | 'GUEST' | 'TEACHER' | 'IT_ADMIN';

export type Language = 'en' | 'pt' | 'es' | 'fr' | 'zh' | 'ja' | 'ru' | 'de' | 'it' | 'ar';

export interface UserSettings {
  theme: 'light' | 'dark';
  accentColor: string;
  fontSize: number;
  fontFamily: string;
  backgroundColor: string;
}

export interface InternalMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: string;
  recipientId: string;
  subject: string;
  content: string;
  type: 'NORMAL' | 'ALERT' | 'SYSTEM';
  timestamp: string;
  read: boolean;
}

export interface ModulePermissions {
  view: boolean;
  edit: boolean;
  delete: boolean;
}

export interface RolePermission {
  role: UserRole;
  schoolIds: string[];
  modules: Record<string, ModulePermissions>;
}

export interface SchoolStaff {
  id: string;
  name: string;
  role: UserRole;
  password: string;
  personalCode: string;
  schoolId: string;
  schoolName?: string;
}

export interface AccessControl {
  passwords: {
    admin: string;
    secretary: string;
    schools: Record<string, string>;
    managers: Record<string, string>;
  };
  restrictions: Record<string, UserRole[]>;
  granularPermissions: RolePermission[];
}

export interface PendingEnrollment {
  id: string;
  studentName: string;
  academicYear: string;
  grade: string;
  status: 'Pendente' | 'Em Análise';
}

export interface SchoolFunction {
  id: string;
  title: string;
  description: string;
  category: string;
  role: 'DIRECTOR_ESCOLAR' | 'DIRECTOR_PEDAGOGICO' | 'SECRETARIA';
  allowedRoles?: UserRole[];
}

export interface School {
  id: string;
  name: string;
  legalName: string;
  initials: string;
  type: string;
  taxId: string;
  location: string;
  address: string;
  foundationDate: string;
  legalRepresentative: string;
  pedagogicalDirector?: string;
  secretaryGeneral?: string;
  repContact: string;
  email: string;
  website: string;
  curriculum: string;
  languages: string;
  shifts: string;
  levels: string;
  studentsCount: number;
  staffCount: number;
  accreditationNumber: string;
  accreditationStatus: string;
  description: string;
  status: 'Active' | 'Under Maintenance' | 'Closing';
  image: string;
  functions?: SchoolFunction[];
  staff?: SchoolStaff[];
  classroomsCount?: number;
  labsCount?: number;
  contactPerson?: string;
  phone?: string;
  pendingEnrollments?: PendingEnrollment[];
}

export interface Student {
  id: string;
  name: string;
  email: string;
  grade: string;
  status: 'Active' | 'Inactive';
  enrollmentDate: string;
  avatar: string;
  scores?: Record<string, number>;
  schoolName: string; 
  pendingDocumentsCount?: number; 
  averageScore?: number; 
}

export interface ClassSchedule {
  id: string;
  subject: string;
  teacher: string;
  room: string;
  day: string;
  time: string;
  color: string;
}

export interface StaffMember {
  id: string;
  name: string;
  role: string;
  department: string;
  email: string;
  status: 'Active' | 'On Leave';
  avatar: string;
}

export interface Message {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

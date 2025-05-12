export type Role = 'student' | 'teacher' | 'parent' | 'principal';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatarUrl?: string;
}

export interface Student {
  id: string;
  userId: string;
  grade: number;
  classIds: string[];
  parentIds: string[];
}

export interface Parent {
  id: string;
  userId: string;
  studentIds: string[];
}

export interface Teacher {
  id: string;
  userId: string;
  classIds: string[];
  subjectIds: string[];
}

export interface Principal {
  id: string;
  userId: string;
  schoolId: string;
}

export interface Class {
  id: string;
  name: string;
  teacherId: string;
  studentIds: string[];
  subject: string;
  schedule: {
    day: string;
    startTime: string;
    endTime: string;
  }[];
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  classId: string;
  dueDate: string;
  createdAt: string;
  maxPoints: number;
}

export interface Submission {
  id: string;
  assignmentId: string;
  studentId: string;
  submittedAt: string;
  content: string;
  status: 'pending' | 'graded';
}

export interface Grade {
  id: string;
  studentId: string;
  assignmentId: string;
  points: number;
  feedback?: string;
  createdAt: string;
}

export interface Attendance {
  id: string;
  studentId: string;
  classId: string;
  date: string;
  status: 'present' | 'absent' | 'tardy' | 'excused';
}

export interface Message {
  id: string;
  senderId: string;
  recipientId: string;
  subject: string;
  content: string;
  read: boolean;
  createdAt: string;
}

export interface SchoolStats {
  totalStudents: number;
  totalTeachers: number;
  averageAttendance: number;
  averageGrade: number;
}

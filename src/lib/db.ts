import { v4 as uuidv4 } from 'uuid';
import { 
  User, Student, Parent, Teacher, Principal, 
  Class, Assignment, Submission, Grade, Attendance, Message 
} from '@/types';

// In-memory storage
class InMemoryDB {
  private users: Map<string, User> = new Map();
  private students: Map<string, Student> = new Map();
  private parents: Map<string, Parent> = new Map();
  private teachers: Map<string, Teacher> = new Map();
  private principals: Map<string, Principal> = new Map();
  private classes: Map<string, Class> = new Map();
  private assignments: Map<string, Assignment> = new Map();
  private submissions: Map<string, Submission> = new Map();
  private grades: Map<string, Grade> = new Map();
  private attendance: Map<string, Attendance> = new Map();
  private messages: Map<string, Message> = new Map();
  
  // Initialization with sample data for development
  constructor() {
    // Create seed data for initial login and testing
    this.createSeedData();
  }

  private createSeedData() {
    // Create some users with different roles
    const adminUser: User = {
      id: uuidv4(),
      name: 'Admin',
      email: 'admin@school.edu',
      role: 'principal',
      avatarUrl: '/avatar-placeholder.svg'
    };
    
    const teacherUser: User = {
      id: uuidv4(),
      name: 'Teacher',
      email: 'teacher@school.edu',
      role: 'teacher',
      avatarUrl: '/avatar-placeholder.svg'
    };
    
    const studentUser: User = {
      id: uuidv4(),
      name: 'Student',
      email: 'student@school.edu',
      role: 'student',
      avatarUrl: '/avatar-placeholder.svg'
    };
    
    const parentUser: User = {
      id: uuidv4(),
      name: 'Parent',
      email: 'parent@school.edu',
      role: 'parent',
      avatarUrl: '/avatar-placeholder.svg'
    };

    // Add users to database
    this.users.set(adminUser.id, adminUser);
    this.users.set(teacherUser.id, teacherUser);
    this.users.set(studentUser.id, studentUser);
    this.users.set(parentUser.id, parentUser);

    // Create role-specific records
    const principal: Principal = {
      id: uuidv4(),
      userId: adminUser.id,
      schoolId: 'school-1'
    };

    const teacher: Teacher = {
      id: uuidv4(),
      userId: teacherUser.id,
      classIds: [],
      subjectIds: ['math', 'science']
    };

    const student: Student = {
      id: uuidv4(),
      userId: studentUser.id,
      grade: 10,
      classIds: [],
      parentIds: []
    };

    const parent: Parent = {
      id: uuidv4(),
      userId: parentUser.id,
      studentIds: [student.id]
    };

    // Update relationships
    student.parentIds.push(parent.id);

    // Add role records to database
    this.principals.set(principal.id, principal);
    this.teachers.set(teacher.id, teacher);
    this.students.set(student.id, student);
    this.parents.set(parent.id, parent);

    // Create a class
    const classRecord: Class = {
      id: uuidv4(),
      name: 'Mathematics 101',
      teacherId: teacher.id,
      studentIds: [student.id],
      subject: 'Mathematics',
      schedule: [
        { day: 'Monday', startTime: '09:00', endTime: '10:30' },
        { day: 'Wednesday', startTime: '09:00', endTime: '10:30' }
      ]
    };

    // Update relationships
    teacher.classIds.push(classRecord.id);
    student.classIds.push(classRecord.id);

    // Add class to database
    this.classes.set(classRecord.id, classRecord);

    // Create assignments
    const assignment: Assignment = {
      id: uuidv4(),
      title: 'Algebra Basics',
      description: 'Complete problems 1-10 in Chapter 3',
      classId: classRecord.id,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
      maxPoints: 100
    };

    this.assignments.set(assignment.id, assignment);

    // Create attendance records
    const attendance: Attendance = {
      id: uuidv4(),
      studentId: student.id,
      classId: classRecord.id,
      date: new Date().toISOString().split('T')[0],
      status: 'present'
    };

    this.attendance.set(attendance.id, attendance);

    // Create a message
    const message: Message = {
      id: uuidv4(),
      senderId: teacherUser.id,
      recipientId: parentUser.id,
      subject: 'Regarding upcoming parent-teacher meeting',
      content: 'I would like to discuss your child\'s progress in mathematics class.',
      read: false,
      createdAt: new Date().toISOString()
    };

    this.messages.set(message.id, message);
  }

  // User operations
  async getUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async getUserById(id: string): Promise<User | null> {
    return this.users.get(id) || null;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const users = Array.from(this.users.values());
    return users.find(user => user.email === email) || null;
  }

  async createUser(user: Omit<User, 'id'>): Promise<User> {
    const id = uuidv4();
    const newUser = { id, ...user };
    this.users.set(id, newUser);
    return newUser;
  }

  async updateUser(id: string, data: Partial<User>): Promise<User | null> {
    const user = this.users.get(id);
    if (!user) return null;
    
    const updatedUser = { ...user, ...data };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Student operations
  async getStudents(): Promise<(Student & { user: User })[]> {
    return Array.from(this.students.values()).map(student => ({
      ...student,
      user: this.users.get(student.userId)!
    }));
  }

  async getStudentById(id: string): Promise<(Student & { user: User }) | null> {
    const student = this.students.get(id);
    if (!student) return null;
    
    const user = this.users.get(student.userId);
    if (!user) return null;
    
    return { ...student, user };
  }

  async getStudentsByParentId(parentId: string): Promise<(Student & { user: User })[]> {
    const parent = this.parents.get(parentId);
    if (!parent) return [];
    
    return parent.studentIds
      .map(id => this.students.get(id))
      .filter((student): student is Student => student !== undefined)
      .map(student => ({
        ...student,
        user: this.users.get(student.userId)!
      }));
  }

  async getStudentsByClassId(classId: string): Promise<(Student & { user: User })[]> {
    const classRecord = this.classes.get(classId);
    if (!classRecord) return [];
    
    return classRecord.studentIds
      .map(id => this.students.get(id))
      .filter((student): student is Student => student !== undefined)
      .map(student => ({
        ...student,
        user: this.users.get(student.userId)!
      }));
  }

  // Class operations
  async getClasses(): Promise<Class[]> {
    return Array.from(this.classes.values());
  }

  async getClassById(id: string): Promise<Class | null> {
    return this.classes.get(id) || null;
  }

  async getClassesByTeacherId(teacherId: string): Promise<Class[]> {
    return Array.from(this.classes.values()).filter(c => c.teacherId === teacherId);
  }

  async getClassesByStudentId(studentId: string): Promise<Class[]> {
    return Array.from(this.classes.values()).filter(c => c.studentIds.includes(studentId));
  }

  // Assignment operations
  async getAssignments(): Promise<Assignment[]> {
    return Array.from(this.assignments.values());
  }

  async getAssignmentById(id: string): Promise<Assignment | null> {
    return this.assignments.get(id) || null;
  }

  async getAssignmentsByClassId(classId: string): Promise<Assignment[]> {
    return Array.from(this.assignments.values()).filter(a => a.classId === classId);
  }

  async createAssignment(assignment: Omit<Assignment, 'id' | 'createdAt'>): Promise<Assignment> {
    const id = uuidv4();
    const newAssignment = { 
      id, 
      ...assignment,
      createdAt: new Date().toISOString()
    };
    this.assignments.set(id, newAssignment);
    return newAssignment;
  }

  // Grade operations
  async getGrades(): Promise<Grade[]> {
    return Array.from(this.grades.values());
  }

  async getGradesByStudentId(studentId: string): Promise<Grade[]> {
    return Array.from(this.grades.values()).filter(g => g.studentId === studentId);
  }

  async getGradesByAssignmentId(assignmentId: string): Promise<Grade[]> {
    return Array.from(this.grades.values()).filter(g => g.assignmentId === assignmentId);
  }

  async createGrade(grade: Omit<Grade, 'id' | 'createdAt'>): Promise<Grade> {
    const id = uuidv4();
    const newGrade = { 
      id, 
      ...grade,
      createdAt: new Date().toISOString()
    };
    this.grades.set(id, newGrade);
    return newGrade;
  }

  // Attendance operations
  async getAttendance(): Promise<Attendance[]> {
    return Array.from(this.attendance.values());
  }

  async getAttendanceByStudentId(studentId: string): Promise<Attendance[]> {
    return Array.from(this.attendance.values()).filter(a => a.studentId === studentId);
  }

  async getAttendanceByClassId(classId: string): Promise<Attendance[]> {
    return Array.from(this.attendance.values()).filter(a => a.classId === classId);
  }

  async createAttendance(attendance: Omit<Attendance, 'id'>): Promise<Attendance> {
    const id = uuidv4();
    const newAttendance = { id, ...attendance };
    this.attendance.set(id, newAttendance);
    return newAttendance;
  }

  // Message operations
  async getMessages(): Promise<Message[]> {
    return Array.from(this.messages.values());
  }

  async getMessageById(id: string): Promise<Message | null> {
    return this.messages.get(id) || null;
  }

  async getMessagesBySenderId(senderId: string): Promise<Message[]> {
    return Array.from(this.messages.values()).filter(m => m.senderId === senderId);
  }

  async getMessagesByRecipientId(recipientId: string): Promise<Message[]> {
    return Array.from(this.messages.values()).filter(m => m.recipientId === recipientId);
  }

  async createMessage(message: Omit<Message, 'id' | 'createdAt' | 'read'>): Promise<Message> {
    const id = uuidv4();
    const newMessage = { 
      id, 
      ...message,
      read: false,
      createdAt: new Date().toISOString()
    };
    this.messages.set(id, newMessage);
    return newMessage;
  }

  async markMessageAsRead(id: string): Promise<Message | null> {
    const message = this.messages.get(id);
    if (!message) return null;
    
    const updatedMessage = { ...message, read: true };
    this.messages.set(id, updatedMessage);
    return updatedMessage;
  }

  // School stats
  async getSchoolStats(): Promise<{
    totalStudents: number;
    totalTeachers: number;
    averageAttendance: number;
    averageGrade: number;
  }> {
    const students = this.students.size;
    const teachers = this.teachers.size;
    
    // Calculate average attendance
    const attendanceRecords = Array.from(this.attendance.values());
    const presentCount = attendanceRecords.filter(a => 
      a.status === 'present' || a.status === 'tardy'
    ).length;
    const attendanceRate = attendanceRecords.length ? presentCount / attendanceRecords.length : 0;
    
    // Calculate average grade
    const grades = Array.from(this.grades.values());
    const totalPoints = grades.reduce((sum, grade) => sum + grade.points, 0);
    const averageGrade = grades.length ? totalPoints / grades.length : 0;
    
    return {
      totalStudents: students,
      totalTeachers: teachers,
      averageAttendance: attendanceRate * 100, // as percentage
      averageGrade
    };
  }
}

// Create a singleton instance
const db = new InMemoryDB();

export default db;

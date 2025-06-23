import fs from 'fs';
import path from 'path';
import type {
  User,
  UpsertUser,
  Assignment,
  InsertAssignment,
  Submission,
  InsertSubmission,
} from "@shared/schema";

const DATA_DIR = './data';
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const ASSIGNMENTS_FILE = path.join(DATA_DIR, 'assignments.json');
const SUBMISSIONS_FILE = path.join(DATA_DIR, 'submissions.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

interface MemoryData {
  users: User[];
  assignments: Assignment[];
  submissions: Submission[];
}

class MemoryStorage {
  private data: MemoryData = {
    users: [],
    assignments: [],
    submissions: []
  };

  constructor() {
    this.loadData();
    this.initializeDefaultData();
  }

  private loadData() {
    try {
      if (fs.existsSync(USERS_FILE)) {
        this.data.users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
      }
      if (fs.existsSync(ASSIGNMENTS_FILE)) {
        this.data.assignments = JSON.parse(fs.readFileSync(ASSIGNMENTS_FILE, 'utf8'));
      }
      if (fs.existsSync(SUBMISSIONS_FILE)) {
        this.data.submissions = JSON.parse(fs.readFileSync(SUBMISSIONS_FILE, 'utf8'));
      }
    } catch (error) {
      console.log('Loading data from files failed, starting with empty data');
    }
  }

  private saveData() {
    try {
      fs.writeFileSync(USERS_FILE, JSON.stringify(this.data.users, null, 2));
      fs.writeFileSync(ASSIGNMENTS_FILE, JSON.stringify(this.data.assignments, null, 2));
      fs.writeFileSync(SUBMISSIONS_FILE, JSON.stringify(this.data.submissions, null, 2));
    } catch (error) {
      console.error('Failed to save data:', error);
    }
  }

  private initializeDefaultData() {
    // Add default users if none exist
    if (this.data.users.length === 0) {
      const defaultUsers: User[] = [
        {
          id: 'teacher1',
          email: 'teacher@patancampus.edu.np',
          firstName: 'Ramesh',
          lastName: 'Sharma',
          password: 'password123',
          role: 'teacher',
          profileImageUrl: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'student1',
          email: 'niroj.thapa@student.patancampus.edu.np',
          firstName: 'Niroj',
          lastName: 'Thapa',
          password: 'password123',
          role: 'student',
          profileImageUrl: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'student2',
          email: 'bimal.paudel@student.patancampus.edu.np',
          firstName: 'Bimal',
          lastName: 'Paudel',
          password: 'password123',
          role: 'student',
          profileImageUrl: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'student3',
          email: 'priya.adhikari@student.patancampus.edu.np',
          firstName: 'Priya',
          lastName: 'Adhikari',
          password: 'password123',
          role: 'student',
          profileImageUrl: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      this.data.users = defaultUsers;
    }

    // Add default assignments if none exist
    if (this.data.assignments.length === 0) {
      const defaultAssignments: Assignment[] = [
        {
          id: 1,
          title: 'Database Design Project',
          description: 'Design and implement a complete database schema for a library management system. Include ER diagrams, normalization, and SQL queries.',
          subject: 'database-systems',
          dueDate: new Date('2025-01-15T23:59:00'),
          maxMarks: 100,
          submissionType: 'both',
          allowLateSubmission: true,
          teacherId: 'teacher1',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          title: 'Web Development Portfolio',
          description: 'Create a responsive portfolio website using HTML, CSS, and JavaScript. Must include at least 5 projects with descriptions.',
          subject: 'web-technology',
          dueDate: new Date('2025-01-20T23:59:00'),
          maxMarks: 80,
          submissionType: 'file',
          allowLateSubmission: false,
          teacherId: 'teacher1',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 3,
          title: 'Data Structures Implementation',
          description: 'Implement and compare the performance of different sorting algorithms (Bubble Sort, Quick Sort, Merge Sort) in C++.',
          subject: 'data-structures',
          dueDate: new Date('2025-01-10T23:59:00'),
          maxMarks: 90,
          submissionType: 'file',
          allowLateSubmission: true,
          teacherId: 'teacher1',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 4,
          title: 'Software Engineering Case Study',
          description: 'Analyze a real-world software project failure and propose solutions using SDLC methodologies.',
          subject: 'software-engineering',
          dueDate: new Date('2025-01-25T23:59:00'),
          maxMarks: 75,
          submissionType: 'text',
          allowLateSubmission: false,
          teacherId: 'teacher1',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      this.data.assignments = defaultAssignments;
    }

    // Add default submissions if none exist
    if (this.data.submissions.length === 0) {
      const defaultSubmissions: Submission[] = [
        {
          id: 1,
          assignmentId: 1,
          studentId: 'student1',
          submissionText: 'I have completed the database design for the library management system. The ER diagram includes entities for Books, Members, Authors, and Transactions. I have normalized the database to 3NF and created all necessary SQL queries for CRUD operations.',
          filePaths: [],
          comments: 'Please find the attached files with complete documentation.',
          submittedAt: new Date('2025-01-05T10:30:00'),
          grade: null,
          feedback: null,
          gradedAt: null,
        },
        {
          id: 2,
          assignmentId: 3,
          studentId: 'student2',
          submissionText: null,
          filePaths: [],
          comments: 'Implemented all three sorting algorithms with performance comparison charts.',
          submittedAt: new Date('2025-01-08T15:45:00'),
          grade: null,
          feedback: null,
          gradedAt: null,
        },
        {
          id: 3,
          assignmentId: 1,
          studentId: 'student3',
          submissionText: 'My library management database includes advanced features like reservation system and fine calculations. The schema supports multiple authors per book and tracks borrowing history.',
          filePaths: [],
          comments: 'Added bonus features for extra credit.',
          submittedAt: new Date('2025-01-12T09:15:00'),
          grade: null,
          feedback: null,
          gradedAt: null,
        },
      ];
      this.data.submissions = defaultSubmissions;
    }

    this.saveData();
  }

  // User operations
  async getUser(id: string): Promise<User | undefined> {
    return this.data.users.find(user => user.id === id);
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const existingIndex = this.data.users.findIndex(user => user.id === userData.id);
    
    const user: User = {
      ...userData,
      createdAt: existingIndex >= 0 ? this.data.users[existingIndex].createdAt : new Date(),
      updatedAt: new Date(),
    } as User;

    if (existingIndex >= 0) {
      this.data.users[existingIndex] = user;
    } else {
      this.data.users.push(user);
    }

    this.saveData();
    return user;
  }

  async getUserByEmailAndPassword(email: string, password: string): Promise<User | undefined> {
    return this.data.users.find(user => user.email === email && user.password === password);
  }

  // Assignment operations
  async getAssignments(userRole: string, userId: string): Promise<Assignment[]> {
    if (userRole === 'teacher') {
      return this.data.assignments.filter(assignment => assignment.teacherId === userId)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else {
      return this.data.assignments
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
  }

  async createAssignment(assignment: InsertAssignment & { teacherId: string }): Promise<Assignment> {
    const maxId = this.data.assignments.length > 0 
      ? Math.max(...this.data.assignments.map(a => a.id)) 
      : 0;
    
    const newAssignment: Assignment = {
      ...assignment,
      id: maxId + 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.data.assignments.push(newAssignment);
    this.saveData();
    return newAssignment;
  }

  async getAssignmentById(id: number): Promise<Assignment | undefined> {
    return this.data.assignments.find(assignment => assignment.id === id);
  }

  // Submission operations
  async getSubmissions(assignmentId: number, studentId?: string | null): Promise<Submission[]> {
    let submissions = this.data.submissions.filter(submission => submission.assignmentId === assignmentId);
    
    if (studentId) {
      submissions = submissions.filter(submission => submission.studentId === studentId);
    }
    
    return submissions.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
  }

  async createSubmission(submission: InsertSubmission): Promise<Submission> {
    const maxId = this.data.submissions.length > 0 
      ? Math.max(...this.data.submissions.map(s => s.id)) 
      : 0;
    
    const newSubmission: Submission = {
      ...submission,
      id: maxId + 1,
      submittedAt: new Date(),
      grade: null,
      feedback: null,
      gradedAt: null,
    };

    this.data.submissions.push(newSubmission);
    this.saveData();
    return newSubmission;
  }

  async getSubmissionByStudentAndAssignment(studentId: string, assignmentId: number): Promise<Submission | undefined> {
    return this.data.submissions.find(
      submission => submission.studentId === studentId && submission.assignmentId === assignmentId
    );
  }

  // Dashboard stats
  async getDashboardStats(userRole: string, userId: string): Promise<any> {
    if (userRole === 'teacher') {
      const teacherAssignments = this.data.assignments.filter(a => a.teacherId === userId);
      const assignmentIds = teacherAssignments.map(a => a.id);
      const allSubmissions = this.data.submissions.filter(s => assignmentIds.includes(s.assignmentId));
      const gradedSubmissions = allSubmissions.filter(s => s.grade !== null);

      return {
        total: teacherAssignments.length,
        submissions: allSubmissions.length,
        graded: gradedSubmissions.length,
        pending: allSubmissions.length - gradedSubmissions.length,
      };
    } else {
      const allAssignments = this.data.assignments;
      const userSubmissions = this.data.submissions.filter(s => s.studentId === userId);
      
      const now = new Date();
      const overdueAssignments = allAssignments.filter(assignment => {
        const isOverdue = new Date(assignment.dueDate) < now;
        const hasSubmission = userSubmissions.some(s => s.assignmentId === assignment.id);
        return isOverdue && !hasSubmission;
      });

      return {
        total: allAssignments.length,
        submitted: userSubmissions.length,
        pending: allAssignments.length - userSubmissions.length,
        overdue: overdueAssignments.length,
      };
    }
  }
}

export const memoryStorage = new MemoryStorage();
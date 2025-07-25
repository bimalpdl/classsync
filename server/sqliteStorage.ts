import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import type {
  User,
  UpsertUser,
  Assignment,
  InsertAssignment,
  Submission,
  InsertSubmission,
} from "@shared/schema";

const DATA_DIR = './data';
const DB_PATH = path.join(DATA_DIR, 'classsync.db');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

class SQLiteStorage {
  private db: Database.Database;

  constructor() {
    this.db = new Database(DB_PATH);
    this.initializeDatabase();
  }

  private initializeDatabase() {
    // Create tables if they don't exist
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        firstName TEXT,
        lastName TEXT,
        password TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'student',
        profileImageUrl TEXT,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS assignments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        subject TEXT NOT NULL,
        dueDate TEXT NOT NULL,
        maxMarks INTEGER NOT NULL,
        submissionType TEXT NOT NULL,
        allowLateSubmission BOOLEAN NOT NULL DEFAULT 0,
        teacherId TEXT NOT NULL,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        FOREIGN KEY (teacherId) REFERENCES users (id)
      );

      CREATE TABLE IF NOT EXISTS submissions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        assignmentId INTEGER NOT NULL,
        studentId TEXT NOT NULL,
        submissionText TEXT,
        filePaths TEXT NOT NULL DEFAULT '[]',
        comments TEXT,
        submittedAt TEXT NOT NULL,
        grade INTEGER,
        feedback TEXT,
        gradedAt TEXT,
        FOREIGN KEY (assignmentId) REFERENCES assignments (id),
        FOREIGN KEY (studentId) REFERENCES users (id)
      );

      CREATE INDEX IF NOT EXISTS idx_assignments_teacher ON assignments(teacherId);
      CREATE INDEX IF NOT EXISTS idx_submissions_assignment ON submissions(assignmentId);
      CREATE INDEX IF NOT EXISTS idx_submissions_student ON submissions(studentId);
    `);
  }

  // User operations
  async getUser(id: string): Promise<User | null> {
    const stmt = this.db.prepare('SELECT * FROM users WHERE id = ?');
    const user = stmt.get(id) as any;
    
    if (!user) return null;
    
    return {
      ...user,
      createdAt: new Date(user.createdAt),
      updatedAt: new Date(user.updatedAt),
    };
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const stmt = this.db.prepare('SELECT * FROM users WHERE email = ?');
    const user = stmt.get(email) as any;
    
    if (!user) return null;
    
    return {
      ...user,
      createdAt: new Date(user.createdAt),
      updatedAt: new Date(user.updatedAt),
    };
  }

  async createUser(user: UpsertUser): Promise<User> {
    const now = new Date().toISOString();
    const stmt = this.db.prepare(`
      INSERT INTO users (id, email, firstName, lastName, password, role, profileImageUrl, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    const result = stmt.run(
      user.id,
      user.email,
      user.firstName || null,
      user.lastName || null,
      user.password,
      user.role || 'student',
      user.profileImageUrl || null,
      now,
      now
    );
    
    return this.getUser(user.id) as Promise<User>;
  }

  async updateUser(id: string, updates: Partial<UpsertUser>): Promise<User | null> {
    const user = await this.getUser(id);
    if (!user) return null;

    const now = new Date().toISOString();
    const stmt = this.db.prepare(`
      UPDATE users 
      SET email = ?, firstName = ?, lastName = ?, password = ?, role = ?, profileImageUrl = ?, updatedAt = ?
      WHERE id = ?
    `);
    
    stmt.run(
      updates.email || user.email,
      updates.firstName || user.firstName,
      updates.lastName || user.lastName,
      updates.password || user.password,
      updates.role || user.role,
      updates.profileImageUrl || user.profileImageUrl,
      now,
      id
    );
    
    return this.getUser(id);
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const existingUser = await this.getUser(userData.id);
    
    if (existingUser) {
      // Update existing user
      return this.updateUser(userData.id, userData) as Promise<User>;
    } else {
      // Create new user
      return this.createUser(userData);
    }
  }

  async getUserByEmailAndPassword(email: string, password: string): Promise<User | null> {
    const stmt = this.db.prepare('SELECT * FROM users WHERE email = ? AND password = ?');
    const user = stmt.get(email, password) as any;
    
    if (!user) return null;
    
    return {
      ...user,
      createdAt: new Date(user.createdAt),
      updatedAt: new Date(user.updatedAt),
    };
  }

  // Assignment operations
  async getAssignments(userRole: string, userId: string): Promise<Assignment[]> {
    let stmt: Database.Statement;
    
    if (userRole === 'teacher') {
      stmt = this.db.prepare('SELECT * FROM assignments WHERE teacherId = ? ORDER BY createdAt DESC');
    } else {
      stmt = this.db.prepare('SELECT * FROM assignments ORDER BY createdAt DESC');
    }
    
    const assignments = stmt.all(userRole === 'teacher' ? userId : []) as any[];
    
    return assignments.map(assignment => ({
      ...assignment,
      dueDate: new Date(assignment.dueDate),
      createdAt: new Date(assignment.createdAt),
      updatedAt: new Date(assignment.updatedAt),
    }));
  }

  async getAssignmentById(id: number): Promise<Assignment | null> {
    const stmt = this.db.prepare('SELECT * FROM assignments WHERE id = ?');
    const assignment = stmt.get(id) as any;
    
    if (!assignment) return null;
    
    return {
      ...assignment,
      dueDate: new Date(assignment.dueDate),
      createdAt: new Date(assignment.createdAt),
      updatedAt: new Date(assignment.updatedAt),
    };
  }

  async createAssignment(assignment: InsertAssignment & { teacherId: string }): Promise<Assignment> {
    const now = new Date().toISOString();
    const stmt = this.db.prepare(`
      INSERT INTO assignments (title, description, subject, dueDate, maxMarks, submissionType, allowLateSubmission, teacherId, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    const result = stmt.run(
      assignment.title,
      assignment.description || null,
      assignment.subject,
      assignment.dueDate.toISOString(),
      assignment.maxMarks,
      assignment.submissionType,
      assignment.allowLateSubmission ? 1 : 0,
      assignment.teacherId,
      now,
      now
    );
    
    return this.getAssignmentById(result.lastInsertRowid as number) as Promise<Assignment>;
  }

  async updateAssignment(id: number, updates: Partial<InsertAssignment>): Promise<Assignment | null> {
    const assignment = await this.getAssignmentById(id);
    if (!assignment) return null;

    const now = new Date().toISOString();
    const stmt = this.db.prepare(`
      UPDATE assignments 
      SET title = ?, description = ?, subject = ?, dueDate = ?, maxMarks = ?, submissionType = ?, allowLateSubmission = ?, updatedAt = ?
      WHERE id = ?
    `);
    
    stmt.run(
      updates.title || assignment.title,
      updates.description !== undefined ? updates.description : assignment.description,
      updates.subject || assignment.subject,
      updates.dueDate ? updates.dueDate.toISOString() : assignment.dueDate.toISOString(),
      updates.maxMarks || assignment.maxMarks,
      updates.submissionType || assignment.submissionType,
      updates.allowLateSubmission !== undefined ? (updates.allowLateSubmission ? 1 : 0) : (assignment.allowLateSubmission ? 1 : 0),
      now,
      id
    );
    
    return this.getAssignmentById(id);
  }

  async deleteAssignment(id: number): Promise<boolean> {
    const stmt = this.db.prepare('DELETE FROM assignments WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  }

  // Submission operations
  async getSubmissions(assignmentId: number, studentId?: string): Promise<Submission[]> {
    let stmt: Database.Statement;
    
    if (studentId) {
      stmt = this.db.prepare('SELECT * FROM submissions WHERE assignmentId = ? AND studentId = ? ORDER BY submittedAt DESC');
    } else {
      stmt = this.db.prepare('SELECT * FROM submissions WHERE assignmentId = ? ORDER BY submittedAt DESC');
    }
    
    const submissions = stmt.all(studentId ? [assignmentId, studentId] : [assignmentId]) as any[];
    
    return submissions.map(submission => ({
      ...submission,
      filePaths: JSON.parse(submission.filePaths || '[]'),
      submittedAt: new Date(submission.submittedAt),
      gradedAt: submission.gradedAt ? new Date(submission.gradedAt) : null,
    }));
  }

  async getSubmissionByStudentAndAssignment(studentId: string, assignmentId: number): Promise<Submission | null> {
    const stmt = this.db.prepare('SELECT * FROM submissions WHERE studentId = ? AND assignmentId = ?');
    const submission = stmt.get(studentId, assignmentId) as any;
    
    if (!submission) return null;
    
    return {
      ...submission,
      filePaths: JSON.parse(submission.filePaths || '[]'),
      submittedAt: new Date(submission.submittedAt),
      gradedAt: submission.gradedAt ? new Date(submission.gradedAt) : null,
    };
  }

  async createSubmission(submission: InsertSubmission): Promise<Submission> {
    const now = new Date().toISOString();
    const stmt = this.db.prepare(`
      INSERT INTO submissions (assignmentId, studentId, submissionText, filePaths, comments, submittedAt)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    
    const result = stmt.run(
      submission.assignmentId,
      submission.studentId,
      submission.submissionText || null,
      JSON.stringify(submission.filePaths || []),
      submission.comments || null,
      now
    );
    
    return this.getSubmissionById(result.lastInsertRowid as number) as Promise<Submission>;
  }

  async getSubmissionById(id: number): Promise<Submission | null> {
    const stmt = this.db.prepare('SELECT * FROM submissions WHERE id = ?');
    const submission = stmt.get(id) as any;
    
    if (!submission) return null;
    
    return {
      ...submission,
      filePaths: JSON.parse(submission.filePaths || '[]'),
      submittedAt: new Date(submission.submittedAt),
      gradedAt: submission.gradedAt ? new Date(submission.gradedAt) : null,
    };
  }

  async updateSubmissionGrade(id: number, grade: number, feedback: string): Promise<Submission | null> {
    const now = new Date().toISOString();
    const stmt = this.db.prepare(`
      UPDATE submissions 
      SET grade = ?, feedback = ?, gradedAt = ?
      WHERE id = ?
    `);
    
    const result = stmt.run(grade, feedback, now, id);
    
    if (result.changes === 0) return null;
    
    return this.getSubmissionById(id);
  }

  // Dashboard stats
  async getDashboardStats(userRole: string, userId: string): Promise<any> {
    if (userRole === 'teacher') {
      // Get teacher's assignments
      const teacherAssignmentsStmt = this.db.prepare('SELECT COUNT(*) as count FROM assignments WHERE teacherId = ?');
      const teacherAssignments = teacherAssignmentsStmt.get(userId) as any;
      
      // Get all submissions for teacher's assignments
      const submissionsStmt = this.db.prepare(`
        SELECT COUNT(*) as count 
        FROM submissions s 
        JOIN assignments a ON s.assignmentId = a.id 
        WHERE a.teacherId = ?
      `);
      const allSubmissions = submissionsStmt.get(userId) as any;
      
      // Get graded submissions
      const gradedStmt = this.db.prepare(`
        SELECT COUNT(*) as count 
        FROM submissions s 
        JOIN assignments a ON s.assignmentId = a.id 
        WHERE a.teacherId = ? AND s.grade IS NOT NULL
      `);
      const gradedSubmissions = gradedStmt.get(userId) as any;

      return {
        total: teacherAssignments.count,
        submissions: allSubmissions.count,
        graded: gradedSubmissions.count,
        pending: allSubmissions.count - gradedSubmissions.count,
      };
    } else {
      // Get all assignments
      const totalStmt = this.db.prepare('SELECT COUNT(*) as count FROM assignments');
      const total = totalStmt.get() as any;
      
      // Get user's submissions
      const submittedStmt = this.db.prepare('SELECT COUNT(*) as count FROM submissions WHERE studentId = ?');
      const submitted = submittedStmt.get(userId) as any;
      
      // Get overdue assignments (due date passed and no submission)
      const overdueStmt = this.db.prepare(`
        SELECT COUNT(*) as count 
        FROM assignments a 
        WHERE a.dueDate < ? 
        AND a.id NOT IN (
          SELECT assignmentId FROM submissions WHERE studentId = ?
        )
      `);
      const now = new Date().toISOString();
      const overdue = overdueStmt.get(now, userId) as any;

      return {
        total: total.count,
        submitted: submitted.count,
        pending: total.count - submitted.count,
        overdue: overdue.count,
      };
    }
  }

  // Migration helper
  async migrateFromJSON() {
    console.log('Starting migration from JSON files...');
    
    // Migrate users
    const usersPath = path.join(DATA_DIR, 'users.json');
    if (fs.existsSync(usersPath)) {
      const users = JSON.parse(fs.readFileSync(usersPath, 'utf8'));
      for (const user of users) {
        try {
          await this.createUser(user);
        } catch (error) {
          console.log(`User ${user.email} already exists, skipping...`);
        }
      }
      console.log(`Migrated ${users.length} users`);
    }

    // Migrate assignments
    const assignmentsPath = path.join(DATA_DIR, 'assignments.json');
    if (fs.existsSync(assignmentsPath)) {
      const assignments = JSON.parse(fs.readFileSync(assignmentsPath, 'utf8'));
      for (const assignment of assignments) {
        try {
          await this.createAssignment({
            ...assignment,
            dueDate: new Date(assignment.dueDate),
            allowLateSubmission: assignment.allowLateSubmission || false,
          });
        } catch (error) {
          console.log(`Assignment ${assignment.title} already exists, skipping...`);
        }
      }
      console.log(`Migrated ${assignments.length} assignments`);
    }

    // Migrate submissions
    const submissionsPath = path.join(DATA_DIR, 'submissions.json');
    if (fs.existsSync(submissionsPath)) {
      const submissions = JSON.parse(fs.readFileSync(submissionsPath, 'utf8'));
      for (const submission of submissions) {
        try {
          await this.createSubmission({
            ...submission,
            submittedAt: new Date(submission.submittedAt),
            filePaths: submission.filePaths || [],
          });
        } catch (error) {
          console.log(`Submission ${submission.id} already exists, skipping...`);
        }
      }
      console.log(`Migrated ${submissions.length} submissions`);
    }

    console.log('Migration completed successfully!');
  }

  // Close database connection
  close() {
    this.db.close();
  }
}

export default SQLiteStorage; 
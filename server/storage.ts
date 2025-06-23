import {
  users,
  assignments,
  submissions,
  type User,
  type UpsertUser,
  type Assignment,
  type InsertAssignment,
  type Submission,
  type InsertSubmission,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, count, sql } from "drizzle-orm";

export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Assignment operations
  getAssignments(userRole: string, userId: string): Promise<Assignment[]>;
  createAssignment(assignment: InsertAssignment & { teacherId: string }): Promise<Assignment>;
  getAssignmentById(id: number): Promise<Assignment | undefined>;
  
  // Submission operations
  getSubmissions(assignmentId: number, studentId?: string | null): Promise<Submission[]>;
  createSubmission(submission: InsertSubmission): Promise<Submission>;
  getSubmissionByStudentAndAssignment(studentId: string, assignmentId: number): Promise<Submission | undefined>;
  
  // Dashboard stats
  getDashboardStats(userRole: string, userId: string): Promise<any>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async getAssignments(userRole: string, userId: string): Promise<Assignment[]> {
    if (userRole === 'teacher') {
      return await db
        .select()
        .from(assignments)
        .where(eq(assignments.teacherId, userId))
        .orderBy(desc(assignments.createdAt));
    } else {
      // For students, get all assignments
      return await db
        .select()
        .from(assignments)
        .orderBy(desc(assignments.createdAt));
    }
  }

  async createAssignment(assignment: InsertAssignment & { teacherId: string }): Promise<Assignment> {
    const [newAssignment] = await db
      .insert(assignments)
      .values(assignment)
      .returning();
    return newAssignment;
  }

  async getAssignmentById(id: number): Promise<Assignment | undefined> {
    const [assignment] = await db
      .select()
      .from(assignments)
      .where(eq(assignments.id, id));
    return assignment;
  }

  async getSubmissions(assignmentId: number, studentId?: string | null): Promise<Submission[]> {
    if (studentId) {
      return await db.select().from(submissions).where(and(
        eq(submissions.assignmentId, assignmentId),
        eq(submissions.studentId, studentId)
      ));
    }
    
    return await db.select().from(submissions)
      .where(eq(submissions.assignmentId, assignmentId))
      .orderBy(desc(submissions.submittedAt));
  }

  async createSubmission(submission: InsertSubmission): Promise<Submission> {
    const [newSubmission] = await db
      .insert(submissions)
      .values(submission)
      .returning();
    return newSubmission;
  }

  async getSubmissionByStudentAndAssignment(studentId: string, assignmentId: number): Promise<Submission | undefined> {
    const [submission] = await db
      .select()
      .from(submissions)
      .where(and(
        eq(submissions.studentId, studentId),
        eq(submissions.assignmentId, assignmentId)
      ));
    return submission;
  }

  async getDashboardStats(userRole: string, userId: string): Promise<any> {
    if (userRole === 'teacher') {
      // Stats for teachers
      const [totalAssignments] = await db
        .select({ count: count() })
        .from(assignments)
        .where(eq(assignments.teacherId, userId));

      const [totalSubmissions] = await db
        .select({ count: count() })
        .from(submissions)
        .innerJoin(assignments, eq(submissions.assignmentId, assignments.id))
        .where(eq(assignments.teacherId, userId));

      const [gradedSubmissions] = await db
        .select({ count: count() })
        .from(submissions)
        .innerJoin(assignments, eq(submissions.assignmentId, assignments.id))
        .where(and(
          eq(assignments.teacherId, userId),
          sql`${submissions.grade} IS NOT NULL`
        ));

      return {
        total: totalAssignments.count,
        submissions: totalSubmissions.count,
        graded: gradedSubmissions.count,
        pending: totalSubmissions.count - gradedSubmissions.count,
      };
    } else {
      // Stats for students
      const [totalAssignments] = await db
        .select({ count: count() })
        .from(assignments);

      const [submittedAssignments] = await db
        .select({ count: count() })
        .from(submissions)
        .where(eq(submissions.studentId, userId));

      const [overdueAssignments] = await db
        .select({ count: count() })
        .from(assignments)
        .leftJoin(submissions, and(
          eq(submissions.assignmentId, assignments.id),
          eq(submissions.studentId, userId)
        ))
        .where(and(
          sql`${assignments.dueDate} < NOW()`,
          sql`${submissions.id} IS NULL`
        ));

      return {
        total: totalAssignments.count,
        submitted: submittedAssignments.count,
        pending: totalAssignments.count - submittedAssignments.count,
        overdue: overdueAssignments.count,
      };
    }
  }
}

export const storage = new DatabaseStorage();

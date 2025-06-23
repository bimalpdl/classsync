import { z } from "zod";

// User types
export interface User {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  password?: string;
  role?: string;
  profileImageUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface UpsertUser {
  id: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  password?: string;
  role?: string;
  profileImageUrl?: string | null;
}

// Assignment types
export interface Assignment {
  id: number;
  title: string;
  description: string | null;
  subject: string;
  dueDate: Date;
  maxMarks: number;
  submissionType: string; // 'file', 'text', 'both'
  allowLateSubmission: boolean;
  teacherId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface InsertAssignment {
  title: string;
  description?: string | null;
  subject: string;
  dueDate: Date;
  maxMarks: number;
  submissionType: string;
  allowLateSubmission?: boolean;
}

// Submission types
export interface Submission {
  id: number;
  assignmentId: number;
  studentId: string;
  submissionText: string | null;
  filePaths: string[];
  comments: string | null;
  submittedAt: Date;
  grade: number | null;
  feedback: string | null;
  gradedAt: Date | null;
}

export interface InsertSubmission {
  assignmentId: number;
  studentId: string;
  submissionText?: string | null;
  filePaths?: string[];
  comments?: string | null;
}

// Validation schemas
export const insertAssignmentSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  subject: z.string().min(1),
  dueDate: z.string().transform(str => new Date(str)),
  maxMarks: z.number().min(1),
  submissionType: z.enum(['file', 'text', 'both']),
  allowLateSubmission: z.boolean().optional().default(false),
});

export const insertSubmissionSchema = z.object({
  assignmentId: z.number(),
  studentId: z.string(),
  submissionText: z.string().optional(),
  filePaths: z.array(z.string()).optional().default([]),
  comments: z.string().optional(),
});

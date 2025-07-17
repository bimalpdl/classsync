import type { Express, Request } from "express";
import { createServer, type Server } from "http";
import { memoryStorage as storage } from "./memoryStorage";
import { setupAuth } from "./replitAuth";
import { insertAssignmentSchema, insertSubmissionSchema, insertUserSchema } from "@shared/schema";
import multer from "multer";

import fs from "fs";

const upload = multer({
  dest: "uploads/",
  limits: {
    fileSize: 25 * 1024 * 1024, // 25MB limit
  },
});

interface AuthenticatedRequest extends Request {
  user?: any;
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // User registration endpoint
  app.post('/api/register', async (req, res) => {
    try {
      const data = insertUserSchema.parse(req.body);
      // Check for duplicate email
      const existing = await storage.getUserByEmail(data.email);
      if (existing) {
        return res.status(409).json({ message: 'User with this email already exists' });
      }
      // Generate a unique user id
      const userId = `${data.role}-${Date.now()}`;
      const user = await storage.upsertUser({
        id: userId,
        email: data.email,
        password: data.password,
        role: data.role,
        firstName: data.firstName,
        lastName: data.lastName,
        profileImageUrl: null,
      });
      // Remove password from response
      const { password, ...userWithoutPassword } = user;
      res.status(201).json(userWithoutPassword);
    } catch (error: any) {
      res.status(400).json({ message: 'Invalid registration data', error: error.message });
    }
  });

  // Simple login for testing
  app.post('/api/simple-login', async (req, res) => {
    try {
      const { email, password } = req.body;
      
      const user = await storage.getUserByEmailAndPassword(email, password);
      if (user) {
        (req.session as any).userId = user.id;
        res.json({ success: true, user });
      } else {
        res.status(401).json({ message: "Invalid credentials" });
      }
    } catch (error) {
      res.status(500).json({ message: "Login failed" });
    }
  });

  // Unified logout endpoint for both OIDC and session users
  app.post('/api/logout', async (req, res) => {
    // Helper to send a consistent JSON response
    const sendSuccess = () => res.json({ success: true });
    const sendError = (message: string) => res.status(500).json({ success: false, message });

    // Passport/oidc logout (if available)
    if (typeof req.logout === 'function') {
      try {
        // Passport 0.6+ supports async/callback logout
        await new Promise<void>((resolve, reject) => {
          req.logout((err: any) => {
            if (err) return reject(err);
            resolve();
          });
        });
      } catch (err: any) {
        return sendError('OIDC logout failed');
      }
    }

    // Destroy session (for both OIDC and simple login)
    if (req.session) {
      req.session.destroy((err) => {
        if (err) return sendError('Session destruction failed');
        sendSuccess();
      });
    } else {
      sendSuccess();
    }
  });

  // Ensure uploads directory exists
  if (!fs.existsSync("uploads")) {
    fs.mkdirSync("uploads", { recursive: true });
  }

  // Auth routes
  app.get('/api/auth/user', async (req: AuthenticatedRequest, res) => {
    try {
      // Check session first
      if ((req.session as any).userId) {
        const user = await storage.getUser((req.session as any).userId);
        if (user) {
          return res.json(user);
        }
      }
      
      // Fallback to Replit auth
      if (req.user?.claims?.sub) {
        const user = await storage.getUser(req.user.claims.sub);
        if (user) {
          return res.json(user);
        }
      }
      
      res.status(401).json({ message: "Unauthorized" });
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Assignment routes
  app.get('/api/assignments', async (req: AuthenticatedRequest, res) => {
    try {
      let userId = (req.session as any).userId || req.user?.claims?.sub;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const assignments = await storage.getAssignments(user.role || 'student', userId);
      res.json(assignments);
    } catch (error) {
      console.error("Error fetching assignments:", error);
      res.status(500).json({ message: "Failed to fetch assignments" });
    }
  });

  app.post('/api/assignments', upload.array('files'), async (req: AuthenticatedRequest, res) => {
    try {
      let userId = (req.session as any).userId || req.user?.claims?.sub;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const user = await storage.getUser(userId);
      if (!user || user.role !== 'teacher') {
        return res.status(403).json({ message: "Only teachers can create assignments" });
      }

      const validatedData = insertAssignmentSchema.parse({
        ...req.body,
        dueDate: new Date(req.body.dueDate),
        maxMarks: parseInt(req.body.maxMarks),
        allowLateSubmission: req.body.allowLateSubmission === 'true',
      });

      const assignment = await storage.createAssignment({
        ...validatedData,
        teacherId: userId,
      });

      res.status(201).json(assignment);
    } catch (error) {
      console.error("Error creating assignment:", error);
      res.status(500).json({ message: "Failed to create assignment" });
    }
  });

  app.get('/api/assignments/:id', async (req: AuthenticatedRequest, res) => {
    try {
      const assignmentId = parseInt(req.params.id);
      const assignment = await storage.getAssignmentById(assignmentId);
      
      if (!assignment) {
        return res.status(404).json({ message: "Assignment not found" });
      }

      res.json(assignment);
    } catch (error) {
      console.error("Error fetching assignment:", error);
      res.status(500).json({ message: "Failed to fetch assignment" });
    }
  });

  // Submission routes
  app.get('/api/assignments/:id/submissions', async (req: AuthenticatedRequest, res) => {
    try {
      let userId = (req.session as any).userId || req.user?.claims?.sub;
      const assignmentId = parseInt(req.params.id);
      
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const submissions = await storage.getSubmissions(assignmentId, user.role === 'teacher' ? null : userId);
      res.json(submissions);
    } catch (error) {
      console.error("Error fetching submissions:", error);
      res.status(500).json({ message: "Failed to fetch submissions" });
    }
  });

  app.post('/api/assignments/:id/submit', upload.array('files'), async (req: AuthenticatedRequest, res) => {
    try {
      let userId = (req.session as any).userId || req.user?.claims?.sub;
      const assignmentId = parseInt(req.params.id);
      
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const user = await storage.getUser(userId);
      if (!user || user.role !== 'student') {
        return res.status(403).json({ message: "Only students can submit assignments" });
      }

      // Check if assignment exists
      const assignment = await storage.getAssignmentById(assignmentId);
      if (!assignment) {
        return res.status(404).json({ message: "Assignment not found" });
      }

      // Check if submission already exists
      const existingSubmission = await storage.getSubmissionByStudentAndAssignment(userId, assignmentId);
      if (existingSubmission) {
        return res.status(400).json({ message: "Assignment already submitted" });
      }

      const files = req.files as Express.Multer.File[];
      const filePaths = files?.map(file => file.path) || [];

      const validatedData = insertSubmissionSchema.parse({
        assignmentId,
        studentId: userId,
        submissionText: req.body.submissionText || null,
        comments: req.body.comments || null,
        filePaths: JSON.stringify(filePaths),
      });

      const submission = await storage.createSubmission(validatedData);
      res.status(201).json(submission);
    } catch (error) {
      console.error("Error submitting assignment:", error);
      res.status(500).json({ message: "Failed to submit assignment" });
    }
  });

  // Dashboard stats
  app.get('/api/dashboard/stats', async (req: AuthenticatedRequest, res) => {
    try {
      let userId = (req.session as any).userId || req.user?.claims?.sub;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const stats = await storage.getDashboardStats(user.role || 'student', userId);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

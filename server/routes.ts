import type { Express, Request } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertAssignmentSchema, insertSubmissionSchema } from "@shared/schema";
import multer from "multer";
import path from "path";
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

  // Simple login for testing
  app.post('/api/simple-login', async (req, res) => {
    try {
      const { email, password } = req.body;
      
      const user = await storage.getUserByEmailAndPassword(email, password);
      if (user) {
        req.session.userId = user.id;
        res.json({ success: true, user });
      } else {
        res.status(401).json({ message: "Invalid credentials" });
      }
    } catch (error) {
      res.status(500).json({ message: "Login failed" });
    }
  });

  // Simple logout
  app.post('/api/simple-logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        res.status(500).json({ message: "Logout failed" });
      } else {
        res.json({ success: true });
      }
    });
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

      const assignments = await storage.getAssignments(user.role, userId);
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

      const stats = await storage.getDashboardStats(user.role, userId);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

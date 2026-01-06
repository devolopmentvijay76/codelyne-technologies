import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { z } from "zod";
import bcrypt from "bcrypt";
import {
  insertEmployeeSchema,
  insertContactSubmissionSchema,
  insertContentSchema,
  type User,
} from "@shared/schema";
import { fromZodError } from "zod-validation-error";

// Extend Express Request to include user
declare global {
  namespace Express {
    interface User {
      id: string;
      username: string;
    }
  }
}

const SALT_ROUNDS = 10;

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// Configure Passport
passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await storage.getUserByUsername(username);
      if (!user) {
        return done(null, false, { message: "Incorrect username or password" });
      }

      const isValid = await verifyPassword(password, user.password);
      if (!isValid) {
        return done(null, false, { message: "Incorrect username or password" });
      }

      return done(null, { id: user.id, username: user.username });
    } catch (err) {
      return done(err);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await storage.getUser(id);
    if (!user) {
      return done(null, false);
    }
    done(null, { id: user.id, username: user.username });
  } catch (err) {
    done(err);
  }
});

// Middleware to check if user is authenticated
function isAuthenticated(req: any, res: any, next: any) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized" });
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Session setup
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "codelyne-secret-key-change-in-production",
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
      },
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());

  // Authentication routes
  app.post("/api/auth/login", (req, res, next) => {
    passport.authenticate("local", (err: any, user: Express.User | false, info: any) => {
      if (err) {
        return res.status(500).json({ message: "Internal server error" });
      }
      if (!user) {
        return res.status(401).json({ message: info?.message || "Login failed" });
      }
      req.login(user, (err) => {
        if (err) {
          return res.status(500).json({ message: "Login failed" });
        }
        return res.json({ user: { id: user.id, username: user.username } });
      });
    })(req, res, next);
  });

  app.post("/api/auth/logout", (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ message: "Logout failed" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  app.get("/api/auth/check", (req, res) => {
    if (req.isAuthenticated()) {
      res.json({ authenticated: true, user: req.user });
    } else {
      res.json({ authenticated: false });
    }
  });

  // Employee routes (GET is public for About Us page, others are protected)
  app.get("/api/employees", async (req, res) => {
    try {
      const employees = await storage.getAllEmployees();
      res.json(employees);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch employees" });
    }
  });

  app.get("/api/employees/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const employee = await storage.getEmployee(id);
      if (!employee) {
        return res.status(404).json({ message: "Employee not found" });
      }
      res.json(employee);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch employee" });
    }
  });

  app.post("/api/employees", isAuthenticated, async (req, res) => {
    try {
      const validated = insertEmployeeSchema.parse(req.body);
      const employee = await storage.createEmployee(validated);
      res.status(201).json(employee);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: fromZodError(error).message });
      }
      res.status(500).json({ message: "Failed to create employee" });
    }
  });

  app.put("/api/employees/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validated = insertEmployeeSchema.parse(req.body);
      const employee = await storage.updateEmployee(id, validated);
      if (!employee) {
        return res.status(404).json({ message: "Employee not found" });
      }
      res.json(employee);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: fromZodError(error).message });
      }
      res.status(500).json({ message: "Failed to update employee" });
    }
  });

  app.delete("/api/employees/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteEmployee(id);
      if (!success) {
        return res.status(404).json({ message: "Employee not found" });
      }
      res.json({ message: "Employee deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete employee" });
    }
  });

  // Content routes (protected)
  app.get("/api/content", async (req, res) => {
    try {
      const allContent = await storage.getAllContent();
      res.json(allContent);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch content" });
    }
  });

  app.get("/api/content/:key", async (req, res) => {
    try {
      const content = await storage.getContentByKey(req.params.key);
      if (!content) {
        return res.status(404).json({ message: "Content not found" });
      }
      res.json(content);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch content" });
    }
  });

  app.post("/api/content", isAuthenticated, async (req, res) => {
    try {
      const validated = insertContentSchema.parse(req.body);
      const content = await storage.upsertContent(validated);
      res.json(content);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: fromZodError(error).message });
      }
      res.status(500).json({ message: "Failed to save content" });
    }
  });

  app.put("/api/content/:key", isAuthenticated, async (req, res) => {
    try {
      const { value } = req.body;
      if (!value || typeof value !== "string") {
        return res.status(400).json({ message: "Invalid value" });
      }
      const content = await storage.updateContentByKey(req.params.key, value);
      if (!content) {
        return res.status(404).json({ message: "Content not found" });
      }
      res.json(content);
    } catch (error) {
      res.status(500).json({ message: "Failed to update content" });
    }
  });

  // Contact submission routes
  app.post("/api/contact", async (req, res) => {
    try {
      const validated = insertContactSubmissionSchema.parse(req.body);
      const submission = await storage.createContactSubmission(validated);
      res.status(201).json(submission);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: fromZodError(error).message });
      }
      res.status(500).json({ message: "Failed to submit contact form" });
    }
  });

  app.get("/api/contact", isAuthenticated, async (req, res) => {
    try {
      const submissions = await storage.getAllContactSubmissions();
      res.json(submissions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch contact submissions" });
    }
  });

  app.delete("/api/contact/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteContactSubmission(id);
      if (!success) {
        return res.status(404).json({ message: "Submission not found" });
      }
      res.json({ message: "Submission deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete submission" });
    }
  });

  // Initialize default admin user if none exists
  (async () => {
    try {
      const existingUser = await storage.getUserByUsername("codelyne_admin");
      if (!existingUser) {
        const hashedPassword = await hashPassword("Codelyne@2025#Secure");
        await storage.createUser({
          username: "codelyne_admin",
          password: hashedPassword,
        });
        console.log("Default admin user created");
      }
    } catch (error) {
      console.error("Failed to create default admin user:", error);
    }
  })();

  return httpServer;
}

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
  insertProductSchema,
  updateDisplayOrderSchema,
  type User,
} from "@shared/schema";
import { fromZodError } from "zod-validation-error";
import { registerObjectStorageRoutes, ObjectStorageService, setObjectAclPolicy } from "./replit_integrations/object_storage";

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
  // Trust proxy for production (Replit uses reverse proxy)
  if (process.env.NODE_ENV === "production") {
    app.set("trust proxy", 1);
  }

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
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      },
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());

  // Register object storage routes for file uploads
  registerObjectStorageRoutes(app);

  // One-time setup endpoint for production database initialization
  app.post("/api/setup/init", async (req, res) => {
    try {
      const { setupKey } = req.body;
      const expectedKey = process.env.SETUP_KEY || "CodelyneProdSetup2025";
      if (setupKey !== expectedKey) {
        return res.status(403).json({ message: "Invalid setup key" });
      }

      // Check if already initialized
      const existingUsers = await storage.getUserByUsername("codelyne_admin");
      if (existingUsers) {
        return res.json({ message: "Already initialized", skipped: true });
      }

      // Create admin user
      const hashedPassword = await hashPassword("Codelyne@2025#Secure");
      await storage.createUser({
        username: "codelyne_admin",
        password: hashedPassword,
      });

      // Seed team data
      const teamData = [
        { name: "Atul Kadam", role: "Founder & CEO", department: "Executive", memberType: "founder", photoUrl: "/objects/uploads/1f2ea25f-1465-4d29-bc45-a312a9f3192b", description: "As the chief architect of AI-first platforms, Atul leads the long-term vision, innovation, and R&D at Codelyne. He specializes in designing scalable, secure, enterprise-grade architectures with deep expertise in AI, ML, full-stack development, and cloud systems.", quote: "Technology should not just automate tasks — it should think, learn, and evolve. At Codelyne, we engineer intelligence at the core.", focusAreas: "AI Architecture, Product Engineering, System Design, Innovation Strategy" },
        { name: "Hemant Nagrale", role: "Co-Founder & Strategic Advisor", department: "Executive", memberType: "founder", photoUrl: "/objects/uploads/d34a714b-abd8-4600-9a2a-d0d29343a692", description: "A distinguished 1987-batch IPS officer (Maharashtra cadre) and former Mumbai Police Commissioner, Hemant brings decades of leadership in governance and strategic decision-making. With degrees from VNIT Nagpur and JBIMS Mumbai, he guides Codelyne's long-term vision with disciplined execution and institutional expertise.", quote: "Discipline, governance, and strategic clarity are the pillars of building institutions that endure and excel.", focusAreas: "Strategic Leadership, Governance & Compliance, Institutional Building, Operational Excellence" },
        { name: "Nilima Shitole", role: "Co-Founder & Head of Management", department: "Executive", memberType: "founder", photoUrl: "/objects/uploads/159c2cd7-85d3-4752-99ad-4323231469c5", description: "Nilima leads organizational structure, HR strategy, and governance. She ensures operational excellence, compliance, and stability, building high-performance teams and scalable internal processes for long-term sustainability.", quote: "Strong systems require strong people, processes, and governance. Sustainable growth begins with disciplined execution.", focusAreas: "Organizational Management, Human Resources, Operations & Governance, Process Optimization" },
        { name: "Pratik Bingewar", role: "Project Manager", department: "Management", memberType: "management", photoUrl: "/objects/uploads/3e8e6336-8cb4-4550-8701-5f0c4e07faa5", description: "Leads project planning and delivery across engineering teams.", quote: "", focusAreas: "Project Management, Team Coordination" },
        { name: "Divya Sakatkar", role: "Lead Tester", department: "Management", memberType: "management", photoUrl: "/objects/uploads/2b080d75-32a8-4ff8-8c43-214f5992cd3c", description: "Ensures quality assurance and testing standards across all products.", quote: "", focusAreas: "Quality Assurance, Testing" },
        { name: "Rohit Sharma", role: "Software Engineer (Backend)", department: "Engineering", memberType: "engineer", photoUrl: "/objects/uploads/4db9a07e-379c-4fb9-acdd-cbbc305dddf9", description: "Specializes in backend development and API architecture.", quote: "", focusAreas: "Backend Development, API Design" },
        { name: "Vrushali Narkhede", role: "Software Engineer (Frontend)", department: "Engineering", memberType: "engineer", photoUrl: "/objects/uploads/74545f79-d161-4ee0-be72-e9bd41c01657", description: "Focuses on frontend development and user interface design.", quote: "", focusAreas: "Frontend Development, UI/UX" },
        { name: "Prithviraj Patil", role: "Software Engineer", department: "Engineering", memberType: "engineer", photoUrl: "/objects/uploads/67d40d45-1d73-49fa-98e6-3540a47cb4dc", description: "Full-stack software engineer contributing across the stack.", quote: "", focusAreas: "Full-Stack Development" },
        { name: "Shubham Khamitkar", role: "Admin", department: "Administration", memberType: "admin", photoUrl: "/objects/uploads/82f6f947-35be-4ec2-bb80-efaddf00fa06", description: "Handles administrative operations and office management.", quote: "", focusAreas: "Administration, Operations" },
      ];

      for (const member of teamData) {
        await storage.createEmployee(member);
      }

      res.json({ message: "Production database initialized successfully", created: teamData.length });
    } catch (error) {
      console.error("Setup error:", error);
      res.status(500).json({ message: "Setup failed" });
    }
  });

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

  // Public team endpoint for About Us page (sanitized data only)
  app.get("/api/public/team", async (req, res) => {
    try {
      const employees = await storage.getAllEmployees();
      const publicData = employees.map(e => ({
        id: e.id,
        name: e.name,
        role: e.role,
        department: e.department,
        memberType: e.memberType,
        photoUrl: e.photoUrl,
        description: e.description,
        quote: e.quote,
        focusAreas: e.focusAreas,
      }));
      res.json(publicData);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch team" });
    }
  });

  // Admin endpoint to fix all existing team photos (make them public)
  app.post("/api/admin/fix-photos", isAuthenticated, async (req, res) => {
    try {
      const objectStorageService = new ObjectStorageService();
      const employees = await storage.getAllEmployees();
      const results: { name: string; status: string }[] = [];

      for (const emp of employees) {
        if (emp.photoUrl && emp.photoUrl.startsWith("/objects/")) {
          try {
            const objectFile = await objectStorageService.getObjectEntityFile(emp.photoUrl);
            await setObjectAclPolicy(objectFile, {
              owner: "system",
              visibility: "public",
            });
            results.push({ name: emp.name, status: "fixed" });
          } catch (err) {
            results.push({ name: emp.name, status: "error" });
          }
        } else {
          results.push({ name: emp.name, status: "skipped" });
        }
      }

      res.json({ message: "Photos fixed", results });
    } catch (error) {
      res.status(500).json({ message: "Failed to fix photos" });
    }
  });

  // Employee routes (protected for admin)
  app.get("/api/employees", isAuthenticated, async (req, res) => {
    try {
      const employees = await storage.getAllEmployees();
      res.json(employees);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch employees" });
    }
  });

  // Update display order - must be before :id route
  app.put("/api/employees/reorder", isAuthenticated, async (req, res) => {
    try {
      const validated = updateDisplayOrderSchema.parse(req.body);
      const success = await storage.updateDisplayOrders(validated.orders);
      if (!success) {
        return res.status(500).json({ message: "Failed to update display order" });
      }
      res.json({ message: "Display order updated successfully" });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: fromZodError(error).message });
      }
      res.status(500).json({ message: "Failed to update display order" });
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

  // Product routes
  app.get("/api/products", async (req, res) => {
    try {
      const productList = await storage.getAllProducts();
      res.json(productList);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.post("/api/products", isAuthenticated, async (req, res) => {
    try {
      const validated = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(validated);
      res.status(201).json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: fromZodError(error).message });
      }
      res.status(500).json({ message: "Failed to create product" });
    }
  });

  app.put("/api/products/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validated = insertProductSchema.parse(req.body);
      const product = await storage.updateProduct(id, validated);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: fromZodError(error).message });
      }
      res.status(500).json({ message: "Failed to update product" });
    }
  });

  app.delete("/api/products/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteProduct(id);
      if (!success) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json({ message: "Product deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete product" });
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

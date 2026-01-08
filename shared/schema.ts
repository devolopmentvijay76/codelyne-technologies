import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, serial, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table for admin authentication
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Employees table for team management (includes founders and all team members)
export const employees = pgTable("employees", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  role: text("role").notNull(), // e.g., "Founder & CEO", "Co-Founder", "Software Engineer"
  department: text("department").notNull(), // Executive, Management, Engineering, Administration
  memberType: text("member_type").notNull().default("employee"), // founder, management, engineer, admin
  photoUrl: text("photo_url"), // URL or path to profile image
  description: text("description"), // Bio/description
  quote: text("quote"), // Optional quote for founders
  focusAreas: text("focus_areas"), // Comma-separated focus areas
  displayOrder: integer("display_order").default(0), // For ordering in display
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertEmployeeSchema = createInsertSchema(employees).omit({
  id: true,
  createdAt: true,
});

export const updateDisplayOrderSchema = z.object({
  orders: z.array(z.object({
    id: z.number(),
    displayOrder: z.number(),
  })),
});

export type InsertEmployee = z.infer<typeof insertEmployeeSchema>;
export type Employee = typeof employees.$inferSelect;

// Content table for vision/mission and other editable content
export const content = pgTable("content", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(), // e.g., 'vision', 'mission'
  value: text("value").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertContentSchema = createInsertSchema(content).omit({
  id: true,
  updatedAt: true,
});

export const updateContentSchema = createInsertSchema(content).pick({
  value: true,
});

export type InsertContent = z.infer<typeof insertContentSchema>;
export type UpdateContent = z.infer<typeof updateContentSchema>;
export type Content = typeof content.$inferSelect;

// Contact submissions table (enquiries and demo requests)
export const contactSubmissions = pgTable("contact_submissions", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  company: text("company"),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  type: text("type").notNull().default("enquiry"), // enquiry, demo
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertContactSubmissionSchema = createInsertSchema(contactSubmissions).omit({
  id: true,
  createdAt: true,
});

export type InsertContactSubmission = z.infer<typeof insertContactSubmissionSchema>;
export type ContactSubmission = typeof contactSubmissions.$inferSelect;

// Products table
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  tagline: text("tagline").notNull(),
  description: text("description").notNull(),
  features: text("features"), // Comma-separated features
  icon: text("icon"), // Icon name from lucide
  status: text("status").notNull().default("active"), // active, coming_soon, inactive
  displayOrder: integer("display_order").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
  createdAt: true,
});

export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;

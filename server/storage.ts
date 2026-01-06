// Reference: blueprint:javascript_database
import {
  users,
  employees,
  content,
  contactSubmissions,
  type User,
  type InsertUser,
  type Employee,
  type InsertEmployee,
  type Content,
  type InsertContent,
  type UpdateContent,
  type ContactSubmission,
  type InsertContactSubmission,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, asc } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Employee methods
  getAllEmployees(): Promise<Employee[]>;
  getEmployee(id: number): Promise<Employee | undefined>;
  createEmployee(employee: InsertEmployee): Promise<Employee>;
  updateEmployee(id: number, employee: InsertEmployee): Promise<Employee | undefined>;
  deleteEmployee(id: number): Promise<boolean>;
  updateDisplayOrders(orders: { id: number; displayOrder: number }[]): Promise<boolean>;

  // Content methods
  getContentByKey(key: string): Promise<Content | undefined>;
  getAllContent(): Promise<Content[]>;
  upsertContent(content: InsertContent): Promise<Content>;
  updateContentByKey(key: string, value: string): Promise<Content | undefined>;

  // Contact submission methods
  getAllContactSubmissions(): Promise<ContactSubmission[]>;
  createContactSubmission(submission: InsertContactSubmission): Promise<ContactSubmission>;
  deleteContactSubmission(id: number): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Employee methods
  async getAllEmployees(): Promise<Employee[]> {
    return await db.select().from(employees).orderBy(asc(employees.displayOrder), desc(employees.createdAt));
  }

  async getEmployee(id: number): Promise<Employee | undefined> {
    const [employee] = await db.select().from(employees).where(eq(employees.id, id));
    return employee || undefined;
  }

  async createEmployee(employee: InsertEmployee): Promise<Employee> {
    const [newEmployee] = await db.insert(employees).values(employee).returning();
    return newEmployee;
  }

  async updateEmployee(id: number, employee: InsertEmployee): Promise<Employee | undefined> {
    const [updated] = await db
      .update(employees)
      .set(employee)
      .where(eq(employees.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteEmployee(id: number): Promise<boolean> {
    const result = await db.delete(employees).where(eq(employees.id, id)).returning();
    return result.length > 0;
  }

  async updateDisplayOrders(orders: { id: number; displayOrder: number }[]): Promise<boolean> {
    try {
      for (const order of orders) {
        await db
          .update(employees)
          .set({ displayOrder: order.displayOrder })
          .where(eq(employees.id, order.id));
      }
      return true;
    } catch (error) {
      console.error("Error updating display orders:", error);
      return false;
    }
  }

  // Content methods
  async getContentByKey(key: string): Promise<Content | undefined> {
    const [contentItem] = await db.select().from(content).where(eq(content.key, key));
    return contentItem || undefined;
  }

  async getAllContent(): Promise<Content[]> {
    return await db.select().from(content);
  }

  async upsertContent(insertContent: InsertContent): Promise<Content> {
    const [contentItem] = await db
      .insert(content)
      .values(insertContent)
      .onConflictDoUpdate({
        target: content.key,
        set: { value: insertContent.value, updatedAt: new Date() },
      })
      .returning();
    return contentItem;
  }

  async updateContentByKey(key: string, value: string): Promise<Content | undefined> {
    const [updated] = await db
      .update(content)
      .set({ value, updatedAt: new Date() })
      .where(eq(content.key, key))
      .returning();
    return updated || undefined;
  }

  // Contact submission methods
  async getAllContactSubmissions(): Promise<ContactSubmission[]> {
    return await db.select().from(contactSubmissions).orderBy(desc(contactSubmissions.createdAt));
  }

  async createContactSubmission(submission: InsertContactSubmission): Promise<ContactSubmission> {
    const [newSubmission] = await db.insert(contactSubmissions).values(submission).returning();
    return newSubmission;
  }

  async deleteContactSubmission(id: number): Promise<boolean> {
    const result = await db.delete(contactSubmissions).where(eq(contactSubmissions.id, id)).returning();
    return result.length > 0;
  }
}

export const storage = new DatabaseStorage();

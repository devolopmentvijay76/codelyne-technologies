import {
  users,
  employees,
  content,
  contactSubmissions,
  clients,
  products,
  type User,
  type InsertUser,
  type Employee,
  type InsertEmployee,
  type Content,
  type InsertContent,
  type ContactSubmission,
  type InsertContactSubmission,
  type Client,
  type InsertClient,
  type Product,
  type InsertProduct,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, asc } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  getAllEmployees(): Promise<Employee[]>;
  getEmployee(id: number): Promise<Employee | undefined>;
  createEmployee(employee: InsertEmployee): Promise<Employee>;
  updateEmployee(id: number, employee: InsertEmployee): Promise<Employee | undefined>;
  deleteEmployee(id: number): Promise<boolean>;
  updateDisplayOrders(orders: { id: number; displayOrder: number }[]): Promise<boolean>;

  getContentByKey(key: string): Promise<Content | undefined>;
  getAllContent(): Promise<Content[]>;
  upsertContent(content: InsertContent): Promise<Content>;
  updateContentByKey(key: string, value: string): Promise<Content | undefined>;

  getAllContactSubmissions(): Promise<ContactSubmission[]>;
  createContactSubmission(submission: InsertContactSubmission): Promise<ContactSubmission>;
  deleteContactSubmission(id: number): Promise<boolean>;

  getAllClients(): Promise<Client[]>;
  createClient(client: InsertClient): Promise<Client>;
  updateClient(id: number, client: Partial<InsertClient>): Promise<Client | undefined>;
  deleteClient(id: number): Promise<boolean>;

  getAllProducts(): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: InsertProduct): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<boolean>;
  updateProductDisplayOrders(orders: { id: number; displayOrder: number }[]): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
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
    const [updated] = await db.update(employees).set(employee).where(eq(employees.id, id)).returning();
    return updated || undefined;
  }
  async deleteEmployee(id: number): Promise<boolean> {
    const result = await db.delete(employees).where(eq(employees.id, id)).returning();
    return result.length > 0;
  }
  async updateDisplayOrders(orders: { id: number; displayOrder: number }[]): Promise<boolean> {
    try {
      for (const order of orders) {
        await db.update(employees).set({ displayOrder: order.displayOrder }).where(eq(employees.id, order.id));
      }
      return true;
    } catch (error) {
      console.error("Error updating display orders:", error);
      return false;
    }
  }

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

  async getAllClients(): Promise<Client[]> {
    return await db.select().from(clients).orderBy(asc(clients.displayOrder), asc(clients.createdAt));
  }
  async createClient(client: InsertClient): Promise<Client> {
    const [newClient] = await db.insert(clients).values(client).returning();
    return newClient;
  }
  async updateClient(id: number, client: Partial<InsertClient>): Promise<Client | undefined> {
    const [updated] = await db.update(clients).set(client).where(eq(clients.id, id)).returning();
    return updated || undefined;
  }
  async deleteClient(id: number): Promise<boolean> {
    const result = await db.delete(clients).where(eq(clients.id, id)).returning();
    return result.length > 0;
  }

  async getAllProducts(): Promise<Product[]> {
    return await db.select().from(products).orderBy(asc(products.displayOrder), desc(products.createdAt));
  }
  async getProduct(id: number): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product || undefined;
  }
  async createProduct(product: InsertProduct): Promise<Product> {
    const [newProduct] = await db.insert(products).values(product).returning();
    return newProduct;
  }
  async updateProduct(id: number, product: InsertProduct): Promise<Product | undefined> {
    const [updated] = await db.update(products).set(product).where(eq(products.id, id)).returning();
    return updated || undefined;
  }
  async deleteProduct(id: number): Promise<boolean> {
    const result = await db.delete(products).where(eq(products.id, id)).returning();
    return result.length > 0;
  }
  async updateProductDisplayOrders(orders: { id: number; displayOrder: number }[]): Promise<boolean> {
    try {
      for (const order of orders) {
        await db.update(products).set({ displayOrder: order.displayOrder }).where(eq(products.id, order.id));
      }
      return true;
    } catch (error) {
      console.error("Error updating product display orders:", error);
      return false;
    }
  }
}

export const storage = new DatabaseStorage();

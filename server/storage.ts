import { users, products, type User, type InsertUser, type Product, type InsertProduct } from "@shared/schema";
import { db } from "./db";
import { eq, ilike, or } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getProducts(userId: number, searchQuery?: string): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  createProduct(product: InsertProduct, userId: number): Promise<Product>;
  updateProduct(id: number, product: Partial<InsertProduct>, userId: number): Promise<Product | undefined>;
  deleteProduct(id: number, userId: number): Promise<boolean>;
  
  sessionStore: session.SessionStore;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.SessionStore;

  constructor() {
    this.sessionStore = new PostgresSessionStore({ 
      pool, 
      createTableIfMissing: true 
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getProducts(userId: number, searchQuery?: string): Promise<Product[]> {
    let query = db.select().from(products).where(eq(products.userId, userId));
    
    if (searchQuery) {
      query = db.select().from(products).where(
        eq(products.userId, userId)
      ).where(
        or(
          ilike(products.name, `%${searchQuery}%`),
          ilike(products.description, `%${searchQuery}%`)
        )
      );
    }
    
    return await query;
  }

  async getProduct(id: number): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product || undefined;
  }

  async createProduct(product: InsertProduct, userId: number): Promise<Product> {
    const [newProduct] = await db
      .insert(products)
      .values({ ...product, userId })
      .returning();
    return newProduct;
  }

  async updateProduct(id: number, product: Partial<InsertProduct>, userId: number): Promise<Product | undefined> {
    const [updatedProduct] = await db
      .update(products)
      .set(product)
      .where(eq(products.id, id))
      .where(eq(products.userId, userId))
      .returning();
    return updatedProduct || undefined;
  }

  async deleteProduct(id: number, userId: number): Promise<boolean> {
    const result = await db
      .delete(products)
      .where(eq(products.id, id))
      .where(eq(products.userId, userId))
      .returning();
    return result.length > 0;
  }
}

export const storage = new DatabaseStorage();

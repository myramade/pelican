import { type User, type InsertUser, type Study, type InsertStudy } from "@shared/schema";
import { db } from "./db";
import { users, studies } from "@shared/schema";
import { eq } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Study operations
  getAllStudies(): Promise<Study[]>;
  getStudy(id: string): Promise<Study | undefined>;
  createStudy(study: InsertStudy): Promise<Study>;
  updateStudy(id: string, updates: Partial<Study>): Promise<Study | undefined>;
  deleteStudy(id: string): Promise<boolean>;
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
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getAllStudies(): Promise<Study[]> {
    return db.select().from(studies);
  }

  async getStudy(id: string): Promise<Study | undefined> {
    const [study] = await db.select().from(studies).where(eq(studies.id, id));
    return study || undefined;
  }

  async createStudy(insertStudy: InsertStudy): Promise<Study> {
    const [study] = await db
      .insert(studies)
      .values(insertStudy)
      .returning();
    return study;
  }

  async updateStudy(id: string, updates: Partial<Study>): Promise<Study | undefined> {
    const [study] = await db
      .update(studies)
      .set(updates)
      .where(eq(studies.id, id))
      .returning();
    return study || undefined;
  }

  async deleteStudy(id: string): Promise<boolean> {
    const result = await db
      .delete(studies)
      .where(eq(studies.id, id))
      .returning();
    return result.length > 0;
  }
}

export const storage = new DatabaseStorage();

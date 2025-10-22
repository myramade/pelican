import { 
  type User, 
  type InsertUser, 
  type Study, 
  type InsertStudy,
  type SurveyInvitation,
  type InsertSurveyInvitation,
  type SurveyResponse,
  type InsertSurveyResponse
} from "@shared/schema";
import { db } from "./db";
import { users, studies, surveyInvitations, surveyResponses } from "@shared/schema";
import { eq, and } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Study operations
  getAllStudies(): Promise<Study[]>;
  getStudy(id: string): Promise<Study | undefined>;
  getStudyByShareToken(token: string): Promise<Study | undefined>;
  createStudy(study: InsertStudy): Promise<Study>;
  updateStudy(id: string, updates: Partial<Study>): Promise<Study | undefined>;
  deleteStudy(id: string): Promise<boolean>;
  generateShareToken(studyId: string): Promise<string | undefined>;
  
  // Survey invitation operations
  createSurveyInvitation(invitation: InsertSurveyInvitation): Promise<SurveyInvitation>;
  getSurveyInvitations(studyId: string): Promise<SurveyInvitation[]>;
  markInvitationCompleted(invitationId: string): Promise<boolean>;
  
  // Survey response operations
  createSurveyResponse(response: InsertSurveyResponse): Promise<SurveyResponse>;
  getSurveyResponses(studyId: string): Promise<SurveyResponse[]>;
  getResponseCount(studyId: string): Promise<number>;
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

  async getStudyByShareToken(token: string): Promise<Study | undefined> {
    const [study] = await db.select().from(studies).where(eq(studies.shareToken, token));
    return study || undefined;
  }

  async generateShareToken(studyId: string): Promise<string | undefined> {
    const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const [study] = await db
      .update(studies)
      .set({ shareToken: token })
      .where(eq(studies.id, studyId))
      .returning();
    return study?.shareToken || undefined;
  }

  async createSurveyInvitation(insertInvitation: InsertSurveyInvitation): Promise<SurveyInvitation> {
    const [invitation] = await db
      .insert(surveyInvitations)
      .values(insertInvitation)
      .returning();
    return invitation;
  }

  async getSurveyInvitations(studyId: string): Promise<SurveyInvitation[]> {
    return db.select().from(surveyInvitations).where(eq(surveyInvitations.studyId, studyId));
  }

  async markInvitationCompleted(invitationId: string): Promise<boolean> {
    const result = await db
      .update(surveyInvitations)
      .set({ completedAt: new Date() })
      .where(eq(surveyInvitations.id, invitationId))
      .returning();
    return result.length > 0;
  }

  async createSurveyResponse(insertResponse: InsertSurveyResponse): Promise<SurveyResponse> {
    const [response] = await db
      .insert(surveyResponses)
      .values(insertResponse)
      .returning();
    return response;
  }

  async getSurveyResponses(studyId: string): Promise<SurveyResponse[]> {
    return db.select().from(surveyResponses).where(eq(surveyResponses.studyId, studyId));
  }

  async getResponseCount(studyId: string): Promise<number> {
    const responses = await db.select().from(surveyResponses).where(eq(surveyResponses.studyId, studyId));
    return responses.length;
  }
}

export const storage = new DatabaseStorage();

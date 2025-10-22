import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const studies = pgTable("studies", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  impactStudyName: text("impact_study_name").notNull(),
  programName: text("program_name").notNull(),
  userRole: text("user_role").notNull(),
  programType: text("program_type").notNull(),
  programStartDate: text("program_start_date").notNull(),
  programReason: text("program_reason").notNull(),
  stakeholders: text("stakeholders").array().notNull(),
  uploadedFiles: jsonb("uploaded_files").notNull().default([]),
  surveyQuestions: jsonb("survey_questions").default([]),
  sampleSize: jsonb("sample_size"),
  status: text("status").notNull().default("In Progress"),
  progress: integer("progress").notNull().default(15),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertStudySchema = createInsertSchema(studies).omit({
  id: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Study = typeof studies.$inferSelect;
export type InsertStudy = z.infer<typeof insertStudySchema>;

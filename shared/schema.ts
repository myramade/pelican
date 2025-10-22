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
  programName: text("program_name").notNull(),
  userRole: text("user_role").notNull(),
  programType: text("program_type").notNull(),
  programStartDate: text("program_start_date").notNull(),
  programReason: text("program_reason").notNull(),
  stakeholders: text("stakeholders").notNull(),
  orgGoals: text("org_goals").notNull(),
  participantGoals: text("participant_goals").notNull(),
  goodLookLike: text("good_look_like").notNull(),
  leaderExpectations: text("leader_expectations").notNull(),
  programDuration: text("program_duration").notNull(),
  fundingJustification: integer("funding_justification").notNull(),
  dataCollectionMethods: text("data_collection_methods").array().notNull(),
  currentMetrics: text("current_metrics").notNull(),
  targetAudience: text("target_audience").notNull(),
  groupSize: integer("group_size").notNull(),
  audienceNeeds: text("audience_needs").notNull(),
  audienceSuccess: text("audience_success").notNull(),
  stakeholdersList: jsonb("stakeholders_list").notNull(),
  uploadedFiles: jsonb("uploaded_files").notNull(),
  interviewees: jsonb("interviewees").notNull(),
  surveyQuestions: jsonb("survey_questions").notNull(),
  status: text("status").notNull().default("draft"),
  progress: integer("progress").notNull().default(0),
  aiInsights: text("ai_insights"),
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

import { z } from "zod";

export const generateSurveyRequestSchema = z.object({
  programName: z.string().min(1, "Program name is required"),
  programType: z.string().min(1, "Program type is required"),
  programReason: z.string().min(1, "Program reason is required"),
  stakeholders: z.array(z.string()).min(1, "At least one stakeholder is required"),
  uploadedFiles: z.array(z.any()).default([]),
});

export type GenerateSurveyRequest = z.infer<typeof generateSurveyRequestSchema>;

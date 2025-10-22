import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { openai } from "./openai";
import { generateSurveyRequestSchema, updateStudySchema } from "@shared/api-schemas";
import { fromZodError } from "zod-validation-error";
import { insertStudySchema } from "@shared/schema";
import { ERROR_MESSAGES, OPENAI_MODEL } from "@shared/constants";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all studies
  app.get("/api/studies", async (req, res) => {
    try {
      const studies = await storage.getAllStudies();
      res.json(studies);
    } catch (error) {
      console.error("Error fetching studies:", error);
      res.status(500).json({ 
        error: "Failed to fetch studies",
        message: ERROR_MESSAGES.FETCH_STUDIES,
        code: "FETCH_ERROR"
      });
    }
  });

  // Get study by id
  app.get("/api/studies/:id", async (req, res) => {
    try {
      const study = await storage.getStudy(req.params.id);
      if (!study) {
        return res.status(404).json({ 
          error: "Study not found",
          message: "The requested study does not exist.",
          code: "NOT_FOUND"
        });
      }
      res.json(study);
    } catch (error) {
      console.error("Error fetching study:", error);
      res.status(500).json({ 
        error: "Failed to fetch study",
        message: "Unable to retrieve study. Please try again.",
        code: "FETCH_ERROR"
      });
    }
  });

  // Create new study
  app.post("/api/studies", async (req, res) => {
    try {
      const validationResult = insertStudySchema.safeParse(req.body);
      
      if (!validationResult.success) {
        const validationError = fromZodError(validationResult.error);
        return res.status(400).json({ 
          error: "Validation failed",
          message: validationError.message,
          code: "VALIDATION_ERROR"
        });
      }

      const study = await storage.createStudy(validationResult.data);
      res.status(201).json(study);
    } catch (error) {
      console.error("Error creating study:", error);
      res.status(500).json({ 
        error: "Failed to create study",
        message: "Unable to create study. Please try again.",
        code: "CREATE_ERROR"
      });
    }
  });

  // Update study
  app.put("/api/studies/:id", async (req, res) => {
    try {
      const validationResult = updateStudySchema.safeParse(req.body);
      
      if (!validationResult.success) {
        const validationError = fromZodError(validationResult.error);
        return res.status(400).json({ 
          error: "Validation failed",
          message: validationError.message,
          code: "VALIDATION_ERROR"
        });
      }

      const study = await storage.updateStudy(req.params.id, validationResult.data);
      if (!study) {
        return res.status(404).json({ 
          error: "Study not found",
          message: "The requested study does not exist.",
          code: "NOT_FOUND"
        });
      }
      res.json(study);
    } catch (error) {
      console.error("Error updating study:", error);
      res.status(500).json({ 
        error: "Failed to update study",
        message: "Unable to update study. Please try again.",
        code: "UPDATE_ERROR"
      });
    }
  });

  // Delete study
  app.delete("/api/studies/:id", async (req, res) => {
    try {
      const success = await storage.deleteStudy(req.params.id);
      if (!success) {
        return res.status(404).json({ 
          error: "Study not found",
          message: "The requested study does not exist.",
          code: "NOT_FOUND"
        });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting study:", error);
      res.status(500).json({ 
        error: "Failed to delete study",
        message: "Unable to delete study. Please try again.",
        code: "DELETE_ERROR"
      });
    }
  });

  // Generate AI survey recommendations based on study data
  app.post("/api/generate-survey", async (req, res) => {
    try {
      // Validate request body
      const validationResult = generateSurveyRequestSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        const validationError = fromZodError(validationResult.error);
        return res.status(400).json({ 
          error: "Validation failed",
          message: validationError.message,
          code: "VALIDATION_ERROR"
        });
      }

      const {
        programName,
        programType,
        programReason,
        stakeholders,
        uploadedFiles,
      } = validationResult.data;

      const completion = await openai.chat.completions.create({
        model: OPENAI_MODEL,
        messages: [
          {
            role: "system",
            content: `You are an expert in learning and development impact measurement using the Kirkpatrick Four-Level Training Evaluation Model. Generate survey questions and recommendations based on the provided program information. Output must be valid JSON.`
          },
          {
            role: "user",
            content: `Generate a comprehensive survey to measure the impact of this training program:

Program Name: ${programName}
Program Type: ${programType}
Program Purpose: ${programReason}
Stakeholders: ${stakeholders.join(", ")}
Supporting Documents: ${uploadedFiles.length} files uploaded

Create survey questions organized by the four Kirkpatrick levels:
- Level 1 (Reaction): Participant satisfaction and engagement
- Level 2 (Learning): Knowledge and skill acquisition
- Level 3 (Behavior): Application of learning on the job
- Level 4 (Results): Business impact and ROI

For each question, specify:
1. The Kirkpatrick level
2. The question text
3. Target audience (Participant, Manager, or HR)
4. Question type (Rating Scale, Multiple Choice, or Open-ended)

Also provide:
1. Recommended sample size for surveying based on best practices
2. Brief explanation of the sample size recommendation

Output format (JSON):
{
  "questions": [
    {
      "level": "Level 1: Reaction",
      "question": "question text",
      "audience": "Participant",
      "type": "Rating Scale"
    }
  ],
  "sampleSize": {
    "recommended": 50,
    "explanation": "explanation text"
  }
}`
          }
        ],
        response_format: { type: "json_object" },
        max_completion_tokens: 8192
      });

      const result = JSON.parse(completion.choices[0].message.content || "{}");
      res.json(result);
    } catch (error) {
      console.error("Error generating survey:", error);
      
      // Provide structured error response
      if (error instanceof Error) {
        res.status(500).json({ 
          error: "AI generation failed",
          message: "Unable to generate survey recommendations. Please try again.",
          code: "AI_GENERATION_ERROR",
          details: error.message
        });
      } else {
        res.status(500).json({ 
          error: "Failed to generate survey",
          message: "An unexpected error occurred. Please try again.",
          code: "UNKNOWN_ERROR"
        });
      }
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}

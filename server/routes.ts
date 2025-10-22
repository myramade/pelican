import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { openai } from "./openai";
import { generateSurveyRequestSchema, updateStudySchema } from "@shared/api-schemas";
import { fromZodError } from "zod-validation-error";
import { insertStudySchema, insertSurveyInvitationSchema, insertSurveyResponseSchema } from "@shared/schema";
import { ERROR_MESSAGES, OPENAI_MODEL } from "@shared/constants";
import { z } from "zod";
import { calculateIR, generateIRInsight } from "./utils/calculateIR";

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

  // Generate share token for study
  app.post("/api/studies/:id/share", async (req, res) => {
    try {
      const study = await storage.getStudy(req.params.id);
      if (!study) {
        return res.status(404).json({ 
          error: "Study not found",
          code: "NOT_FOUND"
        });
      }

      // Return existing token if available
      if (study.shareToken) {
        return res.json({ shareToken: study.shareToken });
      }

      const token = await storage.generateShareToken(req.params.id);
      if (!token) {
        return res.status(500).json({ 
          error: "Failed to generate share token",
          code: "GENERATION_ERROR"
        });
      }

      res.json({ shareToken: token });
    } catch (error) {
      console.error("Error generating share token:", error);
      res.status(500).json({ 
        error: "Failed to generate share token",
        code: "GENERATION_ERROR"
      });
    }
  });

  // Get survey invitations for a study
  app.get("/api/studies/:id/invitations", async (req, res) => {
    try {
      const invitations = await storage.getSurveyInvitations(req.params.id);
      res.json(invitations);
    } catch (error) {
      console.error("Error fetching invitations:", error);
      res.status(500).json({ 
        error: "Failed to fetch invitations",
        code: "FETCH_ERROR"
      });
    }
  });

  // Create survey invitation
  app.post("/api/studies/:id/invitations", async (req, res) => {
    try {
      const validationResult = insertSurveyInvitationSchema.safeParse({
        ...req.body,
        studyId: req.params.id
      });
      
      if (!validationResult.success) {
        const validationError = fromZodError(validationResult.error);
        return res.status(400).json({ 
          error: "Validation failed",
          message: validationError.message,
          code: "VALIDATION_ERROR"
        });
      }

      const invitation = await storage.createSurveyInvitation(validationResult.data);
      res.status(201).json(invitation);
    } catch (error) {
      console.error("Error creating invitation:", error);
      res.status(500).json({ 
        error: "Failed to create invitation",
        code: "CREATE_ERROR"
      });
    }
  });

  // Get survey responses for a study
  app.get("/api/studies/:id/responses", async (req, res) => {
    try {
      const responses = await storage.getSurveyResponses(req.params.id);
      const count = responses.length;
      res.json({ responses, count });
    } catch (error) {
      console.error("Error fetching responses:", error);
      res.status(500).json({ 
        error: "Failed to fetch responses",
        code: "FETCH_ERROR"
      });
    }
  });

  // Public endpoint: Get survey by share token
  app.get("/api/survey/:token", async (req, res) => {
    try {
      const study = await storage.getStudyByShareToken(req.params.token);
      if (!study) {
        return res.status(404).json({ 
          error: "Survey not found",
          code: "NOT_FOUND"
        });
      }

      // Return only survey-relevant data (not internal study details)
      res.json({
        id: study.id,
        programName: study.programName,
        surveyQuestions: study.surveyQuestions,
      });
    } catch (error) {
      console.error("Error fetching survey:", error);
      res.status(500).json({ 
        error: "Failed to fetch survey",
        code: "FETCH_ERROR"
      });
    }
  });

  // Public endpoint: Submit survey response
  app.post("/api/survey/:token/submit", async (req, res) => {
    try {
      const study = await storage.getStudyByShareToken(req.params.token);
      if (!study) {
        return res.status(404).json({ 
          error: "Survey not found",
          code: "NOT_FOUND"
        });
      }

      const validationResult = insertSurveyResponseSchema.safeParse({
        studyId: study.id,
        invitationId: req.body.invitationId || null,
        responseData: req.body.responseData
      });
      
      if (!validationResult.success) {
        const validationError = fromZodError(validationResult.error);
        return res.status(400).json({ 
          error: "Validation failed",
          message: validationError.message,
          code: "VALIDATION_ERROR"
        });
      }

      const response = await storage.createSurveyResponse(validationResult.data);

      // Mark invitation as completed if provided
      if (req.body.invitationId) {
        await storage.markInvitationCompleted(req.body.invitationId);
      }

      // Recalculate IR metric
      try {
        const allResponses = await storage.getSurveyResponses(study.id);
        const invitations = await storage.getSurveyInvitations(study.id);
        
        if (study.surveyQuestions && Array.isArray(study.surveyQuestions)) {
          const irMetric = calculateIR(allResponses, study.surveyQuestions as any[]);
          
          if (irMetric !== null) {
            const insight = generateIRInsight(irMetric);
            const completionPercentage = invitations.length > 0 
              ? Math.round((allResponses.length / invitations.length) * 100)
              : 0;

            await storage.updateStudy(study.id, {
              irMetric,
              insight,
              completionPercentage,
              status: completionPercentage >= 100 ? "Completed" : "In Progress"
            });
          }
        }
      } catch (error) {
        console.error("Error calculating IR:", error);
        // Don't fail the response submission if IR calculation fails
      }

      res.status(201).json(response);
    } catch (error) {
      console.error("Error submitting response:", error);
      res.status(500).json({ 
        error: "Failed to submit response",
        code: "SUBMIT_ERROR"
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

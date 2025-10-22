import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { openai } from "./openai";

export async function registerRoutes(app: Express): Promise<Server> {
  // Generate AI survey recommendations based on study data
  app.post("/api/generate-survey", async (req, res) => {
    try {
      const {
        programName,
        programType,
        programReason,
        stakeholders,
        uploadedFiles,
      } = req.body;

      // the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
      const completion = await openai.chat.completions.create({
        model: "gpt-5",
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
      res.status(500).json({ error: "Failed to generate survey" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}

# Pelican App

## Overview
Pelican App is a web application prototype for managing impact studies of L&D/training programs. It uses AI (OpenAI GPT-5 via Replit AI Integrations) to evaluate programs, generate Kirkpatrick-based surveys, and provide insights. This is a prototype with no login requirement.

## Project Goal
Create a web application that allows L&D professionals to:
1. Start new impact studies with a simplified single-page intake form
2. Upload supporting documents
3. Generate AI-powered survey questions based on the Kirkpatrick Four-Level Training Evaluation Model
4. Track study progress with AI-generated recommendations

## Recent Changes (October 22, 2025)
- Integrated OpenAI GPT-5 via Replit AI Integrations for AI survey generation
- Created `/api/generate-survey` endpoint that analyzes program data and generates Kirkpatrick-based survey questions
- Updated NewStudy.tsx to call AI API on form submission with loading states and error handling
- Enhanced StudyDetail.tsx to display AI-generated survey questions organized by Kirkpatrick level
- Added sample size recommendations with AI explanations
- Survey questions include audience targeting (Participant, Manager, HR) and question types (Rating Scale, Multiple Choice, Open-ended)
- Implemented Zod validation for API requests (shared/api-schemas.ts)
- Added structured error responses with error codes (VALIDATION_ERROR, AI_GENERATION_ERROR, UNKNOWN_ERROR)
- Added graceful empty state UI when survey data is pending or missing
- Improved error messaging to provide helpful feedback to users

## User Preferences
- Design Style: Professional productivity tool (Linear/Notion/Asana inspiration)
- Color Scheme: Teal (#158772), Light Teal (#E8F5F4), Golden Yellow (#F4B400)
- No authentication required (prototype only)
- Single-page intake form instead of multi-step wizard
- AI-powered features are central to the value proposition

## Project Architecture

### Tech Stack
- Frontend: React + TypeScript + Vite + Wouter (routing)
- Backend: Express + TypeScript
- AI: OpenAI GPT-5 via Replit AI Integrations (no API key needed, charges billed to credits)
- Storage: In-memory localStorage (no database needed for prototype)
- UI: Shadcn + Tailwind CSS
- Icons: Lucide React

### Key Files
- `client/src/pages/NewStudy.tsx` - Single-page intake form with 7 fields
- `client/src/pages/StudyDetail.tsx` - Study details with AI-generated survey questions
- `client/src/pages/Dashboard.tsx` - Overview of all impact studies
- `client/src/components/AppSidebar.tsx` - Navigation sidebar
- `server/openai.ts` - OpenAI client configuration
- `server/routes.ts` - API routes including `/api/generate-survey`
- `shared/schema.ts` - Data types (has unused user auth table)
- `client/src/index.css` - Design system colors and theme

### Data Model
Studies stored in localStorage with structure:
- Basic info: id, programName, impactStudyName, userRole, programType, programStartDate, programReason
- Stakeholders: array of selected stakeholder types
- uploadedFiles: array of file metadata
- surveyQuestions: AI-generated questions array
- sampleSize: { recommended: number, explanation: string }
- progress: number (0-100)
- status: string

### AI Features
1. **Survey Generation**: Analyzes program data and generates questions for all four Kirkpatrick levels:
   - Level 1 (Reaction): Participant satisfaction and engagement
   - Level 2 (Learning): Knowledge and skill acquisition
   - Level 3 (Behavior): Application of learning on the job
   - Level 4 (Results): Business impact and ROI

2. **Sample Size Recommendations**: AI suggests optimal survey sample sizes with explanations

3. **Question Targeting**: Each question tagged with:
   - Audience (Participant, Manager, HR)
   - Type (Rating Scale, Multiple Choice, Open-ended)
   - Kirkpatrick Level

## Navigation Structure
- Dashboard (/) - List of all studies
- New Study (/new-study) - Create impact study form
- Study Detail (/study/:id) - View study details and AI insights

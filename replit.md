# BirdsAI

## Overview
BirdsAI is a web application for managing impact studies of L&D/training programs with portfolio-level analytics. It uses AI (OpenAI GPT-5 via Replit AI Integrations) to evaluate programs, generate Kirkpatrick-based surveys, and provide insights. This is a prototype with no login requirement.

## Project Goal
Create a web application that allows L&D professionals to:
1. Start new impact studies with a simplified single-page intake form
2. Upload supporting documents
3. Generate AI-powered survey questions based on the Kirkpatrick Four-Level Training Evaluation Model
4. Track study progress with AI-generated recommendations

## Recent Changes (October 22, 2025)

### Survey Sharing & Response Tracking (In Progress)
- Adding survey invitation management (stakeholder names/emails)
- Creating shareable survey links for external stakeholders
- Implementing response tracking and progress monitoring
- Building IR calculation from aggregated survey responses

### Database Migration to PostgreSQL
- **Replaced localStorage with PostgreSQL** for persistent data storage using Drizzle ORM
- **Created complete REST API** with full CRUD operations:
  - GET /api/studies - Fetch all studies
  - GET /api/studies/:id - Fetch single study
  - POST /api/studies - Create new study
  - PUT /api/studies/:id - Update study (with AI-generated data)
  - DELETE /api/studies/:id - Delete study
- **Implemented Zod validation** on all endpoints (insertStudySchema, updateStudySchema)
- **Updated all frontend components** to use TanStack Query instead of localStorage:
  - Dashboard: Fetches studies from API, displays status badges (Draft/Completed)
  - NewStudy: Posts to API, then updates with AI survey data
  - StudyDetail: Fetches study by ID with loading states
  - StudyCard: Added delete button with confirmation, toast notifications, cache invalidation
- **Database schema** uses JSONB columns for complex data (surveyQuestions, sampleSize, stakeholders, uploadedFiles)
- **Storage layer** (server/storage.ts) implements DatabaseStorage class with full CRUD
- **Type safety** maintained between frontend and backend using shared types
- All AI features (GPT-5 survey generation, sample size recommendations) remain fully functional with database persistence

## User Preferences
- Design Style: Professional productivity tool (Linear/Notion/Asana inspiration)
- Color Scheme: Teal (#158772), Light Teal (#E8F5F4), Golden Yellow (#F4B400)
- No authentication required (prototype only)
- Single-page intake form instead of multi-step wizard
- AI-powered features are central to the value proposition

## Project Architecture

### Tech Stack
- Frontend: React + TypeScript + Vite + Wouter (routing) + TanStack Query (server state)
- Backend: Express + TypeScript
- Database: PostgreSQL with Drizzle ORM
- AI: OpenAI GPT-5 via Replit AI Integrations (no API key needed, charges billed to credits)
- Validation: Zod schemas for request/response validation
- UI: Shadcn + Tailwind CSS
- Icons: Lucide React

### Key Files
- `client/src/pages/Dashboard.tsx` - Study list with delete functionality, uses TanStack Query
- `client/src/pages/NewStudy.tsx` - Single-page intake form, posts to API then updates with AI data
- `client/src/pages/StudyDetail.tsx` - Study details with AI insights, fetches from API by ID
- `client/src/components/StudyCard.tsx` - Study card with delete button and status badges
- `client/src/components/AppSidebar.tsx` - Navigation sidebar
- `server/routes.ts` - Complete REST API endpoints with Zod validation
- `server/storage.ts` - Database storage layer (DatabaseStorage) with CRUD operations
- `server/db.ts` - PostgreSQL connection via Drizzle
- `server/openai.ts` - OpenAI client configuration for GPT-5
- `shared/schema.ts` - Drizzle schema for studies table with JSONB columns
- `shared/api-schemas.ts` - Zod validation schemas (insertStudySchema, updateStudySchema, generateSurveyRequestSchema)
- `client/src/lib/queryClient.ts` - TanStack Query configuration with apiRequest helper
- `client/src/index.css` - Design system colors and theme

### Data Model
Studies stored in PostgreSQL `studies` table with Drizzle ORM:
- **Scalar fields**: id (varchar UUID), impactStudyName, programName, userRole, programType, programStartDate, programReason
- **JSONB fields** (for complex data):
  - stakeholders: array of strings (e.g., ["Senior Management", "HR Team"])
  - uploadedFiles: array of file objects (metadata only, files not actually stored)
  - surveyQuestions: AI-generated questions array with level, question, audience, type
  - sampleSize: object with { recommended: number, explanation: string }
- **Derived fields** (frontend only):
  - status: "Draft" or "Completed" (based on whether surveyQuestions exist)

**Note**: Drizzle automatically maps between camelCase (TypeScript) and snake_case (PostgreSQL columns)

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

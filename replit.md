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

### Survey Sharing & Response Tracking (Completed)
- **Survey Invitation Management**: Added stakeholder tracking with names and emails in new `survey_invitations` table
- **Shareable Survey Links**: Cryptographically secure share tokens (using `randomUUID()`) for public survey access without authentication
- **Public Survey Page**: Standalone survey interface at `/survey/:token` with no sidebar, clean layout for external stakeholders
- **Response Tracking**: Real-time display of responses received vs invitations sent in SurveyInvitationManager component
- **IR Calculation**: Automatic Impact Rating calculation from aggregated survey responses using weighted Kirkpatrick levels
- **Auto-Updates**: Study status, completion percentage, and IR metric auto-update when responses are submitted
- **UX Improvements**: Toast notifications for validation errors with specific missing question numbers
- **Security**: Upgraded from Math.random() to crypto.randomUUID() for secure, unpredictable share tokens

### Database Migration to PostgreSQL
- **Replaced localStorage with PostgreSQL** for persistent data storage using Drizzle ORM
- **Created complete REST API** with full CRUD operations:
  - GET /api/studies - Fetch all studies
  - GET /api/studies/:id - Fetch single study
  - POST /api/studies - Create new study
  - PUT /api/studies/:id - Update study (with AI-generated data)
  - DELETE /api/studies/:id - Delete study
  - POST /api/studies/:id/share - Generate secure share token for surveys
  - GET/POST /api/studies/:id/invitations - Manage survey invitations
  - GET /api/studies/:id/responses - Get response count
  - GET /api/survey/:token - Public endpoint to fetch survey by token
  - POST /api/survey/:token/submit - Public endpoint to submit survey responses
- **Implemented Zod validation** on all endpoints (insertStudySchema, updateStudySchema, generateSurveyRequestSchema)
- **Updated all frontend components** to use TanStack Query instead of localStorage:
  - Dashboard: Fetches studies from API, displays status badges (Draft/In Progress/Completed)
  - NewStudy: Posts to API, then updates with AI survey data
  - StudyDetail: Fetches study by ID with loading states, new Survey tab for invitation management
  - StudyCard: Added delete button with confirmation, toast notifications, cache invalidation
  - SurveyInvitationManager: New component for managing stakeholders and share links
  - PublicSurvey: Public-facing survey page with validation and submission
- **Database schema** includes three tables with JSONB columns for complex data:
  - `studies`: surveyQuestions, sampleSize, stakeholders, uploadedFiles, shareToken, irMetric, completionPercentage
  - `survey_invitations`: stakeholderName, stakeholderEmail, sentAt, completedAt
  - `survey_responses`: responseData (JSONB), submittedAt
- **Storage layer** (server/storage.ts) implements DatabaseStorage class with full CRUD and survey management
- **Type safety** maintained between frontend and backend using shared types
- All AI features (GPT-5 survey generation, sample size recommendations, IR calculation) fully functional with database persistence

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
- `client/src/pages/StudyDetail.tsx` - Study details with tabs (Overview, Survey, Data, Insights)
- `client/src/pages/PublicSurvey.tsx` - Public survey page with validation and submission (no auth required)
- `client/src/components/StudyCard.tsx` - Study card with delete button and status badges
- `client/src/components/SurveyInvitationManager.tsx` - Survey sharing and stakeholder management
- `client/src/components/AppSidebar.tsx` - Navigation sidebar
- `client/src/App.tsx` - Conditional layout (sidebar for internal pages, no sidebar for public survey)
- `server/routes.ts` - Complete REST API endpoints with Zod validation including survey endpoints
- `server/storage.ts` - Database storage layer (DatabaseStorage) with CRUD and survey operations
- `server/utils/calculateIR.ts` - IR calculation with weighted Kirkpatrick levels
- `server/db.ts` - PostgreSQL connection via Drizzle
- `server/openai.ts` - OpenAI client configuration for GPT-5
- `shared/schema.ts` - Drizzle schema for studies, survey_invitations, and survey_responses tables
- `shared/api-schemas.ts` - Zod validation schemas (insertStudySchema, updateStudySchema, generateSurveyRequestSchema)
- `client/src/lib/queryClient.ts` - TanStack Query configuration with apiRequest helper
- `client/src/index.css` - Design system colors and theme

### Data Model

**Studies Table** (PostgreSQL with Drizzle ORM):
- **Scalar fields**: id (varchar UUID), impactStudyName, programName, client, userRole, programType, sector, programStartDate, programEndDate, programReason, status, progress, shareToken (cryptographically secure UUID), irMetric (numeric 1-10), completionPercentage, insight
- **JSONB fields** (for complex data):
  - stakeholders: array of strings (e.g., ["Senior Management", "HR Team"])
  - uploadedFiles: array of file objects (metadata only, files not actually stored)
  - surveyQuestions: AI-generated questions array with level, question, audience, type
  - sampleSize: object with { recommended: number, explanation: string }

**Survey Invitations Table**:
- id (varchar UUID), studyId (FK), stakeholderName, stakeholderEmail, sentAt (timestamp), completedAt (timestamp, nullable)

**Survey Responses Table**:
- id (varchar UUID), studyId (FK), invitationId (FK, nullable), responseData (JSONB - stores question index to answer mapping), submittedAt (timestamp)

**Note**: Drizzle automatically maps between camelCase (TypeScript) and snake_case (PostgreSQL columns)

### AI Features
1. **Survey Generation**: Analyzes program data and generates questions for all four Kirkpatrick levels:
   - Level 1 (Reaction): Participant satisfaction and engagement (20% weight in IR)
   - Level 2 (Learning): Knowledge and skill acquisition (25% weight in IR)
   - Level 3 (Behavior): Application of learning on the job (30% weight in IR)
   - Level 4 (Results): Business impact and ROI (25% weight in IR)

2. **Sample Size Recommendations**: AI suggests optimal survey sample sizes with explanations

3. **Question Targeting**: Each question tagged with:
   - Audience (Participant, Manager, HR)
   - Type (Rating Scale, Multiple Choice, Open-ended)
   - Kirkpatrick Level

4. **Impact Rating (IR) Calculation**: Automated calculation from survey responses:
   - Weighted average across Kirkpatrick levels based on business impact
   - Normalizes responses to 1-10 scale
   - Generates insight based on score (Exceptional >8.5, Strong >7.0, Moderate >5.5, Limited >4.0, Low <4.0)
   - Auto-updates when new responses submitted

## Navigation Structure
- Dashboard (/) - List of all studies with filters (client, sector, status, program type)
- New Study (/new-study) - Create impact study form with AI survey generation
- Study Detail (/study/:id) - View study details with tabs:
  - Overview: Recommendations and gap analysis
  - Survey: Invitation management, share link generation, response tracking
  - Data: Program details and metadata
  - Insights: AI-generated survey questions and sample size recommendations
- Public Survey (/survey/:token) - Standalone public survey page (no authentication or sidebar)

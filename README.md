# BirdsAI

A web application for managing impact studies of L&D/training programs with AI-powered survey generation using the Kirkpatrick Four-Level Training Evaluation Model.

**BirdsAI Vue**: Portfolio-level analytics and insights across all your impact studies.

## 🚀 Features

- **AI-Powered Survey Generation**: Automatically generate comprehensive survey questions using OpenAI GPT-5
- **Kirkpatrick Model Integration**: Questions organized across all four evaluation levels
  - Level 1 (Reaction): Participant satisfaction and engagement
  - Level 2 (Learning): Knowledge and skill acquisition
  - Level 3 (Behavior): Application of learning on the job
  - Level 4 (Results): Business impact and ROI
- **Sample Size Recommendations**: AI-generated optimal survey sample sizes with explanations
- **Impact Study Management**: Create, view, update, and delete impact studies
- **PostgreSQL Database**: Persistent data storage with Drizzle ORM
- **Clean, Modern UI**: Professional productivity tool design inspired by Linear, Notion, and Asana

## 📋 Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- OpenAI API access (via Replit AI Integrations)

## 🛠️ Tech Stack

### Frontend
- **React** with TypeScript
- **Vite** for fast development and building
- **Wouter** for lightweight routing
- **TanStack Query** for server state management
- **Shadcn UI** + **Tailwind CSS** for styling
- **Lucide React** for icons

### Backend
- **Express** with TypeScript
- **PostgreSQL** with Drizzle ORM
- **Zod** for request/response validation
- **OpenAI GPT-5** via Replit AI Integrations

## 📁 Project Structure

```
pelican-app/
├── client/                    # Frontend application
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   │   ├── ui/          # Shadcn UI components
│   │   │   ├── AppSidebar.tsx
│   │   │   └── StudyCard.tsx
│   │   ├── hooks/           # Custom React hooks
│   │   ├── lib/             # Utility functions and configurations
│   │   │   └── queryClient.ts
│   │   ├── pages/           # Page components
│   │   │   ├── Dashboard.tsx
│   │   │   ├── NewStudy.tsx
│   │   │   ├── StudyDetail.tsx
│   │   │   └── not-found.tsx
│   │   ├── App.tsx          # Main app component
│   │   └── index.css        # Global styles and theme
│   └── index.html
├── server/                   # Backend application
│   ├── db.ts                # Database connection
│   ├── index.ts             # Express server entry point
│   ├── openai.ts            # OpenAI client configuration
│   ├── routes.ts            # API route handlers
│   ├── storage.ts           # Database storage layer
│   └── vite.ts              # Vite middleware setup
├── shared/                   # Shared code between frontend and backend
│   ├── api-schemas.ts       # Zod validation schemas
│   ├── constants.ts         # Application constants
│   └── schema.ts            # Drizzle database schema
├── drizzle.config.ts        # Drizzle ORM configuration
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## 🚦 Getting Started

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
# Create a .env file with:
# DATABASE_URL=your_postgresql_connection_string
# SESSION_SECRET=your_session_secret
# AI_INTEGRATIONS_OPENAI_API_KEY=your_openai_api_key (if using direct OpenAI)

# Push database schema
npm run db:push
```

### Development

```bash
# Start development server (runs both frontend and backend)
npm run dev
```

The application will be available at `http://localhost:5000`

### Database Management

```bash
# Push schema changes to database
npm run db:push

# Open Drizzle Studio (database GUI)
npm run db:studio
```

## 📊 Database Schema

### Studies Table

| Field | Type | Description |
|-------|------|-------------|
| id | varchar (UUID) | Primary key |
| impactStudyName | varchar | Name of the impact study |
| programName | varchar | L&D program name |
| userRole | varchar | Role of the user creating the study |
| programType | varchar | Type of training program |
| programStartDate | varchar | Program start date |
| programReason | text | Reason for program creation |
| stakeholders | jsonb | Array of stakeholder types |
| uploadedFiles | jsonb | Array of uploaded file metadata |
| surveyQuestions | jsonb | AI-generated survey questions |
| sampleSize | jsonb | Sample size recommendation |

## 🔌 API Endpoints

### Studies
- `GET /api/studies` - Fetch all studies
- `GET /api/studies/:id` - Fetch single study by ID
- `POST /api/studies` - Create new study
- `PUT /api/studies/:id` - Update study
- `DELETE /api/studies/:id` - Delete study

### AI Survey Generation
- `POST /api/generate-survey` - Generate AI-powered survey questions

## 🎨 Design System

### Colors
- **Primary (Teal)**: `#158772`
- **Light Teal**: `#E8F5F4`
- **Accent (Golden Yellow)**: `#F4B400`

### Typography
- Font Family: System fonts (SF Pro, Segoe UI, Roboto)
- Modern, clean, and professional aesthetic

## 📝 Usage

1. **Create an Impact Study**
   - Navigate to "New Study" from the sidebar
   - Fill in the intake form with program details
   - Add stakeholders and upload supporting documents (optional)
   - Click "Generate AI Survey" to create the study

2. **View Study Details**
   - Click on any study card from the Dashboard
   - View program details in the first tab
   - See AI-generated insights, sample size, and survey questions in the "AI Insights" tab

3. **Delete a Study**
   - Click the trash icon on any study card
   - Confirm the deletion

## 🔐 Environment Variables

```env
# Database
DATABASE_URL=postgresql://user:password@host:port/database
PGHOST=localhost
PGPORT=5432
PGUSER=your_user
PGPASSWORD=your_password
PGDATABASE=your_database

# Session
SESSION_SECRET=your_session_secret_here

# OpenAI (if using Replit AI Integrations, these are auto-configured)
AI_INTEGRATIONS_OPENAI_API_KEY=your_openai_api_key
AI_INTEGRATIONS_OPENAI_BASE_URL=https://api.openai.com/v1
```

## 🧪 Testing

The application includes end-to-end tests using Playwright for critical user flows:
- Creating an impact study
- AI survey generation
- Viewing study details
- Deleting studies

## 🤝 Contributing

This is a prototype application. For production use, consider:
- Adding user authentication
- Implementing role-based access control
- Adding file upload storage (S3, etc.)
- Enhanced error handling and logging
- Comprehensive testing suite
- Performance optimization

## 📄 License

MIT License - feel free to use this project as a starting point for your own L&D impact measurement tools.

## 🙏 Acknowledgments

- Built with [Replit](https://replit.com)
- UI components from [Shadcn UI](https://ui.shadcn.com)
- AI powered by [OpenAI GPT-5](https://openai.com)
- Icons from [Lucide](https://lucide.dev)

/**
 * Application-wide constants
 */

// API Endpoints
export const API_ENDPOINTS = {
  STUDIES: "/api/studies",
  GENERATE_SURVEY: "/api/generate-survey",
} as const;

// Program Types
export const PROGRAM_TYPES = [
  "Leadership Development",
  "Technical Skills",
  "Soft Skills",
  "Compliance Training",
  "Onboarding",
  "Professional Development",
  "Other",
] as const;

// Sectors
export const SECTORS = [
  "Technology",
  "Healthcare",
  "Finance",
  "Education",
  "Manufacturing",
  "Retail",
  "Consulting",
  "Government",
  "Non-Profit",
  "Other",
] as const;

// Stakeholder Types
export const STAKEHOLDER_TYPES = [
  "Senior Management",
  "HR Team",
  "Finance Department",
  "Department Managers",
  "Team Members",
  "External Consultants",
] as const;

// Study Status
export const STUDY_STATUS = {
  DRAFT: "Draft",
  COMPLETED: "Completed",
} as const;

// Kirkpatrick Levels
export const KIRKPATRICK_LEVELS = {
  REACTION: "Level 1: Reaction",
  LEARNING: "Level 2: Learning",
  BEHAVIOR: "Level 3: Behavior",
  RESULTS: "Level 4: Results",
} as const;

// Question Audiences
export const QUESTION_AUDIENCES = ["Participant", "Manager", "HR"] as const;

// Question Types
export const QUESTION_TYPES = ["Rating Scale", "Multiple Choice", "Open-ended"] as const;

// OpenAI Model
export const OPENAI_MODEL = "gpt-5" as const;

// Error Messages
export const ERROR_MESSAGES = {
  FETCH_STUDIES: "Unable to retrieve studies. Please try again.",
  FETCH_STUDY: "Unable to retrieve study. Please try again.",
  CREATE_STUDY: "Unable to create study. Please try again.",
  UPDATE_STUDY: "Unable to update study. Please try again.",
  DELETE_STUDY: "Unable to delete study. Please try again.",
  GENERATE_SURVEY: "Unable to generate survey. Please try again.",
  VALIDATION_FAILED: "Please check your input and try again.",
  UNKNOWN_ERROR: "An unexpected error occurred. Please try again.",
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  STUDY_CREATED: "Impact study created successfully!",
  STUDY_UPDATED: "Study updated successfully.",
  STUDY_DELETED: "The impact study has been deleted successfully.",
} as const;

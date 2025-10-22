# Pelican App Design Guidelines

## Design Approach
**Selected Approach:** Design System - Modern Productivity Tool  
**Inspiration:** Linear, Notion, Asana - clean data management with focus on usability and efficiency  
**Rationale:** This is a utility-focused, data-intensive application for program analysts. Clarity, efficiency, and professional polish take precedence over decorative elements.

## Core Design Principles
1. **Information Hierarchy First** - Multi-step workflows require clear visual progression and status indicators
2. **Data Clarity** - Forms, metrics, and insights must be scannable and unambiguous
3. **Professional Polish** - Enterprise users expect refined, trustworthy interfaces
4. **Purposeful Minimalism** - Every element serves the user's workflow

---

## Color Palette

### Brand Colors
**Primary (Teal):** 158 55% 45% - Used for primary actions, active states, key metrics  
**Secondary (Light Teal):** 174 45% 94% - Subtle backgrounds, card surfaces, section dividers  
**Accent (Golden Yellow):** 43 89% 60% - Sparingly for highlights, warnings, attention-drawing elements

### Functional Colors
**Success:** 142 70% 45% - Completed steps, positive metrics  
**Warning:** 38 92% 50% - Needs attention, pending items  
**Error:** 0 70% 50% - Missing data, validation errors  
**Info:** 210 80% 55% - Informational callouts, tips

### Neutrals
**Text Primary:** 0 0% 13% - Body text, headers  
**Text Secondary:** 0 0% 40% - Supporting text, labels  
**Text Muted:** 0 0% 60% - Placeholders, disabled states  
**Border:** 0 0% 88% - Dividers, input borders  
**Background:** 0 0% 98% - Page background  
**Surface:** 0 0% 100% - Cards, modals, elevated content

---

## Typography

**Font Family:** 'Poppins', system-ui, sans-serif

### Hierarchy
- **Hero Text:** 600 weight, 2.5rem (mobile), 3.5rem (desktop)
- **Page Titles:** 600 weight, 2rem (mobile), 2.5rem (desktop)
- **Section Headers:** 600 weight, 1.5rem
- **Card Titles:** 500 weight, 1.125rem
- **Body Text:** 400 weight, 1rem, 1.6 line-height
- **Labels/Meta:** 500 weight, 0.875rem, uppercase tracking
- **Captions:** 400 weight, 0.875rem

---

## Layout System

**Spacing Units:** Consistently use Tailwind units: 1, 2, 3, 4, 6, 8, 12, 16, 20, 24  
**Common Patterns:**
- Component padding: p-4 to p-6
- Section spacing: py-12 to py-16
- Card gaps: gap-4 to gap-6
- Container max-width: max-w-7xl

**Grid Structure:**
- Dashboard: Left sidebar (280px fixed) + Main content (fluid)
- Study cards: grid-cols-1 md:grid-cols-2 xl:grid-cols-3
- Form wizard: Single column max-w-3xl centered
- Multi-column forms: grid-cols-1 md:grid-cols-2 for grouped inputs

---

## Component Library

### Navigation
**Sidebar:** Fixed left, 280px width, teal background (158 55% 45%), white text with hover states (lighter teal bg 158 55% 55%). Active item has golden accent border-left (4px).

### Cards
**Study Cards:** White background, rounded-lg (8px), shadow-sm with hover:shadow-md transition. Include: study name (600 weight), progress bar (teal fill, light gray track), percentage text (text-sm muted), status badge (rounded-full px-3 py-1), "View Study" button.

### Progress Indicators
**Step Wizard:** Horizontal step indicator with circles connected by lines. Active step: teal fill, completed: teal with checkmark, upcoming: light gray outline. Include step numbers and labels below.

**Progress Bars:** Height 8px, rounded-full, teal fill on light gray track. Always show percentage text adjacent.

### Forms
**Input Fields:** Border gray, rounded-md, p-3, focus:ring-2 ring-teal. Labels above (font-medium, text-sm). Group related fields with subtle background (light teal 174 45% 97%).

**Dropdowns:** Custom styled select with chevron icon, matching input styling.

**File Upload:** Dashed border area with drag-drop zone, upload icon, "Drop files here or click to browse" text. Show uploaded files as dismissible chips with file type icons.

### Buttons
**Primary:** Teal background, white text, px-6 py-3, rounded-md, font-medium, hover darker (158 55% 40%)  
**Secondary:** White background, teal border and text, same sizing  
**Ghost:** Transparent, teal text, hover light teal bg

### Data Display
**Metrics Cards:** White card, large number (2rem, 600 weight), label below (text-sm muted), optional trend indicator (up/down arrow with percentage).

**Recommendations List:** Cards with left accent border (golden yellow 4px), icon, title, description text.

**Gap Analysis:** Table format with alternating row backgrounds, status badges (green for complete, yellow for pending, red for missing).

### Modals & Overlays
**Modals:** Centered, max-w-2xl, white background, rounded-lg, shadow-xl, with backdrop blur. Header with title and close button, content area, footer with action buttons.

---

## Key Screens Layout

### Dashboard Home
- Fixed left sidebar with logo, navigation links, user profile at bottom
- Main content: Welcome header with "Start New Impact Study" primary button, grid of existing study cards (3 columns desktop, 2 tablet, 1 mobile)

### Multi-Step Wizard
- Progress indicator at top showing all 10 steps
- Form content centered (max-w-3xl), white card background
- Navigation buttons at bottom: "Back" (secondary) and "Continue" (primary) right-aligned

### Study Detail Page
- Breadcrumb navigation
- Study header with title, status badge, progress percentage
- Tabs for different views (Overview, Data, Insights, Team)
- Overview includes: progress visualization, recommendations cards, gap analysis table, timeline

### AI-Generated Outputs
- Survey preview in editable list format, each question in a card with edit/delete icons
- Interview recommendations in clean table with suggested sample size prominently displayed
- Study summary with AI insights in callout boxes (light teal background, info icon)

---

## Images
**No hero images needed** - This is a data-focused productivity tool. Use icons and illustrations sparingly:
- Empty state illustrations for "No studies yet" (simple line art, teal accent)
- File type icons for uploaded documents
- Small icons for navigation and feature highlights
- Avatar placeholders for team members

---

## Interactions
**Minimal animations:**
- Smooth transitions on hover states (150ms)
- Page transitions: fade-in content
- Progress bar fills animate smoothly
- Form validation: shake animation on error

**No distracting effects** - Focus on clarity and speed.
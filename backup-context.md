# Backup Context - NEU Class Manager

## 📋 Project Overview

**Project Name:** NEU Class Manager  
**Purpose:** A comprehensive web application for managing classes and conducting midterm exams at NEU. Features include score lookup, online exam taking, and automatic grading.  
**Status:** ✅ Production Ready & Deployed  
**Last Updated:** January 2025  

## 🎯 Core Features

### Score Lookup System
- ✅ Multi-class exam score lookup
- ✅ Class selection dropdown (Thứ 5, tiết 7-8 / Thứ 4, tiết 5-6)
- ✅ Student search by name (Tên) and student ID (MSV)
- ✅ Dynamic table querying based on selected class
- ✅ Real-time database query with Supabase

### Online Exam System
- ✅ Randomized 40-question selection from 87-question bank
- ✅ 4 fixed test versions with shuffled answer choices
- ✅ Sequential test version assignment per student
- ✅ Automatic scoring (0.25 points per correct answer)
- ✅ Response storage with detailed tracking
- ✅ One-time access enforcement

### User Interface
- ✅ Professional, responsive UI with enhanced styling
- ✅ Vietnamese text support with UTF-8 encoding
- ✅ Comprehensive error handling and loading states
- ✅ Multi-table connection testing capabilities
- ✅ High contrast input fields for better visibility
- ✅ Accessibility features (ARIA labels, keyboard navigation)
- ✅ Navigation between score lookup and exam pages
- ✅ Custom background image (bg.jpg) applied to all pages with semi-transparent overlay for readability

## 🛠️ Technology Stack

### Frontend
- **Framework:** Next.js 15 with App Router
- **Language:** TypeScript
- **UI Library:** React 19
- **Styling:** TailwindCSS 4
- **Build Tool:** Turbopack

### Backend & Database
- **Database:** Supabase (PostgreSQL)
- **Client:** @supabase/supabase-js v2.58.0
- **Authentication:** Anonymous access with API keys
- **Randomization:** seedrandom library for deterministic shuffling

### Deployment
- **Platform:** Vercel
- **Domain:** https://neu-class-manager.vercel.app
- **GitHub Integration:** Automatic deployment from main branch

## 📁 Project Structure

```
/Users/nguyennghia/PROJECT/NEU_CLASS_MANAGER/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Home page (Score Lookup)
│   │   ├── layout.tsx            # App layout
│   │   ├── globals.css           # Global styles
│   │   └── exam/
│   │       └── page.tsx          # Exam taking page
│   ├── lib/
│   │   ├── supabase.ts           # Database client configuration
│   │   ├── types.ts              # TypeScript interfaces
│   │   ├── examGenerator.ts      # Test generation logic
│   │   └── examStorage.ts        # Response storage logic
│   └── components/
│       └── ConnectionTest.tsx    # Database connection testing
├── .env.local                    # Environment variables
├── .env.example                  # Environment template
├── .gitignore                    # Git ignore rules
├── vercel.json                   # Vercel deployment config
├── package.json                  # Dependencies and scripts
├── tailwind.config.ts            # TailwindCSS configuration
├── tsconfig.json                 # TypeScript configuration
├── README.md                     # Project documentation
├── deploy.md                     # Deployment instructions
├── PROJECT_SUMMARY.md            # Project summary
└── backup-context.md             # This file
```

## 🔗 External Services & Credentials

### GitHub Repository
- **URL:** https://github.com/nghianguyen7171/NEU_Class_Manager.git
- **Branch:** main
- **Status:** ✅ Connected and synced

### Supabase Database
- **Project URL:** https://asxhozsfmlmsrflmzizr.supabase.co
- **Anon Key:** eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFzeGhvenNmbWxtc3JmbG16aXpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1Njc2OTAsImV4cCI6MjA3NTE0MzY5MH0.EpsZVx-IPkH078KCeW-YCI_RWhs46LrgbujalXvf48Q
- **Table Name:** `DS_Thurs _7_8_Midterm.csv`

### Database Schema

**Score Lookup Tables:**

**Table 1:** `DS_Thurs _7_8_Midterm.csv` (Thứ 5, tiết 7-8)
```sql
create table public."DS_Thurs _7_8_Midterm.csv" (
  "Tên" text null,
  "MSV" bigint not null,
  "Số câu đúng" text null,
  "Điểm" text null,
  constraint DS_Thurs _7_8_Midterm.csv_pkey primary key ("MSV")
) TABLESPACE pg_default;
```

**Table 2:** `DS_Wed _5_6_Midterm.csv` (Thứ 4, tiết 5-6)
```sql
create table public."DS_Wed _5_6_Midterm.csv" (
  "Tên" text null,
  "MSV" bigint not null,
  "Số câu đúng" text null,
  "Điểm" text null,
  constraint DS_Wed _5_6_Midterm.csv_pkey primary key ("MSV")
) TABLESPACE pg_default;
```

**Exam System Tables:**

**Question Bank:** `test_library_lec1_lec6.csv` (87 questions)
- Columns: Text đáp án, Lựa chọn A, Lựa chọn B, Lựa chọn C, Lựa chọn D, Đáp án đúng, Điểm

**Response Table:** `exam_responses` (created by running supabase_setup.sql)
- Columns: id, created_at, student_name, student_id, test_version, responses (JSONB), total_score

### Vercel Deployment
- **Production URL:** https://neu-class-manager.vercel.app
- **Project ID:** nghia-nguyens-projects-e8ff0ad6/neu-class-manager
- **Framework:** Next.js (auto-detected)
- **Environment Variables:** Configured in Vercel dashboard

## 💻 Key Code Files

### Main Application (src/app/page.tsx)
- React component with TypeScript
- Form handling for student name and ID input
- Multiple search strategies for database queries
- Error handling and loading states
- Responsive UI with TailwindCSS
- Navigation between score lookup and exam pages

### Exam Page (src/app/exam/page.tsx)
- 3-phase exam interface (entry, exam, completion)
- 40-question single-scroll layout
- Automatic scoring with instant results
- One-time access enforcement
- Sequential test version assignment

### Database Client (src/lib/supabase.ts)
```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://asxhozsfmlmsrflmzizr.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface ExamScore {
  Tên: string
  MSV: number
  'Số câu đúng': string
  'Điểm': string
}
```

### Exam Generator (src/lib/examGenerator.ts)
- Fetches 87 questions from Supabase
- Randomly selects 40 questions using fixed seed
- Creates 4 test versions with shuffled choices
- Uses seedrandom for deterministic randomization

### Exam Storage (src/lib/examStorage.ts)
- Saves student responses to Supabase
- Calculates scores automatically
- Stores detailed question-level data
- Prevents duplicate submissions

### Connection Test Component (src/components/ConnectionTest.tsx)
- Database connectivity testing
- Error reporting for troubleshooting
- User-friendly interface for debugging

## 🚀 Deployment Information

### Environment Variables
```bash
NEXT_PUBLIC_SUPABASE_URL=https://asxhozsfmlmsrflmzizr.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Build Commands
```bash
npm run dev          # Development server
npm run build        # Production build
npm start            # Production server
npm run lint         # Code linting
```

### Vercel Configuration (vercel.json)
```json
{
  "name": "neu-class-manager",
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "env": {
    "NEXT_PUBLIC_SUPABASE_URL": "https://asxhozsfmlmsrflmzizr.supabase.co",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

## 📦 Dependencies

### Production Dependencies
```json
{
  "@supabase/supabase-js": "^2.58.0",
  "next": "15.5.4",
  "react": "19.1.0",
  "react-dom": "19.1.0"
}
```

### Development Dependencies
```json
{
  "@eslint/eslintrc": "^3",
  "@tailwindcss/postcss": "^4",
  "@types/node": "^20",
  "@types/react": "^19",
  "@types/react-dom": "^19",
  "eslint": "^9",
  "eslint-config-next": "15.5.4",
  "tailwindcss": "^4",
  "typescript": "^5"
}
```

## 🔧 Recent Changes & Fixes

### Latest Updates
1. **Fixed table mapping** - Corrected class-to-table mapping (Thứ 5, tiết 7-8 → DS_Thurs _7_8_Midterm.csv)
2. **Updated page title** - Changed browser tab from "Create Next App" to "NEU Class Manager - Tra Cứu Điểm Thi"
3. **Enhanced UI/UX** - Professional styling with gradients, shadows, and better typography
4. **Multi-table connection testing** - ConnectionTest now tests all available tables
5. **Improved accessibility** - Added ARIA labels, keyboard navigation, and focus states
6. **Enhanced results display** - Better visual hierarchy with card-based layout
7. **Updated documentation** - Comprehensive backup context for future AI sessions

### Search Strategies Implemented
1. Exact match with trimmed values
2. MSV as string instead of number
3. Case-insensitive name search with `ilike`

## 🎨 UI/UX Features

### Design Elements
- Enhanced gradient background (blue-100 via indigo-50 to purple-100)
- Professional card-based layout with enhanced shadows
- Emoji-enhanced results display with better visual hierarchy
- Responsive design optimized for mobile/desktop
- High contrast input fields with hover/focus states
- Loading states with animated spinners
- Professional error messages with color-coded status
- Class selection dropdown with smooth transitions
- Enhanced typography with better font weights and spacing

### Vietnamese Text Support
- UTF-8 encoding throughout
- Proper Vietnamese character display
- Localized error messages
- Cultural appropriate emoji usage

## 🧪 Testing & Validation

### Connection Testing
- Database connectivity verification
- Table access confirmation
- Error reporting for troubleshooting

### Browser Compatibility
- Chrome, Firefox, Safari, Edge support
- Mobile responsive design
- Cross-platform compatibility

## 📊 Current Status

### ✅ Completed
- Database connection established
- Score lookup functionality working
- Online exam system implemented
- 4 test versions with randomized questions
- Automatic grading system
- Response storage to Supabase
- UI/UX optimized
- Deployed to production
- GitHub integration active
- Error handling comprehensive

### 🔄 Maintenance Tasks
- Regular data updates in Supabase
- Monitor Vercel deployment status
- Update dependencies as needed
- Monitor user feedback

## 🚨 Troubleshooting Guide

### Common Issues
1. **"No record found"** - Check if data exists in database table
2. **Connection errors** - Verify Supabase credentials
3. **White text in inputs** - Fixed with explicit text color classes
4. **Deployment issues** - Check Vercel build logs

### Debug Tools
- Connection test component available
- Console logging for errors
- Vercel deployment logs accessible

## 📞 Support Information

### Repository
- **GitHub:** https://github.com/nghianguyen7171/NEU_Class_Manager.git
- **Owner:** nghianguyen7171

### Live Application
- **URL:** https://neu-class-manager.vercel.app
- **Status:** ✅ Active and functional

### Database
- **Supabase Project:** asxhozsfmlmsrflmzizr
- **Score Tables:** DS_Thurs _7_8_Midterm.csv, DS_Wed _5_6_Midterm.csv
- **Exam Tables:** test_library_lec1_lec6.csv, exam_responses

---

## 🤖 AI Readiness Status

**Status:** 100% Ready

This backup context contains all essential information for AI sessions:
- ✅ Complete project structure
- ✅ All code file locations and purposes
- ✅ Database schemas and connections
- ✅ Deployment information
- ✅ Feature specifications
- ✅ Technology stack details
- ✅ Troubleshooting guidelines

---

## 📝 Change Log

### January 2025
- **Background Image Implementation**: Added `bg.jpg` as background image to all pages (home, lookup, exam)
  - Copied `bg.jpg` from `logo/` folder to `public/` folder for Next.js access
  - Applied fixed background image with Next.js `Image` component using `fill` prop
  - Added semi-transparent white overlay (`bg-white/80`) with backdrop blur for text readability
  - Updated all three pages: `src/app/page.tsx`, `src/app/lookup/page.tsx`, `src/app/exam/page.tsx`
  - Fixed div structure issues in exam page (Phase 1, 2, and 3 sections)
  - Deployed to Vercel successfully

### December 2024
- **Homepage Redesign**: Moved score lookup to `/lookup` sub-page, created new home page with hero section
- **Logo Integration**: Added NEU, NCT, and FDA logos to all pages, standardized sizes to 150x150
- **Summary Table Auto-Update**: Enabled automatic trigger for `DS_Fri_1_2_Midterm.csv` table updates
- **Exam System Refinements**: Reshuffled test bank, hid scores from students after submission
- **Multi-Class Support**: Added third class option "Thứ 6, tiết 1-2" for online exam results

---

**Note:** This backup context file should be updated whenever significant changes are made to the project structure, dependencies, or deployment configuration.

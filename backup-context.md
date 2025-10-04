# Backup Context - NEU Class Manager Exam Score Lookup

## 📋 Project Overview

**Project Name:** Exam Score Lookup Website  
**Purpose:** A web application that allows students to look up their midterm exam scores from a Supabase database  
**Status:** ✅ Production Ready & Deployed  
**Last Updated:** October 2025  

## 🎯 Core Features

- ✅ Student search by name (Tên) and student ID (MSV)
- ✅ Real-time database query with Supabase
- ✅ Clean, responsive UI with TailwindCSS
- ✅ Vietnamese text support with UTF-8 encoding
- ✅ Error handling and loading states
- ✅ Connection testing capabilities
- ✅ High contrast input fields for better visibility

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

### Deployment
- **Platform:** Vercel
- **Domain:** https://neu-class-manager.vercel.app
- **GitHub Integration:** Automatic deployment from main branch

## 📁 Project Structure

```
/Users/nguyennghia/PROJECT/NEU_CLASS_MANAGER/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Main lookup interface
│   │   ├── layout.tsx            # App layout
│   │   └── globals.css           # Global styles
│   ├── lib/
│   │   └── supabase.ts           # Database client configuration
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
```sql
create table public."DS_Thurs _7_8_Midterm.csv" (
  "Tên" text null,
  "MSV" bigint not null,
  "Số câu đúng" text null,
  "Điểm" text null,
  constraint DS_Thurs _7_8_Midterm.csv_pkey primary key ("MSV")
) TABLESPACE pg_default;
```

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
1. **Fixed database table name** - Changed from `DS_Thurs_7_8_Midterm` to `DS_Thurs _7_8_Midterm.csv`
2. **Corrected data types** - MSV as number, scores as strings
3. **Enhanced search algorithm** - Multiple search strategies for better matching
4. **Improved input contrast** - Fixed white text visibility issue in some browsers
5. **Removed debug components** - Cleaned up production interface
6. **Added comprehensive error handling** - Better user experience

### Search Strategies Implemented
1. Exact match with trimmed values
2. MSV as string instead of number
3. Case-insensitive name search with `ilike`

## 🎨 UI/UX Features

### Design Elements
- Gradient background (blue to indigo)
- Card-based layout with shadows
- Emoji-enhanced results display
- Responsive design for mobile/desktop
- High contrast input fields
- Loading states with spinners
- Professional error messages

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
- Search functionality working
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
- **Table:** DS_Thurs _7_8_Midterm.csv

---

**Note:** This backup context file should be updated whenever significant changes are made to the project structure, dependencies, or deployment configuration.

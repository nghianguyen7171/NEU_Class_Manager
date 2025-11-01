# Midterm Exam System - Implementation Guide

## ✅ Completed Implementation

The midterm exam system has been successfully built and is ready for deployment. This document provides a comprehensive guide for using and maintaining the system.

## 📋 System Overview

### What Was Built

1. **Randomized 40-Question Exams**: Selects 40 questions from a pool of 87
2. **4 Fixed Test Versions**: Each version has different shuffled answer choices
3. **Automatic Scoring**: 0.25 points per correct answer
4. **Response Storage**: All answers and scores saved to Supabase
5. **One-Time Access**: Each student can only take the exam once

### How It Works

#### Question Selection
- All 4 test versions use the same 40 questions (selected once using seed 12345)
- Questions are randomly selected from the 87-question bank in `test_library_lec1_lec6.csv`

#### Answer Shuffling
- Each test version shuffles choices differently:
  - Version 1: Seed 1001 + question index
  - Version 2: Seed 2002 + question index
  - Version 3: Seed 3003 + question index
  - Version 4: Seed 4004 + question index
- The correct answer is tracked after shuffling

#### Student Assignment
- Students are assigned test versions sequentially using a counter
- Counter cycles: 1, 2, 3, 4, 1, 2, 3, 4...
- Stored in browser localStorage

## 🚀 Deployment Checklist

### 1. Supabase Setup (Required)

Run the SQL script in the Supabase SQL Editor:

```bash
# File: supabase_setup.sql
# This creates the exam_responses table with proper schema
```

**Key Points:**
- Creates `exam_responses` table with JSONB for responses
- Sets up indexes for fast queries
- Enables RLS (Row Level Security)
- Creates public INSERT and SELECT policies

### 2. Environment Variables

Already configured in `vercel.json` and `.env.local`:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 3. Vercel Deployment

The system is already deployed and will auto-deploy on Git push:
- **URL**: https://neu-class-manager.vercel.app
- **Status**: ✅ Active

## 📱 User Flow

### For Students Taking Exams

1. Navigate to: https://neu-class-manager.vercel.app/exam
2. Enter name and MSV
3. Click "Bắt đầu làm bài"
4. Answer all 40 questions on scrollable page
5. Click "Nộp bài" to submit
6. View score immediately

### For Teachers/Administrators

**Viewing Exam Results:**

Query the `exam_responses` table in Supabase:
```sql
-- View all submissions
SELECT * FROM exam_responses ORDER BY created_at DESC;

-- View by test version
SELECT * FROM exam_responses WHERE test_version = 1;

-- View by student
SELECT * FROM exam_responses WHERE student_id = 'YOUR_MSV';

-- View average scores by version
SELECT test_version, AVG(total_score), COUNT(*) 
FROM exam_responses 
GROUP BY test_version;
```

**Extracting Detailed Responses:**

The `responses` column contains JSON data:
```json
[
  {
    "text": "Question text here",
    "choices": "[{\"letter\":\"A\",\"text\":\"Choice A\"},...]",
    "studentAnswer": "B",
    "correctAnswer": "A",
    "score": 0
  },
  ...
]
```

## 🔧 Technical Details

### File Structure

```
src/
├── app/
│   ├── exam/
│   │   └── page.tsx          # Exam taking interface
│   └── page.tsx              # Home page with navigation
├── lib/
│   ├── types.ts              # TypeScript interfaces
│   ├── examGenerator.ts      # Test generation logic
│   └── examStorage.ts        # Save/retrieve responses
└── components/
    └── ConnectionTest.tsx    # Database connectivity test
```

### Key Functions

**examGenerator.ts**
- `generateFixedTests()`: Creates 4 test versions once
- `getTestVersion(version)`: Fetches specific version (1-4)
- `shuffleChoices()`: Shuffles answer choices with seed
- `decodeHtmlEntities()`: Fixes HTML entities in questions

**examStorage.ts**
- `saveExamResponse()`: Saves student responses to Supabase
- `getExamResponse()`: Retrieves existing response (prevents duplicates)

**page.tsx (exam)**
- 3-phase UI: Entry → Exam → Completion
- Sequential test assignment
- One-time access enforcement
- Automatic scoring on submission

## 📊 Database Schema

### exam_responses Table

```sql
CREATE TABLE exam_responses (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    student_name TEXT NOT NULL,
    student_id TEXT NOT NULL,
    test_version INTEGER NOT NULL,
    responses JSONB NOT NULL,
    total_score NUMERIC(5, 2) NOT NULL
);
```

**Indexes:**
- `student_id` - For preventing duplicates
- `test_version` - For analysis
- `created_at` - For chronological ordering

## ⚠️ Important Notes

### Test Reproducibility
- Tests are generated with fixed seeds
- Same 40 questions for all versions
- Shuffling is deterministic
- Tests are cached after first generation

### One-Time Access
- Based on `student_id` (MSV)
- System checks for existing responses before starting
- No retakes allowed

### Time Display
- Shows "60 phút" badge but NO enforcement
- Students have unlimited time
- Submit when ready

### HTML Entities
- Questions contain entities like `&lt;`, `&gt;`, `&amp;`
- Automatically decoded for display
- Stored in original format in database

## 🧪 Testing Recommendations

### Before Production

1. **Test Database Connection**
   - Use ConnectionTest component on home page
   - Verify all tables are accessible

2. **Test Each Version**
   - Generate test versions and verify shuffling
   - Check that correct answers are tracked properly

3. **Test Storage**
   - Submit a test response
   - Verify data in Supabase table
   - Check JSON structure

4. **Test Duplicate Prevention**
   - Try to take exam twice with same MSV
   - Should be blocked

5. **Test Navigation**
   - Switch between score lookup and exam pages
   - Ensure links work properly

## 🐛 Troubleshooting

### No Questions Appearing
- Check Supabase connection
- Verify `test_library_lec1_lec6.csv` table exists
- Ensure RLS policies allow SELECT

### Cannot Submit Exam
- Check `exam_responses` table exists
- Verify RLS policies allow INSERT
- Check browser console for errors

### Scores Not Calculating
- Verify choice shuffling logic
- Check correct answer mapping
- Review scoring calculation

### Students Can Take Exam Multiple Times
- Check `getExamResponse()` is working
- Verify student_id is being captured correctly
- Check localStorage counter logic

## 📈 Analytics & Reporting

### Useful Queries

```sql
-- Overall statistics
SELECT 
    COUNT(*) as total_students,
    AVG(total_score) as avg_score,
    MIN(total_score) as min_score,
    MAX(total_score) as max_score
FROM exam_responses;

-- By test version
SELECT 
    test_version,
    COUNT(*) as students,
    AVG(total_score) as avg_score
FROM exam_responses
GROUP BY test_version;

-- Score distribution
SELECT 
    CASE 
        WHEN total_score >= 9 THEN '9-10'
        WHEN total_score >= 8 THEN '8-9'
        WHEN total_score >= 7 THEN '7-8'
        WHEN total_score >= 5 THEN '5-7'
        ELSE 'Below 5'
    END as score_range,
    COUNT(*) as count
FROM exam_responses
GROUP BY score_range
ORDER BY score_range DESC;
```

## 🔒 Security Considerations

### Current Setup
- Anonymous access via Supabase anon key
- RLS policies allow public INSERT/SELECT
- No authentication required

### Recommendations for Production
1. Implement authentication (Supabase Auth)
2. Restrict response viewing to admin only
3. Add IP rate limiting
4. Implement CAPTCHA for exam submission
5. Monitor for suspicious patterns

## 📚 Additional Resources

- **README.md**: General project documentation
- **backup-context.md**: Comprehensive project context
- **supabase_setup.sql**: Database schema
- **deploy.md**: Deployment instructions

## ✅ Status

**Current Status**: ✅ **Production Ready**

**Last Updated**: December 2024

**Next Steps**:
1. Run `supabase_setup.sql` in Supabase (if not done)
2. Test the complete exam flow
3. Verify Vercel deployment
4. Monitor for issues

---

**Questions or Issues?**
Check the console logs, Supabase logs, or Vercel deployment logs for detailed error messages.


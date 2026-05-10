# Backup Context - NEU Class Manager

## 📋 Project Overview

**Project Name:** NEU Class Manager  
**Purpose:** Web app tra cứu điểm và thi online (ưu tiên **Mar3_K56_KTQD**, **Mar12_K56**). **Sample** = roster 5 SV + bảng/trigger như Mar (chỉ để thử quy trình). **CLC66D không thi qua app này** (xem Core Features).  
**Status:** ✅ Production Ready & Deployed  
**Last Updated:** May 10, 2026 (Sample class đã push `main` — `11c8f9a`; SQL Supabase đã chạy theo xác nhận user)

## 🎯 Core Features

### Score Lookup System
- ✅ Exam score lookup for **Mar3_K56_KTQD** (formerly “Chủ nhật”), **Mar12_K56**, và **Sample (thử nghiệm)** với exam-term (**Giữa kỳ/Cuối kỳ**); **CLC66D** trong dropdown là tùy chọn (lớp không thi trên app)
- ✅ Class + term maps tới roster (tới **8** bảng nếu gồm CLC66D + Sample + 2 lớp Mar):
  - Midterm: `DS_wed_CLC66D_Midterm.csv` *(tùy chọn)*, `DS_Mar3_K56_KTQD_Midterm.csv`, `DS_Mar12_K56_Midterm.csv`, `DS_Sample_Midterm.csv`
  - Final: `DS_wed_CLC66D_Final.csv` *(tùy chọn)*, `DS_Mar3_K56_KTQD_Final.csv`, `DS_Mar12_K56_Final.csv`, `DS_Sample_Final.csv`
- ✅ Student search by name (Tên) and student ID (MSV)
- ✅ PostgREST `select` on the chosen roster table (no merge with `exam_responses`)
- ✅ Anti-stale `fetch` headers in `supabase.ts` (`cache: 'no-store'`, `Cache-Control`, `Pragma`)
- ✅ Browser autocomplete disabled for privacy

### Online Exam System
- ℹ️ **Phạm vi lớp:** Luồng `/exam` + `exam_responses` / `final_exam_responses` + trigger roster — **Mar3_K56_KTQD**, **Mar12_K56**, và **Sample** (MSV 99010001–99010005 để test). **CLC66D** không thi qua app.
- ✅ Four fixed 40-question sets from 87-question bank; **per-question** shuffle of four choices with deterministic seed (`examGenerator.ts` — labels A–D apply to positions after shuffle)
- ✅ 4 test versions; assignment via Supabase RPC **`assign_test_version(p_student_id)`** — global round-robin `1→2→3→4→1` with **one fixed version per MSV** (tables `exam_assignments`, `exam_version_counter`; see `supabase_exam_version_allocator.sql`)
- ✅ One row per MSV in `exam_responses` enforced at start (`getExamResponse`)
- ✅ Automatic scoring (0.25 points per correct answer)
- ✅ Response storage with detailed tracking in `exam_responses`
- ℹ️ `testVersionFromStudentId()` remains in `examGenerator.ts` for reference/scripts; **`/exam` does not use it** for version selection.
- ✅ Final exam flow uses `final_exam_all` question bank with lecture-stratified randomization:
  - Quotas: Lec1:5, Lec2:6, Lec3:6, Lec4:6, Lec5:5, Lec6:5, Lec7:5, Lec8:2
  - One fixed final exam per MSV via `seedFromStudentId(MSV)` (`FINAL_EXAM_SALT`)
  - Submission saved in `final_exam_responses` (separate from midterm table)

### User Interface
- ✅ Professional, responsive UI with enhanced styling
- ✅ Vietnamese text support with UTF-8 encoding
- ✅ Comprehensive error handling and loading states
- ✅ Connection test on **eight** lookup roster tables (CLC66D + Mar3 + Mar12 + Sample × mid/final); ưu tiên kiểm tra Mar3, Mar12, Sample khi test quy trình
- ✅ High contrast input fields for better visibility
- ✅ Accessibility features (ARIA labels, keyboard navigation)
- ✅ Navigation between score lookup and exam pages
- ✅ Custom background image (bg.jpg) applied to all pages with semi-transparent overlay (30% opacity) for readability
- ✅ High-contrast white background container for main page text with shadows and blur effects
- ✅ Browser autocomplete disabled for privacy on name and MSV input fields

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
│   │   ├── page.tsx              # Home page with hero section
│   │   ├── lookup/
│   │   │   └── page.tsx          # Score lookup page
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
├── public/
│   ├── bg.jpg                    # Background image for all pages
│   └── logo/
│       ├── NEU logo.png          # NEU logo
│       ├── LogoNCT.png           # NCT logo
│       └── FDA logo_đen nền trắng.png  # FDA logo (white background version)
├── logo/                         # Source logo folder
├── README.md                     # Project documentation
├── deploy.md                     # Deployment instructions
├── PROJECT_SUMMARY.md            # Project summary
├── supabase_setup.sql            # exam_responses + RLS
├── supabase_exam_version_allocator.sql  # RPC assign_test_version + counter/assignments
├── supabase_wed_clc66d_midterm_sync.sql # CLC66D roster sync (legacy/optional; lớp CLC66D không thi trên app)
├── supabase_create_wed_clc66d_midterm_table.sql
├── supabase_import_wed_clc66d_midterm.sql
├── supabase_verify_wed_clc66d_midterm.sql
├── supabase_sun_midterm_sync.sql # Legacy: Sunday roster sync (replaced by rename migration)
├── supabase_create_final_exam_all.sql
├── supabase_create_final_exam_responses.sql
├── supabase_create_wed_clc66d_final_table.sql
├── supabase_create_sun_final_table.sql # Legacy: created old DS_Sun_Final.csv (now renamed)
├── supabase_wed_clc66d_final_sync.sql
├── supabase_sun_final_sync.sql # Legacy: replaced by rename migration
├── supabase_rename_sun_to_mar3_k56_ktqd.sql # Class rename migration (Sun → Mar3_K56_KTQD)
├── supabase_create_mar12_k56_midterm_table.sql
├── supabase_import_mar12_k56_midterm.sql
├── supabase_verify_mar12_k56_midterm.sql
├── supabase_mar12_k56_midterm_sync.sql
├── supabase_create_mar12_k56_final_table.sql
├── supabase_mar12_k56_final_sync.sql
├── supabase_create_sample_midterm_table.sql
├── supabase_import_sample_midterm.sql
├── supabase_verify_sample_midterm.sql
├── supabase_sample_midterm_sync.sql
├── supabase_create_sample_final_table.sql
├── supabase_sample_final_sync.sql
├── new_class/DS_Mar12_K56_Midterm.csv   # Mar12_K56 (62 SV)
├── new_class/DS_Sample_Midterm.csv      # Sample (5 SV, MSV 99010001–99010005)
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
- **Lookup tables (PostgREST / app):** thêm **`DS_Sample_Midterm.csv` / `DS_Sample_Final.csv`** cho lớp mẫu; **`DS_*_Mar3_*` và `DS_*_Mar12_*`** là lớp thật; `DS_wed_CLC66D_*` tùy chọn

### Database Schema

**Score lookup tables (used by `/lookup` and `ConnectionTest`):**

**CLC66D (tùy chọn / không trong phạm vi thi online):** `DS_wed_CLC66D_Midterm.csv` (và final tương ứng) — cùng schema roster. **Lớp CLC66D thi không qua app này** nên **chưa cần** duy trì trigger hay quy trình import/sync từ `exam_responses`/`final_exam_responses` cho CLC66D, trừ khi sau này đổi kế hoạch. Script lịch sử: `supabase_create_wed_clc66d_midterm_table.sql`, `supabase_wed_clc66d_midterm_sync.sql`, `supabase_wed_clc66d_final_sync.sql`.

```sql
CREATE TABLE IF NOT EXISTS public."DS_wed_CLC66D_Midterm.csv" (
  "Tên" text null,
  "MSV" bigint not null,
  "Số câu đúng" text null,
  "Điểm" text null,
  CONSTRAINT "DS_wed_CLC66D_Midterm.csv_pkey" PRIMARY KEY ("MSV")
);
```

**Mar3_K56_KTQD (formerly Chủ nhật):** `DS_Mar3_K56_KTQD_Midterm.csv` — cùng kiểu cột roster. **RLS (typical):** policy **Allow public read on DS_Mar3_K56_KTQD_Midterm** — `SELECT` cho **`anon`, `authenticated`**. Cập nhật điểm từ trigger `update_mar3_k56_ktqd_midterm_from_exam_response` (`SECURITY DEFINER`); client anon chỉ cần `SELECT`. Bảng final tương ứng: `DS_Mar3_K56_KTQD_Final.csv` + trigger `update_mar3_k56_ktqd_final_from_response`.

**Mar12_K56:** `DS_Mar12_K56_Midterm.csv` / `DS_Mar12_K56_Final.csv` — cùng schema `Tên`, `MSV`, `Số câu đúng`, `Điểm`. Tạo/import/sync bằng `supabase_create_mar12_k56_*`, `supabase_import_mar12_k56_midterm.sql`, `supabase_mar12_k56_midterm_sync.sql` (INSERT `exam_responses` → cập nhật roster khi MSV khớp), `supabase_mar12_k56_final_sync.sql` (INSERT `final_exam_responses` → final roster). Roster nguồn CSV: `new_class/DS_Mar12_K56_Midterm.csv` (62 SV).

**Sample (thử nghiệm):** `DS_Sample_Midterm.csv` / `DS_Sample_Final.csv` — 5 SV, MSV **99010001–99010005** (tránh trùng SV thật). Script: `supabase_create_sample_midterm_table.sql` → `supabase_import_sample_midterm.sql` → `supabase_sample_midterm_sync.sql` → `supabase_create_sample_final_table.sql` → `supabase_sample_final_sync.sql`. Roster: `new_class/DS_Sample_Midterm.csv`. Tra cứu trong app: lớp **Sample (thử nghiệm)**.

**Exam version allocation (server):** `exam_version_counter` (singleton pointer), `exam_assignments` (`student_id` → `test_version`), function `assign_test_version(text)` — see `supabase_exam_version_allocator.sql`.

**Legacy / other roster tables (may still exist in DB; not in current lookup dropdown):** e.g. `DS_Thurs _7_8_Midterm.csv`, `DS_Wed _5_6_Midterm.csv`, `DS_Fri_1_2_Midterm.csv` — same column shape where used historically. After running `supabase_rename_sun_to_mar3_k56_ktqd.sql`, the old names `DS_Sun_Midterm.csv` / `DS_Sun_Final.csv` **no longer exist** in Postgres (replaced by `DS_Mar3_K56_KTQD_*`). RLS patterns (`TO public` vs `TO anon, authenticated`) are equivalent for anon read when `USING (true)`; they do **not** explain score differences between browsers (cache/UI state does).

### Supabase ops: Mar3_K56_KTQD rename (one-time)

1. Deploy app first (commit `235fff0` or newer) so `/lookup` and `ConnectionTest` call the new table names.
2. In Supabase **SQL Editor**, run the full script [supabase_rename_sun_to_mar3_k56_ktqd.sql](supabase_rename_sun_to_mar3_k56_ktqd.sql) once. It is idempotent.
3. Script ends with `NOTIFY pgrst, 'reload schema';` so PostgREST picks up renames immediately.
4. Do **not** re-run legacy `supabase_sun_midterm_sync.sql` / `supabase_sun_final_sync.sql` against production after rename — they reference dropped `update_sun_*` objects; use the Mar3-named triggers installed by the migration.
5. Smoke test: `ConnectionTest` → **Mar3**, **Mar12**, **Sample** **Connected**; nộp bài với MSV Sample và xác nhận `DS_Sample_Final.csv` (hoặc midterm nếu test `exam_responses`).

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

### Home Page (src/app/page.tsx)
- React component with TypeScript
- Hero section with high-contrast white background container
- Logo display (NEU, NCT, FDA) with consistent sizing
- Feature cards linking to lookup and exam pages
- Custom background image with overlay
- Professional styling with shadows and blur effects

### Score Lookup Page (src/app/lookup/page.tsx)
- Form handling for student name and ID input
- Class dropdown: **CLC66D** / **Mar3_K56_KTQD** / **Mar12_K56** / **Sample (thử nghiệm)** → `TABLE_BY_TERM_CLASS`
- Search strategies: exact trim, MSV as string, name `ilike`
- Error handling and loading states; optional git SHA “Phiên bản” on page when env set
- Responsive UI with TailwindCSS; browser autocomplete disabled
- Results display with “Chưa công bố” for null/empty score fields

### Exam Page (src/app/exam/page.tsx)
- 3-phase exam interface (entry, exam, completion)
- 40-question single-scroll layout
- Automatic scoring with instant results
- One-time access enforcement
- Test version 1–4 from **`supabase.rpc('assign_test_version', { p_student_id })`** before `getTestVersion(version)` (not `localStorage`, not client hash)

### Database Client (src/lib/supabase.ts)
```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://asxhozsfmlmsrflmzizr.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  global: {
    fetch: (input, init = {}) => {
      const headers = new Headers(init.headers)
      if (!headers.has('Cache-Control')) {
        headers.set('Cache-Control', 'no-cache, no-store, max-age=0, must-revalidate')
      }
      if (!headers.has('Pragma')) headers.set('Pragma', 'no-cache')
      return fetch(input, { ...init, headers, cache: 'no-store' })
    },
  },
})
// ExamScore interface: see repo (Tên, MSV, optional Số câu đúng / Điểm)
```

### Exam Generator (src/lib/examGenerator.ts)
- Fetches 87 questions from Supabase
- `getTestVersion(version)` loads one of four fixed 40-question sets (version from RPC on `/exam`)
- `testVersionFromStudentId(studentId)` — legacy hash helper **not** used by the exam page for assignment
- Selects 40 questions per version via seeded pool shuffle (4 versions)
- **Shuffles the four options (A–D content) per question** with seed `f(version, questionIndex)`; `shuffledCorrectAnswer` maps đáp án đúng to the displayed letter
- Uses seedrandom for deterministic randomization

### Exam Storage (src/lib/examStorage.ts)
- Saves student responses to Supabase
- Calculates scores automatically
- Stores detailed question-level data
- Prevents duplicate submissions

### Connection Test Component (src/components/ConnectionTest.tsx)
- Tests 8 roster tables (CLC66D + Mar3 + Mar12 + Sample × mid/final)
- Error reporting for troubleshooting

## 🔄 Data flow: thi online → điểm trên roster → tra cứu

> Current production flow supports both midterm and final exam.

1. **`/exam` (client):** SV nhập tên + MSV → `getExamResponse` kiểm tra `exam_responses` theo `student_id`; nếu đã có bản ghi thì chặn làm lại (một MSV toàn hệ thống, không tách lớp). **Đề 1–4:** RPC **`assign_test_version(p_student_id)`** (Postgres: round-robin toàn cục, mỗi MSV một đề cố định lần đầu; bảng `exam_assignments` / `exam_version_counter`). Sau đó `getTestVersion(version)` trong `examGenerator.ts`. Câu hỏi: `test_library_lec1_lec6.csv` → 4 bộ 40 câu + **xáo thứ tự 4 phương án A–D mỗi câu**. Nộp bài: `saveExamResponse` chấm 0.25/câu → **INSERT** `exam_responses` (`student_name`, `student_id`, `test_version`, `responses`, `total_score`).

2. **PostgreSQL (tùy script đã chạy trên Supabase):** **AFTER INSERT** trên `exam_responses` có thể kích hoạt:
   - *(Tùy chọn, không ưu tiên)* `supabase_wed_clc66d_midterm_sync.sql` → cập nhật `DS_wed_CLC66D_Midterm.csv` — **CLC66D không thi trên nền tảng này**, có thể bỏ qua khi vận hành.
   - `supabase_rename_sun_to_mar3_k56_ktqd.sql` → trigger `update_mar3_k56_ktqd_midterm_from_exam_response` UPDATE dòng trong `DS_Mar3_K56_KTQD_Midterm.csv` khi `TRIM(MSV) = TRIM(student_id)` (Mar3_K56_KTQD). Trigger Sun cũ và bản sync cũ đã bị thay bằng migration này.
   - `supabase_mar12_k56_midterm_sync.sql` → `update_mar12_k56_midterm_from_exam_response` cập nhật `DS_Mar12_K56_Midterm.csv` khi MSV khớp (Mar12_K56).
   - `supabase_sample_midterm_sync.sql` → `update_sample_midterm_from_exam_response` cập nhật `DS_Sample_Midterm.csv` khi MSV khớp (Sample).
   - (Tuỳ dự án cũ) `supabase_enable_auto_update.sql` → `DS_Fri_1_2_Midterm.csv`; các bảng Thứ 5 / Thứ 4 legacy **không** được app lookup hiện tại dùng.

3. **`/lookup` (client):** Chọn lớp (Mar3 / Mar12 / Sample / tùy chọn CLC66D) → `TABLE_BY_TERM_CLASS` → `.select` `Tên`, `MSV`, `Số câu đúng`, `Điểm`. **Không** merge `exam_responses`. `NULL`/rỗng → “Chưa công bố”.

4. **Final exam mode (`/exam`):** `generateFinalExam(studentId)` fetches `final_exam_all`, picks 40 questions with fixed per-lecture quotas (5/6/6/6/5/5/5/2), then shuffles answer options per question. Submission uses `saveFinalExamResponse` → **INSERT** `final_exam_responses` (`student_name`, `student_id`, `responses`, `total_score`, `num_correct`).

5. **Final roster sync:** `AFTER INSERT` on `final_exam_responses` cập nhật **`DS_Mar3_K56_KTQD_Final.csv`**, **`DS_Mar12_K56_Final.csv`**, **`DS_Sample_Final.csv`** (và CLC66D nếu còn trigger). Mỗi trigger chỉ `UPDATE` dòng có MSV khớp.

6. **Lookup term switch:** `/lookup` theo `{examTerm, class}` — thêm **`DS_Sample_Midterm.csv` / `DS_Sample_Final.csv`** cho lớp Sample.

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
1. **Lookup scope** - Thêm **Sample (thử nghiệm)**; Mar3 + Mar12 + Sample; CLC66D tùy chọn
2. **Updated page title** - Changed browser tab to "NEU Class Manager" (simplified from "NEU Class Manager - Tra Cứu Điểm Thi")
3. **Enhanced UI/UX** - Professional styling with gradients, shadows, and better typography
4. **Connection testing** - ConnectionTest kiểm tra 8 bảng; test quy trình: Mar3 + Mar12 + Sample
5. **Improved accessibility** - Added ARIA labels, keyboard navigation, and focus states
6. **Enhanced results display** - Better visual hierarchy with card-based layout
7. **Background image** - Added bg.jpg with 30% opacity overlay for better visibility
8. **Text contrast enhancement** - Increased text darkness (text-gray-900) with shadows for readability
9. **Logo updates** - Replaced FDA logo_không nền.png with FDA logo_đen nền trắng.png
10. **Privacy features** - Disabled browser autocomplete on name and MSV input fields
11. **Updated documentation** - Comprehensive backup context for future AI sessions

### Search Strategies Implemented
1. Exact match with trimmed values
2. MSV as string instead of number
3. Case-insensitive name search with `ilike`

## 🎨 UI/UX Features

### Design Elements
- Custom background image (bg.jpg) with 30% white overlay and subtle backdrop blur
- High-contrast white background container for main page text (95% opacity with blur)
- Professional card-based layout with enhanced shadows
- Emoji-enhanced results display with better visual hierarchy
- Responsive design optimized for mobile/desktop
- High contrast input fields with hover/focus states (text-gray-900)
- Enhanced text with drop shadows and text shadows for visibility
- Loading states with animated spinners
- Professional error messages with color-coded status
- Class selection dropdown with smooth transitions
- Enhanced typography with better font weights (font-bold, font-semibold, font-extrabold)
- Browser autocomplete disabled on sensitive input fields

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
- Score lookup Mar3 + Mar12 + Sample (+ CLC66D tùy chọn) sau khi SQL Supabase áp dụng
- Online exam system implemented
- 4 test versions; server-side round-robin assignment via `assign_test_version`
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
3. **`Could not find the table 'public.exam_responses' in the schema cache`** - Run `supabase_setup.sql` in the Supabase SQL Editor (creates `exam_responses` + RLS + grants). Then retry submit; if it persists, wait a minute or run `NOTIFY pgrst, 'reload schema';` again.
4. **White text in inputs** - Fixed with explicit text color classes
5. **Deployment issues** - Check Vercel build logs
6. **Chrome shows old điểm, Cốc Cốc shows different value** — Usually stale **browser cache** or an old tab. Try: Incognito, **Hard reload** (Ctrl+Shift+R / Cmd+Shift+R), DevTools → Network → **Disable cache**, or clear site data for the app domain and `*.supabase.co`. App uses `fetch` with `cache: 'no-store'` plus `Cache-Control` / `Pragma` on every Supabase request to reduce this.
7. **“Cập nhật chậm >30 phút” rồi mới thấy Chưa công bố** — PostgREST/Postgres **không** trì hoãn đọc hàng chục phút sau khi đã `UPDATE … NULL`. Thường gặp: (a) lúc tra cứu trước đó DB **chưa** NULL hoặc tab/state/cache trình duyệt vẫn hiển thị bản cũ; (b) sau ~30 phút mới **sửa DB** hoặc mới **tìm lại** / đổi trình duyệt / hết cache → trùng thời điểm nên tưởng là “độ trễ server”. Xác minh: chạy `SELECT "Điểm","Số câu đúng" FROM "DS_Mar3_K56_KTQD_Midterm.csv" WHERE …` (hoặc bảng final tương ứng) ngay sau khi `UPDATE` — phải thấy NULL tức thì.
8. **Đã set NULL nhưng tra cứu vẫn hiện `0` đ** — Tra cứu chỉ hiện **Chưa công bố** khi giá trị là SQL `NULL`, thiếu field, hoặc chuỗi rỗng. Giá trị số **0** hoặc text **`"0"` / `"0.00"`** được coi là **điểm đã công bố** (đúng với SV được 0 điểm). Kiểm tra trong Supabase: cột `"Điểm"` và `"Số câu đúng"` phải thật sự `NULL` (SQL: `UPDATE ... SET "Điểm" = NULL, "Số câu đúng" = NULL WHERE ...`). Xóa row `exam_responses` **không** xóa điểm trên bảng lớp.

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
- **Lookup roster tables (app):** `DS_Mar3_K56_KTQD_*`, `DS_Mar12_K56_*`, `DS_Sample_*`; `DS_wed_CLC66D_*` tùy chọn
  - Midterm: `DS_Mar3_K56_KTQD_Midterm.csv`, `DS_Mar12_K56_Midterm.csv`, `DS_Sample_Midterm.csv` (+ `DS_wed_CLC66D_Midterm.csv` nếu còn)
  - Final: `DS_Mar3_K56_KTQD_Final.csv`, `DS_Mar12_K56_Final.csv`, `DS_Sample_Final.csv` (+ `DS_wed_CLC66D_Final.csv` nếu còn)
- **Other roster tables:** may exist for legacy classes (e.g. Thurs/Wed/Fri CSV-named tables)
- **Exam Tables:**
  - Midterm: `test_library_lec1_lec6.csv`, `exam_responses`; allocator: `exam_version_counter`, `exam_assignments`
  - Final: `final_exam_all`, `final_exam_responses`

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

### May 2026
- **Lớp Sample (test, pushed `11c8f9a`):** `new_class/DS_Sample_Midterm.csv` — 5 SV (tên mẫu, MSV 99010001–99010005). SQL: `supabase_create_sample_midterm_table.sql`, `supabase_import_sample_midterm.sql`, `supabase_verify_sample_midterm.sql`, `supabase_sample_midterm_sync.sql`, `supabase_create_sample_final_table.sql`, `supabase_sample_final_sync.sql`. `lookup/page.tsx` + `ConnectionTest.tsx`: lớp **Sample (thử nghiệm)**. Thứ tự chạy trên Supabase giống Mar12.
- **Chính sách CLC66D (tài liệu):** Ghi nhận **lớp CLC66D sẽ thi không qua nền tảng này** — **chưa cần** ưu tiên trigger/import/sync hay ConnectionTest cho `DS_wed_CLC66D_*` khi vận hành thi online; phạm vi vận hành **Mar3_K56_KTQD** + **Mar12_K56**. Cập nhật toàn bộ `backup-context.md` cho nhất quán.
- **Mar12_K56 Supabase + app wiring (pushed `9ebd613`)**: Added roster tables pack — `supabase_create_mar12_k56_midterm_table.sql`, `supabase_import_mar12_k56_midterm.sql`, `supabase_verify_mar12_k56_midterm.sql`, `supabase_mar12_k56_midterm_sync.sql` (trigger on `exam_responses`), `supabase_create_mar12_k56_final_table.sql` (seeds `Tên`/`MSV` from midterm), `supabase_mar12_k56_final_sync.sql` (trigger on `final_exam_responses`). Source data: `new_class/DS_Mar12_K56_Midterm.csv` + `new_class/Kiem-tra-giua-ky-160936565697150978.xlsx` (62 students). Updated `src/app/lookup/page.tsx` (constants, `TABLE_BY_TERM_CLASS`, dropdown **Mar12_K56**), `src/components/ConnectionTest.tsx` (two more table checks), and this `backup-context.md`. **Ops order on Supabase:** (1) create midterm table → (2) import → (3) midterm sync → (4) create final table → (5) final sync. Vercel deploy từ `main` sau commit này; DB đã áp dụng theo xác nhận user.
- **Sun → Mar3_K56_KTQD (pushed)**: Committed and pushed `235fff0` to `main` (Vercel auto-deploy). **DB step:** run `supabase_rename_sun_to_mar3_k56_ktqd.sql` in Supabase SQL Editor after deploy so table names match the app (see section **Supabase ops: Mar3_K56_KTQD rename** above).
- **Sun → Mar3_K56_KTQD class rename**: Added `supabase_rename_sun_to_mar3_k56_ktqd.sql` (idempotent: rename `DS_Sun_Midterm.csv` → `DS_Mar3_K56_KTQD_Midterm.csv` and `DS_Sun_Final.csv` → `DS_Mar3_K56_KTQD_Final.csv`, rename PK constraints/indexes, recreate RLS policies, drop old `update_sun_*` functions/triggers, create `update_mar3_k56_ktqd_*` functions + triggers). Updated `src/app/lookup/page.tsx` (constants + dropdown option), `src/components/ConnectionTest.tsx` (display + table names) accordingly. Old SQL files (`supabase_sun_*.sql`) kept for history but no longer wired to runtime.
- **Production push (final exam)**: Committed and pushed `e129d94` to `main`; Vercel auto-deploy expected from this commit.
- **Exam UI clarification**: Final-exam template intentionally does not show “Đề thi số X” (version 1–4) because final mode uses seeded per-student stratified selection instead of discrete test-version buckets.
- **Final exam stratified rollout**: Implemented final-exam generation from `final_exam_all` with fixed lecture quotas `{Lec1:5, Lec2:6, Lec3:6, Lec4:6, Lec5:5, Lec6:5, Lec7:5, Lec8:2}`, deterministic per-student seed (`seedFromStudentId` + `FINAL_EXAM_SALT`), and separated write path to `final_exam_responses`.
- **Final roster tables + triggers (initial)**: Added `DS_wed_CLC66D_Final.csv` and `DS_Sun_Final.csv` (since renamed to `DS_Mar3_K56_KTQD_Final.csv` via migration) plus `supabase_wed_clc66d_final_sync.sql` / `supabase_sun_final_sync.sql`; Mar3 final sync is superseded by `supabase_rename_sun_to_mar3_k56_ktqd.sql` trigger `update_mar3_k56_ktqd_final_from_response`.
- **Lookup multi-term support**: `src/app/lookup/page.tsx` now adds exam-term selector (Giữa kỳ/Cuối kỳ) and table mapping for all 4 roster tables. `src/components/ConnectionTest.tsx` now tests all 4 tables.
- **Exam page final mode**: `src/app/exam/page.tsx` switched to final flow (`generateFinalExam`, `getFinalExamResponse`, `saveFinalExamResponse`) and no longer depends on `assign_test_version` for final exam assignment.
- **backup-context.md refresh (historic note)**: Earlier refresh described lookup as CLC66D + Chủ nhật; sau đổi tên Sun → **Mar3_K56_KTQD** và thêm Mar12, UI có thể vẫn liệt kê CLC66D nhưng **chính sách:** CLC66D không thi trên nền tảng (cập nhật May 2026 trong file này).

### March 2026
- **Allocator operations note**: `exam_version_counter` stores the global “next version” pointer for RPC round-robin assignment. Do **not** delete singleton row `id=1` during normal operation. For a new exam cycle, reset with `UPDATE ... SET next_version = 1`; only clear `exam_assignments` if you intentionally want re-assignment for existing `student_id`s.
- **Exam version allocator (server-side)**: Added `supabase_exam_version_allocator.sql` with tables `exam_version_counter`, `exam_assignments`, and RPC `assign_test_version(p_student_id)` (`SECURITY DEFINER`) to allocate versions in strict global round-robin `1→2→3→4→1` while keeping one fixed `test_version` per `student_id`.
- **Exam page RPC integration**: `src/app/exam/page.tsx` now calls `supabase.rpc('assign_test_version', { p_student_id })` before loading questions; removed client-side MSV hash assignment dependency for version selection.
- **CLC66D score sync trigger**: Added `supabase_wed_clc66d_midterm_sync.sql` with `update_wed_clc66d_midterm_from_exam_response()` + trigger `trigger_wed_clc66d_midterm_on_exam` (`AFTER INSERT` on `exam_responses`) and one-time backfill query to populate `DS_wed_CLC66D_Midterm.csv` from latest attempt per `student_id`.
- **Lookup class scope update**: `src/app/lookup/page.tsx` now keeps only `CLC66D` (`DS_wed_CLC66D_Midterm.csv`) and `Chủ nhật` (`DS_Sun_Midterm.csv`) in `CLASS_TABLE_MAPPING` and dropdown; default/reset class switched to `CLC66D`. `src/components/ConnectionTest.tsx` now tests only these two tables.
- **New class SQL pack (CLC66D)**: Added `supabase_create_wed_clc66d_midterm_table.sql` (table + RLS + SELECT policy), `supabase_import_wed_clc66d_midterm.sql` (staging import + upsert normalize), and `supabase_verify_wed_clc66d_midterm.sql` (row/dup/sample checks) for new roster `DS_wed_CLC66D_Midterm.csv`.
- **New class roster normalization**: Converted `DS_wed_CLC66D.xlsx` to upload-ready `DS_wed_CLC66D_Midterm.csv` with schema `Tên, MSV, Số câu đúng, Điểm`; removed non-required `STT`, kept 51 unique MSV rows, initialized score columns as empty for unpublished state.
- **Exam version per student (intermediate step)**: Replaced `localStorage` `exam_counter` with `testVersionFromStudentId()` (FNV-style hash) — **later superseded** by RPC `assign_test_version` (global round-robin + sticky per MSV). Hash helper still in repo but not used by `/exam` for assignment.
- **Exam answer shuffle**: `createQuestion` in `src/lib/examGenerator.ts` now Fisher–Yates shuffles the four choice texts per question (deterministic seed from `testVersion` + `questionIndex`); displayed A–D label positions after shuffle; `shuffledCorrectAnswer` updated for grading (`examStorage` unchanged). Fixes “đề không xáo trộn” (previously only the 40-question set varied per version).
- **Ops note**: User observed MSV 11183366 eventually showing **Chưa công bố** after ~30min — interpreted as slow server update; documented that Postgres read path is immediate once row is NULL; perceived delay aligns with cache / when DB was updated / when user re-searched.
- **RLS role target**: `DS_Thurs _7_8_Midterm.csv` may use `SELECT` **TO public**; `DS_Sun_Midterm.csv` uses **TO anon, authenticated** — both allow anon lookup; documented as equivalent pattern, optional cosmetic alignment only.
- **DS_Sun_Midterm.csv RLS**: Production policy **Allow public read on DS_Sun_Midterm** — `SELECT` for `anon`, `authenticated` — documented in Database Schema; sufficient for lookup; not the cause of stale/wrong score issues when policy is present.
- **Architecture review**: Added section **Data flow: thi online → điểm trên roster → tra cứu** in this file (`/exam` → `exam_responses` → optional Fri/Sun triggers → `/lookup` reads `DS_*_Midterm.csv` only). Git: `b61416f`.
- **Browser cache / điểm 0 vs NULL**: `src/lib/supabase.ts` global `fetch` adds `Cache-Control` and `Pragma` in addition to `cache: 'no-store'` to mitigate Chrome (and similar) showing stale tra cứu while another browser sees fresh data. Documented: UI shows **Chưa công bố** only for null/empty; numeric **0** or text **"0"** still displays as published zero — fix in DB with explicit `NULL` on roster columns. Git: `bbc267c`.
- **Production reset (Chủ nhật)**: All `Số câu đúng` / `Điểm` on `DS_Sun_Midterm.csv` set to NULL; all rows deleted from `exam_responses`. Supabase **Realtime** turned on for both tables in the dashboard. **Note:** The Next.js app does not call `.channel()` / subscriptions — tra cứu still loads scores on each search via PostgREST `select`; Realtime is optional for future live UI or external tooling. Documented in git commit `bc78112` (pushed to `main`).
- **Lookup deploy debug**: `next.config.ts` exposes `NEXT_PUBLIC_APP_GIT_SHA` (Vercel `VERCEL_GIT_COMMIT_SHA`); `/lookup` shows **Phiên bản: abc1234** to confirm production bundle. `createClient` uses `fetch` with `cache: 'no-store'` plus `Cache-Control` / `Pragma` headers. Added `supabase_sun_disable_autosync_trigger.sql` — `DISABLE TRIGGER trigger_sun_midterm_on_exam` stops inserts from rewriting `DS_Sun_Midterm.csv` after manual NULL.
- **Lookup vs exam_responses**: Tra cứu reads class tables (`DS_*_Midterm.csv`); scores there persist after copying from `exam_responses`. Deleting `exam_responses` does not clear roster columns — use `supabase_reset_sun_published_scores.sql` (or equivalent) to null `Số câu đúng` / `Điểm` on the roster if needed.
- **Redeploy**: Empty commit `0a6c459` to trigger Vercel production build (lookup PostgREST fixes live).
- **Chủ nhật tra cứu + thi online**: Reverted to roster-table source of truth only. Lookup no longer overlays `exam_responses` for Chủ nhật, so setting `Số câu đúng`/`Điểm` to NULL in `DS_Sun_Midterm.csv` always renders **Chưa công bố**.
- **Lookup score display**: Tra cứu uses explicit `.select('"Tên", MSV, "Số câu đúng", "Điểm"')` and NFC-normalized keys in `rowToExamScore` so Vietnamese columns map reliably from PostgREST. Added `supabase_verify_sun_scores.sql` to confirm DB values vs UI.
- **Sun class scores**: Added `supabase_sun_midterm_sync.sql` — trigger on `exam_responses` updates `DS_Sun_Midterm.csv` roster rows (MSV match) with `Số câu đúng` (x/40) and `Điểm`; includes one-time backfill from latest attempt per student. Lookup UI shows **Chưa công bố** when those fields are empty/null.
- **exam_responses setup**: Hardened `supabase_setup.sql` (idempotent policies, `anon`/`authenticated` RLS, grants + sequence, `NOTIFY pgrst` reload) for Supabase submit errors when the table is missing.
- **Next.js security**: Upgraded `next` and `eslint-config-next` to **15.5.9** (patches CVE-2025-66478 / React2Shell and follow-on RSC advisories; Vercel blocks older 15.5.x deploys).
- **Sunday class lookup**: Mapped label `Chủ nhật` → Supabase table `DS_Sun_Midterm.csv` in `src/app/lookup/page.tsx` (`CLASS_TABLE_MAPPING` + dropdown). Added the same table to `src/components/ConnectionTest.tsx`. Roster source: `DS_Sun_Midterm.csv` (48 students, columns Tên, MSV, Số câu đúng, Điểm).

### January 2025
- **Background Image Implementation**: Added `bg.jpg` as background image to all pages (home, lookup, exam)
  - Copied `bg.jpg` from `logo/` folder to `public/` folder for Next.js access
  - Applied fixed background image with Next.js `Image` component using `fill` prop
  - Added semi-transparent white overlay (`bg-white/30`) with subtle backdrop blur (`blur-[2px]`) for better background visibility
  - Updated all three pages: `src/app/page.tsx`, `src/app/lookup/page.tsx`, `src/app/exam/page.tsx`
  - Fixed div structure issues in exam page (Phase 1, 2, and 3 sections)
  - Reduced overlay opacity from 80% to 30% for better background image visibility

- **Text Contrast Enhancement**: Improved text readability against background
  - Updated all text colors to darker shades (`text-gray-900`, `text-gray-800`)
  - Added text shadows and drop shadows to headings and important text
  - Increased font weights (font-bold, font-semibold, font-extrabold)
  - Enhanced main page text with white background container (`bg-white/95`) with backdrop blur and shadows
  - Applied across all pages: home, lookup, exam (all phases)

- **Logo Update**: Replaced FDA logo version
  - Changed from `FDA logo_không nền.png` to `FDA logo_đen nền trắng.png` (white background version)
  - Updated in all pages: home (`src/app/page.tsx`), lookup (`src/app/lookup/page.tsx`), exam (`src/app/exam/page.tsx`)
  - Copied new logo file to `public/logo/` directory
  - All logos maintain 150x150 pixel size consistency

- **Page Title Update**: Simplified browser tab title
  - Changed from "NEU Class Manager - Tra Cứu Điểm Thi" to "NEU Class Manager"
  - Updated in `src/app/layout.tsx` metadata

- **Privacy Enhancement**: Disabled browser autocomplete
  - Added `autoComplete="off"` attribute to all name and MSV input fields
  - Prevents browser from showing cached previous values
  - Applied to lookup page (studentName, studentId) and exam page (name, id)
  - Improves privacy and prevents confusion from autofill suggestions

### December 2024
- **Homepage Redesign**: Moved score lookup to `/lookup` sub-page, created new home page with hero section
- **Logo Integration**: Added NEU, NCT, and FDA logos to all pages, standardized sizes to 150x150
- **Summary Table Auto-Update**: Enabled automatic trigger for `DS_Fri_1_2_Midterm.csv` table updates
- **Exam System Refinements**: Reshuffled test bank, hid scores from students after submission
- **Multi-Class Support (historic)**: Earlier builds added more class options; lookup UI hiện có thể gồm CLC66D + Mar3 + Mar12; **chính sách vận hành thi online:** ưu tiên Mar3 + Mar12; CLC66D không thi trên app.

---

**Note:** This backup context file should be updated whenever significant changes are made to the project structure, dependencies, or deployment configuration.

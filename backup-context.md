# Backup Context - NEU Class Manager

## 📋 Project Overview

**Project Name:** NEU Class Manager  
**Purpose:** A comprehensive web application for managing classes and conducting midterm exams at NEU. Features include score lookup, online exam taking, and automatic grading.  
**Status:** ✅ Production Ready & Deployed  
**Last Updated:** March 28, 2026 (Latest: exam — đề 1–4 gán theo MSV, không còn localStorage khiến cả lớp cùng đề)

## 🎯 Core Features

### Score Lookup System
- ✅ Multi-class exam score lookup
- ✅ Class selection dropdown (Thứ 5, tiết 7-8 / Thứ 4, tiết 5-6 / Thứ 6, tiết 1-2 / Chủ nhật)
- ✅ Student search by name (Tên) and student ID (MSV)
- ✅ Dynamic table querying based on selected class
- ✅ Real-time database query with Supabase
- ✅ Browser autocomplete disabled for privacy

### Online Exam System
- ✅ Four fixed 40-question sets from 87-question bank; **per-question** shuffle of four choices with deterministic seed (`examGenerator.ts` — labels A–D apply to positions after shuffle)
- ✅ 4 test versions; assignment via `testVersionFromStudentId(MSV)` (deterministic hash, spread across students)
- ✅ One row per MSV in `exam_responses` enforced at start (`getExamResponse`)
- ✅ Automatic scoring (0.25 points per correct answer)
- ✅ Response storage with detailed tracking in `exam_responses`

### User Interface
- ✅ Professional, responsive UI with enhanced styling
- ✅ Vietnamese text support with UTF-8 encoding
- ✅ Comprehensive error handling and loading states
- ✅ Multi-table connection testing capabilities
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

**Table (Chủ nhật):** `DS_Sun_Midterm.csv` — cùng kiểu cột roster (`Tên`, `MSV`, `Số câu đúng`, `Điểm`). **RLS (production):** policy **Allow public read on DS_Sun_Midterm** — `SELECT` cho **`anon`, `authenticated`** — đủ cho `/lookup` khi app dùng anon key. Cập nhật điểm từ trigger `update_sun_midterm_from_exam_response` (thường `SECURITY DEFINER`) không cần policy INSERT/UPDATE cho client.

**So sánh với Thứ 5:** `DS_Thurs _7_8_Midterm.csv` có thể dùng policy kiểu **Enable read access for all users** — `SELECT` cho role **`public`** (trong PostgreSQL = mọi role, gồm `anon` và `authenticated`). **Khác `TO public` vs `TO anon, authenticated`** là cách gán role trên policy; với `USING (true)` cả hai đều cho phép client anon đọc bảng — **không** giải thích chênh lệch điểm giữa các trình duyệt. Có thể thống nhất một kiểu (public hoặc anon+authenticated) cho dễ quản lý.

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
- Multiple search strategies for database queries
- Error handling and loading states
- Responsive UI with TailwindCSS
- Browser autocomplete disabled
- Real-time results display with enhanced visuals

### Exam Page (src/app/exam/page.tsx)
- 3-phase exam interface (entry, exam, completion)
- 40-question single-scroll layout
- Automatic scoring with instant results
- One-time access enforcement
- Test version 1–4 from `testVersionFromStudentId(MSV)` (not `localStorage`)

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
- `testVersionFromStudentId(studentId)` → đề 1–4 per MSV
- Selects 40 questions per version via seeded pool shuffle (4 versions)
- **Shuffles the four options (A–D content) per question** with seed `f(version, questionIndex)`; `shuffledCorrectAnswer` maps đáp án đúng to the displayed letter
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

## 🔄 Data flow: thi online → điểm trên roster → tra cứu

1. **`/exam` (client):** SV nhập tên + MSV → `getExamResponse` kiểm tra `exam_responses` theo `student_id`; nếu đã có bản ghi thì chặn làm lại (một MSV toàn hệ thống, không tách lớp). **Đề 1–4:** `testVersionFromStudentId(MSV)` trong `examGenerator.ts` (hash MSV → phân tán bộ 40 câu; tránh lỗi cũ: `localStorage` khiến mọi phiên đầu cùng một đề). Câu hỏi: `test_library_lec1_lec6.csv` → 4 bộ 40 câu + **xáo thứ tự 4 phương án A–D mỗi câu** (seed theo số đề + chỉ số câu trong `examGenerator.ts`). Nộp bài: `saveExamResponse` chấm 0.25/câu → **INSERT** `exam_responses` (`student_name`, `student_id`, `test_version`, `responses`, `total_score`).

2. **PostgreSQL (tùy script đã chạy trên Supabase):** **AFTER INSERT** trên `exam_responses` có thể kích hoạt:
   - `supabase_enable_auto_update.sql` → **upsert** `DS_Fri_1_2_Midterm.csv` (Thứ 6) theo `MSV` / `student_id`.
   - `supabase_sun_midterm_sync.sql` → **UPDATE** dòng có sẵn trong `DS_Sun_Midterm.csv` khi `TRIM(MSV) = TRIM(student_id)` (Chủ nhật).
   Thứ 5 / Thứ 4: bảng `DS_Thurs_*`, `DS_Wed_*` **không** được repo nối tự động từ `exam_responses` — điểm thường nhập/import thủ công.

3. **`/lookup` (client):** Chọn lớp → `CLASS_TABLE_MAPPING` → `.select` các cột `Tên`, `MSV`, `Số câu đúng`, `Điểm` trên **đúng bảng lớp**. **Không** merge `exam_responses`. `NULL`/rỗng → UI “Chưa công bố”; `0` hoặc `"0"` vẫn là điểm đã công bố.

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
2. **Updated page title** - Changed browser tab to "NEU Class Manager" (simplified from "NEU Class Manager - Tra Cứu Điểm Thi")
3. **Enhanced UI/UX** - Professional styling with gradients, shadows, and better typography
4. **Multi-table connection testing** - ConnectionTest tests all score tables including DS_Fri_1_2_Midterm.csv and DS_Sun_Midterm.csv (Chủ nhật)
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
3. **`Could not find the table 'public.exam_responses' in the schema cache`** - Run `supabase_setup.sql` in the Supabase SQL Editor (creates `exam_responses` + RLS + grants). Then retry submit; if it persists, wait a minute or run `NOTIFY pgrst, 'reload schema';` again.
4. **White text in inputs** - Fixed with explicit text color classes
5. **Deployment issues** - Check Vercel build logs
6. **Chrome shows old điểm, Cốc Cốc shows different value** — Usually stale **browser cache** or an old tab. Try: Incognito, **Hard reload** (Ctrl+Shift+R / Cmd+Shift+R), DevTools → Network → **Disable cache**, or clear site data for the app domain and `*.supabase.co`. App uses `fetch` with `cache: 'no-store'` plus `Cache-Control` / `Pragma` on every Supabase request to reduce this.
7. **“Cập nhật chậm >30 phút” rồi mới thấy Chưa công bố** — PostgREST/Postgres **không** trì hoãn đọc hàng chục phút sau khi đã `UPDATE … NULL`. Thường gặp: (a) lúc tra cứu trước đó DB **chưa** NULL hoặc tab/state/cache trình duyệt vẫn hiển thị bản cũ; (b) sau ~30 phút mới **sửa DB** hoặc mới **tìm lại** / đổi trình duyệt / hết cache → trùng thời điểm nên tưởng là “độ trễ server”. Xác minh: chạy `SELECT "Điểm","Số câu đúng" FROM "DS_Sun_Midterm.csv" WHERE …` ngay sau khi `UPDATE` — phải thấy NULL tức thì.
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
- **Score Tables:** DS_Thurs _7_8_Midterm.csv, DS_Wed _5_6_Midterm.csv, DS_Fri_1_2_Midterm.csv, DS_Sun_Midterm.csv
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

### March 2026
- **Exam version per student**: Replaced `localStorage` `exam_counter` with `testVersionFromStudentId()` (FNV-style hash of MSV → 1–4) so students are spread across four 40-question decks; fixes all first-time sessions getting the same `(counter % 4) + 1` after counter `0→1`.
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
- **Multi-Class Support**: Added third class option "Thứ 6, tiết 1-2" for online exam results

---

**Note:** This backup context file should be updated whenever significant changes are made to the project structure, dependencies, or deployment configuration.

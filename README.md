# NEU Class Manager

A modern, comprehensive web application for managing classes and conducting midterm exams at NEU. Features include score lookup, online exam taking, and automatic grading. Built with Next.js, TypeScript, and Supabase.

## Features

### 🔍 Score Lookup
- 🎯 **Multi-Class Support**: Select from different exam classes
- 🔍 **Student Search**: Look up scores by name and student ID
- ⚡ **Real-time Queries**: Instant results from Supabase database
- 🔧 **Connection Testing**: Built-in database connectivity diagnostics

### 📝 Online Exam System
- 🎲 **Randomized Questions**: 4 fixed test versions with shuffled answer choices
- 📊 **Automatic Grading**: Instant scoring with 0.25 points per correct answer
- 💾 **Response Storage**: All responses saved to Supabase with detailed tracking
- 🔒 **One-Time Access**: Students can only take the exam once

### 🎨 User Interface
- 📱 **Responsive Design**: Works perfectly on mobile and desktop
- 🎨 **Professional UI**: Modern design with enhanced accessibility
- 🌐 **Vietnamese Language**: Full Vietnamese text support with proper page title

## Data Source

The application connects to a Supabase database with multiple tables:

### Exam Score Tables (for score lookup)
**Table 1:** `DS_Thurs _7_8_Midterm.csv` (Thứ 5, tiết 7-8)
**Table 2:** `DS_Wed _5_6_Midterm.csv` (Thứ 4, tiết 5-6)

| Column | Description |
|--------|-------------|
| Tên | Student full name |
| MSV | Student ID |
| Số câu đúng | Number of correct answers |
| Điểm | Final score |

### Exam System Tables (for taking exams)
**Question Bank:** `test_library_lec1_lec6.csv` - 87 multiple-choice questions
**Response Table:** `exam_responses` - Student exam submissions and scores

## Local Development

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment file:
   ```bash
   cp .env.example .env.local
   ```
   
   Then edit `.env.local` with your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Set up the Supabase database:
   - Run the SQL script in `supabase_setup.sql` in your Supabase SQL Editor
   - This creates the `exam_responses` table for storing exam submissions
   - Enable RLS policies as needed

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Deployment on Vercel

### Option 1: Deploy with Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Deploy:
   ```bash
   vercel
   ```

3. Set environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key

### Option 2: Deploy via GitHub

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Vercel will automatically detect it's a Next.js project
4. Set the environment variables in the Vercel dashboard
5. Deploy!

## Environment Variables

The following environment variables are required:

- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key

## Usage

### Score Lookup
1. **Select Class**: Choose from available exam classes
2. **Enter Student Information**: 
   - Student's full name (Tên)
   - Student ID (MSV)
3. **Search**: Click "Tìm kiếm" (Search)
4. **View Results**: See the exam results showing:
   - ✅ Student name
   - 🎯 Number of correct answers
   - 🧾 Final score

### Taking an Exam
1. **Navigate**: Click "📝 Làm Bài Thi" on the home page
2. **Enter Information**: 
   - Student's full name (Họ và tên)
   - Student ID (MSV)
3. **Start Exam**: Click "Bắt đầu làm bài" 
4. **Take Exam**: Answer all 40 questions (single-scroll page)
5. **Submit**: Click "Nộp bài" when finished
6. **View Score**: See your score immediately after submission

**Important**: Each student can only take the exam once. The system automatically assigns test versions sequentially to distribute students across 4 different versions.

## Error Handling

The application includes comprehensive error handling for:
- Missing or incorrect Supabase credentials
- Network connectivity issues
- No matching records found
- Invalid user input

## Technology Stack

- **Framework:** Next.js 15 with App Router
- **Language:** TypeScript
- **Styling:** TailwindCSS
- **Database:** Supabase (PostgreSQL)
- **Deployment:** Vercel
- **Randomization:** seedrandom library for deterministic shuffling

## Project Structure

```
src/
├── app/
│   ├── page.tsx          # Home page (Score Lookup)
│   ├── exam/
│   │   └── page.tsx      # Exam taking page
│   ├── layout.tsx        # Root layout
│   └── globals.css       # Global styles
├── components/
│   └── ConnectionTest.tsx # Database connection tester
└── lib/
    ├── supabase.ts       # Supabase client
    ├── types.ts          # TypeScript interfaces
    ├── examGenerator.ts  # Test generation logic
    └── examStorage.ts    # Response storage logic
```

## License

© 2024 NEU Class Manager - Exam Score Lookup & Online Testing System
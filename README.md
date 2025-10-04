# Exam Score Lookup Website

A simple, functional web application that allows students to look up their midterm exam scores from a Supabase database.

## Features

- 🔍 Search by student name and student ID
- 📊 Display exam results with correct answers count and final score
- 🎨 Clean, responsive UI built with TailwindCSS
- ⚡ Fast and secure connection to Supabase
- 🚀 Ready for Vercel deployment

## Data Source

The application connects to a Supabase database with the following structure:

**Table:** `DS_Thurs _7_8_Midterm.csv`

| Column | Description |
|--------|-------------|
| Tên | Student full name |
| MSV | Student ID |
| Số câu đúng | Number of correct answers |
| Điểm | Final score |

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

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

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

1. Enter the student's full name (Tên)
2. Enter the student ID (MSV)
3. Click "Tìm kiếm" (Search)
4. View the results showing:
   - ✅ Student name
   - 🎯 Number of correct answers
   - 🧾 Final score

If no record is found, the system will display an appropriate error message.

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
- **Database:** Supabase
- **Deployment:** Vercel

## License

© 2024 NEU Class Manager - Exam Score Lookup
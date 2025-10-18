# Exam Score Lookup Website

A modern, responsive web application that allows students to look up their midterm exam scores from multiple classes. Built with Next.js, TypeScript, and Supabase.

## Features

- 🎯 **Multi-Class Support**: Select from different exam classes
- 🔍 **Student Search**: Look up scores by name and student ID
- 📱 **Responsive Design**: Works perfectly on mobile and desktop
- ⚡ **Real-time Queries**: Instant results from Supabase database
- 🎨 **Professional UI**: Modern design with enhanced accessibility
- 🔧 **Connection Testing**: Built-in database connectivity diagnostics
- 🌐 **Vietnamese Language**: Full Vietnamese text support with proper page title

## Data Source

The application connects to a Supabase database with multiple exam score tables:

**Table 1:** `DS_Thurs _7_8_Midterm.csv` (Thứ 5, tiết 7-8)
**Table 2:** `DS_Wed _5_6_Midterm.csv` (Thứ 4, tiết 5-6)

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

1. **Select Class**: Choose from available exam classes
2. **Enter Student Information**: 
   - Student's full name (Tên)
   - Student ID (MSV)
3. **Search**: Click "Tìm kiếm" (Search)
4. **View Results**: See the exam results showing:
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
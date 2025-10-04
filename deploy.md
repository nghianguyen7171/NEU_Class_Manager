# Deployment Instructions

## Quick Deploy to Vercel

### Method 1: Vercel CLI (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from project directory
vercel

# Follow the prompts:
# - Link to existing project? No
# - Project name: exam-score-lookup (or your preferred name)
# - Directory: ./
# - Override settings? No
```

### Method 2: GitHub Integration
1. Push this project to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Vercel will auto-detect Next.js settings
6. Add environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`: https://asxhozsfmlmsrflmzizr.supabase.co
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFzeGhvenNmbWxtc3JmbG16aXpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1Njc2OTAsImV4cCI6MjA3NTE0MzY5MH0.EpsZVx-IPkH078KCeW-YCI_RWhs46LrgbujalXvf48Q
7. Click "Deploy"

## Environment Variables

The application will work without environment variables (using hardcoded fallbacks), but for production it's recommended to set them in Vercel:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Testing the Deployment

After deployment, test the application by:
1. Entering a student name: "Nguyễn Văn A"
2. Entering a student ID: "20501234"
3. Clicking "Tìm kiếm"
4. Verifying the results display correctly

## Troubleshooting

If deployment fails:
1. Check that all dependencies are installed: `npm install`
2. Verify build works locally: `npm run build`
3. Check Vercel build logs for specific errors
4. Ensure environment variables are set correctly in Vercel dashboard

## Live Demo

Once deployed, your application will be available at a URL like:
`https://exam-score-lookup-[username].vercel.app`

# Summary Table Guide - DS_Fri_1_2_Midterm.csv

## Overview

The `DS_Fri_1_2_Midterm.csv` table is a summary table that aggregates exam results from the `exam_responses` table. It provides a simplified view matching the format of other exam score tables.

## Table Structure

| Column | Type | Description | Example |
|--------|------|-------------|---------|
| MSV | TEXT | Student ID (Primary Key) | "11233662" |
| Tên | TEXT | Student name | "Nguyễn Văn A" |
| Số câu đúng | TEXT | Correct answers (formatted as x/40) | "38/40" |
| Điểm | TEXT | Score (formatted as decimal) | "9.50" |

## Setup Instructions

### Step 1: Run the SQL Script

1. Go to Supabase Dashboard → SQL Editor
2. Copy and paste the contents of `supabase_summary_table.sql`
3. Run the SQL script
4. Verify the table is created successfully

### Step 2: Initial Population

The SQL script automatically calls `refresh_exam_summary()` function which:
- Calculates correct answers from total_score: `total_score / 0.25`
- Formats as "x/40" string
- Formats score as text with 2 decimal places
- Populates the summary table

## Refreshing the Summary Table

After new students submit exams, you need to refresh the summary table to see their results.

### Method 1: Using SQL Function (Recommended)

Run this SQL in Supabase SQL Editor:

```sql
SELECT refresh_exam_summary();
```

This will:
- Clear all existing data
- Re-aggregate all data from `exam_responses`
- Update the summary table with latest results

### Method 2: Manual Refresh via SQL

```sql
-- Clear and repopulate
TRUNCATE TABLE public."DS_Fri_1_2_Midterm.csv";

INSERT INTO public."DS_Fri_1_2_Midterm.csv" ("MSV", "Tên", "Số câu đúng", "Điểm")
SELECT 
    er.student_id AS "MSV",
    er.student_name AS "Tên",
    (ROUND(er.total_score / 0.25)::INTEGER)::TEXT || '/40' AS "Số câu đúng",
    ROUND(er.total_score::NUMERIC, 2)::TEXT AS "Điểm"
FROM exam_responses er
ORDER BY er.student_id;
```

## Calculation Logic

### Số câu đúng (Correct Answers)
```
Correct Answers = ROUND(total_score / 0.25)
Format: "x/40"
Example: If total_score = 9.5, then 9.5 / 0.25 = 38, so "38/40"
```

### Điểm (Score)
```
Score = total_score (already calculated)
Format: Rounded to 2 decimal places as TEXT
Example: 9.5 → "9.50", 8.75 → "8.75"
```

## Automated Refresh Options

### Option A: Manual Refresh (Current Setup)

Run `SELECT refresh_exam_summary();` whenever you need to update the summary table.

**When to refresh:**
- After exam period ends
- Before viewing results
- After any corrections to exam_responses

### Option B: Trigger-Based Auto-Update (Optional)

To automatically update the summary table when new responses are added, uncomment the trigger section in `supabase_summary_table.sql`:

```sql
-- Uncomment these lines in the SQL file:
CREATE TRIGGER trigger_update_summary
AFTER INSERT ON exam_responses
FOR EACH ROW
EXECUTE FUNCTION update_exam_summary_on_insert();
```

**Note:** This will update the summary in real-time, but may slow down insertions if you have many simultaneous submissions.

### Option C: Scheduled Refresh (Optional)

You can set up a cron job or scheduled function to refresh the table periodically. This requires Supabase Edge Functions or external scheduling.

## Querying Results

### View All Results
```sql
SELECT * FROM "DS_Fri_1_2_Midterm.csv" 
ORDER BY "MSV";
```

### Find Specific Student
```sql
SELECT * FROM "DS_Fri_1_2_Midterm.csv" 
WHERE "MSV" = '11233662';
```

### View by Score Range
```sql
SELECT * FROM "DS_Fri_1_2_Midterm.csv" 
WHERE "Điểm"::NUMERIC >= 8.0
ORDER BY "Điểm"::NUMERIC DESC;
```

### Count Students by Score Range
```sql
SELECT 
    CASE 
        WHEN "Điểm"::NUMERIC >= 9 THEN '9-10'
        WHEN "Điểm"::NUMERIC >= 8 THEN '8-9'
        WHEN "Điểm"::NUMERIC >= 7 THEN '7-8'
        WHEN "Điểm"::NUMERIC >= 5 THEN '5-7'
        ELSE 'Below 5'
    END as score_range,
    COUNT(*) as count
FROM "DS_Fri_1_2_Midterm.csv"
GROUP BY score_range
ORDER BY score_range DESC;
```

## Using in Score Lookup Page

The summary table is available as:
- **Class Option:** "Thứ 6, tiết 1-2 (Kết quả thi online)"
- **Table Name:** `DS_Fri_1_2_Midterm.csv`

Students can search their results using the same interface as other exam tables.

## Troubleshooting

### Table is Empty
- Run `SELECT refresh_exam_summary();`
- Verify `exam_responses` table has data
- Check for errors in SQL function

### Scores Don't Match
- Verify calculation: `total_score / 0.25` = correct answers
- Check rounding: should be integer for correct answers
- Ensure score is formatted to 2 decimal places

### Missing Students
- Verify student completed and submitted the exam
- Check `exam_responses` table for the student's record
- Run refresh function again

### Permission Errors
- Verify RLS policies are set correctly
- Check that public SELECT is enabled
- Ensure user has proper permissions

## Data Flow

```
exam_responses (source)
    ↓
refresh_exam_summary() function
    ↓
DS_Fri_1_2_Midterm.csv (summary)
    ↓
Score Lookup Page
```

## Best Practices

1. **Refresh regularly** after exam period ends
2. **Backup data** before running refresh if making changes
3. **Verify results** by spot-checking a few students
4. **Monitor size** - summary table should match number of unique students
5. **Keep exam_responses** - don't delete source data after creating summary


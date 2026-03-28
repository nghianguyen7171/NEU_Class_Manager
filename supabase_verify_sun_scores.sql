-- Run in Supabase SQL Editor to verify Sunday roster scores after UPDATE/backfill.
-- Replace 11183366 if testing another MSV.

SELECT "Tên", "MSV", "Số câu đúng", "Điểm"
FROM public."DS_Sun_Midterm.csv"
WHERE "MSV"::text = '11183366';

-- Expect non-null "Số câu đúng" and "Điểm" if sync ran. If NULL, UPDATE matched 0 rows or wrong table/project.

SELECT COUNT(*) AS rows_with_scores
FROM public."DS_Sun_Midterm.csv"
WHERE "Số câu đúng" IS NOT NULL AND TRIM("Số câu đúng"::text) <> '';

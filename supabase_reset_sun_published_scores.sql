-- Lookup reads DS_Sun_Midterm.csv — NOT exam_responses.
-- After you copy scores (UPDATE/backfill/trigger), deleting rows in exam_responses
-- does NOT remove those values from the roster table.
-- Run this if you cleared exam_responses and want tra cứu to show "Chưa công bố" again.

UPDATE public."DS_Sun_Midterm.csv"
SET
  "Số câu đúng" = NULL,
  "Điểm" = NULL;

-- Tên and MSV are unchanged. Re-run supabase_sun_midterm_sync backfill after new exam_responses exist.

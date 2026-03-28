-- Sync online exam scores into DS_Sun_Midterm.csv (Chủ nhật roster)
-- Run in Supabase SQL Editor after public.exam_responses and public."DS_Sun_Midterm.csv" exist.
-- Only updates rows already on the roster (matched by MSV = student_id).

CREATE OR REPLACE FUNCTION public.update_sun_midterm_from_exam_response()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public."DS_Sun_Midterm.csv"
  SET
    "Tên" = NEW.student_name,
    "Số câu đúng" = (ROUND(NEW.total_score / 0.25)::INTEGER)::TEXT || '/40',
    "Điểm" = ROUND(NEW.total_score::NUMERIC, 2)::TEXT
  WHERE TRIM("MSV"::TEXT) = TRIM(NEW.student_id);

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trigger_sun_midterm_on_exam ON public.exam_responses;

CREATE TRIGGER trigger_sun_midterm_on_exam
  AFTER INSERT ON public.exam_responses
  FOR EACH ROW
  EXECUTE FUNCTION public.update_sun_midterm_from_exam_response();

-- One-time backfill: copy latest attempt per student onto the Sunday roster
UPDATE public."DS_Sun_Midterm.csv" sun
SET
  "Tên" = er.student_name,
  "Số câu đúng" = (ROUND(er.total_score / 0.25)::INTEGER)::TEXT || '/40',
  "Điểm" = ROUND(er.total_score::NUMERIC, 2)::TEXT
FROM (
  SELECT DISTINCT ON (student_id)
    student_id,
    student_name,
    total_score
  FROM public.exam_responses
  ORDER BY student_id, created_at DESC
) er
WHERE TRIM(sun."MSV"::TEXT) = TRIM(er.student_id);

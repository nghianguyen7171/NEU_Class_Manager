-- Migration: rename Sunday class roster + sync triggers to "Mar3_K56_KTQD"
-- Affects roster tables, indexes, PK constraints, RLS policies, trigger functions, triggers.
-- Idempotent: safe to re-run.
-- Run AFTER public.exam_responses and public.final_exam_responses already exist.

-- =========================================================================
-- 1) Rename midterm roster table
-- =========================================================================
ALTER TABLE IF EXISTS public."DS_Sun_Midterm.csv"
  RENAME TO "DS_Mar3_K56_KTQD_Midterm.csv";

ALTER TABLE IF EXISTS public."DS_Mar3_K56_KTQD_Midterm.csv"
  RENAME CONSTRAINT "DS_Sun_Midterm.csv_pkey"
  TO "DS_Mar3_K56_KTQD_Midterm.csv_pkey";

ALTER INDEX IF EXISTS public.idx_ds_sun_midterm_msv
  RENAME TO idx_ds_mar3_k56_ktqd_midterm_msv;

DROP POLICY IF EXISTS "Allow public read on DS_Sun_Midterm"
  ON public."DS_Mar3_K56_KTQD_Midterm.csv";

CREATE POLICY "Allow public read on DS_Mar3_K56_KTQD_Midterm"
  ON public."DS_Mar3_K56_KTQD_Midterm.csv"
  FOR SELECT
  TO anon, authenticated
  USING (true);

GRANT SELECT ON public."DS_Mar3_K56_KTQD_Midterm.csv" TO anon, authenticated;

COMMENT ON TABLE public."DS_Mar3_K56_KTQD_Midterm.csv"
  IS 'Midterm roster score table for class Mar3_K56_KTQD (renamed from DS_Sun_Midterm.csv).';

-- =========================================================================
-- 2) Rename final roster table
-- =========================================================================
ALTER TABLE IF EXISTS public."DS_Sun_Final.csv"
  RENAME TO "DS_Mar3_K56_KTQD_Final.csv";

ALTER TABLE IF EXISTS public."DS_Mar3_K56_KTQD_Final.csv"
  RENAME CONSTRAINT "DS_Sun_Final.csv_pkey"
  TO "DS_Mar3_K56_KTQD_Final.csv_pkey";

ALTER INDEX IF EXISTS public.idx_ds_sun_final_msv
  RENAME TO idx_ds_mar3_k56_ktqd_final_msv;

DROP POLICY IF EXISTS "Allow public read on DS_Sun_Final"
  ON public."DS_Mar3_K56_KTQD_Final.csv";

CREATE POLICY "Allow public read on DS_Mar3_K56_KTQD_Final"
  ON public."DS_Mar3_K56_KTQD_Final.csv"
  FOR SELECT
  TO anon, authenticated
  USING (true);

GRANT SELECT ON public."DS_Mar3_K56_KTQD_Final.csv" TO anon, authenticated;

COMMENT ON TABLE public."DS_Mar3_K56_KTQD_Final.csv"
  IS 'Final exam roster score table for class Mar3_K56_KTQD (renamed from DS_Sun_Final.csv).';

-- =========================================================================
-- 3) Drop old triggers + functions (Sun-named) so we can recreate cleanly
-- =========================================================================
DROP TRIGGER IF EXISTS trigger_sun_midterm_on_exam ON public.exam_responses;
DROP TRIGGER IF EXISTS trigger_sun_final_on_exam ON public.final_exam_responses;

DROP FUNCTION IF EXISTS public.update_sun_midterm_from_exam_response();
DROP FUNCTION IF EXISTS public.update_sun_final_from_response();

-- =========================================================================
-- 4) New trigger function: midterm sync into Mar3_K56_KTQD roster
-- =========================================================================
CREATE OR REPLACE FUNCTION public.update_mar3_k56_ktqd_midterm_from_exam_response()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  UPDATE public."DS_Mar3_K56_KTQD_Midterm.csv"
  SET
    "Tên" = NEW.student_name,
    "Số câu đúng" = (ROUND(NEW.total_score / 0.25)::INTEGER)::TEXT || '/40',
    "Điểm" = ROUND(NEW.total_score::NUMERIC, 2)::TEXT
  WHERE TRIM("MSV"::TEXT) = TRIM(NEW.student_id);

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trigger_mar3_k56_ktqd_midterm_on_exam ON public.exam_responses;
CREATE TRIGGER trigger_mar3_k56_ktqd_midterm_on_exam
  AFTER INSERT ON public.exam_responses
  FOR EACH ROW
  EXECUTE FUNCTION public.update_mar3_k56_ktqd_midterm_from_exam_response();

-- =========================================================================
-- 5) New trigger function: final sync into Mar3_K56_KTQD roster
-- =========================================================================
CREATE OR REPLACE FUNCTION public.update_mar3_k56_ktqd_final_from_response()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  UPDATE public."DS_Mar3_K56_KTQD_Final.csv"
  SET
    "Số câu đúng" = CONCAT(COALESCE(NEW.num_correct, 0), '/40'),
    "Điểm" = TRIM(TO_CHAR(COALESCE(NEW.total_score, 0), 'FM999999990.00'))
  WHERE TRIM("MSV"::TEXT) = TRIM(NEW.student_id);

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trigger_mar3_k56_ktqd_final_on_exam ON public.final_exam_responses;
CREATE TRIGGER trigger_mar3_k56_ktqd_final_on_exam
  AFTER INSERT OR UPDATE ON public.final_exam_responses
  FOR EACH ROW
  EXECUTE FUNCTION public.update_mar3_k56_ktqd_final_from_response();

-- =========================================================================
-- 6) Reload PostgREST schema cache so new table names are visible to the API
-- =========================================================================
NOTIFY pgrst, 'reload schema';

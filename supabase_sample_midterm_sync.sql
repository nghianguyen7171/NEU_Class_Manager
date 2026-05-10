-- exam_responses -> DS_Sample_Midterm.csv

CREATE OR REPLACE FUNCTION public.update_sample_midterm_from_exam_response()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public."DS_Sample_Midterm.csv"
  SET
    "Tên" = NEW.student_name,
    "Số câu đúng" = (ROUND(NEW.total_score / 0.25)::INTEGER)::TEXT || '/40',
    "Điểm" = ROUND(NEW.total_score::NUMERIC, 2)::TEXT
  WHERE TRIM("MSV"::TEXT) = TRIM(NEW.student_id);

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trigger_sample_midterm_on_exam ON public.exam_responses;

CREATE TRIGGER trigger_sample_midterm_on_exam
  AFTER INSERT ON public.exam_responses
  FOR EACH ROW
  EXECUTE FUNCTION public.update_sample_midterm_from_exam_response();

UPDATE public."DS_Sample_Midterm.csv" t
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
WHERE TRIM(t."MSV"::TEXT) = TRIM(er.student_id);

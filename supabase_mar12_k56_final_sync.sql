-- Sync final_exam_responses -> DS_Mar12_K56_Final.csv

CREATE OR REPLACE FUNCTION public.update_mar12_k56_final_from_response()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public."DS_Mar12_K56_Final.csv"
  SET
    "Số câu đúng" = CONCAT(COALESCE(NEW.num_correct, 0), '/40'),
    "Điểm" = TRIM(TO_CHAR(COALESCE(NEW.total_score, 0), 'FM999999990.00'))
  WHERE TRIM("MSV"::text) = TRIM(NEW.student_id);

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trigger_mar12_k56_final_on_exam ON public.final_exam_responses;
CREATE TRIGGER trigger_mar12_k56_final_on_exam
AFTER INSERT ON public.final_exam_responses
FOR EACH ROW
EXECUTE FUNCTION public.update_mar12_k56_final_from_response();

WITH latest AS (
  SELECT DISTINCT ON (student_id)
    student_id,
    num_correct,
    total_score
  FROM public.final_exam_responses
  ORDER BY student_id, created_at DESC, id DESC
)
UPDATE public."DS_Mar12_K56_Final.csv" d
SET
  "Số câu đúng" = CONCAT(COALESCE(l.num_correct, 0), '/40'),
  "Điểm" = TRIM(TO_CHAR(COALESCE(l.total_score, 0), 'FM999999990.00'))
FROM latest l
WHERE TRIM(d."MSV"::text) = TRIM(l.student_id);

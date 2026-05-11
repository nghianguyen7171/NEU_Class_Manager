-- Cho phép SV nộp bài cuối kỳ nhiều lần: upsert theo student_id + roster cập nhật khi UPDATE
-- Chạy một lần trên Supabase sau khi deploy app (upsert từ examStorage).

-- 1) RLS + quyền UPDATE (anon nộp bài từ web)
DROP POLICY IF EXISTS "Allow update final exam responses" ON public.final_exam_responses;
CREATE POLICY "Allow update final exam responses"
  ON public.final_exam_responses
  FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

GRANT UPDATE ON public.final_exam_responses TO anon, authenticated;

-- 2) Trigger roster: INSERT hoặc UPDATE đều đồng bộ điểm (cùng logic Mar12 / Mar3 / Sample / CLC66D)
DROP TRIGGER IF EXISTS trigger_mar12_k56_final_on_exam ON public.final_exam_responses;
CREATE TRIGGER trigger_mar12_k56_final_on_exam
  AFTER INSERT OR UPDATE ON public.final_exam_responses
  FOR EACH ROW
  EXECUTE FUNCTION public.update_mar12_k56_final_from_response();

DROP TRIGGER IF EXISTS trigger_mar3_k56_ktqd_final_on_exam ON public.final_exam_responses;
CREATE TRIGGER trigger_mar3_k56_ktqd_final_on_exam
  AFTER INSERT OR UPDATE ON public.final_exam_responses
  FOR EACH ROW
  EXECUTE FUNCTION public.update_mar3_k56_ktqd_final_from_response();

DROP TRIGGER IF EXISTS trigger_sample_final_on_exam ON public.final_exam_responses;
CREATE TRIGGER trigger_sample_final_on_exam
  AFTER INSERT OR UPDATE ON public.final_exam_responses
  FOR EACH ROW
  EXECUTE FUNCTION public.update_sample_final_from_response();

DROP TRIGGER IF EXISTS trigger_wed_clc66d_final_on_exam ON public.final_exam_responses;
CREATE TRIGGER trigger_wed_clc66d_final_on_exam
  AFTER INSERT OR UPDATE ON public.final_exam_responses
  FOR EACH ROW
  EXECUTE FUNCTION public.update_wed_clc66d_final_from_response();

NOTIFY pgrst, 'reload schema';

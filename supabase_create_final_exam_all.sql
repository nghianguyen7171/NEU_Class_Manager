-- Final exam question bank table
-- Source CSV: exam/final_exam_all.csv

CREATE TABLE IF NOT EXISTS public.final_exam_all (
  id bigserial PRIMARY KEY,
  "Bài giảng" text NOT NULL,
  "Text đáp án" text NOT NULL,
  "Lựa chọn A" text NOT NULL,
  "Lựa chọn B" text NOT NULL,
  "Lựa chọn C" text NOT NULL,
  "Lựa chọn D" text NOT NULL,
  "Đáp án đúng" text NOT NULL,
  "Điểm" text NULL
);

CREATE INDEX IF NOT EXISTS idx_final_exam_all_lecture
  ON public.final_exam_all ("Bài giảng");

ALTER TABLE public.final_exam_all ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read on final_exam_all" ON public.final_exam_all;
CREATE POLICY "Allow public read on final_exam_all"
  ON public.final_exam_all
  FOR SELECT
  TO anon, authenticated
  USING (true);

GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON public.final_exam_all TO anon, authenticated;

COMMENT ON TABLE public.final_exam_all
  IS 'Final exam question bank with lecture label (Bài giảng).';

NOTIFY pgrst, 'reload schema';

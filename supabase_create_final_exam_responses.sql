-- Final exam submissions table
-- UNIQUE(student_id): app upserts — mỗi MSV một dòng, cập nhật khi làm lại

CREATE TABLE IF NOT EXISTS public.final_exam_responses (
  id bigserial PRIMARY KEY,
  created_at timestamptz NOT NULL DEFAULT now(),
  student_name text NOT NULL,
  student_id text NOT NULL UNIQUE,
  responses jsonb NOT NULL,
  total_score numeric(5,2) NOT NULL,
  num_correct integer NOT NULL CHECK (num_correct >= 0 AND num_correct <= 40)
);

ALTER TABLE public.final_exam_responses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow insert final exam responses" ON public.final_exam_responses;
CREATE POLICY "Allow insert final exam responses"
  ON public.final_exam_responses
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow read final exam responses" ON public.final_exam_responses;
CREATE POLICY "Allow read final exam responses"
  ON public.final_exam_responses
  FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Allow update final exam responses" ON public.final_exam_responses;
CREATE POLICY "Allow update final exam responses"
  ON public.final_exam_responses
  FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON public.final_exam_responses TO anon, authenticated;
GRANT USAGE, SELECT ON SEQUENCE public.final_exam_responses_id_seq TO anon, authenticated;

COMMENT ON TABLE public.final_exam_responses
  IS 'Stores final exam submission payloads and computed scores.';

NOTIFY pgrst, 'reload schema';

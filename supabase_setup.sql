-- Supabase: exam_responses (required for "Nộp bài" / online exam)
-- Run the entire script in Supabase → SQL Editor → Run.
-- Error "Could not find the table 'public.exam_responses' in the schema cache"
-- means this table was never created (or PostgREST needs a schema reload — see end).

CREATE TABLE IF NOT EXISTS public.exam_responses (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    student_name TEXT NOT NULL,
    student_id TEXT NOT NULL,
    test_version INTEGER NOT NULL CHECK (test_version >= 1 AND test_version <= 4),
    responses JSONB NOT NULL,
    total_score NUMERIC(5, 2) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_exam_responses_student_id ON public.exam_responses(student_id);
CREATE INDEX IF NOT EXISTS idx_exam_responses_test_version ON public.exam_responses(test_version);
CREATE INDEX IF NOT EXISTS idx_exam_responses_created_at ON public.exam_responses(created_at DESC);

ALTER TABLE public.exam_responses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public insert" ON public.exam_responses;
DROP POLICY IF EXISTS "Allow public read" ON public.exam_responses;
DROP POLICY IF EXISTS "Allow anon insert exam_responses" ON public.exam_responses;
DROP POLICY IF EXISTS "Allow anon read exam_responses" ON public.exam_responses;

CREATE POLICY "Allow anon insert exam_responses" ON public.exam_responses
    FOR INSERT TO anon, authenticated
    WITH CHECK (true);

CREATE POLICY "Allow anon read exam_responses" ON public.exam_responses
    FOR SELECT TO anon, authenticated
    USING (true);

GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT, INSERT ON public.exam_responses TO anon, authenticated;
GRANT USAGE, SELECT ON SEQUENCE public.exam_responses_id_seq TO anon, authenticated;

COMMENT ON TABLE public.exam_responses IS 'Student exam attempts; required by NEU Class Manager /exam submit';

-- Refresh PostgREST schema cache (helps right after first create)
NOTIFY pgrst, 'reload schema';

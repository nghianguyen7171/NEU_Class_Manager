-- Supabase Table Setup for Exam Responses
-- Run this SQL in your Supabase SQL Editor

-- Create the exam_responses table
CREATE TABLE IF NOT EXISTS public.exam_responses (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    student_name TEXT NOT NULL,
    student_id TEXT NOT NULL,
    test_version INTEGER NOT NULL CHECK (test_version >= 1 AND test_version <= 4),
    responses JSONB NOT NULL,
    total_score NUMERIC(5, 2) NOT NULL
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_exam_responses_student_id ON public.exam_responses(student_id);
CREATE INDEX IF NOT EXISTS idx_exam_responses_test_version ON public.exam_responses(test_version);
CREATE INDEX IF NOT EXISTS idx_exam_responses_created_at ON public.exam_responses(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE public.exam_responses ENABLE ROW LEVEL SECURITY;

-- Create policy: Allow anyone to insert their own responses
CREATE POLICY "Allow public insert" ON public.exam_responses
    FOR INSERT
    TO public
    WITH CHECK (true);

-- Create policy: Allow anyone to read all responses (adjust as needed for your use case)
CREATE POLICY "Allow public read" ON public.exam_responses
    FOR SELECT
    TO public
    USING (true);

-- Optional: Add comment to table
COMMENT ON TABLE public.exam_responses IS 'Stores student exam responses with question details and scores';


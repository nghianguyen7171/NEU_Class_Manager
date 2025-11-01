-- Create summary table for exam results (DS_Fri_1_2_Midterm.csv)
-- This table aggregates data from exam_responses

-- Create the summary table
CREATE TABLE IF NOT EXISTS public."DS_Fri_1_2_Midterm.csv" (
    "MSV" TEXT NOT NULL PRIMARY KEY,
    "Tên" TEXT NOT NULL,
    "Số câu đúng" TEXT NOT NULL,
    "Điểm" TEXT NOT NULL
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_ds_fri_msv ON public."DS_Fri_1_2_Midterm.csv"("MSV");

-- Enable Row Level Security
ALTER TABLE public."DS_Fri_1_2_Midterm.csv" ENABLE ROW LEVEL SECURITY;

-- Create policy: Allow public read access
CREATE POLICY "Allow public read" ON public."DS_Fri_1_2_Midterm.csv"
    FOR SELECT
    TO public
    USING (true);

-- Create policy: Allow insert (for initial population)
CREATE POLICY "Allow public insert" ON public."DS_Fri_1_2_Midterm.csv"
    FOR INSERT
    TO public
    WITH CHECK (true);

-- Create policy: Allow update (for refreshing data)
CREATE POLICY "Allow public update" ON public."DS_Fri_1_2_Midterm.csv"
    FOR UPDATE
    TO public
    USING (true);

-- Function to populate/refresh the summary table from exam_responses
CREATE OR REPLACE FUNCTION refresh_exam_summary()
RETURNS void AS $$
BEGIN
    -- Clear existing data
    TRUNCATE TABLE public."DS_Fri_1_2_Midterm.csv";
    
    -- Insert aggregated data from exam_responses
    INSERT INTO public."DS_Fri_1_2_Midterm.csv" ("MSV", "Tên", "Số câu đúng", "Điểm")
    SELECT 
        er.student_id AS "MSV",
        er.student_name AS "Tên",
        -- Calculate correct answers: score / 0.25 = number of correct answers
        (ROUND(er.total_score / 0.25)::INTEGER)::TEXT || '/40' AS "Số câu đúng",
        -- Format score as text (max 10.00)
        ROUND(er.total_score::NUMERIC, 2)::TEXT AS "Điểm"
    FROM exam_responses er
    ORDER BY er.student_id;
END;
$$ LANGUAGE plpgsql;

-- Call the function to populate the table initially
SELECT refresh_exam_summary();

-- Optional: Create a trigger to automatically update summary when new responses are added
-- (Uncomment if you want auto-updates)
/*
CREATE OR REPLACE FUNCTION update_exam_summary_on_insert()
RETURNS TRIGGER AS $$
BEGIN
    -- Insert or update the summary table
    INSERT INTO public."DS_Fri_1_2_Midterm.csv" ("MSV", "Tên", "Số câu đúng", "Điểm")
    VALUES (
        NEW.student_id,
        NEW.student_name,
        (ROUND(NEW.total_score / 0.25)::INTEGER)::TEXT || '/40',
        ROUND(NEW.total_score::NUMERIC, 2)::TEXT
    )
    ON CONFLICT ("MSV") DO UPDATE
    SET 
        "Tên" = EXCLUDED."Tên",
        "Số câu đúng" = EXCLUDED."Số câu đúng",
        "Điểm" = EXCLUDED."Điểm";
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_summary
AFTER INSERT ON exam_responses
FOR EACH ROW
EXECUTE FUNCTION update_exam_summary_on_insert();
*/

-- Add comment to table
COMMENT ON TABLE public."DS_Fri_1_2_Midterm.csv" IS 'Summary table aggregating exam results from exam_responses';


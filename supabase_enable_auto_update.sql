-- Enable automatic update of summary table when new exam responses are added
-- Run this SQL in Supabase SQL Editor after creating the summary table

-- Create function to update summary table on insert
CREATE OR REPLACE FUNCTION update_exam_summary_on_insert()
RETURNS TRIGGER AS $$
BEGIN
    -- Insert or update the summary table when a new response is added
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

-- Create trigger that fires after insert on exam_responses
DROP TRIGGER IF EXISTS trigger_update_summary ON exam_responses;

CREATE TRIGGER trigger_update_summary
AFTER INSERT ON exam_responses
FOR EACH ROW
EXECUTE FUNCTION update_exam_summary_on_insert();

-- Verify trigger was created
SELECT 
    trigger_name, 
    event_manipulation, 
    event_object_table, 
    action_statement
FROM information_schema.triggers 
WHERE trigger_name = 'trigger_update_summary';


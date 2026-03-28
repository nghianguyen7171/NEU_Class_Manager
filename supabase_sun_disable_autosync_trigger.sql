-- Tạm tắt trigger đồng bộ Sun khi bạn đang set NULL / chỉnh tay mà không muốn bị ghi đè lại từ exam_responses.
-- Mỗi lần có INSERT vào exam_responses, trigger sẽ UPDATE lại DS_Sun_Midterm.csv → có thể làm điểm 2.50 quay lại.

ALTER TABLE public.exam_responses DISABLE TRIGGER trigger_sun_midterm_on_exam;

-- Khi xong thử nghiệm, bật lại:
-- ALTER TABLE public.exam_responses ENABLE TRIGGER trigger_sun_midterm_on_exam;

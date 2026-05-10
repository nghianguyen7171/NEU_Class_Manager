-- Import roster Sample (chạy sau supabase_create_sample_midterm_table.sql)

INSERT INTO public."DS_Sample_Midterm.csv" ("Tên", "MSV", "Số câu đúng", "Điểm")
VALUES
  ('Trần Minh Khôi', 99010001, NULL, NULL),
  ('Lê Thuỳ Linh', 99010002, NULL, NULL),
  ('Phạm Quốc Bảo', 99010003, NULL, NULL),
  ('Hoàng Ngọc Lan', 99010004, NULL, NULL),
  ('Vũ Đức An', 99010005, NULL, NULL)
ON CONFLICT ("MSV") DO UPDATE SET
  "Tên" = EXCLUDED."Tên",
  "Số câu đúng" = EXCLUDED."Số câu đúng",
  "Điểm" = EXCLUDED."Điểm";

NOTIFY pgrst, 'reload schema';

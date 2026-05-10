-- Score roster table for lớp Mar12_K56 (giữa kỳ)

CREATE TABLE IF NOT EXISTS public."DS_Mar12_K56_Midterm.csv" (
  "Tên" text null,
  "MSV" bigint not null,
  "Số câu đúng" text null,
  "Điểm" text null,
  CONSTRAINT "DS_Mar12_K56_Midterm.csv_pkey" PRIMARY KEY ("MSV")
);

CREATE INDEX IF NOT EXISTS idx_ds_mar12_k56_midterm_msv
  ON public."DS_Mar12_K56_Midterm.csv" ("MSV");

ALTER TABLE public."DS_Mar12_K56_Midterm.csv" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read on DS_Mar12_K56_Midterm" ON public."DS_Mar12_K56_Midterm.csv";
CREATE POLICY "Allow public read on DS_Mar12_K56_Midterm"
  ON public."DS_Mar12_K56_Midterm.csv"
  FOR SELECT
  TO anon, authenticated
  USING (true);

GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON public."DS_Mar12_K56_Midterm.csv" TO anon, authenticated;

COMMENT ON TABLE public."DS_Mar12_K56_Midterm.csv"
  IS 'Roster score table for Mar12_K56; columns: Tên, MSV, Số câu đúng, Điểm.';

NOTIFY pgrst, 'reload schema';

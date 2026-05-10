-- Roster giữa kỳ — lớp Sample (5 SV, thử nghiệm quy trình)

CREATE TABLE IF NOT EXISTS public."DS_Sample_Midterm.csv" (
  "Tên" text null,
  "MSV" bigint not null,
  "Số câu đúng" text null,
  "Điểm" text null,
  CONSTRAINT "DS_Sample_Midterm.csv_pkey" PRIMARY KEY ("MSV")
);

CREATE INDEX IF NOT EXISTS idx_ds_sample_midterm_msv
  ON public."DS_Sample_Midterm.csv" ("MSV");

ALTER TABLE public."DS_Sample_Midterm.csv" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read on DS_Sample_Midterm" ON public."DS_Sample_Midterm.csv";
CREATE POLICY "Allow public read on DS_Sample_Midterm"
  ON public."DS_Sample_Midterm.csv"
  FOR SELECT
  TO anon, authenticated
  USING (true);

GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON public."DS_Sample_Midterm.csv" TO anon, authenticated;

COMMENT ON TABLE public."DS_Sample_Midterm.csv"
  IS 'Sample class roster (test); Tên, MSV, Số câu đúng, Điểm.';

NOTIFY pgrst, 'reload schema';

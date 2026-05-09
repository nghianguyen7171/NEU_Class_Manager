-- Final score roster table for CLC66D

CREATE TABLE IF NOT EXISTS public."DS_wed_CLC66D_Final.csv" (
  "Tên" text NULL,
  "MSV" bigint NOT NULL,
  "Số câu đúng" text NULL,
  "Điểm" text NULL,
  CONSTRAINT "DS_wed_CLC66D_Final.csv_pkey" PRIMARY KEY ("MSV")
);

CREATE INDEX IF NOT EXISTS idx_ds_wed_clc66d_final_msv
  ON public."DS_wed_CLC66D_Final.csv" ("MSV");

ALTER TABLE public."DS_wed_CLC66D_Final.csv" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read on DS_wed_CLC66D_Final" ON public."DS_wed_CLC66D_Final.csv";
CREATE POLICY "Allow public read on DS_wed_CLC66D_Final"
  ON public."DS_wed_CLC66D_Final.csv"
  FOR SELECT
  TO anon, authenticated
  USING (true);

GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON public."DS_wed_CLC66D_Final.csv" TO anon, authenticated;

-- Seed roster names + MSV from midterm table
INSERT INTO public."DS_wed_CLC66D_Final.csv" ("Tên", "MSV")
SELECT "Tên", "MSV"
FROM public."DS_wed_CLC66D_Midterm.csv"
ON CONFLICT ("MSV") DO NOTHING;

COMMENT ON TABLE public."DS_wed_CLC66D_Final.csv"
  IS 'Final exam roster score table for CLC66D.';

NOTIFY pgrst, 'reload schema';

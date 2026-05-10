-- Final score roster table for Mar12_K56

CREATE TABLE IF NOT EXISTS public."DS_Mar12_K56_Final.csv" (
  "Tên" text NULL,
  "MSV" bigint NOT NULL,
  "Số câu đúng" text NULL,
  "Điểm" text NULL,
  CONSTRAINT "DS_Mar12_K56_Final.csv_pkey" PRIMARY KEY ("MSV")
);

CREATE INDEX IF NOT EXISTS idx_ds_mar12_k56_final_msv
  ON public."DS_Mar12_K56_Final.csv" ("MSV");

ALTER TABLE public."DS_Mar12_K56_Final.csv" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read on DS_Mar12_K56_Final" ON public."DS_Mar12_K56_Final.csv";
CREATE POLICY "Allow public read on DS_Mar12_K56_Final"
  ON public."DS_Mar12_K56_Final.csv"
  FOR SELECT
  TO anon, authenticated
  USING (true);

GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON public."DS_Mar12_K56_Final.csv" TO anon, authenticated;

INSERT INTO public."DS_Mar12_K56_Final.csv" ("Tên", "MSV")
SELECT "Tên", "MSV"
FROM public."DS_Mar12_K56_Midterm.csv"
ON CONFLICT ("MSV") DO NOTHING;

COMMENT ON TABLE public."DS_Mar12_K56_Final.csv"
  IS 'Final exam roster score table for Mar12_K56.';

NOTIFY pgrst, 'reload schema';

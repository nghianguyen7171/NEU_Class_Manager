-- Final score roster table for Sunday class

CREATE TABLE IF NOT EXISTS public."DS_Sun_Final.csv" (
  "Tên" text NULL,
  "MSV" bigint NOT NULL,
  "Số câu đúng" text NULL,
  "Điểm" text NULL,
  CONSTRAINT "DS_Sun_Final.csv_pkey" PRIMARY KEY ("MSV")
);

CREATE INDEX IF NOT EXISTS idx_ds_sun_final_msv
  ON public."DS_Sun_Final.csv" ("MSV");

ALTER TABLE public."DS_Sun_Final.csv" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read on DS_Sun_Final" ON public."DS_Sun_Final.csv";
CREATE POLICY "Allow public read on DS_Sun_Final"
  ON public."DS_Sun_Final.csv"
  FOR SELECT
  TO anon, authenticated
  USING (true);

GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON public."DS_Sun_Final.csv" TO anon, authenticated;

-- Seed roster names + MSV from midterm table
INSERT INTO public."DS_Sun_Final.csv" ("Tên", "MSV")
SELECT "Tên", "MSV"
FROM public."DS_Sun_Midterm.csv"
ON CONFLICT ("MSV") DO NOTHING;

COMMENT ON TABLE public."DS_Sun_Final.csv"
  IS 'Final exam roster score table for Sunday class.';

NOTIFY pgrst, 'reload schema';

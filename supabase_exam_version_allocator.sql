-- Allocate exam version in strict global round-robin (1 -> 2 -> 3 -> 4 -> 1 ...)
-- while keeping one fixed version per student_id.
--
-- Usage:
--   SELECT public.assign_test_version('11240100');
--
-- Frontend RPC:
--   supabase.rpc('assign_test_version', { p_student_id: '11240100' })

-- 1) Counter table (single-row state machine)
CREATE TABLE IF NOT EXISTS public.exam_version_counter (
  id integer PRIMARY KEY,
  next_version integer NOT NULL CHECK (next_version BETWEEN 1 AND 4),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Ensure singleton row exists
INSERT INTO public.exam_version_counter (id, next_version)
VALUES (1, 1)
ON CONFLICT (id) DO NOTHING;

-- 2) Assignment table: one version per student
CREATE TABLE IF NOT EXISTS public.exam_assignments (
  student_id text PRIMARY KEY,
  test_version integer NOT NULL CHECK (test_version BETWEEN 1 AND 4),
  assigned_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_exam_assignments_assigned_at
  ON public.exam_assignments (assigned_at DESC);

ALTER TABLE public.exam_version_counter ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_assignments ENABLE ROW LEVEL SECURITY;

-- Read own/existing assignments (useful for diagnostics/UI)
DROP POLICY IF EXISTS "Allow anon read exam_assignments" ON public.exam_assignments;
CREATE POLICY "Allow anon read exam_assignments"
  ON public.exam_assignments
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Lock down direct writes from client; writes happen via SECURITY DEFINER RPC only.
DROP POLICY IF EXISTS "Allow anon write exam_assignments" ON public.exam_assignments;
CREATE POLICY "Allow anon write exam_assignments"
  ON public.exam_assignments
  FOR ALL
  TO anon, authenticated
  USING (false)
  WITH CHECK (false);

DROP POLICY IF EXISTS "Allow anon read exam_version_counter" ON public.exam_version_counter;
CREATE POLICY "Allow anon read exam_version_counter"
  ON public.exam_version_counter
  FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Allow anon write exam_version_counter" ON public.exam_version_counter;
CREATE POLICY "Allow anon write exam_version_counter"
  ON public.exam_version_counter
  FOR ALL
  TO anon, authenticated
  USING (false)
  WITH CHECK (false);

-- 3) Atomic allocator RPC
CREATE OR REPLACE FUNCTION public.assign_test_version(p_student_id text)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_existing integer;
  v_next integer;
BEGIN
  IF p_student_id IS NULL OR trim(p_student_id) = '' THEN
    RAISE EXCEPTION 'student_id is required';
  END IF;

  -- Idempotent: if student already assigned, return existing version
  SELECT test_version
  INTO v_existing
  FROM public.exam_assignments
  WHERE student_id = trim(p_student_id);

  IF v_existing IS NOT NULL THEN
    RETURN v_existing;
  END IF;

  -- Lock singleton counter row to serialize allocation
  SELECT next_version
  INTO v_next
  FROM public.exam_version_counter
  WHERE id = 1
  FOR UPDATE;

  IF v_next IS NULL THEN
    v_next := 1;
    INSERT INTO public.exam_version_counter (id, next_version)
    VALUES (1, 2)
    ON CONFLICT (id) DO UPDATE SET next_version = EXCLUDED.next_version;
  ELSE
    UPDATE public.exam_version_counter
    SET
      next_version = CASE WHEN v_next = 4 THEN 1 ELSE v_next + 1 END,
      updated_at = now()
    WHERE id = 1;
  END IF;

  INSERT INTO public.exam_assignments (student_id, test_version)
  VALUES (trim(p_student_id), v_next)
  ON CONFLICT (student_id) DO NOTHING;

  -- If a race inserted first, read back and return canonical value.
  SELECT test_version
  INTO v_existing
  FROM public.exam_assignments
  WHERE student_id = trim(p_student_id);

  RETURN v_existing;
END;
$$;

GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.assign_test_version(text) TO anon, authenticated;
GRANT SELECT ON public.exam_assignments TO anon, authenticated;
GRANT SELECT ON public.exam_version_counter TO anon, authenticated;

COMMENT ON FUNCTION public.assign_test_version(text) IS
  'Return fixed test version for student_id; new IDs allocated globally in round-robin 1..4.';

NOTIFY pgrst, 'reload schema';

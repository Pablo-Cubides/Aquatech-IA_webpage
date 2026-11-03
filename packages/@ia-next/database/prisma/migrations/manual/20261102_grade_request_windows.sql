CREATE TABLE IF NOT EXISTS public.grade_request_windows (
  bucket text PRIMARY KEY,
  "windowStart" timestamptz NOT NULL,
  hits integer NOT NULL CHECK (hits >= 0),
  "expiresAt" timestamptz NOT NULL
);
ALTER TABLE public.grade_request_windows ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='grade_request_windows' AND policyname='grade_request_windows_service_only') THEN
    CREATE POLICY grade_request_windows_service_only ON public.grade_request_windows FOR ALL TO service_role USING (true) WITH CHECK (true);
  END IF;
END $$;
CREATE INDEX IF NOT EXISTS grade_request_windows_expiry_idx ON public.grade_request_windows ("expiresAt");

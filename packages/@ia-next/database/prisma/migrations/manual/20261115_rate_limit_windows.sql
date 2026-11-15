-- OPS-001: almacén PostgreSQL del limitador de tasa de apps/web.
-- Idempotente. Lo mismo lo hace el runtime (CREATE TABLE IF NOT EXISTS) la
-- primera vez que se cuenta, así que aplicarla a mano es opcional pero preferible.
-- La clave `bucket` es un HMAC-SHA256 del identificador: no hay IP ni correo aquí.
CREATE TABLE IF NOT EXISTS public.rate_limit_windows (
  bucket text PRIMARY KEY,
  hits integer NOT NULL CHECK (hits >= 0),
  "expiresAt" timestamptz NOT NULL
);
ALTER TABLE public.rate_limit_windows ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'service_role')
     AND NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='rate_limit_windows' AND policyname='rate_limit_windows_service_only') THEN
    CREATE POLICY rate_limit_windows_service_only ON public.rate_limit_windows FOR ALL TO service_role USING (true) WITH CHECK (true);
  END IF;
END $$;
CREATE INDEX IF NOT EXISTS rate_limit_windows_expiry_idx ON public.rate_limit_windows ("expiresAt");

-- OPS-001: almacén PostgreSQL del limitador de tasa de apps/web.
--
-- PRERREQUISITO DE DESPLIEGUE: aplicar esta migración en Supabase (SQL Editor, con el
-- rol dueño, p. ej. postgres) ANTES de desplegar. Es idempotente.
-- El runtime solo la crea como red de seguridad y SE NIEGA a usar la tabla si no
-- puede dejarla con RLS activo, porque está en `public` y Supabase la expone por
-- PostgREST: sin RLS, quien tenga la anon key (pública por diseño) podría borrar o
-- reiniciar contadores y saltarse el limitador.
--
-- La clave `bucket` es un HMAC-SHA256 del identificador: no hay IP ni correo aquí.
CREATE TABLE IF NOT EXISTS public.rate_limit_windows (
  bucket text PRIMARY KEY,
  hits integer NOT NULL CHECK (hits >= 0),
  "expiresAt" timestamptz NOT NULL
);
ALTER TABLE public.rate_limit_windows ENABLE ROW LEVEL SECURITY;
-- Defensa en profundidad: sin permisos para los roles de la API REST aunque alguien añada una política.
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN
    REVOKE ALL ON public.rate_limit_windows FROM anon;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN
    REVOKE ALL ON public.rate_limit_windows FROM authenticated;
  END IF;
END $$;
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'service_role')
     AND NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='rate_limit_windows' AND policyname='rate_limit_windows_service_only') THEN
    CREATE POLICY rate_limit_windows_service_only ON public.rate_limit_windows FOR ALL TO service_role USING (true) WITH CHECK (true);
  END IF;
END $$;
CREATE INDEX IF NOT EXISTS rate_limit_windows_expiry_idx ON public.rate_limit_windows ("expiresAt");

-- Comprobación (debe devolver rls = true):
--   SELECT relrowsecurity AS rls FROM pg_class WHERE oid = 'public.rate_limit_windows'::regclass;

-- Structured grade reports; legacy notes remain intact.
CREATE TABLE IF NOT EXISTS "grade_reports" (
 "id" TEXT PRIMARY KEY,
 "period" TEXT NOT NULL,
 "courseId" TEXT NOT NULL,
 "courseTitle" TEXT NOT NULL,
 "groupLabel" TEXT NOT NULL,
 "university" TEXT NOT NULL,
 "cut" INTEGER NOT NULL CHECK ("cut" BETWEEN 1 AND 3),
 "code" TEXT NOT NULL CHECK ("code" ~ '^[0-9]{4,20}$'),
 "sourceVersion" TEXT NOT NULL CHECK ("sourceVersion" ~ '^[0-9]+$'),
 "sourceSha256" TEXT NOT NULL,
 "reportHash" TEXT NOT NULL,
 "payload" JSONB NOT NULL,
 "published" BOOLEAN NOT NULL DEFAULT FALSE,
 "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
 "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE "grade_reports" ENABLE ROW LEVEL SECURITY;
-- Only the backend service role may use direct database access. The web API
-- separately checks ADMIN for writes and exact student code for lookup.
DO $$ BEGIN
 IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname='service_role') AND NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='grade_reports' AND policyname='grade_reports_service_only') THEN
  CREATE POLICY "grade_reports_service_only" ON "grade_reports" TO service_role USING (true) WITH CHECK (true);
 END IF;
END $$;
CREATE UNIQUE INDEX IF NOT EXISTS "grade_reports_period_courseId_cut_code_key" ON "grade_reports" ("period","courseId","cut","code");
CREATE INDEX IF NOT EXISTS "grade_reports_code_published_idx" ON "grade_reports" ("code","published");

-- Enable RLS on all public tables and create appropriate policies
-- This migration secures the database by restricting access based on user context

-- =============================================
-- 1. ACCOUNTS TABLE (Auth - Private)
-- =============================================
ALTER TABLE public.accounts ENABLE ROW LEVEL SECURITY;

-- Only the owner can access their own accounts
CREATE POLICY "Users can view their own accounts"
  ON public.accounts FOR SELECT
  USING (user_id = auth.uid()::text);

CREATE POLICY "Users can manage their own accounts"
  ON public.accounts FOR ALL
  USING (user_id = auth.uid()::text);

-- =============================================
-- 2. SESSIONS TABLE (Auth - Private)
-- =============================================
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own sessions"
  ON public.sessions FOR SELECT
  USING (user_id = auth.uid()::text);

CREATE POLICY "Users can manage their own sessions"
  ON public.sessions FOR ALL
  USING (user_id = auth.uid()::text);

-- =============================================
-- 3. USERS TABLE (Public profile, private edits)
-- =============================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Anyone can view user profiles (for public features)
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.users FOR SELECT
  USING (true);

-- Users can only update their own profile
CREATE POLICY "Users can update own profile"
  ON public.users FOR UPDATE
  USING (id = auth.uid()::text);

-- =============================================
-- 4. ADMIN_LOGS TABLE (Admin only)
-- =============================================
ALTER TABLE public.admin_logs ENABLE ROW LEVEL SECURITY;

-- Only admins can view admin logs
CREATE POLICY "Admins can view logs"
  ON public.admin_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid()::text AND role = 'ADMIN'
    )
  );

-- =============================================
-- 5. CONTENT TABLE (Public read, admin write)
-- =============================================
ALTER TABLE public.content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Content is publicly readable"
  ON public.content FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage content"
  ON public.content FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid()::text AND role = 'ADMIN'
    )
  );

-- =============================================
-- 6. CREDIT_LOGS TABLE (Private - owner only)
-- =============================================
ALTER TABLE public.credit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own credit logs"
  ON public.credit_logs FOR SELECT
  USING (user_id = auth.uid()::text);

-- =============================================
-- 7. EDITOR_SECTIONS TABLE (Public read, admin write)
-- =============================================
ALTER TABLE public.editor_sections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Editor sections are publicly readable"
  ON public.editor_sections FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage editor sections"
  ON public.editor_sections FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid()::text AND role = 'ADMIN'
    )
  );

-- =============================================
-- 8. EMAIL_EVENTS TABLE (Private - owner only)
-- =============================================
ALTER TABLE public.email_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own email events"
  ON public.email_events FOR SELECT
  USING (user_id = auth.uid()::text);

-- =============================================
-- 9. NOTES TABLE (Public read, authenticated write)
-- =============================================
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Notes are publicly readable"
  ON public.notes FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create notes"
  ON public.notes FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their own notes"
  ON public.notes FOR UPDATE
  USING (uploaded_by = auth.uid()::text);

-- =============================================
-- 10. PAYMENTS TABLE (Private - owner only)
-- =============================================
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own payments"
  ON public.payments FOR SELECT
  USING (user_id = auth.uid()::text);

-- =============================================
-- 11. QUESTION_SETS TABLE (Public read, owner write)
-- =============================================
ALTER TABLE public.question_sets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Question sets are publicly readable"
  ON public.question_sets FOR SELECT
  USING (true);

CREATE POLICY "Users can manage their own question sets"
  ON public.question_sets FOR ALL
  USING (user_id = auth.uid()::text);

-- =============================================
-- 12. QUESTIONS TABLE (Public read, owner write)
-- =============================================
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Questions are publicly readable"
  ON public.questions FOR SELECT
  USING (true);

-- Questions inherit access from their parent question set
CREATE POLICY "Users can manage questions in their sets"
  ON public.questions FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.question_sets 
      WHERE id = question_set_id AND user_id = auth.uid()::text
    )
  );

-- =============================================
-- 13. VERIFICATION_TOKENS TABLE (System only)
-- =============================================
ALTER TABLE public.verification_tokens ENABLE ROW LEVEL SECURITY;

-- No user access - handled by system
CREATE POLICY "No direct user access"
  ON public.verification_tokens FOR ALL
  USING (false);

-- =============================================
-- SERVICE ROLE BYPASS
-- =============================================
-- Note: The service_role key bypasses RLS automatically in Supabase.
-- This ensures backend operations (like NextAuth adapter) still work.

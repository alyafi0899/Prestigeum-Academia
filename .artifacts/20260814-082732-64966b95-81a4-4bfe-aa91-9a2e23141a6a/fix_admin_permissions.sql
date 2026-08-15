-- FIX: ADMIN PERMISSIONS (SAFE VERSION)
-- Run this in your Supabase SQL Editor to allow Admins to post events, articles, and gallery items.

-- 1. Helper function to check if current user is an admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM pa_profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Update pa_trainings policies
DROP POLICY IF EXISTS "Admins can insert trainings" ON pa_trainings;
CREATE POLICY "Admins can insert trainings" ON pa_trainings FOR INSERT WITH CHECK (is_admin());

DROP POLICY IF EXISTS "Admins can update trainings" ON pa_trainings;
CREATE POLICY "Admins can update trainings" ON pa_trainings FOR UPDATE USING (is_admin());

DROP POLICY IF EXISTS "Admins can delete trainings" ON pa_trainings;
CREATE POLICY "Admins can delete trainings" ON pa_trainings FOR DELETE USING (is_admin());

-- 3. Update pa_articles policies
DROP POLICY IF EXISTS "Admins can insert articles" ON pa_articles;
CREATE POLICY "Admins can insert articles" ON pa_articles FOR INSERT WITH CHECK (is_admin());

DROP POLICY IF EXISTS "Admins can update articles" ON pa_articles;
CREATE POLICY "Admins can update articles" ON pa_articles FOR UPDATE USING (is_admin());

DROP POLICY IF EXISTS "Admins can delete articles" ON pa_articles;
CREATE POLICY "Admins can delete articles" ON pa_articles FOR DELETE USING (is_admin());

-- 4. Update pa_gallery policies
DROP POLICY IF EXISTS "Admins can insert gallery" ON pa_gallery;
CREATE POLICY "Admins can insert gallery" ON pa_gallery FOR INSERT WITH CHECK (is_admin());

DROP POLICY IF EXISTS "Admins can update gallery" ON pa_gallery;
CREATE POLICY "Admins can update gallery" ON pa_gallery FOR UPDATE USING (is_admin());

DROP POLICY IF EXISTS "Admins can delete gallery" ON pa_gallery;
CREATE POLICY "Admins can delete gallery" ON pa_gallery FOR DELETE USING (is_admin());

-- 5. Update pa_registrations policies for Admins
DROP POLICY IF EXISTS "Admins can view all registrations" ON pa_registrations;
CREATE POLICY "Admins can view all registrations" ON pa_registrations FOR SELECT USING (is_admin());

DROP POLICY IF EXISTS "Admins can update all registrations" ON pa_registrations;
CREATE POLICY "Admins can update all registrations" ON pa_registrations FOR UPDATE USING (is_admin());

-- 6. Update pa_certificates policies for Admins
DROP POLICY IF EXISTS "Admins can insert certificates" ON pa_certificates;
CREATE POLICY "Admins can insert certificates" ON pa_certificates FOR INSERT WITH CHECK (is_admin());

DROP POLICY IF EXISTS "Admins can update certificates" ON pa_certificates;
CREATE POLICY "Admins can update certificates" ON pa_certificates FOR UPDATE USING (is_admin());

-- 7. Update pa_profiles policies for Admins
DROP POLICY IF EXISTS "Admins can view all profiles" ON pa_profiles;
CREATE POLICY "Admins can view all profiles" ON pa_profiles FOR SELECT USING (is_admin());

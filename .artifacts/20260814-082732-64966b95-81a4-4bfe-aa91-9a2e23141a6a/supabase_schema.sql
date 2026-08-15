-- PRESTIGEUM ACADEMIA - FULL DATABASE SCHEMA
-- This script contains the finalized tables, columns, and logic synchronized with the latest app code.

-- 1. PROFILES (Extends Supabase Auth)
CREATE TABLE IF NOT EXISTS pa_profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  wa_number TEXT,
  role TEXT DEFAULT 'user', -- 'user' or 'admin'
  avatar_url TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. TRAININGS (Comprehensive Event Data)
CREATE TABLE IF NOT EXISTS pa_trainings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT,
  level TEXT,
  format TEXT,
  date TEXT,
  time TEXT,
  duration TEXT,
  location TEXT,
  instructor TEXT,
  instructor_title TEXT,
  instructor_image_url TEXT,
  instructor_specialization TEXT,
  instructor_experience TEXT,
  instructor_bio TEXT,
  seats INTEGER DEFAULT 0,
  seats_left INTEGER DEFAULT 0,
  max_participants INTEGER DEFAULT 0,
  price TEXT,
  deadline TEXT,
  image_url TEXT, -- Hero Banner
  flyer_url TEXT, -- Poster Image
  description TEXT,
  short_desc TEXT,
  language TEXT DEFAULT 'Indonesian',
  target_audience TEXT,
  objectives JSONB DEFAULT '[]', -- List of strings
  modules JSONB DEFAULT '[]', -- List of objects {title, desc, duration, outcomes:[]}
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 3. REGISTRATIONS
CREATE TABLE IF NOT EXISTS pa_registrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  training_id UUID REFERENCES pa_trainings ON DELETE CASCADE,
  status TEXT DEFAULT 'Registered', -- 'Registered', 'Confirmed', 'Completed', 'Cancelled'
  attendance_status TEXT DEFAULT 'Pending', -- 'Pending', 'Attended', 'Absent'
  check_in_time TIMESTAMP WITH TIME ZONE,
  signature_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  UNIQUE(user_id, training_id)
);

-- 4. ARTICLES
CREATE TABLE IF NOT EXISTS pa_articles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT,
  excerpt TEXT,
  author TEXT,
  body TEXT,
  image_url TEXT,
  read_time TEXT,
  published_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 5. GALLERY
CREATE TABLE IF NOT EXISTS pa_gallery (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category TEXT,
  title TEXT,
  caption TEXT,
  image_url TEXT,
  date TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 6. CERTIFICATES
CREATE TABLE IF NOT EXISTS pa_certificates (
  id TEXT PRIMARY KEY, -- Format: PA-CERT-YYYY-XXXXX
  registration_id UUID REFERENCES pa_registrations ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  training_id UUID REFERENCES pa_trainings ON DELETE CASCADE,
  issued_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  verification_url TEXT
);

-- 7. FUNCTION: Deduct Seat (Atomic)
CREATE OR REPLACE FUNCTION pa_deduct_seat(t_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE pa_trainings
  SET seats_left = seats_left - 1
  WHERE id = t_id AND seats_left > 0;
END;
$$ LANGUAGE plpgsql;

-- 8. TRIGGER: Create Profile on Signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.pa_profiles (id, full_name, role)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', COALESCE(new.raw_user_meta_data->>'role', 'user'));
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 9. HELPER: Check Admin Role
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM pa_profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 10. RLS POLICIES (Row Level Security)
ALTER TABLE pa_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE pa_trainings ENABLE ROW LEVEL SECURITY;
ALTER TABLE pa_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE pa_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE pa_gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE pa_certificates ENABLE ROW LEVEL SECURITY;

-- Public Select
CREATE POLICY "Public select" ON pa_trainings FOR SELECT USING (true);
CREATE POLICY "Public select" ON pa_articles FOR SELECT USING (true);
CREATE POLICY "Public select" ON pa_gallery FOR SELECT USING (true);
CREATE POLICY "Public select" ON pa_certificates FOR SELECT USING (true);

-- User Profiles & Registrations
CREATE POLICY "Users view own profile" ON pa_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users update own profile" ON pa_profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users view own registrations" ON pa_registrations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users create own registrations" ON pa_registrations FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Admin Full Access (Using is_admin helper)
CREATE POLICY "Admin write trainings" ON pa_trainings FOR ALL USING (is_admin());
CREATE POLICY "Admin write articles" ON pa_articles FOR ALL USING (is_admin());
CREATE POLICY "Admin write gallery" ON pa_gallery FOR ALL USING (is_admin());
CREATE POLICY "Admin manage registrations" ON pa_registrations FOR ALL USING (is_admin());
CREATE POLICY "Admin manage certificates" ON pa_certificates FOR ALL USING (is_admin());
CREATE POLICY "Admin view profiles" ON pa_profiles FOR SELECT USING (is_admin());

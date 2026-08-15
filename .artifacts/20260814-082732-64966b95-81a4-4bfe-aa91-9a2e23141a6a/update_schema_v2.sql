-- UPDATE SCHEMA V2: COMPREHENSIVE EVENT DATA
-- Adds missing columns to pa_trainings for a complete "Alive" experience

ALTER TABLE pa_trainings
ADD COLUMN IF NOT EXISTS flyer_url TEXT,
ADD COLUMN IF NOT EXISTS instructor_image_url TEXT,
ADD COLUMN IF NOT EXISTS instructor_specialization TEXT,
ADD COLUMN IF NOT EXISTS instructor_experience TEXT,
ADD COLUMN IF NOT EXISTS instructor_bio TEXT;

-- Update modules structure hint (JSONB)
-- The code will now send:
-- modules: [
--   {
--     title: "...",
--     desc: "...",
--     duration: "...",
--     outcomes: ["...", "..."]
--   }
-- ]

-- New table to store exercise definitions
CREATE TABLE public.exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  target_muscle_groups TEXT[],
  is_preset BOOLEAN NOT NULL DEFAULT FALSE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE, -- Nullable: if NULL, it's a preset exercise
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  -- Ensures that preset exercises don't have a user_id
  CONSTRAINT preset_exercises_have_null_user_id CHECK (NOT (is_preset = TRUE AND user_id IS NOT NULL)),
  -- Ensures that custom (non-preset) exercises DO have a user_id
  CONSTRAINT custom_exercises_have_user_id CHECK (NOT (is_preset = FALSE AND user_id IS NULL)),
  -- Ensures unique names for preset exercises (where user_id is NULL)
  CONSTRAINT unique_preset_exercise_name UNIQUE (name, user_id), -- Achieved by user_id being NULL for all presets
  -- Ensures unique names for a user's custom exercises
  CONSTRAINT unique_user_custom_exercise_name UNIQUE (user_id, name)
);

-- For the unique_preset_exercise_name, if you want to enforce name uniqueness ONLY among presets,
-- and allow a user to have a custom exercise with the same name as a preset, the above UNIQUE (name, user_id) 
-- where user_id is NULL for presets effectively handles this. 
-- If you wanted truly globally unique names for presets (irrespective of user_id always being NULL for them),
-- a partial unique index would be better:
-- CREATE UNIQUE INDEX unique_preset_name_idx ON public.exercises (name) WHERE user_id IS NULL;
-- However, the current UNIQUE (name, user_id) constraint along with user_id always being null for presets, effectively makes preset names unique.

-- Create an index for faster lookups
CREATE INDEX idx_exercises_user_id ON public.exercises(user_id);
CREATE INDEX idx_exercises_is_preset ON public.exercises(is_preset);
CREATE INDEX idx_exercises_category ON public.exercises(category);

-- RLS (Row Level Security) Policies for exercises table
ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;

-- Users can see all preset exercises
CREATE POLICY "Allow users to see all preset exercises"
ON public.exercises
FOR SELECT
TO authenticated
USING (is_preset = TRUE);

-- Users can see their own custom exercises
CREATE POLICY "Allow users to see their own custom exercises"
ON public.exercises
FOR SELECT
TO authenticated
USING (auth.uid() = user_id AND is_preset = FALSE);

-- Users can insert their own custom exercises
CREATE POLICY "Allow users to insert their own custom exercises"
ON public.exercises
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id AND is_preset = FALSE);

-- Users can update their own custom exercises
CREATE POLICY "Allow users to update their own custom exercises"
ON public.exercises
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id AND is_preset = FALSE)
WITH CHECK (auth.uid() = user_id AND is_preset = FALSE AND id IS NOT NULL AND name IS NOT NULL AND category IS NOT NULL); -- Added more checks for update

-- Users can delete their own custom exercises
CREATE POLICY "Allow users to delete their own custom exercises"
ON public.exercises
FOR DELETE
TO authenticated
USING (auth.uid() = user_id AND is_preset = FALSE);

-- Trigger to automatically update 'updated_at' timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

CREATE TRIGGER update_exercises_updated_at
BEFORE UPDATE ON public.exercises
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Seed data for preset exercises (example)
INSERT INTO public.exercises (name, category, description, target_muscle_groups, is_preset, user_id)
VALUES
  ('Bench Press', 'Chest', 'Compound movement for chest, shoulders, and triceps.', '{"Pectorals", "Deltoids", "Triceps"}', TRUE, NULL),
  ('Squat', 'Legs', 'Compound movement for quads, hamstrings, and glutes.', '{"Quadriceps", "Hamstrings", "Glutes"}', TRUE, NULL),
  ('Deadlift', 'Back', 'Compound movement for back, legs, and core.', '{"Erector Spinae", "Hamstrings", "Glutes", "Trapezius"}', TRUE, NULL),
  ('Overhead Press', 'Shoulders', 'Compound movement for shoulders and triceps.', '{"Deltoids", "Triceps"}', TRUE, NULL),
  ('Barbell Row', 'Back', 'Compound movement for upper back and biceps.', '{"Latissimus Dorsi", "Trapezius", "Rhomboids", "Biceps"}', TRUE, NULL),
  ('Bicep Curl', 'Arms', 'Isolation movement for biceps.', '{"Biceps"}', TRUE, NULL),
  ('Tricep Extension', 'Arms', 'Isolation movement for triceps.', '{"Triceps"}', TRUE, NULL),
  ('Leg Press', 'Legs', 'Compound movement for quads, hamstrings, and glutes.', '{"Quadriceps", "Hamstrings", "Glutes"}', TRUE, NULL),
  ('Lat Pulldown', 'Back', 'Compound movement for upper back.', '{"Latissimus Dorsi"}', TRUE, NULL),
  ('Plank', 'Core', 'Isometric exercise for core stability.', '{"Abdominals", "Obliques"}', TRUE, NULL),
  ('Running', 'Cardio', 'Cardiovascular exercise.', '{"Legs", "Cardiovascular System"}', TRUE, NULL),
  ('Cycling', 'Cardio', 'Low-impact cardiovascular exercise.', '{"Legs", "Cardiovascular System"}', TRUE, NULL); 
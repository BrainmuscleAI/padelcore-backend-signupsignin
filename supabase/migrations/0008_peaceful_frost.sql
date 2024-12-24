/*
  # Fix User Registration Flow

  1. Changes
    - Fix trigger function to correctly access user email
    - Improve username generation logic
    - Add better error handling for duplicate usernames
    - Add proper constraints and indexes

  2. Security
    - Maintain existing RLS policies
    - Ensure proper data validation
*/

-- Improve username generation function
CREATE OR REPLACE FUNCTION generate_unique_username(base_username TEXT)
RETURNS TEXT AS $$
DECLARE
  new_username TEXT;
  counter INTEGER := 0;
  max_attempts INTEGER := 100;
BEGIN
  -- Sanitize base username
  new_username := regexp_replace(
    lower(unaccent(base_username)),
    '[^a-z0-9]',
    '',
    'g'
  );
  
  -- Ensure minimum length
  IF length(new_username) < 3 THEN
    new_username := new_username || repeat('0', 3 - length(new_username));
  END IF;
  
  -- Try to find a unique username
  WHILE counter < max_attempts AND EXISTS (
    SELECT 1 FROM profiles WHERE username = new_username
  ) LOOP
    counter := counter + 1;
    new_username := substring(base_username for 15) || counter::TEXT;
  END LOOP;
  
  IF counter >= max_attempts THEN
    RAISE EXCEPTION 'Could not generate unique username after % attempts', max_attempts;
  END IF;
  
  RETURN new_username;
END;
$$ LANGUAGE plpgsql;

-- Update profile creation trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  base_username TEXT;
  final_username TEXT;
BEGIN
  -- Generate base username from email or provided username
  base_username := COALESCE(
    new.raw_user_meta_data->>'username',
    split_part(new.email, '@', 1)
  );
  
  -- Get unique username
  final_username := generate_unique_username(base_username);
  
  INSERT INTO public.profiles (
    id,
    username,
    full_name,
    avatar_url,
    rating,
    matches_played,
    wins,
    losses,
    created_at,
    updated_at
  ) VALUES (
    new.id,
    final_username,
    COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url',
    1000,
    0,
    0,
    0,
    now(),
    now()
  );
  
  RETURN new;
EXCEPTION
  WHEN unique_violation THEN
    -- Handle the case where username is still somehow duplicate
    RAISE EXCEPTION 'Could not create profile: username already exists';
  WHEN OTHERS THEN
    RAISE EXCEPTION 'Error creating profile: %', SQLERRM;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Add index for username lookups
CREATE INDEX IF NOT EXISTS profiles_username_idx ON profiles (username);

-- Ensure constraints
ALTER TABLE profiles
  DROP CONSTRAINT IF EXISTS username_format,
  ADD CONSTRAINT username_format CHECK (
    username ~* '^[a-z0-9][a-z0-9_]*$' AND
    length(username) >= 3 AND
    length(username) <= 20
  );

-- Update existing profiles to ensure valid usernames
UPDATE profiles SET
  username = generate_unique_username(username)
WHERE username !~* '^[a-z0-9][a-z0-9_]*$'
   OR length(username) < 3
   OR length(username) > 20;
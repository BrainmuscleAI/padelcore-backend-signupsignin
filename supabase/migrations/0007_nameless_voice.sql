/*
  # Fix Profile Constraints and Defaults

  1. Changes
    - Add proper constraints to profiles table
    - Update trigger function to handle duplicates
    - Add default values for required fields

  2. Security
    - Maintain existing RLS policies
*/

-- Add extensions if not exists
CREATE EXTENSION IF NOT EXISTS "unaccent";

-- Function to generate unique username
CREATE OR REPLACE FUNCTION generate_unique_username(base_username TEXT)
RETURNS TEXT AS $$
DECLARE
  new_username TEXT;
  counter INTEGER := 0;
BEGIN
  -- First try the base username
  new_username := base_username;
  
  -- Keep trying with incrementing numbers until we find a unique one
  WHILE EXISTS (SELECT 1 FROM profiles WHERE username = new_username) LOOP
    counter := counter + 1;
    new_username := base_username || counter::TEXT;
  END LOOP;
  
  RETURN new_username;
END;
$$ LANGUAGE plpgsql;

-- Update the profile creation trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  base_username TEXT;
  final_username TEXT;
BEGIN
  -- Generate base username from email or provided username
  base_username := COALESCE(
    new.raw_user_meta_data->>'username',
    regexp_replace(
      lower(unaccent(split_part(new.raw_user_meta_data->>'email', '@', 1))),
      '[^a-z0-9]',
      '',
      'g'
    )
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
    COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.raw_user_meta_data->>'email', '@', 1)),
    new.raw_user_meta_data->>'avatar_url',
    1000,
    0,
    0,
    0,
    now(),
    now()
  );
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Add check constraints
ALTER TABLE profiles
  ADD CONSTRAINT username_format CHECK (
    username ~* '^[a-zA-Z0-9_]+$' AND
    length(username) >= 3 AND
    length(username) <= 20
  ),
  ADD CONSTRAINT rating_range CHECK (
    rating >= 0 AND rating <= 3000
  ),
  ADD CONSTRAINT matches_non_negative CHECK (
    matches_played >= 0 AND
    wins >= 0 AND
    losses >= 0 AND
    wins + losses <= matches_played
  );

-- Update existing rows to ensure they meet constraints
UPDATE profiles SET
  username = generate_unique_username(
    COALESCE(
      username,
      regexp_replace(
        lower(unaccent(split_part(auth.users.raw_user_meta_data->>'email', '@', 1))),
        '[^a-z0-9]',
        '',
        'g'
      )
    )
  )
FROM auth.users
WHERE profiles.id = auth.users.id
  AND (username IS NULL OR username !~* '^[a-zA-Z0-9_]+$');
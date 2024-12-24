/*
  # Fix User Registration Flow

  1. Changes
    - Improve profile creation trigger
    - Add better error handling
    - Fix username generation
    - Add proper constraints

  2. Security
    - Maintain RLS policies
    - Add input validation
*/

-- Improve username generation with better sanitization and error handling
CREATE OR REPLACE FUNCTION generate_unique_username(base_username TEXT)
RETURNS TEXT AS $$
DECLARE
  new_username TEXT;
  counter INTEGER := 0;
  max_attempts INTEGER := 100;
BEGIN
  -- Sanitize and normalize base username
  new_username := regexp_replace(
    lower(COALESCE(base_username, 'user')),
    '[^a-z0-9]',
    '',
    'g'
  );
  
  -- Ensure minimum length and valid start character
  IF length(new_username) < 3 OR new_username !~ '^[a-z]' THEN
    new_username := 'user' || COALESCE(new_username, '');
  END IF;
  
  -- Truncate if too long
  new_username := substring(new_username, 1, 15);
  
  -- Find unique username
  WHILE counter < max_attempts AND EXISTS (
    SELECT 1 FROM profiles WHERE lower(username) = lower(new_username)
  ) LOOP
    counter := counter + 1;
    new_username := substring(new_username, 1, 15) || counter::TEXT;
  END LOOP;
  
  IF counter >= max_attempts THEN
    RAISE EXCEPTION 'Could not generate unique username after % attempts', max_attempts;
  END IF;
  
  RETURN new_username;
END;
$$ LANGUAGE plpgsql;

-- Improve profile creation trigger with better error handling
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  base_username TEXT;
  final_username TEXT;
  user_full_name TEXT;
BEGIN
  -- Get base username from metadata or generate one
  base_username := COALESCE(
    new.raw_user_meta_data->>'username',
    split_part(new.email, '@', 1),
    'user'
  );
  
  -- Get full name from metadata or use email prefix
  user_full_name := COALESCE(
    new.raw_user_meta_data->>'full_name',
    initcap(split_part(new.email, '@', 1))
  );
  
  -- Generate unique username with retries
  BEGIN
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
      user_full_name,
      new.raw_user_meta_data->>'avatar_url',
      1000,
      0,
      0,
      0,
      now(),
      now()
    );
  EXCEPTION 
    WHEN unique_violation THEN
      -- Add random suffix and retry on collision
      final_username := generate_unique_username(
        base_username || floor(random() * 1000)::text
      );
      
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
        user_full_name,
        new.raw_user_meta_data->>'avatar_url',
        1000,
        0,
        0,
        0,
        now(),
        now()
      );
  END;
  
  RETURN new;
EXCEPTION
  WHEN others THEN
    RAISE LOG 'Profile creation failed: %', SQLERRM;
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Ensure indexes for username lookups
DROP INDEX IF EXISTS profiles_username_lower_idx;
CREATE UNIQUE INDEX profiles_username_lower_idx ON profiles (lower(username));

-- Update constraints
ALTER TABLE profiles
  DROP CONSTRAINT IF EXISTS username_format,
  ADD CONSTRAINT username_format CHECK (
    username ~* '^[a-z][a-z0-9_]*$' AND
    length(username) >= 3 AND
    length(username) <= 20
  );
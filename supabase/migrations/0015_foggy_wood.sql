/*
  # Fix Profile Creation and Retrieval

  1. Changes
    - Add better error handling for profile creation
    - Improve username generation logic
    - Add retry mechanism for race conditions
    - Fix profile retrieval queries
    - Add better indexes for performance

  2. Security
    - Maintain existing RLS policies
    - Add validation for username format
*/

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Improve username generation with better validation and retry logic
CREATE OR REPLACE FUNCTION generate_unique_username(base_username TEXT)
RETURNS TEXT AS $$
DECLARE
  new_username TEXT;
  counter INTEGER := 0;
  max_attempts INTEGER := 100;
BEGIN
  -- Sanitize and normalize base username
  new_username := regexp_replace(
    lower(COALESCE(NULLIF(trim(base_username), ''), 'user')),
    '[^a-z0-9]',
    '',
    'g'
  );
  
  -- Ensure valid username format
  IF length(new_username) < 3 OR new_username !~ '^[a-z]' THEN
    new_username := 'user' || COALESCE(new_username, '');
  END IF;
  
  -- Truncate if too long
  new_username := substring(new_username, 1, 15);
  
  -- Find unique username with retry logic
  WHILE counter < max_attempts LOOP
    BEGIN
      -- Check if username exists
      IF NOT EXISTS (
        SELECT 1 FROM profiles 
        WHERE lower(username) = lower(new_username)
      ) THEN
        RETURN new_username;
      END IF;
      
      counter := counter + 1;
      new_username := substring(new_username, 1, 12) || counter::TEXT;
    EXCEPTION 
      WHEN OTHERS THEN
        -- Log error and continue
        RAISE WARNING 'Error checking username: %', SQLERRM;
        counter := counter + 1;
    END;
  END LOOP;
  
  -- Fallback to timestamp-based username
  RETURN 'user' || extract(epoch from now())::bigint % 1000000;
END;
$$ LANGUAGE plpgsql;

-- Improve profile creation with better error handling and retries
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  base_username TEXT;
  final_username TEXT;
  user_full_name TEXT;
  max_retries INTEGER := 3;
  current_retry INTEGER := 0;
BEGIN
  -- Get base username from metadata or email
  base_username := COALESCE(
    new.raw_user_meta_data->>'username',
    split_part(new.email, '@', 1),
    'user'
  );
  
  -- Get full name from metadata or email
  user_full_name := COALESCE(
    new.raw_user_meta_data->>'full_name',
    initcap(split_part(new.email, '@', 1))
  );
  
  -- Retry loop for profile creation
  WHILE current_retry < max_retries LOOP
    BEGIN
      -- Generate unique username
      final_username := generate_unique_username(
        base_username || 
        CASE WHEN current_retry > 0 
          THEN current_retry::TEXT 
          ELSE '' 
        END
      );
      
      -- Insert profile with retry logic
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
      
      -- Exit loop if successful
      EXIT;
    EXCEPTION 
      WHEN unique_violation THEN
        -- Only retry on username collision
        IF current_retry < max_retries - 1 THEN
          current_retry := current_retry + 1;
          CONTINUE;
        END IF;
      WHEN OTHERS THEN
        -- Log error and continue
        RAISE WARNING 'Error creating profile: %', SQLERRM;
    END;
  END LOOP;
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Add better indexes for profile queries
DROP INDEX IF EXISTS profiles_username_search_idx;
DROP INDEX IF EXISTS profiles_username_lower_idx;
CREATE INDEX profiles_username_search_idx ON profiles USING gin (username gin_trgm_ops);
CREATE INDEX profiles_username_lower_idx ON profiles (lower(username));
CREATE INDEX profiles_user_id_idx ON profiles (id);

-- Update constraints
ALTER TABLE profiles
  DROP CONSTRAINT IF EXISTS username_format,
  ADD CONSTRAINT username_format CHECK (
    username ~* '^[a-z][a-z0-9_]*$' AND
    length(username) >= 3 AND
    length(username) <= 20
  );

-- Add function to handle profile updates
CREATE OR REPLACE FUNCTION handle_profile_update()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  
  -- Validate username format
  IF NEW.username !~ '^[a-z][a-z0-9_]*$' THEN
    RAISE EXCEPTION 'Invalid username format';
  END IF;
  
  -- Ensure username length
  IF length(NEW.username) < 3 OR length(NEW.username) > 20 THEN
    RAISE EXCEPTION 'Username must be between 3 and 20 characters';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
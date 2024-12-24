/*
  # Fix Authentication Issues

  1. Improve Profile Creation
    - Better error handling for profile creation
    - More robust username generation
    - Proper constraint handling

  2. Security
    - Add RLS policies for profiles
    - Improve error handling
*/

-- Improve username generation with better sanitization and fallbacks
CREATE OR REPLACE FUNCTION generate_unique_username(base_username TEXT)
RETURNS TEXT AS $$
DECLARE
  new_username TEXT;
  counter INTEGER := 0;
  max_attempts INTEGER := 100;
BEGIN
  -- Sanitize and normalize base username
  new_username := regexp_replace(
    lower(COALESCE(NULLIF(base_username, ''), 'user')),
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
  
  -- Find unique username
  WHILE counter < max_attempts AND EXISTS (
    SELECT 1 FROM profiles WHERE lower(username) = lower(new_username)
  ) LOOP
    counter := counter + 1;
    new_username := substring(new_username, 1, 12) || counter::TEXT;
  END LOOP;
  
  IF counter >= max_attempts THEN
    -- Fallback to timestamp-based username
    new_username := 'user' || extract(epoch from now())::bigint % 1000000;
  END IF;
  
  RETURN new_username;
END;
$$ LANGUAGE plpgsql;

-- Improve profile creation with better error handling
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
      
      -- Insert profile
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
        ELSE
          RAISE EXCEPTION 'Could not create unique username after % attempts', max_retries;
        END IF;
      WHEN OTHERS THEN
        -- Log other errors and continue
        RAISE WARNING 'Error creating profile: %', SQLERRM;
        RETURN new;
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

-- Update RLS policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

-- Create new policies
CREATE POLICY "Profiles are viewable by everyone" 
ON profiles FOR SELECT 
USING (true);

CREATE POLICY "Users can update own profile" 
ON profiles FOR UPDATE 
USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" 
ON profiles FOR INSERT 
WITH CHECK (auth.uid() = id);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS profiles_username_lower_idx ON profiles (lower(username));
CREATE INDEX IF NOT EXISTS profiles_created_at_idx ON profiles (created_at DESC);

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
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for profile updates
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION handle_profile_update();
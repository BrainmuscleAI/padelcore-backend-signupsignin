/*
  # Optimize Profile Creation and Username Generation

  1. Changes
    - Improve username generation with better validation
    - Add better error handling for profile creation
    - Add optimized indexes
    - Update constraints
  
  2. Security
    - Maintain existing RLS policies
    - Add validation constraints
*/

-- Improve username generation with better validation
CREATE OR REPLACE FUNCTION generate_unique_username(base_username TEXT)
RETURNS TEXT AS $$
DECLARE
  new_username TEXT;
  counter INTEGER := 0;
  max_attempts INTEGER := 10;
BEGIN
  -- Quick sanitize of base username
  new_username := regexp_replace(
    lower(COALESCE(NULLIF(trim(base_username), ''), 'user')),
    '[^a-z0-9]',
    '',
    'g'
  );
  
  -- Ensure valid format
  IF length(new_username) < 3 OR new_username !~ '^[a-z]' THEN
    new_username := 'user' || COALESCE(new_username, '');
  END IF;
  
  -- Truncate if too long
  new_username := substring(new_username, 1, 15);
  
  -- Fast unique check with SKIP LOCKED
  WHILE counter < max_attempts LOOP
    IF NOT EXISTS (
      SELECT 1 FROM profiles 
      WHERE username = new_username 
      FOR UPDATE SKIP LOCKED
    ) THEN
      RETURN new_username;
    END IF;
    
    counter := counter + 1;
    new_username := substring(new_username, 1, 12) || counter::TEXT;
  END LOOP;
  
  -- Fallback to timestamp
  RETURN 'user' || extract(epoch from now())::bigint % 1000000;
END;
$$ LANGUAGE plpgsql;

-- Optimize profile creation with better performance
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  base_username TEXT;
  final_username TEXT;
  user_full_name TEXT;
BEGIN
  -- Get username from metadata or email
  base_username := COALESCE(
    new.raw_user_meta_data->>'username',
    split_part(new.email, '@', 1)
  );
  
  -- Get full name
  user_full_name := COALESCE(
    new.raw_user_meta_data->>'full_name',
    initcap(split_part(new.email, '@', 1))
  );
  
  -- Generate username with single attempt
  final_username := generate_unique_username(base_username);
  
  -- Fast insert with conflict handling
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
  )
  ON CONFLICT (id) DO NOTHING;
  
  RETURN new;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't block user creation
    RAISE WARNING 'Profile creation failed: %', SQLERRM;
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Add optimized indexes (non-concurrent)
CREATE INDEX IF NOT EXISTS profiles_username_btree_idx 
  ON profiles (username);

CREATE INDEX IF NOT EXISTS profiles_username_lower_idx 
  ON profiles (lower(username));

-- Update constraints for faster validation
ALTER TABLE profiles
  DROP CONSTRAINT IF EXISTS username_format,
  ADD CONSTRAINT username_format CHECK (
    username ~* '^[a-z][a-z0-9_]*$' AND
    length(username) >= 3 AND
    length(username) <= 20
  );
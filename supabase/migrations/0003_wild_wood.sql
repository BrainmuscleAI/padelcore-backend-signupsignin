/*
  # Add Profile Policies

  1. Changes
    - Add insert policy for profiles table
    - Add update policy for profiles table
    - Add select policy for profiles table

  Note: Trigger and table creation are handled in previous migrations
*/

-- Add policies if they don't exist
DO $$ BEGIN
  -- Insert policy
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'profiles' 
    AND policyname = 'Users can insert own profile'
  ) THEN
    CREATE POLICY "Users can insert own profile" 
      ON profiles FOR INSERT 
      WITH CHECK (auth.uid() = id);
  END IF;

  -- Update policy
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'profiles' 
    AND policyname = 'Users can update own profile'
  ) THEN
    CREATE POLICY "Users can update own profile" 
      ON profiles FOR UPDATE 
      USING (auth.uid() = id);
  END IF;

  -- Select policy
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'profiles' 
    AND policyname = 'Public profiles are viewable by everyone'
  ) THEN
    CREATE POLICY "Public profiles are viewable by everyone" 
      ON profiles FOR SELECT 
      USING (true);
  END IF;
END $$;
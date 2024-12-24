/*
  # Add insert policy for profiles

  1. Changes
    - Add insert policy for profiles table to allow users to create their own profile
*/

-- Add insert policy (new)
CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);
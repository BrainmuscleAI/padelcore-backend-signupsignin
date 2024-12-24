/*
  # Add Test User and Profile

  1. Changes
    - Create email constraint for auth.users if it doesn't exist
    - Create a test user for development
    - Set up initial profile data

  Note: This is for development purposes only
*/

-- First ensure email constraint exists
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'users_email_key'
    AND conrelid = 'auth.users'::regclass
  ) THEN
    ALTER TABLE auth.users ADD CONSTRAINT users_email_key UNIQUE (email);
  END IF;
END $$;

-- Create test user if it doesn't exist
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  role,
  aud,
  confirmation_token
)
SELECT
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'test@example.com',
  crypt('password123', gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"name":"Test User"}'::jsonb,
  now(),
  now(),
  'authenticated',
  'authenticated',
  encode(gen_random_bytes(32), 'base64')
WHERE NOT EXISTS (
  SELECT 1 FROM auth.users WHERE email = 'test@example.com'
);

-- Create profile for test user
INSERT INTO public.profiles (
  id,
  username,
  full_name,
  rating,
  matches_played,
  wins,
  losses
)
SELECT 
  id,
  'testuser',
  'Test User',
  1000,
  0,
  0,
  0
FROM auth.users 
WHERE email = 'test@example.com'
AND NOT EXISTS (
  SELECT 1 FROM public.profiles p 
  WHERE p.id = auth.users.id
);
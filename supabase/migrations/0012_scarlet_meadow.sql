/*
  # Tournament System Schema

  1. New Tables
    - tournaments
      - Core tournament information
      - Scheduling and status
      - Prize pool and rules
    - tournament_registrations
      - Player registrations
      - Registration status tracking
    - matches
      - Match results and scoring
      - Tournament progression
    - match_players
      - Player participation in matches
      - Team assignments

  2. Security
    - RLS policies for each table
    - Role-based access control
    - Data integrity constraints

  3. Changes
    - Added foreign key relationships
    - Added indexes for performance
    - Added status tracking
*/

-- Create tournaments table
CREATE TABLE tournaments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  start_date timestamptz NOT NULL,
  end_date timestamptz NOT NULL,
  location text NOT NULL,
  prize_pool integer DEFAULT 0,
  max_participants integer NOT NULL,
  status text NOT NULL DEFAULT 'draft',
  rules jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  
  CONSTRAINT valid_dates CHECK (end_date > start_date),
  CONSTRAINT valid_max_participants CHECK (max_participants > 0),
  CONSTRAINT valid_status CHECK (status IN ('draft', 'open', 'in_progress', 'completed', 'cancelled'))
);

-- Create tournament_registrations table
CREATE TABLE tournament_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id uuid REFERENCES tournaments(id) ON DELETE CASCADE,
  player_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'pending',
  registration_date timestamptz DEFAULT now(),
  
  CONSTRAINT unique_registration UNIQUE(tournament_id, player_id),
  CONSTRAINT valid_status CHECK (status IN ('pending', 'confirmed', 'cancelled', 'waitlist'))
);

-- Create matches table
CREATE TABLE matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id uuid REFERENCES tournaments(id) ON DELETE CASCADE,
  round integer NOT NULL,
  court text,
  start_time timestamptz,
  end_time timestamptz,
  status text NOT NULL DEFAULT 'scheduled',
  score jsonb,
  winner_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  CONSTRAINT valid_round CHECK (round > 0),
  CONSTRAINT valid_status CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')),
  CONSTRAINT valid_times CHECK (end_time > start_time)
);

-- Create match_players table
CREATE TABLE match_players (
  match_id uuid REFERENCES matches(id) ON DELETE CASCADE,
  player_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  team integer NOT NULL,
  position integer NOT NULL,
  
  PRIMARY KEY (match_id, player_id),
  CONSTRAINT valid_team CHECK (team IN (1, 2)),
  CONSTRAINT valid_position CHECK (position IN (1, 2))
);

-- Enable RLS
ALTER TABLE tournaments ENABLE ROW LEVEL SECURITY;
ALTER TABLE tournament_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE match_players ENABLE ROW LEVEL SECURITY;

-- Tournament policies
CREATE POLICY "Tournaments are viewable by everyone"
  ON tournaments FOR SELECT
  USING (true);

CREATE POLICY "Admins can create tournaments"
  ON tournaments FOR INSERT
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can update tournaments"
  ON tournaments FOR UPDATE
  USING (auth.jwt() ->> 'role' = 'admin');

-- Registration policies
CREATE POLICY "Players can view registrations"
  ON tournament_registrations FOR SELECT
  USING (true);

CREATE POLICY "Players can register themselves"
  ON tournament_registrations FOR INSERT
  WITH CHECK (auth.uid() = player_id);

CREATE POLICY "Players can update their own registrations"
  ON tournament_registrations FOR UPDATE
  USING (auth.uid() = player_id);

-- Match policies
CREATE POLICY "Matches are viewable by everyone"
  ON matches FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage matches"
  ON matches FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin');

-- Match players policies
CREATE POLICY "Match players are viewable by everyone"
  ON match_players FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage match players"
  ON match_players FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin');

-- Create indexes
CREATE INDEX tournaments_status_idx ON tournaments(status);
CREATE INDEX tournaments_dates_idx ON tournaments(start_date, end_date);
CREATE INDEX tournament_registrations_status_idx ON tournament_registrations(status);
CREATE INDEX matches_tournament_round_idx ON matches(tournament_id, round);
CREATE INDEX matches_status_idx ON matches(status);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
CREATE TRIGGER tournaments_updated_at
  BEFORE UPDATE ON tournaments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER matches_updated_at
  BEFORE UPDATE ON matches
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
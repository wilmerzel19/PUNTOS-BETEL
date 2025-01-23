/*
  # Initial Schema for Camp Points Tracker

  1. New Tables
    - `participants`
      - `id` (uuid, primary key)
      - `name` (text)
      - `team` (text)
      - `group` (text)
      - `total_points` (integer)
      - `created_at` (timestamp)
      
    - `activities`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `points` (integer)
      - `created_at` (timestamp)
      
    - `participant_activities`
      - `id` (uuid, primary key)
      - `participant_id` (uuid, foreign key)
      - `activity_id` (uuid, foreign key)
      - `points_earned` (integer)
      - `created_at` (timestamp)
      
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create participants table
CREATE TABLE participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    team TEXT NOT NULL,
    "group" TEXT NOT NULL,
    total_points INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Create activities table
CREATE TABLE activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    points INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Create participant_activities table
CREATE TABLE participant_activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    participant_id UUID REFERENCES participants(id) ON DELETE CASCADE,
    activity_id UUID REFERENCES activities(id) ON DELETE CASCADE,
    points_earned INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE participant_activities ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read access for authenticated users"
    ON participants FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Enable insert access for authenticated users"
    ON participants FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Enable update access for authenticated users"
    ON participants FOR UPDATE
    TO authenticated
    USING (true);

CREATE POLICY "Enable read access for authenticated users"
    ON activities FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Enable insert access for authenticated users"
    ON activities FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Enable read access for authenticated users"
    ON participant_activities FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Enable insert access for authenticated users"
    ON participant_activities FOR INSERT
    TO authenticated
    WITH CHECK (true);
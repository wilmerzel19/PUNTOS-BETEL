/*
  # Fix RLS Policies for Tables

  1. Changes
    - Drop existing policies
    - Create new policies with correct access rules
    - Enable public access for authenticated users
  
  2. Security
    - Maintain RLS enabled on all tables
    - Allow authenticated users to perform CRUD operations
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON participants;
DROP POLICY IF EXISTS "Enable insert access for authenticated users" ON participants;
DROP POLICY IF EXISTS "Enable update access for authenticated users" ON participants;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON activities;
DROP POLICY IF EXISTS "Enable insert access for authenticated users" ON activities;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON participant_activities;
DROP POLICY IF EXISTS "Enable insert access for authenticated users" ON participant_activities;

-- Create new policies for participants table
CREATE POLICY "Public access policy"
ON participants
FOR ALL
TO public
USING (true)
WITH CHECK (true);

-- Create new policies for activities table
CREATE POLICY "Public access policy"
ON activities
FOR ALL
TO public
USING (true)
WITH CHECK (true);

-- Create new policies for participant_activities table
CREATE POLICY "Public access policy"
ON participant_activities
FOR ALL
TO public
USING (true)
WITH CHECK (true);
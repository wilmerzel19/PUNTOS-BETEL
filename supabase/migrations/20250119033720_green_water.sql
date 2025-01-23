/*
  # Add Increment Points Function

  1. New Functions
    - increment_participant_points: Updates a participant's total points
      - Parameters:
        - p_participant_id: UUID of the participant
        - p_points: Number of points to add
      
  2. Security
    - Function is accessible to public role
    - Maintains data integrity with error handling
*/

CREATE OR REPLACE FUNCTION increment_participant_points(
  p_participant_id UUID,
  p_points INTEGER
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE participants
  SET total_points = total_points + p_points
  WHERE id = p_participant_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Participant not found';
  END IF;
END;
$$;

-- Grant execute permission to public
GRANT EXECUTE ON FUNCTION increment_participant_points TO public;
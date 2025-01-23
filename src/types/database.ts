export interface Participant {
  id: string;
  name: string;
  team: string;
  group: string;
  total_points: number;
  created_at: string;
}

export interface Activity {
  id: string;
  name: string;
  description: string;
  points: number;
  created_at: string;
}

export interface ParticipantActivity {
  id: string;
  participant_id: string;
  activity_id: string;
  points_earned: number;
  created_at: string;
}
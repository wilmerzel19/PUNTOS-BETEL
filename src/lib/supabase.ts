import { createClient } from '@supabase/supabase-js';

// Check if environment variables are defined
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    'Please click the "Connect to Supabase" button in the top right corner to set up your database connection.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseKey);
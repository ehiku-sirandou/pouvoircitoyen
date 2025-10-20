import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface AudioContribution {
  id: string;
  audio_url: string;
  status: 'pending' | 'validated' | 'rejected';
  description: string | null;
  created_at: string;
  validated_at: string | null;
  validated_by: string | null;
  duration: number | null;
  file_size: number | null;
  full_name: string | null;
  phone_number: string | null;
  gender: 'homme' | 'femme' | null;
  topics: string[] | null;
}

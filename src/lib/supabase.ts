import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Helper to check if there was an error in the response
export function checkError<T>(
  response: { data: T | null; error: Error | null }
): T {
  if (response.error) {
    throw response.error;
  }
  if (!response.data) {
    throw new Error('No data returned from Supabase');
  }
  return response.data;
}
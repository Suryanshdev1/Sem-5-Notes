import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Check if variables exist and URL is valid
if (!supabaseUrl || !supabaseUrl.startsWith('http')) {
  throw new Error('❌ Missing or invalid NEXT_PUBLIC_SUPABASE_URL. Please check your .env.local file.');
}

if (!supabaseKey) {
  throw new Error('❌ Missing NEXT_PUBLIC_SUPABASE_ANON_KEY. Please check your .env.local file.');
}

export const supabase = createClient(supabaseUrl, supabaseKey);
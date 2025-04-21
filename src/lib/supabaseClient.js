import { createClient } from '@supabase/supabase-js';

export const SUPABASE_URL = 'https://pqmqnxksfzzmitxbjdjj.supabase.co';
export const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBxbXFueGtzZnp6bWl0eGJqZGpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDExMzA5ODYsImV4cCI6MjA1NjcwNjk4Nn0.CXcgIot9taNNLXwV_09WlfMjXRX_TsPspnoJMEkChrY';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

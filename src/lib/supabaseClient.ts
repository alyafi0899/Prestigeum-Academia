import { createClient } from '@supabase/supabase-js'

/**
 * Note: For static deployments where environment variables might not be supported
 * in the build pipeline, we use these production defaults.
 */
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://fkbsvefhnzaoodlvlyap.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_f9V7L21-GNrH5YtxfiDhtw__CHNBkk9'

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase configuration missing.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

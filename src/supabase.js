import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://fnlvgekutxzprwywqnvo.supabase.co'

const supabaseKey = 'sb_publishable_g-iuA5s74ndqBwILeKm2vw_g1Db-th2'

export const supabase = createClient(
  supabaseUrl,
  supabaseKey
)
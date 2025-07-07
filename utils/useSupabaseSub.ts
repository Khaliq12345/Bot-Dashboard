import { createClient } from '@supabase/supabase-js'

export function useSupabaseSub() {
    // Supabase
    const config = useRuntimeConfig();
    // Create a single supabase client for interacting with database
    const supabase = createClient(config.public.supabaseURL as any, config.public.supabaseKey as any)
    // 
    return {
        supabase
    };
}

export function isMoreThanOneHourAgo(lastRunStr: string): boolean {
  const now = new Date()
  const lastRun = new Date(lastRunStr)

  const diffInMs = now.getTime() - lastRun.getTime()
  const diffInHours = diffInMs / (1000 * 60 * 60)

  return diffInHours > 1
}
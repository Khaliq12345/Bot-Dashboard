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
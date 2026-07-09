import { User as SupabaseUser } from '@supabase/supabase-js';

export type OAuthProvider = 'Google' | 'Apple';

export interface User extends SupabaseUser {
    hasAssociatedFamily: boolean
    requestedToJoinFam: boolean
    isAuthUser: boolean
}
    
    
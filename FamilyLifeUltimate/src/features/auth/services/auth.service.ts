import { OAuthProvider } from "../auth.types";
import { supabase } from "@/src/supabase/supabase";

export async function loginWithEmail(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });
    if (error) throw error;
    return data;
}

export async function signUpWithEmail(email: string, password: string, fullName: string) {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                display_name: fullName,
            },
        },
    });
    if (error) throw error;
    return data;
}

export async function oauthLogin(provider: OAuthProvider) {
    console.log("authLogin not set up yet")
}

export async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
}

export async function forgotPassword(email: string) {
    console.log("forgot password", email);
}
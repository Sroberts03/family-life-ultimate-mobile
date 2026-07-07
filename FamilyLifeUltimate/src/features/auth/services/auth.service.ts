import { OAuthProvider } from "../auth.types";

export async function loginWithEmail(email: string, password: string) {
    console.log("login", email, password);
}

export async function signUpWithEmail(email: string, password: string, firstName: string, lastName: string) {
    console.log("signup", email, password);
}

export async function oauthLogin(provider: OAuthProvider) {
    console.log("oauth provider", provider);
}

export async function signOut() {
    console.log("logout");
}

export async function forgotPassword(email: string) {
    console.log("forgot password", email);
}
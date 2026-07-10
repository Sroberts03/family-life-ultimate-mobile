import { Session } from "@supabase/supabase-js";

const backendOrigin = process.env.EXPO_PUBLIC_BACKEND_ORIGIN;

export type HTTPMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS";

export default async function HTTPRequest(
    method: HTTPMethod,
    endpoint: string,
    needsAuth: boolean,
    session: Session,
    body?: Object,
) {
    if (!backendOrigin) {
        throw new Error("EXPO_PUBLIC_BACKEND_ORIGIN environment variable is not set");
    }
    if (needsAuth && !session) {
        throw new Error("No session provided for authenticated request");
    }
    const response = await fetch(`${backendOrigin}/${endpoint}`, {
        method: method,
        headers: {
            "Content-Type": "application/json",
            ...(needsAuth ? { "Authorization": "Bearer " + session?.access_token } : {})
        },
        body: body ? JSON.stringify(body) : undefined
    })

    if (!response.ok) {
        const errorData = await response.json();
        console.log(errorData.body.message);
        throw new Error(errorData.body.message);
    }
    const res = await response.json();
    return res;
}
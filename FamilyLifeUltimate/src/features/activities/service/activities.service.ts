import { Session } from "@supabase/supabase-js";
import HTTPRequest from "../../../utils/baseHTTPRequest";

export async function GetAllActivities(session: Session) {
    const response = await HTTPRequest("GET", `activity/get-all`, true, session);
    console.log(response)
    return response.persActivities;
}
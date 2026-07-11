import { Session } from "@supabase/supabase-js";
import HTTPRequest from "../../../utils/baseHTTPRequest";
import { UpdateActivitiesReq } from "../dto/UpdateActivites";

export async function GetAllActivities(session: Session) {
    const response = await HTTPRequest("GET", `activity/get-all`, true, session);
    console.log(response)
    return response.persActivities;
}

export async function SetPermissions(updateActivitiesReq: UpdateActivitiesReq, session: Session) {
    const response = await HTTPRequest("POST", `activity/set-permissions`, true, session, updateActivitiesReq);
    console.log(response)
    return response;
}
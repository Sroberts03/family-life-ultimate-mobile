import { Session } from "@supabase/supabase-js";
import HTTPRequest from "../../../utils/baseHTTPRequest";

export async function getAllChoresForFamily(familyId: string, date: Date, session: Session) {
    const response = await HTTPRequest("GET", `chores/get-all-chores-date?familyId=${familyId}&date=${date.toISOString()}`, true, session);
    console.log(response)
    return response.chores;
}
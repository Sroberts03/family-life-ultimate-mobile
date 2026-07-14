import { Session } from "@supabase/supabase-js";
import HTTPRequest from "../../../utils/baseHTTPRequest";
import { MarkChoreCompleteDto } from "../dto/MarkChoreCompleteDto";

export async function getAllChoresForFamily(familyId: string, date: string, session: Session) {
    const response = await HTTPRequest("GET", `chores/get-all-chores-date?familyId=${familyId}&date=${date}`, true, session);
    return response.chores;
}

export async function markChoreComplete(markChoreCompleteDto: MarkChoreCompleteDto, session: Session) {
    const response = await HTTPRequest("PUT", `chores/mark-chore-complete`, true, session, markChoreCompleteDto);
    return response;
}
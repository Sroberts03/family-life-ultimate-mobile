import { Session } from "@supabase/supabase-js";
import HTTPRequest from "../../../utils/baseHTTPRequest";
import { MarkChoreCompleteDto } from "../dto/MarkChoreCompleteDto";
import { ChoreDataDto } from "../dto/ChoreDataDto";
import ChoreAssigneeDto from "../dto/ChoreAssignmentsDto";

export async function getAllChoresForFamily(familyId: string, date: string, session: Session) {
    const response = await HTTPRequest("GET", `chores/get-all-chores-date?familyId=${familyId}&date=${date}`, true, session);
    return response.chores;
}

export async function toggleChoreComplete(markChoreCompleteDto: MarkChoreCompleteDto, session: Session) {
    const response = await HTTPRequest("PUT", `chores/mark-chore-complete`, true, session, markChoreCompleteDto);
    return response;
}

export async function createChore(chore: ChoreDataDto, session: Session) {
    const response = await HTTPRequest("POST", `chores/create`, true, session, chore);
    return response.chore;
}

export async function updateChore(choreDataDto: ChoreDataDto, session: Session) {
    const response = await HTTPRequest("PUT", `chores/update`, true, session, choreDataDto);
    return response.chore;
}

export async function deleteChore(choreId: number, session: Session, thisAndFuture: boolean = false) {
    const response = await HTTPRequest("DELETE", `chores/delete?choreId=${choreId}&thisAndFuture=${thisAndFuture}`, true, session);
    return response;
}

export async function submitChoreAssignments(choreAssigneeDto: ChoreAssigneeDto, session: Session) {
    console.log("choreAssigneeDto", choreAssigneeDto)
    const payload = {
        choreId: choreAssigneeDto.choreId,
        choreAssigneeIds: Array.from(choreAssigneeDto.choreAssigneeIds)
    };
    const response = await HTTPRequest("PUT", `chores/update-chore-assignees`, true, session, payload);
    return response.chore;
}
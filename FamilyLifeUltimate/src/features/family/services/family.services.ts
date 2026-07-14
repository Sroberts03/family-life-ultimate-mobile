import { Session } from "@supabase/supabase-js";
import HTTPRequest from "../../../utils/baseHTTPRequest";
import { JoinFamilyRequestDto } from "../dto/JoinFamilyRequestDto";
import { CreateFamilyRequestDto } from "../dto/CreateFamilyRequestDto";
import { RemoveFamilyMemberRequestDto } from "../dto/RemoveFamilyMemberReq";

export async function joinFamily(joinFamilyRequestDto: JoinFamilyRequestDto, session: Session) {
    await HTTPRequest("POST", "family/join-request", true, session, joinFamilyRequestDto);
}

export async function createFamily(createFamilyRequestDto: CreateFamilyRequestDto, session: Session) {
    await HTTPRequest("POST", "family/create", true, session, createFamilyRequestDto);
}

export async function getAllJoinRequests(familyId: string, session: Session) {
    const response = await HTTPRequest("GET", `family/get-requests?familyId=${familyId}`, true, session);
    return response.joinRequests;
}

export async function getAllAuthFamilies(session: Session) {
    const response = await HTTPRequest("GET", "family/get-all-auth", true, session);
    return response.families;
}

export async function acceptOrDenyJoinRequest(requestId: number, accept: boolean, session: Session) {
    await HTTPRequest("PUT", "family/edit-request", true, session, {
        requestId,
        accept
    });
}

export async function GetFamilyMembers(familyId: string, session: Session) {
    const response = await HTTPRequest("GET", `family/get-members?familyId=${familyId}`, true, session);
    return response.members;
}

export async function RemoveFamilyMember(removeFamilyMemberRequest: RemoveFamilyMemberRequestDto, session: Session) {
    await HTTPRequest("DELETE", "family/remove-member?familyId=" + removeFamilyMemberRequest.familyId + "&userId=" + removeFamilyMemberRequest.userId, true, session);
}

export async function getAllFamilies(session: Session) {
    const response = await HTTPRequest("GET", "family/get-all-families", true, session);
    return response.families;
}
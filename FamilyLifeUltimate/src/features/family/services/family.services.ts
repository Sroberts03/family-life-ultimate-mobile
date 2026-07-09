import { Session } from "@supabase/supabase-js";
import HTTPRequest from "../../../utils/baseHTTPRequest";
import { JoinFamilyRequestDto } from "../dto/JoinFamilyRequestDto";
import { CreateFamilyRequestDto } from "../dto/CreateFamilyRequestDto";

export async function joinFamily(joinFamilyRequestDto: JoinFamilyRequestDto, session: Session) {
    await HTTPRequest("POST", "family/join-request", true, session, joinFamilyRequestDto);
}

export async function createFamily(createFamilyRequestDto: CreateFamilyRequestDto, session: Session) {
    await HTTPRequest("POST", "family/create", true, session, createFamilyRequestDto);
}
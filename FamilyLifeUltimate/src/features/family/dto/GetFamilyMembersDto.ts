import { FamilyMember } from "../family.types";

export interface GetFamilyMembersResponseDto {
    familyId: string;
    members: FamilyMember[];
}
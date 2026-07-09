import { familyRole } from "../family.types";

export interface JoinFamilyRequestDto {
    familyId: string;
    role: familyRole;
}
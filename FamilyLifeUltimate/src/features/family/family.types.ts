import { Feather } from "@expo/vector-icons";
import { PersActivity } from "../auth/auth.types";

export type familyRole = "adult" | "child" | "other"

export const roles: { id: familyRole; title: string; description: string; icon: keyof typeof Feather.glyphMap }[] = [
    { id: "adult", title: "Adult", description: "Manage family settings and members", icon: "user" },
    { id: "child", title: "Child", description: "Join as a family member", icon: "smile" },
    { id: "other", title: "Other", description: "Extended family or guest", icon: "users" },
];

export interface JoinRequest {
    fullName: string;
    requestId: number;
    familyId: string;
    userId: string;
    role: familyRole;
    createdAt: Date;
};

export interface family {
    familyId: string;
    ownerId: string;
    subscription_level: string;
    created_at: Date;
    updated_at: Date;
    family_name: string;
};

export interface TruncatedFamily {
    familyId: string;
    familyName: string;
}

export interface FamilyMember {
    userId: string;
    fullName: string;
    role: familyRole;
    activities: PersActivity[];
}
import { Feather } from "@expo/vector-icons";

export type familyRole = "adult" | "child" | "other"

export const roles: { id: familyRole; title: string; description: string; icon: keyof typeof Feather.glyphMap }[] = [
    { id: "adult", title: "Adult", description: "Manage family settings and members", icon: "user" },
    { id: "child", title: "Child", description: "Join as a family member", icon: "smile" },
    { id: "other", title: "Other", description: "Extended family or guest", icon: "users" },
];
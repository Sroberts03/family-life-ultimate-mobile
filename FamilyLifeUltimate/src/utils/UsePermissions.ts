import { useAuth } from "@/src/features/auth/AuthContext";
import { useFamily } from "@/src/features/family/FamilyContext";

export default function usePermissions(permissionCheck: string) {
    const { user } = useAuth();
    const { familyId } = useFamily();

    if (!user || !familyId) {
        return false;
    }

    if (!user.activities?.has(familyId)) {
        return false;
    }

    if (user.activities.get(familyId)!.has("household_head")
        || user.activities.get(familyId)!.has("authorized_user")) {
        return true;
    }

    switch (permissionCheck) {
        case "chore":
            return user.activities.get(familyId)!.has("edit_chores");
        case "meal":
            return user.activities.get(familyId)!.has("edit_meals");
        case "shopping":
            return user.activities.get(familyId)!.has("view_shopping_list");
        case "recipes":
            return user.activities.get(familyId)!.has("edit_recipes");
        default:
            return false;
    }
}

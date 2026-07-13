import { User } from "../auth.types";

export default function userCanSeeScreen(screen: string, user: User) {
    if (!user.activities) return false
    
    const userPermissions = new Set(user.activities.map(act => act.activityName));

    const isHouseholdHead = userPermissions.has('household_head');
    const isAuthorizedUser = userPermissions.has('authorized_user');

    if (isHouseholdHead) return true
    
    switch (screen) {
        case "Budget":
            return isAuthorizedUser || userPermissions.has('view_budget')
        case "Manage":
            return isAuthorizedUser
        default:
            return false;
    }
}
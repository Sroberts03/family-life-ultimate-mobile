import { User } from "../auth.types";

export default function userCanSeeScreen(screen: string, user: User) {
    switch (screen) {
        case "Home":
            return true;
        case "Calendar":
            return true;
        case "Budget":
            return user.activities.some((activity) => activity.activityName === 'family_owner') 
                || user.activities.some((activity) => activity.activityName === 'auth_family_user') 
                || user.activities.some((activity) => activity.activityName === 'view_budget')
        case "Chore":
            return true;
        case "Meals":
            return true;
        case "ManageJoinRequests":
            return user.activities.some((activity) => activity.activityName === 'family_owner') 
                || user.activities.some((activity) => activity.activityName === 'auth_family_user');
        default:
            return false;
    }
}
import { User } from "../auth.types";

export default function userCanSeeScreen(screen: string, user: User) {
    switch (screen) {
        case "Home":
            return true;
        case "Calendar":
            return true;
        case "Budget":
            return user.activities.some((activity) => activity.activityName === 'household_head') 
                || user.activities.some((activity) => activity.activityName === 'authorized_user') 
                || user.activities.some((activity) => activity.activityName === 'view_budget')
        case "Chore":
            return true;
        case "Meals":
            return true;
        case "Manage":
            return user.activities.some((activity) => activity.activityName === 'household_head') 
                || user.activities.some((activity) => activity.activityName === 'authorized_user');
        default:
            return false;
    }
}
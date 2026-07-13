import { User } from "../auth.types";

export default function userCanSeeScreen(screen: string, user: User) {
    if (!user.activities) return false

    for (const userAct of user.activities.values()) {
        if (userAct.has('household_head')) return true
    }

    for (const userAct of user.activities.values()) {
        if (userAct.has('authorized_user')) return true
    }
    
    switch (screen) {
        case "Budget":
            for (const userAct of user.activities.values()) {
                if (userAct.has('edit_budget')) return true
                if (userAct.has('view_budget')) return true
            }
        default:
            return false;
    }
}
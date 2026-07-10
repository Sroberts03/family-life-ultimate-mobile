import { PersActivity } from "../auth.types"

export interface UserActivityRow {
    activities: { name: string };
    family_id: string;
}

export default function createRoleObjects(userActivities: UserActivityRow[]): PersActivity[] {
    return userActivities.map((row) => ({
        activityName: row.activities.name,
        familyId: row.family_id
    }));
}
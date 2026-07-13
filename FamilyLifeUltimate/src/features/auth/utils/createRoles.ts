export interface UserActivityRow {
    activities: { name: string };
    family_id: string;
}

export default function createRoleObject(userActivities: UserActivityRow[]): Map<string, Set<string>> {
    const activities = new Map<string, Set<string>>();
    userActivities.forEach((row) => {
        const activityName = row.activities.name;
        const familyId = row.family_id;
        if (!activities.has(familyId)) {
            activities.set(familyId, new Set());
        }
        activities.get(familyId)!.add(activityName);
    })
    return activities;
}
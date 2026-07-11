export interface UpdateActivitiesReq {
    permissions: Record<number, boolean>, 
    userId: string, 
    familyId: string,
}
import { User } from '@supabase/supabase-js';
import { supabase } from '../../../supabase/supabase';
import createRoleObjects, { UserActivityRow } from './createRoles';

export default async function userData(user: User) {
  const { data: familyData } = 
    await supabase.from('user_families')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();
  const { data: requestedFamilyData } = 
    await supabase.from('join_family_requests')
      .select('*')
      .eq('user_id', user.id)
      .is('accepted', null)
      .maybeSingle();
  let userActivities: UserActivityRow[] = []
  const { data: userActivitiesData, error: userActivitiesError } =
    await supabase.from('pers_activities')
      .select('family_id, activities!inner (name)')
      .eq('user_id', user.id)
  if (userActivitiesError || !userActivitiesData) {
      console.log("error fetching user activities: ", userActivitiesError)
      userActivities = []
  } else {
      userActivities = userActivitiesData as unknown as UserActivityRow[]
  }
  const requestedToJoinFam = requestedFamilyData?.family_id !== undefined
  const hasAssociatedFamily = familyData?.family_id !== undefined
  return {
    ...user,
    hasAssociatedFamily: hasAssociatedFamily,
    requestedToJoinFam: requestedToJoinFam,
    activities: createRoleObjects(userActivities)
  };
}
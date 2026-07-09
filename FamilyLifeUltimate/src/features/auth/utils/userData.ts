import { User } from '@supabase/supabase-js';
import { supabase } from '../../../supabase/supabase';

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
  const { data: ownerUser } =
    await supabase.from('families')
    .select('*')
    .eq('owner_id', user.id)
  const { data: authUser } =
    await supabase.from('authorized_edit_family_users')
      .select('user_id')
      .eq('user_id', user.id)
  const isAuthUser = 
    ownerUser?.length !== undefined && ownerUser?.length > 0 
    || authUser?.length !== undefined && authUser?.length > 0
  const requestedToJoinFam = requestedFamilyData?.family_id !== undefined
  const hasAssociatedFamily = familyData?.family_id !== undefined
  return {
    ...user,
    hasAssociatedFamily: hasAssociatedFamily,
    requestedToJoinFam: requestedToJoinFam,
    isAuthUser: isAuthUser
  };
}
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
  return {
    ...user,
    hasAssociatedFamily: familyData?.family_id !== undefined,
    requestedToJoinFam: requestedFamilyData?.family_id !== undefined
  };
}
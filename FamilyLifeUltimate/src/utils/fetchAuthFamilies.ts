import { Session } from "@supabase/supabase-js";
import { getAllFamilies } from "../features/family/services/family.services";
import { TruncatedFamily } from "../features/family/family.types";

export const fetchAuthFamilies = async (
    session: Session,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setError: React.Dispatch<React.SetStateAction<string>>,
    setPossibleFamilies: React.Dispatch<React.SetStateAction<TruncatedFamily[]>>,
    setFamilyId: React.Dispatch<React.SetStateAction<string>>
) => {
    try {
        setLoading(true);
        const families = await getAllFamilies(session);
        setPossibleFamilies(families);
        if (families.length > 0) {
            setFamilyId(families[0].familyId);
        }
    } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to get families");
    } finally {
        setLoading(false);
    }
};
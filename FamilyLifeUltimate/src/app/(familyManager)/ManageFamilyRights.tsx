import ManageFamilyRightsScreen from "@/src/features/family/pages/ManageFamilyRightsScreen";
import { useLocalSearchParams } from "expo-router";

export default function ManageFamilyRights() {
    const { familyId } = useLocalSearchParams<{ familyId: string }>();
    
    return (
        <ManageFamilyRightsScreen familyId={familyId} />
    );
}
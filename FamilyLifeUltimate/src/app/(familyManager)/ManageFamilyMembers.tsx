import ManageFamilyMembersScreen from "@/src/features/family/pages/ManageFamilyMembersScreen"
import { useLocalSearchParams } from "expo-router";

export default function ManageFamilyMembers() {
    const { familyId } = useLocalSearchParams<{ familyId: string }>();

    return (
        <ManageFamilyMembersScreen familyId={familyId} />
    )
}
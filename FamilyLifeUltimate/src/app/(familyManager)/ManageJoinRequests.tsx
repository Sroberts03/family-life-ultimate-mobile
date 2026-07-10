import { useLocalSearchParams } from "expo-router";
import ManageJoinRequestsScreen from "@/src/features/family/pages/ManageJoinRequestsScreen";

export default function ManageJoinRequests() {
    const { familyId } = useLocalSearchParams<{ familyId: string }>();
    return (
        <ManageJoinRequestsScreen familyId={familyId} />
    );
}
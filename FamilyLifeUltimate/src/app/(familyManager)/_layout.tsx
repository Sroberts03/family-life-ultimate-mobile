import { Stack } from "expo-router";

export default function FamilyManagerLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="ManageJoinRequests" />
        </Stack>
    );
}
import { Stack } from "expo-router";

export default function FamilyManagerLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="ShoppingList" />
            <Stack.Screen name="ManageRecipes" />
        </Stack>
    );
}
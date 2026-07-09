import { Stack } from "expo-router";

export default function AuthLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Login" />
            <Stack.Screen name="SignUp" />
            <Stack.Screen name="FinishSignUp" />
            <Stack.Screen name="WaitForFamilyAcceptance" />
        </Stack>
    );
}
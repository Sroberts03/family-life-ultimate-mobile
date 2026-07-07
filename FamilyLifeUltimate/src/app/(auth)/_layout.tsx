import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AuthLayout() {
    return (
        <SafeAreaView>
            <Stack
            >
                <Stack.Screen name="Login" />
                <Stack.Screen name="SignUp" />
            </Stack>
        </SafeAreaView>
    );
}
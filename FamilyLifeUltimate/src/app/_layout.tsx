import "../../global.css";
import { SafeAreaView } from "react-native-safe-area-context";
import { AuthProvider, useAuth } from "../features/auth/AuthContext";
import { router, Stack } from "expo-router";
import { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { configureReanimatedLogger, ReanimatedLogLevel } from 'react-native-reanimated';
import { FamilyProvider } from "../features/family/FamilyContext";

configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false,
});

function IntialLayout() {
    const { session, error, loadingAuth, user } = useAuth();

    useEffect(() => {
        if (loadingAuth) return;
        if (!session) {
            console.log("No session");
            router.replace('/(auth)/Login');
        } else {
            if (user?.requestedToJoinFam && !user?.hasAssociatedFamily) {
                console.log("Requested to join family");
                router.replace('/(auth)/WaitForFamilyAcceptance');
            } else if (!user?.hasAssociatedFamily) {
                console.log("No family associated");
                router.replace('/(auth)/FinishSignUp');
            } else {
                console.log("Session");
                router.replace('/(tabs)/Home');
            }
        }
    }, [session, loadingAuth, user]);

    if (loadingAuth) {
        return (
            <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" color="#2563eb" />
            </View>
        );
    }

    return (
        <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="(familyManager)" options={{ headerShown: false }} />
        </Stack>
    );
}

export default function RootLayout() {
    return (
        <SafeAreaView className="flex-1 bg-background">
            <AuthProvider>
                <FamilyProvider>
                    <IntialLayout />
                </FamilyProvider>
            </AuthProvider>
        </SafeAreaView>
    )
}
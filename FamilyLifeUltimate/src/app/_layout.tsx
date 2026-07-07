import "../../global.css";
import { SafeAreaView } from "react-native-safe-area-context";
import { AuthProvider, useAuth } from "../features/auth/AuthContext";
import { router } from "expo-router";
import { useEffect } from "react";
import { Stack } from "expo-router";
import { View } from "react-native";
import { ActivityIndicator } from "react-native";

function IntialLayout() {
    const { session, error, loadingAuth } = useAuth();

    useEffect(() => {
        if (loadingAuth) return;
        if (!session) {
            console.log("No session");
            router.replace('/(auth)/Login');
        } else {
            console.log("Session");
            router.replace('/(tabs)');
        }            
    }, [session, loadingAuth]);

    if (loadingAuth) {
        return (
        <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#2563eb" />
        </View>
        );
    }

    return (
        <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        </Stack>
    );
}

export default function RootLayout() {
    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <AuthProvider>
                <IntialLayout />
            </AuthProvider>
        </SafeAreaView>
    )
}
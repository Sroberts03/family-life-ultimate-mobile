import { ScrollView, Text, TouchableOpacity, View, KeyboardAvoidingView, Platform } from "react-native";
import { useAuth } from "../../auth/AuthContext";
import SetUpFamilyHeader from "../components/SetUpFamilyHeader";
import SetUpFamilyForm from "../components/SetUpFamilyForm";

export default function SetUpFamilyScreen() {
    const { signOut, session } = useAuth();

    if (!session) return null;

    return (
        <KeyboardAvoidingView
            className="flex-1 bg-gray-50"
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                keyboardShouldPersistTaps="handled"
            >
                <View className="flex-1 px-7 py-12">
                    {/* Decorative background accent */}
                    <View className="absolute top-0 left-0 right-0 h-72 bg-indigo-500 rounded-b-[80px] opacity-[0.07]" />

                    <SetUpFamilyHeader />
                    <SetUpFamilyForm />

                    {/* Footer Actions */}
                    <View className="flex-row justify-center items-center mt-2 pb-8">
                        <TouchableOpacity
                            onPress={signOut}
                            activeOpacity={0.7}
                            className="px-4 py-2"
                        >
                            <Text className="text-slate-500 text-sm font-medium">
                                Sign Out
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
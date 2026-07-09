import {
    Text,
    View,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from "react-native";
import { router } from "expo-router";
import { useAuth } from "../AuthContext";
import AuthHeader from "../components/AuthHeader";
import LoginForm from "../components/LoginForm";
import SocialLogin from "../components/SocialLogin";

export default function LoginScreen() {
    const { clearError } = useAuth();

    const signupClicked = async () => {
        clearError();
        router.push("/SignUp");
    };

    return (
        <KeyboardAvoidingView
            className="flex-1 bg-background"
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                keyboardShouldPersistTaps="handled"
            >
                <View className="flex-1 justify-center px-7 py-12">
                    {/* Decorative background accent */}
                    <View className="absolute top-0 left-0 right-0 h-80 bg-indigo-500 rounded-b-[80px] opacity-[0.07]" />

                    {/* Logo & Brand */}
                    <AuthHeader />

                    {/* Form Card */}
                    <View className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm">
                        <LoginForm />
                        <SocialLogin />
                    </View>

                    {/* Sign Up Link */}
                    <View className="flex-row justify-center mt-8">
                        <Text className="text-slate-500 text-base">
                            Don't have an account?{" "}
                        </Text>
                        <TouchableOpacity
                            onPress={signupClicked}
                            activeOpacity={0.7}
                        >
                            <Text className="text-indigo-500 text-base font-semibold">
                                Sign Up
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
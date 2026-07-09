import { useState } from "react";
import {
    Text,
    View,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from "react-native";
import { router } from "expo-router";
import { OAuthProvider } from "../auth.types";
import { FontAwesome, Feather } from "@expo/vector-icons";
import { useAuth } from "../AuthContext";
import GlobalErrorDisplay from "@/src/globalComponents/GlobalErrorDisplay";

export default function LoginScreen() {
    const { loginWithEmail, oauthLogin, error, clearError } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const loginClicked = async (oAuthProvider?: OAuthProvider) => {
        if (oAuthProvider === "Google") {
            await oauthLogin("Google");
        } else if (oAuthProvider === "Apple") {
            await oauthLogin("Apple");
        } else {
            clearError();
            await loginWithEmail(email, password);
        }
    };

    const forgotPasswordClicked = async () => {
        alert("forgot password clicked not yet implemented");
    }

    const signupClicked = async () => {
        clearError();
        router.push("/SignUp");
    };

    return (
        <KeyboardAvoidingView
            className="flex-1 bg-gray-50"
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
                    <View className="items-center mb-10">
                        <View className="w-16 h-16 bg-indigo-500 rounded-2xl items-center justify-center mb-5">
                            <Text className="text-white text-2xl font-bold">
                                F
                            </Text>
                        </View>
                        <Text className="text-slate-900 text-3xl font-bold tracking-tight">
                            Family Life Ultimate
                        </Text>
                        <Text className="text-slate-500 text-base mt-2">
                            Sign in to your account
                        </Text>
                    </View>

                    {/* Form Card */}
                    <View className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm">
                        {/* Email */}
                        <View className="mb-5">
                            <Text className="text-slate-600 text-sm font-medium mb-2 ml-1">
                                Email
                            </Text>
                            <TextInput
                                className="
                                    bg-gray-100
                                    text-slate-900
                                    px-4
                                    h-14
                                    rounded-2xl
                                    text-base
                                    border
                                    border-gray-200
                                    "
                                placeholder="Email"
                                placeholderTextColor="#9ca3af"
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoCorrect={false}
                            />
                        </View>

                        {/* Password */}
                        <View className="mb-7">
                            <View className="flex-row justify-between items-center mb-2">
                                <Text className="text-slate-600 text-sm font-medium ml-1">
                                    Password
                                </Text>
                                <TouchableOpacity onPress={forgotPasswordClicked} activeOpacity={0.7}>
                                    <Text className="text-indigo-500 text-sm font-medium">
                                        Forgot Password?
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            <View className="relative">
                                <TextInput
                                    className="
                                    bg-gray-100
                                    text-slate-900
                                    px-4
                                    h-14
                                    pr-12
                                    rounded-2xl
                                    text-base
                                    border
                                    border-gray-200
                                    "
                                    placeholder="Password"
                                    placeholderTextColor="#9ca3af"
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry={!showPassword}
                                />
                                <TouchableOpacity
                                    className="absolute right-4 top-0 bottom-0 justify-center"
                                    onPress={() => setShowPassword(!showPassword)}
                                    activeOpacity={0.7}
                                >
                                    <Feather
                                        name={showPassword ? "eye" : "eye-off"}
                                        size={20}
                                        color="#94a3b8"
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Error Message */}
                        {error && <GlobalErrorDisplay error={error} />}

                        {/* Sign In Button */}
                        <TouchableOpacity
                            className="bg-indigo-500 py-4 rounded-2xl items-center"
                            activeOpacity={0.8}
                            onPress={() => loginClicked()}
                        >
                            <Text className="text-white text-base font-semibold tracking-wide">
                                Sign In
                            </Text>
                        </TouchableOpacity>

                        {/* Divider */}
                        <View className="flex-row items-center my-6">
                            <View className="flex-1 h-px bg-gray-200" />
                            <Text className="text-slate-400 text-xs mx-4 uppercase tracking-widest">
                                or continue with
                            </Text>
                            <View className="flex-1 h-px bg-gray-200" />
                        </View>

                        {/* Social Login */}
                        <View className="flex-row gap-3">
                            <TouchableOpacity
                                className="flex-1 bg-gray-100 py-3.5 rounded-2xl items-center border border-gray-200"
                                activeOpacity={0.7}
                                onPress={() => loginClicked('Google')}
                            >
                                <View className="flex-row items-center gap-2">
                                    <FontAwesome name="google" size={18} color="#4285F4" />
                                    <Text className="text-slate-700 text-sm font-medium">
                                        Google
                                    </Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity
                                className="flex-1 bg-gray-100 py-3.5 rounded-2xl items-center border border-gray-200"
                                activeOpacity={0.7}
                                onPress={() => loginClicked('Apple')}
                            >
                                <View className="flex-row items-center gap-2">
                                    <FontAwesome name="apple" size={20} color="#334155" />
                                    <Text className="text-slate-700 text-sm font-medium">
                                        Apple
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </View>
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
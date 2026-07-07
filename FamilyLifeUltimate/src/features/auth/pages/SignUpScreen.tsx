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
import { Feather } from "@expo/vector-icons";
import { useAuth } from "../AuthContext";

export default function SignUpScreen() {
    const { signupWithEmail, error, clearError } = useAuth();
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState(""); 
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const signupClicked = async () => {
        clearError();
        await signupWithEmail(email, password, fullName);
    };

    const loginClicked = () => {
        clearError();
        router.back();
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
                    <View className="items-center mb-10 mt-10">
                        <View className="w-16 h-16 bg-indigo-500 rounded-2xl items-center justify-center mb-5">
                            <Text className="text-white text-2xl font-bold">
                                F
                            </Text>
                        </View>
                        <Text className="text-slate-900 text-3xl font-bold tracking-tight text-center">
                            Join Family Life
                        </Text>
                        <Text className="text-slate-500 text-base mt-2">
                            Create your account
                        </Text>
                    </View>

                    {/* Form Card */}
                    <View className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm">
                        
                        <View className="flex-row gap-3 mb-5">
                            {/* First Name */}
                            <View className="flex-1">
                                <Text className="text-slate-600 text-sm font-medium mb-2 ml-1">
                                    Full Name
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
                                    placeholder="Full Name"
                                    placeholderTextColor="#9ca3af"
                                    value={fullName}
                                    onChangeText={setFullName}
                                    autoCorrect={false}
                                />
                            </View>
                        </View>

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
                        {error && (
                            <View className="mb-5 mt-3 items-center text-center justify-center">
                                <Text className="text-red-500 text-base text-center">{error}</Text>
                            </View>
                        )}

                        {/* Sign Up Button */}
                        <TouchableOpacity
                            className="bg-indigo-500 py-4 rounded-2xl items-center"
                            activeOpacity={0.8}
                            onPress={() => signupClicked()}
                        >
                            <Text className="text-white text-base font-semibold tracking-wide">
                                Sign Up
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Sign In Link */}
                    <View className="flex-row justify-center mt-8">
                        <Text className="text-slate-500 text-base">
                            Already have an account?{" "}
                        </Text>
                        <TouchableOpacity
                            onPress={loginClicked}
                            activeOpacity={0.7}
                        >
                            <Text className="text-indigo-500 text-base font-semibold">
                                Sign In
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
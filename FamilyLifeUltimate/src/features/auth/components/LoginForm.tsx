import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useAuth } from "../AuthContext";
import GlobalErrorDisplay from "@/src/globalComponents/GlobalErrorDisplay";

export default function LoginForm() {
    const { loginWithEmail, error, clearError } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const loginClicked = async () => {
        clearError();
        await loginWithEmail(email, password);
    };

    const forgotPasswordClicked = async () => {
        alert("forgot password clicked not yet implemented");
    };

    return (
        <View>
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
                onPress={loginClicked}
            >
                <Text className="text-white text-base font-semibold tracking-wide">
                    Sign In
                </Text>
            </TouchableOpacity>
        </View>
    );
}

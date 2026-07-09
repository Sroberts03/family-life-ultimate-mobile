import { View, Text, TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useAuth } from "../AuthContext";
import { OAuthProvider } from "../auth.types";

export default function SocialLogin() {
    const { oauthLogin } = useAuth();

    const loginClicked = async (oAuthProvider: OAuthProvider) => {
        if (oAuthProvider === "Google") {
            await oauthLogin("Google");
        } else if (oAuthProvider === "Apple") {
            await oauthLogin("Apple");
        }
    };

    return (
        <View>
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
    );
}

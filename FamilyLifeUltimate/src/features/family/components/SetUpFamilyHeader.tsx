import { View, Text } from "react-native";
import { Feather } from "@expo/vector-icons";

export default function SetUpFamilyHeader() {
    return (
        <View className="items-center mt-8 mb-5">
            <View className="w-16 h-16 bg-indigo-100 rounded-full items-center justify-center mb-5 border border-indigo-200">
                <Feather name="users" size={28} color="#6366f1" />
            </View>
            <Text className="text-slate-900 text-3xl font-bold tracking-tight text-center">
                Join a Family
            </Text>
            <Text className="text-slate-500 text-base mt-2 text-center">
                Enter a family invite code or create a new family to get started.
            </Text>
        </View>
    );
}

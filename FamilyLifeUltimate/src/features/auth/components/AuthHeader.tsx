import { View, Text } from "react-native";

interface AuthHeaderProps {
    title?: string;
    subtitle?: string;
}

export default function AuthHeader({ 
    title = "Family Life Ultimate", 
    subtitle = "Sign in to your account" 
}: AuthHeaderProps) {
    return (
        <View className="items-center mb-10">
            <View className="w-16 h-16 bg-indigo-500 rounded-2xl items-center justify-center mb-5">
                <Text className="text-white text-2xl font-bold">
                    F
                </Text>
            </View>
            <Text className="text-slate-900 text-3xl font-bold tracking-tight text-center">
                {title}
            </Text>
            <Text className="text-slate-500 text-base mt-2 text-center">
                {subtitle}
            </Text>
        </View>
    );
}

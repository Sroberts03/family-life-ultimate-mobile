import { View, Text } from "react-native";

interface ScreenHeaderProps {
    title: string;
    subtitle?: string;
}

export default function ScreenHeader({ title, subtitle }: ScreenHeaderProps) {
    return (
        <View className="px-6 pt-6 pb-5 bg-white border-b border-gray-200">
            <Text className="text-3xl font-bold text-slate-900 tracking-tight">
                {title}
            </Text>
            {subtitle && (
                <Text className="text-base text-slate-500 mt-1">
                    {subtitle}
                </Text>
            )}
        </View>
    );
}

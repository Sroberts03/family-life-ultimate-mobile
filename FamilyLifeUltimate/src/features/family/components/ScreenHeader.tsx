import { View, Text } from "react-native";

interface ScreenHeaderProps {
    title: string;
    subtitle?: string;
}

export default function ScreenHeader({ title, subtitle }: ScreenHeaderProps) {
    return (
        <View className="bg-background border-b border-gray-200">
            <Text className="text-3xl font-bold text-text tracking-tight text-center">
                {title}
            </Text>
            {subtitle && (
                <Text className="text-base text-text-muted mt-1 mb-5 text-center">
                    {subtitle}
                </Text>
            )}
        </View>
    );
}

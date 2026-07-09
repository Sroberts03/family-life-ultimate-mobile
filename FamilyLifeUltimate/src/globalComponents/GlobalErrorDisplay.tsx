import { TouchableOpacity, View, Text } from "react-native";

type GlobalErrorDisplayProps = {
    error: string;
}

export default function GlobalErrorDisplay({ error }: GlobalErrorDisplayProps) {
    if (!error) return null;
    return (
        <View className="mb-5 mt-3 items-center text-center justify-center">
            <Text className="text-red-500 text-base text-center">{error}</Text>
        </View>
    );
}
import { ActivityIndicator, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";

interface Props {
    error: string;
    loading: boolean;
}

export default function ErrorLoading({ error, loading }: Props) {
    if (error) {
        return (
            <View className="bg-red-50 p-4 rounded-xl border border-red-200 mb-6 flex-row items-center">
                <Feather name="alert-circle" size={20} color="#b91c1c" />
                <Text className="text-red-700 font-medium ml-3 flex-1">{error}</Text>
            </View>
        );
    }
    if (loading) {
        return (
            <ActivityIndicator
                size="large"
                color="#0000ff"
            />
        );
    }
    return null;
}
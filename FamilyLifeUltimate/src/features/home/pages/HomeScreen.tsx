import { Text, View, ScrollView, TouchableOpacity } from "react-native";
import { useAuth } from "../../auth/AuthContext";

export default function HomeScreen() {
    const { signOut } = useAuth();

    return (
        <View className="flex-1 bg-white">
            <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                keyboardShouldPersistTaps="handled"
            >
                <View className="flex-1 justify-center px-7 py-12">
                    <Text>Home</Text>
                    <TouchableOpacity className="mt-5" onPress={signOut}>
                        <Text className="text-red-500 text-base font-medium">Sign Out</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}
    
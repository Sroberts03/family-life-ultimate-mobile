import { View, Text } from "react-native";

export default function ShoppingList() {
    return (
        <View className="flex-1 bg-background">
            <View className="px-3">
                <Text className="text-center text-xl font-bold">Shopping List</Text>
            </View>
        </View>
    );
}
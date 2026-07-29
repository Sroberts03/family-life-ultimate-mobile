import BackButton from "@/src/globalComponents/BackButton";
import ErrorLoading from "@/src/globalComponents/ErrorLoading";
import ScreenHeader from "@/src/globalComponents/ScreenHeader";
import { View } from "react-native";
import { useAuth } from "../../auth/AuthContext";
import { useState } from "react";

export default function ShoppingListScreen() {
    const { session } = useAuth();
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    return (
        <View className="flex-1 bg-background">
            <ScreenHeader title="Shopping List" subtitle="Manage Your Shopping List" />
            <BackButton
                className="w-12 h-12 
                bg-white border border-gray-100 rounded-full 
                items-center justify-center transition-colors
                absolute top-4 left-4 z-50
                shadow-sm
                "
            />
            <ErrorLoading error={error} loading={loading} />
        </View>
    );
}
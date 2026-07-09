import { Feather } from "@expo/vector-icons"
import { TouchableOpacity, View, Text } from "react-native"
import { useAuth } from "../../auth/AuthContext";
import PendingStatusCard from "../components/PendingStatusCard";

export default function WaitForFamilyAcceptanceScreen() {
    const { signOut } = useAuth();

    return (
        <View className="flex-1 bg-background">
            <View className="flex-1 px-7 py-20">
                {/* Decorative background accent */}
                <View className="absolute top-0 left-0 right-0 h-72 bg-indigo-500 rounded-b-[80px] opacity-[0.07]" />

                {/* Main Content Card */}
                <PendingStatusCard />

                {/* Footer Actions */}
                <View className="items-center mt-12">
                    <TouchableOpacity
                        onPress={signOut}
                        activeOpacity={0.7}
                        className="px-6 py-3 rounded-full bg-white border border-gray-200 shadow-sm flex-row items-center"
                    >
                        <Feather name="log-out" size={16} color="#64748b" />
                        <Text className="text-slate-500 font-medium ml-2">
                            Sign Out
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

import { Feather } from "@expo/vector-icons"
import { TouchableOpacity, View, Text } from "react-native"
import { useAuth } from "../../auth/AuthContext";

export default function WaitForFamilyAcceptanceScreen() {
    const { signOut } = useAuth();

    return (
        <View className="flex-1 bg-gray-50">
            <View className="flex-1 px-7 py-20">
                {/* Decorative background accent */}
                <View className="absolute top-0 left-0 right-0 h-72 bg-indigo-500 rounded-b-[80px] opacity-[0.07]" />

                {/* Main Content Card */}
                <View className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm items-center z-10 mt-20">

                    {/* Icon Container */}
                    <View className="w-20 h-20 bg-indigo-50 rounded-full items-center justify-center mb-6 border-4 border-white shadow-sm">
                        <Feather name="clock" size={32} color="#6366f1" />
                    </View>

                    <Text className="text-slate-900 text-2xl font-bold tracking-tight text-center mb-3">
                        Request Sent
                    </Text>

                    <Text className="text-slate-500 text-base text-center leading-relaxed mb-8">
                        Your request to join the family has been sent. Please wait for the owner or another family member to approve your request.
                    </Text>

                    <View className="bg-indigo-50 px-5 py-4 rounded-2xl w-full flex-row items-center justify-center">
                        <View className="w-2 h-2 rounded-full bg-indigo-500 mr-2" />
                        <Text className="text-indigo-700 font-medium text-sm">
                            Status: Pending Approval
                        </Text>
                    </View>
                </View>

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

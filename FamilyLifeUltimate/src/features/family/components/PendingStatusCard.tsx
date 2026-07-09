import { View, Text } from "react-native";
import { Feather } from "@expo/vector-icons";

export default function PendingStatusCard() {
    return (
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
    );
}

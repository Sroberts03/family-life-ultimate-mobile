import { View, Text } from "react-native";
import { Feather } from "@expo/vector-icons";

export default function EmptyRequestsState() {
    return (
        <View className="items-center justify-center py-16 bg-white rounded-[32px] border border-gray-200 shadow-sm border-dashed mt-4">
            <View className="w-20 h-20 bg-indigo-50 rounded-full items-center justify-center mb-5 border-4 border-white shadow-sm">
                <Feather name="inbox" size={28} color="#6366f1" />
            </View>
            <Text className="text-slate-900 font-bold text-xl">No Pending Requests</Text>
            <Text className="text-slate-500 text-center mt-2 px-10 leading-relaxed text-base">
                You're all caught up! New family member requests will appear here.
            </Text>
        </View>
    );
}

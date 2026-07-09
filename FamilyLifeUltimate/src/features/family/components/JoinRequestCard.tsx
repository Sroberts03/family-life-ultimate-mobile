import { View, Text, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { JoinRequest } from "../family.types";

interface JoinRequestCardProps {
    request: JoinRequest;
    onAction: (requestId: number, accept: boolean) => void;
}

export default function JoinRequestCard({ request, onAction }: JoinRequestCardProps) {
    const getRoleColor = (role: string) => {
        switch (role.toLowerCase()) {
            case 'adult': return 'bg-indigo-100 text-indigo-700';
            case 'child': return 'bg-emerald-100 text-emerald-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <View
            className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm mb-4"
        >
            <View className="flex-row items-center mb-5 mt-1">
                <View className="w-14 h-14 bg-slate-50 rounded-full items-center justify-center border border-slate-100 mr-4">
                    <Feather name="user" size={24} color="#64748b" />
                </View>
                <View className="flex-1">
                    <Text className="text-xl font-bold text-slate-900">
                        {request.fullName}
                    </Text>
                    <View className="flex-row items-center mt-1.5">
                        <View className={`px-2.5 py-1 rounded-md ${getRoleColor(request.role)}`}>
                            <Text className="text-[10px] font-bold uppercase tracking-widest">
                                {request.role}
                            </Text>
                        </View>
                        <Text className="text-xs font-medium text-slate-400 ml-3">
                            Wants to join
                        </Text>
                    </View>
                </View>
            </View>

            <View className="flex-row">
                <TouchableOpacity
                    onPress={() => onAction(request.requestId, false)}
                    className="flex-1 py-3.5 rounded-2xl border border-slate-200 bg-white items-center justify-center mr-3"
                    activeOpacity={0.7}
                >
                    <Text className="text-slate-600 font-bold text-sm">Decline</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => onAction(request.requestId, true)}
                    className="flex-1 py-3.5 rounded-2xl bg-indigo-500 items-center justify-center"
                    activeOpacity={0.8}
                >
                    <Text className="text-white font-bold text-sm">Approve</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

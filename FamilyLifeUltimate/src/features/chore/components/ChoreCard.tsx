import { Text, View, TouchableOpacity } from "react-native";
import { Chore } from "../chore.types";
import { Feather } from "@expo/vector-icons";

interface ChoreCardProps {
    chore: Chore;
    userCanEdit: boolean;
    onPress: (action: "edit" | "delete", chore: Chore) => void;
}

export default function ChoreCard({ chore, userCanEdit, onPress }: ChoreCardProps) {
    const isCompleted = !!chore.dateCompleted;

    return (
        <View className="bg-white rounded-2xl p-4 mb-3 border border-gray-100 shadow-sm shadow-gray-200 mt-3">
            <View className="flex-row justify-between items-start mb-2">
                <View className="flex-1 pr-3">
                    <Text className="text-lg font-bold text-gray-900">{chore.name}</Text>
                    {chore.description ? (
                        <Text className="text-sm text-gray-500 mt-1 leading-5">{chore.description}</Text>
                    ) : null}
                </View>
                <View className={`px-3 py-1 rounded-full ${isCompleted ? 'bg-green-100' : 'bg-orange-100'}`}>
                    <Text className={`text-xs font-semibold ${isCompleted ? 'text-green-700' : 'text-orange-700'}`}>
                        {isCompleted ? 'Completed' : 'Pending'}
                    </Text>
                </View>
            </View>

            <View className="flex-row justify-between items-center mt-3 pt-3 border-t border-gray-100">
                <View className="flex-row items-center flex-1">
                    <Feather name="users" size={16} color="#6B7280" />
                    <Text className="text-sm text-gray-600 ml-2" numberOfLines={1}>
                        {chore.assigneeNames && chore.assigneeNames.length > 0
                            ? chore.assigneeNames.join(", ")
                            : "Unassigned"}
                    </Text>
                </View>

                {userCanEdit && (
                    <View className="flex-row items-center gap-3 ml-2">
                        <TouchableOpacity onPress={() => onPress("edit", chore)} className="p-2 bg-blue-50 rounded-full">
                            <Feather name="edit-2" size={16} color="#3B82F6" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => onPress("delete", chore)} className="p-2 bg-red-50 rounded-full">
                            <Feather name="trash-2" size={16} color="#EF4444" />
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </View>
    );
}
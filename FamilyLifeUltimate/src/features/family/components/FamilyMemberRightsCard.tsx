import { Text, View, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { FamilyMember } from "../family.types";

interface FamilyMemberRightsCardProps {
    member: FamilyMember;
    isMe: boolean;
    onEditRights: (userId: string) => void;
}

export default function FamilyMemberRightsCard({ member, isMe, onEditRights }: FamilyMemberRightsCardProps) {
    const initials = member.fullName.charAt(0).toUpperCase();

    return (
        <View className="bg-white border border-gray-100 rounded-3xl p-5 mb-4 shadow-sm flex-row">
            {/* Avatar */}
            <View className="w-12 h-12 rounded-full bg-indigo-50 border border-indigo-100 items-center justify-center mr-4 shadow-sm">
                <Text className="text-indigo-600 font-bold text-lg">{initials}</Text>
            </View>
            
            <View className="flex-1">
                {/* Header row: Name + Badges */}
                <View className="flex-row items-center justify-between mb-1">
                    <View className="flex-row items-center flex-1 pr-2">
                        <Text className="text-lg font-bold text-slate-900 mr-2" numberOfLines={1}>{member.fullName}</Text>
                        {isMe && (
                            <View className="bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-md">
                                <Text className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">You</Text>
                            </View>
                        )}
                    </View>
                    <View className="bg-slate-50 border border-slate-100 px-2 py-1 rounded-md">
                        <Text className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{member.role}</Text>
                    </View>
                </View>

                {/* Permissions/Activities */}
                <View className="mt-4 pt-4 border-t border-gray-50">
                    <View className="flex-row items-center justify-between mb-3">
                        <Text className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Permissions</Text>
                        <TouchableOpacity onPress={() => onEditRights(member.userId)} className="p-1">
                            <Feather name="edit-2" size={14} color="#64748b" />
                        </TouchableOpacity>
                    </View>
                    {member.activities && member.activities.length > 0 ? (
                        <View className="flex-row flex-wrap">
                            {member.activities.map((activity) => (
                                <View 
                                    key={activity.activityName} 
                                    className="flex-row items-center bg-indigo-50/50 border border-indigo-100/60 px-3 py-1.5 rounded-full mr-2 mb-2"
                                >
                                    <Feather name="check" size={14} color="#4f46e5" />
                                    <Text className="text-xs text-indigo-700 ml-1.5 font-medium">{activity.activityName}</Text>
                                </View>
                            ))}
                        </View>
                    ) : (
                        <Text className="text-sm text-slate-500 italic">No specific permissions</Text>
                    )}
                </View>
            </View>
        </View>
    );
}

import { Modal, View, Text, TouchableOpacity, ScrollView, Switch } from "react-native";
import { Feather } from "@expo/vector-icons";
import { PersActivity } from "../../auth/auth.types";

interface props {
    visible: boolean;
    onClose: () => void;
    currentUserActivities: PersActivity[];
    allActivities: any[];
    familyMemberId: string;
    familyId: string;
}
export default function EditActivityModal({visible, onClose, currentUserActivities, allActivities, familyMemberId, familyId}: props) {
    
    // Format activity name to be more readable
    const formatActivity = (activityName: string) => {
        if (!activityName) return "";
        if (activityName.includes('_')) {
            const parts = activityName.split('_');
            return parts[0].charAt(0).toUpperCase() + parts[0].slice(1) + ' ' + parts[1].charAt(0).toUpperCase() + parts[1].slice(1);
        } else {
            return activityName.charAt(0).toUpperCase() + activityName.slice(1);
        }
    }

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View className="flex-1 bg-black/40 justify-center items-center px-5">
                <View className="bg-white rounded-[32px] w-full max-w-md shadow-2xl overflow-hidden">
                    {/* Header */}
                    <View className="flex-row items-center justify-between px-6 py-5 border-b border-gray-100 bg-gray-50/50">
                        <View>
                            <Text className="text-xl font-bold text-slate-900">Edit Permissions</Text>
                            <Text className="text-xs text-slate-500 mt-1">Manage access for this member</Text>
                        </View>
                        <TouchableOpacity 
                            onPress={onClose}
                            className="w-8 h-8 bg-gray-100 rounded-full items-center justify-center"
                        >
                            <Feather name="x" size={16} color="#64748b" />
                        </TouchableOpacity>
                    </View>

                    {/* Content */}
                    <ScrollView className="max-h-96" contentContainerStyle={{ padding: 20 }}>
                        {allActivities && allActivities.map((activity, index) => {
                            const isEnabled = currentUserActivities.some(a => a.activityName === activity.name);
                            return (
                                <View 
                                    key={activity.activityId || index} 
                                    className={`flex-row items-center justify-between p-4 mb-3 rounded-2xl border ${isEnabled ? 'border-indigo-100 bg-indigo-50/40' : 'border-gray-100 bg-white'}`}
                                >
                                    <View className="flex-1 pr-4">
                                        <Text className={`font-semibold text-[15px] mb-1 ${isEnabled ? 'text-indigo-900' : 'text-slate-800'}`}>
                                            {formatActivity(activity.name)}
                                        </Text>
                                        <Text className="text-[13px] text-slate-500 leading-snug">
                                            {activity.description}
                                        </Text>
                                    </View>
                                    <Switch
                                        trackColor={{ false: "#e2e8f0", true: "#818cf8" }}
                                        thumbColor={isEnabled ? "#4f46e5" : "#f8fafc"}
                                        ios_backgroundColor="#e2e8f0"
                                        onValueChange={() => {}}
                                        value={isEnabled}
                                        style={{ transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }] }}
                                    />
                                </View>
                            );
                        })}
                    </ScrollView>

                    {/* Footer */}
                    <View className="p-5 border-t border-gray-100 bg-gray-50/50 flex-row">
                        <TouchableOpacity 
                            onPress={onClose}
                            className="flex-1 py-3.5 rounded-xl border border-gray-200 bg-white mr-3 items-center justify-center shadow-sm"
                        >
                            <Text className="font-semibold text-slate-600">Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            className="flex-1 py-3.5 rounded-xl bg-indigo-600 items-center justify-center shadow-sm"
                        >
                            <Text className="font-semibold text-white">Save Changes</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}
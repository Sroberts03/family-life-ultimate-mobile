import { useState, useEffect } from "react";
import { Text, View, Modal, TouchableOpacity, ScrollView } from "react-native";
import { Feather } from "@expo/vector-icons";
import { FamilyMember } from "../../family/family.types";

interface ChoreAssignmentProps {
    visible: boolean;
    choreAssigneeIds: Set<string>;
    familyMembers: FamilyMember[];
    onClose: () => void;
    onSubmit: (choreId: number, choreAssigneeIds: Set<string>) => void;
    choreId: number;
}

export default function ChoreAssignment({ visible, choreAssigneeIds, familyMembers, onClose, onSubmit, choreId }: ChoreAssignmentProps) {
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set(choreAssigneeIds));

    useEffect(() => {
        if (visible) {
            setSelectedIds(new Set(choreAssigneeIds));
        }
    }, [visible, choreAssigneeIds]);

    const toggleMember = (userId: string) => {
        const newSelected = new Set(selectedIds);
        if (newSelected.has(userId)) {
            newSelected.delete(userId);
        } else {
            newSelected.add(userId);
        }
        setSelectedIds(newSelected);
    };

    const handleSave = () => {
        onSubmit(choreId, selectedIds);
    };

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .substring(0, 2)
            .toUpperCase();
    };

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View className="flex-1 bg-black/40 justify-center items-center px-5">
                <View className="bg-white rounded-[32px] w-full max-w-sm shadow-2xl overflow-hidden p-6 max-h-[85%]">
                    {/* Header */}
                    <View className="flex-row justify-between items-center mb-2">
                        <Text className="text-xl font-bold text-slate-900">Assign Chore</Text>
                        <TouchableOpacity 
                            onPress={onClose} 
                            className="p-2 -mr-2 rounded-full active:bg-slate-100"
                        >
                            <Feather name="x" size={20} color="#64748b" />
                        </TouchableOpacity>
                    </View>
                    <Text className="text-[15px] text-slate-500 mb-5 leading-relaxed">
                        Select family members to assign to this chore.
                    </Text>

                    {/* Member List */}
                    <ScrollView 
                        className="w-full mb-5" 
                        showsVerticalScrollIndicator={false}
                    >
                        {familyMembers.length === 0 ? (
                            <Text className="text-center text-slate-500 py-4">No family members found.</Text>
                        ) : (
                            familyMembers.map((member) => {
                                const isSelected = selectedIds.has(member.userId);
                                return (
                                    <TouchableOpacity
                                        key={member.userId}
                                        onPress={() => toggleMember(member.userId)}
                                        className={`flex-row items-center p-3 mb-3 rounded-2xl border ${
                                            isSelected
                                                ? "border-blue-500 bg-blue-50/50"
                                                : "border-slate-100 bg-white"
                                        }`}
                                    >
                                        {/* Avatar */}
                                        <View className={`w-12 h-12 rounded-full items-center justify-center mr-3 ${
                                            isSelected ? "bg-blue-100" : "bg-slate-100"
                                        }`}>
                                            <Text className={`font-bold text-base ${
                                                isSelected ? "text-blue-600" : "text-slate-600"
                                            }`}>
                                                {getInitials(member.fullName)}
                                            </Text>
                                        </View>
                                        
                                        {/* Info */}
                                        <View className="flex-1">
                                            <Text className="font-semibold text-slate-800 text-[15px]">
                                                {member.fullName}
                                            </Text>
                                            <Text className="text-xs text-slate-500 capitalize mt-0.5">
                                                {member.role}
                                            </Text>
                                        </View>
                                        
                                        {/* Checkbox */}
                                        <View className="ml-2">
                                            <Feather
                                                name={isSelected ? "check-circle" : "circle"}
                                                size={24}
                                                color={isSelected ? "#3b82f6" : "#cbd5e1"}
                                            />
                                        </View>
                                    </TouchableOpacity>
                                );
                            })
                        )}
                    </ScrollView>

                    {/* Footer Actions */}
                    <View className="flex-row w-full pt-4 border-t border-slate-100">
                        <TouchableOpacity
                            onPress={onClose}
                            className="flex-1 py-3.5 rounded-xl border border-slate-200 bg-white items-center justify-center shadow-sm mr-2"
                        >
                            <Text className="font-semibold text-slate-600">Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={handleSave}
                            className="flex-1 py-3.5 rounded-xl bg-blue-600 items-center justify-center shadow-sm ml-2"
                        >
                            <Text className="font-semibold text-white">Save Changes</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}
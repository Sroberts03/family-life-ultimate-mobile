import { Modal, View, Text, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";

interface props {
    isVisible: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

export default function ConfirmMemberRemoval({ isVisible, onConfirm, onCancel }: props) {
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={isVisible}
            onRequestClose={onCancel}
        >
            <View className="flex-1 bg-black/40 justify-center items-center px-5">
                <View className="bg-white rounded-[32px] w-full max-w-sm shadow-2xl overflow-hidden p-6 items-center">
                    <View className="w-16 h-16 bg-red-100 rounded-full items-center justify-center mb-4">
                        <Feather name="alert-triangle" size={32} color="#ef4444" />
                    </View>
                    
                    <Text className="text-xl font-bold text-slate-900 text-center mb-2">Remove Member</Text>
                    <Text className="text-[15px] text-slate-500 text-center mb-6 leading-relaxed">
                        Are you sure you want to remove this member from the family? This action cannot be undone.
                    </Text>

                    <View className="flex-row w-full space-x-3">
                        <TouchableOpacity 
                            onPress={onCancel}
                            className="flex-1 py-3.5 rounded-xl border border-gray-200 bg-white items-center justify-center shadow-sm mr-2"
                        >
                            <Text className="font-semibold text-slate-600">Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            className="flex-1 py-3.5 rounded-xl bg-red-500 items-center justify-center shadow-sm ml-2"
                            onPress={onConfirm}
                        >
                            <Text className="font-semibold text-white">Remove</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}
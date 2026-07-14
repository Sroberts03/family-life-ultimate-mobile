import { Modal, Text, TouchableOpacity, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Chore } from "../chore.types";

interface props {
    visible: boolean;
    onClose: () => void;
    onSubmit: (choreId: number, thisAndFuture: boolean) => void;
    chore: Chore;
}

export default function ConfirmDeleteModal({visible, onClose, onSubmit, chore}: props) {
    return (
        <Modal 
            visible={visible} 
            animationType="fade" 
            transparent={true}
            onRequestClose={onClose}
        >
            <View className="flex-1 bg-black/40 justify-center items-center px-5">
                <View className="bg-white rounded-[32px] w-full max-w-sm shadow-2xl overflow-hidden p-6 items-center">
                    <View className="w-16 h-16 bg-red-100 rounded-full items-center justify-center mb-4">
                        <Feather name="trash-2" size={32} color="#ef4444" />
                    </View>
                    
                    <Text className="text-xl font-bold text-slate-900 text-center mb-2">Delete Chore</Text>
                    <Text className="text-[15px] text-slate-500 text-center mb-6 leading-relaxed">
                        Are you sure you want to delete {chore.name}? This action cannot be undone.
                    </Text>

                    <View className="w-full">
                        <TouchableOpacity 
                            className="w-full py-3.5 rounded-xl bg-red-500 items-center justify-center shadow-sm mb-3"
                            onPress={() => onSubmit(chore.id, false)}
                        >
                            <Text className="font-semibold text-white">Delete just this one</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity 
                            className="w-full py-3.5 rounded-xl bg-red-500 items-center justify-center shadow-sm mb-3"
                            onPress={() => onSubmit(chore.id, true)}
                        >
                            <Text className="font-semibold text-white">Delete all future instances</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity 
                            onPress={onClose}
                            className="w-full py-3.5 rounded-xl border border-gray-200 bg-white items-center justify-center shadow-sm"
                        >
                            <Text className="font-semibold text-slate-600">Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    )
}
    
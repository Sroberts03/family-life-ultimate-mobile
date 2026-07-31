import { Modal, Text, TouchableOpacity, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { ShoppingListItem } from "../meal.types";

interface Props {
    isVisible: boolean;
    onConfirm: () => void;
    onCancel: () => void;
    item: ShoppingListItem;
}

export default function DeleteShoppingModal({ isVisible, onConfirm, onCancel, item }: Props) {
    if (!item) return null;

    return (
        <Modal 
            visible={isVisible} 
            animationType="fade" 
            transparent={true}
            onRequestClose={onCancel}
        >
            <View className="flex-1 bg-black/40 justify-center items-center px-5">
                <View className="bg-white rounded-[32px] w-full max-w-sm shadow-2xl overflow-hidden p-6 items-center">
                    <View className="w-16 h-16 bg-red-100 rounded-full items-center justify-center mb-4">
                        <Feather name="trash-2" size={32} color="#ef4444" />
                    </View>
                    
                    <Text className="text-xl font-bold text-slate-900 text-center mb-2">Delete Item</Text>
                    <Text className="text-[15px] text-slate-500 text-center mb-6 leading-relaxed">
                        Are you sure you want to delete <Text className="font-semibold text-slate-700">{item.item}</Text> from your shopping list?
                    </Text>

                    <View className="w-full flex-row gap-3">
                        <TouchableOpacity 
                            onPress={onCancel}
                            className="flex-1 py-3.5 rounded-xl border border-gray-200 bg-white items-center justify-center shadow-sm"
                        >
                            <Text className="font-semibold text-slate-600">Cancel</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity 
                            className="flex-1 py-3.5 rounded-xl bg-red-500 items-center justify-center shadow-sm"
                            onPress={onConfirm}
                        >
                            <Text className="font-semibold text-white">Delete</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}
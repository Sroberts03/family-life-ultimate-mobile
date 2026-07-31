import React, { useState, useEffect } from "react";
import { 
    View, 
    Text, 
    Modal, 
    TextInput, 
    TouchableOpacity, 
    KeyboardAvoidingView, 
    Platform,
    TouchableWithoutFeedback,
    Keyboard
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useFamily } from "../../family/FamilyContext";
import { ShoppingListItem } from "../meal.types";

interface Props {
    isVisible: boolean;
    onConfirmCreate?: (familyId: string, quantity: number, unit: string, item: string) => void;
    onConfirmEdit?: (id: number, quantity: number, unit: string, item: string) => void;
    onCancel: () => void;
    shoppingItem?: ShoppingListItem;
}

export default function UpdateShoppingListItems({ isVisible, shoppingItem, onConfirmCreate, onConfirmEdit, onCancel }: Props) {
    const { familyId } = useFamily();
    const [quantity, setQuantity] = useState(shoppingItem?.quantity ? shoppingItem.quantity.toString() : "");
    const [unit, setUnit] = useState(shoppingItem?.unit || "");
    const [item, setItem] = useState(shoppingItem?.item || "");
    
    useEffect(() => {
        if (isVisible) {
            setQuantity(shoppingItem?.quantity ? shoppingItem.quantity.toString() : "");
            setUnit(shoppingItem?.unit || "");
            setItem(shoppingItem?.item || "");
        }
    }, [isVisible, shoppingItem]);

    const handleClose = () => {
        setItem("");
        setQuantity("");
        setUnit("");
        onCancel();
    };

    const confirm = () => {
        if (!item.trim()) return;

        const qtyNum = parseFloat(quantity);
        const finalQuantity = isNaN(qtyNum) ? 0 : qtyNum;

        if (onConfirmCreate && familyId) {
            onConfirmCreate(familyId, finalQuantity, unit, item);
        } else if (onConfirmEdit && shoppingItem) {
            onConfirmEdit(shoppingItem.id, finalQuantity, unit, item);
        }
        handleClose();
    };
    
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={isVisible}
            onRequestClose={handleClose}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View className="flex-1 justify-center items-center bg-black/50 px-5">
                    <KeyboardAvoidingView
                        behavior={Platform.OS === "ios" ? "padding" : "height"}
                        className="w-full"
                    >
                        <View className="bg-white rounded-3xl p-6 w-full shadow-xl">
                            <View className="flex-row justify-between items-center mb-6">
                                <Text className="text-2xl font-bold text-gray-800">
                                    {shoppingItem ? "Edit Item" : "Add Item"}
                                </Text>
                                <TouchableOpacity onPress={handleClose} className="p-2 bg-gray-100 rounded-full">
                                    <Feather name="x" size={20} color="#4b5563" />
                                </TouchableOpacity>
                            </View>

                            <View className="flex-col gap-4 pb-4">
                                <View>
                                    <Text className="text-sm font-medium text-gray-700 mb-1.5 ml-1">Item Name</Text>
                                    <TextInput
                                        className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-base text-gray-800"
                                        placeholder="e.g. Apples"
                                        value={item}
                                        onChangeText={setItem}
                                        placeholderTextColor="#9ca3af"
                                    />
                                </View>

                                <View className="flex-row gap-3">
                                    <View className="flex-1">
                                        <Text className="text-sm font-medium text-gray-700 mb-1.5 ml-1">Quantity</Text>
                                        <TextInput
                                            className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-base text-gray-800"
                                            placeholder="e.g. 2"
                                            value={quantity}
                                            onChangeText={setQuantity}
                                            keyboardType="decimal-pad"
                                            placeholderTextColor="#9ca3af"
                                        />
                                    </View>
                                    
                                    <View className="flex-[1.5]">
                                        <Text className="text-sm font-medium text-gray-700 mb-1.5 ml-1">Unit (Optional)</Text>
                                        <TextInput
                                            className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-base text-gray-800"
                                            placeholder="e.g. lbs, boxes"
                                            value={unit}
                                            onChangeText={setUnit}
                                            placeholderTextColor="#9ca3af"
                                        />
                                    </View>
                                </View>
                            </View>

                            <View className="flex-row mt-4 gap-3 pt-4 border-t border-gray-100">
                                <TouchableOpacity
                                    onPress={handleClose}
                                    className="flex-1 py-4 rounded-xl bg-gray-100 items-center justify-center"
                                >
                                    <Text className="text-gray-700 font-bold text-base">Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={confirm}
                                    className={`flex-1 py-4 rounded-xl items-center justify-center ${item.trim() ? 'bg-blue-600' : 'bg-blue-300'}`}
                                    disabled={!item.trim()}
                                >
                                    <Text className="text-white font-bold text-base">
                                        {shoppingItem ? "Update" : "Add"}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </KeyboardAvoidingView>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
}
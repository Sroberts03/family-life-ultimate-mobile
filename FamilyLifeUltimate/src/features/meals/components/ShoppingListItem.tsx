import { ShoppingListItem } from "../meal.types";
import { Text, View, Pressable, Touchable, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import ReanimatedSwipeable from "react-native-gesture-handler/ReanimatedSwipeable";

interface Props {
    shoppingItem: ShoppingListItem;
    onToggle?: (itemId: number) => void;
    onEdit: (itemId: number) => void;
    onDelete: (itemId: number) => void;
}

export default function ShoppingListItemCard({ shoppingItem, onToggle, onEdit, onDelete }: Props) {
    const renderRightActions = () => {
        return (
            <View className="flex-row items-center justify-center my-1.5 mr-4 ml-1">
                <TouchableOpacity
                    onPress={() => onEdit(shoppingItem.id)}
                    className="w-12 h-[60px] bg-blue-100 rounded-xl items-center justify-center mr-2"
                >
                    <Feather name="edit-2" size={20} color="#2563eb" />
                </TouchableOpacity>
                <TouchableOpacity 
                    onPress={() => onDelete(shoppingItem.id)}
                    className="w-12 h-[60px] bg-red-100 rounded-xl items-center justify-center"
                >
                    <Feather name="trash-2" size={20} color="#dc2626" />
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <ReanimatedSwipeable renderRightActions={renderRightActions} overshootRight={false} containerStyle={{ overflow: 'visible' }}>
            <Pressable 
                onPress={() => onToggle?.(shoppingItem.id)}
                className={`flex-row items-center justify-between mx-4 my-1.5 p-4 rounded-2xl border ${shoppingItem.purchased
                        ? 'bg-gray-50 border-gray-100'
                        : 'bg-white border-gray-100'
                    }`}
            >
                <View className="flex-row items-center flex-1">
                    <View className="mr-4">
                        {shoppingItem.purchased ? (
                            <Feather name="check-circle" size={24} color="#10b981" />
                        ) : (
                            <Feather name="circle" size={24} color="#d1d5db" />
                        )}
                    </View>
                    <View className="flex-1">
                        <Text
                            className={`text-[17px] font-medium ${shoppingItem.purchased ? 'text-gray-400 line-through' : 'text-gray-800'
                                }`}
                        >
                            {shoppingItem.item}
                        </Text>
                        {(shoppingItem.quantity > 0 || shoppingItem.unit) && (
                            <Text className={`text-[14px] mt-0.5 ${shoppingItem.purchased ? 'text-gray-400' : 'text-gray-500'}`}>
                                {shoppingItem.quantity > 0 ? shoppingItem.quantity : ''} {shoppingItem.unit}
                            </Text>
                        )}
                    </View>
                </View>
            </Pressable>
        </ReanimatedSwipeable>
    )
}
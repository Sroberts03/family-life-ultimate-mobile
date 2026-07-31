import { ShoppingListItem } from "../meal.types";
import { Text, View, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";

interface Props {
    shoppingItem: ShoppingListItem;
    onToggle?: (itemId: number) => void;
    onEdit?: (itemId: number) => void;
}

export default function ShoppingListItemCard({ shoppingItem, onToggle, onEdit }: Props) {
    return (
        <TouchableOpacity
            activeOpacity={0.7}
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
            <TouchableOpacity className="p-2 -mr-2 ml-2" onPress={() => onEdit?.(shoppingItem.id)}>
                <Feather name="more-horizontal" size={20} color="#9ca3af" />
            </TouchableOpacity>
        </TouchableOpacity>
    )
}
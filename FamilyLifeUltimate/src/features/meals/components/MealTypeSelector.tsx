import { View, Text, TouchableOpacity } from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { MealType } from "../meal.types";

interface MealTypeOption {
    label: string;
    value: MealType;
    icon: string;
    family: string;
}

interface MealTypeSelectorProps {
    mealType: MealType;
    setMealType: (type: MealType) => void;
    mealTypes: MealTypeOption[];
}

export const MealTypeSelector = ({ mealType, setMealType, mealTypes }: MealTypeSelectorProps) => (
    <View>
        <Text className="text-sm font-medium text-gray-700 mb-2 ml-1">Meal type</Text>
        <View className="flex-row flex-wrap justify-between gap-y-3">
            {mealTypes.map((type) => {
                const isSelected = mealType === type.value;
                return (
                    <TouchableOpacity
                        key={type.value}
                        onPress={() => setMealType(type.value)}
                        className={`w-[48%] py-3 rounded-xl border flex-row justify-center items-center gap-2 ${
                            isSelected
                                ? 'bg-blue-600 border-blue-600'
                                : 'bg-white border-gray-200'
                        }`}
                    >
                        {type.family === 'MaterialCommunityIcons' 
                            ? <MaterialCommunityIcons name={type.icon as any} size={16} color={isSelected ? '#ffffff' : '#374151'} />
                            : <Feather name={type.icon as any} size={16} color={isSelected ? '#ffffff' : '#374151'} />
                        }
                        <Text className={`font-medium ${isSelected ? 'text-white' : 'text-gray-700'}`}>
                            {type.label}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    </View>
);

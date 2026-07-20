import { Text, TouchableOpacity, View } from "react-native";
import { Feather } from "@expo/vector-icons";

interface MealManagerButtonProps {
    title: string;
    onPress: () => void;
    icon: keyof typeof Feather.glyphMap;
    buttonClassname?: string;
    textClassname?: string;
    visible?: boolean;
}

export default function MealManagerButton({ onPress, title, icon, buttonClassname, textClassname, visible = true }: MealManagerButtonProps) {
    if (!visible) return null;
    
    return (
        <TouchableOpacity
            className={`border border-gray-100 rounded-3xl p-4 mb-3 shadow-sm flex-row items-center justify-between ${buttonClassname}`}
            activeOpacity={0.7}
            onPress={onPress}
        >
            <View className="flex-row items-center flex-1 pr-4">
                <View
                    className="w-10 h-10 rounded-2xl items-center justify-center"
                    style={{ backgroundColor: `#0000ff15` }}
                >
                    <Feather name={icon} size={20} color="#0000ff" />
                </View>
                <View className="ml-3 flex-1">
                    <Text className={`font-bold text-slate-800 text-[15px] mb-0.5 ${textClassname}`} numberOfLines={1}>
                        {title}
                    </Text>
                </View>
            </View>
            <Feather name="chevron-right" size={20} color="#cbd5e1" />
        </TouchableOpacity>
    );
}
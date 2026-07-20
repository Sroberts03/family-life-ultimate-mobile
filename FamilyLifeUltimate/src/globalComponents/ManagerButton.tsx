import { Feather } from "@expo/vector-icons"
import { TouchableOpacity, Text, View } from "react-native"

interface ManagerButtonProps {
    title: string;
    subtitle?: string;
    onPress: () => void;
    icon: keyof typeof Feather.glyphMap;
    color?: string;
    bgColor?: string;
}

export default function ManagerButton({ title, subtitle, onPress, icon, color = "#6366f1", bgColor = "bg-white" }: ManagerButtonProps) {
    return (
        <TouchableOpacity 
            className={`border border-gray-100 rounded-3xl p-4 mb-3 shadow-sm flex-row items-center justify-between ${bgColor}`}
            activeOpacity={0.7}
            onPress={onPress}
        >
            <View className="flex-row items-center flex-1 pr-4">
                <View 
                    className="w-12 h-12 rounded-2xl items-center justify-center" 
                    style={{ backgroundColor: `${color}15` }}
                >
                    <Feather name={icon} size={22} color={color} />
                </View>
                <View className="ml-4 flex-1">
                    <Text className="font-bold text-slate-800 text-[17px] mb-0.5">
                        {title}
                    </Text>
                    {subtitle && (
                        <Text className="text-slate-500 text-sm leading-5">
                            {subtitle}
                        </Text>
                    )}
                </View>
            </View>
            <Feather name="chevron-right" size={20} color="#cbd5e1" />
        </TouchableOpacity>
    )
}
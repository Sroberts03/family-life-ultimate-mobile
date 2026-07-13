import { Feather } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";

interface CalendarHeaderProps {
    onMenuPress: () => void;
    onSearchPress: () => void;
    onCreateEventPress: () => void;
    onMonthPress: () => void;
    today: Date;
    showTodayButton: boolean;
    onTodayPress: () => void;
}

export default function CalendarHeader({ onMenuPress, onSearchPress, onCreateEventPress, onMonthPress, today, showTodayButton, onTodayPress }: CalendarHeaderProps) {
    return (
        <View className="flex-row items-center justify-between px-4 pb-2">
            <TouchableOpacity className="py-2 px-4 bg-white border border-neutral-100 rounded-full flex-row items-center gap-2" onPress={onMonthPress}>
                <Feather name="chevron-left" size={24} color="#000000" />
                <Text className="text-lg font-semibold">{today.toLocaleDateString("en-US", { month: "long" })}</Text>
            </TouchableOpacity>
            <View className="py-2 px-4 bg-white border border-neutral-100 rounded-full flex-row items-center gap-2">
                <TouchableOpacity className="p-2" onPress={onMenuPress}>
                    <Feather name="menu" size={18} color="#000000" />
                </TouchableOpacity>
                <TouchableOpacity className="p-2" onPress={onSearchPress}>
                    <Feather name="search" size={18} color="#000000" />
                </TouchableOpacity>
                <TouchableOpacity className="p-2" onPress={onCreateEventPress}>
                    <Feather name="plus" size={18} color="#000000" />
                </TouchableOpacity>
                {showTodayButton && (
                    <TouchableOpacity className="p-2" onPress={onTodayPress}>
                        
                        <Text className="text-sm font-semibold">Today</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}
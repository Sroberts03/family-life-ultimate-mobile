import { Feather } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface DayListProps {
    dateBeingViewed: Date;
    setDateBeingViewed: (date: Date) => void;
    today: Date;
}

export default function DayList({ dateBeingViewed, setDateBeingViewed, today }: DayListProps) {
    const [ dayList, setDayList ] = useState<Date[]>([]);

    useEffect(() => {
        const days = [];
        const lastSunday = new Date(dateBeingViewed.getTime() - dateBeingViewed.getDay() * 24 * 60 * 60 * 1000);
        for (let i = 0; i < 7; i++) {
            days.push(new Date(lastSunday.getTime() + i * 24 * 60 * 60 * 1000));
        }
        setDayList(days);
    }, [dateBeingViewed]);

    const weekForwardClicked = () => {
        setDateBeingViewed(new Date(dateBeingViewed.getTime() + 7 * 24 * 60 * 60 * 1000));
    };

    const weekBackwardClicked = () => {
        setDateBeingViewed(new Date(dateBeingViewed.getTime() - 7 * 24 * 60 * 60 * 1000));
    };

    return (
        <View className="bg-background border-b border-gray-200 flex-row justify-between items-center px-4 py-2">
            <TouchableOpacity onPress={weekBackwardClicked}>
                <Feather name="chevron-left" size={24} color="#6B7280" />
            </TouchableOpacity>
            {dayList.map((day) => (
                <TouchableOpacity
                    key={day.toISOString()}
                    className={`flex-1 items-center p-2`}
                    onPress={() => setDateBeingViewed(day)}
                >
                    <Text
                        className="text-sm font-semibold"
                        style={{
                            color: day.toDateString() === dateBeingViewed.toDateString()
                                ? day.toDateString() === today.toDateString()
                                    ? "#ff0000ff"
                                    : "#3B82F6"
                                : "#6B7280"
                        }}
                    >
                        {day.toLocaleDateString("en-US", { weekday: "short" })}
                    </Text>
                    <Text
                        className="text-lg font-semibold"
                        style={{
                            color: day.toDateString() === dateBeingViewed.toDateString()
                                ? day.toDateString() === today.toDateString()
                                    ? "#ff0000ff"
                                    : "#3B82F6"
                                : "#6B7280"
                        }}
                    >
                        {day.toLocaleDateString("en-US", { day: "numeric" })}
                    </Text>
                </TouchableOpacity>
            ))}
            <TouchableOpacity onPress={weekForwardClicked}>
                <Feather name="chevron-right" size={24} color="#6B7280" />
            </TouchableOpacity>
        </View>
    );
}
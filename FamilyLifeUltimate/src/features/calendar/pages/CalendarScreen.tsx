import { useAuth } from "@/src/features/auth/AuthContext";
import { useEffect, useState } from "react";
import { Button, Text, TouchableOpacity, View } from "react-native";
import { Calendar, Timeline } from "react-native-calendars";
import CalendarHeader from "../components/CalendarHeader";
import DayList from "../components/DayList";

export default function CalendarScreen() {
    const today = new Date();
    const { user, session } = useAuth();
    const [view, setView] = useState<"day" | "multiDay" | "month" | "list">("day");
    const [dateBeingViewed, setDateBeingViewed] = useState<Date>(new Date());
    const [showTodayButton, setShowTodayButton] = useState<boolean>(false);

    if (!user || !session) return null;

    const todayPress = () => {
        setDateBeingViewed(today);
        setShowTodayButton(false);
    }

    const onDateBeingViewedChange = (date: Date) => {
        setDateBeingViewed(date);
        if (date.toDateString() === today.toDateString()) {
            setShowTodayButton(false);
        } else {
            setShowTodayButton(true);
        }
    }

    const toggleMonthView = () => {
        setView(view === "month" ? "day" : "month");
    }

    return (
        <View className="flex-1 bg-background">
            <CalendarHeader
                onMenuPress={() => { }}
                onSearchPress={() => { }}
                onMonthPress={toggleMonthView}
                onCreateEventPress={() => { }}
                today={today}
                showTodayButton={showTodayButton}
                onTodayPress={todayPress}
            />
            <DayList
                dateBeingViewed={dateBeingViewed}
                setDateBeingViewed={onDateBeingViewedChange}
                today={today}
            />
        </View>
    );
}
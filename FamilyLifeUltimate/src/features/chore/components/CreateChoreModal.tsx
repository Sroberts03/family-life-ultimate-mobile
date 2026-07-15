import React, { useState, useEffect } from "react";
import { 
    View, 
    Text, 
    Modal, 
    TextInput, 
    TouchableOpacity, 
    KeyboardAvoidingView, 
    Platform,
    ScrollView,
    TouchableWithoutFeedback,
    Keyboard
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { Calendar } from "react-native-calendars";
import { toLocalDateString } from "../pages/MainChoreScreen";

interface Props {
    visible: boolean;
    onClose: () => void;
    onSubmit?: (name: string, description: string, recurring: string, startDate: string, endDate: string) => void;
    onUpdate?: (choreId: number, name: string, description: string, recurring: string, startDate: string, endDate: string) => void;
    choreName?: string;
    choreDescription?: string;
    choreRecurring?: string;
    choreStartDate?: string;
    choreEndDate?: string;
    choreId?: number;
    isUpdate?: boolean;
}

function choreDataValidation (name: string, description: string, recurring: string, startDate: string, endDate: string) {
    if (!name) {
        throw new Error("Please enter a chore name.");
    }
    if (!description) {
        throw new Error("Please enter a chore description.");
    }
    if (!recurring) {
        throw new Error("Please select a chore frequency.");
    }
    if (!startDate) {
        throw new Error("Please select a chore start date.");
    }
    if (endDate && startDate > endDate) {
        throw new Error("Start date must be before end date.");
    }
}

function setRecurring(recurring: string, days?: string[], monthDay?: number) {
    switch (recurring) {
        case "D":
            return "D";
        case "W":
            return `W:${days?.join(",")}`;
        case "M":
            if (days && days.length > 0) {
                return `M:${monthDay}:${days?.join(",")}`;
            }
            return `M:${monthDay}`;
        case "Y":
            return "Y";
        default:
            return "O";
    }
}

function parseChoreRecurring(choreRecurring?: string) {
    let recurring = "D";
    let days: string[] = [];
    let monthDayStr = "1";
    let monthlyType: "date" | "day" = "date";
    let monthlyOrdinal = 1;
    let monthlyDay = "Sun";

    if (!choreRecurring) return { recurring, days, monthDayStr, monthlyType, monthlyOrdinal, monthlyDay };

    const parts = choreRecurring.split(":");
    recurring = parts[0];

    if (recurring === "W" && parts.length > 1) {
        days = parts[1].split(",");
    } else if (recurring === "M" && parts.length > 1) {
        if (parts.length > 2) {
            monthlyType = "day";
            monthlyOrdinal = parseInt(parts[1], 10) || 1;
            monthlyDay = parts[2];
        } else {
            monthlyType = "date";
            monthDayStr = parts[1];
        }
    }

    return { recurring, days, monthDayStr, monthlyType, monthlyOrdinal, monthlyDay };
}

const RECURRING_OPTIONS = [
    { label: "One Time", value: "O" },
    { label: "Daily", value: "D" },
    { label: "Weekly", value: "W" },
    { label: "Monthly", value: "M" },
    { label: "Yearly", value: "Y" }
];

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function CreateChoreModal({ visible, onClose, onSubmit, onUpdate, choreName, choreDescription, choreRecurring, choreStartDate, choreEndDate, choreId, isUpdate }: Props) {
    const [name, setName] = useState<string>(choreName || "");
    const [description, setDescription] = useState<string>(choreDescription || "");
    
    // Dates
    const [startDate, setStartDate] = useState<string>(choreStartDate || toLocalDateString(new Date()));
    const [endDate, setEndDate] = useState<string>(choreEndDate || "");
    const [activeDatePicker, setActiveDatePicker] = useState<"start" | "end" | null>(null);
    
    // Recurring
    const initialRecurring = parseChoreRecurring(choreRecurring);
    const [recurring, setRecurringState] = useState<string>(initialRecurring.recurring);
    const [days, setDays] = useState<string[]>(initialRecurring.days);
    const [monthDayStr, setMonthDayStr] = useState<string>(initialRecurring.monthDayStr);
    const [monthlyType, setMonthlyType] = useState<"date" | "day">(initialRecurring.monthlyType);
    const [monthlyOrdinal, setMonthlyOrdinal] = useState<number>(initialRecurring.monthlyOrdinal);
    const [monthlyDay, setMonthlyDay] = useState<string>(initialRecurring.monthlyDay);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        if (visible) {
            setName(choreName || "");
            setDescription(choreDescription || "");
            setStartDate(choreStartDate || toLocalDateString(new Date()));
            setEndDate(choreEndDate || "");
            
            const parsed = parseChoreRecurring(choreRecurring);
            setRecurringState(parsed.recurring);
            setDays(parsed.days);
            setMonthDayStr(parsed.monthDayStr);
            setMonthlyType(parsed.monthlyType);
            setMonthlyOrdinal(parsed.monthlyOrdinal);
            setMonthlyDay(parsed.monthlyDay);
            
            setError("");
        }
    }, [visible, choreId, choreName, choreDescription, choreRecurring, choreStartDate, choreEndDate]);

    const resetForm = () => {
        setName("");
        setDescription("");
        setStartDate(toLocalDateString(new Date()));
        setEndDate("");
        setRecurringState("D");
        setDays([]);
        setMonthDayStr("1");
        setMonthlyType("date");
        setMonthlyOrdinal(1);
        setMonthlyDay("Sun");
        setActiveDatePicker(null);
        setError("");
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const handleSubmit = () => {
        if (!name.trim()) return;

        let finalMonthDay = 1;
        let finalDays: string[] | undefined = undefined;

        if (recurring === "M") {
            if (monthlyType === "date") {
                let num = parseInt(monthDayStr, 10);
                finalMonthDay = (!isNaN(num) && num >= 1 && num <= 31) ? num : 1;
            } else {
                finalMonthDay = monthlyOrdinal;
                finalDays = [monthlyDay];
            }
        } else if (recurring === "W") {
            finalDays = days.length > 0 ? days : undefined;
        }

        const recurringString = setRecurring(recurring, finalDays, finalMonthDay);
        
        // Use endDate or startDate if endDate is omitted, depending on requirements. 
        // We'll pass whatever the user set.
        try {
            choreDataValidation(name, description, recurringString, startDate, endDate);
        } catch (e) {
            setError(e instanceof Error ? e.message : "Failed to create chore");
            return;
        }
        if (isUpdate && onUpdate) {
            onUpdate(choreId!, name, description, recurringString, startDate, endDate);
        } else if (onSubmit) {
            onSubmit(name, description, recurringString, startDate, endDate);
        }
        resetForm();
        onClose();
    };

    const toggleDay = (day: string) => {
        if (days.includes(day)) {
            setDays(days.filter(d => d !== day));
        } else {
            setDays([...days, day]);
        }
    };

    // Render Calendar if a date picker is active
    if (activeDatePicker) {
        return (
            <Modal transparent={true} visible={true} animationType="fade">
                <View className="flex-1 justify-center items-center bg-black/50 px-4">
                    <View className="bg-white rounded-3xl w-full overflow-hidden">
                        <View className="bg-gray-50 px-6 py-4 flex-row justify-between items-center border-b border-gray-100">
                            <Text className="text-lg font-bold text-gray-800">
                                Select {activeDatePicker === "start" ? "Start Date" : "End Date"}
                            </Text>
                            <TouchableOpacity onPress={() => setActiveDatePicker(null)}>
                                <Feather name="x" size={24} color="#4b5563" />
                            </TouchableOpacity>
                        </View>
                        <Calendar
                            onDayPress={(day: any) => {
                                if (activeDatePicker === "start") {
                                    setStartDate(day.dateString);
                                } else {
                                    setEndDate(day.dateString);
                                }
                                setActiveDatePicker(null);
                            }}
                            markedDates={{
                                [activeDatePicker === "start" ? startDate : endDate]: {
                                    selected: true,
                                    selectedColor: "#2563eb"
                                }
                            }}
                            theme={{
                                todayTextColor: '#2563eb',
                                arrowColor: '#2563eb',
                            }}
                        />
                    </View>
                </View>
            </Modal>
        );
    }

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="slide"
            onRequestClose={handleClose}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View className="flex-1 justify-end bg-black/50">
                    <KeyboardAvoidingView
                        behavior={Platform.OS === "ios" ? "padding" : "height"}
                        className="w-full"
                    >
                        <View className="bg-white rounded-t-3xl p-6 w-full max-h-[90vh]">
                            <View className="flex-row justify-between items-center mb-6">
                                <Text className="text-2xl font-bold text-gray-800">New Chore</Text>
                                <TouchableOpacity onPress={handleClose} className="p-2 bg-gray-100 rounded-full">
                                    <Feather name="x" size={20} color="#4b5563" />
                                </TouchableOpacity>
                            </View>

                            <ScrollView showsVerticalScrollIndicator={false}>
                                <View className="flex-col gap-5 pb-8">
                                    {error && <Text className="text-red-500 text-center mb-2">{error}</Text>}
                                    {/* Name Input */}
                                    <View>
                                        <Text className="text-sm font-medium text-gray-700 mb-1.5 ml-1">Chore Name</Text>
                                        <TextInput
                                            className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-base text-gray-800"
                                            placeholder="e.g. Wash the dishes"
                                            value={name}
                                            onChangeText={setName}
                                            placeholderTextColor="#9ca3af"
                                        />
                                    </View>

                                    {/* Description Input */}
                                    <View>
                                        <Text className="text-sm font-medium text-gray-700 mb-1.5 ml-1">Description (Optional)</Text>
                                        <TextInput
                                            className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-base text-gray-800 h-24"
                                            placeholder="Any specific details?"
                                            value={description}
                                            onChangeText={setDescription}
                                            multiline
                                            textAlignVertical="top"
                                            placeholderTextColor="#9ca3af"
                                        />
                                    </View>

                                    {/* Dates */}
                                    <View className="flex-row gap-3">
                                        <View className="flex-1">
                                            <Text className="text-sm font-medium text-gray-700 mb-1.5 ml-1">Start Date</Text>
                                            <TouchableOpacity 
                                                className="flex-row items-center bg-gray-50 border border-gray-200 rounded-xl px-4 h-14"
                                                onPress={() => setActiveDatePicker("start")}
                                            >
                                                <Feather name="calendar" size={18} color="#6b7280" />
                                                <Text className="ml-2 text-base text-gray-800">
                                                    {startDate || "YYYY-MM-DD"}
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                        <View className="flex-1">
                                            <Text className="text-sm font-medium text-gray-700 mb-1.5 ml-1">End Date (Opt)</Text>
                                            <TouchableOpacity 
                                                className="flex-row items-center bg-gray-50 border border-gray-200 rounded-xl px-4 h-14"
                                                onPress={() => setActiveDatePicker("end")}
                                            >
                                                <Feather name="calendar" size={18} color="#6b7280" />
                                                <Text className={`ml-2 text-base ${endDate ? 'text-gray-800' : 'text-gray-400'}`}>
                                                    {endDate || "YYYY-MM-DD"}
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>

                                    {/* Recurring Options */}
                                    <View>
                                        <Text className="text-sm font-medium text-gray-700 mb-2 ml-1">Repeat</Text>
                                        <View className="flex-row flex-wrap gap-2">
                                            {RECURRING_OPTIONS.map((option) => (
                                                <TouchableOpacity
                                                    key={option.value}
                                                    onPress={() => {
                                                        setRecurringState(option.value);
                                                        setDays([]); // Reset days when switching types
                                                    }}
                                                    className={`px-5 py-2.5 rounded-full border ${
                                                        recurring === option.value 
                                                            ? "bg-blue-600 border-blue-600" 
                                                            : "bg-white border-gray-300"
                                                    }`}
                                                >
                                                    <Text className={`text-sm font-semibold ${
                                                        recurring === option.value ? "text-white" : "text-gray-600"
                                                    }`}>
                                                        {option.label}
                                                    </Text>
                                                </TouchableOpacity>
                                            ))}
                                        </View>
                                    </View>

                                    {/* Weekly Days Selection */}
                                    {recurring === "W" && (
                                        <View className="bg-gray-50 p-4 rounded-xl border border-gray-100 mt-1">
                                            <Text className="text-sm font-medium text-gray-700 mb-3">Select Days</Text>
                                            <View className="flex-row justify-between">
                                                {WEEKDAYS.map((day) => {
                                                    const isSelected = days.includes(day);
                                                    return (
                                                        <TouchableOpacity
                                                            key={day}
                                                            onPress={() => toggleDay(day)}
                                                            className={`w-10 h-10 rounded-full items-center justify-center border ${
                                                                isSelected 
                                                                    ? "bg-blue-500 border-blue-600" 
                                                                    : "bg-white border-gray-300"
                                                            }`}
                                                        >
                                                            <Text className={`text-xs font-bold ${
                                                                isSelected ? "text-white" : "text-gray-600"
                                                            }`}>
                                                                {day.charAt(0)}
                                                            </Text>
                                                        </TouchableOpacity>
                                                    );
                                                })}
                                            </View>
                                        </View>
                                    )}

                                    {/* Monthly Day Selection */}
                                    {recurring === "M" && (
                                        <View className="bg-gray-50 p-4 rounded-xl border border-gray-100 mt-1">
                                            <View className="flex-row bg-gray-200 p-1 rounded-xl mb-4">
                                                <TouchableOpacity 
                                                    onPress={() => setMonthlyType("date")}
                                                    className={`flex-1 py-2 items-center rounded-lg ${monthlyType === 'date' ? 'bg-white' : ''}`}
                                                >
                                                    <Text className={`text-sm font-semibold ${monthlyType === 'date' ? 'text-gray-800' : 'text-gray-500'}`}>By Date</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity 
                                                    onPress={() => setMonthlyType("day")}
                                                    className={`flex-1 py-2 items-center rounded-lg ${monthlyType === 'day' ? 'bg-white' : ''}`}
                                                >
                                                    <Text className={`text-sm font-semibold ${monthlyType === 'day' ? 'text-gray-800' : 'text-gray-500'}`}>By Day</Text>
                                                </TouchableOpacity>
                                            </View>

                                            {monthlyType === "date" ? (
                                                <View>
                                                    <Text className="text-sm font-medium text-gray-700 mb-2">Day of the Month (1-31)</Text>
                                                    <TextInput
                                                        className="bg-white border border-gray-300 rounded-xl px-4 py-3.5 text-base text-gray-800"
                                                        keyboardType="number-pad"
                                                        placeholder="e.g. 15"
                                                        value={monthDayStr}
                                                        onChangeText={setMonthDayStr}
                                                        placeholderTextColor="#9ca3af"
                                                    />
                                                </View>
                                            ) : (
                                                <View className="gap-4">
                                                    <View>
                                                        <Text className="text-sm font-medium text-gray-700 mb-2">Week of the Month</Text>
                                                        <View className="flex-row justify-between">
                                                            {[{l: '1st', v: 1}, {l: '2nd', v: 2}, {l: '3rd', v: 3}, {l: '4th', v: 4}, {l: 'Last', v: -1}].map((ord) => (
                                                                <TouchableOpacity
                                                                    key={ord.v}
                                                                    onPress={() => setMonthlyOrdinal(ord.v)}
                                                                    className={`px-3 py-2 rounded-lg border ${monthlyOrdinal === ord.v ? 'bg-blue-500 border-blue-600' : 'bg-white border-gray-300'}`}
                                                                >
                                                                    <Text className={`text-xs font-bold ${monthlyOrdinal === ord.v ? 'text-white' : 'text-gray-600'}`}>{ord.l}</Text>
                                                                </TouchableOpacity>
                                                            ))}
                                                        </View>
                                                    </View>
                                                    <View>
                                                        <Text className="text-sm font-medium text-gray-700 mb-2">Day of the Week</Text>
                                                        <View className="flex-row justify-between">
                                                            {WEEKDAYS.map((day) => (
                                                                <TouchableOpacity
                                                                    key={day}
                                                                    onPress={() => setMonthlyDay(day)}
                                                                    className={`w-10 h-10 rounded-full items-center justify-center border ${monthlyDay === day ? 'bg-blue-500 border-blue-600' : 'bg-white border-gray-300'}`}
                                                                >
                                                                    <Text className={`text-xs font-bold ${monthlyDay === day ? 'text-white' : 'text-gray-600'}`}>{day.charAt(0)}</Text>
                                                                </TouchableOpacity>
                                                            ))}
                                                        </View>
                                                    </View>
                                                </View>
                                            )}
                                        </View>
                                    )}
                                </View>
                            </ScrollView>

                            <View className="flex-row mt-2 gap-3 pt-4 border-t border-gray-100">
                                <TouchableOpacity
                                    onPress={handleClose}
                                    className="flex-1 py-4 rounded-xl bg-gray-100 items-center justify-center"
                                >
                                    <Text className="text-gray-700 font-bold text-base">Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={handleSubmit}
                                    className={`flex-1 py-4 rounded-xl items-center justify-center ${name.trim() ? 'bg-blue-600' : 'bg-blue-300'}`}
                                    disabled={!name.trim()}
                                >
                                    <Text className="text-white font-bold text-base">{isUpdate? "Update": "Create"}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </KeyboardAvoidingView>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
}
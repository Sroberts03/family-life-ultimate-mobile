import { View, Text } from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker';
import { Feather } from "@expo/vector-icons";

interface TimePickerSelectorProps {
    time: Date;
    setTime: (time: Date) => void;
}

export const TimePickerSelector = ({ time, setTime }: TimePickerSelectorProps) => (
    <View>
        <Text className="text-sm font-medium text-gray-700 mb-2 ml-1">Time</Text>
        <View className="flex-row items-center justify-between bg-white border border-gray-200 rounded-xl pl-4 pr-3 py-2 w-full">
            <View className="flex-row items-center">
                <Feather name="clock" size={18} color="#6b7280" className="mr-3" />
                <Text className="text-gray-700 font-medium text-[15px]">Select time</Text>
            </View>
            <DateTimePicker
                value={time}
                mode="time"
                display="default"
                onChange={(event, selectedDate) => {
                    if (selectedDate) setTime(selectedDate);
                }}
                style={{ alignSelf: 'center' }}
            />
        </View>
    </View>
);

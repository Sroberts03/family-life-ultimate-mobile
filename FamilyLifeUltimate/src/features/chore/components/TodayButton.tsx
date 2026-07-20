import { Text, TouchableOpacity } from "react-native";

interface TodayButtonProps {
    buttonClassname?: string;
    textClassname?: string;
    visible: boolean;
    setDate: (date: Date) => void;
    setToday: (today: Date) => void;
}

export default function TodayButton({ buttonClassname, textClassname, visible, setDate, setToday }: TodayButtonProps) {
    if (!visible) return null;

    const todayPressed = () => {
        const now = new Date();
        setToday(now);
        setDate(now);
    }

    return (
        <TouchableOpacity
            onPress={todayPressed}
            className={buttonClassname}
        >
            <Text className={textClassname}>Today</Text>
        </TouchableOpacity>
    );
}
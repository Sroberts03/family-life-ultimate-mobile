import { Text, TouchableOpacity } from "react-native";

interface TodayButtonProps {
    buttonClassname?: string;
    textClassname?: string;
    visible: boolean;
    onPress: () => void;
}

export default function TodayButton({ buttonClassname, textClassname, visible, onPress }: TodayButtonProps) {
    if (!visible) return null;

    return (
        <TouchableOpacity
            onPress={onPress}
            className={buttonClassname}
        >
            <Text className={textClassname}>Today</Text>
        </TouchableOpacity>
    );
}
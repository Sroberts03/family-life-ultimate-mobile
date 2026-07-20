import { Feather } from "@expo/vector-icons";
import { TouchableOpacity, View } from "react-native";

interface AddButtonProps {
    onPress: () => void;
    containerClassname?: string;
    isVisible?: boolean;
}

export default function AddButton({ onPress, containerClassname, isVisible }: AddButtonProps) {
    if (!isVisible) {
        return null;
    }
    return (
        <TouchableOpacity onPress={onPress} className={containerClassname}>
            <Feather 
                name="plus"
                size={24}
                color="#000000"
            />
        </TouchableOpacity>
    );
}
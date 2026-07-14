import { Feather } from "@expo/vector-icons";
import { TouchableOpacity, View } from "react-native";

interface AddButtonProps {
    onPress: () => void;
    containerClassname?: string;
}

export default function AddButton({ onPress, containerClassname }: AddButtonProps) {
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
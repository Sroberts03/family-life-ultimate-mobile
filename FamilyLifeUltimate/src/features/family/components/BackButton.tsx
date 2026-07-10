import { Feather } from "@expo/vector-icons";
import { TouchableOpacity, View } from "react-native";
import { router } from "expo-router";

interface Props {
    className?: string;
}
export default function BackButton({ className }: Props) {
    return (
        <TouchableOpacity onPress={() => router.back()} className={className}>
            <Feather name="chevron-left" size={20} color="#000000ff" />
        </TouchableOpacity>
    );
}
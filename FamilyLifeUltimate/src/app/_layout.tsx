import "../../global.css";
import Login from "./(auth)/Login";
import { SafeAreaView } from "react-native-safe-area-context";

export default function _layout() {
    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <Login />
        </SafeAreaView>
    )
}
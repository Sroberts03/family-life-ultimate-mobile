import { View } from "react-native";

export default function Index() {
    // This file is required by Expo Router to resolve the root "/" route.
    // The actual routing logic is handled by the useEffect in _layout.tsx
    return <View className="flex-1 bg-white" />;
}

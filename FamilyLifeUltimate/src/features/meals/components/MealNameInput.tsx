import { View, Text, TextInput } from "react-native";

interface MealNameInputProps {
    name: string;
    setName: (name: string) => void;
}

export const MealNameInput = ({ name, setName }: MealNameInputProps) => (
    <View>
        <Text className="text-sm font-medium text-gray-700 mb-2 ml-1">Meal name</Text>
        <TextInput
            className="bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-base text-gray-800"
            placeholder="Taco Tuesday"
            value={name}
            onChangeText={setName}
            placeholderTextColor="#9ca3af"
        />
    </View>
);

import { View, Text, TextInput, TouchableOpacity, ScrollView } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Recipe } from "../meal.types";

interface RecipeSearchPickerProps {
    recipeId: number | undefined;
    setRecipeId: (id: number | undefined) => void;
    recipes: Recipe[];
    recipeSearchQuery: string;
    setRecipeSearchQuery: (query: string) => void;
}

export const RecipeSearchPicker = ({ recipeId, setRecipeId, recipes, recipeSearchQuery, setRecipeSearchQuery }: RecipeSearchPickerProps) => {
    const deleteQuery = () => {
        setRecipeSearchQuery("");
        setRecipeId(undefined);
    }

    return (
        <View>
            <Text className="text-sm font-medium text-gray-700 mb-2 ml-1">Recipe (optional)</Text>

            {recipeId ? (
                <View className="flex-row items-center justify-between bg-blue-50 border border-blue-200 rounded-xl px-4 py-3.5">
                    <View className="flex-row items-center">
                        <Feather name="check-circle" size={18} color="#2563eb" className="mr-2" />
                        <Text className="text-blue-700 font-medium">{recipes.find((r) => r.id === recipeId)?.name || 'Selected Recipe'}</Text>
                    </View>
                    <TouchableOpacity onPress={() => {
                        setRecipeId(undefined);
                        setRecipeSearchQuery("");
                    }}>
                        <Feather name="x" size={18} color="#60a5fa" />
                    </TouchableOpacity>
                </View>
            ) : (
                <View>
                    <View className="flex-row items-center bg-white border border-gray-200 rounded-xl px-4 py-3 mb-2">
                        <View className="flex-1 flex-row items-center">
                            <Feather name="search" size={18} color="#9ca3af" className="mr-2" />
                            <TextInput
                                className="flex-1 text-base text-gray-800"
                                onChangeText={setRecipeSearchQuery}
                                placeholder="Search for recipes..."
                                value={recipeSearchQuery}
                                placeholderTextColor="#9ca3af"
                            />
                        </View>
                        {recipeSearchQuery.trim() !== "" && (
                            <TouchableOpacity onPress={deleteQuery} className="ml-2">
                                <Feather name="x" size={18} color="#000000ff" />
                            </TouchableOpacity>
                        )}
                    </View>

                    {recipeSearchQuery.trim() !== "" && (
                        recipes.length > 0 ? (
                            <ScrollView className="max-h-36 bg-white border border-gray-200 rounded-xl" nestedScrollEnabled>
                                {recipes.map((r, index) => (
                                    <TouchableOpacity
                                        key={r.id}
                                        onPress={() => {
                                            setRecipeId(r.id);
                                        }}
                                        className={`px-4 py-3 flex-row items-center ${index < recipes.length - 1 ? 'border-b border-gray-100' : ''}`}
                                    >
                                        <Text className="text-gray-700 font-medium">{r.name}</Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        ) : (
                            <Text className="text-gray-500 text-sm ml-1 italic mt-1">No recipes found.</Text>
                        )
                    )}
                </View>
            )}
        </View>
    )
};

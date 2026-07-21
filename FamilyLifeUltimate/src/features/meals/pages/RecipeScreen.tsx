import { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Recipe } from "../meal.types";
import { useAuth } from "../../auth/AuthContext";
import { fetchRecipeDetail } from "../services/meal.service";
import ErrorLoading from "@/src/globalComponents/ErrorLoading";
import BackButton from "@/src/globalComponents/BackButton";

interface Props {
    recipeId: number;
}

export default function RecipeScreen({ recipeId }: Props) {
    const { user, session } = useAuth();
    const [recipe, setRecipe] = useState<Recipe | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>("");

    async function loadRecipe() {
        if (!user || !session) return;
        setLoading(true);
        setError("");
        try {
            const fetchedRecipe = await fetchRecipeDetail(recipeId, session);
            setRecipe(fetchedRecipe);
        } catch (e) {
            setError(e instanceof Error ? e.message : "Failed to load recipe");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadRecipe();
    }, [recipeId]);

    // Sort instructions by stepOrder
    const sortedInstructions = recipe?.instructions
        ? [...recipe.instructions].sort((a, b) => a.stepOrder - b.stepOrder)
        : [];

    return (
        <View className="flex-1 bg-background">
            {/* Header / Back Navigation */}
            <View className="px-4 py-3 flex-row items-center border-b border-slate-200 dark:border-slate-800 bg-background dark:bg-slate-900 z-10">
                <BackButton />
                <Text className="text-lg font-bold text-slate-900 dark:text-white ml-3 flex-1" numberOfLines={1}>
                    {recipe?.name || "Loading Recipe..."}
                </Text>
            </View>

            <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 40 }}>
                {error || loading ? (
                    <View className="p-6 mt-10">
                        <ErrorLoading error={error} loading={loading} />
                    </View>
                ) : recipe ? (
                    <>
                        {/* Title and Description Section */}
                        <View className="bg-white dark:bg-slate-900 px-6 pt-6 pb-8 border-b border-slate-200 dark:border-slate-800">
                            {recipe.description ? (
                                <Text className="text-base text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                                    {recipe.description}
                                </Text>
                            ) : null}

                            {/* Meta Data Cards */}
                            <View className="flex-row justify-between">
                                <View className="flex-1 bg-slate-50 dark:bg-slate-800 rounded-2xl p-4 mr-2 items-center border border-slate-100 dark:border-slate-700">
                                    <Ionicons name="time-outline" size={24} color="#3b82f6" />
                                    <Text className="text-xs text-slate-500 dark:text-slate-400 mt-2 font-medium uppercase tracking-wider">Prep Time</Text>
                                    <Text className="text-lg font-bold text-slate-900 dark:text-white mt-1">{recipe.prepTime}m</Text>
                                </View>
                                <View className="flex-1 bg-slate-50 dark:bg-slate-800 rounded-2xl p-4 mx-1 items-center border border-slate-100 dark:border-slate-700">
                                    <Ionicons name="flame-outline" size={24} color="#ef4444" />
                                    <Text className="text-xs text-slate-500 dark:text-slate-400 mt-2 font-medium uppercase tracking-wider">Cook Time</Text>
                                    <Text className="text-lg font-bold text-slate-900 dark:text-white mt-1">{recipe.cookTime}m</Text>
                                </View>
                                <View className="flex-1 bg-slate-50 dark:bg-slate-800 rounded-2xl p-4 ml-2 items-center border border-slate-100 dark:border-slate-700">
                                    <Ionicons name="people-outline" size={24} color="#10b981" />
                                    <Text className="text-xs text-slate-500 dark:text-slate-400 mt-2 font-medium uppercase tracking-wider">Servings</Text>
                                    <Text className="text-lg font-bold text-slate-900 dark:text-white mt-1">{recipe.servings}</Text>
                                </View>
                            </View>
                        </View>

                        {/* Ingredients Section */}
                        <View className="mt-6 px-6">
                            <Text className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                                Ingredients
                            </Text>
                            <View className="bg-white dark:bg-slate-900 rounded-2xl p-2 shadow-sm border border-slate-200 dark:border-slate-800">
                                {recipe.ingredients && recipe.ingredients.length > 0 ? (
                                    recipe.ingredients.map((ingredient, index) => (
                                        <View
                                            key={ingredient.id}
                                            className={`flex-row items-center py-4 px-4 ${
                                                index !== recipe.ingredients.length - 1
                                                    ? 'border-b border-slate-100 dark:border-slate-800'
                                                    : ''
                                            }`}
                                        >
                                            <View className="h-8 w-8 rounded-full bg-blue-50 dark:bg-blue-900/30 items-center justify-center mr-4">
                                                <Ionicons name="ellipse" size={8} color="#3b82f6" />
                                            </View>
                                            <Text className="flex-1 text-base font-medium text-slate-800 dark:text-slate-200">
                                                {ingredient.name}
                                            </Text>
                                            <Text className="text-base text-slate-500 dark:text-slate-400 font-semibold">
                                                {ingredient.quantity} {ingredient.unit}
                                            </Text>
                                        </View>
                                    ))
                                ) : (
                                    <View className="py-8 items-center">
                                        <Text className="text-slate-400">No ingredients listed.</Text>
                                    </View>
                                )}
                            </View>
                        </View>

                        {/* Instructions Section */}
                        <View className="mt-8 px-6">
                            <Text className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                                Instructions
                            </Text>
                            {sortedInstructions.length > 0 ? (
                                sortedInstructions.map((step, index) => (
                                    <View key={step.id} className="mb-6 flex-row">
                                        <View className="mr-4 items-center">
                                            <View className="h-8 w-8 rounded-full bg-blue-600 items-center justify-center z-10 shadow-sm shadow-blue-200 dark:shadow-none">
                                                <Text className="text-white font-bold text-sm">
                                                    {step.stepOrder}
                                                </Text>
                                            </View>
                                            {index !== sortedInstructions.length - 1 && (
                                                <View className="w-0.5 bg-blue-100 dark:bg-slate-800 flex-1 -my-2" />
                                            )}
                                        </View>
                                        <View className="flex-1 bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-200 dark:border-slate-800">
                                            <Text className="text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                                                {step.instruction}
                                            </Text>
                                        </View>
                                    </View>
                                ))
                            ) : (
                                <View className="bg-white dark:bg-slate-900 rounded-2xl p-8 items-center border border-slate-200 dark:border-slate-800">
                                    <Text className="text-slate-400">No instructions listed.</Text>
                                </View>
                            )}
                        </View>
                    </>
                ) : null}
            </ScrollView>
        </View>
    );
}
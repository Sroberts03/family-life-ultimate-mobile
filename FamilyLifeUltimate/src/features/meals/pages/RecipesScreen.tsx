import { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { Recipe } from "../meal.types";
import { fetchRecipes } from "../services/meal.service";
import { useAuth } from "../../auth/AuthContext";
import ScreenHeader from "@/src/globalComponents/ScreenHeader";
import BackButton from "@/src/globalComponents/BackButton";
import ErrorLoading from "@/src/globalComponents/ErrorLoading";
import AddButton from "@/src/globalComponents/AddButton";
import RecipePageCard from "../components/RecipePageCard";
import { router } from "expo-router";

interface RecipesScreenProps {
    recipeBookId: string;
}

export default function RecipesScreen({ recipeBookId }: RecipesScreenProps) {
    const { session } = useAuth();
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    async function loadRecipes() {
        if (!recipeBookId || !session) return;
        setLoading(true);
        setError("");
        try {
            const recipes = await fetchRecipes(recipeBookId, session);
            setRecipes(recipes);
        } catch (e) {
            setError(e instanceof Error ? e.message : "Failed to get recipes");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadRecipes();
    }, [recipeBookId]);

    function recipePressed(recipeId: number) {
        router.push(`/(meals)/recipes/${recipeId}`)
    }

    return (
        <View className="flex-1 bg-background">
            <ScreenHeader title="Recipes" subtitle="Manage Recipes"/>
            <BackButton 
                className="w-12 h-12 
                bg-white border border-gray-100 rounded-full 
                items-center justify-center transition-colors
                absolute top-4 left-4 z-50
                shadow-sm
                "
            />
            <ErrorLoading error={error} loading={loading} />
            <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
                <View className="mt-3">
                    {recipes.length === 0 ? (
                        <Text className="text-center text-gray-500 mt-4">No recipes found</Text>
                    ) : (
                        recipes.map((recipe) => (
                            <RecipePageCard key={recipe.id} recipe={recipe} onPress={() => recipePressed(recipe.id)} /> 
                        ))
                    )}
                </View>
            </ScrollView>
            <AddButton 
                onPress={() => console.log("needs implemented")}
                isVisible={true} 
                containerClassname="bg-blue-100 rounded-full absolute bottom-1 right-5 w-16 h-16 flex items-center justify-center shadow shadow-sm"
            />
        </View>
    );
}
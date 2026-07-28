import { useEffect, useState } from "react";
import { ScrollView, Text, View, Linking, Alert } from "react-native";
import { Recipe } from "../meal.types";
import { fetchRecipes } from "../services/meal.service";
import { useAuth } from "../../auth/AuthContext";
import ScreenHeader from "@/src/globalComponents/ScreenHeader";
import BackButton from "@/src/globalComponents/BackButton";
import ErrorLoading from "@/src/globalComponents/ErrorLoading";
import AddButton from "@/src/globalComponents/AddButton";
import RecipePageCard from "../components/RecipePageCard";
import usePermissions from "@/src/utils/UsePermissions";
import UpdateRecipeModal from "../components/UpdateRecipeModal";
import DeleteRecipeConfirmation from "../components/DeleteRecipeConfirmation";

interface RecipesScreenProps {
    recipeBookId: number;
}

export default function RecipesScreen({ recipeBookId }: RecipesScreenProps) {
    const { session } = useAuth();
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [editModal, setEditModal] = useState<boolean>(false);
    const [deleteModal, setDeleteModal] = useState<boolean>(false);
    const [selectedRecipe, setSelectedRecipe] = useState<Recipe | undefined>(undefined);
    const canEditResult: boolean = usePermissions('recipes');

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

    const recipePressed = async (recipeId: number) => {
        const recipe = recipes.find(r => r.id === recipeId);
        if (recipe?.url) {
            try {
                const supported = await Linking.canOpenURL(recipe.url);
                if (supported) {
                    await Linking.openURL(recipe.url);
                } else {
                    Alert.alert("Error", `Cannot open URL: ${recipe.url}`);
                }
            } catch (err) {
                Alert.alert("Error", `Failed to open URL: ${recipe.url}`);
            }
        }
    }

    const dismissModal = () => {
        setEditModal(false);
        setDeleteModal(false);
        setSelectedRecipe(undefined);
    }

    return (
        <View className="flex-1 bg-background">
            <ScreenHeader title="Recipes" subtitle="Manage Recipes" />
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
                            <RecipePageCard 
                                key={recipe.id} 
                                setDeleteModal={setDeleteModal}
                                setEditRecipe={setEditModal}
                                recipe={recipe} 
                                onPress={() => recipePressed(recipe.id!)} 
                                setSelectedRecipe={setSelectedRecipe}
                            />
                        ))
                    )}
                </View>
            </ScrollView>
            <AddButton
                onPress={() => setEditModal(true)}
                isVisible={canEditResult}
                containerClassname="bg-blue-100 rounded-full absolute bottom-1 right-5 w-16 h-16 flex items-center justify-center shadow shadow-sm"
            />
            <UpdateRecipeModal
                recipe={selectedRecipe}
                visible={editModal}
                onDismiss={() => dismissModal()}
                recipes={recipes}
                setRecipes={setRecipes}
                recipeBookId={recipeBookId}
            />
            <DeleteRecipeConfirmation
                recipe={selectedRecipe!}
                visible={deleteModal}
                onDismiss={() => dismissModal()}
                recipes={recipes}
                setRecipes={setRecipes}
                setError={setError}
            />
        </View>
    );
}
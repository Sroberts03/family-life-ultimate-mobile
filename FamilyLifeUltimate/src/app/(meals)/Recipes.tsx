import RecipesScreen from "@/src/features/meals/pages/RecipesScreen";
import { useLocalSearchParams } from "expo-router";

export default function Recipes() {
    const { recipeBookId } = useLocalSearchParams<{ recipeBookId: string }>();
    
    return (
       <RecipesScreen recipeBookId={recipeBookId} />
    );
} 
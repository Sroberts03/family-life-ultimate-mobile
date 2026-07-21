import { useLocalSearchParams } from "expo-router";
import RecipeScreen from "@/src/features/meals/pages/RecipeScreen";

export default function Recipe() {
    const { recipeId } = useLocalSearchParams<{ recipeId: string }>();

    return (
        <RecipeScreen recipeId={Number(recipeId)} />
    );
}
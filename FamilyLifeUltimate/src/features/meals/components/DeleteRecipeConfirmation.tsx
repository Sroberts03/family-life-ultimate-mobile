import { Recipe } from "../meal.types";
import { Modal, Text, View, TouchableOpacity } from "react-native";
import { deleteRecipe } from "../services/meal.service";
import { useAuth } from "../../auth/AuthContext";
import ErrorLoading from "@/src/globalComponents/ErrorLoading";
import { useState } from "react";
import { Feather } from "@expo/vector-icons";

interface Props {
    recipe: Recipe;
    visible: boolean;
    onDismiss: () => void;
    recipes: Recipe[];
    setRecipes: (recipes: Recipe[]) => void;
    setError: (error: string) => void;
}

export default function DeleteRecipeConfirmation({ recipe, visible, onDismiss, recipes, setRecipes, setError }: Props) {
    const { session } = useAuth();
    const [loading, setLoading] = useState(false);

    if (!recipe || !visible) return null;

    const deleteRecipeHandler = async () => {
        if (!session) return;
        setLoading(true);
        setError("");
        try {
            await deleteRecipe(recipe.id!, session);
            const updatedRecipes = recipes.filter(r => r.id !== recipe.id);
            setRecipes(updatedRecipes);
        } catch (e) {
            setError(e instanceof Error ? e.message : "Failed to delete recipe");
        } finally {
            setLoading(false);
            onDismiss();
        }
    };

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onDismiss}
        >
            <View className="flex-1 bg-black/40 justify-center items-center px-5">
                <View className="bg-white rounded-[32px] w-full max-w-sm shadow-2xl overflow-hidden p-6 items-center">
                    <View className="w-16 h-16 bg-red-100 rounded-full items-center justify-center mb-4">
                        <Feather name="trash-2" size={32} color="#ef4444" />
                    </View>
                    
                    <Text className="text-xl font-bold text-slate-900 text-center mb-2">Delete Recipe</Text>
                    <Text className="text-[15px] text-slate-500 text-center mb-4 leading-relaxed">
                        Are you sure you want to delete <Text className="font-bold">"{recipe.name}"</Text>? This action cannot be undone.
                    </Text>
                    <View className="w-full mt-2">
                        <TouchableOpacity 
                            className={`w-full py-3.5 rounded-xl ${loading ? 'bg-red-300' : 'bg-red-500'} items-center justify-center shadow-sm mb-3`}
                            onPress={deleteRecipeHandler}
                            disabled={loading}
                        >
                            <Text className="font-semibold text-white">Delete Recipe</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity 
                            onPress={onDismiss}
                            className="w-full py-3.5 rounded-xl border border-gray-200 bg-white items-center justify-center shadow-sm"
                            disabled={loading}
                        >
                            <Text className="font-semibold text-slate-600">Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}
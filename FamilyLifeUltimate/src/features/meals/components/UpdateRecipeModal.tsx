import { useEffect, useState } from "react";
import { 
    Modal,
    Text, 
    TextInput, 
    TouchableOpacity, 
    View,
    TouchableWithoutFeedback,
    KeyboardAvoidingView,
    Keyboard,
    Platform 
} from "react-native";
import { Recipe } from "../meal.types";
import ErrorLoading from "@/src/globalComponents/ErrorLoading";
import { createRecipe, updateRecipe } from "../services/meal.service";
import { useAuth } from "../../auth/AuthContext";
import { isValidRecipeURL } from "../utils/RecipeURLValidation";

interface Props {
    recipe?: Recipe;
    visible: boolean;
    onDismiss: () => void;
    recipes: Recipe[];
    setRecipes: (recipes: Recipe[]) => void,
    recipeBookId: number;
}

export default function UpdateRecipeModal({ recipe, visible, onDismiss, recipes, setRecipes, recipeBookId }: Props) {
    const { session } = useAuth();
    const [name, setName] = useState(recipe?.name ?? "");
    const [description, setDescription] = useState(recipe?.description ?? "");
    const [url, setUrl] = useState(recipe?.url ?? "");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (visible) {
            setName(recipe?.name ?? "");
            setDescription(recipe?.description ?? "");
            setUrl(recipe?.url ?? "");
            setError("");
        }
    }, [visible, recipe]);

    if (!visible) return null;

    const handleSave = async () => {
        if (!session) return;
        if (!name.trim() || !url.trim()) {
            setError("Recipe name and URL are required");
            return;
        }
        if (!isValidRecipeURL(url)) {
            setError("Please enter a valid URL");
            return;
        }
        try {
            setLoading(true);
            if (recipe) {
                await updateRecipe(
                    {
                        id: recipe.id,
                        name,
                        description,
                        url
                    }, session);
                const updatedRecipes = recipes.map(r => r.id === recipe.id ? { ...r, name, description, url } : r);
                setRecipes(updatedRecipes);
            } else {
                const newRecipe = await createRecipe(
                {
                    recipeBookId,
                    name,
                    description,
                    url
                }, session);
                setRecipes([...recipes, newRecipe]);
            }
            reset();
            onDismiss();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to save recipe");
        } finally {
            setLoading(false);
        }
    }

    const handleCancel = () => {
        reset();
        onDismiss();
    }

    const reset = () => {
        setName("");
        setDescription("");
        setUrl("");
        setError("");
        setLoading(false);
    }

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={handleCancel}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View className="flex-1 justify-center items-center bg-black/50 px-5">
                    <KeyboardAvoidingView
                        behavior={Platform.OS === "ios" ? "padding" : "height"}
                        className="w-full"
                    >
                        <View className="bg-white rounded-3xl p-6 w-full max-h-[90vh] shadow-xl">
                            <View className="flex-row justify-between items-center mb-6">
                                <Text className="text-2xl font-bold text-gray-800">
                                    {recipe ? "Edit Recipe" : "New Recipe"}
                                </Text>
                            </View>
                            <ErrorLoading error={error} loading={loading} />
                            
                            <View className="flex-col gap-5 pb-8">
                                {/* Name Input */}
                                <View>
                                    <Text className="text-sm font-medium text-gray-700 mb-1.5 ml-1">Recipe Name*</Text>
                                    <TextInput
                                        className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-base text-gray-800"
                                        placeholder="e.g. Best Chocolate Chip Cookies"
                                        value={name}
                                        onChangeText={setName}
                                        placeholderTextColor="#9ca3af"
                                    />
                                </View>
                                
                                {/* URL Input */}
                                <View>
                                    <Text className="text-sm font-medium text-gray-700 mb-1.5 ml-1">Recipe URL*</Text>
                                    <TextInput
                                        className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-base text-gray-800"
                                        placeholder="https://example.com/recipe"
                                        value={url}
                                        onChangeText={setUrl}
                                        keyboardType="url"
                                        autoCapitalize="none"
                                        placeholderTextColor="#9ca3af"
                                    />
                                </View>

                                {/* Description Input */}
                                <View>
                                    <Text className="text-sm font-medium text-gray-700 mb-1.5 ml-1">Description (Optional)</Text>
                                    <TextInput
                                        className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-base text-gray-800 h-24"
                                        placeholder="Short description or notes..."
                                        value={description}
                                        onChangeText={setDescription}
                                        multiline
                                        textAlignVertical="top"
                                        placeholderTextColor="#9ca3af"
                                    />
                                </View>
                            </View>

                            <View className="flex-row mt-2 gap-3 pt-4 border-t border-gray-100">
                                <TouchableOpacity
                                    onPress={handleCancel}
                                    className="flex-1 py-4 rounded-xl bg-gray-100 items-center justify-center"
                                >
                                    <Text className="text-gray-700 font-bold text-base">Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={handleSave}
                                    className={`flex-1 py-4 rounded-xl items-center justify-center ${name.trim() ? 'bg-blue-600' : 'bg-blue-300'}`}
                                    disabled={!name.trim() || loading}
                                >
                                    <Text className="text-white font-bold text-base">{recipe ? "Update" : "Create"}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </KeyboardAvoidingView>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
}
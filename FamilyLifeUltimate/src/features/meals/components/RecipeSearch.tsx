import { useAuth } from "@/src/features/auth/AuthContext";
import { searchRecipes } from "../services/meal.service";
import { TextInput, TouchableOpacity, View } from "react-native";
import { Recipe } from "../meal.types";
import { useEffect } from "react";
import { Feather } from "@expo/vector-icons";

interface RecipeSearchProps {
    recipeBookId: number;
    searchParam: string;
    setSearchParam: (searchParam: string) => void;
    setRecipes: (recipes: Recipe[]) => void;
    setError: (error: string) => void;
    loadRecipes: () => void;
}

export default function RecipeSearch({ searchParam, setSearchParam, loadRecipes, recipeBookId, setRecipes, setError }: RecipeSearchProps) {
    const { session } = useAuth();

    async function search() {
        if (!session) return;
        if (searchParam.trim().length === 0) {
            loadRecipes();
            return;
        }
        if (searchParam.trim().length > 0) {
            try {
                const recipes = await searchRecipes(recipeBookId, searchParam, session)
                setRecipes(recipes);
            } catch (e) {
                setError(e instanceof Error ? e.message : "Failed to search recipes");
            }
        }
    }

    function deleteQuery() {
        setSearchParam("");
    }

    useEffect(() => {
        search()
    }, [searchParam])

    return (
        <View className="px-4 py-2 mb-2 bg-transparent">
            <View className="flex-row items-center bg-gray-200/70 rounded-2xl px-4 py-3">
                <Feather name="search" size={20} color="#6b7280" className="mr-3" />
                <TextInput
                    className="flex-1 text-[17px] text-gray-800 font-medium"
                    placeholder="Search recipes..."
                    value={searchParam}
                    onChangeText={setSearchParam}
                    placeholderTextColor="#6b7280"
                    selectionColor="#3b82f6"
                />
                {searchParam.trim() !== "" && (
                    <TouchableOpacity onPress={deleteQuery} className="ml-2">
                        <Feather name="x" size={18} color="#000000ff" />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    )
}
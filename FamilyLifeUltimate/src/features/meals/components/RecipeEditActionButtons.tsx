import { TouchableOpacity, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import usePermissions from "@/src/utils/UsePermissions";
import { editRecipe } from "../utils/editRecipes";
import { useState } from "react";

interface props {
    setDeleteModal: (value: boolean) => void;
    flexDirection?: "row" | "column";
    recipeId?: number;
    setEditRecipeBookModal?: (value: boolean) => void;
}

export default function RecipeEditActionButtons({ recipeId, setDeleteModal, setEditRecipeBookModal, flexDirection = "row" }: props) {
    const canEditResult: boolean = usePermissions('recipes');
    const [showButtons, setShowButtons] = useState(false);

    const handleEdit = () => {
        if (setEditRecipeBookModal) {
            setEditRecipeBookModal(true);
        }
        else if (recipeId) {
            editRecipe(recipeId);
        }
    }

    if (flexDirection === "column") {
        return (
            <View>
                {canEditResult && !showButtons && (
                    <TouchableOpacity
                        onPress={() => setShowButtons(!showButtons)}
                        className="px-4 py-2"
                    >
                        <Feather name="menu" size={18} color="#000000ff" />
                    </TouchableOpacity>
                )}
                {showButtons && (
                    <View className={`flex-col`}>
                        <TouchableOpacity
                            onPress={() => setShowButtons(!showButtons)}
                            className="px-4 py-2"
                        >
                            <Feather name="menu" size={18} color="#000000ff" />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={handleEdit}
                            className="px-4 py-2"
                        >
                            <Feather name="edit" size={18} color="#000000ff" />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => setDeleteModal(true)}
                            className="px-4 py-2"
                        >
                            <Feather name="trash-2" size={18} color="#ff0000ff" />
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        )
    }
    else {
        return (
            <View>
                {canEditResult && !showButtons && (
                    <TouchableOpacity
                        onPress={() => setShowButtons(!showButtons)}
                        className="px-4 py-2"
                    >
                        <Feather name="menu" size={18} color="#000000ff" />
                    </TouchableOpacity>
                )}
                {showButtons && (
                    <View className={`flex-row`}>
                        <TouchableOpacity
                            onPress={handleEdit}
                            className="px-4 py-2"
                        >
                            <Feather name="edit" size={18} color="#000000ff" />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => setDeleteModal(true)}
                            className="px-4 py-2"
                        >
                            <Feather name="trash-2" size={18} color="#ff0000ff" />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => setShowButtons(!showButtons)}
                            className="px-4 py-2"
                        >
                            <Feather name="menu" size={18} color="#000000ff" />
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        )
    }
}
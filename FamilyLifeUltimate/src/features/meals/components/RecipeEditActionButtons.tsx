import { TouchableOpacity, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import usePermissions from "@/src/utils/UsePermissions";
import { useState } from "react";
import { Recipe } from "../meal.types";

interface props {
    setDeleteModal: (value: boolean) => void;
    flexDirection?: "row" | "column";
    recipe: Recipe;
    setEditModal: (value: boolean) => void;
    setSelectedRecipe?: (recipe: Recipe) => void;
}

export default function RecipeEditActionButtons({ recipe, setDeleteModal, setEditModal, flexDirection = "row", setSelectedRecipe }: props) {
    const canEditResult: boolean = usePermissions('recipes');
    const [showButtons, setShowButtons] = useState(false);

    const handleEdit = () => {
        if (setSelectedRecipe) {
            setSelectedRecipe(recipe);
        }
        setEditModal(true);
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
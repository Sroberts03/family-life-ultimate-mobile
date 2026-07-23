import { View, Text, TouchableOpacity, Platform } from "react-native";
import { Recipe } from "../meal.types";
import { Feather } from "@expo/vector-icons";

interface RecipePageCardProps {
    recipe: Recipe;
    onPress?: (recipeId: number) => void;
}

export default function RecipePageCard({ recipe, onPress }: RecipePageCardProps) {
    return (
        <TouchableOpacity 
            activeOpacity={0.8}
            onPress={() => onPress && onPress(recipe.id)}
            className="bg-[#fcfaf5] rounded-xl shadow-sm mb-5 mx-4 border border-[#e6e2d6] overflow-hidden"
            style={{
                shadowColor: '#8c7e61',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.15,
                shadowRadius: 6,
                elevation: 4,
            }}
        >
            {/* Top red double line simulating recipe card top */}
            <View className="h-1.5 bg-red-400/80" />
            <View className="h-[1px] bg-red-400/80 mt-[2px]" />

            <View className="p-5">
                {/* Title and Icons */}
                <View className="flex-row justify-between items-start mb-4">
                    <Text 
                        className="text-[22px] font-bold text-slate-800 flex-1 mr-4" 
                        style={{ fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif' }}
                        numberOfLines={2}
                    >
                        {recipe.name}
                    </Text>
                    <View className="w-10 h-10 rounded-full bg-orange-100/80 items-center justify-center border border-orange-200/60 shadow-sm">
                        <Feather name="book-open" size={18} color="#ea580c" />
                    </View>
                </View>

                {/* Meta details (Time, Servings) */}
                <View className="flex-row items-center flex-wrap mb-4 pb-4 border-b border-dashed border-[#d5d0c4]">
                    <View className="flex-row items-center mr-5 mb-2">
                        <View className="bg-[#e6e2d6]/50 p-1.5 rounded-full mr-2">
                            <Feather name="clock" size={12} color="#78716c" />
                        </View>
                        <Text className="text-xs text-stone-600 font-semibold uppercase tracking-wider">
                            Prep: {recipe.prepTime}m
                        </Text>
                    </View>
                    
                    <View className="flex-row items-center mr-5 mb-2">
                        <View className="bg-[#e6e2d6]/50 p-1.5 rounded-full mr-2">
                            <Feather name="thermometer" size={12} color="#78716c" />
                        </View>
                        <Text className="text-xs text-stone-600 font-semibold uppercase tracking-wider">
                            Cook: {recipe.cookTime}m
                        </Text>
                    </View>

                    <View className="flex-row items-center mb-2">
                        <View className="bg-[#e6e2d6]/50 p-1.5 rounded-full mr-2">
                            <Feather name="users" size={12} color="#78716c" />
                        </View>
                        <Text className="text-xs text-stone-600 font-semibold uppercase tracking-wider">
                            Serves: {recipe.servings}
                        </Text>
                    </View>
                </View>

                {/* Description */}
                <Text 
                    className="text-stone-700 leading-relaxed text-[15px] italic" 
                    numberOfLines={4}
                    style={{ fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif' }}
                >
                    {recipe.description || "No description provided for this recipe."}
                </Text>

                {/* Card "Holes" or bottom flair */}
                <View className="flex-row justify-end mt-5 pt-3 border-t border-[#e6e2d6]/60">
                    <Text className="text-[10px] text-stone-400 uppercase tracking-widest font-bold">
                        Added {new Date(recipe.createdAt).toLocaleDateString()}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}
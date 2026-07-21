import { Link } from "expo-router";
import { MealPlanItem } from "../meal.types";
import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface Props {
    mealPlan: MealPlanItem;
}

export default function MealPlanCard({ mealPlan }: Props) {
    // Format the time safely to AM/PM
    let formattedTime = String(mealPlan.time);
    try {
        let dateObj = new Date(mealPlan.time);

        // If it's an invalid date, check if it's a "HH:mm:ss" or "HH:mm" time string
        if (isNaN(dateObj.getTime())) {
            const timeStr = String(mealPlan.time);
            if (timeStr.includes(':')) {
                const timeParts = timeStr.split(':');
                if (timeParts.length >= 2) {
                    const today = new Date();
                    today.setHours(parseInt(timeParts[0], 10), parseInt(timeParts[1], 10), 0);
                    dateObj = today;
                }
            }
        }

        if (!isNaN(dateObj.getTime())) {
            formattedTime = dateObj.toLocaleTimeString([], {
                hour: "numeric",
                minute: "2-digit",
                hour12: true
            });
        }
    } catch (e) {
        // Fallback to string if parsing fails
    }

    return (
        <View className="mb-4 overflow-hidden rounded-2xl bg-white shadow-sm border border-slate-100 dark:bg-slate-900 dark:border-slate-800">
            <View className="p-5">
                {/* Header: Meal Type Badge and Time */}
                <View className="flex-row items-center justify-between mb-3">
                    <View className="bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full">
                        <Text className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                            {mealPlan.mealType}
                        </Text>
                    </View>
                    <View className="flex-row items-center">
                        <Ionicons name="time-outline" size={14} color="#64748b" />
                        <Text className="text-sm font-medium text-slate-500 dark:text-slate-400 ml-1">
                            {formattedTime}
                        </Text>
                    </View>
                </View>

                {/* Title */}
                <Text className="text-xl font-bold text-slate-900 dark:text-white mb-1">
                    {mealPlan.name}
                </Text>
            </View>

            {/* Footer Action */}
            {mealPlan.recipeId ? (
                <View className="border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                    <Link href={`/(meals)/recipes/${mealPlan.recipeId}`} asChild>
                        <Pressable className="flex-row items-center justify-between px-5 py-3 active:bg-slate-100 dark:active:bg-slate-800">
                            <Text className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                                View Recipe
                            </Text>
                            <Ionicons name="chevron-forward" size={16} color="#3b82f6" />
                        </Pressable>
                    </Link>
                </View>
            ) : null}
        </View>
    );
}

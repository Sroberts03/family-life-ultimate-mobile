import { MealPlanItem } from "../meal.types";
import { View, Text, Modal, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useAuth } from "../../auth/AuthContext";
import { deleteMealPlan } from "../services/meal.service";

interface DeleteMealPlanConfirmationProps {
    mealPlan?: MealPlanItem;
    showModal: boolean;
    setShowModal: (show: boolean) => void;
    mealPlans: MealPlanItem[];
    setMealPlans: (mealPlans: MealPlanItem[]) => void;
    setError: (error: string) => void;
}

export default function DeleteMealPlanConfirmation({ mealPlan, showModal, setShowModal, mealPlans, setMealPlans, setError }: DeleteMealPlanConfirmationProps) {
    const { session } = useAuth();
    const handleDelete = async () => {
        if (!session || !mealPlan) return;
        try {
            await deleteMealPlan(mealPlan.id, session);
            setMealPlans(mealPlans.filter((mp) => mp.id !== mealPlan.id));
        } catch (e) {
            setError(e instanceof Error ? e.message : "Failed to delete meal plan");
        } finally {
            setShowModal(false);
        }
    }

    return (
        <Modal
            visible={showModal}
            animationType="fade"
            transparent={true}
            onRequestClose={() => setShowModal(false)}
        >
            <View className="flex-1 bg-black/40 justify-center items-center px-5">
                <View className="bg-white rounded-[32px] w-full max-w-sm shadow-2xl overflow-hidden p-6 items-center">
                    <View className="w-16 h-16 bg-red-100 rounded-full items-center justify-center mb-4">
                        <Feather name="trash-2" size={32} color="#ef4444" />
                    </View>
                    
                    <Text className="text-xl font-bold text-slate-900 text-center mb-2">Delete Meal Plan</Text>
                    <Text className="text-[15px] text-slate-500 text-center mb-4 leading-relaxed">
                        Are you sure you want to delete this meal plan? This action cannot be undone.
                    </Text>

                    <View className="w-full mt-2">
                        <TouchableOpacity 
                            className="w-full py-3.5 rounded-xl bg-red-500 items-center justify-center shadow-sm mb-3"
                            onPress={() => handleDelete()}
                        >
                            <Text className="font-semibold text-white">Delete Meal Plan</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity 
                            onPress={() => setShowModal(false)}
                            className="w-full py-3.5 rounded-xl border border-gray-200 bg-white items-center justify-center shadow-sm"
                        >
                            <Text className="font-semibold text-slate-600">Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    )
}
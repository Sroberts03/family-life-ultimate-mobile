import {
    Modal,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    TouchableWithoutFeedback,
    KeyboardAvoidingView,
    Keyboard,
    Platform,
    ScrollView
} from "react-native";
import { useAuth } from "../../auth/AuthContext";
import { useFamily } from "../../family/FamilyContext";
import { useEffect, useState } from "react";
import { MealPlanItem, MealType, Recipe } from "../meal.types";
import { createMealPlanItem, fetchAllRecipesForFamily } from "../services/meal.service";
import DateTimePicker from '@react-native-community/datetimepicker';

interface Props {
    visible: boolean;
    setVisible: (visible: boolean) => void;
    setError: (error: string) => void;
    setMealPlans: (mealPlans: MealPlanItem[]) => void;
    mealPlans: MealPlanItem[];
    date: Date;
}

export default function CreateNewMealPlanItem({ visible, setVisible, setError, setMealPlans, mealPlans, date }: Props) {
    const { session } = useAuth();
    const { familyId } = useFamily();
    const [recipes, setRecipes] = useState<Recipe[]>([])
    const [name, setName] = useState<string>("");
    const [time, setTime] = useState<Date>(new Date(date.getTime()));
    const [mealType, setMealType] = useState<MealType>(MealType.LUNCH);
    const [recipeId, setRecipeId] = useState<number | undefined>(undefined);

    const loadRecipes = async () => {
        if (!familyId || !session) return;
        try {
            const recipes = await fetchAllRecipesForFamily(familyId, session);
            setRecipes(recipes);
        } catch (e) {
            setError(e instanceof Error ? e.message : "Failed to get recipes");
        }
    }

    useEffect(() => {
        loadRecipes();
    }, [familyId])

    if (!session || !visible) return null;

    const onSave = async () => {
        if (!session || !familyId) return;
        try {
            // Format date as YYYY-MM-DD in local time
            const year = date.getFullYear();
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const day = date.getDate().toString().padStart(2, '0');
            const formattedDate = `${year}-${month}-${day}`;
            
            // Format time as HH:mm:ss in local time
            const hours = time.getHours().toString().padStart(2, '0');
            const minutes = time.getMinutes().toString().padStart(2, '0');
            const seconds = time.getSeconds().toString().padStart(2, '0');
            const formattedTime = `${hours}:${minutes}:${seconds}`;

            const mealPlan = await createMealPlanItem({ 
                familyId, 
                mealType, 
                name: name.trim(), 
                recipeId, 
                date: formattedDate, 
                time: formattedTime 
            }, session);
            setMealPlans([...mealPlans, mealPlan]);
            reset();
        } catch (e) {
            setError(e instanceof Error ? e.message : "Failed to create meal plan");
        } finally {
            setVisible(false);
            reset();
        }
    }

    const reset = () => {
        setName("");
        setTime(new Date(date.getTime()));
        setMealType(MealType.LUNCH);
        setRecipeId(undefined);
        setVisible(false);
    }

    const mealTypes = [
        { label: 'Breakfast', value: MealType.BREAKFAST },
        { label: 'Lunch', value: MealType.LUNCH },
        { label: 'Dinner', value: MealType.DINNER },
        { label: 'Snack', value: MealType.SNACK },
    ];

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={reset}
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
                                    New Meal Plan
                                </Text>
                            </View>

                            <View className="flex-col gap-5 pb-8">
                                {/* Name Input */}
                                <View>
                                    <Text className="text-sm font-medium text-gray-700 mb-1.5 ml-1">Meal Name*</Text>
                                    <TextInput
                                        className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-base text-gray-800"
                                        placeholder="e.g. Taco Tuesday"
                                        value={name}
                                        onChangeText={setName}
                                        placeholderTextColor="#9ca3af"
                                    />
                                </View>

                                {/* Meal Type Selection */}
                                <View>
                                    <Text className="text-sm font-medium text-gray-700 mb-1.5 ml-1">Meal Type</Text>
                                    <View className="flex-row flex-wrap gap-2">
                                        {mealTypes.map((type) => (
                                            <TouchableOpacity
                                                key={type.value}
                                                onPress={() => setMealType(type.value)}
                                                className={`px-4 py-2 rounded-full border ${mealType === type.value
                                                        ? 'bg-blue-600 border-blue-600'
                                                        : 'bg-white border-gray-200'
                                                    }`}
                                            >
                                                <Text className={`font-medium ${mealType === type.value ? 'text-white' : 'text-gray-600'
                                                    }`}>
                                                    {type.label}
                                                </Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                </View>

                                {/* Time Picker */}
                                <View>
                                    <Text className="text-sm font-medium text-gray-700 mb-1.5 ml-1">Time</Text>
                                    <View className="flex-row items-center">
                                        <DateTimePicker
                                            value={time}
                                            mode="time"
                                            display="default"
                                            onChange={(event, selectedDate) => {
                                                if (selectedDate) setTime(selectedDate);
                                            }}
                                            style={{ alignSelf: 'flex-start' }}
                                        />
                                    </View>
                                </View>

                                {/* Recipe Picker */}
                                <View>
                                    <Text className="text-sm font-medium text-gray-700 mb-1.5 ml-1">Recipe (Optional)</Text>
                                    <ScrollView
                                        horizontal
                                        showsHorizontalScrollIndicator={false}
                                        className="flex-row"
                                    >
                                        <TouchableOpacity
                                            onPress={() => setRecipeId(undefined)}
                                            className={`px-4 py-2 mr-2 rounded-full border ${recipeId === undefined
                                                    ? 'bg-blue-600 border-blue-600'
                                                    : 'bg-white border-gray-200'
                                                }`}
                                        >
                                            <Text className={`font-medium ${recipeId === undefined ? 'text-white' : 'text-gray-600'
                                                }`}>
                                                None
                                            </Text>
                                        </TouchableOpacity>

                                        {recipes.map((r) => (
                                            <TouchableOpacity
                                                key={r.id}
                                                onPress={() => setRecipeId(r.id)}
                                                className={`px-4 py-2 mr-2 rounded-full border ${recipeId === r.id
                                                        ? 'bg-blue-600 border-blue-600'
                                                        : 'bg-white border-gray-200'
                                                    }`}
                                            >
                                                <Text className={`font-medium ${recipeId === r.id ? 'text-white' : 'text-gray-600'
                                                    }`}>
                                                    {r.name}
                                                </Text>
                                            </TouchableOpacity>
                                        ))}
                                    </ScrollView>
                                </View>
                            </View>

                            <View className="flex-row mt-2 gap-3 pt-4 border-t border-gray-100">
                                <TouchableOpacity
                                    onPress={reset}
                                    className="flex-1 py-4 rounded-xl bg-gray-100 items-center justify-center"
                                >
                                    <Text className="text-gray-700 font-bold text-base">Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={onSave}
                                    className={`flex-1 py-4 rounded-xl items-center justify-center ${name.trim() ? 'bg-blue-600' : 'bg-blue-300'}`}
                                    disabled={!name.trim()}
                                >
                                    <Text className="text-white font-bold text-base">Create</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </KeyboardAvoidingView>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
}
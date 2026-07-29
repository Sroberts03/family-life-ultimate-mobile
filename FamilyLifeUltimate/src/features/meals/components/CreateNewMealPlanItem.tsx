import {
    Modal,
    Text,
    TouchableOpacity,
    View,
    TouchableWithoutFeedback,
    KeyboardAvoidingView,
    Keyboard,
    Platform,    
} from "react-native";
import { useAuth } from "../../auth/AuthContext";
import { useFamily } from "../../family/FamilyContext";
import { useEffect, useState } from "react";
import { MealPlanItem, MealType, Recipe } from "../meal.types";
import { createMealPlanItem, searchRecipesForFamily, updateMealPlanItem } from "../services/meal.service";
import { MealNameInput } from "./MealNameInput";
import { MealTypeSelector } from "./MealTypeSelector";
import { TimePickerSelector } from "./TimePickerSelector";
import { RecipeSearchPicker } from "./RecipeSearchPicker";

function organizePlans(oldPlans: MealPlanItem[], newPlan: MealPlanItem, opperation: "add" | "edit"): MealPlanItem[] {
    let newMealPlans: MealPlanItem[] = [];
    if (opperation == "add") {
        newMealPlans = [...oldPlans, newPlan];
    } else {
        newMealPlans = oldPlans.map((mealPlan) => mealPlan.id === newPlan.id ? newPlan : mealPlan);
    }
    newMealPlans.sort((a, b) => {
        if (a.time < b.time) return -1;
        if (a.time > b.time) return 1;
        return 0;
    });
    return newMealPlans;
}

interface Props {
    visible: boolean;
    setVisible: (visible: boolean) => void;
    setError: (error: string) => void;
    setMealPlans: (mealPlans: MealPlanItem[]) => void;
    mealPlans: MealPlanItem[];
    date: Date;
    mealPlanItem?: MealPlanItem;
}

export default function CreateNewMealPlanItem({ visible, setVisible, setError, setMealPlans, mealPlans, date, mealPlanItem }: Props) {
    const { session } = useAuth();
    const { familyId } = useFamily();
    const [recipes, setRecipes] = useState<Recipe[]>([])
    const [recipeSearchQuery, setRecipeSearchQuery] = useState<string>("")
    const [name, setName] = useState<string>("");
    const [time, setTime] = useState<Date>(new Date(date.getTime()));
    const [mealType, setMealType] = useState<MealType>(MealType.LUNCH);
    const [recipeId, setRecipeId] = useState<number | undefined>(undefined);

    const searchRecipes = async () => {
        if (!familyId || !session) return;
        try {
            const recipes = await searchRecipesForFamily(familyId, recipeSearchQuery, session);
            setRecipes(recipes);
        } catch (e) {
            setError(e instanceof Error ? e.message : "Failed to get recipes");
        }
    }

    useEffect(() => {
        if (visible) {
            if (mealPlanItem) {
                setName(mealPlanItem.name);
                setMealType(mealPlanItem.mealType);
                setRecipeId(mealPlanItem.recipeId || undefined);
                
                if (typeof mealPlanItem.time === 'string') {
                    const [hours, minutes, seconds] = (mealPlanItem.time as string).split(':');
                    const t = new Date(date.getTime());
                    t.setHours(parseInt(hours, 10));
                    t.setMinutes(parseInt(minutes, 10));
                    t.setSeconds(parseInt(seconds || "0", 10));
                    setTime(t);
                } else if (mealPlanItem.time instanceof Date) {
                    setTime(mealPlanItem.time);
                } else {
                    setTime(new Date(date.getTime()));
                }
            } else {
                setName("");
                setTime(new Date(date.getTime()));
                setMealType(MealType.LUNCH);
                setRecipeId(undefined);
                setRecipeSearchQuery("");
            }
        }
    }, [visible, mealPlanItem]);

    useEffect(() => {
        searchRecipes();
    }, [recipeSearchQuery])

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
            
            let mealPlan: MealPlanItem;

            if (!mealPlanItem) {
                mealPlan = await createMealPlanItem({ 
                    familyId, 
                    mealType, 
                    name: name.trim(), 
                    recipeId, 
                    date: formattedDate, 
                    time: formattedTime 
                }, session);
                setMealPlans(organizePlans(mealPlans, mealPlan, "add"));
            } else {
                mealPlan = await updateMealPlanItem({ 
                    mealPlanItemId: mealPlanItem.id,
                    familyId, 
                    mealType, 
                    name: name.trim(), 
                    recipeId, 
                    date: formattedDate, 
                    time: formattedTime 
                }, session);
                setMealPlans(organizePlans(mealPlans, mealPlan, "edit"));
            }
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
        setRecipeSearchQuery("");
        setVisible(false);
    }

    const mealTypes = [
        { label: 'Breakfast', value: MealType.BREAKFAST, icon: 'sunrise', family: 'Feather' },
        { label: 'Lunch', value: MealType.LUNCH, icon: 'sun', family: 'Feather' },
        { label: 'Dinner', value: MealType.DINNER, icon: 'moon', family: 'Feather' },
        { label: 'Snack', value: MealType.SNACK, icon: 'coffee', family: 'Feather' },
        { label: 'Dessert', value: MealType.DESSERT, icon: 'cookie', family: 'MaterialCommunityIcons' },
        { label: 'Other', value: MealType.OTHER, icon: 'more-horizontal', family: 'Feather' },
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
                                    {mealPlanItem ? "Edit meal plan" : "New meal plan"}
                                </Text>
                            </View>

                            <View className="flex-col gap-6 pb-8">
                                <MealNameInput name={name} setName={setName} />
                                <MealTypeSelector mealType={mealType} setMealType={setMealType} mealTypes={mealTypes} />
                                <TimePickerSelector time={time} setTime={setTime} />
                                <RecipeSearchPicker 
                                    recipeId={recipeId}
                                    setRecipeId={setRecipeId}
                                    recipes={recipes}
                                    recipeSearchQuery={recipeSearchQuery}
                                    setRecipeSearchQuery={setRecipeSearchQuery}
                                />
                            </View>

                            <View className="flex-row mt-2 gap-3 pt-4 border-t border-gray-100">
                                <TouchableOpacity
                                    onPress={reset}
                                    className="flex-1 py-4 rounded-xl bg-white border border-gray-200 items-center justify-center"
                                >
                                    <Text className="text-gray-700 font-bold text-base">Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={onSave}
                                    className={`flex-1 py-4 rounded-xl items-center justify-center ${name.trim() ? 'bg-blue-600' : 'bg-blue-400'}`}
                                    disabled={!name.trim()}
                                >
                                    <Text className="text-white font-bold text-base">{mealPlanItem ? 'Update' : 'Create'}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </KeyboardAvoidingView>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
}
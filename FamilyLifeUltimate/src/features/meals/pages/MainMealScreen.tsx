import React, { useEffect, useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { useAuth } from "@/src/features/auth/AuthContext";
import { User } from "@/src/features/auth/auth.types";
import FamilySelector from "../../family/components/FamilySelector";
import { useFamily } from "@/src/features/family/FamilyContext";
import DayList from "../../calendar/components/DayList";
import { months } from "../../calendar/utils/MonthRecord";
import TodayButton from "../../chore/components/TodayButton";
import MealManagerButton from "../components/MealManagerButton";
import { RelativePathString, router } from "expo-router";
import AddButton from "@/src/globalComponents/AddButton";
import { MealPlanItem, MealType } from "../meal.types";
import { fetchMealPlans } from "../services/meal.service";
import { toLocalDateString } from "@/src/utils/toLocaleDateString";
import MealPlanCard from "../components/MealPlanCard";
import ErrorLoading from "@/src/globalComponents/ErrorLoading";
import CheckPermissions from "@/src/utils/CheckPermissions";

export default function MainMealScreen() {
    const { session } = useAuth();
    const { familyId, memberFamilies, setFamilyId } = useFamily();
    const canEditResult: boolean = CheckPermissions('meal');
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [date, setDate] = useState<Date>(new Date());
    const [today, setToday] = useState<Date>(new Date());
    const [createMealPlan, setCreateMealPlan] = useState<boolean>(false);
    const [mealPlans, setMealPlans] = useState<MealPlanItem[]>([]);

    async function loadMealPlans() {
        if (!familyId || !session) return;
        setLoading(true);
        setError("");
        try {
            const mealPlans = await fetchMealPlans(familyId, toLocalDateString(date), session);
            setMealPlans(mealPlans);
        } catch (e) {
            setError(e instanceof Error ? e.message : "Failed to get chores");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadMealPlans();
    }, [familyId, date]);

    const possibleFamilies = [...memberFamilies];

    const manageButtonClicked = (pathName: RelativePathString, params: any) => {
        router.push({ pathname: pathName, params: params })
    }

    return (
        <View className="flex-1 bg-background">
            <View className="px-3">
                <FamilySelector
                    possibleFamilies={possibleFamilies}
                    familyId={familyId}
                    setFamilyId={setFamilyId}
                />
            </View>
            <View className="px-3">
                <Text className="text-center text-xl font-bold">{months[date.getMonth()] + (date.getFullYear() == today.getFullYear() ? "" : ", " + date.getFullYear())}</Text>
            </View>
            <DayList dateBeingViewed={date} setDateBeingViewed={setDate} today={today} />
            <ScrollView>
                <View className="px-3 mt-3">
                    <View className="flex-row gap-3">
                        <MealManagerButton
                            title="Shopping"
                            onPress={() => manageButtonClicked('/ShoppingList' as RelativePathString, { familyId: familyId })}
                            icon="shopping-cart"
                            buttonClassname="bg-white flex-1"
                            textClassname="text-text"
                            visible={canEditResult}
                        />
                        <MealManagerButton
                            title="Recipes"
                            onPress={() => manageButtonClicked('/ManageRecipes' as RelativePathString, { familyId: familyId })}
                            icon="book"
                            buttonClassname="bg-white flex-1"
                            textClassname="text-text"
                            visible={canEditResult}
                        />
                    </View>
                    <ErrorLoading error={error} loading={loading} />
                    {mealPlans.length === 0 ? (
                        <View className="flex-1 items-center justify-center mt-10">
                            <Text className="text-gray-500">No meals planned for this date</Text>
                        </View>
                    ) : null}
                    <View className="flex-col gap-3 mb-32">
                        {mealPlans.length > 0 ? (
                            mealPlans.map((mealPlan) => (
                                <MealPlanCard key={mealPlan.id} mealPlan={mealPlan} />
                            ))
                        ) : null}
                    </View>
                </View>
            </ScrollView>
            <TodayButton
                buttonClassname="bg-white rounded-full absolute bottom-28 left-4 w-20 h-12 flex items-center justify-center border border-gray-100 shadow shadow-sm"
                textClassname="text-text"
                visible={date.toDateString() !== today.toDateString()}
                setDate={setDate}
                setToday={setToday}
            />
            <AddButton
                containerClassname="bg-blue-100 rounded-full absolute bottom-28 right-4 w-16 h-16 flex items-center justify-center shadow shadow-sm"
                onPress={() => { setCreateMealPlan(true) }}
                isVisible={canEditResult}
            />
        </View>
    );
}
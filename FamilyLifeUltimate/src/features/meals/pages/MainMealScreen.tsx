import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import { useAuth } from "@/src/features/auth/AuthContext";
import { User } from "@/src/features/auth/auth.types";
import { TruncatedFamily } from "../../family/family.types";
import { fetchAuthFamilies } from "@/src/utils/fetchAuthFamilies";
import FamilySelector from "../../family/components/FamilySelector";
import { useFamily } from "@/src/features/family/FamilyContext";
import ManagerButton from "@/src/globalComponents/ManagerButton";
import ScreenHeader from "@/src/globalComponents/ScreenHeader";
import { Feather } from "@expo/vector-icons";
import DayList from "../../calendar/components/DayList";
import { months } from "../../calendar/utils/MonthRecord";
import TodayButton from "../../chore/components/TodayButton";
import MealManagerButton from "../components/MealManagerButton";
import { RelativePathString, router } from "expo-router";

function canEdit(user: User | null, familyId: string) {
    if (!user) return false;
    if (!familyId) return false;
    if (!user.activities.get(familyId)) return false;
    return user.activities.get(familyId)!.has("edit_meals") ||
        user.activities.get(familyId)!.has("household_head") ||
        user.activities.get(familyId)!.has("authorized_user");
}

export default function MainMealScreen() {
    const { user, session } = useAuth();
    const { familyId, memberFamilies, setFamilyId } = useFamily();
    const canEditResult: boolean = canEdit(user, familyId);
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [date, setDate] = useState<Date>(new Date());
    const [today, setToday] = useState<Date>(new Date());

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
                <View className="px-3 mt-5">
                    {error ? (
                        <View className="bg-red-50 p-4 rounded-xl border border-red-200 mb-6 flex-row items-center">
                            <Feather name="alert-circle" size={20} color="#b91c1c" />
                            <Text className="text-red-700 font-medium ml-3 flex-1">{error}</Text>
                        </View>
                    ) : null}
                    {loading ? (
                        <ActivityIndicator
                            size="large"
                            color="#0000ff"
                        />
                    ) : null}
                    <View className="mt-2 flex-row gap-3">
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
                </View>
            </ScrollView>
            <TodayButton
                buttonClassname="bg-white rounded-full absolute bottom-28 left-4 w-20 h-12 flex items-center justify-center border border-gray-100 shadow shadow-sm"
                textClassname="text-text"
                visible={date.toDateString() !== today.toDateString()}
                setDate={setDate}
                setToday={setToday}
            />
        </View>
    );
}
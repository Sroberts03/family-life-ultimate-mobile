import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { useAuth } from "@/src/features/auth/AuthContext";
import { User } from "@/src/features/auth/auth.types";
import { TruncatedFamily } from "../../family/family.types";
import { fetchAuthFamilies } from "@/src/utils/fetchAuthFamilies";
import FamilySelector from "../../family/components/FamilySelector";
import { useFamily } from "@/src/features/family/FamilyContext";

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

    const possibleFamilies = [...memberFamilies];

    return (
        <View className="flex-1 bg-background">
            <View className="px-3">
                <FamilySelector
                    possibleFamilies={possibleFamilies}
                    familyId={familyId}
                    setFamilyId={setFamilyId}
                />
            </View>
            <Text>MainMealScreen</Text>
        </View>
    );
}
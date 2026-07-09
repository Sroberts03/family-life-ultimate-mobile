import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useState } from "react";
import { familyRole } from "../family.types";
import { useAuth } from "../../auth/AuthContext";
import { createFamily, joinFamily } from "../services/family.services";
import RoleSelection from "./RoleSelection";
import GlobalErrorDisplay from "@/src/globalComponents/GlobalErrorDisplay";

export default function SetUpFamilyForm() {
    const { finishSignUp, session } = useAuth();
    const [familyId, setFamilyId] = useState<string>("");
    const [role, setRole] = useState<familyRole>("adult");
    const [error, setError] = useState<string | null>(null);

    const submitClicked = async () => {
        setError(null);
        try {
            if (!session) return;
            if (!familyId) {
                setError("Please enter a family invite code");
                return;
            }
            await joinFamily({familyId: familyId, role: role}, session);
            await finishSignUp();
        } catch (e) {
            setError(e instanceof Error ? e.message : "Failed to join family");
        }
    }

    const createNewFamily = async () => {
        setError(null);
        try {
            if (!session) return;
            await createFamily({role: role}, session);
            await finishSignUp();
        } catch (e) {
            setError(e instanceof Error ? e.message : "Failed to join family");
        }
    }

    return (
        <View className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm mb-6">
            {/* Family ID */}
            <View className="mb-6">
                <Text className="text-slate-600 text-sm font-medium mb-2 ml-1">
                    Family Invite Code
                </Text>
                <TextInput
                    className="
                        bg-gray-100
                        text-slate-900
                        px-4
                        h-14
                        rounded-2xl
                        text-base
                        border
                        border-gray-200
                        "
                    placeholder="e.g. FAM-1234-5678"
                    placeholderTextColor="#9ca3af"
                    value={familyId}
                    onChangeText={
                        (text) => {
                            setFamilyId(text);
                            setError("");
                        }
                    }
                    autoCapitalize="none"
                    autoCorrect={false}
                />
            </View>

            {/* Role Selection */}
            <RoleSelection role={role} setRole={setRole} />

            {/* Error Message */}
            {error && <GlobalErrorDisplay error={error} />}

            {/* Submit Button */}
            <TouchableOpacity
                className="bg-indigo-500 py-4 rounded-2xl items-center mt-2"
                activeOpacity={0.8}
                onPress={submitClicked}
            >
                <Text className="text-white text-base font-semibold tracking-wide">
                    Request to Join Family
                </Text>
            </TouchableOpacity>

            {/* Create Family Button */}
            <TouchableOpacity
                className="bg-indigo-100 py-4 rounded-2xl items-center mt-2"
                activeOpacity={0.8}
                onPress={createNewFamily}
            >
                <Text className="text-indigo-500 text-base font-semibold tracking-wide">
                    Create a New Family
                </Text>
            </TouchableOpacity>
        </View>
    );
}

import { ScrollView, Text, TextInput, TouchableOpacity, View, KeyboardAvoidingView, Platform } from "react-native";
import { useAuth } from "../../auth/AuthContext";
import { useState } from "react";
import { familyRole, roles } from "../family.types";
import { Feather } from "@expo/vector-icons";
import RoleSelection from "../components/RoleSelection"
import { createFamily, joinFamily } from "../services/family.services";
import GlobalErrorDisplay from "@/src/globalComponents/GlobalErrorDisplay";

export default function SetUpFamilyScreen() {
    const { signOut, finishSignUp, session } = useAuth();
    const [familyId, setFamilyId] = useState<string>("");
    const [role, setRole] = useState<familyRole>("adult");
    const [ error, setError ] = useState<string | null>(null);

    if (!session) return;

    const submitClicked = async () => {
        setError(null);
        try {
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
            await createFamily({role: role}, session);
            await finishSignUp();
        } catch (e) {
            setError(e instanceof Error ? e.message : "Failed to join family");
        }
    }

    return (
        <KeyboardAvoidingView
            className="flex-1 bg-gray-50"
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                keyboardShouldPersistTaps="handled"
            >
                <View className="flex-1 px-7 py-12">
                    {/* Decorative background accent */}
                    <View className="absolute top-0 left-0 right-0 h-72 bg-indigo-500 rounded-b-[80px] opacity-[0.07]" />

                    {/* Header */}
                    <View className="items-center mt-8 mb-5">
                        <View className="w-16 h-16 bg-indigo-100 rounded-full items-center justify-center mb-5 border border-indigo-200">
                            <Feather name="users" size={28} color="#6366f1" />
                        </View>
                        <Text className="text-slate-900 text-3xl font-bold tracking-tight text-center">
                            Join a Family
                        </Text>
                        <Text className="text-slate-500 text-base mt-2 text-center">
                            Enter a family invite code or create a new family to get started.
                        </Text>
                    </View>

                    {/* Form Card */}
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

                    {/* Footer Actions */}
                    <View className="flex-row justify-center items-center mt-2 pb-8">
                        <TouchableOpacity
                            onPress={signOut}
                            activeOpacity={0.7}
                            className="px-4 py-2"
                        >
                            <Text className="text-slate-500 text-sm font-medium">
                                Sign Out
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
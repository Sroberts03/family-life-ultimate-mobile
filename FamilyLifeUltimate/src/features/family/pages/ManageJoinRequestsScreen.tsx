import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import { Feather } from "@expo/vector-icons";
import { getAllAuthFamilies, getAllJoinRequests, acceptOrDenyJoinRequest } from "../services/family.services";
import { JoinRequest, TrucatedFamily } from "../family.types";
import { useAuth } from "../../auth/AuthContext";

export default function ManageJoinRequestsScreen() {
    const { session } = useAuth();
    const [requests, setRequests] = useState<JoinRequest[]>([]);
    const [familyId, setFamilyId] = useState<string>("");
    const [possibleFamilies, setPossibleFamilies] = useState<TrucatedFamily[]>([]);
    const [error, setError] = useState<string>("");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchAuthFamilies = async () => {
            if (!session) return;
            try {
                const families = await getAllAuthFamilies(session);
                setPossibleFamilies(families);
                if (families.length > 0) {
                    setFamilyId(families[0].familyId);
                }
            } catch (e) {
                setError(e instanceof Error ? e.message : "Failed to get families");
            }
        };
        fetchAuthFamilies();
    }, []);

    useEffect(() => {
        const fetchJoinRequests = async () => {
            if (!session) return;
            if (!familyId) {
                setIsLoading(false);
                return;
            }
            setIsLoading(true);
            try {
                const joinRequests = await getAllJoinRequests(familyId, session);
                setRequests(joinRequests);
            } catch (e) {
                setError(e instanceof Error ? e.message : "Failed to get requests");
            } finally {
                setIsLoading(false);
            }
        };
        fetchJoinRequests();
    }, [familyId]);

    if (!session) return null;

    const handleAction = async (requestId: number, accept: boolean) => {
        try {
            await acceptOrDenyJoinRequest(requestId, accept, session);
            setRequests(prev => prev.filter(r => r.requestId !== requestId));
        } catch (e) {
            setError(e instanceof Error ? e.message : "Failed to process request");
        }
    };

    const getRoleColor = (role: string) => {
        switch (role.toLowerCase()) {
            case 'adult': return 'bg-indigo-100 text-indigo-700';
            case 'child': return 'bg-emerald-100 text-emerald-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <View className="flex-1">
            {/* Header Section */}
            <View className="px-6 pt-6 pb-5 bg-white border-b border-gray-200">
                <Text className="text-3xl font-bold text-slate-900 tracking-tight">
                    Requests
                </Text>
                <Text className="text-base text-slate-500 mt-1">
                    Manage members joining your family.
                </Text>
            </View>

            <ScrollView className="flex-1 px-6 pt-6">
                {error ? (
                    <View className="bg-red-50 p-4 rounded-xl border border-red-200 mb-6 flex-row items-center">
                        <Feather name="alert-circle" size={20} color="#b91c1c" />
                        <Text className="text-red-700 font-medium ml-3 flex-1">{error}</Text>
                    </View>
                ) : null}

                {/* Family Selector (only show if multiple families exist) */}
                {possibleFamilies.length > 1 && (
                    <View className="mb-8">
                        <Text className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 ml-1">
                            Select Family
                        </Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
                            {possibleFamilies.map((family) => {
                                const isSelected = family.familyId === familyId;
                                return (
                                    <TouchableOpacity
                                        key={family.familyId}
                                        onPress={() => setFamilyId(family.familyId)}
                                        className={`px-5 py-2.5 rounded-full border mr-3 transition-all ${isSelected
                                                ? 'bg-slate-900 border-slate-900 shadow-sm'
                                                : 'bg-white border-gray-200'
                                            }`}
                                        activeOpacity={0.7}
                                    >
                                        <Text className={`font-semibold ${isSelected ? 'text-white' : 'text-slate-600'
                                            }`}>
                                            {family.familyName}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </ScrollView>
                    </View>
                )}

                {/* Requests List */}
                <View className="pb-12">
                    {requests.length === 0 ? (
                        <View className="items-center justify-center py-16 bg-white rounded-[32px] border border-gray-200 shadow-sm border-dashed mt-4">
                            <View className="w-20 h-20 bg-indigo-50 rounded-full items-center justify-center mb-5 border-4 border-white shadow-sm">
                                <Feather name="inbox" size={28} color="#6366f1" />
                            </View>
                            <Text className="text-slate-900 font-bold text-xl">No Pending Requests</Text>
                            <Text className="text-slate-500 text-center mt-2 px-10 leading-relaxed text-base">
                                You're all caught up! New family member requests will appear here.
                            </Text>
                        </View>
                    ) : (
                        requests.map((request) => (
                            <View
                                key={request.requestId}
                                className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm mb-4"
                            >
                                <View className="flex-row items-center mb-5 mt-1">
                                    <View className="w-14 h-14 bg-slate-50 rounded-full items-center justify-center border border-slate-100 mr-4">
                                        <Feather name="user" size={24} color="#64748b" />
                                    </View>
                                    <View className="flex-1">
                                        <Text className="text-xl font-bold text-slate-900">
                                            {request.fullName}
                                        </Text>
                                        <View className="flex-row items-center mt-1.5">
                                            <View className={`px-2.5 py-1 rounded-md ${getRoleColor(request.role)}`}>
                                                <Text className="text-[10px] font-bold uppercase tracking-widest">
                                                    {request.role}
                                                </Text>
                                            </View>
                                            <Text className="text-xs font-medium text-slate-400 ml-3">
                                                Wants to join
                                            </Text>
                                        </View>
                                    </View>
                                </View>

                                <View className="flex-row">
                                    <TouchableOpacity
                                        onPress={() => handleAction(request.requestId, false)}
                                        className="flex-1 py-3.5 rounded-2xl border border-slate-200 bg-white items-center justify-center mr-3"
                                        activeOpacity={0.7}
                                    >
                                        <Text className="text-slate-600 font-bold text-sm">Decline</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => handleAction(request.requestId, true)}
                                        className="flex-1 py-3.5 rounded-2xl bg-indigo-500 items-center justify-center"
                                        activeOpacity={0.8}
                                    >
                                        <Text className="text-white font-bold text-sm">Approve</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))
                    )}
                </View>
            </ScrollView>
        </View>
    );
}
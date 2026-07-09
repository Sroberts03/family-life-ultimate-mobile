import { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { getAllAuthFamilies, getAllJoinRequests, acceptOrDenyJoinRequest } from "../services/family.services";
import { JoinRequest, TrucatedFamily } from "../family.types";
import { useAuth } from "../../auth/AuthContext";
import ScreenHeader from "../components/ScreenHeader";
import FamilySelector from "../components/FamilySelector";
import JoinRequestCard from "../components/JoinRequestCard";
import EmptyRequestsState from "../components/EmptyRequestsState";
import FamilyJoinCode from "../components/FamilyJoinCode";

export default function ManageJoinRequestsScreen() {
    const { session } = useAuth();
    const [requests, setRequests] = useState<JoinRequest[]>([]);
    const [familyId, setFamilyId] = useState<string>("");
    const [possibleFamilies, setPossibleFamilies] = useState<TrucatedFamily[]>([]);
    const [error, setError] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [showFamilyCode, setShowFamilyCode] = useState<boolean>(false);

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

    return (
        <View className="flex-1">
            <ScreenHeader 
                title="Requests" 
                subtitle="Manage members joining your family." 
            />

            <ScrollView className="flex-1 px-6 pt-6 bg-background">
                {error ? (
                    <View className="bg-red-50 p-4 rounded-xl border border-red-200 mb-6 flex-row items-center">
                        <Feather name="alert-circle" size={20} color="#b91c1c" />
                        <Text className="text-red-700 font-medium ml-3 flex-1">{error}</Text>
                    </View>
                ) : null}

                <FamilySelector 
                    possibleFamilies={possibleFamilies} 
                    familyId={familyId} 
                    setFamilyId={setFamilyId} 
                />
                

                <View className="pb-12">
                    {requests.length === 0 ? (
                        <EmptyRequestsState />
                    ) : (
                        requests.map((request) => (
                            <JoinRequestCard 
                                key={request.requestId} 
                                request={request} 
                                onAction={handleAction} 
                            />
                        ))
                    )}
                </View>
                <View className="pb-8 pt-4">
                    <TouchableOpacity 
                        onPress={() => setShowFamilyCode(!showFamilyCode)} 
                        className="bg-indigo-50 border border-indigo-100 px-5 py-4 flex-row items-center justify-center rounded-2xl mx-1"
                        activeOpacity={0.7}
                    >
                        <Feather name={showFamilyCode ? "eye-off" : "eye"} size={18} color="#6366f1" />
                        <Text className="text-primary font-semibold text-base ml-2">
                            {showFamilyCode ? "Hide" : "Show"} Family Code
                        </Text>
                    </TouchableOpacity>
                </View>
                
                {showFamilyCode && <FamilyJoinCode familyId={familyId}/>}
            </ScrollView>
        </View>
    );
}
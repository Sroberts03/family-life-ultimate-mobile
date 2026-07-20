import { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { getAllAuthFamilies, getAllJoinRequests, acceptOrDenyJoinRequest } from "../services/family.services";
import { JoinRequest, TruncatedFamily } from "../family.types";
import { useAuth } from "../../auth/AuthContext";
import ScreenHeader from "../components/ScreenHeader";
import FamilySelector from "../components/FamilySelector";
import JoinRequestCard from "../components/JoinRequestCard";
import EmptyRequestsState from "../components/EmptyRequestsState";
import BackButton from "../../../globalComponents/BackButton";

type Props = {
    familyId: string;
}

export default function ManageJoinRequestsScreen({ familyId }: Props) {
    const { session } = useAuth();
    const [requests, setRequests] = useState<JoinRequest[]>([]);
    const [error, setError] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(true);

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
            <BackButton
                className="w-12 h-12 
                bg-white border border-gray-100 rounded-full 
                items-center justify-center transition-colors
                absolute top-4 left-4 z-50
                shadow-sm
                "
            />

            <ScrollView className="flex-1 px-6 pt-6 bg-background">
                {error ? (
                    <View className="bg-red-50 p-4 rounded-xl border border-red-200 mb-6 flex-row items-center">
                        <Feather name="alert-circle" size={20} color="#b91c1c" />
                        <Text className="text-red-700 font-medium ml-3 flex-1">{error}</Text>
                    </View>
                ) : null}

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
            </ScrollView>
        </View>
    );
}
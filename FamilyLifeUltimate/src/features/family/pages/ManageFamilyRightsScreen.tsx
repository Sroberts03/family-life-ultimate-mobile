import { ScrollView, View, Text } from "react-native";
import ScreenHeader from "../components/ScreenHeader";
import BackButton from "../components/BackButton";
import FamilyMemberRightsCard from "../components/FamilyMemberRightsCard";
import { GetFamilyMembers } from "../services/family.services";
import { useAuth } from "../../auth/AuthContext";
import { useEffect, useState } from "react";
import { FamilyMember } from "../family.types";
import { Feather } from "@expo/vector-icons";

interface props {
    familyId: string;
}
export default function ManageFamilyRightsScreen({familyId}: props) {
    const { session, user } = useAuth();
    const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [editRightsModal, setEditRightsModal] = useState<string | null>(null);

    if (!session) return null;

    useEffect(() => {
        const fetchFamilyMembers = async () => {
            try {
                setLoading(true)
                const members = await GetFamilyMembers(familyId, session);
                setFamilyMembers(members);
            } catch (e) {
                setError(e instanceof Error ? e.message : "Failed to process request");
            } finally {
                setLoading(false)
            }
        };
        fetchFamilyMembers();
    }, []);
    
    return (
        <View className="flex-1 bg-background">
            <ScreenHeader title="Family Rights" subtitle="Manage permissions for your family members." />
            {error ? (
                <View className="bg-red-50 p-4 rounded-xl border border-red-200 mb-6 flex-row items-center">
                    <Feather name="alert-circle" size={20} color="#b91c1c" />
                    <Text className="text-red-700 font-medium ml-3 flex-1">{error}</Text>
                </View>
            ) : null}
            <BackButton 
                className="w-12 h-12 
                bg-white border border-gray-100 rounded-full 
                items-center justify-center transition-colors
                absolute top-1 left-4 z-50
                shadow-sm
                "
            />
            <ScrollView className="flex-1 px-5 pt-6 pb-12">
                {familyMembers.map((member) => (
                    <FamilyMemberRightsCard 
                        key={member.userId}
                        member={member}
                        isMe={member.userId === user?.id}
                        onEditRights={setEditRightsModal}
                    />
                ))}
            </ScrollView>
        </View>
    );
}
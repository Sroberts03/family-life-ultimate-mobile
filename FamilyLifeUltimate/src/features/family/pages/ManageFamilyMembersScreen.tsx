import { ActivityIndicator, ScrollView, Text, View } from "react-native"
import ScreenHeader from "../../../globalComponents/ScreenHeader"
import BackButton from "../../../globalComponents/BackButton"
import { useState } from "react"
import { Feather } from "@expo/vector-icons"
import { FamilyMember } from "../family.types";
import { useAuth } from "../../auth/AuthContext";
import { useEffect } from "react";
import { GetFamilyMembers, RemoveFamilyMember } from "../services/family.services"
import FamilyMemberRightsCard from "../components/FamilyMemberCard"
import FamilyMemberCard from "../components/FamilyMemberCard"
import ConfirmMemberRemoval from "../components/ConfirmMemberRemoval"
import ErrorLoading from "@/src/globalComponents/ErrorLoading"

interface props {
    familyId: string;
}
export default function ManageFamilyMembersScreen({ familyId }: props) {
    const { session, user } = useAuth();
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
    const [memberToRemove, setMemberToRemove] = useState<string | null>(null);

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

    const onRemoveMember = (userId: string) => {
        setMemberToRemove(userId);
    }

    const onCancelRemoval = () => {
        setMemberToRemove(null);
    }

    const onConfirmRemoval = async () => {
        if (!memberToRemove) return;
        try {
            setLoading(true)
            await RemoveFamilyMember({ userId: memberToRemove, familyId }, session);
            setFamilyMembers(prev => prev.filter(member => member.userId !== memberToRemove));
        } catch (e) {
            setError(e instanceof Error ? e.message : "Failed to process request");
        } finally {
            setMemberToRemove(null);
            setLoading(false)
        }
    }

    return (
        <View className="flex-1 bg-background">
            <ScreenHeader title="Family Members" subtitle="Manage members in your family." />
            <ErrorLoading error={error} loading={loading} />
            <BackButton
                className="w-12 h-12 
                bg-white border border-gray-100 rounded-full 
                items-center justify-center transition-colors
                absolute top-4 left-4 z-50
                shadow-sm
                "
            />
            <ScrollView className="flex-1 px-5 pt-6 pb-12">
                {familyMembers.map((member) => (
                    <FamilyMemberCard
                        key={member.userId}
                        member={member}
                        isMe={member.userId === user?.id}
                        onRemoveMember={onRemoveMember}
                    />
                ))}
            </ScrollView>
            <ConfirmMemberRemoval
                isVisible={memberToRemove !== null}
                onConfirm={onConfirmRemoval}
                onCancel={onCancelRemoval}
            />
        </View>
    )
}
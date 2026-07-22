import { ScrollView, View, Text, ActivityIndicator } from "react-native";
import ScreenHeader from "../../../globalComponents/ScreenHeader";
import BackButton from "../../../globalComponents/BackButton";
import { GetFamilyMembers } from "../services/family.services";
import { useAuth } from "../../auth/AuthContext";
import React, { useEffect, useState } from "react";
import { FamilyMember } from "../family.types";
import { Feather } from "@expo/vector-icons";
import EditActivityModal from "../components/EditActivityModal";
import { GetAllActivities, SetPermissions } from "../../activities/service/activities.service";
import { DetailedActivity } from "../../activities/types/DetailedActivity";
import FamilyMemberCard from "../components/FamilyMemberCard";
import ErrorLoading from "@/src/globalComponents/ErrorLoading";

interface props {
    familyId: string;
}
export default function ManageFamilyRightsScreen({ familyId }: props) {
    const { session, user } = useAuth();
    const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [editRightsModal, setEditRightsModal] = useState<string | null>(null);
    const [allActivities, setAllActivities] = useState<DetailedActivity[]>([]);

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

    useEffect(() => {
        const fetchAllActivities = async () => {
            try {
                setLoading(true)
                const activities = await GetAllActivities(session);
                setAllActivities(activities);
            } catch (e) {
                setError(e instanceof Error ? e.message : "Failed to process request");
            } finally {
                setLoading(false)
            }
        };
        fetchAllActivities();
    }, []);

    const onSaveActivites = async (permissions: Record<number, boolean>, userId: string, familyId: string) => {
        try {
            setLoading(true)
            await SetPermissions({ permissions, userId, familyId }, session)

            const updatedActivities = allActivities
                .filter(a => permissions[a.activityId])
                .map(a => ({
                    activityId: a.activityId,
                    activityName: a.name,
                    familyId: familyId
                }));

            setFamilyMembers(prev => prev.map(member =>
                member.userId === userId ? { ...member, activities: updatedActivities } : member
            ));

            setEditRightsModal(null);
        } catch (e) {
            setError(e instanceof Error ? e.message : "Failed to process request");
        } finally {
            setEditRightsModal(null);
            setLoading(false)
        }
    }

    const handleEditRightsPress = (userId: string) => {
        setEditRightsModal(userId);
        setError("");
    }

    return (
        <View className="flex-1 bg-background">
            <ScreenHeader title="Family Rights" subtitle="Manage permissions for your family." />
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
                        onEditRights={() => handleEditRightsPress(member.userId)}
                    />
                ))}
            </ScrollView>
            {editRightsModal ? (
                <EditActivityModal
                    visible={!!editRightsModal}
                    onClose={() => setEditRightsModal(null)}
                    familyMemberId={editRightsModal!}
                    familyId={familyId}
                    currentUserActivities={familyMembers.filter(member => member.userId === editRightsModal)[0].activities || []}
                    allActivities={allActivities}
                    onSave={onSaveActivites}
                />
            ) : null}
        </View>
    );
}
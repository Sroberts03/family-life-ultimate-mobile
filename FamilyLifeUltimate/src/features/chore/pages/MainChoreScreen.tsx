import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { useEffect, useState } from "react";
import { FamilyMember, TruncatedFamily } from "../../family/family.types";
import { useAuth } from "../../auth/AuthContext";
import { getAllFamilies, GetFamilyMembers } from "../../family/services/family.services";
import FamilySelector from "../../family/components/FamilySelector";
import { Chore } from "../chore.types";
import ChoreCard from "../components/ChoreCard";
import { getAllChoresForFamily, toggleChoreComplete, createChore, deleteChore, submitChoreAssignments, GetChoreInfo, updateChore } from "../services/chore.services";
import DayList from "../../calendar/components/DayList";
import TodayButton from "../components/TodayButton";
import { Feather } from "@expo/vector-icons";
import AddButton from "../../../globalComponents/AddButton";
import CreateChoreModal from "../components/CreateChoreModal";
import { ChoreDataDto } from "../dto/ChoreDataDto";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import { months } from "../../calendar/utils/MonthRecord";
import ChoreAssignment from "../components/ChoreAssignment";
import { fetchAuthFamilies } from "@/src/utils/fetchAuthFamilies";
import { useFamily } from "../../family/FamilyContext";
import { toLocalDateString } from "@/src/utils/toLocaleDateString";

export default function MainChoreScreen() {
    const { session, user } = useAuth();
    const { familyId, memberFamilies, setFamilyId } = useFamily();
    const [today, setToday] = useState<Date>(new Date());
    const [date, setDate] = useState<Date>(new Date());
    const [chores, setChores] = useState<Record<number, Chore>>({});
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [createModalVisible, setCreateModalVisible] = useState<boolean>(false);
    const [editingChore, setEditingChore] = useState<number | null>(null);
    const [editingChoreInfo, setEditingChoreInfo] = useState<ChoreDataDto | null>(null);
    const [deletingChore, setDeletingChore] = useState<Chore | null>(null);
    const [asigneeWindowVisible, setAsigneeWindowVisible] = useState<boolean>(false);
    const [choreAssigneeIds, setChoreAssigneeIds] = useState<Set<string>>(new Set());
    const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
    const [choreGettingAssignees, setChoreGettingAssignees] = useState<number | null>(null);

    const possibleFamilies = [...memberFamilies];

    useEffect(() => {
        const fetchChoresForFamily = async () => {
            if (!session || !familyId) return;
            try {
                setError("");
                setLoading(true);
                const chores = await getAllChoresForFamily(familyId, toLocalDateString(date), session);
                setChores(chores);
            } catch (e) {
                setError(e instanceof Error ? e.message : "Failed to get chores");
            } finally {
                setLoading(false);
            }
        };
        fetchChoresForFamily();
    }, [familyId, date])

    useEffect(() => {
        const fetchFamilyMembers = async () => {
            if (!session || !familyId) return;
            if (!userCanEdit()) return;
            try {
                setError("");
                setLoading(true);
                const familyMembers = await GetFamilyMembers(familyId, session);
                setFamilyMembers(familyMembers);
            } catch (e) {
                setError(e instanceof Error ? e.message : "Failed to get family members");
            } finally {
                setLoading(false);
            }
        };
        fetchFamilyMembers();
    }, [familyId])

    useEffect(() => {
        const getEditChoreInfo = async () => {
            if (!session || !editingChore) return;
            if (!userCanEdit()) return;
            try {
                setError("");
                setLoading(true);
                const choreInfo = await GetChoreInfo(editingChore, session);
                setEditingChoreInfo(choreInfo);
            } catch (e) {
                setError(e instanceof Error ? e.message : "Failed to get chore assignees");
            } finally {
                setLoading(false);
            }
        };
        getEditChoreInfo();
    }, [editingChore])

    if (!session || !user) return null;

    const userCanEdit = () => {
        if (!familyId) return false;
        if (!user.activities.get(familyId)) return false;
        return user.activities.get(familyId)!.has("edit_chores")
            || user.activities.get(familyId)!.has("household_head")
            || user.activities.get(familyId)!.has("authorized_user");
    }

    const onPress = (action: "edit" | "delete", chore: Chore) => {
        if (action === "edit") {
            setEditingChore(chore.id);
        } else if (action === "delete") {
            setDeletingChore(chore);
        }
    }

    const deleteChoreSubmit = async (choreId: number, thisAndFuture: boolean = false) => {
        if (!session || !familyId) return null;
        try {
            setError("");
            setLoading(true);
            await deleteChore(choreId, session, thisAndFuture);
            const updatedChores = { ...chores };
            delete updatedChores[choreId];
            setChores(updatedChores);
        } catch (e) {
            setError(e instanceof Error ? e.message : "Failed to delete chore");
        } finally {
            setLoading(false);
            setDeletingChore(null);
        }
    }

    const updateChoreSubmit = async (choreId: number, name: string, description: string, recurring: string, startDate: string, endDate: string) => {
        if (!session || !choreId) return null;
        try {
            setError("");
            setLoading(true);
            const chore = await updateChore({ choreId, familyId, name, description, recurring, startDate, endDate }, session);
            const updatedChores = { ...chores };
            updatedChores[choreId] = chore;
            setChores(updatedChores);
        } catch (e) {
            setError(e instanceof Error ? e.message : "Failed to update chore");
        } finally {
            setLoading(false);
        }
    }

    const markComplete = async (choreId: number, changeToNotComplete: boolean = false) => {
        const now = new Date();
        if (!choreId) return null;
        try {
            await toggleChoreComplete({ choreId, dateCompleted: changeToNotComplete ? null : now }, session);
            const chore = chores[choreId];
            if (chore) {
                chore.dateCompleted = changeToNotComplete ? undefined : now;
                setChores({ ...chores, [choreId]: chore });
            }
        } catch (e) {
            setError(e instanceof Error ? e.message : "Failed to mark chore complete");
        }
    }

    const createChoreSubmit = async (name: string, description: string, recurring: string, startDate: string, endDate: string) => {
        if (!session || !familyId) return null;
        try {
            setError("");
            setLoading(true);
            const chore = await createChore({ familyId, name, description, recurring, startDate, endDate }, session);
            if (startDate == toLocalDateString(date)) {
                setChores({ ...chores, [chore.id]: chore });
            }
        } catch (e) {
            setError(e instanceof Error ? e.message : "Failed to create chore");
        } finally {
            setLoading(false);
        }
    }

    const submitChoreAssignment = async (choreId: number, choreAssigneeIds: Set<string>) => {
        if (!session || !choreId) return null;
        try {
            setError("");
            setLoading(true);
            const chore = await submitChoreAssignments({ choreId, choreAssigneeIds }, session);
            const updatedChores = { ...chores };
            updatedChores[choreId] = chore;
            setChores(updatedChores);
        } catch (e) {
            setError(e instanceof Error ? e.message : "Failed to submit chore assignments");
        } finally {
            setLoading(false);
            setAsigneeWindowVisible(false);
        }
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
            <ScrollView className="px-3">
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
                {Object.values(chores).map((chore) => (
                    <ChoreCard
                        chore={chore}
                        key={chore.id}
                        userCanEdit={userCanEdit()}
                        onPress={onPress}
                        markComplete={markComplete}
                        setAsigneeWindowVisible={setAsigneeWindowVisible}
                        setChoreAssigneeIds={setChoreAssigneeIds}
                        setChoreGettingAssignees={setChoreGettingAssignees}
                    />
                ))}
                {Object.values(chores).length === 0 && (
                    <View className="flex-1 items-center justify-center mt-10">
                        <Text className="text-gray-500">No chores for this date.</Text>
                    </View>
                )}
            </ScrollView>
            <TodayButton
                buttonClassname="bg-white rounded-full absolute bottom-28 left-4 w-20 h-12 flex items-center justify-center border border-gray-100 shadow shadow-sm"
                textClassname="text-text"
                visible={date.toDateString() !== today.toDateString()}
                setDate={setDate}
                setToday={setToday}
            />
            <AddButton
                containerClassname="bg-blue-100 rounded-full absolute bottom-28 right-4 w-16 h-16 flex items-center justify-center shadow shadow-sm"
                onPress={() => setCreateModalVisible(true)}
                isVisible={userCanEdit()}
            />
            <CreateChoreModal
                visible={createModalVisible}
                onClose={() => setCreateModalVisible(false)}
                onSubmit={createChoreSubmit}
            />
            <CreateChoreModal
                visible={!!editingChore}
                onClose={() => setEditingChore(null)}
                onUpdate={updateChoreSubmit}
                choreName={editingChoreInfo?.name}
                choreDescription={editingChoreInfo?.description}
                choreRecurring={editingChoreInfo?.recurring}
                choreStartDate={editingChoreInfo?.startDate}
                choreEndDate={editingChoreInfo?.endDate}
                choreId={!editingChore ? 0 : editingChore}
                isUpdate={true}
            />
            {deletingChore && (
                <ConfirmDeleteModal
                    visible={true}
                    onClose={() => setDeletingChore(null)}
                    onSubmit={deleteChoreSubmit}
                    chore={deletingChore}
                />
            )}
            <ChoreAssignment
                visible={asigneeWindowVisible}
                onClose={() => setAsigneeWindowVisible(false)}
                onSubmit={submitChoreAssignment}
                choreId={choreGettingAssignees ?? 0}
                familyMembers={familyMembers}
                choreAssigneeIds={choreAssigneeIds}
            />

        </View>
    );
}
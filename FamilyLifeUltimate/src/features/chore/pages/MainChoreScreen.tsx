import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { useEffect, useState } from "react";
import { TruncatedFamily } from "../../family/family.types";
import { useAuth } from "../../auth/AuthContext";
import { getAllAuthFamilies, getAllFamilies } from "../../family/services/family.services";
import FamilySelector from "../../family/components/FamilySelector";
import { Chore } from "../chore.types";
import ChoreCard from "../components/ChoreCard";
import { getAllChoresForFamily, markChoreComplete } from "../services/chore.services";
import DayList from "../../calendar/components/DayList";
import TodayButton from "../components/TodayButton";
import { Feather } from "@expo/vector-icons";

function toLocalDateString(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

export default function MainChoreScreen() {
    const { session, user } = useAuth();
    const [today, setToday] = useState<Date>(new Date());
    const [date, setDate] = useState<Date>(new Date());
    const [possibleFamilies, setPossibleFamilies] = useState<TruncatedFamily[]>([]);
    const [familyId, setFamilyId] = useState<string>("");
    const [ chores, setChores ] = useState<Record<number, Chore>>({});
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

     useEffect(() => {
            const fetchAuthFamilies = async () => {
                if (!session) return;
                try {
                    setLoading(true);
                    const families = await getAllFamilies(session);
                    setPossibleFamilies(families);
                    console.log("families", families);
                    if (families.length > 0) {
                        setFamilyId(families[0].familyId);
                    }
                } catch (e) {
                    setError(e instanceof Error ? e.message : "Failed to get families");
                } finally {
                    setLoading(false);
                }
            };
            fetchAuthFamilies();
    }, []);

    useEffect(() => {
        const fetchChoresForFamily = async () => {
            if (!session || !familyId) return;
            try {
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

    if (!session || !user ) return null;

    const userCanEdit = () => {
        if (!familyId) return false;
        if (!user.activities.get(familyId)) return false;
        return user.activities.get(familyId)!.has("edit_chores") 
            || user.activities.get(familyId)!.has("household_head")
            || user.activities.get(familyId)!.has("authorized_user");
    }

    const onPress = (action: "edit" | "delete", chore: Chore) => {
        console.log(action, chore);
    }

    const markComplete = async (choreId: number) => {
        const now = new Date();
        if (!choreId) return null;
        try {
            await markChoreComplete({choreId, dateCompleted: now}, session);
            const chore = chores[choreId];
            if (chore) {
                chore.dateCompleted = now;
                setChores({...chores, [choreId]: chore});
            }
        } catch (e) {
            setError(e instanceof Error ? e.message : "Failed to mark chore complete");
        }
    }

    const todayPressed = () => {
        const now = new Date();
        setToday(now);
        setDate(now);
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
                    <ChoreCard chore={chore} key={chore.id} userCanEdit={userCanEdit()} onPress={onPress} markComplete={markComplete}/>
                ))}
                {Object.values(chores).length === 0 && (
                    <View className="flex-1 items-center justify-center mt-10">
                        <Text className="text-gray-500">No chores for this date.</Text>
                    </View>
                )}
            </ScrollView>
            <TodayButton
                buttonClassname="bg-white rounded-full absolute bottom-28 left-4 w-20 h-12 flex items-center justify-center border border-gray-100"
                textClassname="text-text"
                visible={date.toDateString() !== today.toDateString()} 
                onPress={todayPressed}
            />
        </View>
    );
}
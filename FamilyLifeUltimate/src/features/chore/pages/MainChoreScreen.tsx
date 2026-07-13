import { ScrollView, Text, View } from "react-native";
import { useEffect, useState } from "react";
import { TruncatedFamily } from "../../family/family.types";
import { useAuth } from "../../auth/AuthContext";
import { getAllAuthFamilies } from "../../family/services/family.services";
import FamilySelector from "../../family/components/FamilySelector";
import { Chore } from "../chore.types";
import ChoreCard from "../components/ChoreCard";
import { getAllChoresForFamily } from "../services/chore.services";
import DayList from "../../calendar/components/DayList";
import TodayButton from "../components/TodayButton";

export default function MainChoreScreen() {
    const { session, user } = useAuth();
    const [today, setToday] = useState<Date>(new Date());
    const [date, setDate] = useState<Date>(new Date());
    const [possibleFamilies, setPossibleFamilies] = useState<TruncatedFamily[]>([]);
    const [familyId, setFamilyId] = useState<string>("");
    const [ chores, setChores ] = useState<Record<number, Chore>>({});
    const [error, setError] = useState<string>("");

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
        const fetchChoresForFamily = async () => {
            if (!session || !familyId) return;
            try {
                const chores = await getAllChoresForFamily(familyId, date, session);
                setChores(chores);
            } catch (e) {
                setError(e instanceof Error ? e.message : "Failed to get chores");
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

    const todayPressed = () => {
        setToday(new Date());
        setDate(today);
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
            <DayList dateBeingViewed={date} setDateBeingViewed={setDate} today={new Date()} />
            <ScrollView className="px-3">
                {Object.values(chores).map((chore) => (
                    <ChoreCard chore={chore} key={chore.id} userCanEdit={userCanEdit()} onPress={onPress}/>
                ))}
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
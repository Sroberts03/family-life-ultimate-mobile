import { Feather } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Text, TouchableOpacity, View, ScrollView } from "react-native";
import FamilyJoinCode from "../components/FamilyJoinCode";
import { TruncatedFamily } from "../family.types";
import { useAuth } from "../../auth/AuthContext";
import { getAllAuthFamilies } from "../services/family.services";
import FamilySelector from "../components/FamilySelector";
import ScreenHeader from "../components/ScreenHeader";
import ManagerButton from "../components/ManagerButton";
import { RelativePathString, router } from "expo-router";

export default function FamilyManagerScreen() {
    const { session } = useAuth();
    const [possibleFamilies, setPossibleFamilies] = useState<TruncatedFamily[]>([]);
    const [familyId, setFamilyId] = useState<string>("");
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

    const manageButtonClicked = (pathName: RelativePathString, params: any) => {
        router.push({ pathname: pathName, params: params })
    }

    return (
        <View className="flex-1 bg-background">
            <ScreenHeader
                title="Family Manager"
                subtitle="Manage your family settings."
            />
            <ScrollView>
                <View className="mt-5 px-3">
                    <FamilySelector
                        possibleFamilies={possibleFamilies}
                        familyId={familyId}
                        setFamilyId={setFamilyId}
                    />

                    <ManagerButton title="Manage Join Requests" subtitle="Approve or decline join requests." onPress={() => manageButtonClicked('/ManageJoinRequests' as RelativePathString, { familyId: familyId })} icon="users" />
                    <ManagerButton title="Manage Family Rights" subtitle="Edit family rights." onPress={() => manageButtonClicked('/ManageFamilyRights' as RelativePathString, { familyId: familyId })} icon="feather" />
                    
                    <FamilyJoinCode familyId={familyId} />
                </View>
            </ScrollView>
        </View>
    )
}
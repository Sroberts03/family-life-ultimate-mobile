import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { TrucatedFamily } from "../family.types";

interface FamilySelectorProps {
    possibleFamilies: TrucatedFamily[];
    familyId: string;
    setFamilyId: (id: string) => void;
}

export default function FamilySelector({ possibleFamilies, familyId, setFamilyId }: FamilySelectorProps) {
    if (possibleFamilies.length <= 1) return

    return (
        <View className="mb-6">
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
    );
}

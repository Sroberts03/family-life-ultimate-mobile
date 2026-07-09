import { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import * as Clipboard from 'expo-clipboard';

interface FamilyJoinCodeProps {
    familyId: string;
}

export default function FamilyJoinCode({ familyId }: FamilyJoinCodeProps) {
    const [copied, setCopied] = useState<boolean>(false)

    const copyClicked = async () => {
        await Clipboard.setStringAsync("Here's the code to join the family group on Family Life Ultimate: " + familyId);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    return (
        <View className="mt-4 mb-40 bg-surface rounded-3xl p-6 border border-gray-200 shadow-sm items-center mx-1">
            <View className="w-14 h-14 bg-indigo-50 rounded-full items-center justify-center mb-4 border border-indigo-100">
                <Feather name="share-2" size={24} color="#6366f1" />
            </View>
            
            <Text className="text-text font-bold text-xl mb-2">
                Invite Members
            </Text>
            
            <Text className="text-text-muted text-center text-sm mb-6 px-2 leading-relaxed">
                Share this unique code with anyone you want to join your family group.
            </Text>
            
            <View className="bg-background border border-gray-200 rounded-2xl w-full flex-row items-center overflow-hidden">
                <View className="flex-1 px-4 py-4">
                    <Text 
                        className="text-text font-semibold text-sm" 
                        numberOfLines={1} 
                        ellipsizeMode="middle"
                    >
                        {familyId}
                    </Text>
                </View>
                <TouchableOpacity 
                    className="bg-primary px-5 py-4 flex-row items-center justify-center"
                    activeOpacity={0.8}
                    onPress={copyClicked}
                >
                    {copied ? (
                        <Feather name="check" size={18} color="white" />
                    ) : (
                        <Feather name="copy" size={18} color="white" />
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
}
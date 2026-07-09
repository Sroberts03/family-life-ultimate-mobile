import { familyRole, roles } from "../family.types";
import { Feather } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";

type RoleSelectionProps = {
    role: familyRole;
    setRole: (role: familyRole) => void;
}

export default function RoleSelection({ role, setRole }: RoleSelectionProps) {
    return (
        <View className="mb-6">
                            <Text className="text-slate-600 text-sm font-medium mb-3 ml-1">
                                Select Your Role
                            </Text>
                            <View className="gap-3">
                                {roles.map((r) => (
                                    <TouchableOpacity
                                        key={r.id}
                                        activeOpacity={0.7}
                                        onPress={() => setRole(r.id)}
                                        className={`flex-row items-center p-4 rounded-2xl border ${
                                            role === r.id 
                                                ? 'bg-indigo-50 border-indigo-500' 
                                                : 'bg-white border-gray-200'
                                        }`}
                                    >
                                        <View className={`w-10 h-10 rounded-full items-center justify-center mr-4 ${
                                            role === r.id ? 'bg-indigo-100' : 'bg-gray-100'
                                        }`}>
                                            <Feather 
                                                name={r.icon} 
                                                size={20} 
                                                color={role === r.id ? '#6366f1' : '#64748b'} 
                                            />
                                        </View>
                                        <View className="flex-1">
                                            <Text className={`text-base font-semibold ${
                                                role === r.id ? 'text-indigo-900' : 'text-slate-700'
                                            }`}>
                                                {r.title}
                                            </Text>
                                            <Text className={`text-xs mt-0.5 ${
                                                role === r.id ? 'text-indigo-600' : 'text-slate-500'
                                            }`}>
                                                {r.description}
                                            </Text>
                                        </View>
                                        <View className={`w-5 h-5 rounded-full border items-center justify-center ${
                                            role === r.id ? 'border-indigo-500' : 'border-gray-300'
                                        }`}>
                                            {role === r.id && (
                                                <View className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                                            )}
                                        </View>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
    )
}
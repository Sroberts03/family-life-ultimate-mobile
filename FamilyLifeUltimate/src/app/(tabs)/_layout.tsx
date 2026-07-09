import { Tabs } from "expo-router";
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
    return (
        <Tabs screenOptions= {{ 
            tabBarStyle: {
                width: '90%',
                height: 60,
                borderRadius: 30,
                bottom: 30,
                position: 'absolute',
                left: '50%',
                marginLeft: '5%',
                shadowColor: '#000000aa',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 5,
            },
            tabBarActiveTintColor: '#6366f1',
            tabBarInactiveTintColor: '#94a3b8',
            headerShown: false 
        }}>
            <Tabs.Screen 
                name="Home"
                options={{
                    title: "Home",
                    tabBarIcon: ({ color }) => <Ionicons name="home" size={28} color={color} />,
                }}
             />
             <Tabs.Screen
                name="Calendar"
                options={{
                    title: "Calendar",
                    tabBarIcon: ({ color }) => <Ionicons name="calendar" size={28} color={color} />,
                }}
             />
             <Tabs.Screen
                name="Budget"
                options={{
                    title: "Budget",
                    tabBarIcon: ({ color }) => <Ionicons name="cash" size={28} color={color} />,
                }}
             />
             <Tabs.Screen
                name="Chore"
                options={{
                    title: "Chore",
                    tabBarIcon: ({ color }) => <Ionicons name="list" size={28} color={color} />,
                }}
             />
             <Tabs.Screen
                name="Meals"
                options={{
                    title: "Meals",
                    tabBarIcon: ({ color }) => <Ionicons name="fast-food" size={28} color={color} />,
                }}
             />
            <Tabs.Screen 
                name="ManageJoinRequests"
                options={{
                    title: "Requests",
                    tabBarIcon: ({ color }) => <Ionicons name="people" size={28} color={color} />,
                }}
             />
        </Tabs>
    )
}
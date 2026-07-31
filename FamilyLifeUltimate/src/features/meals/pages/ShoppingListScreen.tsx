import BackButton from "@/src/globalComponents/BackButton";
import ErrorLoading from "@/src/globalComponents/ErrorLoading";
import ScreenHeader from "@/src/globalComponents/ScreenHeader";
import { ScrollView, View } from "react-native";
import { useAuth } from "../../auth/AuthContext";
import { useEffect, useState } from "react";
import AddButton from "@/src/globalComponents/AddButton";
import usePermissions from "@/src/utils/UsePermissions";
import { useFamily } from "../../family/FamilyContext";
import { getShoppingList, toggleItemPurchased } from "../services/meal.service";
import { ShoppingListItem } from "../meal.types";
import ShoppingListItemCard from "../components/ShoppingListItem";

const organizeItems = (shoppingItems: Record<number, ShoppingListItem>) => {
    return Object.values(shoppingItems).sort((a, b) => {
        if (a.purchased !== b.purchased) {
            return a.purchased ? 1 : -1;
        }
        if (!a.purchased) {
            const timeA = new Date(a.updatedAt).getTime();
            const timeB = new Date(b.updatedAt).getTime();
            return timeA - timeB;
        }
        if (a.purchased) {
            // Both purchased: sort by most recently updated at the top
            const timeA = new Date(a.updatedAt).getTime();
            const timeB = new Date(b.updatedAt).getTime();
            return timeB - timeA;
        } else {
            // Both unpurchased: sort alphabetically
            return a.item.localeCompare(b.item);
        }
    });
}

export default function ShoppingListScreen() {
    const { session } = useAuth();
    const { familyId } = useFamily();
    const canEditShopping = usePermissions('editShopping');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [addItem, setAddItem] = useState<boolean>(false);
    const [shoppingItems, setShoppingItems] = useState<Record<number, ShoppingListItem>>({});

    const loadItems = async () => {
        if (!session || !familyId) return;
        try {
            setLoading(true);
            const response = await getShoppingList(familyId, session);
            setShoppingItems(response);
        } catch (e) {
            setError(e instanceof Error ? e.message : "Failed to get recipes");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadItems();
    }, [session, familyId]);

    const togglePurchased = async (itemId: number) => {
        if (!session) return;
        try {
            await toggleItemPurchased(itemId, session);
            setShoppingItems((prevItems) => {
                const newItem = { ...prevItems[itemId] };
                newItem.purchased = !newItem.purchased;
                newItem.updatedAt = new Date();
                return { ...prevItems, [itemId]: newItem };
            });
        } catch (e) {
            setError(e instanceof Error ? e.message : "Failed to get recipes");
        }
    }

    return (
        <View className="flex-1 bg-background">
            <ScreenHeader title="Shopping List" subtitle="Manage Your Shopping List" />
            <BackButton
                className="w-12 h-12 
                bg-white border border-gray-100 rounded-full 
                items-center justify-center transition-colors
                absolute top-4 left-4 z-50
                shadow-sm
                "
            />
            <ErrorLoading error={error} loading={loading} />
            <ScrollView
                style={{ flex: 1 }}
            >
                {organizeItems(shoppingItems).map(item => (
                    <ShoppingListItemCard
                        key={item.id}
                        shoppingItem={item}
                        onToggle={togglePurchased}
                    />
                ))}
            </ScrollView>
            <AddButton
                onPress={() => { setAddItem(true) }}
                isVisible={canEditShopping}
                containerClassname="bg-blue-100 rounded-full absolute bottom-1 right-5 w-16 h-16 flex items-center justify-center shadow shadow-sm"
            />
        </View>
    );
}
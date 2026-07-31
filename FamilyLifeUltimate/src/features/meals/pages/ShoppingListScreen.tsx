import BackButton from "@/src/globalComponents/BackButton";
import ErrorLoading from "@/src/globalComponents/ErrorLoading";
import ScreenHeader from "@/src/globalComponents/ScreenHeader";
import { ScrollView, View } from "react-native";
import { useAuth } from "../../auth/AuthContext";
import { useEffect, useState } from "react";
import AddButton from "@/src/globalComponents/AddButton";
import usePermissions from "@/src/utils/UsePermissions";
import { useFamily } from "../../family/FamilyContext";
import { createShoppingItem, deleteShoppingItem, editShoppingItem, getShoppingList, toggleItemPurchased } from "../services/meal.service";
import { ShoppingListItem } from "../meal.types";
import ShoppingListItemCard from "../components/ShoppingListItem";
import DeleteShoppingModal from "../components/DeleteShoppingModal";
import UpdateShoppingListItems from "../components/UpdateShoppingListItems";

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
    const [editItem, setEditItem] = useState<boolean>(false);
    const [deleteItem, setDeleteItem] = useState<boolean>(false);
    const [selectedItem, setSelectedItem] = useState<ShoppingListItem | null>(null);

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
        setError("");
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

    const deletePressed = (itemId: number) => {
        setError("")
        const item = shoppingItems[itemId];
        setSelectedItem(item);
        setDeleteItem(true);
    }

    const confirmDelete = async () => {
        if (!session || !selectedItem) return;
        try {
            await deleteShoppingItem(selectedItem.id, session);
            setShoppingItems((prevItems) => {
                const { [selectedItem.id]: deletedItem, ...rest } = prevItems;
                return rest;
            });
        } catch (e) {
            setError(e instanceof Error ? e.message : "Failed to get recipes");
        } finally {
            setDeleteItem(false);
            setSelectedItem(null);
        }
    }

    const cancelDelete = () => {
        setDeleteItem(false);
        setSelectedItem(null);
    }

    const editPressed = (itemId: number) => {
        setError("")
        const item = shoppingItems[itemId];
        setSelectedItem(item);
        setEditItem(true);
    }

    const confirmEdit = async (id: number, quantity: number, unit: string, item: string) => {
        if (!session || !selectedItem) return;
        try {
            await editShoppingItem({id, quantity,unit,item}, session)
            setShoppingItems((prevItems) => {
                const newItem = { ...prevItems[id] };
                newItem.quantity = quantity;
                newItem.unit = unit;
                newItem.item = item;
                newItem.updatedAt = new Date();
                return { ...prevItems, [id]: newItem };
            });
        } catch (e) {
            setError(e instanceof Error ? e.message : "Failed to get recipes");
        } finally {
            setEditItem(false);
            setSelectedItem(null);
        }
    }

    const cancelEdit = () => {
        setEditItem(false);
        setSelectedItem(null);
    }

    const addPressed = () => {
        setError("");
        setSelectedItem(null);
        setAddItem(true);
    }

    const confirmAdd = async (familyId: string, quantity: number, unit: string, item: string) => {
        if (!session) return;
        try {
            const newItem = await createShoppingItem({familyId, quantity,unit,item}, session)
            setShoppingItems((prevItems) => { 
                return { ...prevItems, [newItem.id]: newItem };
            });
        } catch (e) {
            setError(e instanceof Error ? e.message : "Failed to get recipes");
        } finally {
            setAddItem(false)
        }
    }

    const cancelAdd = () => {
        setAddItem(false);
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
                        onEdit={editPressed}
                        onDelete={deletePressed}
                    />
                ))}
            </ScrollView>
            <AddButton
                onPress={addPressed}
                isVisible={canEditShopping}
                containerClassname="bg-blue-100 rounded-full absolute bottom-1 right-5 w-16 h-16 flex items-center justify-center shadow shadow-sm"
            />
            <DeleteShoppingModal
                isVisible={deleteItem}
                onConfirm={confirmDelete}
                onCancel={cancelDelete}
                item={selectedItem!}
            />
            <UpdateShoppingListItems
                isVisible={addItem}
                onConfirmCreate={confirmAdd}
                onCancel={cancelAdd}
            />
            <UpdateShoppingListItems
                isVisible={editItem}
                onConfirmEdit={confirmEdit}
                onCancel={cancelEdit}
                shoppingItem={selectedItem!}
            />
        </View>
    );
}
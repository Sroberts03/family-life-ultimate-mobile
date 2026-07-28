import { View, ScrollView } from "react-native";
import { useFamily } from "../../family/FamilyContext";
import { useAuth } from "../../auth/AuthContext";
import { RecipeBook } from "../meal.types";
import { useEffect, useState } from "react";
import { fetchRecipeBooks } from "../services/meal.service";
import { RecipeBookCard } from "../components/RecipeBookCard";
import ScreenHeader from "@/src/globalComponents/ScreenHeader";
import AddButton from "@/src/globalComponents/AddButton";
import ErrorLoading from "@/src/globalComponents/ErrorLoading";
import BackButton from "@/src/globalComponents/BackButton";
import { RelativePathString, router } from "expo-router";
import usePermissions from "@/src/utils/UsePermissions";
import CreateEditRecipeBook from "../components/CreateEditRecipeBook";
import DeleteRecipeBookModal from "../components/DeleteRecipeBookModal";

export default function ManageRecipesScreen() {
    const { session } = useAuth();
    const { familyId } = useFamily();
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [recipeBooks, setRecipeBooks] = useState<RecipeBook[]>([]);
    const [editRecipeBook, setEditRecipeBook] = useState<boolean>(false);
    const [editRecipeBookName, setEditRecipeBookName] = useState<string>("");
    const [editRecipeBookId, setEditRecipeBookId] = useState<number | undefined>(undefined);
    const [deleteModal, setDeleteModal] = useState<boolean>(false);
    const canEditResult: boolean = usePermissions('recipes');

    async function loadRecipeBooks() {
        if (!familyId || !session) return;
        setLoading(true);
        setError("");
        try {
            const recipeBooks = await fetchRecipeBooks(familyId, session);
            setRecipeBooks(recipeBooks);
        } catch (e) {
            setError(e instanceof Error ? e.message : "Failed to get recipes");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadRecipeBooks();
    }, [familyId]);

    const recipeBookPressed = (recipeBookId: number) => {
        router.push({ pathname: '/Recipes' as RelativePathString, params: { recipeBookId: recipeBookId } });
    }

    const addRecipeBookPressed = () => {
        setEditRecipeBook(true);
        setEditRecipeBookId(undefined);
        setEditRecipeBookName("");
    } 

    const deleteRecipeBookClicked = () => {
        setDeleteModal(true);
        setError("")
    }

    return (
        <View className="flex-1 bg-background">
            <ScreenHeader title="Recipe Books" subtitle="Manage Recipe Books" />
            <BackButton
                className="w-12 h-12 
                bg-white border border-gray-100 rounded-full 
                items-center justify-center transition-colors
                absolute top-4 left-4 z-50
                shadow-sm
                "
            />
            <ErrorLoading error={error} loading={loading} />
            <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
                <View className="flex-row flex-wrap px-1 pt-4">
                    {recipeBooks.map((recipeBook) => (
                        <RecipeBookCard
                            key={recipeBook.id}
                            recipeBook={recipeBook}
                            onPress={recipeBookPressed}
                            setDeleteModal={deleteRecipeBookClicked}
                            setEditRecipeBookModal={setEditRecipeBook}
                            setEditRecipeBookId={setEditRecipeBookId}
                            setEditRecipeBookName={setEditRecipeBookName}
                        />
                    ))}
                </View>
            </ScrollView>
            <AddButton
                onPress={addRecipeBookPressed}
                isVisible={canEditResult}
                containerClassname="bg-blue-100 rounded-full absolute bottom-1 right-5 w-16 h-16 flex items-center justify-center shadow shadow-sm"
            />
            <CreateEditRecipeBook
                visible={editRecipeBook}
                setVisible={setEditRecipeBook}
                setEditRecipeBookId={setEditRecipeBookId}
                setEditRecipeBookName={setEditRecipeBookName}
                id={editRecipeBookId}
                name={editRecipeBookName}
                setRecipeBooks={setRecipeBooks}
                books={recipeBooks}
            />
            <DeleteRecipeBookModal
                recipeBookId={editRecipeBookId}
                showModal={deleteModal}
                setShowModal={setDeleteModal}
                recipeBooks={recipeBooks}
                setRecipeBooks={setRecipeBooks}
                setError={setError}
            />
        </View>
    );
}
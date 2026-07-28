import { useEffect, useState } from "react";
import { 
    Modal,
    Text, 
    TextInput, 
    TouchableOpacity, 
    View,
    TouchableWithoutFeedback,
    KeyboardAvoidingView,
    Keyboard,
    Platform 
} from "react-native";
import ErrorLoading from "@/src/globalComponents/ErrorLoading";
import { saveRecipeBook, createRecipeBook } from "../services/meal.service";
import { RecipeBook } from "../meal.types";
import { useAuth } from "../../auth/AuthContext";
import { useFamily } from "../../family/FamilyContext";

interface CreateEditRecipeBookProps {
    visible: boolean;
    setVisible: (visible: boolean) => void;
    setEditRecipeBookName: (name: string) => void;
    setEditRecipeBookId: (id: number | undefined) => void;
    books: RecipeBook[],
    setRecipeBooks: (books: RecipeBook[]) => void,
    name?: string;
    id?: number;
}

export default function CreateEditRecipeBook({ 
    name, 
    id, 
    visible, 
    setVisible, 
    setEditRecipeBookId, 
    setEditRecipeBookName,
    books,
    setRecipeBooks }: CreateEditRecipeBookProps) {
    const { session } = useAuth();
    const { familyId } = useFamily();
    const [bookName, setBookName] = useState<string>(name || "");
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        if (visible) {
            setBookName(name || "");
        }
    }, [visible, name]);

    const reset = () => {
        setEditRecipeBookId(undefined);
        setEditRecipeBookName("");
        setBookName("");
        setVisible(false);
        setError("");
        setLoading(false);
    }

    const saveBook = async () => {
        if (!session) return;
        if (!bookName.trim()) {
            setError("Recipe book name cannot be empty");
            return;
        }
        setLoading(true);
        setError("");
        try {
            if (id) {
                const book = await saveRecipeBook({name: bookName.trim(), id}, session);
                setRecipeBooks(books.map((b) => b.id === id ? book : b));
            }
            else if (!id) {
                const book = await createRecipeBook({familyId, name: bookName.trim()}, session);
                setRecipeBooks([...books, book]);
            }
            reset();
        } catch (e) {
            setError(e instanceof Error ? e.message : "Failed to save recipe book");
        } finally {
            setLoading(false);
        }
    }

    const cancel = () => {
        reset();
    }

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={cancel}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View className="flex-1 justify-center items-center bg-black/50 px-5">
                    <KeyboardAvoidingView
                        behavior={Platform.OS === "ios" ? "padding" : "height"}
                        className="w-full"
                    >
                        <View className="bg-white rounded-3xl p-6 w-full max-h-[90vh] shadow-xl">
                            <View className="flex-row justify-between items-center mb-6">
                                <Text className="text-2xl font-bold text-gray-800">
                                    {id ? "Edit Recipe Book" : "New Recipe Book"}
                                </Text>
                            </View>
                            <ErrorLoading error={error} loading={loading} />
                            <View className="flex-col gap-5 pb-8">
                                {/* Name Input */}
                                <View>
                                    <Text className="text-sm font-medium text-gray-700 mb-1.5 ml-1">Recipe Book Name</Text>
                                    <TextInput
                                        className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-base text-gray-800"
                                        placeholder="e.g. Grandma's Recipes"
                                        value={bookName}
                                        onChangeText={setBookName}
                                        placeholderTextColor="#9ca3af"
                                    />
                                </View>
                            </View>

                            <View className="flex-row mt-2 gap-3 pt-4 border-t border-gray-100">
                                <TouchableOpacity
                                    onPress={cancel}
                                    className="flex-1 py-4 rounded-xl bg-gray-100 items-center justify-center"
                                >
                                    <Text className="text-gray-700 font-bold text-base">Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={saveBook}
                                    className={`flex-1 py-4 rounded-xl items-center justify-center ${bookName.trim() ? 'bg-blue-600' : 'bg-blue-300'}`}
                                    disabled={!bookName.trim()}
                                >
                                    <Text className="text-white font-bold text-base">{id ? "Update" : "Create"}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </KeyboardAvoidingView>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    )
}
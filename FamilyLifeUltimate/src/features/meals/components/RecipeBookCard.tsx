import { View, Text, TouchableOpacity, useWindowDimensions } from 'react-native';
import { RecipeBook } from '../meal.types';
import { Feather } from '@expo/vector-icons';
import usePermissions from '@/src/utils/UsePermissions';
import { useState } from 'react';
import RecipeEditActionButtons from './RecipeEditActionButtons';

interface RecipeBookCardProps {
    setDeleteModal: (show: boolean) => void;
    setEditRecipeBookModal: (show: boolean) => void;
    setEditRecipeBookName: (name: string) => void;
    setEditRecipeBookId: (id: number | undefined) => void;
    recipeBook: RecipeBook;
    onPress: (recipeBookId: number) => void;
}

export function RecipeBookCard({ recipeBook, onPress, setDeleteModal, setEditRecipeBookModal, setEditRecipeBookId, setEditRecipeBookName }: RecipeBookCardProps) {
    const { width } = useWindowDimensions();
    const cardWidth = (width - 24 - 16) / 2;
    const canEditResult: boolean = usePermissions('recipes');

    const editRecipeBook = () => {
        setEditRecipeBookId(recipeBook.id);
        setEditRecipeBookName(recipeBook.name);
        setEditRecipeBookModal(true);
    }

    const deleteRecipeBook = () => {
        setDeleteModal(true);
        setEditRecipeBookId(recipeBook.id);
    }

    return (
        <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => onPress(recipeBook.id)}
            style={{
                width: cardWidth,
                height: cardWidth * 1.35,
                shadowColor: '#000',
                shadowOffset: { width: 4, height: 4 },
                shadowOpacity: 0.08,
                shadowRadius: 8,
                elevation: 4
            }}
            className="flex-row rounded-r-xl rounded-l-md bg-surface overflow-hidden m-2 border border-gray-200/60"
        >
            {/* Spine */}
            <View className="w-5 h-full bg-primary justify-between items-center py-4 border-r border-black/10">
                <View className="w-[2px] h-6 rounded-full bg-white/30" />
                <View className="w-[2px] h-6 rounded-full bg-white/30" />
            </View>

            {/* Cover */}
            <View className="flex-1 p-3 justify-between bg-surface">
                <View>
                    <View className="flex-row justify-between">
                        <Text
                            className="text-sm font-bold text-slate-800 leading-tight mt-2 flex-1 mr-2"
                            numberOfLines={3}
                        >
                            {recipeBook.name}
                        </Text>
                        <RecipeEditActionButtons
                            setDeleteModal={deleteRecipeBook}
                            setEditRecipeBookModal={editRecipeBook}
                            flexDirection={"column"}
                        />
                    </View>
                </View>

                <View className="pt-2">
                    <Text className="text-[9px] text-slate-400 uppercase tracking-widest font-semibold mb-0.5">
                        Added
                    </Text>
                    <Text className="text-xs text-slate-500">
                        {new Date(recipeBook.createdAt).toLocaleDateString()}
                    </Text>
                </View>
            </View>

            {/* Inner Page Edge Illusion */}
            <View className="absolute right-0 top-0 bottom-0 w-1 bg-gray-100/40 border-l border-gray-200/30" />
        </TouchableOpacity>
    );
}

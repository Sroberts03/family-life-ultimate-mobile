import { View, Text, TouchableOpacity, useWindowDimensions } from 'react-native';
import { RecipeBook } from '../meal.types';
import { Feather } from '@expo/vector-icons';

interface RecipeBookCardProps {
    recipeBook: RecipeBook;
    onPress?: () => void;
}

export function RecipeBookCard({ recipeBook, onPress }: RecipeBookCardProps) {
    const { width } = useWindowDimensions();
    // Assuming 2 columns, padding horizontally is 24 (12 * 2), gap is 16
    const cardWidth = (width - 24 - 16) / 2;

    return (
        <TouchableOpacity
            activeOpacity={0.8}
            onPress={onPress}
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
            <View className="flex-1 p-3.5 justify-between bg-surface">
                <View>
                    <View className="w-8 h-8 rounded-full bg-primary/10 items-center justify-center mb-3">
                        <Feather name="book" size={14} color="#6366f1" />
                    </View>
                    <Text className="text-sm font-bold text-slate-800 leading-tight mb-1" numberOfLines={3}>
                        {recipeBook.name}
                    </Text>
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

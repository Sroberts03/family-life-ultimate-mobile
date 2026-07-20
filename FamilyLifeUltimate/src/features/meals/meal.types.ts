export enum MealType {
    BREAKFAST = "BREAKFAST",
    LUNCH = "LUNCH",
    DINNER = "DINNER",
    SNACK = "SNACK",
    OTHER = "OTHER"
}

export interface RecipeBook {
    id: number;
    name: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Recipe {
    id: number;
    recipeBookId: number;
    name: string;
    description: string;
    ingredients: string;
    instructions: string;
    prepTime: number;
    cookTime: number;
    servings: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface ShoppingListItem {
    id: number;
    familyId: number;
    quantity: number;
    unit: string;
    item: string;
    purchased: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface MealPlanItem {
    id: number;
    familyId: number;
    recipeId: number;
    name: string;
    date: Date;
    time: Date;
    mealType: MealType;
    createdAt: Date;
    updatedAt: Date;
}
    
import { MealPlanItem } from "../meal.types";

export interface UpdateMealPlanItemReq {
    mealPlanItemId: number;
    familyId: string;
    mealType: string;
    name: string;
    recipeId?: number;
    date: string;
    time: string;
}

export interface UpdateMealPlanItemRes {
    mealPlanItem: MealPlanItem;
}
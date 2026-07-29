import { MealPlanItem, MealType } from "../meal.types";

export interface CreateMealPlanItemReq {
    date: string;
    time: string;
    mealType: MealType;
    recipeId?: number;
    familyId: string;
    name: string;
}

export interface CreateMealPlanItemRes {
    mealPlan: MealPlanItem;
}
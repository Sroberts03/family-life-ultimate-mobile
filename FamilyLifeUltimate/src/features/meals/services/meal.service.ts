import { Session } from "@supabase/supabase-js";
import HTTPRequest from "../../../utils/baseHTTPRequest";
import { GetMealPlansDto } from "../dto/GetMealPlansDto";
import { MealPlanItem, Recipe, RecipeBook } from "../meal.types";
import { GetRecipeResDto } from "../dto/GetRecipeResDto";
import GetRecipeBooksDto from "../dto/GetRecipeBooksDto";

export async function fetchMealPlans(familyId: string, date: string, session: Session): Promise<MealPlanItem[]> {
    const response: GetMealPlansDto = await HTTPRequest("GET", `meals/get-all-meal-plans-date?familyId=${familyId}&date=${date}`, true, session);
    return response.mealPlans;
}

export async function fetchRecipeDetail(recipeId: number, session: Session): Promise<Recipe> {
    const response: GetRecipeResDto = await HTTPRequest("GET", `meals/get-recipe-detail?recipeId=${recipeId}`, true, session);
    return response.recipe;
}

export async function fetchRecipeBooks(familyId: string, session: Session): Promise<RecipeBook[]> {
    const response: GetRecipeBooksDto = await HTTPRequest("GET", `meals/get-recipe-books?familyId=${familyId}`, true, session);
    return response.recipeBooks;
}

    
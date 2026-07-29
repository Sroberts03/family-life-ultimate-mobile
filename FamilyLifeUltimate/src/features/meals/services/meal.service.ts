import { Session } from "@supabase/supabase-js";
import HTTPRequest from "../../../utils/baseHTTPRequest";
import { GetMealPlansDto } from "../dto/GetMealPlansDto";
import { MealPlanItem, Recipe, RecipeBook } from "../meal.types";
import { GetRecipeResDto } from "../dto/GetRecipeResDto";
import GetRecipeBooksDto from "../dto/GetRecipeBooksDto";
import { GetRecipesDto } from "../dto/GetRecipesDto";
import { UpdateRecipeReqDto, UpdateRecipeResDto } from "../dto/CreateRecipeDto";
import { CreateRecipeBookReqDto, UpdateRecipeBookReqDto, UpdateRecipeBookResDto } from "../dto/CreateRecipeBookDto";
import { CreateMealPlanItemReq, CreateMealPlanItemRes } from "../dto/MealPlanDto";
import { UpdateMealPlanItemReq, UpdateMealPlanItemRes } from "../dto/UpdateMealPlanItemDto";

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

export async function fetchRecipes(recipeBookId: number, session: Session): Promise<Recipe[]> {
    const response: GetRecipesDto = await HTTPRequest("GET", `meals/get-recipes?recipeBookId=${recipeBookId}`, true, session);
    return response.recipes;
}

export async function saveRecipeBook(updateReq: UpdateRecipeBookReqDto, session: Session): Promise<RecipeBook> {
    const response: UpdateRecipeBookResDto = await HTTPRequest("PUT", `meals/update-recipe-book`, true, session, updateReq);
    return response.recipeBook;
}

export async function createRecipeBook(createReq: CreateRecipeBookReqDto, session: Session): Promise<RecipeBook> {
    const response: UpdateRecipeBookResDto = await HTTPRequest("POST", `meals/create-recipe-book`, true, session, createReq);
    return response.recipeBook;
}

export async function deleteRecipeBook(recipeBookId: number, session: Session): Promise<void> {
    await HTTPRequest("DELETE", `meals/delete-recipe-book?recipeBookId=${recipeBookId}`, true, session);
}

export async function createRecipe(req: UpdateRecipeReqDto, session: Session): Promise<Recipe> {
    const response: UpdateRecipeResDto = await HTTPRequest("POST", `meals/create-recipe`, true, session, req);
    return response.recipe;
}

export async function updateRecipe(req: UpdateRecipeReqDto, session: Session): Promise<Recipe> {
    const response: UpdateRecipeResDto = await HTTPRequest("PUT", `meals/update-recipe`, true, session, req);
    return response.recipe;
}

export async function deleteRecipe(recipeId: number, session: Session): Promise<void> {
    await HTTPRequest("DELETE", `meals/delete-recipe?recipeId=${recipeId}`, true, session);
}

export async function createMealPlanItem(req: CreateMealPlanItemReq, session: Session): Promise<MealPlanItem> {
    const response: CreateMealPlanItemRes = await HTTPRequest("POST", `meals/create-meal-plan-item`, true, session, req);
    return response.mealPlan;
}

export async function fetchAllRecipesForFamily(familyId: string, session: Session): Promise<Recipe[]> {
    const response: GetRecipesDto = await HTTPRequest("GET", `meals/get-all-recipes-for-family?familyId=${familyId}`, true, session);
    return response.recipes;
}

export async function searchRecipesForFamily(familyId: string, searchQuery: string, session: Session): Promise<Recipe[]> {
    const response: GetRecipesDto = await HTTPRequest("GET", `meals/search-recipes-for-family?familyId=${familyId}&searchQuery=${searchQuery}`, true, session);
    return response.recipes;
}

export async function searchRecipes(recipeBookId: number, searchQuery: string, session: Session): Promise<Recipe[]> {
    const response: GetRecipesDto = await HTTPRequest("GET", `meals/search-recipes?recipeBookId=${recipeBookId}&searchQuery=${searchQuery}`, true, session);
    return response.recipes;
}

export async function updateMealPlanItem(req: UpdateMealPlanItemReq, session: Session): Promise<MealPlanItem> {
    const response: UpdateMealPlanItemRes = await HTTPRequest("PUT", `meals/update-meal-plan-item`, true, session, req);
    return response.mealPlanItem;
}

export async function deleteMealPlan(mealPlanId: number, session: Session): Promise<void> {
    await HTTPRequest("DELETE", `meals/delete-meal-plan?mealPlanId=${mealPlanId}`, true, session);
}
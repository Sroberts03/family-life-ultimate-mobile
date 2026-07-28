import { RecipeBook } from "../meal.types";

export interface CreateRecipeBookReqDto {
    familyId: string;
    name: string;
}

export interface UpdateRecipeBookReqDto {
    name: string;
    id: number;
}

export interface UpdateRecipeBookResDto {
    recipeBook: RecipeBook;
}
    

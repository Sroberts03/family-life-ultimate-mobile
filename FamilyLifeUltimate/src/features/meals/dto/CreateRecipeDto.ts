import { Recipe, RecipeIngredient, RecipeStep } from "../meal.types";

export interface UpdateRecipeReqDto {
    id?: number;
    recipeBookId?: number;
    name?: string;
    description?: string;
    url?: string;
}

export interface UpdateRecipeResDto {
    recipe: Recipe;
}

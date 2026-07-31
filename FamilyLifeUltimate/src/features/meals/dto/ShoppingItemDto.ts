import { ShoppingListItem } from "../meal.types";

export interface CreateShoppingItemReq {
    familyId: string;
    quantity: number;
    unit: string;
    item: string;
}

export interface CreateShoppingResDto {
    shoppingItem: ShoppingListItem;
}

export interface UpdateShoppingItemReq {
    id: number;
    quantity: number;
    unit: string;
    item: string;
}

export interface UpdateShoppingResDto {
    shoppingItem: ShoppingListItem;
}

export interface GetShoppingListResDto {
    shoppingItems: Record<number, ShoppingListItem>;
}
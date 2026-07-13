import { Chore } from "../chore.types";

export default interface GetAllChoresResDto {
    chores: Record<number, Chore>;
}

export interface Chore {
    id: number;
    name: string;
    description?: string;
    dueDate: Date;
    dateCompleted?: Date;
    assigneeIds?: Set<string>;
    assigneeNames?: string[];
}
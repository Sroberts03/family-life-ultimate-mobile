
export interface Chore {
    id: number;
    name: string;
    description?: string;
    dueDate: Date;
    dateCompleted?: Date;
    assigneeIds?: string[];
    assigneeNames?: string[];
}
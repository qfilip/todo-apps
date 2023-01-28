import { ITodoEvent } from "./ITodoEvents";

export interface ICommit {
    id: string;
    branchId: string;
    events: ITodoEvent[];
    createdAt: Date;
}
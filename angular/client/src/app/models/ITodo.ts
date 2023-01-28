import { eEntityState } from "./enums";
import { ITodoEvent } from "./ITodoEvents";

export interface ITodo {
    id: string;
    title: string;
    details: string;
    dueDate: Date;
}

export interface ITodoStatePreview {
    todo: ITodo;
    state: eEntityState;
}

export interface ITodoDiffs {
    related: { local: ITodoStatePreview, remote: ITodoStatePreview }[],
    unrelated: ITodoStatePreview[];
}

export interface ITodoEventMap {
    todoId: string;
    events: ITodoEvent[];
}
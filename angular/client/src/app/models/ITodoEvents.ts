import { eTodoEventType } from "./enums";
import { ITodo } from "./ITodo";

export interface ITodoEvent {
    id: string;
    type: eTodoEventType;
    createdAt: Date;
}

export interface ITodoCreated extends ITodoEvent {
    todo: ITodo;
}

export interface ITodoDeleted extends ITodoEvent {
    todoId: string;
}

export interface ITodoTitleChanged extends ITodoEvent {
    todoId: string;
    title: string;
}

export interface ITodoDetailsChanged extends ITodoEvent {
    todoId: string;
    details: string;
}

export interface ITodoDueDateChanged extends ITodoEvent {
    todoId: string;
    dueDate: Date;
}
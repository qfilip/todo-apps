import type { ITodo } from "./models";

export type ModalName = 'viewChanges' | 'addTodo' | 'editTodo';

export interface IModalOptions {
    open: boolean;
    name: ModalName;
    data: ITodo;
}

export interface IPageloaderOptions {
    open: boolean;
    message?: string;
    progress?: number;
}
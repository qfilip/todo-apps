import type { ITodo } from "./models";

export type ModalName = 'viewChanges' | 'addTodo' | 'editTodo';

export interface IModalOptions {
    open: boolean;
    name: ModalName;
    data: ITodo;
}
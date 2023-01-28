export enum eTodoEventType
{
    Created,
    Modified,
    Deleted
}

export interface ITodo {
    id: string;
    title: string;
    createdAt: Date;
    modifiedAt: Date;
}

export interface ITodoEvent {
    id: string;
    data: ITodo
    type: eTodoEventType;
    createdAt: Date;
}

// requests
export interface IAddTodoRequest {
    todoTitle: string;
}

export interface IEditTodoRequest {
    todoId: string;
    todoTitle: string;
}

export interface IRemoveTodoRequest {
    todoId: string;
}

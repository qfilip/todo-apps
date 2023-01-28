import { eTodoEventType, IAddTodoRequest, IEditTodoRequest, IRemoveTodoRequest, ITodo, ITodoEvent } from "./models";
import { pageloaderOptions } from './stores';

const url = `http://localhost:5000/events`;
const headersJson = { 'Content-Type': 'application/json' };

export function getAllEvents() {
    pageloaderOptions.set({ open: true });

    return fetch(url).then(r => {
        pageloaderOptions.set({ open: false });
        return r.json();
    }) as Promise<ITodoEvent[]>;
}

export function addTodoEventRequest(req: IAddTodoRequest) {
    const data = {
        id: createId(),
        title: req.todoTitle
    } as ITodo;
    
    return post(data, eTodoEventType.Created);
}

export function editTodoEventRequest(req: IEditTodoRequest) {
    const data = {
        id: req.todoId,
        title: req.todoTitle
    } as ITodo;
    
    return post(data, eTodoEventType.Modified);
}

export function removeTodoEventRequest(req: IRemoveTodoRequest) {
    const data = { id: req.todoId } as ITodo;
    return post(data, eTodoEventType.Deleted);
}

function post(data: ITodo, type: eTodoEventType) {
    pageloaderOptions.set({ open: true });
    
    const request: ITodoEvent = {
        id: createId(),
        data: data,
        type: type,
        createdAt: new Date()
    }

    return fetch(url, {
        method: 'POST',
        headers: headersJson,
        body: JSON.stringify(request)
      }).then(r => {
        pageloaderOptions.set({ open: false })
        return r.json();
      }) as Promise<ITodoEvent>;
}

function createId() {
    return Math.random().toString(16).substr(2, 8);
}